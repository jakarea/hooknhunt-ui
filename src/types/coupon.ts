// Coupon types for storefront checkout integration

export type CouponType = 'percentage' | 'fixed' | 'shipping';

/** Coupon applied by the user — stored in Zustand */
export interface AppliedCoupon {
  code: string;
  type: CouponType;
  value: number;
  maxDiscountAmount: number | null;
  discountAmount: number;   // server-calculated discount in BDT
  finalTotal: number;       // cart total after discount
}

/** Coupon returned by GET /store/coupons/auto-apply */
export interface AutoApplyCoupon {
  code: string;
  type: CouponType;
  amount: number;
  discountAmount: number;
  description: string;
}
