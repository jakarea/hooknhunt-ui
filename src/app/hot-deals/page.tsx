'use client';

import React from 'react';
import ProductCard from '@/components/product/ProductCard';
import { getBestDeals } from '@/data/static-products';
import { useTranslation } from 'react-i18next';

export default function HotDealsPage() {
  const { t } = useTranslation();
  const hotDealsProducts = getBestDeals();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Products Grid */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-12 sm:py-16">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            {t('subtitle', { count: hotDealsProducts.length })}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {hotDealsProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Newsletter CTA Section */}
        <div className="mt-12 sm:mt-16 text-center bg-white dark:bg-[#1a1a1a] rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
            {t('newsletter.title')}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 max-w-xl mx-auto leading-relaxed">
            {t('newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter.emailPlaceholder')}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
            />
            <button className="px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base bg-[#bc1215] text-white font-semibold rounded-lg hover:bg-[#8a0e10] focus:outline-none focus:ring-2 focus:ring-[#bc1215]/50 focus:ring-offset-2 transition-all min-h-[42px] sm:min-h-0">
              {t('newsletter.submitButton')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
