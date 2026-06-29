'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

export default function AffiliateDetailsPage() {
  const params = useParams();
  const affiliateId = params.id;
  const [loading, setLoading] = useState(true);
  const [affiliate, setAffiliate] = useState<any>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '90days' | '1year'>('30days');

  useEffect(() => {
    if (affiliateId) {
      fetchAffiliateData();
    }
  }, [affiliateId, selectedPeriod]);

  const fetchAffiliateData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/admin/affiliates/${affiliateId}?period=${selectedPeriod}`);

      if (response.data) {
        console.log('Affiliate data loaded:', response.data);
        setAffiliate(response.data);
      } else {
        console.error('API response failed:', response);
        toast.error('Failed to load affiliate data');
      }
    } catch (error) {
      console.error('Failed to fetch affiliate details:', error);
      toast.error('Failed to fetch affiliate details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading affiliate data...</p>
        </div>
      </div>
    );
  }

  if (!affiliate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Affiliate not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <Toaster position="top-right" />

      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              অ্যাফিলিয়েট বিবরণ
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {affiliate.name} ({affiliate.referralCode})
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">👥 মোট ক্লিক</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{affiliate.periodStats?.clicks ?? 0}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">✅ অর্ডার</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{affiliate.periodStats?.conversions ?? 0}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">💰 মোট আয়</p>
              <p className="text-3xl font-bold text-[#ec3137]">৳{(affiliate.totalEarned || 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">📈 কনভার্সন রেট</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{affiliate.periodStats?.conversionRate ?? 0}%</p>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">💳 ব্যালেন্স বিবরণ</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">মোট উপার্জিত</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">৳{(affiliate.totalEarned || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">উত্তোলন করা</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">৳{(affiliate.withdrawnAmount || 0).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">উপলব্ধ ব্যালেন্স</p>
              <p className="text-2xl font-bold text-[#ec3137]">৳{(affiliate.availableBalance || 0).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">👤 অ্যাকাউন্ট তথ্য</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">নাম</label>
              <p className="text-lg text-gray-900 dark:text-white mt-1">{affiliate.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ইমেইল</label>
              <p className="text-lg text-gray-900 dark:text-white mt-1">{affiliate.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">ফোন</label>
              <p className="text-lg text-gray-900 dark:text-white mt-1">{affiliate.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">রেফারেল কোড</label>
              <p className="text-lg text-gray-900 dark:text-white mt-1">{affiliate.referralCode}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">কমিশন রেট</label>
              <p className="text-lg text-gray-900 dark:text-white mt-1">{affiliate.commissionRate}%</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">অবস্থা</label>
              <div className="mt-1">
                <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                  affiliate.isApproved
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }`}>
                  {affiliate.isApproved ? 'অনুমোদিত' : 'অপেক্ষাধীন'}
                </span>
              </div>
            </div>
          </div>

          {affiliate.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">বর্জন কারণ:</p>
              <p className="text-red-700 dark:text-red-300 mt-1">{affiliate.rejectionReason}</p>
            </div>
          )}

          {affiliate.adminNotes && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">অ্যাডমিন নোট:</p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">{affiliate.adminNotes}</p>
            </div>
          )}
        </div>

        {/* Recent Earnings */}
        {affiliate.recentEarnings && affiliate.recentEarnings.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-8">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">📦 সাম্প্রতিক আয়</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ইনভয়েস</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">গ্রাহক</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">পরিমাণ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">কমিশন</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">অবস্থা</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {affiliate.recentEarnings.map((earning: any) => (
                    <tr key={earning.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {earning.orderInvoice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {earning.customerName || 'অতিথি'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        ৳{(earning.orderAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#ec3137]">
                        ৳{(earning.commissionAmount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          earning.status === 'paid'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : earning.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {earning.status === 'paid' ? 'নিশ্চিত' : earning.status === 'pending' ? 'অপেক্ষাধীন' : earning.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recent Payouts */}
        {affiliate.recentPayouts && affiliate.recentPayouts.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">💸 সাম্প্রতিক পেমেন্ট</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">পরিমাণ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">পদ্ধতি</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">অবস্থা</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">তারিখ</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {affiliate.recentPayouts.map((payout: any) => (
                    <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                        ৳{(payout.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white capitalize">
                        {payout.paymentMethod?.replace('_', ' ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payout.status === 'completed'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : payout.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                        }`}>
                          {payout.status === 'completed' ? 'সম্পন্ন' : payout.status === 'pending' ? 'অপেক্ষাধীন' : payout.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {new Date(payout.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
