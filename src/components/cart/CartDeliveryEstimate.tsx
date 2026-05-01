'use client';

import React, { useEffect, useMemo } from 'react';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { useCart } from '@/context/CartContext';

interface CartDeliveryEstimateProps {
  onCalculated?: (charge: number) => void;
}

/**
 * Cart Delivery Estimate Component
 * Shows delivery charge estimate in cart drawer with default Inside Dhaka rate
 * Shows progressive delivery motivation messages
 */
export default function CartDeliveryEstimate({ onCalculated }: CartDeliveryEstimateProps) {
  const { cartItems, getCartTotal } = useCart();
  const {
    charge,
    breakdown,
    settings,
    calculating,
    fetchSettings,
    calculateCharge,
    getDeliveryMode,
    isProgressiveDelivery,
  } = useDeliveryStore();

  // Fetch delivery settings on mount (cached)
  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Calculate total weight
  const totalWeight = useMemo(() => {
    return cartItems.reduce((total: number, item) => {
      const itemWeight = (typeof item.variant?.weight === 'number' ? item.variant.weight : 0.5);
      return total + (itemWeight * item.quantity);
    }, 0);
  }, [cartItems]);

  const subtotal = getCartTotal();

  // Calculate delivery charge with default Inside Dhaka division
  useEffect(() => {
    if (totalWeight > 0 && settings) {
      // Use Inside Dhaka as default division for cart estimate
      calculateCharge({
        weight: totalWeight,
        division: 'dhaka',
        order_amount: subtotal,
      });
    }
  }, [totalWeight, subtotal, settings, calculateCharge]);

  // Notify parent of calculated charge
  useEffect(() => {
    if (onCalculated && charge > 0) {
      onCalculated(charge);
    }
  }, [charge, onCalculated]);

  const deliveryMode = getDeliveryMode();
  const isProgressive = isProgressiveDelivery();

  // Static delivery estimate for users (shown before calculation)
  const staticEstimate = (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l4 4m0 6H4m0 0l4-4m-4 4l4 4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h18M3 10h18M3 17h18" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-body-sm font-bold text-gray-900 dark:text-white mb-1">
            Delivery Estimate
          </p>
          <p className="text-label-xs text-gray-600 dark:text-gray-400 leading-relaxed">
            Inside Dhaka: ৳60-100 | Outside Dhaka: ৳120-150
          </p>
          <p className="text-label-xs text-gray-500 dark:text-gray-500 mt-1">
            Final charge calculated at checkout based on your location
          </p>
        </div>
      </div>
    </div>
  );

  // Show loading state
  if (calculating) {
    return (
      <>
        {staticEstimate}
        <div className="flex items-center justify-between py-2">
          <span className="text-label-xs text-gray-500 dark:text-gray-400 font-semibold">Calculating exact delivery...</span>
          <div className="flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-[#ec3137] border-t-transparent rounded-full" />
          </div>
        </div>
      </>
    );
  }

  // Show static estimate if no breakdown yet (before calculation)
  if (!breakdown && !calculating) {
    return staticEstimate;
  }

  // Progressive delivery with motivational message
  // Changed: Check if mode is progressive, not just breakdown.enabled
  if (deliveryMode === 'progressive_delivery' || isProgressive) {
    // Get progressive data with fallbacks (API returns camelCase)
    const progressiveData = breakdown?.progressiveDelivery || breakdown?.progressive_delivery;
    const is_free = progressiveData?.isFree ?? progressiveData?.is_free ?? false;
    const motivationalMessageFromAPI = progressiveData?.motivationalMessage ?? progressiveData?.motivational_message ?? '';

    // Show motivational message from API if available (takes priority over simple free message)
    if (motivationalMessageFromAPI && motivationalMessageFromAPI.length > 0) {
      const isAlmostFree = motivationalMessageFromAPI.includes('FREE delivery');
      const highlightColor = isAlmostFree ? 'green' : 'orange';

      return (
        <div className="space-y-2">
          {/* Prominent motivational message at the top */}
          <div className={`relative ${highlightColor === 'green' ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 border-green-300 dark:border-green-700' : 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30 border-orange-300 dark:border-orange-700'} border rounded-xl p-4 shadow-sm`}>
            {/* Attention icon */}
            <div className="absolute -top-2 -right-2">
              <span className={`flex h-7 w-7 ${highlightColor === 'green' ? 'bg-green-500' : 'bg-orange-500'} text-white rounded-full items-center justify-center text-sm font-bold shadow-md animate-pulse`}>
                ⚡
              </span>
            </div>
            <div className="flex items-center gap-3 pr-6">
              <div className={`flex-shrink-0 ${highlightColor === 'green' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6 4 4" />
                </svg>
              </div>
              <div className="flex-1">
                <p className={`text-body-md font-bold ${highlightColor === 'green' ? 'text-green-800 dark:text-green-200' : 'text-orange-800 dark:text-orange-200'} leading-snug`}>
                  {motivationalMessageFromAPI}
                </p>
                <p className="text-label-xs text-gray-600 dark:text-gray-400 mt-1 font-semibold">
                  {highlightColor === 'green' ? 'You are so close!' : 'Boost your cart & save!'}
                </p>
              </div>
            </div>
          </div>

          {/* Delivery charge (smaller, below message) */}
          <div className="flex items-center justify-between py-1.5">
            <span className="text-label-xs text-gray-500 dark:text-gray-400 font-semibold">Delivery</span>
            <span className="text-body-sm font-bold text-gray-700 dark:text-gray-300">
              ৳{charge.toFixed(0)}
            </span>
          </div>
        </div>
      );
    }

    // Fallback: If no motivational message from API yet, show loading or simple delivery
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-label-xs text-gray-500 dark:text-gray-400 font-semibold">Delivery</span>
        <span className="text-body-sm font-bold text-gray-700 dark:text-gray-300">
          ৳{charge.toFixed(0)}
        </span>
      </div>
    );
  }

  // Free delivery mode
  if (deliveryMode === 'free_delivery') {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-label-xs text-gray-500 dark:text-gray-400 font-semibold">Delivery</span>
        <span className="text-body-sm font-bold text-green-600 dark:text-green-400 flex items-center gap-1.5">
          🎉 FREE!
        </span>
      </div>
    );
  }

  // Standard delivery charge
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-label-xs text-gray-500 dark:text-gray-400 font-semibold">Delivery (Inside Dhaka)</span>
      <span className="text-body-md font-bold text-[#ec3137]">
        ৳{charge.toFixed(0)}
      </span>
    </div>
  );
}
