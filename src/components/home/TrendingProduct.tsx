'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import ProductCard from '@/components/product/ProductCard';
import api from '@/lib/api';
import { mapApiProduct, ApiProduct } from '@/stores/productStore';
import { Product } from '@/types';

export default function TrendingProduct() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.getProducts({ per_page: 12, page: 1 });
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
    <section className="bg-[#fee1e1] pb-10">
      <div className="container">
      {/* <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-1 h-8 bg-gradient-to-b from-[#ec3137] to-[#046bd2]"></div>
            <h3 className="text-heading-xl md:text-heading-2xl font-bold text-gray-900 dark:text-white">{t('home.trending.title')}</h3>
          </div>
          <p className="text-body-lg text-gray-600 dark:text-gray-200 ml-4">{t('home.trending.subtitle')}</p>
        </div>
        <Link href="/products?sort=trending" className="group">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#ec3137] to-[#046bd2] text-white font-semibold hover:from-[#8a0f12] hover:to-[#0353a5] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer rounded-lg">
            {t('home.trending.viewAll')}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div> */}

      <div className="bg-[#fef2f2] p-3 lg:p-4 rounded-lg rounded-t-none shadow border border-t-0 border-[#ffa2a2]">
      <h3 className="text-heading-base md:text-heading-xl font-bold text-black dark:text-white mb-2 lg:mb-3">{t('home.trending.title')}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1 lg:gap-2 ">
        {loading
          ? Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-gray-200 rounded" />
                <div className="mt-2 h-4 bg-gray-200 rounded w-3/4" />
                <div className="mt-1 h-4 bg-gray-200 rounded w-1/2" />
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
      </div>
      </div>
    </section>
  );
}
