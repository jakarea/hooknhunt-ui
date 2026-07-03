'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();

  // Helper to get phone number from either field name (supports both camelCase and snake_case)
  const getPhoneNumber = (): string => {
    return user?.phoneNumber || user?.phone_number || user?.phone || '';
  };

  // Helper to get phone verification status (supports both camelCase and snake_case)
  const isPhoneVerified = (): boolean => {
    return !!(user?.phoneVerifiedAt || user?.phone_verified_at);
  };

  // Helper to get created date (supports both camelCase and snake_case)
  const getCreatedAt = (): string => {
    return user?.createdAt || user?.created_at || '';
  };

  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]> | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp_number: '',
  });

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp_number: user.customer_profile?.whatsapp_number || '',
      });
    }
  }, [user]);

  const clearErrors = () => {
    setError(null);
    setValidationErrors(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearErrors();
  };

  const handleSave = async () => {
    try {
      setUpdating(true);
      setError(null);
      setValidationErrors(null);

      await api.updateProfile(formData);
      setIsEditing(false);
      toast.success('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
    } catch (err: unknown) {
      const error = err as { status?: number; errors?: Record<string, string[]>; message?: string };

      if (error.status === 422 && error.errors) {
        setValidationErrors(error.errors);
      } else {
        setError(error.message || 'প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে');
        toast.error('প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে');
      }
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        whatsapp_number: user.customer_profile?.whatsapp_number || '',
      });
    }
    clearErrors();
  };

  const getFieldError = (fieldName: string): string | null => {
    if (validationErrors && validationErrors[fieldName]) {
      return validationErrors[fieldName][0];
    }
    return null;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#fcf8f6]">
        <div className="container py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ec3137]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">প্রোফাইল</h1>
          <p className="text-gray-600 dark:text-gray-200 mt-2">আপনার অ্যাকাউন্ট তথ্য এবং পছন্দগুলো পরিচালনা করুন</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            প্রোফাইল সম্পাদনা করুন
          </button>
        )}
      </div>

            {/* Error Message */}
            {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
            </div>
            )}

            {/* Success Message */}
            {!isEditing && user && !error && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg hidden" id="success-message">
            প্রোফাইল সফলভাবে আপডেট হয়েছে!
            </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-6">
            <div className="text-center">
            <div className="w-24 h-24 bg-[#ec3137] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">
            {user?.name ? user.name.charAt(0).toUpperCase() : (getPhoneNumber() || 'U').slice(0, 2)}
            </span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {user?.name || 'গ্রাহক'}
            </h2>
            <p className="text-gray-600 dark:text-gray-200 mt-1">{getPhoneNumber() || 'সেট করা নেই'}</p>
            <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {isPhoneVerified() ? 'যাচাই করা হয়েছে' : 'যাচাই করা হয়নি'}
            </div>
            </div>
            </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">ব্যক্তিগত তথ্য</h3>

            <div className="space-y-4">
            {/* Phone Number (Read-only) */}
            <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
            ফোন নম্বর
            </label>
            <input
            type="text"
            value={getPhoneNumber()}
            disabled
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-400 rounded-lg bg-gray-100 dark:bg-[#322020] text-gray-500 dark:text-gray-200 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
            ফোন নম্বর পরিবর্তন করা যাবে না
            </p>
            </div>

            {/* Name */}
            <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
            পূর্ণ নাম
            </label>
            <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg transition-colors ${
            getFieldError('name')
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-400 focus:ring-[#ec3137]'
            } ${
            isEditing
            ? 'bg-white dark:bg-[#322020] text-gray-900 dark:text-white'
            : 'bg-gray-100 dark:bg-[#322020] text-gray-500 dark:text-gray-200 cursor-not-allowed'
            } focus:outline-none focus:ring-2`}
            />
            {getFieldError('name') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('name')}</p>
            )}
            </div>

            {/* Email */}
            <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
            ইমেইল ঠিকানা
            </label>
            <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-2 border rounded-lg transition-colors ${
            getFieldError('email')
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-400 focus:ring-[#ec3137]'
            } ${
            isEditing
            ? 'bg-white dark:bg-[#322020] text-gray-900 dark:text-white'
            : 'bg-gray-100 dark:bg-[#322020] text-gray-500 dark:text-gray-200 cursor-not-allowed'
            } focus:outline-none focus:ring-2`}
            />
            {getFieldError('email') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('email')}</p>
            )}
            </div>

            {/* WhatsApp Number */}
            <div>
            <label htmlFor="whatsapp_number" className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
            হোয়াটসঅ্যাপ নম্বর
            </label>
            <input
            type="tel"
            id="whatsapp_number"
            name="whatsapp_number"
            value={formData.whatsapp_number}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="01XXXXXXXXX"
            className={`w-full px-4 py-2 border rounded-lg transition-colors ${
            getFieldError('whatsapp_number')
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-400 focus:ring-[#ec3137]'
            } ${
            isEditing
            ? 'bg-white dark:bg-[#322020] text-gray-900 dark:text-white'
            : 'bg-gray-100 dark:bg-[#322020] text-gray-500 dark:text-gray-200 cursor-not-allowed'
            } focus:outline-none focus:ring-2`}
            />
            {getFieldError('whatsapp_number') && (
            <p className="text-red-500 text-sm mt-1">{getFieldError('whatsapp_number')}</p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-200 mt-1">
            ঐচ্ছিক: অর্ডার আপডেট এবং গ্রাহক সহায়তার জন্য
            </p>
            </div>

            {/* Action Buttons */}
            {isEditing && (
            <div className="flex gap-3 pt-4">
            <button
            onClick={handleSave}
            disabled={updating}
            className="flex-1 bg-[#ec3137] hover:bg-[#8a0f12] text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {updating ? (
            <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            সংরক্ষণ হচ্ছে...
            </span>
            ) : (
            'পরিবর্তন সংরক্ষণ করুন'
            )}
            </button>
            <button
            onClick={handleCancel}
            disabled={updating}
            className="flex-1 bg-gray-200 dark:bg-[#322020] hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
            বাতিল
            </button>
            </div>
            )}
            </div>
            </div>

            {/* Account Information */}
            <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg shadow-sm border border-gray-200 dark:border-gray-400 p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">অ্যাকাউন্ট তথ্য</h3>
            <div className="space-y-3 text-sm">
            <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">অ্যাকাউন্ট ধরন:</span>
            <span className="font-medium text-gray-900 dark:text-white capitalize">
            {user?.role?.replace('_', ' ') || 'গ্রাহক'}
            </span>
            </div>
            <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">সদস্য হয়েছেন:</span>
            <span className="font-medium text-gray-900 dark:text-white">
            {getCreatedAt() ? new Date(getCreatedAt()).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
            }) : 'প্রযোজ্য নয়'}
            </span>
            </div>
            <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-200">ফোন যাচাই করা হয়েছে:</span>
            <span className="font-medium text-gray-900 dark:text-white">
            {isPhoneVerified() ? (
            <span className="text-green-600 dark:text-green-400">✓ যাচাই করা হয়েছে</span>
            ) : (
            <span className="text-yellow-600 dark:text-yellow-400">পেন্ডিং</span>
            )}
            </span>
            </div>
            </div>
            </div>
        </div>
      </div>
    </>
    );
}
