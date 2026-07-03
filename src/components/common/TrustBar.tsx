'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TrustBar - Prominent trust signals above main navigation
 * Shows COD, delivery, and customer count for Bangladeshi market
 */
export default function TrustBar() {
  const { t } = useTranslation();

  const trustItems = [
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      text: 'Cash on Delivery',
      color: 'text-white',
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      text: '2-3 Days Delivery',
      color: 'text-gray-900 dark:text-black',
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.63L12 2z" />
        </svg>
      ),
      text: '10,000+ Happy Customers',
      color: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      icon: (
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: '100% Genuine Products',
      color: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-500">
      <div className="container">
        <div className="flex items-center justify-center gap-2 sm:gap-6 py-2.5 sm:py-3 overflow-x-auto">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              <div className={`flex-shrink-0 ${item.color}`}>
                {item.icon}
              </div>
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-100 leading-tight">
                {item.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
