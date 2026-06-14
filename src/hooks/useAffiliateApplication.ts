'use client';

import { useState, useCallback } from 'react';
import type {
  AffiliateApplicationRequest,
  AffiliateCheckResponse,
  AffiliateApplicationResponse,
  AffiliateError,
} from '@/types/affiliate';
import api from '@/lib/api';

/**
 * Custom hook for affiliate application flow
 * Handles checking affiliate status, application submission, and approval states
 */
export function useAffiliateApplication() {
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliateStatus, setAffiliateStatus] = useState<{
    isAffiliate: boolean;
    isApproved: boolean;
    referralCode?: string;
  } | null>(null);

  /**
   * Check if current user is an affiliate
   */
  const checkAffiliateStatus = useCallback(async (): Promise<{
    isAffiliate: boolean;
    isApproved: boolean;
    referralCode?: string;
  } | null> => {
    try {
      setCheckingStatus(true);
      setError(null);

      const response = await api.checkAffiliateStatus();

      if (response.isAffiliate !== undefined) {
        const status = {
          isAffiliate: response.isAffiliate,
          isApproved: response.data?.isApproved || false,
          referralCode: response.data?.referralCode,
        };

        setAffiliateStatus(status);
        return status;
      }

      return null;
    } catch (err: unknown) {
      const error = err as AffiliateError;

      let errorMessage = 'Failed to check affiliate status';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = 'Please login to check your status';
      }

      setError(errorMessage);
      return null;
    } finally {
      setCheckingStatus(false);
    }
  }, []);

  /**
   * Submit affiliate application
   */
  const submitApplication = useCallback(async (
    data: AffiliateApplicationRequest
  ): Promise<{ success: boolean; message: string; referralCode?: string }> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.applyForAffiliate(data);

      if (response.success && response.data) {
        return {
          success: true,
          message: response.message || 'Application submitted successfully',
          referralCode: response.data.referral_code,
        };
      }

      if (response.message) {
        setError(response.message);
        return {
          success: false,
          message: response.message,
        };
      }

      return {
        success: false,
        message: 'Failed to submit application',
      };
    } catch (err: unknown) {
      const error = err as AffiliateError;

      let errorMessage = 'Failed to submit application';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 422 && error.errors) {
        // Validation error
        const firstError = Object.values(error.errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      } else if (error.status === 401) {
        errorMessage = 'Please login to submit an application';
      }

      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    loading,
    checkingStatus,
    error,
    affiliateStatus,

    // Methods
    checkAffiliateStatus,
    submitApplication,
    clearError,
  };
}
