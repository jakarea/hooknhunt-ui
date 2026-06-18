'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface AdminAffiliate {
  id: number;
  user_id: number;
  referral_code: string;
  commission_rate: number;
  total_earned: number;
  withdrawn_amount: number;
  available_balance: number;
  total_clicks: number;
  total_conversions: number;
  conversion_rate: number;
  is_approved: boolean;
  rejection_reason?: string;
  admin_notes?: string;
  approved_at?: string;
  approved_by?: number;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
}

export interface AdminAffiliateStats {
  total_affiliates: number;
  active_affiliates: number;
  pending_affiliates: number;
  rejected_affiliates: number;
  total_earned: number;
  total_withdrawn: number;
  total_pending_payouts: number;
  total_completed_payouts: number;
  total_clicks: number;
  total_conversions: number;
  this_month_earnings: number;
  this_month_clicks: number;
}

export interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  from: number;
  to: number;
}

export function useAdminAffiliate() {
  const [affiliates, setAffiliates] = useState<AdminAffiliate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminAffiliateStats | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    per_page: 15,
    current_page: 1,
    last_page: 1,
    from: 0,
    to: 0,
  });

  /**
   * Fetch affiliates list
   */
  const fetchAffiliates = useCallback(async (params?: {
    page?: number;
    status?: 'all' | 'pending' | 'approved' | 'rejected';
    search?: string;
    per_page?: number;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAdminAffiliates(params);

      if (response.success && response.data) {
        setAffiliates(response.data.affiliates);
        setPagination(response.data.pagination);
        return response;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch affiliates');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch statistics
   */
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAdminAffiliateStats();

      if (response.success && response.data) {
        setStats(response.data);
        return response;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return response;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch statistics');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Approve affiliate
   */
  const approveAffiliate = useCallback(async (id: number, commissionRate?: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.approveAffiliate(id, commissionRate);

      if (response.success) {
        return { success: true, message: response.message };
      }

      if (response.message) {
        setError(response.message);
      }

      return { success: false, message: response.message || 'Failed to approve affiliate' };
    } catch (err: any) {
      setError(err.message || 'Failed to approve affiliate');
      return { success: false, message: err.message || 'Failed to approve affiliate' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reject affiliate
   */
  const rejectAffiliate = useCallback(async (id: number, reason?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.rejectAffiliate(id, reason);

      if (response.success) {
        return { success: true, message: response.message };
      }

      if (response.message) {
        setError(response.message);
      }

      return { success: false, message: response.message || 'Failed to reject affiliate' };
    } catch (err: any) {
      setError(err.message || 'Failed to reject affiliate');
      return { success: false, message: err.message || 'Failed to reject affiliate' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Update affiliate
   */
  const updateAffiliate = useCallback(async (id: number, data: {
    commission_rate?: number;
    admin_notes?: string;
    is_approved?: boolean;
    referral_code?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.updateAffiliate(id, data);

      if (response.success) {
        return { success: true, message: response.message };
      }

      if (response.message) {
        setError(response.message);
      }

      return { success: false, message: response.message || 'Failed to update affiliate' };
    } catch (err: any) {
      setError(err.message || 'Failed to update affiliate');
      return { success: false, message: err.message || 'Failed to update affiliate' };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get affiliate details
   */
  const getAffiliateDetails = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAdminAffiliateDetails(id);

      if (response.success && response.data) {
        return response.data;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch affiliate details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get affiliate detail with period filtering
   */
  const getAffiliateDetail = useCallback(async (id: string, period: '7days' | '30days' | '90days' | '1year' = '30days') => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAffiliateDetail(id, period);

      if (response.success && response.data) {
        return response;
      }

      if (response.message && !response.success) {
        setError(response.message);
      }

      return { success: false, data: null };
    } catch (err: any) {
      setError(err.message || 'Failed to fetch affiliate detail');
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    affiliates,
    loading,
    error,
    stats,
    pagination,

    // Methods
    fetchAffiliates,
    fetchStats,
    approveAffiliate,
    rejectAffiliate,
    updateAffiliate,
    getAffiliateDetails,
    getAffiliateDetail,
    clearError,
  };
}
