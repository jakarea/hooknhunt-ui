'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReviewStore } from '@/stores/reviewStore';
import { useTranslation } from 'react-i18next';
import { Review } from '@/types';
import { getUrlFromObject } from '@/lib/utils';

/**
 * Reviews Page
 * Masonry grid layout with infinite scroll
 * Shows only screenshots initially
 */
export default function ReviewsPage() {
  const { t } = useTranslation();
  const {
    reviews,
    loading,
    hasMorePages,
    fetchReviews,
    loadMoreReviews,
    resetReviews,
  } = useReviewStore();

  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    resetReviews();
    fetchReviews(1);

    return () => {
      resetReviews();
    };
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMorePages && !loading) {
          loadMoreReviews();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
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
  }, [hasMorePages, loading, loadMoreReviews]);

  return (
    <div className="bg-gray-50 dark:bg-[#0f0f0f] min-h-screen">
      {/* Header */}
      <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-400">
        <div className="container py-8 sm:py-12">
          <h1 className="text-heading-2xl sm:text-heading-3xl font-bold text-gray-900 dark:text-white mb-2">
            গ্রাহক রিভিউ
          </h1>
          <p className="text-body-md text-gray-600 dark:text-gray-200">
            আমাদের গ্রাহকরা আমাদের সম্পর্কে কী বলছেন তা দেখুন
          </p>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="container py-8 sm:py-12">
        {reviews.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-[#1a1a1a] rounded-full mb-4">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h3 className="text-heading-lg font-semibold text-gray-900 dark:text-white mb-2">
              এখনো কোনো রিভিউ নেই
            </h3>
            <p className="text-body-md text-gray-600 dark:text-gray-200">
              প্রথম রিভিউ দিন!
            </p>
          </div>
        )}

        {/* Masonry Grid */}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 sm:gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-[#2a2a2a] dark:bg-[#1a1a1a] rounded-full shadow-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ec3137] border-t-transparent"></div>
              <span className="text-body-sm font-medium text-gray-700 dark:text-gray-100">
                রিভিউ লোড হচ্ছে...
              </span>
            </div>
          </div>
        )}

        {/* Observer Target for Infinite Scroll */}
        <div ref={observerTarget} className="h-10" />

        {/* End of List */}
        {!hasMorePages && reviews.length > 0 && (
          <div className="text-center py-8">
            <p className="text-body-sm text-gray-500 dark:text-gray-200">
              আপনি শেষ পর্যন্ত পৌঁছেছেন
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Review Card Component
 * Displays screenshot in masonry grid
 */
interface ReviewCardProps {
  review: Review;
}

function ReviewCard({ review }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle both nested object and direct url formats (API returns camelCase: fullUrl, screenshotUrl)
  // Use getUrlFromObject to handle multiple possible keys and normalize the URL
  const screenshotUrl = getUrlFromObject(review, [
    'screenshot.fullUrl',
    'screenshotUrl',
    'screenshot.full_url',
    'screenshot_url',
    'image_url',
    'imageUrl',
  ]) || '/placeholder-review.png';

  return (
    <div
      className="break-inside-avoid mb-4 sm:mb-6 group relative bg-white dark:bg-[#2a2a2a] dark:bg-[#1a1a1a] rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Screenshot Image */}
      <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
        <Image
          src={screenshotUrl}
          alt={`Customer review - ${review.rating} stars`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Rating Badge Overlay */}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white dark:bg-[#2a2a2a]/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg">
          <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-body-sm font-bold text-gray-900 dark:text-white">
            {review.rating}
          </span>
        </div>

        {/* Hover Overlay - Shows Review Text */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
            <p className="text-white text-body-sm line-clamp-4 sm:line-clamp-6 leading-relaxed">
              {review.review_text}
            </p>
            {review.products && review.products.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {review.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#ec3137] hover:bg-[#c41f24] text-white text-label-sm font-semibold rounded-full transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    পণ্য দেখুন
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
