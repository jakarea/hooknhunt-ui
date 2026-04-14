'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayment';

type Status = 'loading' | 'failed';

/**
 * Inner component that uses useSearchParams
 */
function PaymentFailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCallback } = usePayment();

  const [status, setStatus] = useState<Status>('loading');
  const [errorReason, setErrorReason] = useState<string>('');

  useEffect(() => {
    handleFailedPayment();
  }, []);

  const handleFailedPayment = async () => {
    // Get error details from URL params
    const reason = searchParams.get('error_reason') || searchParams.get('reason') || '';
    const errorCode = searchParams.get('error_code') || '';
    const status = searchParams.get('status') || '';

    setErrorReason(reason || status || 'Payment could not be processed');

    // Collect callback parameters
    const callbackData: Record<string, unknown> = {
      tran_id: searchParams.get('tran_id') || undefined,
      status: searchParams.get('status') || undefined,
      error_code: errorCode || undefined,
      error_reason: reason || undefined,
    };

    try {
      await handleCallback('fail', callbackData);
    } catch (err) {
      console.error('Payment failure callback error:', err);
    }

    setStatus('failed');
  };

  const handleRetry = () => {
    router.push('/checkout');
  };

  const handleContactSupport = () => {
    router.push('/contact');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#0f0f0f] rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Processing...
            </h1>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              Payment Failed
            </h1>

            <p className="text-gray-600 dark:text-gray-400">
              Unfortunately, your payment could not be processed.
            </p>

            {errorReason && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>Reason:</strong> {errorReason}
                </p>
              </div>
            )}

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                What you can do:
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-300 text-left space-y-1">
                <li>• Try again with a different payment method</li>
                <li>• Check if your card has sufficient balance</li>
                <li>• Verify your card details are correct</li>
                <li>• Contact your bank for more information</li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Try Again
              </button>
              <button
                onClick={handleContactSupport}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
              >
                Contact Support
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => router.push('/')}
                className="text-sm text-[#ec3137] hover:text-[#8a0f12] dark:hover:text-red-400 font-medium"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SSL Commerz Payment Failure Callback Page
 * Handles failed payment redirects from SSL Commerz gateway
 */
export default function PaymentFailPage() {
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
      <PaymentFailContent />
    </Suspense>
  );
}
