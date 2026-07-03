'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useReviewStore } from '@/stores/reviewStore';
import { Review } from '@/types';

/**
 * Product Reviews Component
 * Displays reviews related to a product in masonry grid
 * Supports infinite scroll and client-side rating filtering
 */
interface ProductReviewsProps {
  productSlug: string;
  productId: number;
}

export default function ProductReviews({ productSlug, productId }: ProductReviewsProps) {
  const {
    productReviews,
    productLoading,
    productHasMorePages,
    fetchProductReviews,
    loadMoreProductReviews,
    resetProductReviews,
    setRatingFilter,
    activeRatingFilter,
    getFilteredReviews,
  } = useReviewStore();

  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Initial fetch
  useEffect(() => {
    resetProductReviews();
    fetchProductReviews(productSlug, 1);

    return () => {
      resetProductReviews();
    };
  }, [productSlug]);

  // Filter reviews by selected ratings (client-side)
  const filteredReviews = productReviews.filter((review) => {
    if (selectedRatings.length === 0) return true;
    return selectedRatings.includes(review.rating);
  });

  // Toggle rating filter
  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) => {
      if (prev.includes(rating)) {
        return prev.filter((r) => r !== rating);
      } else {
        return [...prev, rating];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedRatings([]);
  };

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && productHasMorePages && !productLoading) {
          loadMoreProductReviews(productSlug);
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
  }, [productHasMorePages, productLoading, productSlug, loadMoreProductReviews]);

  if (filteredReviews.length === 0 && !productLoading) {
    return (
      <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#1f1515] p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm text-center">
        {/* Empty State Icon */}
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#bc1215]/10 to-[#8a0e10]/10 mb-4">
          <svg className="w-8 h-8 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
          No Reviews Yet
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-200 max-w-md mx-auto">
          Be the first to share your experience with this product. Your review helps other customers make informed decisions.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#1f1515] p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl shadow-sm">
      <div className="mb-6">
        <h2 className="text-heading-xl sm:text-heading-2xl font-bold text-gray-900 dark:text-white mb-2">
          Customer Reviews
        </h2>
        <p className="text-body-sm text-gray-600 dark:text-gray-200">
          See what customers are saying about this product
        </p>
      </div>

      {/* Rating Filter */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <span className="text-body-sm font-semibold text-gray-700 dark:text-gray-100 mr-2">
          Filter by rating:
        </span>
        {[5, 4, 3, 2, 1].map((rating) => {
          const isSelected = selectedRatings.includes(rating);
          const count = productReviews.filter((r) => r.rating === rating).length;

          return (
            <button
              key={rating}
              onClick={() => toggleRating(rating)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-[#ec3137] bg-[#ec3137] text-white'
                  : 'border-gray-300 dark:border-gray-400 text-gray-700 dark:text-gray-100 hover:border-[#ec3137] dark:hover:border-[#ec3137]'
              }`}
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-body-sm font-semibold">{rating}</span>
              <span className="text-label-xs">({count})</span>
            </button>
          );
        })}
        {selectedRatings.length > 0 && (
          <button
            onClick={clearFilters}
            className="ml-auto text-body-sm text-[#ec3137] hover:text-[#c41f24] font-semibold"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Reviews Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        {filteredReviews.map((review) => (
          <ProductReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Loading Spinner */}
      {productLoading && (
        <div className="flex justify-center py-8">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ec3137] border-t-transparent"></div>
            <span className="text-body-sm text-gray-600 dark:text-gray-200">Loading more reviews...</span>
          </div>
        </div>
      )}

      {/* Observer Target */}
      <div ref={observerTarget} className="h-10" />

      {/* No Results Message */}
      {filteredReviews.length === 0 && selectedRatings.length > 0 && (
        <div className="text-center py-12">
          <p className="text-body-md text-gray-600 dark:text-gray-200">
            No reviews match the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Product Review Card Component
 * Compact version for product page
 */
interface ProductReviewCardProps {
  review: Review;
}

function ProductReviewCard({ review }: ProductReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use new standardized image_url field, fall back to legacy screenshot fields
  const screenshotUrl = review.image_url || review.screenshot?.full_url || review.screenshot_url || '/placeholder-review.png';

  return (
    <div
      className="break-inside-avoid mb-4 group relative bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-none overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Screenshot */}
      <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 dark:bg-[#322020]">
        <Image
          src={screenshotUrl}
          alt={`Review - ${review.rating} stars`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Rating Badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-white dark:bg-[#2a2a2a]/95 dark:bg-[#322020]/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
          <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-label-sm font-bold text-gray-900 dark:text-white">{review.rating}</span>
        </div>

        {/* Text Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p className="text-white text-body-sm line-clamp-3 leading-relaxed">
              {review.review_text}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
