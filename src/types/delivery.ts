/**
 * Delivery Types
 * Type definitions for delivery system
 */

export type DeliveryMode = 'standard' | 'flat_rate' | 'free_delivery' | 'progressive_delivery';

export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka' | 'flat_rate';

export interface DeliverySettings {
  delivery_mode: DeliveryMode;
  base_weight: number;
  inside_dhaka: {
    base_charge: number;
    per_kg_charge: number;
  };
  outside_dhaka: {
    base_charge: number;
    per_kg_charge: number;
  };
  flat_rate: {
    enabled: boolean;
    base_charge: number;
    per_kg_charge: number;
  };
  free_delivery: {
    enabled: boolean;
  };
  progressive_delivery: {
    enabled: boolean;
    min_amount: number;
    mode?: 'linear' | 'tiered';
  };
}

export interface ProgressiveDeliveryInfo {
  enabled: boolean;
  order_amount?: number;
  min_amount?: number;
  discount_percentage?: number;
  discount_amount?: number;
  amount_needed_for_free?: number;
  is_free?: boolean;
  motivational_message?: string;

  // CamelCase variants (API returns these)
  orderAmount?: number;
  minAmount?: number;
  discountPercentage?: number;
  discountAmount?: number;
  amountNeededForFree?: number;
  isFree?: boolean;
  motivationalMessage?: string;
}

export interface DeliveryBreakdown {
  total_weight: number;
  base_weight: number;
  zone: DeliveryZone;
  is_inside_dhaka: boolean;
  is_flat_rate: boolean;
  base_charge: number;
  additional_kg: number;
  per_kg_rate: number;
  total_charge: number;
  free_delivery: boolean;
  progressive_delivery: ProgressiveDeliveryInfo;

  // CamelCase variants (API returns these)
  totalWeight?: number;
  baseWeight?: number;
  isInsideDhaka?: boolean;
  isFlatRate?: boolean;
  baseCharge?: number;
  additionalKg?: number;
  perKgRate?: number;
  totalCharge?: number;
  freeDelivery?: boolean;
  progressiveDelivery?: ProgressiveDeliveryInfo;
}

export interface DeliveryCalculationParams {
  weight: number;
  division: string;
  order_amount?: number;
}

export interface DeliveryCalculationResult {
  charge: number;
  breakdown: DeliveryBreakdown;
}

export interface DeliveryState {
  // Settings
  settings: DeliverySettings | null;
  settingsLoading: boolean;
  settingsError: string | null;

  // Calculation
  charge: number;
  breakdown: DeliveryBreakdown | null;
  calculating: boolean;
  calculationError: string | null;

  // Last calculation params (for caching)
  lastCalculation: {
    weight: number;
    division: string;
    orderAmount: number;
  } | null;
}
