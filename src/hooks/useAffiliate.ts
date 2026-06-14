'use client';

import { useState, useCallback, useEffect } from 'react';
import type {
  Affiliate,
  AffiliateDashboardResponse,
  AffiliateDashboardParams,
  PayoutRequest,
  AffiliateError,
} from '@/types/affiliate';
import api from '@/lib/api';

/**
 * Custom hook for affiliate dashboard functionality
 * Handles fetching dashboard data, stats, and payout requests
 */
export function useAffiliate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [affiliate, setAffiliate] = useState<Affiliate | null>(null);
  const [recentReferrals, setRecentReferrals] = useState<any[]>([]);
  const [recentEarnings, setRecentEarnings] = useState<any[]>([]);
  const [recentPayouts, setRecentPayouts] = useState<any[]>([]);
  const [productCommissions, setProductCommissions] = useState<any[]>([]);
  const [categoryCommissions, setCategoryCommissions] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  /**
   * Fetch affiliate dashboard data
   */
  const fetchDashboard = useCallback(async (params?: AffiliateDashboardParams) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAffiliateDashboard(params?.period);

      if (response.data) {
        const data = response.data as AffiliateDashboardResponse['data'];

        // Normalize affiliate data with default values
        const affiliateData: Affiliate = {
          id: data.affiliate?.id ?? 0,
          user_id: data.affiliate?.user_id ?? 0,
          referral_code: data.affiliate?.referral_code ?? data.affiliate?.referralCode ?? '',
          referral_link: data.affiliate?.referral_link ?? '',
          commission_rate: data.affiliate?.commission_rate ?? data.affiliate?.commissionRate ?? 5,
          total_earned: data.affiliate?.total_earned ?? data.affiliate?.totalEarned ?? 0,
          withdrawn_amount: data.affiliate?.withdrawn_amount ?? data.affiliate?.withdrawnAmount ?? 0,
          available_balance: data.affiliate?.available_balance ?? data.affiliate?.availableBalance ?? 0,
          total_clicks: data.affiliate?.total_clicks ?? data.affiliate?.totalClicks ?? 0,
          total_conversions: data.affiliate?.total_conversions ?? data.affiliate?.totalConversions ?? 0,
          conversion_rate: data.affiliate?.conversion_rate ?? data.affiliate?.conversionRateValue ?? 0,
          is_approved: data.affiliate?.is_approved ?? data.affiliate?.isApproved ?? false,
          created_at: data.affiliate?.created_at ?? new Date().toISOString(),
          approved_at: data.affiliate?.approved_at,
          last_conversion_at: data.affiliate?.last_conversion_at,
          // Additional fields for compatibility
          referralCode: data.affiliate?.referral_code ?? data.affiliate?.referralCode ?? '',
          commissionRate: data.affiliate?.commission_rate ?? data.affiliate?.commissionRate ?? 5,
          totalEarned: data.affiliate?.total_earned ?? data.affiliate?.totalEarned ?? 0,
          withdrawnAmount: data.affiliate?.withdrawn_amount ?? data.affiliate?.withdrawnAmount ?? 0,
          availableBalance: data.affiliate?.available_balance ?? data.affiliate?.availableBalance ?? 0,
          totalClicks: data.affiliate?.total_clicks ?? data.affiliate?.totalClicks ?? 0,
          totalConversions: data.affiliate?.total_conversions ?? data.affiliate?.totalConversions ?? 0,
          conversionRateValue: data.affiliate?.conversion_rate ?? data.affiliate?.conversionRateValue ?? 0,
          isApproved: data.affiliate?.is_approved ?? data.affiliate?.isApproved ?? false,
        };

        // Set all data from response
        setAffiliate(affiliateData);
        setRecentReferrals(data.recent_referrals || []);
        setRecentEarnings(data.recent_earnings || []);
        setRecentPayouts([]); // recent_payouts not in API response
        setProductCommissions(data.product_commissions || []);
        setCategoryCommissions(data.category_commissions || []);

        return data;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return null;
    } catch (err: unknown) {
      const error = err as AffiliateError;

      let errorMessage = 'Failed to load dashboard data';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = 'Please login to access your dashboard';
      } else if (error.status === 403) {
        errorMessage = 'Your affiliate application is pending approval';
      } else if (error.status === 404) {
        errorMessage = 'Affiliate account not found';
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Request payout
   */
  const requestPayout = useCallback(async (data: PayoutRequest): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.requestAffiliatePayout(data);

      if (response.success) {
        // Refresh dashboard after successful payout request
        await fetchDashboard();
        return true;
      }

      if (response.message) {
        setError(response.message);
      }

      return false;
    } catch (err: unknown) {
      const error = err as AffiliateError;

      let errorMessage = 'Failed to submit payout request';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.errors) {
        const firstError = Object.values(error.errors)[0];
        errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
      }

      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchDashboard]);

  /**
   * Fetch products with prices and commission information
   */
  const fetchProducts = useCallback(async () => {
    try {
      setLoadingProducts(true);
      setError(null);

      const response = await api.getAffiliateProducts();

      if (response.data && response.data.products) {
        setProducts(response.data.products);
        return response.data.products;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return [];
    } catch (err: unknown) {
      const error = err as AffiliateError;

      let errorMessage = 'Failed to fetch products';

      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = 'Please login to view products';
      } else if (error.status === 403) {
        errorMessage = 'You must be an approved affiliate to view products';
      }

      setError(errorMessage);
      return [];
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Calculate stats from dashboard data
   */
  const getStats = useCallback(() => {
    if (!affiliate) return null;

    return {
      totalEarnings: {
        value: `৳${affiliate.total_earned.toFixed(2)}`,
        raw: affiliate.total_earned,
      },
      referrals: {
        value: affiliate.total_clicks.toString(),
        raw: affiliate.total_clicks,
      },
      conversionRate: {
        value: `${affiliate.conversion_rate}%`,
        raw: affiliate.conversion_rate,
      },
      pendingPayout: {
        value: `৳${affiliate.available_balance.toFixed(2)}`,
        raw: affiliate.available_balance,
      },
    };
  }, [affiliate]);

  return {
    // State
    loading,
    error,
    affiliate,
    recentReferrals,
    recentEarnings,
    recentPayouts,
    productCommissions,
    categoryCommissions,
    products,
    loadingProducts,
    setAffiliate,

    // Methods
    fetchDashboard,
    fetchProducts,
    requestPayout,
    clearError,
    getStats,
  };
}
