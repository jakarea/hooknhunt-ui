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
    <section className="bg-[#fee1e1] dark:bg-[#322020] dark:bg-[#322020] py-10 transition-colors duration-200">
      <div className="container px-3 md:px-4">
        <div className="mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('home.recommended.title')}</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 lg:gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-[#322020] rounded" />
                  <div className="mt-2 h-4 bg-gray-200 dark:bg-[#322020] rounded w-3/4" />
                  <div className="mt-1 h-4 bg-gray-200 dark:bg-[#322020] rounded w-1/2" />
                </div>
              ))
            : products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-5 md:mt-6">
          <Link href="/products?sort=recommended" className="inline-flex items-center gap-2 px-4 py-2 bg-[#ec3137] hover:bg-[#c5282d] text-white font-medium rounded-lg transition-all duration-300 hover:shadow-md text-sm">
            <span>{t('home.recommended.viewAllLink')}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
