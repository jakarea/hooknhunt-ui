'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/product/ProductCard';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import { mapApiProduct, ApiProduct } from '@/stores/productStore';
import { Product } from '@/types';

export default function HotDealsPage() {
  const { t } = useTranslation('hotDeals');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getHotDeals(24);
        const resData = res.data as ApiProduct[] | unknown as ApiProduct[];
        const raw = Array.isArray(resData) ? resData : [];
        if (!cancelled) {
          setProducts(raw.map(mapApiProduct));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[#fee1e1] dark:bg-[#322020]">
      {/* Products Grid */}
      <div className="container px-3 md:px-4 py-12 sm:py-16">
        {/* Page Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
            {t('title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200">
            {t('subtitle', { count: products.length })}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-[#322020] rounded" />
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-[#322020] rounded w-3/4" />
                  <div className="mt-1 h-4 bg-gray-200 dark:bg-[#322020] rounded w-1/2" />
                </div>
              ))
            : products.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
        </div>

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-200 text-lg">No deals available right now. Check back soon!</p>
          </div>
        )}

        {/* Newsletter CTA Section */}
        <div className="mt-12 sm:mt-16 text-center bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
            {t('newsletter.title')}
          </h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-200 mb-4 sm:mb-6 max-w-xl mx-auto leading-relaxed">
            {t('newsletter.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={t('newsletter.emailPlaceholder')}
              className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm border border-gray-300 dark:border-gray-400 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
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
