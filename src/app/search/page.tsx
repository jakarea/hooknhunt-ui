'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/product/ProductCard';

function SearchPageContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (query.trim().length >= 2) {
      fetchProducts();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.searchProducts({
        q: query,
        page: currentPage,
        per_page: 24,
      }) as any;

      // Handle response structure:
      // { status: true, message: "...", data: { data: [...], total, current_page, last_page } }
      if (response?.data?.data && Array.isArray(response.data.data)) {
        setProducts(response.data.data);
        setTotalPages(response.data.last_page || 1);
        setTotalCount(response.data.total || 0);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Header Section */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-500">
        <div className="container py-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Search Results
          </h1>
          {query && (
            <p className="text-gray-600 dark:text-gray-200">
              Showing results for "<span className="font-semibold text-[#bc1215]">{query}</span>"
              {totalCount > 0 && <span> ({totalCount} found)</span>}
            </p>
          )}
        </div>
      </div>

      {/* Products Grid */}
      <div className="container py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1a1a1a] rounded-lg p-4 animate-pulse">
                <div className="bg-gray-200 dark:bg-gray-700 h-40 rounded mb-4"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 dark:bg-gray-700 h-4 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-100">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-200 mb-6">
                We couldn't find any products matching your search. Try different keywords or browse our categories.
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-[#bc1215] text-white font-semibold rounded-md hover:bg-[#8a0e10] transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#bc1215] border-t-transparent"></div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
