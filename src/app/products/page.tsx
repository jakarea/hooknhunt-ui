'use client';

import { useState, useEffect, useRef, useCallback, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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

// Price range configuration
const PRICE_RANGES = [
  { value: 'under-1000', label: 'under1000', min: 0, max: 1000 },
  { value: '1000-5000', label: '1000-5000', min: 1000, max: 5000 },
  { value: '5000-10000', label: '5000-10000', min: 5000, max: 10000 },
  { value: '10000-plus', label: '10000-plus', min: 10000, max: Infinity },
];

function ProductsPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category');
  const sortParam = searchParams.get('sort');
  const priceParam = searchParams.get('price');
  const ratingParam = searchParams.get('rating');

  // Initialize state from URL params
  const [selectedCategories, setSelectedCategories] = useState<string[]>(categoryParam ? [categoryParam] : ['all']);
  const [sortBy, setSortBy] = useState<string>(sortParam || 'best-selling');
  const [priceRange, setPriceRange] = useState<string[]>(priceParam ? priceParam.split(',') : []);
  const [minRating, setMinRating] = useState<number>(ratingParam ? parseInt(ratingParam) : 0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const categories = useCategoryStore((s) => s.categories);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);

  const products = useProductStore((s) => s.products);
  const loading = useProductStore((s) => s.loading);
  const hasMore = useProductStore((s) => s.hasMore);
  const fetched = useProductStore((s) => s.fetched);
  const currentPage = useProductStore((s) => s.currentPage);
  const totalPages = useProductStore((s) => s.totalPages);
  const total = useProductStore((s) => s.total);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  const loadMore = useProductStore((s) => s.loadMore);
  const observerTarget = useRef<HTMLDivElement>(null);

  const getCategoryId = useCallback((): number | undefined => {
    if (selectedCategories.includes('all') || selectedCategories.length === 0) return undefined;
    const cat = categories.find((c) => c.slug === selectedCategories[0]);
    return cat?.id;
  }, [selectedCategories, categories]);

  const buildFilters = useCallback((): ProductFilters => {
    const filters: ProductFilters = {};
    const categoryId = getCategoryId();
    if (categoryId) filters.category_id = categoryId;
    const apiSort = SORT_MAP[sortBy];
    if (apiSort) filters.sort_by = apiSort;
    return filters;
  }, [getCategoryId, sortBy]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts(buildFilters(), true);
  }, [buildFilters, fetchProducts]);

  // Sync state with URL params on mount
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    if (sortParam) {
      setSortBy(sortParam);
    }
    if (priceParam) {
      setPriceRange(priceParam.split(','));
    }
    if (ratingParam) {
      setMinRating(parseInt(ratingParam));
    }
  }, [categoryParam, sortParam, priceParam, ratingParam]);

  const filteredProducts = useMemo(() => {
    return products.filter((product: Product) => {
      // Rating filter
      if (minRating > 0 && (product.rating || 0) < minRating) {
        return false;
      }

      // Price range filter
      if (priceRange.length > 0) {
        const productPrice = product.price || product.actual_price || 0;
        const inRange = priceRange.some((range: string) => {
          const rangeConfig = PRICE_RANGES.find(r => r.value === range);
          if (!rangeConfig) return false;
          return productPrice >= rangeConfig.min && productPrice < rangeConfig.max;
        });
        if (!inRange) return false;
      }

      return true;
    });
  }, [products, priceRange, minRating, selectedCategories]);

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
  }, [filteredProducts, sortBy, products.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.01, rootMargin: '100px' }
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortDropdownOpen(false);
      }
    };

    if (isSortDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSortDropdownOpen]);

  const handlePriceRangeChange = (range: string) => {
    // Radio button behavior: only one price range at a time
    const newPriceRange = priceRange.includes(range)
      ? [] // If already selected, unselect it
      : [range]; // Otherwise, select only this one (replace previous)
    setPriceRange(newPriceRange);
    // Update URL with all current filters + new price range
    const params = new URLSearchParams();
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      params.set('category', selectedCategories[0]);
    }
    if (newPriceRange.length > 0) {
      params.set('price', newPriceRange[0]); // Only one price range
    }
    if (minRating > 0) {
      params.set('rating', minRating.toString());
    }
    if (sortBy !== 'best-selling') {
      params.set('sort', sortBy);
    }
    const newURL = params.toString() ? `/products?${params.toString()}` : '/products';
    router.replace(newURL, { scroll: false });
  };

  const handleCategoryChange = (categories: string[]) => {
    setSelectedCategories(categories);
    // Update URL immediately
    const params = new URLSearchParams();
    if (categories.length > 0 && !categories.includes('all')) {
      params.set('category', categories[0]);
    }
    if (priceRange.length > 0) {
      params.set('price', priceRange[0]); // Single price range
    }
    if (minRating > 0) {
      params.set('rating', minRating.toString());
    }
    if (sortBy !== 'best-selling') {
      params.set('sort', sortBy);
    }
    const newURL = params.toString() ? `/products?${params.toString()}` : '/products';
    router.replace(newURL, { scroll: false });
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    setIsSortDropdownOpen(false);
    // Update URL with all current filters + new sort
    const params = new URLSearchParams();
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      params.set('category', selectedCategories[0]);
    }
    if (priceRange.length > 0) {
      params.set('price', priceRange[0]); // Single price range
    }
    if (minRating > 0) {
      params.set('rating', minRating.toString());
    }
    if (sort !== 'best-selling') {
      params.set('sort', sort);
    }
    const newURL = params.toString() ? `/products?${params.toString()}` : '/products';
    router.replace(newURL, { scroll: false });
  };

  const handleRatingChange = (rating: number) => {
    // Radio button behavior: only one rating at a time
    const newRating = minRating === rating ? 0 : rating;
    setMinRating(newRating);
    // Update URL with all current filters + new rating
    const params = new URLSearchParams();
    if (selectedCategories.length > 0 && !selectedCategories.includes('all')) {
      params.set('category', selectedCategories[0]);
    }
    if (priceRange.length > 0) {
      params.set('price', priceRange[0]); // Single price range
    }
    if (newRating > 0) {
      params.set('rating', newRating.toString());
    }
    if (sortBy !== 'best-selling') {
      params.set('sort', sortBy);
    }
    const newURL = params.toString() ? `/products?${params.toString()}` : '/products';
    router.replace(newURL, { scroll: false });
  };

  const clearAllFilters = () => {
    // Reset all filter states
    setSelectedCategories(['all']);
    setPriceRange([]);
    setMinRating(0);
    setSortBy('best-selling');
    // Navigate to clean URL and trigger fetch with empty filters
    router.replace('/products', { scroll: false });
    // Force fetch all products by calling fetchProducts with empty filters
    setTimeout(() => {
      fetchProducts({}, true);
    }, 0);
  };

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(!isSidebarOpen);
  }, [isSidebarOpen]);

  const hasActiveFilters = !selectedCategories.includes('all') || selectedCategories.length > 1 || priceRange.length > 0 || minRating > 0;

  return (
    <div className="bg-[#fee1e1] min-h-screen">
      {/* Breadcrumb - Modern Style */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#bc1215]/5 to-transparent"></div>
        <div className="container px-3 md:px-4 relative py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-200 min-w-0 flex-1">
              <Link href="/" className="hover:text-[#bc1215] transition-colors font-medium" suppressHydrationWarning>{t('breadcrumb.home')}</Link>
              <svg className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 dark:text-white font-semibold truncate" suppressHydrationWarning>{t('breadcrumb.products')}</span>
              {!selectedCategories.includes('all') && selectedCategories.length === 1 && (
                <>
                  <svg className="w-4 h-4 mx-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span className="text-[#bc1215] font-semibold capitalize truncate">
                    {categories.find(c => c.slug === selectedCategories[0])?.name || selectedCategories[0]}
                  </span>
                </>
              )}
            </div>

            {/* Mobile Filter Toggle - Icon Only */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden relative flex items-center justify-center w-10 h-10 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white rounded-xl shadow-lg hover:shadow-xl transition-all z-50 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-white text-[#bc1215] text-xs font-bold rounded-full flex items-center justify-center">
                  {[!selectedCategories.includes('all') || selectedCategories.length > 1 ? 1 : 0, priceRange.length, minRating > 0 ? 1 : 0].reduce((a, b) => a + b, 0)}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="container px-3 md:px-4 py-4 sm:py-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar - Premium Design with Sticky */}
          <aside className={`
            fixed lg:sticky right-0 top-0 bottom-0 lg:inset-auto
            w-[75vw] max-w-[240px] lg:w-[240px] lg:max-w-[240px]
            flex-shrink-0
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
            z-50 lg:z-auto lg:top-4 lg:self-start
            overflow-y-auto lg:overflow-visible
          `}>
            {/* Mobile Backdrop */}
            <div className="lg:hidden absolute inset-0 bg-black/40 backdrop-blur-sm -z-10" onClick={() => setIsSidebarOpen(false)}></div>

            {/* Sidebar Content with Slide Animation */}
            <div className={`
              relative lg:static bg-white/95 dark:bg-[#0a0a0a]/98 backdrop-blur-md lg:bg-transparent lg:dark:bg-transparent
              p-4 lg:p-0 h-full lg:h-auto overflow-y-auto lg:overflow-visible shadow-2xl lg:shadow-none
              transition-transform duration-300 ease-out
              ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
            `}>
              {/* Mobile Close Button */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden absolute top-4 right-4 p-2 bg-white dark:bg-[#1a1a1a] rounded-full shadow-lg z-50"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="space-y-5 lg:space-y-6">
                {/* Active Filters - Modern Pills */}
                {hasActiveFilters && (
                  <div className="relative bg-gradient-to-br from-[#bc1215]/10 to-[#8a0e10]/5 backdrop-blur-sm border border-[#bc1215]/20 rounded-2xl p-4 overflow-hidden">
                    <div className="absolute -top-8 -right-8 w-20 h-20 bg-[#bc1215]/10 rounded-full blur-xl"></div>
                    <div className="relative">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning>
                          <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                          </svg>
                          {t('activeFilters')}
                        </h3>
                        <button
                          onClick={clearAllFilters}
                          className="text-xs sm:text-sm font-semibold text-[#bc1215] hover:text-[#8a0f12] transition-colors flex items-center gap-1"
                          suppressHydrationWarning
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
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
                                  handleCategoryChange(['all']);
                                } else {
                                  handleCategoryChange(newCategories);
                                }
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                            >
                              {t(getCategoryTranslationKey(category))}
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          );
                        })}
                        {priceRange.map(range => (
                          <button
                            key={range}
                            onClick={() => handlePriceRangeChange(range)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                          >
                            {range === 'under-1000' && '< ৳1,000'}
                            {range === '1000-5000' && '৳1,000-5,000'}
                            {range === '5000-10000' && '৳5,000-10,000'}
                            {range === '10000-plus' && '৳10,000+'}
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        ))}
                        {minRating > 0 && (
                          <button
                            onClick={() => handleRatingChange(0)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white text-xs sm:text-sm rounded-full shadow-md hover:shadow-lg transition-all"
                          >
                            {minRating}+ ★
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Categories Filter - Premium Card */}
                <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative bg-gradient-to-r from-[#bc1215]/10 to-[#8a0e10]/5 px-4 py-3.5 border-b border-gray-200/50 dark:border-gray-500/50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#bc1215]/5 rounded-full blur-xl"></div>
                    <h3 className="relative font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning>
                      <svg className="w-4 h-4 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                      </svg>
                      {t('categories')}
                    </h3>
                  </div>
                  <div className="p-3 space-y-1">
                    <button
                      onClick={() => handleCategoryChange(['all'])}
                      className={`w-full text-left px-3 py-2.5 min-h-[48px] transition-all duration-200 font-medium flex items-center justify-between rounded-xl ${selectedCategories.includes('all')
                        ? 'bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                        }`}
                    >
                      <span className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${selectedCategories.includes('all') ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          {selectedCategories.includes('all') && (
                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-sm" suppressHydrationWarning>{t('allProducts')}</span>
                      </span>
                    </button>
                    {categories.map(category => {
                      const isSelected = selectedCategories.includes(category.slug);
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            if (isSelected) {
                              // If already selected, unselect and go back to 'all'
                              handleCategoryChange(['all']);
                            } else {
                              // Select this category (radio behavior - only one at a time)
                              handleCategoryChange([category.slug]);
                            }
                          }}
                          className={`w-full text-left px-3 py-2.5 min-h-[48px] transition-all duration-200 flex items-center justify-between rounded-xl ${isSelected
                            ? 'bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white shadow-md'
                            : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100/50 dark:hover:bg-gray-800/50'
                            }`}
                        >
                          <span className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isSelected ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-700'}`}>
                              {isSelected && (
                                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-sm" suppressHydrationWarning>{t(getCategoryTranslationKey(category))}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Range - Modern Checkboxes */}
                <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative bg-gradient-to-r from-[#bc1215]/10 to-[#8a0e10]/5 px-4 py-3.5 border-b border-gray-200/50 dark:border-gray-500/50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#bc1215]/5 rounded-full blur-xl"></div>
                    <h3 className="relative font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning>
                      <svg className="w-4 h-4 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {t('priceRange')}
                    </h3>
                  </div>
                  <div className="p-3 space-y-1">
                    {PRICE_RANGES.map(option => (
                      <label key={option.value} className="flex items-center cursor-pointer group min-h-[44px] px-3 py-2 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 rounded-xl transition-all duration-200">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={priceRange.includes(option.value)}
                            onChange={() => handlePriceRangeChange(option.value)}
                            className="peer sr-only"
                          />
                          <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                            priceRange.includes(option.value)
                              ? 'bg-gradient-to-r from-[#bc1215] to-[#8a0e10] border-transparent'
                              : 'border-gray-300 dark:border-gray-600 group-hover:border-[#bc1215]/50'
                          }`}>
                            {priceRange.includes(option.value) && (
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </div>
                        </div>
                        <span className="ml-3 text-sm text-gray-700 dark:text-gray-100 group-hover:text-[#bc1215] transition-colors" suppressHydrationWarning>
                          {t(option.label)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Rating Filter - Star Based */}
                <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative bg-gradient-to-r from-[#bc1215]/10 to-[#8a0e10]/5 px-4 py-3.5 border-b border-gray-200/50 dark:border-gray-500/50 overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-[#bc1215]/5 rounded-full blur-xl"></div>
                    <h3 className="relative font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wider flex items-center gap-2" suppressHydrationWarning>
                      <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {t('customerRating')}
                    </h3>
                  </div>
                  <div className="p-3 space-y-1">
                    {[5, 4, 3, 2, 1].map(rating => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`w-full flex items-center px-3 py-2.5 min-h-[48px] transition-all duration-200 rounded-xl ${minRating === rating
                          ? 'bg-gradient-to-r from-[#bc1215]/10 to-[#8a0e10]/5 border-2 border-[#bc1215]/30 shadow-sm'
                          : 'hover:bg-gray-50/50 dark:hover:bg-gray-800/30 border-2 border-transparent'
                          }`}
                      >
                        <div className="flex items-center flex-1 gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4.5 h-4.5 transition-all ${i < rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                                }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-100" suppressHydrationWarning>{t('andUp')}</span>
                        </div>
                        {minRating === rating && (
                          <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Promo Banner - Gradient Style Like Homepage */}
                <div className="relative bg-gradient-to-br from-[#bc1215] to-[#8a0f12] p-5 rounded-2xl overflow-hidden shadow-lg">
                  <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                  <div className="relative">
                    <h3 className="font-bold text-white text-lg mb-2" suppressHydrationWarning>{t('specialOffer.title')}</h3>
                    <p className="text-sm text-white/90 mb-4 leading-relaxed" suppressHydrationWarning>
                      {t('specialOffer.description')}
                    </p>
                    <Link
                      href="/hot-deals"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#bc1215] font-semibold text-sm hover:bg-gray-100 transition-all rounded-xl shadow-md hover:shadow-lg"
                      suppressHydrationWarning
                    >
                      {t('specialOffer.viewDeals')}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 relative z-10">
            {/* Sort Bar - Modern */}
            <div className="relative bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm rounded-2xl p-3 md:p-4 mb-3 md:mb-4 border border-gray-200/50 dark:border-gray-500/50 shadow-sm z-10">
              <div className="flex flex-col sm:flex-row justify-end items-start sm:items-center gap-2 sm:gap-4">
                {/* Sort By - Moved to right */}
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <label className="text-xs sm:text-sm text-gray-700 dark:text-gray-100 font-semibold whitespace-nowrap flex items-center gap-1.5 sm:gap-2" suppressHydrationWarning>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4h4m-4 4v-4m0 4l-4 4" />
                    </svg>
                    {t('sortBy')}
                  </label>

                  {/* Custom Sort Dropdown */}
                  <div className="relative z-50 isolate flex-1 sm:flex-initial" ref={sortDropdownRef}>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                      className="flex items-center justify-between gap-2 px-3 py-2 h-9 sm:h-auto sm:px-4 sm:py-2.5 sm:min-h-[44px] border-2 border-gray-200 dark:border-gray-500 bg-white dark:bg-[#0a0a0a] text-gray-900 dark:text-white focus:ring-2 focus:ring-[#bc1215]/20 focus:border-[#bc1215] outline-none rounded-xl font-medium shadow-sm hover:shadow-md hover:border-[#bc1215]/30 transition-all cursor-pointer text-xs sm:text-sm w-full sm:w-auto sm:min-w-[180px] relative z-50"
                    >
                      <span suppressHydrationWarning>{t(`sortOptions.${sortBy === 'best-selling' ? 'bestSelling' : sortBy === 'price-low' ? 'priceLow' : sortBy === 'price-high' ? 'priceHigh' : sortBy}`)}</span>
                      <svg
                        className={`w-4 h-4 text-[#bc1215] transition-transform duration-200 ${isSortDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Dropdown Menu */}
                    {isSortDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-full bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-500 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn">
                        <div className="py-1">
                          {[
                            { value: 'best-selling', label: 'sortOptions.bestSelling', icon: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' },
                            { value: 'newest', label: 'sortOptions.newest', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { value: 'discount', label: 'sortOptions.discount', icon: 'M12 8c-1.657 0-3 .895-3 2s.895 2 3 2 3-.895 3-2-.895-2-3-2zm0 0c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { value: 'price-low', label: 'sortOptions.priceLow', icon: 'M3 4h6l6 8h4l-6-8H3zm0 0v12' },
                            { value: 'price-high', label: 'sortOptions.priceHigh', icon: 'M3 4h6l6 8h4l-6-8H3zm0 0v12' },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleSortChange(option.value)}
                              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-all ${
                                sortBy === option.value
                                  ? 'bg-gradient-to-r from-[#bc1215]/10 to-[#8a0e10]/5 text-[#bc1215] font-semibold'
                                  : 'text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
                              }`}
                            >
                              <svg className={`w-4 h-4 flex-shrink-0 ${sortBy === option.value ? 'text-[#bc1215]' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={option.icon} />
                              </svg>
                              <span className="flex-1 text-left" suppressHydrationWarning>{t(option.label)}</span>
                              {sortBy === option.value && (
                                <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skeleton Loading */}
            {loading && !fetched ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl overflow-hidden">
                    <div className="aspect-square bg-gray-200/70 dark:bg-gray-700/50 animate-pulse" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200/70 dark:bg-gray-700/50 rounded animate-pulse w-3/4" />
                      <div className="h-4 bg-gray-200/70 dark:bg-gray-700/50 rounded animate-pulse w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedProducts.length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 lg:gap-4">
                  {sortedProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="animate-fadeInUp"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>

                {/* Loading More Indicator with Skeleton */}
                <div ref={observerTarget} className="flex justify-center items-center py-12 sm:py-16 min-h-[100px]">
                  {loading && fetched ? (
                    <div className="w-full grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-3">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-500/50 rounded-xl overflow-hidden opacity-60">
                          <div className="aspect-square bg-gray-200/70 dark:bg-gray-700/50 animate-pulse" />
                          <div className="p-3 space-y-2">
                            <div className="h-4 bg-gray-200/70 dark:bg-gray-700/50 rounded animate-pulse w-3/4" />
                            <div className="h-4 bg-gray-200/70 dark:bg-gray-700/50 rounded animate-pulse w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : !hasMore && products.length > 0 ? (
                    <div className="text-center py-8 w-full">
                      <p className="text-gray-500 dark:text-gray-200 text-sm" suppressHydrationWarning>
                        {t('products.noMoreProducts', { defaultValue: 'You\'ve reached the end' })}
                      </p>
                    </div>
                  ) : hasMore ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span suppressHydrationWarning>{t('products.scrollForMore', { defaultValue: 'Scroll for more' })}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </>
            ) : (
              /* Empty State - Modern */
              <div className="text-center py-16 sm:py-24 px-4">
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#bc1215]/20 to-[#8a0e10]/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center shadow-xl">
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
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4" suppressHydrationWarning>{t('noProducts.title')}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed" suppressHydrationWarning>
                  {t('noProducts.message')}
                </p>
                <button
                  onClick={clearAllFilters}
                  className="group relative overflow-hidden px-8 py-3.5 min-h-[52px] text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                  suppressHydrationWarning
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] transition-transform duration-300 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-20"></div>
                  <span className="relative flex items-center gap-2" suppressHydrationWarning>
                    {t('noProducts.clearFilters')}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fee1e1] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full mx-auto"></div>
            <div className="w-16 h-16 border-4 border-[#bc1215] border-t-transparent rounded-full animate-spin absolute top-0 left-0 mx-auto"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading products...</p>
        </div>
      </div>
    }>
      <ProductsPageContent />
    </Suspense>
  );
}
