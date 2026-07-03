'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAffiliate } from '@/hooks/useAffiliate';
import { useAffiliateApplication } from '@/hooks/useAffiliateApplication';
import toast, { Toaster } from 'react-hot-toast';

export default function AffiliateProductsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState<{id: number; name: string; slug: string}[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  const {
    products,
    loadingProducts,
    affiliate,
    fetchProducts,
    fetchDashboard,
  } = useAffiliate();

  const { checkAffiliateStatus } = useAffiliateApplication();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://hooknhunt-api.test/api/v2/store/categories');
        const data = await response.json();

        if (data.status && data.data?.data) {
          setCategories(data.data.data);
        } else {
          console.error('Failed to fetch categories:', data.message);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Check affiliate status and fetch products on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkAffiliateStatus().then(status => {
        // Redirect to application page if not an affiliate
        if (!status?.isAffiliate) {
          router.push('/account/affiliate/apply');
          return;
        }

        // Show pending message if not approved
        if (!status?.isApproved) {
          router.push('/account/affiliate');
          return;
        }

        // Fetch products and dashboard data
        fetchProducts();
        fetchDashboard();
      });
    }
  }, [isAuthenticated, checkAffiliateStatus, router, fetchProducts]);

  // Filter products based on category and search
  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    // Sort products based on selected option
    switch (sortBy) {
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'commission-high':
        return (b.commissionAmount || b.commission_amount || 0) - (a.commissionAmount || a.commission_amount || 0);
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const copyAffiliateLink = (productSlug: string) => {
    const referralCode = affiliate?.referralCode || affiliate?.referral_code || '';
    const affiliateLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hooknhunt.com'}/products/${productSlug}?ref=${referralCode}`;
    navigator.clipboard.writeText(affiliateLink);
    toast.success('অ্যাফিলিয়েট লিংক কপি করা হয়েছে!');
  };

  const copyProductLink = (productSlug: string) => {
    const productLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://hooknhunt.com'}/products/${productSlug}`;
    navigator.clipboard.writeText(productLink);
    toast.success('পণ্য লিংক কপি করা হয়েছে!');
  };


  // Loading state
  if (loadingProducts && products.length === 0) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto mb-4"></div>
          <p className="text-gray-600">পণ্য লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (products.length === 0) {
    return (
      <div className="flex-1">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-8">
          <div className="text-center">
            <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v18l-8-4 8-4"
            />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            কোনো পণ্য উপলব্ধ নেই
            </h3>
            <p className="text-gray-600 dark:text-gray-200">
            প্রচারের জন্য পণ্য পেতে পরবর্তে দেখুন।
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            অ্যাফিলিয়েট পণ্যসমূহ
            </h1>
            <p className="text-gray-600 dark:text-gray-200 mt-2">
            আপনার অ্যাফিলিয়েট লিংক সহ পণ্য ব্রাউজ এবং প্রচার করুন
            </p>
          </div>

          {/* Referral Code Display */}
          <div className="bg-[#ec3137] text-white px-4 py-2 rounded-lg">
            <p className="text-sm">
            আপনার কোড: <span className="font-bold">{affiliate?.referralCode || affiliate?.referral_code || 'N/A'}</span>
            </p>
          </div>
        </div>

            {/* Filters */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4">
            <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
            <input
            type="text"
            placeholder="পণ্য খুঁজুন..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
            />
            </div>

            {/* Category Filter */}
            <div className="md:w-64">
            <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={loadingCategories}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white disabled:opacity-50"
            >
            <option value="all">সব ক্যাটাগরি</option>
            {!loadingCategories && categories.map(category => (
            <option key={category.id} value={category.name}>
            {category.name}
            </option>
            ))}
            {loadingCategories && (
            <option>ক্যাটাগরি লোড হচ্ছে...</option>
            )}
            </select>
            </div>

            {/* Sort By */}
            <div className="md:w-48">
            <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
            >
            <option value="default">ডিফল্ট</option>
            <option value="price-low">মূল্য: কম থেকে বেশি</option>
            <option value="price-high">মূল্য: বেশি থেকে কম</option>
            <option value="commission-high">কমিশন: বেশি থেকে কম</option>
            <option value="name-asc">নাম: আ থেকে জেড</option>
            <option value="name-desc">নাম: জেড থেকে আ</option>
            </select>
            </div>

            {/* Results count */}
            <div className="md:w-auto flex items-center">
            <span className="text-sm text-gray-600 dark:text-gray-200">
            {filteredProducts.length} টি পণ্য
            </span>
            </div>
            </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden hover:shadow-md transition-shadow">
            {/* Product Image */}
            <div className="relative h-48 bg-gray-200 dark:bg-gray-700">
            {product.image ? (
            <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            />
            ) : (
            <div className="w-full h-full flex items-center justify-center">
            <svg
            className="w-16 h-16 text-gray-400 dark:text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            >
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
            </svg>
            </div>
            )}

            {/* Commission Rate Badge */}
            <div className="absolute top-2 right-2">
            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-[#ec3137] text-white">
            {product.commissionRate ?? product.commission_rate ?? 0}%
            </span>
            </div>
            </div>

            {/* Product Details */}
            <div className="p-4">
            {/* Category */}
            <p className="text-xs text-gray-500 dark:text-gray-200 mb-1">{product.category ?? 'N/A'}</p>

            {/* Product Name - Clickable Link */}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
            <a
            href={`/products/${product.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ec3137] dark:hover:text-[#ec3137] transition-colors"
            title="পণ্য পেজ দেখুন"
            >
            {product.name}
            </a>
            </h3>

            {/* Price and Commission */}
            <div className="mb-4 space-y-1">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {product.price > 0 ? `৳${(product.price ?? 0).toFixed(2)}` : 'মূল্য জানতে চানুন'}
            </div>
            <div className="text-lg font-bold text-[#ec3137]">
            কমিশন: ৳{(product.commissionAmount ?? product.commission_amount ?? 0).toFixed(2)}
            </div>
            </div>

            {/* Action Buttons */}
            <div>
            {/* Copy Affiliate Link */}
            <button
            onClick={() => copyAffiliateLink(product.slug)}
            className="w-full bg-[#ec3137] hover:bg-[#8a0f12] text-white text-xs font-medium py-1.5 px-3 rounded-md transition-colors flex items-center justify-center gap-1.5"
            >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2zm-10 0V2a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2z"
            />
            </svg>
            অ্যাফিলিয়েট লিংক কপি করুন
            </button>
            </div>
            </div>
            </div>
            ))}
            </div>

            {/* Empty State for Filtered Results */}
            {filteredProducts.length === 0 && products.length > 0 && (
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-8">
            <div className="text-center">
            <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            কোনো পণ্য পাওয়া যায়নি
            </h3>
            <p className="text-gray-600 dark:text-gray-200">
            আপনার অনুসন্ধান বা ফিল্টার পরিবর্তন করে দেখুন
            </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
