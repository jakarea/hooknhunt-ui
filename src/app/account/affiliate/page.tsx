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
        // Redirect to application page if not an affiliate
        if (!status?.isAffiliate) {
          router.push('/account/affiliate/apply');
          return;
        }

        // Show pending message if not approved
        if (!status?.isApproved) {
          // Set a minimal affiliate object for the banner to display
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
            // Additional fields for compatibility
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

        // Fetch dashboard data
        fetchDashboard({ period: selectedPeriod });

        // Fetch products with commissions
        fetchProducts();
      });
    }
  }, [isAuthenticated, selectedPeriod, checkAffiliateStatus, router, setAffiliate, fetchDashboard, fetchProducts]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('ক্লিপবোর্ডে কপি করা হয়েছে!');
  };

  const [isEditingReferralCode, setIsEditingReferralCode] = useState(false);
  const [editedReferralCode, setEditedReferralCode] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleEditReferralCode = () => {
    setEditedReferralCode(referralCode);
    setIsEditingReferralCode(true);
  };

  const handleSaveReferralCode = async () => {
    if (!editedReferralCode.trim()) {
      toast.error('রেফারেল কোড খালি হতে পারবে না');
      return;
    }

    setIsSaving(true);
    try {
      // API call to update referral code
      const response = await fetch('/api/v2/affiliate/update-referral-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({ referral_code: editedReferralCode }),
      });

      if (response.ok) {
        toast.success('রেফারেল কোড সফলভাবে আপডেট করা হয়েছে!');
        setIsEditingReferralCode(false);
        // Refresh dashboard data
        fetchDashboard({ period: selectedPeriod });
      } else {
        const data = await response.json();
        toast.error(data.message || 'রেফারেল কোড আপডেট করতে ব্যর্থ হয়েছে');
      }
    } catch (error) {
      toast.error('রেফারেল কোড আপডেট করতে ব্যর্থ হয়েছে');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingReferralCode(false);
    setEditedReferralCode('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'converted':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
      case 'approved':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // Loading state
  if (loading && !affiliate) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto mb-4"></div>
          <p className="text-gray-600">আপনার ড্যাশবোর্ড লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !affiliate) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <p className="text-red-800 dark:text-red-200">{error}</p>
      </div>
    );
  }

  // Use period stats from API response
  const affiliateStats = affiliate ? [
    {
      name: 'আয়',
      value: `৳${(periodStats?.earnings ?? 0).toFixed(2)}`,
      change: '+0%',
      changeType: 'positive' as const,
      icon: '💰',
    },
    {
      name: 'ক্লিক',
      value: (periodStats?.clicks ?? 0).toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: '👥',
    },
    {
      name: 'কনভার্সন',
      value: (periodStats?.conversions ?? 0).toString(),
      change: '+0%',
      changeType: 'positive' as const,
      icon: '📦',
    },
    {
      name: 'কনভার্সন রেট',
      value: `${(periodStats?.conversion_rate ?? 0).toFixed(1)}%`,
      change: '+0%',
      changeType: 'positive' as const,
      icon: '📈',
    },
  ] : [];

  // Get referral link and code from API
  const affiliateLink = affiliate?.referral_link || '';
  const referralCode = affiliate?.referral_code || '';

  // Full-width content (breadcrumb and banner)
  const fullWidthContent = (
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

      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="container py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/account" className="hover:text-[#ec3137] transition-colors">আমার অ্যাকাউন্ট</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">অ্যাফিলিয়েট ড্যাশবোর্ড</span>
          </div>
        </div>
      </div>

      {/* Pending Approval Banner */}
      {affiliate && !(affiliate.isApproved || affiliate.is_approved) && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-b border-yellow-200 dark:border-yellow-800">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
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
              <button
                onClick={() => {
                  navigator.clipboard.writeText(affiliate.referralCode ?? affiliate.referral_code ?? '');
                  toast.success('রেফারেল কোড কপি করা হয়েছে!');
                }}
                className="text-sm text-yellow-800 dark:text-yellow-200 hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
              >
                কোড কপি করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );

  // Main content
  const mainContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            অ্যাফিলিয়েট ড্যাশবোর্ড
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            আপনার রেফারেল পারফরম্যান্স এবং আয় ট্র্যাক করুন
          </p>
        </div>

        <div className="flex items-center gap-3">
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
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {affiliateStats.map((stat) => (
          <div key={stat.name} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.name}</p>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                stat.changeType === 'positive'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Affiliate Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Referral Code */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">আপনার রেফারেল কোড</h3>
          {!isEditingReferralCode ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={referralCode}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={() => copyToClipboard(referralCode)}
                className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                কপি করুন
              </button>
              <button
                onClick={handleEditReferralCode}
                className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                পরিবর্তন করুন
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editedReferralCode}
                  onChange={(e) => setEditedReferralCode(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="নতুন রেফারেল কোড লিখুন"
                  maxLength={10}
                />
                <button
                  onClick={handleSaveReferralCode}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
                >
                  বাতিল
                </button>
              </div>
              <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>সতর্কতা:</strong> আপনি রেফারেল কোড পরিবর্তন করলে, পূর্ববর্তী কোডটি আর কাজ করবে না। পুরানো লিংক বা মার্কেটিং মেটেরিয়েল যা পুরানো কোড ব্যবহার করে তা আর রেফারেল ট্র্যাক করবে না।
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Commission Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">কমিশন কাঠামো</h3>

          {/* Default Rate */}
          <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300 font-medium">ডিফল্ট রেট</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {affiliate?.commissionRate ?? affiliate?.commission_rate ? `${affiliate.commissionRate ?? affiliate.commission_rate}%` : '5%'}
              </span>
            </div>
          </div>

          {/* Category Commissions */}
          {categoryCommissions.length > 0 && (
            <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">ক্যাটাগরি অনুযায়ী রেট</h4>
              <div className="space-y-2">
                {categoryCommissions.map((commission) => (
                  <div key={commission.id} className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-300">{commission.category_name}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {commission.commission_rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Product Commissions */}
          {productCommissions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">পণ্য অনুযায়ী রেট</h4>
              <div className="space-y-2">
                {productCommissions.slice(0, 5).map((commission) => (
                  <div key={commission.id} className="flex justify-between items-center py-2">
                    <span className="text-gray-700 dark:text-gray-300">{commission.product_name}</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {commission.commission_rate}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {categoryCommissions.length === 0 && productCommissions.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
              আপনি সব পণ্যের জন্য ডিফল্ট রেটে কমিশন উপার্জন করেন
            </p>
          )}
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">সাম্প্রতিক রেফারেল</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  রেফারেল আইডি
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  গ্রাহক
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  অর্ডার পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  কমিশন
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  তারিখ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentReferrals.length > 0 ? (
                recentReferrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{referral.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {referral.customerName || referral.customer_name || 'অতিথি'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {referral.customerEmail || referral.customer_email || referral.ip_address || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {referral.orderAmount || referral.order_amount ? `৳${(referral.orderAmount || referral.order_amount || 0).toFixed(2)}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#ec3137]">
                      {referral.commissionAmount || referral.commission_amount ? `৳${(referral.commissionAmount || referral.commission_amount || 0).toFixed(2)}` : '৳0'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                        {referral.status === 'converted' ? 'সম্পন্ন' : referral.status === 'clicked' ? 'অপেক্ষাধীন' : referral.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(referral.clickedAt || referral.clicked_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">এখনো কোনো রেফারেল নেই। আপনার লিংক শেয়ার করুন!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout History */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">পেমেন্ট ইতিহাস</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              আপনার উত্তোলনের অনুরোধ এবং পেমেন্ট অবস্থা
            </p>
          </div>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="text-sm font-medium text-[#ec3137] hover:text-[#8a0f12] transition-colors"
          >
            + পেমেন্ট চানুন
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  আইডি
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  পরিমাণ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  পদ্ধতি
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  অবস্থা
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  অনুরোধিত
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  বিবরণ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentPayouts.length > 0 ? (
                recentPayouts.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{payout.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ৳{(payout.amount ?? 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                      {payout.payment_method?.replace('_', ' ') || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payout.status)}`}>
                        {payout.status === 'completed' ? 'পরিশোধিত' : payout.status === 'pending' ? 'অপেক্ষাধীন' : payout.status === 'processing' ? 'প্রক্রিয়াধীন' : payout.status === 'rejected' ? 'বাতিল' : payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(payout.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {payout.status === 'rejected' && payout.rejection_reason ? (
                        <span className="text-red-600 dark:text-red-400">{payout.rejection_reason}</span>
                      ) : (
                        <span className="truncate max-w-xs block">{payout.payment_details || 'N/A'}</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <p className="text-gray-500 dark:text-gray-400">এখনো কোনো পেমেন্ট অনুরোধ নেই। ৳১০০ হলে পৌঁছালে আপনার প্রথম পেমেন্ট চানুন।</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Account Details */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">অ্যাকাউন্ট বিবরণ</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            আপনার অ্যাফিলিয়েট অ্যাকাউন্ট তথ্য
          </p>
        </div>
        <div className="p-6">
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">অ্যাকাউন্ট আইডি</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">#{affiliate?.id || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">রেফারেল কোড</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{affiliate?.referral_code || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">কমিশন রেট</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">{affiliate?.commission_rate || affiliate?.commissionRate || 5}%</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">অ্যাকাউন্ট অবস্থা</dt>
              <dd className="mt-1">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  (affiliate?.is_approved || affiliate?.isApproved)
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {(affiliate?.is_approved || affiliate?.isApproved) ? 'অনুমোদিত' : 'অপেক্ষাধীন'}
                </span>
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">সদস্য হয়েছ</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {affiliate?.created_at ? new Date(affiliate.created_at).toLocaleDateString() : 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">মোট উত্তোলন</dt>
              <dd className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                ৳{((affiliate?.withdrawn_amount || affiliate?.withdrawnAmount || 0)).toFixed(2)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">সর্বশেষ কনভার্সন</dt>
              <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                {affiliate?.last_conversion_at ? new Date(affiliate.last_conversion_at).toLocaleDateString() : 'এখনো কোনো কনভার্সন নেই'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#ec3137] to-[#8a0f12] rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">মার্কেটিং মেটেরিয়েল</h3>
          <p className="text-white/90 mb-4">ব্যানার, লিংক এবং প্রচারমূলক সামগ্রী ডাউনলোড করুন</p>
          <button className="bg-white text-[#ec3137] hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
            সামগ্রী ডাউনলোড করুন
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">পণ্য দেখুন</h3>
          <p className="text-white/90 mb-4">অ্যাফিলিয়েট লিংক সহ সব পণ্য দেখুন</p>
          <Link
            href="/account/affiliate/products"
            className="block w-full bg-white text-purple-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors text-center"
          >
            পণ্যসমূহ দেখুন
          </Link>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">পেমেন্ট চানুন</h3>
          <p className="text-white/90 mb-4">আপনার উপলব্ধ আয় উত্তোলন করুন</p>
          <button
            onClick={() => setShowPayoutModal(true)}
            className="bg-white text-blue-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors"
          >
            পেমেন্ট চানুন
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-lg p-6 text-white">
          <h3 className="text-lg font-semibold mb-2">সহায়তা</h3>
          <p className="text-white/90 mb-4">আপনার অ্যাফিলিয়েট অ্যাকাউন্ট এবং মার্কেটিং সম্পর্কে সহায়তা নিন</p>
          <button className="bg-white text-green-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg transition-colors">
            সাপোর্টের সাথে যোগাযোগ করুন
          </button>
        </div>
      </div>

      {/* Payout Request Modal */}
      {affiliate && (
        <PayoutRequestModal
          isOpen={showPayoutModal}
          onClose={() => setShowPayoutModal(false)}
          availableBalance={affiliate.available_balance ?? affiliate.availableBalance ?? 0}
          onSubmit={async (data) => {
            const result = await requestPayout(data);
            if (result) {
              setShowPayoutModal(false);
              await fetchDashboard({ period: selectedPeriod as any });
            }
            return result;
          }}
          loading={loading}
        />
      )}
    </div>
  );

  return (
    <AccountPageWrapper fullWidth={fullWidthContent}>
      {mainContent}
    </AccountPageWrapper>
  );
}
