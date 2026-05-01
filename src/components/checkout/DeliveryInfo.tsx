'use client';

import React from 'react';
import ProgressiveDeliveryBreakdown from '@/components/cart/ProgressiveDeliveryBreakdown';
import { useDeliveryStore } from '@/stores/deliveryStore';
import { useTranslation } from 'react-i18next';

interface DeliveryInfoProps {
  orderAmount: number;
  freeShippingFromCoupon?: boolean;
}

/**
 * Delivery Info Component
 * Displays delivery charge, breakdown, and loading/error states
 */
export default function DeliveryInfo({ orderAmount, freeShippingFromCoupon = false }: DeliveryInfoProps) {
  const { t } = useTranslation();
  const {
    charge,
    breakdown,
    calculating,
    calculationError,
    getDeliveryMode,
    isFreeDelivery,
    isProgressiveDelivery,
  } = useDeliveryStore();

  const deliveryMode = getDeliveryMode();
  const isFree = isFreeDelivery() || freeShippingFromCoupon;
  const isProgressive = isProgressiveDelivery();

  // If still calculating
  if (calculating) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
        <div className="flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-[#ec3137] border-t-transparent rounded-full" />
          <span className="text-sm text-gray-400 dark:text-gray-500">Calculating...</span>
        </div>
      </div>
    );
  }

  // If calculation error
  if (calculationError) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
          <span className="text-orange-600 dark:text-orange-400 text-sm">Unable to calculate</span>
        </div>
        <p className="text-xs text-red-600 dark:text-red-400">{calculationError}</p>
      </div>
    );
  }

  // If no breakdown yet
  if (!breakdown) {
    return (
      <div className="flex items-center justify-between py-2">
        <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
        <span className="text-sm text-gray-400 dark:text-gray-500">Select delivery location</span>
      </div>
    );
  }

  // Free delivery (from mode or coupon)
  if (isFree) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
          <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {t('checkout.freeShippingApplied')}
          </span>
        </div>

        {/* Show progressive breakdown even when free */}
        {isProgressive && breakdown.progressive_delivery?.enabled && (
          <div className="mt-3">
            <ProgressiveDeliveryBreakdown breakdown={breakdown} orderAmount={orderAmount} />
          </div>
        )}
      </div>
    );
  }

  // Progressive delivery with discount
  if (isProgressive && breakdown.progressive_delivery?.enabled && breakdown.progressive_delivery.discount_percentage && breakdown.progressive_delivery.discount_percentage > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
          <span className="text-gray-900 dark:text-white flex items-center gap-2">
            <span className="line-through text-gray-400 text-sm">
              ৳{breakdown.base_charge?.toFixed(0) || '0'}
            </span>
            <span className="text-violet-600 dark:text-violet-400 font-semibold">
              ৳{charge.toFixed(0)}
            </span>
            <span className="text-xs bg-violet-100 dark:bg-violet-900 text-violet-700 dark:text-violet-300 px-2 py-0.5 rounded font-medium">
              {breakdown.progressive_delivery.discount_percentage.toFixed(0)}% OFF
            </span>
          </span>
        </div>

        <div className="mt-3">
          <ProgressiveDeliveryBreakdown breakdown={breakdown} orderAmount={orderAmount} />
        </div>
      </div>
    );
  }

  // Standard delivery charge
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <span className="text-gray-700 dark:text-gray-300">{t('checkout.deliveryCharge')}</span>
        <span className="text-gray-900 dark:text-white font-semibold flex items-center gap-2">
          <span>৳{charge.toFixed(0)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">
            ({breakdown.zone === 'inside_dhaka' ? 'Dhaka' : breakdown.zone === 'outside_dhaka' ? 'Outside Dhaka' : 'Flat Rate'}
            {breakdown.additional_kg > 0 && ` +${breakdown.additional_kg}kg`}
            )
          </span>
        </span>
      </div>

      {/* Weight info */}
      {breakdown.total_weight > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          Total weight: {breakdown.total_weight} KG
        </p>
      )}
    </div>
  );
}
