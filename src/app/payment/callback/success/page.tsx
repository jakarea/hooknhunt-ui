'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { usePayment } from '@/hooks/usePayment';

type Status = 'loading' | 'verifying' | 'success' | 'failed';

/**
 * Inner component that uses useSearchParams
 */
function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleCallback } = usePayment();

  const [status, setStatus] = useState<Status>('loading');
  const [orderData, setOrderData] = useState<{ invoice: string } | null>(null);

  useEffect(() => {
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    setStatus('verifying');

    // Collect callback parameters from SSL Commerz
    const callbackData: Record<string, unknown> = {
      tran_id: searchParams.get('tran_id') || undefined,
      val_id: searchParams.get('val_id') || undefined,
      amount: searchParams.get('amount') || undefined,
      currency: searchParams.get('currency') || undefined,
      card_type: searchParams.get('card_type') || undefined,
      card_no: searchParams.get('card_no') || undefined,
      bank_tran_id: searchParams.get('bank_tran_id') || undefined,
      status: searchParams.get('status') || undefined,
      error_code: searchParams.get('error_code') || undefined,
      error_reason: searchParams.get('error_reason') || undefined,
      store_id: searchParams.get('store_id') || undefined,
      verify_sign: searchParams.get('verify_sign') || undefined,
      verify_key: searchParams.get('verify_key') || undefined,
      risk_level: searchParams.get('risk_level') || undefined,
      risk_title: searchParams.get('risk_title') || undefined,
    };

    try {
      const result = await handleCallback('success', callbackData);

      if (result.success) {
        setStatus('success');

        // Parse invoice from redirect URL if available
        const urlParams = new URLSearchParams(result.redirectUrl.split('?')[1]);
        const invoice = urlParams.get('invoice');
        if (invoice) {
          setOrderData({ invoice });
        }

        // Redirect to order success page after 2 seconds
        setTimeout(() => {
          router.push(result.redirectUrl);
        }, 2000);
      } else {
        setStatus('failed');
      }
    } catch (err) {
      console.error('Payment verification failed:', err);
      setStatus('failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1f1515] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-[#2a2a2a] dark:bg-[#2a1a1a] rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-[#ec3137] border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Processing Payment...
            </h1>
            <p className="text-gray-600 dark:text-gray-200">
              Please wait while we verify your payment
            </p>
          </div>
        )}

        {status === 'verifying' && (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Verifying Payment...
            </h1>
            <p className="text-gray-600 dark:text-gray-200">
              Confirming your transaction with the bank
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 dark:text-green-400">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-200">
              Thank you for your payment. Your order is being processed.
            </p>
            {orderData && (
              <div className="bg-gray-50 dark:bg-[#322020] rounded-lg p-4 mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-200">
                  Order Invoice
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {orderData.invoice}
                </p>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Redirecting to your order details...
            </p>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-4">
            <div className="w-20 h-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-red-600 dark:text-red-400">
              Verification Failed
            </h1>
            <p className="text-gray-600 dark:text-gray-200">
              We could not verify your payment. Please contact support if the amount was deducted.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
              <button
                onClick={() => router.push('/account/orders')}
                className="px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors"
              >
                View Orders
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="px-6 py-3 border-2 border-gray-300 dark:border-gray-400 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * SSL Commerz Payment Success Callback Page
 * Handles successful payment redirects from SSL Commerz gateway
 */
export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-[#1f1515] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-[#2a2a2a] dark:bg-[#2a1a1a] rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 mx-auto border-4 border-[#ec3137] border-t-transparent rounded-full animate-spin" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            Loading...
          </h1>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
