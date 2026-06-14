'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface Lead {
  id: number;
  name: string;
  phone: string;
  email?: string;
  subject?: string;
  notes?: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'converted' | 'lost';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigned_to?: number;
  assignedAgent?: {
    id: number;
    name: string;
  };
  customer?: any;
  activities?: Array<{
    id: number;
    type: string;
    summary: string;
    notes?: string;
    schedule_at?: string;
    created_at: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface PaginationData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface CRMLeadsStats {
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
  by_source: Record<string, number>;
  unassigned: number;
}

export function useAdminCRMLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
    from: 0,
    to: 0,
  });
  const [stats, setStats] = useState<CRMLeadsStats | null>(null);

  const fetchLeads = useCallback(async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    source?: string;
    priority?: string;
    assigned_to?: number;
    search?: string;
    date_from?: string;
    date_to?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getAdminLeads(params) as any;

      if (response.success && response.data) {
        setLeads(response.data.leads || []);
        setPagination(response.data.pagination || pagination);
      } else {
        setError('Failed to fetch leads');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch leads');
    } finally {
      setLoading(false);
    }
  }, [pagination]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getAdminLeadsStats() as any;
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const updateLeadStatus = useCallback(async (id: number, data: {
    status?: string;
    priority?: string;
    assigned_to?: number;
    notes?: string;
  }) => {
    try {
      const response = await api.updateAdminLead(id, data) as any;
      if (response.success) {
        toast.success(response.message || 'Lead updated successfully');
        // Refresh leads list
        fetchLeads();
        return true;
      } else {
        toast.error(response.message || 'Failed to update lead');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update lead');
      return false;
    }
  }, [fetchLeads]);

  const deleteLead = useCallback(async (id: number) => {
    try {
      const response = await api.deleteAdminLead(id) as any;
      if (response.success) {
        toast.success(response.message || 'Lead deleted successfully');
        // Refresh leads list
        fetchLeads();
        return true;
      } else {
        toast.error(response.message || 'Failed to delete lead');
        return false;
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete lead');
      return false;
    }
  }, [fetchLeads]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    leads,
    loading,
    error,
    pagination,
    stats,

    // Methods
    fetchLeads,
    fetchStats,
    updateLeadStatus,
    deleteLead,
    clearError,
  };
}
