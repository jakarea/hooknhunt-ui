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

  if (loading && categories.length === 0) {
    return (
      <section className="py-8 md:py-10 bg-[#fee1e1] dark:bg-[#1a1a1a]">
        <div className="container px-4">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[4/5] bg-white/40 backdrop-blur-sm rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 md:py-10 bg-[#fee1e1] dark:bg-[#1a1a1a]">
      <div className="container px-4">
        {/* Categories Grid - 6 columns, compact cards */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {categories.slice(0, 6).map((category) => {
            const imageUrl = category.imageUrl || '';

            return (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="group"
              >
                <div className="relative rounded-none overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                  {/* Image Container - 1:1.25 aspect ratio like reference */}
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={t(getCategoryTranslationKey(category))}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 33vw, 16vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <svg
                          className="w-10 h-10 text-gray-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}

                    {/* Dark overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Category Label - at bottom like reference */}
                    <div className="absolute inset-x-0 bottom-0 p-2">
                      <div className="bg-black/60 backdrop-blur-sm px-2 py-1.5 rounded">
                        <span className="block text-center text-xs md:text-sm font-semibold text-white leading-snug line-clamp-2">
                          {t(getCategoryTranslationKey(category))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        {categories.length > 6 && (
          <div className="text-center mt-5 md:mt-6">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#ec3137] hover:bg-[#c5282d] text-white font-medium rounded-lg transition-all duration-300 hover:shadow-md text-sm"
            >
              <span>{t('home.categories.viewAll', { defaultValue: 'View All' })}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
