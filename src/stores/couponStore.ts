import { create } from 'zustand';
import api from '@/lib/api';
import { AppliedCoupon, AutoApplyCoupon } from '@/types/coupon';

interface ValidationErrors {
  code?: string[];
  subtotal?: string[];
  general?: string[];
}

interface CouponState {
  appliedCoupon: AppliedCoupon | null;
  autoApplyCoupons: AutoApplyCoupon[];
  isValidating: boolean;
  isFetchingAutoApply: boolean;
  error: string | null;
  validationErrors: ValidationErrors;

  validateAndApply: (code: string, cartTotal: number, productIds?: number[], categoryIds?: number[]) => Promise<boolean>;
  removeCoupon: () => void;
  fetchAutoApplyCoupons: (cartTotal: number, productIds?: number[], categoryIds?: number[]) => Promise<void>;
  clearError: () => void;
  clearValidationErrors: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  appliedCoupon: null,
  autoApplyCoupons: [],
  isValidating: false,
  isFetchingAutoApply: false,
  error: null,
  validationErrors: {},

  validateAndApply: async (code: string, cartTotal: number, productIds?: number[], categoryIds?: number[]): Promise<boolean> => {
    set({ isValidating: true, error: null, validationErrors: {} });

    try {
      const response = await api.validateCoupon(code, cartTotal, productIds, categoryIds) as Record<string, unknown>;
      const data = (response?.data ?? response) as Record<string, unknown>;

      if (!data) {
        set({ isValidating: false, error: 'Invalid response from server', validationErrors: {} });
        return false;
      }

      const appliedCoupon: AppliedCoupon = {
        code: data.code as string,
        description: (data.description as string | undefined) ?? undefined,
        type: data.discount_type === 'percentage' || data.discount_type === 'fixed_amount' || data.discount_type === 'shipping'
          ? data.discount_type as AppliedCoupon['type']
          : 'fixed_amount',
        value: data.discount_value as number,
        maxDiscountAmount: (data.max_discount_amount as number | null) ?? null,
        discountAmount: data.discount_amount as number,
        minPurchaseAmount: (data.min_purchase_amount as number) ?? 0,
        finalTotal: data.final_total as number,
      };

      set({ appliedCoupon, isValidating: false, error: null, validationErrors: {} });
      return true;
    } catch (error: unknown) {
      const apiError = error as {
        message?: string;
        response?: {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
        };
      };

      // Check for field-specific validation errors
      const errors = apiError.response?.data?.errors;
      const generalMessage = apiError.response?.data?.message ?? apiError.message ?? 'Failed to validate coupon';

      const validationErrors: ValidationErrors = {};

      if (errors) {
        // Map backend field names to our validation errors
        if (errors.code) validationErrors.code = errors.code;
        if (errors.subtotal) validationErrors.subtotal = errors.subtotal;

        // If there are no specific field errors but there's a general message
        if (!validationErrors.code && !validationErrors.subtotal) {
          validationErrors.general = [generalMessage as string];
        }
      } else {
        // No structured errors, use general message
        validationErrors.general = [generalMessage as string];
      }

      set({
        isValidating: false,
        error: validationErrors.general?.[0] || generalMessage as string,
        validationErrors,
      });
      return false;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, error: null, validationErrors: {} });
  },

  fetchAutoApplyCoupons: async (cartTotal: number, productIds?: number[], categoryIds?: number[]): Promise<void> => {
    const { isFetchingAutoApply } = get();
    if (isFetchingAutoApply) return;

    set({ isFetchingAutoApply: true });

    try {
      const response = await api.getAutoApplyCoupons(cartTotal, productIds, categoryIds) as Record<string, unknown>;
      const data = response?.data ?? response;

      if (Array.isArray(data)) {
        set({ autoApplyCoupons: data as AutoApplyCoupon[], isFetchingAutoApply: false });
      } else {
        set({ autoApplyCoupons: [], isFetchingAutoApply: false });
      }
    } catch {
      set({ autoApplyCoupons: [], isFetchingAutoApply: false });
    }
  },

  clearError: () => {
    set({ error: null, validationErrors: {} });
  },

  clearValidationErrors: () => {
    set({ validationErrors: {} });
  },
}));
