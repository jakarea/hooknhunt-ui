'use client';

import React from 'react';

/**
 * CODHeroSection - Prominent Cash on Delivery hero section
 * Highlights COD as the recommended payment method for Bangladeshi market
 */
export default function CODHeroSection() {
  const benefits = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'No additional fees',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Pay exact amount to courier',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Check product before paying',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      text: 'Most popular in Bangladesh',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-900/30 dark:via-emerald-900/20 dark:to-green-900/30 border-2 border-green-500 dark:border-green-600 rounded-2xl p-5 sm:p-6 mb-6 shadow-lg">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5">
        {/* Icon */}
        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>

        {/* Title & Badge */}
        <div className="flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-heading-lg sm:text-heading-xl font-bold text-gray-900 dark:text-white mb-1">
                Cash on Delivery
              </h3>
              <p className="text-body-sm text-gray-600 dark:text-gray-200">
                Pay when you receive - Most popular payment method in Bangladesh
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="inline-flex items-center px-3 py-1.5 bg-green-500 text-white text-label-xs font-bold rounded-full shadow-md">
                RECOMMENDED
                <svg className="w-3 h-3 ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white dark:bg-white/10 backdrop-blur-sm px-3 py-2.5 rounded-xl border border-green-200 dark:border-green-700/50"
          >
            <div className="flex-shrink-0 text-green-600 dark:text-green-400">
              {benefit.icon}
            </div>
            <span className="text-label-sm sm:text-body-sm font-medium text-gray-700 dark:text-gray-100 leading-tight">
              {benefit.text}
            </span>
          </div>
        ))}
      </div>

      {/* Trust Note */}
      <div className="mt-5 pt-4 border-t border-green-200 dark:border-green-700/50">
        <div className="flex items-center gap-2 text-label-sm text-gray-600 dark:text-gray-200">
          <svg className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Your payment is secure. You can check the product before paying to the courier.</span>
        </div>
      </div>
    </div>
  );
}
