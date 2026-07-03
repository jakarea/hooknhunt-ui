'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface PayoutRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onSubmit: (data: {
    amount: number;
    payment_method: 'bank_transfer' | 'bkash' | 'nagad' | 'rocket' | 'other';
    payment_details: string;
  }) => Promise<boolean>;
  loading?: boolean;
}

export default function PayoutRequestModal({
  isOpen,
  onClose,
  availableBalance,
  onSubmit,
  loading = false,
}: PayoutRequestModalProps) {
  const [formData, setFormData] = useState({
    amount: '',
    payment_method: 'bank_transfer' as 'bank_transfer' | 'bkash' | 'nagad' | 'rocket' | 'other',
    payment_details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    const amount = parseFloat(formData.amount);
    if (!formData.amount || isNaN(amount)) {
      newErrors.amount = 'পরিমাণ আবশ্যক';
    } else if (amount < 100) {
      newErrors.amount = 'ন্যূনতম পেমেন্ট পরিমাণ ৳১০০';
    } else if (amount > availableBalance) {
      newErrors.amount = `পরিমাণ উপলব্ধ ব্যালেন্স অতিক্রম করতে পারবে না (৳${availableBalance.toFixed(2)})`;
    }

    if (!formData.payment_details.trim()) {
      newErrors.payment_details = 'পেমেন্ট বিবরণ আবশ্যক';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('অনুগ্রহ করে ভ্যালিডেশন ত্রুটিগুলো সংশোধন করুন');
      return;
    }

    setSubmitting(true);

    const success = await onSubmit({
      amount: parseFloat(formData.amount),
      payment_method: formData.payment_method,
      payment_details: formData.payment_details,
    });

    setSubmitting(false);

    if (success) {
      toast.success('পেমেন্ট অনুরোধ সফলভাবে জমা দেওয়া হয়েছে!');
      setFormData({
        amount: '',
        payment_method: 'bank_transfer',
        payment_details: '',
      });
      onClose();
    }
  };

  const handleClose = () => {
    setFormData({
      amount: '',
      payment_method: 'bank_transfer',
      payment_details: '',
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {/* Header */}
            <div className="sm:flex sm:items-start mb-4">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-2">
                  পেমেন্ট অনুরোধ করুন
                </h3>
                <div className="mt-1">
                  <p className="text-sm text-gray-500 dark:text-gray-200">
                    উপলব্ধ ব্যালেন্স: <span className="font-semibold text-[#ec3137]">৳{availableBalance.toFixed(2)}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  পেমেন্ট পরিমাণ (৳) <span className="text-red-500">*</span>
                  <span className="text-gray-500 dark:text-gray-200 text-xs ml-2">
                    ন্যূনতম: ৳১০০
                  </span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  min="100"
                  max={availableBalance}
                  step="0.01"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white ${
                    errors.amount ? 'border-red-500' : 'border-gray-300 dark:border-gray-400'
                  }`}
                  placeholder="পরিমাণ লিখুন"
                />
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount}</p>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
                </label>
                <select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white"
                >
                  <option value="bank_transfer">ব্যাংক ট্রান্সফার</option>
                  <option value="bkash">বিকাশ</option>
                  <option value="nagad">নগদ</option>
                  <option value="rocket">রকেট</option>
                  <option value="other">অন্যান্য</option>
                </select>
              </div>

              {/* Payment Details */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2">
                  পেমেন্ট বিবরণ <span className="text-red-500">*</span>
                  <span className="text-gray-500 dark:text-gray-200 text-xs ml-2">
                    {formData.payment_method === 'bank_transfer' && 'ব্যাংক অ্যাকাউন্ট নম্বর'}
                    {(formData.payment_method === 'bkash' || formData.payment_method === 'nagad' || formData.payment_method === 'rocket') && 'মোবাইল নম্বর'}
                  </span>
                </label>
                <textarea
                  name="payment_details"
                  value={formData.payment_details}
                  onChange={handleInputChange}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#ec3137] focus:border-[#ec3137] dark:bg-[#322020] dark:text-white ${
                    errors.payment_details ? 'border-red-500' : 'border-gray-300 dark:border-gray-400'
                  }`}
                  placeholder={
                    formData.payment_method === 'bank_transfer'
                      ? 'ব্যাংকের নাম, অ্যাকাউন্ট নম্বর, রাউটিং নম্বর'
                      : 'আপনার মোবাইল নম্বর'
                  }
                />
                {errors.payment_details && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.payment_details}</p>
                )}
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>প্রক্রিয়াধীন সময়:</strong> সাধারণত পেমেন্ট প্রক্রিয়া করতে ৩-৭ কার্যদিবস সময় লাগে।
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-row-reverse gap-3 mt-6">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-[#ec3137] text-base font-medium text-white hover:bg-[#8a0f12] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ec3137] sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting || loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      জমা দেওয়া হচ্ছে...
                    </span>
                  ) : (
                    'অনুরোধ জমা দিন'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-400 shadow-sm px-4 py-2 bg-white dark:bg-[#2a2a2a] dark:bg-[#322020] text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ec3137] sm:mt-0 sm:text-sm"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
