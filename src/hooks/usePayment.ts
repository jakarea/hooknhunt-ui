'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type {
  InitiatePaymentRequest,
  InitiatePaymentResponse,
  EmiOptionsResponse,
  PaymentStatusResponse,
} from '@/types/payment';
import { PaymentError, PaymentErrorType } from '@/types/payment';

/**
 * Custom hook for managing SSL Commerz payment flow
 * Handles payment initiation, EMI options, status checks, and gateway redirects
 */
export function usePayment() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initiatedPayment, setInitiatedPayment] = useState<InitiatePaymentResponse | null>(null);

  /**
   * Initiate payment for an order
   * Returns the gateway URL and transaction ID for redirect
   */
  const initiatePayment = useCallback(async (data: InitiatePaymentRequest): Promise<InitiatePaymentResponse> => {
    setLoading(true);
    setError(null);

    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.initiatePayment(data);

      if (response.data) {
        const paymentData = response.data as InitiatePaymentResponse;
        setInitiatedPayment(paymentData);

        // Store transaction info in sessionStorage for callback handling
        sessionStorage.setItem('ssl_payment_tran_id', paymentData.tran_id);
        sessionStorage.setItem('ssl_payment_order_id', String(data.sales_order_id));

        return paymentData;
      }

      throw new PaymentError(PaymentErrorType.PAYMENT_FAILED, 'Invalid response from payment server');
    } catch (err: unknown) {
      const apiError = err as {
        response?: { data?: { message?: string; errors?: Record<string, string[]> | string; error?: string; status?: number }; };
        message?: string;
        status?: number;
      };

      let errorMessage = 'Payment initiation failed. Please try again.';
      let errorType = PaymentErrorType.PAYMENT_FAILED;

      // Handle validation errors
      if (apiError.response?.data?.errors) {
        const errors = apiError.response.data.errors;
        const errorMessages = typeof errors === 'string' ? [errors] : Object.values(errors).flat();
        errorMessage = errorMessages[0] || errorMessage;
        errorType = PaymentErrorType.VALIDATION_ERROR;
      } else if (apiError.response?.data?.error) {
        errorMessage = apiError.response.data.error;
      } else if (apiError.response?.data?.message) {
        errorMessage = apiError.response.data.message;

        // Determine error type from message
        if (errorMessage.toLowerCase().includes('not found')) {
          errorType = PaymentErrorType.ORDER_NOT_FOUND;
        } else if (errorMessage.toLowerCase().includes('already paid')) {
          errorType = PaymentErrorType.ORDER_ALREADY_PAID;
        }
      } else if (apiError.message) {
        errorMessage = apiError.message;
      }

      setError(errorMessage);
      throw new PaymentError(errorType, errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get EMI options for an amount
   */
  const getEmiOptions = useCallback(async (amount: number): Promise<EmiOptionsResponse | null> => {
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.getEmiOptions(amount);

      if (response.data) {
        return response.data as EmiOptionsResponse;
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch EMI options:', err);
      return null;
    }
  }, []);

  /**
   * Get payment status by transaction ID
   */
  const getPaymentStatus = useCallback(async (tranId: string): Promise<PaymentStatusResponse | null> => {
    try {
      const api = (await import('@/lib/api')).default;
      const response = await api.getPaymentStatus(tranId);

      if (response.data) {
        return response.data as PaymentStatusResponse;
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch payment status:', err);
      return null;
    }
  }, []);

  /**
   * Redirect to SSL Commerz gateway
   * Opens in new tab to maintain app session
   */
  const redirectToGateway = useCallback((gatewayUrl: string, tranId: string) => {
    // Save current URL for redirect back after payment
    sessionStorage.setItem('ssl_payment_return_url', window.location.href);
    sessionStorage.setItem('ssl_payment_timestamp', Date.now().toString());

    // Open in new tab for better UX (user can return to app if needed)
    const paymentWindow = window.open(gatewayUrl, '_blank', 'noopener,noreferrer,width=1000,height=800');

    if (!paymentWindow) {
      // Fallback: redirect in same window if popup blocked
      window.location.href = gatewayUrl;
    }
  }, []);

  /**
   * Complete payment flow: initiate and redirect
   */
  const initiateAndPay = useCallback(async (data: InitiatePaymentRequest): Promise<void> => {
    try {
      const result = await initiatePayment(data);
      redirectToGateway(result.gateway_url, result.tran_id);
    } catch (err) {
      // Error is already handled in initiatePayment
      throw err;
    }
  }, [initiatePayment, redirectToGateway]);

  /**
   * Handle payment callback from SSL Commerz
   * Verifies the payment and redirects accordingly
   */
  const handleCallback = useCallback(async (
    callbackType: 'success' | 'fail' | 'cancel',
    callbackData: Record<string, unknown>
  ): Promise<{ success: boolean; redirectUrl: string }> => {
    try {
      const api = (await import('@/lib/api')).default;

      // Verify callback with backend
      const response = await api.verifyPaymentCallback({
        ...callbackData,
        callback_type: callbackType,
      });

      if (response.data) {
        const data = response.data as {
          order_invoice: string;
          callback_type: string;
        };

        // Clear payment session storage
        sessionStorage.removeItem('ssl_payment_tran_id');
        sessionStorage.removeItem('ssl_payment_order_id');
        sessionStorage.removeItem('ssl_payment_timestamp');

        // Redirect to appropriate page
        const redirectUrl = callbackType === 'success'
          ? `/order-success?invoice=${data.order_invoice}&payment=sslcommerz`
          : `/payment/${callbackType}`;

        return { success: true, redirectUrl };
      }

      return {
        success: false,
        redirectUrl: `/payment/fail?reason=verification_failed`,
      };
    } catch (err) {
      console.error('Payment callback verification failed:', err);
      return {
        success: false,
        redirectUrl: `/payment/fail?reason=callback_error`,
      };
    }
  }, []);

  /**
   * Clear payment state
   */
  const clearPaymentState = useCallback(() => {
    setError(null);
    setInitiatedPayment(null);
    sessionStorage.removeItem('ssl_payment_tran_id');
    sessionStorage.removeItem('ssl_payment_order_id');
    sessionStorage.removeItem('ssl_payment_return_url');
    sessionStorage.removeItem('ssl_payment_timestamp');
  }, []);

  /**
   * Check if there's a pending payment in session
   */
  const getPendingPayment = useCallback((): { tranId: string | null; orderId: string | null } => {
    return {
      tranId: sessionStorage.getItem('ssl_payment_tran_id'),
      orderId: sessionStorage.getItem('ssl_payment_order_id'),
    };
  }, []);

  return {
    loading,
    error,
    initiatedPayment,
    initiatePayment,
    getEmiOptions,
    getPaymentStatus,
    redirectToGateway,
    initiateAndPay,
    handleCallback,
    clearPaymentState,
    getPendingPayment,
  };
}
