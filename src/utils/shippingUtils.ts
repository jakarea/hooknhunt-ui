/**
 * Shipping Utilities
 * Functions for calculating shipping costs and generating shipping breakdowns
 */

export interface ShippingMethod {
  id: number;
  name: string;
  baseCost: number;
  perKgCost: number;
  freeShippingThresholdRetail: number;
  freeShippingThresholdWholesale: number;
  deliveryTime: string;
  description: string;
}

export interface ShippingZone {
  id: number;
  name: string;
  regions: string[];
  status: 'active' | 'inactive';
  methods: ShippingMethod[];
}

export type CustomerType = 'retail' | 'wholesale';

export interface ShippingCalculation {
  shippingCost: number;
  isFreeShipping: boolean;
  baseCost: number;
  weightCost: number;
  totalWeight: number;
  method: ShippingMethod;
  zone: ShippingZone;
}

export interface ShippingBreakdown {
  currentShippingCost: number;
  isFreeShipping: boolean;
  baseCost: number;
  weightCost: number;
  totalWeight: number;
  method: ShippingMethod;
  zone: ShippingZone;
  cartTotal: number;
  customerType: CustomerType;
  amountNeededForFreeShipping?: number;
}

/**
 * Progressive delivery types for API-based calculation
 */
export interface ProgressiveDeliveryInfo {
  enabled: boolean;
  order_amount?: number;
  min_amount?: number;
  discount_percentage?: number;
  discount_amount?: number;
  amount_needed_for_free?: number;
  is_free?: boolean;
}

export interface DeliveryBreakdown {
  total_weight: number;
  base_weight: number;
  zone: 'inside_dhaka' | 'outside_dhaka' | 'flat_rate';
  is_inside_dhaka: boolean;
  is_flat_rate: boolean;
  base_charge: number;
  additional_kg: number;
  per_kg_rate: number;
  total_charge: number;
  free_delivery: boolean;
  progressive_delivery: ProgressiveDeliveryInfo;
}

export interface DeliveryCalculationResult {
  charge: number;
  breakdown: DeliveryBreakdown;
}

/**
 * Calculate shipping cost based on weight, cart total, and customer type
 */
export function calculateShippingCost(
  method: ShippingMethod,
  zone: ShippingZone,
  weightInKg: number,
  cartTotal: number,
  customerType: CustomerType = 'retail'
): ShippingCalculation {
  const threshold = customerType === 'retail'
    ? method.freeShippingThresholdRetail
    : method.freeShippingThresholdWholesale;

  const isFreeShipping = cartTotal >= threshold;

  const baseCost = method.baseCost;
  const weightCost = weightInKg * method.perKgCost;
  const totalCost = isFreeShipping ? 0 : baseCost + weightCost;

  return {
    shippingCost: totalCost,
    isFreeShipping,
    baseCost,
    weightCost,
    totalWeight: weightInKg,
    method,
    zone
  };
}

/**
 * Get shipping breakdown with incentive messages for customers
 */
export function getShippingBreakdown(
  method: ShippingMethod,
  zone: ShippingZone,
  weightInKg: number,
  cartTotal: number,
  customerType: CustomerType = 'retail'
): ShippingBreakdown {
  const calculation = calculateShippingCost(method, zone, weightInKg, cartTotal, customerType);

  const threshold = customerType === 'retail'
    ? method.freeShippingThresholdRetail
    : method.freeShippingThresholdWholesale;

  let amountNeededForFreeShipping: number | undefined;

  if (!calculation.isFreeShipping && threshold > 0) {
    amountNeededForFreeShipping = threshold - cartTotal;
  }

  return {
    currentShippingCost: calculation.shippingCost,
    isFreeShipping: calculation.isFreeShipping,
    baseCost: calculation.baseCost,
    weightCost: calculation.weightCost,
    totalWeight: weightInKg,
    method,
    zone,
    cartTotal,
    customerType,
    amountNeededForFreeShipping
  };
}

/**
 * Find the appropriate shipping zone based on customer's region
 */
export function findShippingZone(
  zones: ShippingZone[],
  customerRegion: string
): ShippingZone | null {
  const activeZones = zones.filter(z => z.status === 'active');

  for (const zone of activeZones) {
    if (zone.regions.some(region =>
      region.toLowerCase() === customerRegion.toLowerCase()
    )) {
      return zone;
    }
  }

  return null;
}

/**
 * Format currency in Bangladeshi Taka
 */
export function formatCurrency(amount: number): string {
  return `৳${amount.toFixed(0)}`;
}

/**
 * Calculate progressive discount percentage client-side (for preview)
 * @deprecated Use backend API for accurate calculation
 */
export const calculateProgressiveDiscount = (
  orderAmount: number,
  minAmount: number
): number => {
  if (minAmount <= 0 || orderAmount <= 0) {
    return 0;
  }

  const percentage = (orderAmount / minAmount) * 100;
  return Math.min(100, Math.max(0, percentage));
}

/**
 * Get progress bar color based on discount percentage
 */
export const getProgressColor = (percentage: number): string => {
  if (percentage >= 100) return 'green';
  if (percentage >= 80) return 'teal';
  if (percentage >= 50) return 'yellow';
  return 'gray';
}

/**
 * Get progress message based on discount percentage
 */
export const getProgressMessage = (percentage: number, amountNeeded: number): string => {
  if (percentage >= 100) return '🎉 Free Delivery!';
  if (percentage >= 80) return `Almost there! Add ৳${amountNeeded} more for free delivery`;
  if (percentage >= 50) return `Keep going! Add ৳${amountNeeded} more for free delivery`;
  return `Add ৳${amountNeeded} more for free delivery`;
}

