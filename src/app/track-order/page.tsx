'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import api from '@/lib/api';
import toast, { Toaster } from 'react-hot-toast';

interface OrderItem {
  id: number;
  invoice_no: string;
  status: string;
  status_label: string;
  payment_status: string;
  total_amount: number;
  created_at: string;
  items_count: number;
}

type TrackingTab = 'order' | 'courier';

export default function TrackOrderPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<TrackingTab>('order');
  const [trackingId, setTrackingId] = useState('');

  // Order tracking state
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleCourierTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingId.trim()) {
      // Open Steadfast tracking in new tab
      const steadfastUrl = `https://steadfast.com.bd/track-order/?tracking_id=${trackingId}`;
      window.open(steadfastUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOrderTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.trim() && !email.trim()) {
      toast.error('Please enter phone number or email');
      return;
    }

    setIsLoading(true);
    setHasSearched(false);

    try {
      const response = await api.trackOrder({
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
      });

      const data = (response as { data?: { orders: OrderItem[]; total_found: number } }).data;
      if (data?.orders) {
        setOrders(data.orders);
        setHasSearched(true);

        if (data.orders.length === 0) {
          toast.error('No orders found');
        } else {
          toast.success(`Found ${data.total_found} order${data.total_found > 1 ? 's' : ''}`);
        }
      }
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || error.message || 'Failed to track orders');
      setOrders([]);
      setHasSearched(true);
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

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-16">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="container px-3 md:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            Track Your Order
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Enter your details below to track your order status
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Tab Switcher */}
          <div className="flex mb-6 bg-gray-100 dark:bg-[#1a1a1a] rounded-lg p-1">
            <button
              onClick={() => setActiveTab('order')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'order'
                  ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Order Tracking
            </button>
            <button
              onClick={() => setActiveTab('courier')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-all ${
                activeTab === 'courier'
                  ? 'bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Courier Tracking
            </button>
          </div>

          {/* Order Tracking Tab */}
          {activeTab === 'order' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleOrderTrack} className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01712345678"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Enter either your phone number or email address used when placing the order.
                </p>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-[#bc1215] text-white font-semibold rounded-lg hover:bg-[#8a0e10] focus:outline-none focus:ring-2 focus:ring-[#bc1215]/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px]"
                >
                  {isLoading ? 'Searching...' : 'Track Orders'}
                </button>
              </form>

              {/* Order Results */}
              {hasSearched && (
                <div className="border-t border-gray-200 dark:border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    {orders.length > 0 ? `Found ${orders.length} Order${orders.length > 1 ? 's' : ''}` : 'No Orders Found'}
                  </h3>

                  {orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order.invoice_no}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {formatDate(order.created_at)} • {order.items_count} item{order.items_count > 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.status)}`}>
                                {order.status_label}
                              </span>
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                order.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-lg font-bold text-[#bc1215]">
                              ৳{order.total_amount.toLocaleString()}
                            </p>
                            <Link
                              href={`/account/orders/${order.invoice_no}`}
                              className="text-sm font-medium text-[#046bd2] hover:text-[#0353a5] transition-colors"
                            >
                              View Details →
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <svg className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 dark:text-gray-400">
                        No orders found for the provided details. Please check and try again.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Courier Tracking Tab */}
          {activeTab === 'courier' && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
              <form onSubmit={handleCourierTrack}>
                <div className="mb-4 sm:mb-6">
                  <label htmlFor="trackingId" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tracking ID
                  </label>
                  <input
                    type="text"
                    id="trackingId"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    placeholder="Enter your courier tracking ID"
                    className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                    required
                  />
                  <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Enter your Steadfast courier tracking ID to track your shipment.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={!trackingId.trim()}
                  className="w-full px-6 py-3 text-sm sm:text-base bg-[#bc1215] text-white font-semibold rounded-lg hover:bg-[#8a0e10] focus:outline-none focus:ring-2 focus:ring-[#bc1215]/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#bc1215] min-h-[48px] sm:min-h-0"
                >
                  Track with Steadfast
                </button>
              </form>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-300 mb-2 leading-relaxed">
                  Tracking Information
                </h3>
                <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-400 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>Use <strong>Order Tracking</strong> to find all orders placed with your phone/email</li>
                  <li>Use <strong>Courier Tracking</strong> to track shipment location via Steadfast</li>
                  <li>For order tracking, you only need your phone number OR email address</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
            Need help with your order?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base bg-[#046bd2] text-white font-semibold rounded-lg hover:bg-[#0353a5] focus:outline-none focus:ring-2 focus:ring-[#046bd2]/50 focus:ring-offset-2 transition-all min-h-[48px] sm:min-h-0"
          >
            Contact Support
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
