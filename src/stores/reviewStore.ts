import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';

// ============================================
// TYPES
// ============================================

export interface ReviewProduct {
  id: number;
  name: string;
  slug: string;
}

export interface ReviewScreenshot {
  id: number;
  full_url: string;
}

export interface Review {
  id: number;
  screenshot_id: number | null;
  review_text: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  screenshot: ReviewScreenshot | null;
  screenshot_url?: string | null;
  products: ReviewProduct[];
}

export interface ReviewFilters {
  rating?: number;
  product_id?: number;
}

export interface ReviewsResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    has_more_pages: boolean;
  };
}

// ============================================
// STORE INTERFACE
// ============================================

interface ReviewStore {
  // All reviews (for /reviews page)
  reviews: Review[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  total: number;
  hasMorePages: boolean;

  // Product reviews (for product detail page)
  productReviews: Review[];
  productLoading: boolean;
  productError: string | null;
  productCurrentPage: number;
  productLastPage: number;
  productTotal: number;
  productHasMorePages: boolean;

  // Featured reviews (for homepage)
  featuredReviews: Review[];
  featuredLoading: boolean;

  // Active filters
  activeRatingFilter: number | null;

  // Actions - All Reviews
  fetchReviews: (page?: number, filters?: ReviewFilters) => Promise<void>;
  loadMoreReviews: (filters?: ReviewFilters) => Promise<void>;
  resetReviews: () => void;
  setRatingFilter: (rating: number | null) => void;

  // Actions - Product Reviews
  fetchProductReviews: (productSlug: string, page?: number) => Promise<void>;
  loadMoreProductReviews: (productSlug: string) => Promise<void>;
  resetProductReviews: () => void;

  // Actions - Featured Reviews
  fetchFeaturedReviews: (limit?: number) => Promise<void>;

  // Utility
  getFilteredReviews: () => Review[];
}

// ============================================
// STORE IMPLEMENTATION
// ============================================

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      // Initial State
      reviews: [],
      loading: false,
      error: null,
      currentPage: 1,
      lastPage: 1,
      total: 0,
      hasMorePages: true,

      productReviews: [],
      productLoading: false,
      productError: null,
      productCurrentPage: 1,
      productLastPage: 1,
      productTotal: 0,
      productHasMorePages: true,

      featuredReviews: [],
      featuredLoading: false,

      activeRatingFilter: null,

