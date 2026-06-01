'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Discount {
  id: number;
  code: string;
  description: string | null;
  type: 'percentage' | 'fixed_amount' | 'shipping';
  amount: number;
  max_discount_amount: number | null;
  min_purchase_amount: number | null;
  starts_at: string | null;
  expires_at: string | null;
  max_uses: number | null;
  used_count: number;
  usage_limit_per_customer: number | null;
  is_active: boolean;
  is_auto_apply: boolean;
  first_purchase_only: boolean;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse {
  data: Discount[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export default function CouponsListPage() {
  const router = useRouter();
  const [discounts, setDiscounts] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchDiscounts = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');

      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '20',
      });

      if (search) params.set('search', search);
      if (typeFilter !== 'all') params.set('type', typeFilter);
      if (statusFilter !== 'all') params.set('status', statusFilter === 'active' ? 'active' : 'inactive');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDiscounts(data.data);
      } else {
        console.error('Failed to fetch discounts');
      }
    } catch (error) {
      console.error('Error fetching discounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const handleSearch = () => {
    fetchDiscounts(1);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchDiscounts(discounts?.current_page);
      } else {
        alert('Failed to delete coupon');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
      alert('Failed to delete coupon');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/catalog/discounts/${id}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        fetchDiscounts(discounts?.current_page);
      } else {
        alert('Failed to toggle status');
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Coupons & Discounts</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage promotional coupons and discount codes</p>
        </div>
        <Link
          href="/admin/catalog/coupons/create"
          className="bg-[#ec3137] text-white px-6 py-3 rounded-lg hover:bg-[#d42a35] transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New Coupon
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by code or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-gray-700 dark:text-white"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed_amount">Fixed Amount</option>
            <option value="shipping">Free Shipping</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] dark:bg-gray-700 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={handleSearch}
            className="bg-gray-800 dark:bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-500 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#ec3137]"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading coupons...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Validity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {discounts?.data?.map((discount) => (
                <tr key={discount.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{discount.code}</div>
                      {discount.description && (
                        <div className="text-sm text-gray-500 dark:text-gray-400">{discount.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {discount.type === 'percentage' && 'Percentage'}
                      {discount.type === 'fixed_amount' && 'Fixed Amount'}
                      {discount.type === 'shipping' && 'Free Shipping'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {discount.type === 'percentage' ? `${discount.amount}%` : `৳${discount.amount}`}
                    {discount.max_discount_amount && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        (Max: ৳{discount.max_discount_amount})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {discount.used_count} / {discount.max_uses || '∞'}
                    {discount.usage_limit_per_customer && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 block">
                        (Per user: {discount.usage_limit_per_customer})
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {discount.starts_at && (
                      <div>From: {new Date(discount.starts_at).toLocaleDateString()}</div>
                    )}
                    {discount.expires_at && (
                      <div>To: {new Date(discount.expires_at).toLocaleDateString()}</div>
                    )}
                    {!discount.starts_at && !discount.expires_at && (
                      <span className="text-gray-500 dark:text-gray-400">No expiry</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(discount.id)}
                      className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        discount.is_active
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {discount.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/admin/catalog/coupons/${discount.id}/edit`}
                      className="text-[#ec3137] hover:text-[#d42a35] dark:text-[#ff6b6b] dark:hover:text-[#ff5252]"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {discounts?.data?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No coupons found. Create your first coupon to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {discounts && discounts.last_page > 1 && (
            <div className="bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((discounts.current_page - 1) * discounts.per_page) + 1} to{' '}
                {Math.min(discounts.current_page * discounts.per_page, discounts.total)} of {discounts.total} results
              </div>
              <div className="flex gap-2">
                {discounts.current_page > 1 && (
                  <button
                    onClick={() => fetchDiscounts(discounts.current_page - 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                  >
                    Previous
                  </button>
                )}
                {discounts.current_page < discounts.last_page && (
                  <button
                    onClick={() => fetchDiscounts(discounts.current_page + 1)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
