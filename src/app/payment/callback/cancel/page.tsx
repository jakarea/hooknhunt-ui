'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayment';

type Status = 'loading' | 'cancelled';

/**
 * Inner component that uses useSearchParams
 */
function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCallback } = usePayment();

  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    handleCancelledPayment();
  }, []);

  const handleCancelledPayment = async () => {
    // Collect callback parameters
    const callbackData: Record<string, unknown> = {
      tran_id: searchParams.get('tran_id') || undefined,
      status: searchParams.get('status') || undefined,
    };

    try {
      await handleCallback('cancel', callbackData);
    } catch (err) {
      console.error('Payment cancel callback error:', err);
    }

    setStatus('cancelled');
  };

  const handleRetryPayment = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Processing...
            </h1>
          </div>
        )}

        {status === 'cancelled' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              Payment Cancelled
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              You have cancelled the payment process. No charges were made to your account.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                Your order is saved!
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                You can complete your payment later. Go to &quot;My Orders&quot; to retry payment.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={handleRetryPayment}
                className="px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Try Payment Again
              </button>
              <button
                onClick={() => router.push('/account/orders')}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
              >
                My Orders
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-[#ec3137] hover:text-[#8a0f12] dark:hover:text-red-400 font-medium"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SSL Commerz Payment Cancel Callback Page
 * Handles cancelled payment redirects from SSL Commerz gateway
 */
export default function PaymentCancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto border-4 border-[#ec3137] border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <PaymentCancelContent />
    </Suspense>
  );
}
