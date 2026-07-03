'use client';

import { useMemo } from 'react';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { useTranslation } from 'react-i18next';
import ProductCard from './ProductCard';
import Link from 'next/link';

interface RecentlyViewedSectionProps {
  currentProductId?: number;
}

export default function RecentlyViewedSection({ currentProductId }: RecentlyViewedSectionProps) {
  const { recentlyViewed } = useRecentlyViewed();
  const { t } = useTranslation();

  // Filter out current product and limit to 8 items
  const displayProducts = useMemo(() => {
    return recentlyViewed
      .filter(p => p.id !== currentProductId)
      .slice(0, 8);
  }, [recentlyViewed, currentProductId]);

  // Don't render if no products or less than 2
  if (displayProducts.length < 2) {
    return null;
  }

  return (
    <section className="py-8 sm:py-12 bg-white dark:bg-[#2a2a2a]/50 dark:bg-[#1f1515]/50">
      <div className="container px-3 md:px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#bc1215] to-[#8a0e10] rounded-full"></div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              {t('recentlyViewed.title', 'Recently Viewed')}
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-semibold text-[#bc1215] hover:text-[#8a0f12] transition-colors flex items-center gap-1 group"
          >
            {t('recentlyViewed.viewAll', 'View All')}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-3">
          {displayProducts.map((product, index) => (
            <div
              key={product.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
