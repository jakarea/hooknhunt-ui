'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function OrderCancelContent() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);

  const invoiceNo = searchParams.get('invoice') || '';
  const orderTotal = parseFloat(searchParams.get('total') || '0');
  const customerName = searchParams.get('name') || 'Customer';
  const message = searchParams.get('message') || 'Payment was cancelled';
  const tranId = searchParams.get('tran_id') || '';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-gradient-to-br from-yellow-50 via-white to-amber-50 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-gray-900 min-h-screen">
      {/* Main Container */}
      <div className="max-w-[800px] mx-auto px-4 lg:px-8 py-12">
        {/* Warning Icon */}
        <div className="text-center mb-8 animate-scaleIn">
          <div className="w-32 h-32 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <svg className="w-16 h-16 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Payment Cancelled
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-200">
            You cancelled the payment process. Your order has not been placed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white dark:bg-[#0a0a0a] border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-8 mb-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Order Details</h2>
            <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm font-semibold">
              Cancelled
            </div>
          </div>

          {invoiceNo && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-200">Invoice Number</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{invoiceNo}</p>
            </div>
          )}

          {orderTotal > 0 && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-200">Order Total</p>
              <p className="text-lg font-bold text-[#ec3137]">৳{orderTotal.toLocaleString()}</p>
            </div>
          )}

          {tranId && (
            <div className="p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-200">Transaction ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{tranId}</p>
            </div>
          )}

          {message && message !== 'Payment was cancelled' && (
            <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-200">Message</p>
              <p className="text-sm text-gray-900 dark:text-white">{message}</p>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-500 rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">What Happens Next</h2>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">No payment was made</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Your card was not charged and no order was created</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Your cart is preserved</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">You can return to checkout anytime to complete your purchase</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Try a different payment method</p>
                <p className="text-sm text-gray-600 dark:text-gray-200">Switch between EPS, SSLCommerz, or Cash on Delivery</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/checkout"
              className="flex-1 px-6 py-4 bg-[#ec3137] hover:bg-[#c9282e] text-white font-bold rounded-xl transition-all duration-300 text-center"
            >
              Return to Checkout
            </Link>

            <Link
              href="/products"
              className="flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 font-bold rounded-xl transition-all duration-300 text-center"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Contact Support */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-100 text-center">
              Need help? <Link href="/contact" className="text-[#ec3137] hover:underline font-semibold">Contact our support team</Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7m7 7v14m0 0l-7-7m7 7v10a2 2 0 002-2h3a2 2 0 002-2v-4a2 2 0 00-2-2h-3m0 0h3a2 2 0 002 2v3a2 2 0 002 2h3a2 2 0 002-2v-4a2 2 0 00-2-2h-3m-6 0h6" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
      `}</style>
    </div>
  );
}

export default function OrderCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderCancelContent />
    </Suspense>
  );
}
