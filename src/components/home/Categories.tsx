'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCategoryStore } from '@/stores/categoryStore';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

export default function Categories() {
  const { t } = useTranslation();
  const categories = useCategoryStore((s) => s.categories);
  const loading = useCategoryStore((s) => s.loading);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return (
      <section className="py-20 bg-[#fcf8f6] dark:bg-[#0a0a0a]">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="text-center mb-16">
            <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto mb-4" />
            <div className="h-6 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[#fcf8f6] dark:bg-[#0a0a0a]">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Simple Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.categories.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {t('home.categories.subtitle')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.slice(0, 18).map((category, index) => {
            const img = category.image;
            const imageUrl = (typeof img === 'object' && img?.full_url)
              ? img.full_url
              : category.image_url || '';
            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 dark:border-gray-700">
                  <div className="relative aspect-square overflow-hidden rounded-xl">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={t(getCategoryTranslationKey(category))}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}

                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/20"></div>

                    {/* Always-visible centered name */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-lg">
                        <h3 className="text-center text-white font-bold text-base md:text-lg leading-tight truncate max-w-[140px] md:max-w-[180px]">
                          {t(getCategoryTranslationKey(category))}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Simple CTA */}
        {categories.length > 18 && (
          <div className="text-center mt-16">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors duration-300"
            >
              <span>{t('home.categories.viewAll')}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

      </div>
    </section >
  );
}