      // Fetch reviews with optional filters
      fetchReviews: async (page = 1, filters?: ReviewFilters) => {
        set({ loading: true, error: null });

        try {
          const params: Record<string, string | number> = {
            page,
            per_page: 12,
          };

          if (filters?.rating) {
            params.rating = filters.rating;
          }
          if (filters?.product_id) {
            params.product_id = filters.product_id;
          }

          const response = await api.getReviews(params) as any;
          const reviewsData = response.data?.data || response.data;

          set({
            reviews: Array.isArray(reviewsData) ? reviewsData : [],
            loading: false,
            currentPage: response?.meta?.current_page || page,
            lastPage: response?.meta?.last_page || page,
            total: response?.meta?.total || 0,
            hasMorePages: response?.meta?.last_page ? page < response.meta.last_page : false,
          });
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Failed to fetch reviews',
          });
        }
      },

      // Load more reviews (infinite scroll)
      loadMoreReviews: async (filters?: ReviewFilters) => {
        const { currentPage, lastPage, hasMorePages } = get();

        if (!hasMorePages || currentPage >= lastPage) {
          return;
        }

        set({ loading: true });

        try {
          const params: Record<string, string | number> = {
            page: currentPage + 1,
            per_page: 12,
          };

          if (filters?.rating) {
            params.rating = filters.rating;
          }
          if (filters?.product_id) {
            params.product_id = filters.product_id;
          }

          const response = await api.getReviews(params) as any;
          const reviewsData = response.data?.data || response.data;

          set((state) => ({
            reviews: [...state.reviews, ...(Array.isArray(reviewsData) ? reviewsData : [])],
            loading: false,
            currentPage: response?.meta?.current_page || currentPage + 1,
            lastPage: response?.meta?.last_page || lastPage,
            total: response?.meta?.total || state.total,
            hasMorePages: response?.meta?.last_page ? (currentPage + 1) < response.meta.last_page : false,
          }));
        } catch (error: any) {
          set({
            loading: false,
            error: error.response?.data?.message || 'Failed to load more reviews',
          });
        }
      },

      // Reset reviews state
      resetReviews: () => {
        set({
          reviews: [],
          loading: false,
          error: null,
          currentPage: 1,
          lastPage: 1,
          total: 0,
          hasMorePages: true,
          activeRatingFilter: null,
        });
      },

      // Set rating filter
      setRatingFilter: (rating: number | null) => {
        set({ activeRatingFilter: rating });
      },

      // Get filtered reviews (client-side)
      getFilteredReviews: () => {
        const { reviews, activeRatingFilter } = get();

        if (activeRatingFilter === null) {
          return reviews;
        }

        return reviews.filter((review) => review.rating === activeRatingFilter);
      },

      // Fetch product reviews
      fetchProductReviews: async (productSlug: string, page = 1) => {
        set({ productLoading: true, productError: null });

        try {
          const response = await api.getProductReviews(productSlug, { page, per_page: 12 }) as any;
          const reviewsData = response.data?.data || response.data;

          set({
            productReviews: Array.isArray(reviewsData) ? reviewsData : [],
            productLoading: false,
            productCurrentPage: response?.meta?.current_page || page,
            productLastPage: response?.meta?.last_page || page,
            productTotal: response?.meta?.total || 0,
            productHasMorePages: response?.meta?.last_page ? page < response.meta.last_page : false,
          });
        } catch (error: any) {
          set({
            productLoading: false,
            productError: error.response?.data?.message || 'Failed to fetch product reviews',
          });
        }
      },

      // Load more product reviews
      loadMoreProductReviews: async (productSlug: string) => {
        const { productCurrentPage, productLastPage, productHasMorePages } = get();

        if (!productHasMorePages || productCurrentPage >= productLastPage) {
          return;
        }

        set({ productLoading: true });

        try {
          const response = await api.getProductReviews(productSlug, {
            page: productCurrentPage + 1,
            per_page: 12
          }) as any;
          const reviewsData = response.data?.data || response.data;

          set((state) => ({
            productReviews: [...state.productReviews, ...(Array.isArray(reviewsData) ? reviewsData : [])],
            productLoading: false,
            productCurrentPage: response?.meta?.current_page || productCurrentPage + 1,
            productLastPage: response?.meta?.last_page || productLastPage,
            productTotal: response?.meta?.total || state.productTotal,
            productHasMorePages: response?.meta?.last_page ? (productCurrentPage + 1) < response.meta.last_page : false,
          }));
        } catch (error: any) {
          set({
            productLoading: false,
            productError: error.response?.data?.message || 'Failed to load more reviews',
          });
        }
      },

      // Reset product reviews
      resetProductReviews: () => {
        set({
          productReviews: [],
          productLoading: false,
          productError: null,
          productCurrentPage: 1,
          productLastPage: 1,
          productTotal: 0,
          productHasMorePages: true,
        });
      },

      // Fetch featured reviews
      fetchFeaturedReviews: async (limit = 6) => {
        set({ featuredLoading: true });

        try {
          const response = await api.getFeaturedReviews(limit) as any;
          const reviewsData = response.data?.data || response.data;

          set({
            featuredReviews: Array.isArray(reviewsData) ? reviewsData : [],
            featuredLoading: false,
          });
        } catch (error: any) {
          console.error('Failed to fetch featured reviews:', error);
          set({ featuredLoading: false });
        }
      },
    }),
    {
      name: 'review-store',
      partialize: (state) => ({
        activeRatingFilter: state.activeRatingFilter,
      }),
    }
  )
);

// Selectors for cleaner component usage
export const selectReviews = (state: ReviewStore) => state.reviews;
export const selectProductReviews = (state: ReviewStore) => state.productReviews;
export const selectFeaturedReviews = (state: ReviewStore) => state.featuredReviews;
export const selectLoading = (state: ReviewStore) => state.loading;
export const selectProductLoading = (state: ReviewStore) => state.productLoading;
export const selectHasMorePages = (state: ReviewStore) => state.hasMorePages;
export const selectProductHasMorePages = (state: ReviewStore) => state.productHasMorePages;
export const selectActiveRatingFilter = (state: ReviewStore) => state.activeRatingFilter;
