'use client';

import React from 'react';
import type { DeliveryBreakdown } from '@/utils/shippingUtils';

interface ProgressiveDeliveryBreakdownProps {
  breakdown: DeliveryBreakdown;
  orderAmount: number;
  className?: string;
}

/**
 * Display progressive delivery breakdown with discount information
 */
export default function ProgressiveDeliveryBreakdown({
  breakdown,
  orderAmount,
  className = ''
}: ProgressiveDeliveryBreakdownProps) {
  const {
    total_charge,
    base_charge,
    total_weight,
    zone,
    progressive_delivery,
  } = breakdown;

  const { enabled, discount_percentage, discount_amount, amount_needed_for_free, is_free } = progressive_delivery;

  // Calculate progress percentage
  const progress_percentage = discount_percentage || 0;
  const min_amount = progressive_delivery.min_amount || 0;

  return (
    <div className={`bg-white dark:bg-[#1f1515] border border-gray-200 dark:border-gray-400 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Delivery Details</h3>
        <span className="text-xs font-medium px-2.5 py-0.5 rounded bg-gray-100 dark:bg-[#322020] text-gray-800 dark:text-gray-200">
          {zone === 'inside_dhaka' ? 'Inside Dhaka' : zone === 'outside_dhaka' ? 'Outside Dhaka' : 'Flat Rate'}
        </span>
      </div>

      {/* Weight Info */}
      <div className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-400">
        <span className="text-sm text-gray-600 dark:text-gray-200">
          Total Weight: {total_weight} KG
        </span>
      </div>

      {/* Progressive Delivery Info */}
      {enabled ? (
        <div className="space-y-3">
          {/* Amount Progress Display */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-100">Progress toward free delivery</span>
              <span className="text-sm font-bold text-violet-600 dark:text-violet-400">
                {progress_percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-200 bg-gray-50 dark:bg-[#322020] rounded-lg px-3 py-2">
              <span>Current: ৳{orderAmount.toLocaleString()}</span>
              <span className="font-medium">Goal: ৳{min_amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Discount Badge */}
          {discount_percentage && discount_percentage > 0 && discount_percentage < 100 && (
            <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-violet-600 dark:text-violet-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="text-sm font-semibold text-violet-900 dark:text-violet-100">
                    {discount_percentage.toFixed(0)}% Delivery Discount
                  </span>
                </div>
                <span className="text-sm font-bold text-violet-900 dark:text-violet-100">
                  -৳{discount_amount?.toFixed(0)}
                </span>
              </div>
            </div>
          )}

          {/* Free Delivery Badge */}
          {is_free && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-bold text-green-900 dark:text-green-100">
                  🎉 Free Delivery Applied!
                </span>
              </div>
            </div>
          )}

          {/* Incentive Message */}
          {!is_free && amount_needed_for_free && amount_needed_for_free > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Add <span className="font-bold">৳{amount_needed_for_free.toFixed(0)}</span> more for free delivery
              </p>
            </div>
          )}

          {/* Cost Breakdown */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-400 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-200">Base delivery charge:</span>
              <span className="font-medium text-gray-900 dark:text-white">৳{base_charge.toFixed(0)}</span>
            </div>
            {discount_amount && discount_amount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-violet-600 dark:text-violet-400">Progressive discount:</span>
                <span className="font-medium text-violet-600 dark:text-violet-400">-৳{discount_amount.toFixed(0)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-400">
              <span className="text-gray-900 dark:text-white font-semibold">Total Delivery:</span>
              <span className={`font-bold ${is_free ? 'text-green-600 dark:text-green-400' : 'text-[#ec3137]'}`}>
                {is_free ? 'FREE' : `৳${total_charge.toFixed(0)}`}
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Non-Progressive Display */
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-200">Base delivery charge:</span>
            <span className="font-medium text-gray-900 dark:text-white">৳{base_charge.toFixed(0)}</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-400">
            <span className="text-gray-900 dark:text-white font-semibold">Total Delivery:</span>
            <span className="font-bold text-[#ec3137]">৳{total_charge.toFixed(0)}</span>
          </div>
        </div>
      )}
    </div>
  );
}
