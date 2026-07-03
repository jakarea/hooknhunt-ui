'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useAffiliateApplication } from '@/hooks/useAffiliateApplication';
import toast, { Toaster } from 'react-hot-toast';

export default function AffiliateApplicationPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const {
    loading,
    checkingStatus,
    error,
    affiliateStatus,
    checkAffiliateStatus,
    submitApplication,
    clearError,
  } = useAffiliateApplication();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    why_join: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.phoneNumber || user.phone_number || user.phone || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Check affiliate status on mount
  useEffect(() => {
    if (isAuthenticated) {
      checkAffiliateStatus().then(status => {
        // If already approved affiliate, redirect to dashboard
        if (status?.isAffiliate && status?.isApproved) {
          router.push('/account/affiliate');
        }
      });
    }
  }, [isAuthenticated, checkAffiliateStatus, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    clearError();
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[0-9]{11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid 11-digit phone number';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the validation errors');
      return;
    }

    const result = await submitApplication({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      why_join: formData.why_join,
    });

    if (result.success) {
      setSubmitted(true);
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  // Loading state
  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-[#fcf8f6] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137] mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your affiliate status...</p>
        </div>
      </div>
    );
  }

  // Already an affiliate but not approved
  if (affiliateStatus?.isAffiliate && !affiliateStatus?.isApproved) {
    return (
      <div className="flex-1">
        <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-yellow-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Pending Approval
            </h2>

            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Your affiliate application has been submitted and is currently under review. We will notify you once your application is approved.
            </p>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Your Referral Code:</strong> {affiliateStatus.referralCode}
              </p>
            </div>

            <Link
              href="/account"
              className="inline-block bg-gray-200 dark:bg-[#322020] text-gray-800 dark:text-gray-200 font-medium py-2 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Back to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Successfully submitted
  if (submitted) {
    return (
      <div className="flex-1">
        <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Application Submitted Successfully!
            </h2>

            <p className="text-gray-600 dark:text-gray-200 mb-6">
              Thank you for your interest in becoming an affiliate. Your application has been submitted and is under review. We will notify you once it's approved.
            </p>

            <Link
              href="/account"
              className="inline-block bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Back to Account
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Application form
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Main Content */}
      <div className="flex-1">
        <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Become an Affiliate
              </h1>
              <p className="text-gray-600 dark:text-gray-200">
                Join our affiliate program and earn commissions on every sale you refer.
              </p>
            </div>

                {/* Error Display */}
                {error && (
                  <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white ${
                        validationErrors.name
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-400'
                      }`}
                      placeholder="Enter your full name"
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white ${
                        validationErrors.phone
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-400'
                      }`}
                      placeholder="01XXXXXXXXX"
                    />
                    {validationErrors.phone && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.phone}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white ${
                        validationErrors.email
                          ? 'border-red-500 dark:border-red-500'
                          : 'border-gray-300 dark:border-gray-400'
                      }`}
                      placeholder="your@email.com"
                    />
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{validationErrors.email}</p>
                    )}
                  </div>

                  {/* Address (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Address <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white"
                      placeholder="Your address"
                    />
                  </div>

                  {/* Why Join (Optional) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                      Why do you want to join? <span className="text-gray-400">(Optional)</span>
                    </label>
                    <textarea
                      name="why_join"
                      value={formData.why_join}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white"
                      placeholder="Tell us why you want to become an affiliate..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <Link
                      href="/account"
                      className="text-gray-600 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#ec3137] hover:bg-[#8a0f12] disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Application'
                      )}
                    </button>
                  </div>
                </form>

                {/* Benefits */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-400">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Affiliate Benefits
                  </h3>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-200">
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Earn up to 5% commission on every sale</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Get your unique referral link and code</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Track your earnings and referrals in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fast and reliable payout system</span>
                </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
    </>
    );
}
