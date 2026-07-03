'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAdminCRMLeads, Lead } from '@/hooks/useAdminCRMLeads';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Toaster, toast } from 'react-hot-toast';

export default function AdminCRMLeadsPage() {
  const {
    leads,
    loading,
    error,
    pagination,
    stats,
    fetchLeads,
    fetchStats,
    updateLeadStatus,
    deleteLead,
    clearError,
  } = useAdminCRMLeads();

  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    priority: 'all',
    search: '',
  });

  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Initial fetch
  useEffect(() => {
    fetchLeads({ page: 1, per_page: 20 });
    fetchStats();
  }, [fetchLeads, fetchStats]);

  const handleSearch = useCallback(() => {
    fetchLeads({
      page: 1,
      per_page: 20,
      status: filters.status === 'all' ? undefined : filters.status,
      source: filters.source === 'all' ? undefined : filters.source,
      priority: filters.priority === 'all' ? undefined : filters.priority,
      search: filters.search || undefined,
    });
  }, [filters, fetchLeads]);

  const handlePageChange = (page: number) => {
    fetchLeads({
      page,
      per_page: 20,
      status: filters.status === 'all' ? undefined : filters.status,
      search: filters.search || undefined,
    });
  };

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    const success = await updateLeadStatus(leadId, { status: newStatus });
    if (success) {
      // Refresh stats
      fetchStats();
    }
  };

  const handleDelete = async (leadId: number) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      const success = await deleteLead(leadId);
      if (success) {
        fetchStats();
      }
    }
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'new': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'contacted': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'qualified': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'proposal': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'negotiation': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'converted': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      'lost': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'urgent': 'bg-red-100 text-red-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Initial loading state
  if (loading && leads.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
        <AdminHeader />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137]"></div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      <AdminHeader />
      <AdminSidebar />

      <main className="flex-1 p-8">
        {/* Page Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              CRM Leads
            </h1>
            <p className="text-gray-600 dark:text-gray-200 mt-2">
              Manage contact form submissions and leads
            </p>
          </div>
          <Link href="/admin" className="text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white">
            ← Back to Dashboard
          </Link>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">{error}</p>
            <button onClick={clearError} className="mt-2 text-sm underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-200">Total Leads</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-200">New Leads</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{stats.new}</div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-200">Converted</div>
              <div className="text-2xl font-bold text-green-600 mt-1">{stats.converted}</div>
            </div>
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4">
              <div className="text-sm text-gray-600 dark:text-gray-200">Unassigned</div>
              <div className="text-2xl font-bold text-orange-600 mt-1">{stats.unassigned}</div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
            />
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="md:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="lost">Lost</option>
            </select>
            <select
              value={filters.source}
              onChange={(e) => setFilters({ ...filters, source: e.target.value })}
              className="md:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Sources</option>
              <option value="website_contact_form">Contact Form</option>
              <option value="manual">Manual</option>
              <option value="checkout_interceptor">Checkout</option>
            </select>
            <button
              onClick={handleSearch}
              className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-200 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer" onClick={() => handleViewLead(lead)}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-white">{lead.name}</div>
                      {lead.assignedAgent && (
                        <div className="text-xs text-gray-500">Assigned to: {lead.assignedAgent.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{lead.phone}</div>
                      {lead.email && (
                        <div className="text-xs text-gray-500">{lead.email}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                        {lead.subject || 'No subject'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(lead.id, e.target.value);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(lead.status)}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="converted">Converted</option>
                        <option value="lost">Lost</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-200">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(lead.id);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {leads.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No leads found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-200">Try adjusting your search or filters</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
              <div className="text-sm text-gray-700 dark:text-gray-100">
                Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
                <span className="font-medium">{pagination.to || 0}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handlePageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-100 bg-white dark:bg-[#1a1a1a] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Lead Detail Modal */}
      {showDetailModal && selectedLead && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Lead Details
                </h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Name</label>
                  <p className="text-gray-900 dark:text-white">{selectedLead.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Phone</label>
                    <p className="text-gray-900 dark:text-white">{selectedLead.phone}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Email</label>
                    <p className="text-gray-900 dark:text-white">{selectedLead.email || 'N/A'}</p>
                  </div>
                </div>

                {selectedLead.subject && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Subject</label>
                    <p className="text-gray-900 dark:text-white">{selectedLead.subject}</p>
                  </div>
                )}

                {selectedLead.notes && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Message</label>
                    <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{selectedLead.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Status</label>
                    <p className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getStatusColor(selectedLead.status)}`}>
                      {selectedLead.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Priority</label>
                    <p className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${getPriorityColor(selectedLead.priority)}`}>
                      {selectedLead.priority}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Source</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedLead.source}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Created</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedLead.created_at)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Updated</label>
                    <p className="text-gray-900 dark:text-white">{formatDate(selectedLead.updated_at)}</p>
                  </div>
                </div>

                {selectedLead.assignedAgent && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-100">Assigned To</label>
                    <p className="text-gray-900 dark:text-white">{selectedLead.assignedAgent.name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
