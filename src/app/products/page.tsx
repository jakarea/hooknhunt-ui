'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';
import { Product } from '@/types';
import { useCategoryStore } from '@/stores/categoryStore';
import { useProductStore, ProductFilters } from '@/stores/productStore';
import { useTranslation } from 'react-i18next';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

const SORT_MAP: Record<string, string> = {
  'best-selling': 'created_at_desc',
  'newest': 'created_at_desc',
  'price-low': 'price_asc',
  'price-high': 'price_desc',
};

function ProductsPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : ['all']);
  const [sortBy, setSortBy] = useState<string>('best-selling');
  const [priceRange, setPriceRange] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const categories = useCategoryStore((s) => s.categories);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  const products = useProductStore((s) => s.products);
  const loading = useProductStore((s) => s.loading);
  const hasMore = useProductStore((s) => s.hasMore);
  const fetched = useProductStore((s) => s.fetched);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const loadMore = useProductStore((s) => s.loadMore);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Resolve category_id from selected slug
  const getCategoryId = useCallback((): number | undefined => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) return undefined;
    const cat = categories.find((c) => c.slug === selectedCategories[0]);
    return cat?.id;
  }, [selectedCategories, categories]);

  // Build API filters from current selections
  const buildFilters = useCallback((): ProductFilters => {
    const filters: ProductFilters = {};
    const categoryId = getCategoryId();
    if (categoryId) filters.category_id = categoryId;
    const apiSort = SORT_MAP[sortBy];
    if (apiSort) filters.sort_by = apiSort;
    return filters;
  }, [getCategoryId, sortBy]);

  // Fetch categories from API
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts(buildFilters(), true);
  }, [buildFilters, fetchProducts]);

  // Sync URL category param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
  }, [categoryParam]);

  // Client-side filters (price, rating) applied to API products
  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      if (minRating > 0 && (product.rating || 0) < minRating) return false;

      if (priceRange.length > 0) {
        const productPrice = product.price || product.actual_price || 0;
        const inRange = priceRange.some((range: string) => {
          if (range === 'under-1000') return productPrice < 1000;
          if (range === '1000-5000') return productPrice >= 1000 && productPrice < 5000;
          if (range === '5000-10000') return productPrice >= 5000 && productPrice < 10000;
          if (range === '10000-plus') return productPrice >= 10000;
          return false;
        });
        if (!inRange) return false;
      }

      return true;
    });
  }, [products, priceRange, minRating]);

  // Client-side sort for discount (API doesn't support it)
  const sortedProducts = useMemo(() => {
    if (sortBy !== 'discount') return filteredProducts;

    return [...filteredProducts].sort((a: Product, b: Product) => {
      const aPrice = a.price || a.actual_price || 0;
      const bPrice = b.price || b.actual_price || 0;
      const aOriginal = a.originalPrice || a.compare_at_price || 0;
      const bOriginal = b.originalPrice || b.compare_at_price || 0;
      const aDiscount = aOriginal > aPrice ? (aOriginal - aPrice) / aOriginal : 0;
      const bDiscount = bOriginal > bPrice ? (bOriginal - bPrice) / bOriginal : 0;
      return bDiscount - aDiscount;
    });
  }, [filteredProducts, sortBy]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasMore, loadMore]);

  const handlePriceRangeChange = (range: string) => {
    setPriceRange((prev) =>
      prev.includes(range)
        ? prev.filter((r) => r !== range)
        : [...prev, range]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories(['all']);
    setPriceRange([]);
    setMinRating(0);
    setSortBy('best-selling');
  };

  const hasActiveFilters = !selectedCategories.includes('all') || selectedCategories.length > 1 || priceRange.length > 0 || minRating > 0;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="container py-3 sm:py-4">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">{t('breadcrumb.home')}</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">{t('breadcrumb.products')}</span>
            {!selectedCategories.includes('all') && selectedCategories.length === 1 && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white font-medium capitalize">
                  {categories.find(c => c.slug === selectedCategories[0])?.name || selectedCategories[0]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>


      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden flex items-center justify-center gap-2 py-3 px-4 min-h-[48px] bg-[#bc1215] hover:bg-[#8a0e10] text-white font-semibold mb-3 sm:mb-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm">{t('filterButton')}</span>
            {hasActiveFilters && (
              <span className="ml-1 px-2 py-0.5 bg-white/20 rounded-full text-xs font-bold">
                {[!selectedCategories.includes('all') || selectedCategories.length > 1 ? 1 : 0, priceRange.length, minRating > 0 ? 1 : 0].reduce((a, b) => a + b, 0)}
              </span>
            )}
          </button>

          {/* Sidebar */}
          <aside className={`
            lg:w-72 flex-shrink-0
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
            fixed lg:relative inset-0 lg:inset-auto z-50 lg:z-auto
            bg-white dark:bg-[#0a0a0a] lg:bg-transparent
            overflow-y-auto lg:overflow-visible
            p-4 lg:p-0
          `}>
            {/* Mobile Close Button */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="space-y-6">
              {/* Active Filters */}
              {hasActiveFilters && (
                <div className="bg-gray-50 dark:bg-[#0f0f0f] border border-gray-200 dark:border-gray-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                      {t('activeFilters')}
                    </h3>
                    <button
                      onClick={clearAllFilters}
                      className="text-[#bc1215] hover:text-[#8a0f12] text-sm font-semibold"
                    >
                      {t('clearAll')}
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.filter(cat => cat !== 'all').map(categorySlug => {
                      const category = categories.find(c => c.slug === categorySlug);
                      if (!category) return null;
                      return (
                        <button
                          key={categorySlug}
                          onClick={() => {
                            const newCategories = selectedCategories.filter(cat => cat !== categorySlug);
                            if (newCategories.length === 0) {
                              setSelectedCategories(['all']);
                            } else {
                              setSelectedCategories(newCategories);
                            }
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm rounded-full"
                        >
                          {t(getCategoryTranslationKey(category))}
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      );
                    })}
                    {priceRange.map(range => (
                      <button
                        key={range}
                        onClick={() => handlePriceRangeChange(range)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm rounded-full"
                      >
                        {range === 'under-1000' && '< ৳1,000'}
                        {range === '1000-5000' && '৳1,000-5,000'}
                        {range === '5000-10000' && '৳5,000-10,000'}
                        {range === '10000-plus' && '৳10,000+'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ))}
                    {minRating > 0 && (
                      <button
                        onClick={() => setMinRating(0)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#bc1215] text-white text-sm rounded-full"
                      >
                        {minRating}+ Stars
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Categories Filter */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    {t('categories')}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  <button
                    onClick={() => setSelectedCategories(['all'])}
                    className={`w-full text-left px-4 py-3 min-h-[48px] transition-colors font-medium flex items-center justify-between rounded-lg ${selectedCategories.includes('all')
                      ? 'bg-[#bc1215] text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes('all')}
                        onChange={() => setSelectedCategories(['all'])}
                        className="w-5 h-5 text-[#bc1215] border-gray-300 focus:ring-[#bc1215] rounded"
                      />
                      <span className="text-sm sm:text-base">{t('allProducts')}</span>
                    </span>
                  </button>
                  {categories.map(category => {
                    const isSelected = selectedCategories.includes(category.slug);
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          if (isSelected) {
                            const newCategories = selectedCategories.filter(cat => cat !== category.slug);
                            if (newCategories.length === 0) {
                              setSelectedCategories(['all']);
                            } else {
                              setSelectedCategories(newCategories);
                            }
                          } else {
                            const newCategories = selectedCategories.filter(cat => cat !== 'all');
                            setSelectedCategories([...newCategories, category.slug]);
                          }
                        }}
                        className={`w-full text-left px-4 py-3 min-h-[48px] transition-colors flex items-center justify-between rounded-lg ${isSelected
                          ? 'bg-[#bc1215] text-white font-semibold shadow-md'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                          }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {
                              if (isSelected) {
                                const newCategories = selectedCategories.filter(cat => cat !== category.slug);
                                if (newCategories.length === 0) {
                                  setSelectedCategories(['all']);
                                } else {
                                  setSelectedCategories(newCategories);
                                }
                              } else {
                                const newCategories = selectedCategories.filter(cat => cat !== 'all');
                                setSelectedCategories([...newCategories, category.slug]);
                              }
                            }}
                            className="w-5 h-5 text-[#bc1215] border-gray-300 focus:ring-[#bc1215] rounded"
                          />
                          <span className="text-sm sm:text-base">{t(getCategoryTranslationKey(category))}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    {t('priceRange')}
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {[
                    { value: 'under-1000', label: t('under1000') },
                    { value: '1000-5000', label: t('1000-5000') },
                    { value: '5000-10000', label: t('5000-10000') },
                    { value: '10000-plus', label: t('10000-plus') },
                  ].map(option => (
                    <label key={option.value} className="flex items-center cursor-pointer group min-h-[44px] px-2 py-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                      <input
                        type="checkbox"
                        checked={priceRange.includes(option.value)}
                        onChange={() => handlePriceRangeChange(option.value)}
                        className="w-5 h-5 text-[#bc1215] border-gray-300 focus:ring-[#bc1215]"
                      />
                      <span className="ml-3 text-sm sm:text-base text-gray-700 dark:text-gray-300 group-hover:text-[#bc1215]">
                        {option.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-lg">
                <div className="bg-gray-50 dark:bg-[#0f0f0f] px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider">
                    {t('customerRating')}
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <button
                      key={rating}
                      onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                      className={`w-full flex items-center px-3 py-3 min-h-[48px] transition-colors rounded-lg ${minRating === rating
                        ? 'bg-[#bc1215]/10 dark:bg-[#bc1215]/20 border border-[#bc1215]/30'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent'
                        }`}
                    >
                      <div className="flex items-center flex-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                        <span className="ml-3 text-sm sm:text-base text-gray-700 dark:text-gray-300">{t('andUp')}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Promo Banner */}
              <div className="bg-gradient-to-br from-[#bc1215] to-[#8a0f12] p-6 text-white rounded-lg">
                <h3 className="font-bold text-lg mb-2">{t('specialOffer.title')}</h3>
                <p className="text-sm text-white/90 mb-4">
                  {t('specialOffer.description')}
                </p>
                <Link
                  href="/deals"
                  className="inline-block px-4 py-2 bg-white text-[#bc1215] font-semibold text-sm hover:bg-gray-100 transition-colors"
                >
                  {t('specialOffer.viewDeals')}
                </Link>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Options Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#bc1215] rounded-full"></div>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {t('showing')} <span className="font-bold text-gray-900 dark:text-white text-base sm:text-lg">{sortedProducts.length}</span> {sortedProducts.length === 1 ? t('product') : t('products')}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <label className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">{t('sortBy')}</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 min-h-[44px] border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#bc1215] focus:border-[#bc1215] outline-none rounded-lg font-medium shadow-sm hover:shadow-md transition-shadow cursor-pointer text-xs sm:text-sm"
                >
                  <option value="best-selling">{t('sortOptions.bestSelling')}</option>
                  <option value="newest">{t('sortOptions.newest')}</option>
                  <option value="discount">{t('sortOptions.discount')}</option>
                  <option value="price-low">{t('sortOptions.priceLow')}</option>
                  <option value="price-high">{t('sortOptions.priceHigh')}</option>
                </select>
              </div>
            </div>

            {/* Skeleton Loading */}
            {loading && !fetched ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
                    <div className="p-2.5 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                  {sortedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Loading More Indicator */}
                <div ref={observerTarget} className="flex justify-center items-center py-12 sm:py-16">
                  {loading && fetched ? (
                    <div className="flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
                        <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-[#bc1215] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                      </div>
                      <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 font-medium">{t('loading')}</p>
                    </div>
                  ) : !hasMore && sortedProducts.length > 12 ? (
                    <div className="text-center py-8 border-t border-gray-200 dark:border-gray-800 mt-8 w-full">
                      <p className="text-gray-600 dark:text-gray-400">
                        You&apos;ve reached the end. Showing all {sortedProducts.length} products.
                      </p>
                    </div>
                  ) : (
                    <div className="h-16 sm:h-20"></div>
                  )}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-16 sm:py-24 px-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bc1215]/10 to-green-500/10 rounded-full blur-xl"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">{t('noProducts.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
                  {t('noProducts.message')}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 sm:px-8 py-3 sm:py-4 min-h-[48px] bg-gradient-to-r from-[#bc1215] to-[#8a0e10] hover:from-[#8a0e10] hover:to-[#bc1215] text-white font-semibold sm:font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl cursor-pointer text-sm sm:text-base"
                >
                  {t('noProducts.clearFilters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#bc1215] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
