'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAffiliate } from '@/hooks/useAdminAffiliate';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import toast, { Toaster } from 'react-hot-toast';

function AdminAffiliateApplicationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = (searchParams.get('status') || 'all') as 'pending' | 'all' | 'approved' | 'rejected';

  const {
    affiliates,
    loading,
    error,
    pagination,
    fetchAffiliates,
    approveAffiliate,
    rejectAffiliate,
    updateAffiliate,
    clearError
  } = useAdminAffiliate();

  const [searchTerm, setSearchTerm] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [commissionRate, setCommissionRate] = useState(5);
  const [selectedAffiliates, setSelectedAffiliates] = useState<number[]>([]);

  // Edit referral code states
  const [showEditReferralModal, setShowEditReferralModal] = useState(false);
  const [editingReferralId, setEditingReferralId] = useState<number | null>(null);
  const [newReferralCode, setNewReferralCode] = useState('');

  // Fetch affiliates on mount and when filters change
  useEffect(() => {
    const params: any = {
      page: 1,
      per_page: 15,
    };

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    fetchAffiliates(params);
  }, [statusFilter, fetchAffiliates]);

  // Handle search
  const handleSearch = useCallback(() => {
    const params: any = {
      page: 1,
      per_page: 15,
      search: searchTerm,
    };

    if (statusFilter !== 'all') {
      params.status = statusFilter;
    }

    fetchAffiliates(params);
  }, [searchTerm, statusFilter, fetchAffiliates]);

  // Handle approve
  const handleApprove = async (id: number, customCommission?: number) => {
    const result = await approveAffiliate(id, customCommission);
    if (result.success) {
      toast.success('Affiliate approved successfully!');
      setShowApproveModal(false);
      setApprovingId(null);
      setCommissionRate(5);
      setSelectedAffiliates([]);
      // Refresh the list
      const params: any = { page: 1, per_page: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      await fetchAffiliates(params);
    } else {
      toast.error(result.message || 'Failed to approve affiliate');
    }
  };

  // Handle reject
  const handleReject = async (id: number, reason?: string) => {
    const result = await rejectAffiliate(id, reason);
    if (result.success) {
      toast.success('Affiliate rejected successfully!');
      setShowRejectModal(false);
      setRejectingId(null);
      setRejectReason('');
      setSelectedAffiliates([]);
      // Refresh the list
      const params: any = { page: 1, per_page: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      await fetchAffiliates(params);
    } else {
      toast.error(result.message || 'Failed to reject affiliate');
    }
  };

  // Handle edit referral code
  const openEditReferralModal = (affiliate: any) => {
    setEditingReferralId(affiliate.id);
    setNewReferralCode(affiliate.referral_code);
    setShowEditReferralModal(true);
  };

  const handleSaveReferralCode = async () => {
    if (!newReferralCode.trim()) {
      toast.error('Referral code cannot be empty');
      return;
    }

    if (!editingReferralId) return;

    const result = await updateAffiliate(editingReferralId, { referral_code: newReferralCode.toUpperCase() });
    if (result.success) {
      toast.success('Referral code updated successfully!');
      setShowEditReferralModal(false);
      setEditingReferralId(null);
      setNewReferralCode('');
      // Refresh the list
      const params: any = { page: pagination.current_page, per_page: 15 };
      if (statusFilter !== 'all') params.status = statusFilter;
      await fetchAffiliates(params);
    } else {
      toast.error(result.message || 'Failed to update referral code');
    }
  };

  // Open reject modal
  const openRejectModal = (id: number) => {
    setRejectingId(id);
    setShowRejectModal(true);
  };

  // Open approve modal
  const openApproveModal = (id: number) => {
    setApprovingId(id);
    setShowApproveModal(true);
  };

  // Handle bulk approve
  const handleBulkApprove = async () => {
    for (const id of selectedAffiliates) {
      await handleApprove(id);
    }
  };

  // Handle bulk reject
  const handleBulkReject = async () => {
    if (selectedAffiliates.length === 1) {
      openRejectModal(selectedAffiliates[0]);
      return;
    }

    if (!rejectReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    for (const id of selectedAffiliates) {
      await handleReject(id, rejectReason);
    }
  };

  // Toggle select affiliate
  const toggleSelectAffiliate = (id: number) => {
    setSelectedAffiliates(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const toggleSelectAll = () => {
    if (selectedAffiliates.length === affiliates.length) {
      setSelectedAffiliates([]);
    } else {
      setSelectedAffiliates(affiliates.map(a => a.id));
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get status badge color
  const getStatusBadge = (isApproved: boolean, rejectionReason?: string) => {
    if (rejectionReason) {
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
    if (isApproved) {
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
  };

  // Get status text
  const getStatusText = (isApproved: boolean, rejectionReason?: string) => {
    if (rejectionReason) return 'Rejected';
    if (isApproved) return 'Approved';
    return 'Pending';
  };

  // Loading state
  if (loading && affiliates.length === 0) {
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
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#363636', color: '#fff' },
        }}
      />

      <AdminHeader />

      <div className="flex">
        <AdminSidebar />

        <main className="flex-1 p-8">
          {/* Page Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Affiliate Applications
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Review and manage affiliate applications
              </p>
            </div>
            <Link
              href="/admin/affiliate"
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
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

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or referral code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => router.push(`/admin/affiliate/applications?status=${e.target.value}`)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedAffiliates.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-blue-800 dark:text-blue-200">
                  {selectedAffiliates.length} affiliate(s) selected
                </span>
                <div className="flex gap-3">
                  <button
                    onClick={handleBulkApprove}
                    className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Approve Selected
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Reject Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Affiliates Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedAffiliates.length === affiliates.length && affiliates.length > 0}
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Referral Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Commission
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedAffiliates.includes(affiliate.id)}
                          onChange={() => toggleSelectAffiliate(affiliate.id)}
                          className="rounded border-gray-300 dark:border-gray-600"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        #{affiliate.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {affiliate.user?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {affiliate.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono text-gray-900 dark:text-white">
                            {affiliate.referral_code}
                          </span>
                          <button
                            onClick={() => openEditReferralModal(affiliate)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            title="Edit referral code"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(affiliate.is_approved, affiliate.rejection_reason)}`}>
                          {getStatusText(affiliate.is_approved, affiliate.rejection_reason)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {affiliate.commission_rate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(affiliate.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          <Link
                            href={`/crm/affiliates/${affiliate.id}`}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            View
                          </Link>
                          {!affiliate.is_approved && !affiliate.rejection_reason && (
                            <>
                              <button
                                onClick={() => openApproveModal(affiliate.id)}
                                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openRejectModal(affiliate.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {affiliates.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No affiliates found</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your search or filter</p>
              </div>
            )}

            {/* Pagination */}
            {pagination.total > 0 && (
              <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-600">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{pagination.from || 0}</span> to{' '}
                  <span className="font-medium">{pagination.to || 0}</span> of{' '}
                  <span className="font-medium">{pagination.total}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchAffiliates({ page: pagination.current_page - 1, status: statusFilter, per_page: 15 })}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchAffiliates({ page: pagination.current_page + 1, status: statusFilter, per_page: 15 })}
                    disabled={pagination.current_page === pagination.last_page}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reject Modal */}
          {showRejectModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Reject Affiliate Application
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleReject(rejectingId!, rejectReason); }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason for Rejection <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
                        placeholder="Provide a clear reason for rejecting this application..."
                      />
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowRejectModal(false);
                          setRejectingId(null);
                          setRejectReason('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
                      >
                        Reject Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Approve Modal */}
          {showApproveModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Approve Affiliate Application
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleApprove(approvingId!, commissionRate); }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Commission Rate (%)
                      </label>
                      <input
                        type="number"
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(parseFloat(e.target.value))}
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Default commission rate. Can be customized later.
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowApproveModal(false);
                          setApprovingId(null);
                          setCommissionRate(5);
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                      >
                        Approve Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Edit Referral Code Modal */}
          {showEditReferralModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Edit Referral Code
                  </h3>
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveReferralCode(); }}>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Referral Code <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newReferralCode}
                        onChange={(e) => setNewReferralCode(e.target.value.toUpperCase())}
                        required
                        maxLength={20}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-gray-700 dark:text-white font-mono"
                        placeholder="ENTER CODE"
                      />
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Referral code will be automatically converted to uppercase
                      </p>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditReferralModal(false);
                          setEditingReferralId(null);
                          setNewReferralCode('');
                        }}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#ec3137] hover:bg-[#8a0f12] text-white rounded-lg text-sm font-medium"
                      >
                        Save Code
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// Export with Suspense boundary
export default function AdminAffiliateApplications() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
      </div>
    }>
      <AdminAffiliateApplicationsContent />
    </Suspense>
  );
}
