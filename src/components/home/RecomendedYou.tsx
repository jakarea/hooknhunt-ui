'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { mapApiProduct, ApiProduct } from '@/stores/productStore';
import { Product } from '@/types';

export default function RecomendedYou() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getProducts({ per_page: 6, page: 3 });
        const raw: ApiProduct[] = (res.data as { data?: ApiProduct[] })?.data ?? [];
        if (!cancelled) setProducts(raw.map(mapApiProduct));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="bg-gray-50 dark:bg-[#0f0f0f] py-20 transition-colors duration-200">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-purple-600"></div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('home.recommended.title')}</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl ml-4">{t('home.recommended.subtitle')}</p>
          </div>
          <Link href="/products?sort=recommended" className="group">
            <span className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 rounded-lg">
              {t('home.recommended.viewAllLink')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded" />
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="mt-1 h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                </div>
              ))
            : products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>
      </div>
    </section>
  );
}
