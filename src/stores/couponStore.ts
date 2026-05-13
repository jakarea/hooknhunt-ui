import { create } from 'zustand';
import api from '@/lib/api';
import { AppliedCoupon, AutoApplyCoupon } from '@/types/coupon';

interface CouponState {
  appliedCoupon: AppliedCoupon | null;
  autoApplyCoupons: AutoApplyCoupon[];
  isValidating: boolean;
  isFetchingAutoApply: boolean;
  error: string | null;

  validateAndApply: (code: string, cartTotal: number, productIds?: number[], categoryIds?: number[]) => Promise<boolean>;
  removeCoupon: () => void;
  fetchAutoApplyCoupons: (cartTotal: number, productIds?: number[], categoryIds?: number[]) => Promise<void>;
  clearError: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  appliedCoupon: null,
  autoApplyCoupons: [],
  isValidating: false,
  isFetchingAutoApply: false,
  error: null,

  validateAndApply: async (code: string, cartTotal: number, productIds?: number[], categoryIds?: number[]): Promise<boolean> => {
    set({ isValidating: true, error: null });

    try {
      const response = await api.validateCoupon(code, cartTotal, productIds, categoryIds) as Record<string, unknown>;
      const data = (response?.data ?? response) as Record<string, unknown>;

      if (!data) {
        set({ isValidating: false, error: 'Invalid response from server' });
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

      set({ appliedCoupon, isValidating: false, error: null });
      return true;
    } catch (error: unknown) {
      const apiError = error as { message?: string; response?: { data?: { message?: string } } };
      const errorMessage = apiError.response?.data?.message ?? apiError.message ?? 'Failed to validate coupon';
      set({
        isValidating: false,
        error: errorMessage as string,
      });
      return false;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, error: null });
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
    set({ error: null });
  },
}));
