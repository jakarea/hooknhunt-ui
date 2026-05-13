// Coupon types for storefront checkout integration

export type CouponType = 'percentage' | 'fixed_amount' | 'shipping';

/** Full coupon details from backend validation response */
export interface AppliedCoupon {
  code: string;
  description?: string;
  type: CouponType;
  value: number;                    // amount field from backend
  maxDiscountAmount: number | null; // max_discount_amount
  discountAmount: number;           // server-calculated discount in BDT
  minPurchaseAmount: number;        // min_purchase_amount
  finalTotal: number;               // cart total after discount
}

/** Coupon returned by GET /store/coupons/auto-apply */
export interface AutoApplyCoupon {
  code: string;
  description?: string;
  type: CouponType;
  amount: number;
  discountAmount: number;
}
