'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

interface Discount {
  id: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed_amount' | 'shipping';
  amount: number;
  maxDiscountAmount: number | null;
  minPurchaseAmount: number | null;
  startsAt: string | null;
  expiresAt: string | null;
  maxUses: number | null;
  usageLimitPerCustomer: number | null;
  usedCount: number;
  isActive: boolean;
  isAutoApply: boolean;
  firstPurchaseOnly: boolean;
  productIds: number[];
  categoryIds: number[];
  customerIds: number[];
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  code: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'shipping';
  amount: number;
  max_discount_amount: number;
  min_purchase_amount: number;
  starts_at: string;
  expires_at: string;
  max_uses: number;
  usage_limit_per_customer: number;
  is_active: boolean;
  is_auto_apply: boolean;
  first_purchase_only: boolean;
  product_ids: string;
  category_ids: string;
  customer_ids: string;
}

export default function EditCouponPage() {
  const router = useRouter();
  const params = useParams();
  const couponId = params.id as string;

  const [discount, setDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    code: '',
    description: '',
    type: 'percentage',
    amount: 0,
    max_discount_amount: 0,
    min_purchase_amount: 0,
    starts_at: '',
    expires_at: '',
    max_uses: 0,
    usage_limit_per_customer: 0,
    is_active: true,
    is_auto_apply: false,
    first_purchase_only: false,
    product_ids: '',
    category_ids: '',
    customer_ids: '',
  });

  const fetchDiscount = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts/${couponId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        const data = result.data as Discount;
        setDiscount(data);

        // Populate form data
        setFormData({
          code: data.code,
          description: data.description || '',
          type: data.type,
          amount: data.amount,
          max_discount_amount: data.maxDiscountAmount || 0,
          min_purchase_amount: data.minPurchaseAmount || 0,
          starts_at: data.startsAt ? data.startsAt.split('T')[0] : '',
          expires_at: data.expiresAt ? data.expiresAt.split('T')[0] : '',
          max_uses: data.maxUses || 0,
          usage_limit_per_customer: data.usageLimitPerCustomer || 0,
          is_active: data.isActive,
          is_auto_apply: data.isAutoApply,
          first_purchase_only: data.firstPurchaseOnly,
          product_ids: data.productIds?.join(',') || '',
          category_ids: data.categoryIds?.join(',') || '',
          customer_ids: data.customerIds?.join(',') || '',
        });
      } else if (response.status === 404) {
        setNotFound(true);
      } else {
        throw new Error('Failed to fetch coupon');
      }
    } catch (err) {
      console.error('Error fetching coupon:', err);
      setError('Failed to load coupon details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscount();
  }, [couponId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? target.checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const token = localStorage.getItem('auth_token');

      const data = {
        ...formData,
        product_ids: formData.product_ids ? formData.product_ids.split(',').map(id => id.trim()).filter(Boolean) : [],
        category_ids: formData.category_ids ? formData.category_ids.split(',').map(id => id.trim()).filter(Boolean) : [],
        customer_ids: formData.customer_ids ? formData.customer_ids.split(',').map(id => id.trim()).filter(Boolean) : [],
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts/${couponId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push('/admin/catalog/coupons');
      } else {
        const result = await response.json();
        setError(result.message || 'Failed to update coupon');
      }
    } catch (err) {
      console.error('Error updating coupon:', err);
      setError('Failed to update coupon. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec3137]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-200">Loading coupon details...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Coupon Not Found</h1>
        <p className="text-gray-600 dark:text-gray-200 mb-6">The coupon you're looking for doesn't exist or has been deleted.</p>
        <Link
          href="/admin/catalog/coupons"
          className="inline-block bg-[#ec3137] text-white px-6 py-3 rounded-lg hover:bg-[#d42a35] transition-colors"
        >
          Back to Coupons
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/admin/catalog/coupons"
          className="text-[#ec3137] hover:text-[#d42a35] dark:text-[#ff6b6b] dark:hover:text-[#ff5252] inline-flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Coupons
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-4">Edit Coupon</h1>
        <p className="text-gray-600 dark:text-gray-200 mt-1">Update coupon details and settings</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-md p-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., SUMMER20"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white uppercase"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Unique code for the coupon (will be converted to uppercase)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Discount Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed_amount">Fixed Amount Discount</option>
                  <option value="shipping">Free Shipping</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Discount Value *
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder={formData.type === 'percentage' ? 'e.g., 20' : 'e.g., 100'}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
                  {formData.type === 'percentage' ? 'Percentage value (e.g., 20 for 20% off)' : 'Fixed amount in BDT'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of this coupon..."
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Usage Statistics */}
          {discount && (
            <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-100 mb-3">Usage Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-200">Total Used</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">{discount.usedCount}</div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-200">Remaining</div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {discount.maxUses ? discount.maxUses - discount.usedCount : '∞'}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-200">Created</div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(discount.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-200">Last Updated</div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    {new Date(discount.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Limits & Restrictions */}
          <div className="border-t border-gray-200 dark:border-gray-400 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Limits & Restrictions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Minimum Purchase Amount
                </label>
                <input
                  type="number"
                  name="min_purchase_amount"
                  value={formData.min_purchase_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Minimum order value to use this coupon (leave 0 for no minimum)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Maximum Discount Amount
                </label>
                <input
                  type="number"
                  name="max_discount_amount"
                  value={formData.max_discount_amount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Maximum discount cap in BDT (for percentage coupons)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Total Usage Limit
                </label>
                <input
                  type="number"
                  name="max_uses"
                  value={formData.max_uses}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Maximum times this coupon can be used (leave 0 for unlimited)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Per Customer Usage Limit
                </label>
                <input
                  type="number"
                  name="usage_limit_per_customer"
                  value={formData.usage_limit_per_customer}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Maximum times each customer can use this coupon</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  name="starts_at"
                  value={formData.starts_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div className="border-t border-gray-200 dark:border-gray-400 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Targeting (Optional)</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Product IDs (comma separated)
                </label>
                <input
                  type="text"
                  name="product_ids"
                  value={formData.product_ids}
                  onChange={handleChange}
                  placeholder="e.g., 1,2,3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Restrict coupon to specific products</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Category IDs (comma separated)
                </label>
                <input
                  type="text"
                  name="category_ids"
                  value={formData.category_ids}
                  onChange={handleChange}
                  placeholder="e.g., 1,2,3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Restrict coupon to specific categories</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  Customer IDs (comma separated)
                </label>
                <input
                  type="text"
                  name="customer_ids"
                  value={formData.customer_ids}
                  onChange={handleChange}
                  placeholder="e.g., 1,2,3"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-[#1a1a1a] dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">Restrict coupon to specific customers</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="border-t border-gray-200 dark:border-gray-400 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_active"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#ec3137] focus:ring-[#ec3137] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-3 text-sm text-gray-700 dark:text-gray-100">
                  Active (coupon is enabled and can be used)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="is_auto_apply"
                  id="is_auto_apply"
                  checked={formData.is_auto_apply}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#ec3137] focus:ring-[#ec3137] border-gray-300 rounded"
                />
                <label htmlFor="is_auto_apply" className="ml-3 text-sm text-gray-700 dark:text-gray-100">
                  Auto Apply (automatically apply best coupon at checkout)
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="first_purchase_only"
                  id="first_purchase_only"
                  checked={formData.first_purchase_only}
                  onChange={handleChange}
                  className="h-4 w-4 text-[#ec3137] focus:ring-[#ec3137] border-gray-300 rounded"
                />
                <label htmlFor="first_purchase_only" className="ml-3 text-sm text-gray-700 dark:text-gray-100">
                  First Purchase Only (only for new customers)
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 dark:border-gray-400 pt-6 flex justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Are you sure you want to delete this coupon?')) {
                  const token = localStorage.getItem('auth_token');
                  fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts/${couponId}`, {
                    method: 'DELETE',
                    headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                    },
                  }).then(response => {
                    if (response.ok) {
                      router.push('/admin/catalog/coupons');
                    } else {
                      alert('Failed to delete coupon');
                    }
                  });
                }
              }}
              className="px-6 py-3 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              Delete Coupon
            </button>
            <div className="flex gap-4">
              <Link
                href="/admin/catalog/coupons"
                className="px-6 py-3 border border-gray-300 dark:border-gray-400 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="bg-[#ec3137] text-white px-6 py-3 rounded-lg hover:bg-[#d42a35] disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
