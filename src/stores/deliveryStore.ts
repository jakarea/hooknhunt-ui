import { create } from 'zustand';
import api from '@/lib/api';
import type {
  DeliverySettings,
  DeliveryBreakdown,
  DeliveryCalculationParams,
  DeliveryState,
  DeliveryMode,
} from '@/types/delivery';

interface DeliveryActions {
  // Settings
  fetchSettings: () => Promise<void>;
  clearSettingsError: () => void;

  // Calculation
  calculateCharge: (params: DeliveryCalculationParams) => Promise<void>;
  clearCalculationError: () => void;
  resetCalculation: () => void;

  // Getters
  getDeliveryMode: () => DeliveryMode;
  isFreeDelivery: () => boolean;
  isProgressiveDelivery: () => boolean;
}

type DeliveryStore = DeliveryState & DeliveryActions;

// Debounce timer
let debounceTimer: NodeJS.Timeout | null = null;

export const useDeliveryStore = create<DeliveryStore>((set, get) => ({
  // Initial state
  settings: null,
  settingsLoading: false,
  settingsError: null,

  charge: 0,
  breakdown: null,
  calculating: false,
  calculationError: null,
  lastCalculation: null,

  // Fetch delivery settings from API
  fetchSettings: async () => {
    const { settings } = get();

    // Return early if settings are already loaded
    if (settings) {
      return;
    }

    set({ settingsLoading: true, settingsError: null });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://hooknhunt-api.test/api/v2'}/public/delivery-settings`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (data?.data) {
        set({
          settings: data.data,
          settingsLoading: false,
          settingsError: null,
        });
      } else {
        throw new Error(data?.message || 'Failed to fetch delivery settings');
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch delivery settings';
      set({
        settings: null,
        settingsLoading: false,
        settingsError: message,
      });
      console.error('[Delivery Store] Failed to fetch settings:', error);
    }
  },

  // Clear settings error
  clearSettingsError: () => {
    set({ settingsError: null });
  },

  // Calculate delivery charge with debouncing
  calculateCharge: async (params: DeliveryCalculationParams) => {
    const { lastCalculation, settings } = get();

    // Check if calculation params are the same (cache hit)
    if (
      lastCalculation &&
      lastCalculation.weight === params.weight &&
      lastCalculation.division === params.division &&
      lastCalculation.orderAmount === (params.order_amount || 0)
    ) {
      return; // Already calculated with same params
    }

    // Clear any existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set debounced calculation
    debounceTimer = setTimeout(async () => {
      set({ calculating: true, calculationError: null });

      try {
        const response = await api.calculateDeliveryCharge({
          weight: params.weight,
          division: params.division,
          order_amount: params.order_amount,
        });

        if (response?.data) {
          const charge = Number(response.data.charge) || 0;
          const breakdown = response.data.breakdown as DeliveryBreakdown | null;

          set({
            charge,
            breakdown,
            calculating: false,
            calculationError: null,
            lastCalculation: {
              weight: params.weight,
              division: params.division,
              orderAmount: params.order_amount || 0,
            },
          });
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to calculate delivery charge';
        set({
          charge: 0,
          breakdown: null,
          calculating: false,
          calculationError: message,
        });
        console.error('[Delivery Store] Calculation failed:', error);
      }
    }, 300); // 300ms debounce
  },

  // Clear calculation error
  clearCalculationError: () => {
    set({ calculationError: null });
  },

  // Reset calculation state
  resetCalculation: () => {
    set({
      charge: 0,
      breakdown: null,
      calculating: false,
      calculationError: null,
      lastCalculation: null,
    });
  },

  // Get current delivery mode
  getDeliveryMode: () => {
    const { settings } = get();
    // API returns camelCase, so check both for compatibility
    return settings?.deliveryMode || settings?.delivery_mode || 'standard';
  },

  // Check if delivery is free
  isFreeDelivery: () => {
    const { settings, breakdown } = get();
    const mode = settings?.deliveryMode || settings?.delivery_mode || 'standard';

    // Free delivery mode
    if (mode === 'free_delivery') {
      return true;
    }

    // Progressive delivery with 100% discount (check camelCase from API)
    const progressive = breakdown?.progressiveDelivery || breakdown?.progressive_delivery;
    if (mode === 'progressive_delivery' && progressive?.isFree) {
      return true;
    }

    return false;
  },

  // Check if progressive delivery is enabled
  isProgressiveDelivery: () => {
    const { settings } = get();
    const mode = settings?.deliveryMode || settings?.delivery_mode || 'standard';
    const progressive = settings?.progressiveDelivery || settings?.progressive_delivery;
    return mode === 'progressive_delivery' || progressive?.enabled || false;
  },
}));
