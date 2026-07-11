'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Link from 'next/link';

export default function PaymentLinkPage() {
  const params = useParams();
  const router = useRouter();
  const token = typeof params.token === 'string' ? params.token : '';

  const [order, setOrder] = useState<any>(null);
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Validate payment link
  useEffect(() => {
    if (!token) return;

    const validateLink = async () => {
      try {
        const api = (await import('@/lib/api')).default;
        const response = await api.get<{
          token: string;
          order_id: number;
          amount: number;
          expires_at: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: string;
          shipping_city?: string;
        }>(`/store/payment-links/validate/${token}`);

        if (response.data) {
          const linkData = response.data;
          setOrder(linkData);
          setAmount(linkData.amount);
          setLoading(false);
        }
      } catch (err: any) {
        const errorMsg = err.response?.data?.error || 'Invalid or expired payment link';
        setError(errorMsg);
        setLoading(false);
        console.error('Link validation failed:', err);
      }
    };

    validateLink();
  }, [token]);

  const handlePay = async () => {
    if (!order || processing) return;

    setProcessing(true);

    try {
      const api = (await import('@/lib/api')).default;

      // Payment links use EPS gateway only
      const response = await api.initiateEpsPayment({
        sales_order_id: order.order_id,
        customer_name: order.customer_name || 'Customer',
        customer_email: order.customer_email || '',
        customer_phone: order.customer_phone || '',
        customer_address: {
          address_line1: order.shipping_address || 'N/A',
          address_line2: '',
          city: order.shipping_city || 'N/A',
          postal_code: '',
          country: 'Bangladesh',
        },
      });

      const gatewayUrl = (response.data as any)?.gatewayUrl;
      if (!gatewayUrl) {
        throw new Error('Payment gateway URL not received');
      }

      // For EPS: Direct redirect (don't open in new tab - causes duplicate requests)
      window.location.href = gatewayUrl;

      setProcessing(false);
    } catch (err: any) {
      console.error('Payment failed:', err);
      const errorMsg = err.response?.data?.error || 'Payment initiation failed';
      setError(errorMsg);
      toast.error(errorMsg);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#ec3137] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Validating payment link...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-md">
          <div className="mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Payment Link Invalid</h2>
            <p className="text-gray-600 text-center">{error}</p>
          </div>
          <Link
            href="/"
            className="w-full block text-center bg-[#ec3137] text-white py-2 px-4 rounded-lg font-semibold hover:bg-[#c72b2f]"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full">
          {/* Payment Card */}
          <div className="bg-white dark:bg-[#2a2a2a] rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Complete Payment</h1>
              <p className="text-gray-600">Order #{order.order_id}</p>
            </div>

            {/* Amount Display */}
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 text-sm mb-2">Amount to Pay</p>
              <p className="text-4xl font-bold text-[#ec3137]">
                ৳{amount.toFixed(2)}
              </p>
              <p className="text-gray-500 text-xs mt-2">This amount is locked and cannot be changed</p>
            </div>

            {/* Payment via EPS */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-blue-700">Payment will be processed via EPS payment gateway</p>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={processing}
              className="w-full bg-[#ec3137] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#c72b2f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? 'Processing...' : `Pay ৳${amount.toFixed(2)}`}
            </button>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Footer */}
            <p className="text-xs text-gray-500 text-center mt-6">
              You will be redirected to the secure payment gateway. Your transaction is protected.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
