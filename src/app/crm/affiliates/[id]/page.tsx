'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAdminAffiliate } from '@/hooks/useAdminAffiliate';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import toast, { Toaster } from 'react-hot-toast';

export default function AdminAffiliateDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { getAffiliateDetail, loading, error, clearError } = useAdminAffiliate();
  const [affiliate, setAffiliate] = useState<any>(null);
  const [periodStats, setPeriodStats] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    if (id) {
      loadAffiliate();
    }
  }, [id, selectedPeriod]);

  const loadAffiliate = async () => {
    if (!id) return;
    const result = await getAffiliateDetail(id as string, selectedPeriod);
    if (result?.success && result?.data) {
      setAffiliate(result.data);
      setPeriodStats(result.data?.periodStats);
    }
  };

  if (loading && !affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading affiliate details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error && !affiliate) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <p className="text-red-800 dark:text-red-200">{error}</p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.back()}
                  className="text-sm underline hover:no-underline"
                >
                  Go Back
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
        }}
      />

      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <button
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← Back
              </button>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {affiliate?.name || 'Affiliate Details'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {affiliate?.email}
                </p>
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
              >
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="1year">Last Year</option>
              </select>
            </div>
          </div>

          {affiliate && (
            <div className="space-y-8">
              {/* Period Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ৳{(periodStats?.earnings ?? 0).toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {periodStats?.period === '7days' && 'Last 7 days'}
                    {periodStats?.period === '30days' && 'Last 30 days'}
                    {periodStats?.period === '90days' && 'Last 90 days'}
                    {periodStats?.period === '1year' && 'Last year'}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {periodStats?.clicks ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Referral clicks
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Conversions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {periodStats?.conversions ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Converted sales
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Conversion Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {(periodStats?.conversionRate ?? 0).toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Success rate
                  </p>
                </div>
              </div>

              {/* All-Time Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Earned (All-Time)</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ৳{affiliate.totalEarned.toFixed(2)}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Clicks</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {affiliate.totalClicks}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Total Conversions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {affiliate.totalConversions}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Available Balance</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ৳{affiliate.availableBalance.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                  Account Information
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">{affiliate.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">{affiliate.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">{affiliate.phone || 'N/A'}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Commission Rate</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">{affiliate.commissionRate}%</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Referral Code</dt>
                    <dd className="mt-1 font-mono text-gray-900 dark:text-white">{affiliate.referralCode}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</dt>
                    <dd className="mt-1">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${
                        affiliate.isApproved
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {affiliate.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Joined Date</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">
                      {new Date(affiliate.joinedAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Conversion</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">
                      {affiliate.lastConversionAt ? new Date(affiliate.lastConversionAt).toLocaleDateString() : 'No conversions yet'}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Withdrawn</dt>
                    <dd className="mt-1 text-gray-900 dark:text-white">
                      ৳{affiliate.withdrawnAmount.toFixed(2)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Commission Rates */}
              {(affiliate.productCommissions?.length > 0 || affiliate.categoryCommissions?.length > 0) && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                    Commission Configuration
                  </h2>

                  {affiliate.categoryCommissions?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Category Commissions
                      </h3>
                      <div className="space-y-2">
                        {affiliate.categoryCommissions.map((c: any) => (
                          <div key={c.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded">
                            <span className="text-gray-700 dark:text-gray-300">{c.categoryName}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{c.commissionRate}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {affiliate.productCommissions?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                        Product Commissions
                      </h3>
                      <div className="space-y-2">
                        {affiliate.productCommissions.slice(0, 10).map((c: any) => (
                          <div key={c.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 dark:bg-gray-900 rounded">
                            <span className="text-gray-700 dark:text-gray-300">{c.productName}</span>
                            <span className="font-semibold text-gray-900 dark:text-white">{c.commissionRate}%</span>
                          </div>
                        ))}
                      </div>
                      {affiliate.productCommissions.length > 10 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          And {affiliate.productCommissions.length - 10} more products
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
