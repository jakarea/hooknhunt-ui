'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { recordRedirect, detectInfiniteLoop, handleInfiniteLoop } from '@/lib/redirectGuard';

interface Order {
  id: number;
  orderNumber: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface Stats {
  totalOrders: number;
  totalSpent: number;
  pendingOrders: number;
  completedOrders: number;
}

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    completedOrders: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Detect infinite redirect loop
    if (detectInfiniteLoop()) {
      console.error('🛑 INFINITE REDIRECT LOOP DETECTED - BREAKING LOOP');
      handleInfiniteLoop();
      return;
    }

    // Wait for auth to finish loading
    if (authLoading) {
      return;
    }

    // Not authenticated - redirect to login
    if (!isAuthenticated) {
      recordRedirect('/account', '/login');
      router.replace('/login');
      return;
    }

    // Authenticated - allow access
  }, [isAuthenticated, authLoading, router]);

  // Fetch orders only when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('📊 Fetching order data...');
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  // Show loading spinner while auth is being validated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  // If not authenticated, useEffect will handle redirect
  if (!isAuthenticated) {
    return null;
  }

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await api.getOrderSummary();
      const summary = (response.data || response) as Record<string, unknown>;

      if (summary) {
        setStats({
          totalOrders: (summary.totalOrders as number) || 0,
          totalSpent: (summary.totalSpent as number) || 0,
          pendingOrders: (summary.pendingOrders as number) || 0,
          completedOrders: (summary.completedOrders as number) || 0,
        });

        const recent = (summary.recentOrders as Order[]) || [];
        setOrders(recent);
      }
    } catch (error) {
      const err = error as { status?: number; message?: string };
      if (err.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(err.message || 'Failed to load orders');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    );
  }

  return (
    <>
      {/* Welcome Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          স্বাগতম, {user?.name || 'গ্রাহক'}!
        </h1>
        <p className="text-gray-600 mt-2">আপনার অ্যাকাউন্টের আজকের অবস্থা জানুন।</p>
      </div>

      {/* Stats Grid */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">মোট অর্ডার</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">মোট ব্যয়</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(stats.totalSpent)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">পেন্ডিং অর্ডার</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">সম্পন্ন অর্ডার</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stats.completedOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">সাম্প্রতিক অর্ডার</h2>
                <Link href="/account/orders" className="text-sm text-red-700 hover:text-red-800 font-medium">
                  সব দেখুন
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">কোনো অর্ডার নেই</h3>
                  <p className="mt-1 text-sm text-gray-500">আপনি এখনো কোনো অর্ডার দেনননি।</p>
                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-700 hover:bg-red-800"
                    >
                      কেনাক শুরু করুন
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অর্ডার আইডি
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          তারিখ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          পরিমাণ
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          অবস্থা
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          পরিচাল
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 cursor-pointer">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                            <div className="text-xs text-gray-500">ID: {order.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link href={`/account/orders/${order.orderNumber}`} className="text-red-700 hover:text-red-900">
                              বিস্তারিত দেখুন
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">দ্রুত পদক্ষেপ</h3>
                <div className="space-y-3">
                  <Link
                    href="/products"
                    className="w-full flex items-center justify-center bg-red-700 hover:bg-red-800 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    এখনই কিনুন
                  </Link>
                  <Link
                    href="/account/orders"
                    className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    সব অর্ডার দেখুন
                  </Link>
                  <Link
                    href="/account/profile"
                    className="w-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    প্রোফাইল সম্পাদন করুন
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">অ্যাকাউন্ট তথ্য</h3>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{user?.name || 'সেট করা নেই'}</p>
                      <p className="text-xs text-gray-500">নাম</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{user?.phoneNumber || user?.phone_number || user?.phone || 'সেট করা নেই'}</p>
                      <p className="text-xs text-gray-500">ফোন</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-gray-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-900">{user?.email || 'সেট করা নেই'}</p>
                      <p className="text-xs text-gray-500">ইমেইল</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">সহায়তা প্রয়োজন?</h3>
                <div className="space-y-3">
                  <Link href="/track-order" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    অর্ডার ট্র্যাক করুন
                  </Link>
                  <Link href="/contact" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    সাপোর্ট করুন
                  </Link>
                  <Link href="/delivery-policy" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    ডেলিভারি নীতিনি
                  </Link>
                  <Link href="/refund-policy" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    রিফান্ড নীতিনি
                  </Link>
                  <Link href="/terms-and-conditions" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    শর্ত ও শর্তাব
                  </Link>
                  <Link href="/privacy-policy" className="flex items-center text-sm text-gray-700 hover:text-red-700 transition-colors">
                    <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    গোপনীতন নীতিমালা
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      );
  }
