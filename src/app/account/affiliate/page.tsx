'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAffiliate } from '@/hooks/useAffiliate';
import { useAffiliateApplication } from '@/hooks/useAffiliateApplication';
import { AccountPageWrapper } from '@/components/account/AccountPageWrapper';
import PayoutRequestModal from '@/components/affiliate/PayoutRequestModal';
import toast, { Toaster } from 'react-hot-toast';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export default function AffiliateDashboard() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const {
    loading,
    error,
    affiliate,
    recentReferrals,
    recentEarnings,
    recentPayouts,
    productCommissions,
    categoryCommissions,
    products,
    loadingProducts,
    periodStats,
    topProducts,
    weeklyEarnings,
    balanceBreakdown,
    fetchDashboard,
    fetchProducts,
    requestPayout,
    clearError,
    getStats,
    setAffiliate,
  } = useAffiliate();

  const { checkAffiliateStatus } = useAffiliateApplication();

  // Check affiliate status and fetch dashboard on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkAffiliateStatus().then(status => {
        if (!status?.isAffiliate) {
          router.push('/account/affiliate/apply');
          return;
        }

        if (!status?.isApproved) {
          setAffiliate({
            id: 0,
            user_id: 0,
            referral_code: status?.referralCode || '',
            referral_link: `/?ref=${status?.referralCode || ''}`,
            commission_rate: 5,
            total_earned: 0,
            withdrawn_amount: 0,
            available_balance: 0,
            total_clicks: 0,
            total_conversions: 0,
            conversion_rate: 0,
            is_approved: false,
            created_at: new Date().toISOString(),
            referralCode: status?.referralCode || '',
            commissionRate: 5,
            totalEarned: 0,
            withdrawnAmount: 0,
            availableBalance: 0,
            totalClicks: 0,
            totalConversions: 0,
            conversionRateValue: 0,
            isApproved: false,
          });
          return;
        }

        fetchDashboard({ period: selectedPeriod });
        fetchProducts();
      });
    }
  }, [isAuthenticated, selectedPeriod, checkAffiliateStatus, router, setAffiliate, fetchDashboard, fetchProducts]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  // Debug: Log when earnings data changes
  useEffect(() => {
    console.log('📊 Recent Earnings Updated:', recentEarnings);
  }, [recentEarnings]);

  const referralCode = affiliate?.referral_code || '';
  let affiliateLink = affiliate?.referral_link || '';
  if (referralCode && !affiliateLink) {
    if (typeof window !== 'undefined') {
      affiliateLink = `${window.location.origin}/?ref=${referralCode}`;
    } else {
      affiliateLink = `/?ref=${referralCode}`;
    }
  }

  const fullWidthContent = (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />

      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-500">
        <div className="container py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-200">
            <Link href="/account" className="hover:text-[#ec3137] transition-colors">আমার অ্যাকাউন্ট</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">অ্যাফিলিয়েট ড্যাশবোর্ড</span>
          </div>
        </div>
      </div>

      {affiliate && !(affiliate.isApproved || affiliate.is_approved) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                    অ্যাফিলিয়েট অ্যাকাউন্ট অনুমোদনের জন্য অপেক্ষারধীন
                  </h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    আপনার আবেদনটি পর্যালোচনা করা হচ্ছে। অনুমোদনের পরে আপনি কমিশন উপার্জন করতে পারবেন। রেফারেল কোড: {affiliate.referralCode ?? affiliate.referral_code ?? 'N/A'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  const mainContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            অ্যাফিলিয়েট ড্যাশবোর্ড
          </h1>
          <p className="text-gray-600 dark:text-gray-200 mt-2">
            আপনার রেফারেল পারফরম্যান্স এবং আয় ট্র্যাক করুন
          </p>
        </div>

        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value as '7days' | '30days' | '90days' | '1year')}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
        >
          <option value="7days">গত ৭ দিন</option>
          <option value="30days">গত ৩০ দিন</option>
          <option value="90days">গত ৯০ দিন</option>
          <option value="1year">গত ১ বছর</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">👥 মোট ক্লিক</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{periodStats?.clicks ?? 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">✅ অর্ডার</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{periodStats?.conversions ?? 0}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">💰 মোট আয়</p>
            <p className="text-3xl font-bold text-[#ec3137]">৳{(affiliate?.total_earned ?? 0).toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-200 mb-2">📈 কনভার্সন রেট</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{periodStats?.conversion_rate ?? 0}%</p>
          </div>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">💳 আপনার ব্যালেন্স</h2>

        {balanceBreakdown && (
          <div className="space-y-4">
            {/* Pending Balance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  💛 অপেক্ষাধীন (পেমেন্টের জন্য অপেক্ষা করছে)
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ৳{((balanceBreakdown.pending || 0) as number).toFixed(2)} ({(balanceBreakdown.pending_percentage || 0).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${(balanceBreakdown.pending_percentage || 0).toFixed(1)}%` }}
                ></div>
              </div>
            </div>

            {/* Confirmed Balance */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-100">
                  ✅ নিশ্চিত (উত্তোলনের জন্য প্রস্তুত)
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ৳{((balanceBreakdown.confirmed || 0) as number).toFixed(2)} ({(balanceBreakdown.confirmed_percentage || 0).toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${(balanceBreakdown.confirmed_percentage || 0).toFixed(1)}%` }}
                ></div>
              </div>
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-500">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  মোট সম্ভাব্য ব্যালেন্স
                </span>
                <span className="text-2xl font-bold text-[#ec3137]">
                  ৳{((balanceBreakdown.total || 0) as number).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Request Payout Button */}
            <button
              onClick={() => setShowPayoutModal(true)}
              disabled={(balanceBreakdown.confirmed || 0) < 100}
              className="w-full mt-4 bg-[#ec3137] hover:bg-[#8a0f12] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
              title={(balanceBreakdown.confirmed || 0) < 100 ? `কমপক্ষে ৳100 প্রয়োজন (বর্তমান: ৳${((balanceBreakdown.confirmed || 0) as number).toFixed(2)})` : ''}
            >
              💸 পেমেন্ট চানুন ({(balanceBreakdown.confirmed || 0) >= 100 ? `৳${((balanceBreakdown.confirmed || 0) as number).toFixed(2)}` : `৳${((balanceBreakdown.confirmed || 0) as number).toFixed(2)} (কমপক্ষে ৳100 প্রয়োজন)`})
            </button>
          </div>
        )}
      </div>

      {/* Weekly Earnings Chart */}
      {weeklyEarnings && weeklyEarnings.length > 0 && weeklyEarnings.some((w) => (w.earnings || 0) > 0) && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📈 সাপ্তাহিক আয়</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyEarnings.filter((w) => (w.earnings || 0) > 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                  color: '#fff',
                }}
                formatter={(value: any) => `৳${value.toFixed(2)}`}
              />
              <Line
                type="monotone"
                dataKey="earnings"
                stroke="#ec3137"
                strokeWidth={2}
                dot={{ fill: '#ec3137', r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Top 10 Earning Products */}
      {topProducts && topProducts.length > 0 && (
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 শীর্ষ ১০ আয়কারী পণ্য</h2>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.product_name || index} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-[#ec3137] rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{product.product_name || 'N/A'}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-200">{product.sales_count ?? 0} বিক্রয়</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#ec3137]">৳{((product.total_commission || 0) as number).toFixed(2)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-200">৳{((product.average_commission || 0) as number).toFixed(2)}/বিক্রয়</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-500">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📦 সাম্প্রতিক আয়ের রেকর্ড</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-[#1a1a1a]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">ইনভয়েস</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">গ্রাহক</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">অর্ডার পরিমাণ</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">কমিশন</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">অবস্থা</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-[#1a1a1a] divide-y divide-gray-200 dark:divide-gray-700">
              {recentEarnings.length > 0 ? (
                recentEarnings.map((earning) => (
                  <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {((earning.orderInvoice || earning.order_invoice) || '').slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{earning.customerName || earning.customer_name || 'অতিথি'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">৳{((earning.orderAmount || earning.order_amount) || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#ec3137]">৳{((earning.commissionAmount || earning.commission_amount) || 0).toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        earning.status === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : earning.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-gray-100 text-gray-800 dark:bg-[#1a1a1a] dark:text-gray-200'
                      }`}>
                        {earning.status === 'paid' ? 'নিশ্চিত' : earning.status === 'pending' ? 'অপেক্ষাধীন' : earning.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-200">এখনো কোনো আয়ের রেকর্ড নেই।</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <AccountPageWrapper fullWidth={fullWidthContent}>
      {mainContent}
      <PayoutRequestModal
        isOpen={showPayoutModal}
        onClose={() => setShowPayoutModal(false)}
        onSubmit={requestPayout}
        availableBalance={balanceBreakdown?.confirmed || 0}
      />
    </AccountPageWrapper>
  );
}
