'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Image from 'next/image';
import api from '@/lib/api';

interface Review {
  id: number;
  screenshot_id: number | null;
  review_text: string;
  rating: number;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  screenshot: { id: number; full_url: string } | null;
  products: Array<{ id: number; name: string; slug: string }>;
}

interface Product {
  id: number;
  name: string;
  slug: string;
}

/**
 * Admin Reviews Page
 * CRUD operations for customer reviews
 */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<{
    screenshot_id: number | null;
    review_text: string;
    rating: number;
    is_featured: boolean;
    sort_order: number;
    product_ids: number[];
  }>();

  const selectedProducts = watch('product_ids') || [];

  // Fetch reviews and products
  useEffect(() => {
    fetchReviews();
    fetchProducts();
  }, []);

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await api.getAdminReviews({ per_page: 100, search: searchTerm }) as any;
      const reviewsData = response.data?.data || response.data;
      setReviews(Array.isArray(reviewsData) ? reviewsData : []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for multi-select
  const fetchProducts = async (search = '') => {
    try {
      const response = await api.getProducts({ search, per_page: 50 }) as any;
      const productsData = response.data?.data || response.data;
      setProducts(Array.isArray(productsData) ? productsData : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  // Open modal for new review
  const openNewModal = () => {
    setEditingReview(null);
    reset();
    setValue('product_ids', []);
    setValue('rating', 5);
    setValue('is_featured', false);
    setValue('sort_order', 0);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const openEditModal = (review: Review) => {
    setEditingReview(review);
    setValue('screenshot_id', review.screenshot_id);
    setValue('review_text', review.review_text);
    setValue('rating', review.rating);
    setValue('is_featured', review.is_featured);
    setValue('sort_order', review.sort_order);
    setValue('product_ids', review.products.map((p) => p.id));
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingReview(null);
    reset();
  };

  // Submit form
  const onSubmit = async (data: any) => {
    try {
      if (editingReview) {
        await api.updateReview(editingReview.id, data);
      } else {
        await api.createReview(data);
      }
      closeModal();
      fetchReviews();
    } catch (error: any) {
      console.error('Failed to save review:', error.response?.data?.message || error.message);
      alert('Failed to save review: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete review
  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(id);
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
      alert('Failed to delete review');
    }
  };

  // Toggle featured status
  const toggleFeatured = async (review: Review) => {
    try {
      await api.toggleReviewFeatured(review.id);
      fetchReviews();
    } catch (error) {
      console.error('Failed to toggle featured:', error);
    }
  };

  // Render stars
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Reviews</h1>
          <p className="text-gray-600">Manage customer reviews from various platforms</p>
        </div>
        <button
          onClick={openNewModal}
          className="px-6 py-3 bg-[#ec3137] hover:bg-[#c41f24] text-white font-semibold rounded-lg transition-colors"
        >
          Add Review
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search reviews..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-transparent"
        />
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[#ec3137] border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews
            .filter(
              (review) =>
                !searchTerm ||
                review.review_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                review.products.some((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-[#2a2a2a] border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Screenshot */}
                <div className="relative aspect-[4/3] bg-gray-100">
                  {review.screenshot ? (
                    <Image
                      src={review.screenshot.full_url}
                      alt="Review screenshot"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      No screenshot
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className="absolute top-2 right-2 bg-white dark:bg-[#2a2a2a]/95 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                    {renderStars(review.rating)}
                  </div>

                  {/* Featured Badge */}
                  {review.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold shadow-md">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  <p className="text-gray-700 line-clamp-3 mb-3">{review.review_text}</p>

                  {/* Linked Products */}
                  {review.products.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Linked Products:</p>
                      <div className="flex flex-wrap gap-1">
                        {review.products.map((product) => (
                          <span
                            key={product.id}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {product.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(review)}
                        className="px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.id)}
                        className="px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                    <button
                      onClick={() => toggleFeatured(review)}
                      className={`px-3 py-1.5 text-sm rounded transition-colors ${
                        review.is_featured
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {review.is_featured ? 'Unfeature' : 'Feature'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#2a2a2a] rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingReview ? 'Edit Review' : 'Add New Review'}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              {/* Screenshot */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshot (from Media Library)
                </label>
                <input
                  type="number"
                  {...register('screenshot_id')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-transparent"
                  placeholder="Enter media ID"
                />
                {errors.screenshot_id && (
                  <p className="text-red-600 text-sm mt-1">{errors.screenshot_id.message}</p>
                )}
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Review Text *
                </label>
                <textarea
                  {...register('review_text', { required: 'Review text is required' })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-transparent"
                  placeholder="Enter review text..."
                />
                {errors.review_text && (
                  <p className="text-red-600 text-sm mt-1">{errors.review_text.message}</p>
                )}
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setValue('rating', rating)}
                      className={`px-4 py-2 border-2 rounded-lg transition-all ${
                        watch('rating') === rating
                          ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                          : 'border-gray-300 text-gray-400 hover:border-yellow-400'
                      }`}
                    >
                      {rating} ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Products Multi-Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Linked Products
                </label>
                <input
                  type="text"
                  placeholder="Search products..."
                  onChange={(e) => fetchProducts(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-transparent mb-2"
                />
                <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {products.map((product) => (
                    <label
                      key={product.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        value={product.id}
                        checked={selectedProducts.includes(product.id)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setValue(
                            'product_ids',
                            checked
                              ? [...selectedProducts, product.id]
                              : selectedProducts.filter((id) => id !== product.id)
                          );
                        }}
                        className="w-4 h-4 text-[#ec3137] rounded focus:ring-[#ec3137]"
                      />
                      <span className="text-sm text-gray-700">{product.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 text-[#ec3137] rounded focus:ring-[#ec3137]"
                />
                <label className="text-sm font-medium text-gray-700">
                  Featured Review (shows on homepage)
                </label>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Order (for featured reviews)
                </label>
                <input
                  type="number"
                  {...register('sort_order', { valueAsNumber: true })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-transparent"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-[#ec3137] hover:bg-[#c41f24] text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Saving...' : editingReview ? 'Update' : 'Create'} Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
