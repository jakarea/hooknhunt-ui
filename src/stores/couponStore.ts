import { create } from 'zustand';
import api from '@/lib/api';
import { AppliedCoupon, AutoApplyCoupon } from '@/types/coupon';

interface CouponState {
  appliedCoupon: AppliedCoupon | null;
  autoApplyCoupons: AutoApplyCoupon[];
  isValidating: boolean;
  isFetchingAutoApply: boolean;
  error: string | null;

  validateAndApply: (code: string, cartTotal: number) => Promise<boolean>;
  removeCoupon: () => void;
  fetchAutoApplyCoupons: (cartTotal: number) => Promise<void>;
  clearError: () => void;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  appliedCoupon: null,
  autoApplyCoupons: [],
  isValidating: false,
  isFetchingAutoApply: false,
  error: null,

  validateAndApply: async (code: string, cartTotal: number): Promise<boolean> => {
    set({ isValidating: true, error: null });

    try {
      const response = await api.validateCoupon(code, cartTotal) as Record<string, unknown>;
      const data = (response?.data ?? response) as Record<string, unknown>;

      if (!data) {
        set({ isValidating: false, error: 'Invalid response from server' });
        return false;
      }

      const appliedCoupon: AppliedCoupon = {
        code: data.code as string,
        type: data.type as AppliedCoupon['type'],
        value: data.amount as number,
        maxDiscountAmount: (data.maxDiscountAmount as number | null) ?? null,
        discountAmount: data.discountAmount as number,
        finalTotal: data.finalTotal as number,
      };

      set({ appliedCoupon, isValidating: false, error: null });
      return true;
    } catch (error: unknown) {
      const apiError = error as { message?: string };
      set({
        isValidating: false,
        error: apiError.message || 'Failed to validate coupon',
      });
      return false;
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, error: null });
  },

  fetchAutoApplyCoupons: async (cartTotal: number): Promise<void> => {
    const { isFetchingAutoApply } = get();
    if (isFetchingAutoApply) return;

    set({ isFetchingAutoApply: true });

    try {
      const response = await api.getAutoApplyCoupons(cartTotal) as Record<string, unknown>;
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
