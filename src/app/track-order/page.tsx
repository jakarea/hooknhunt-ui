'use client';

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Toaster, toast } from 'react-hot-toast';

export default function TrackOrderPage() {
  const [trackingId, setTrackingId] = useState('');

  const handleCourierTrack = (e: FormEvent) => {
    e.preventDefault();

    if (!trackingId.trim()) {
      toast.error('অনুগ্রহ করে ট্র্যাকিং আইডি প্রদান করুন');
      return;
    }

    // Open Steadfast tracking in new tab
    const steadfastUrl = `https://steadfast.com.bd/track-order/?tracking_id=${trackingId}`;
    window.open(steadfastUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] py-12 sm:py-16">
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div className="container px-3 md:px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 leading-tight">
            অর্ডার ট্র্যাক করুন
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 max-w-2xl mx-auto leading-relaxed">
            আপনার কুরিয়ার ট্র্যাকিং আইডি দিয়ে অর্ডারের অবস্থান ট্র্যাক করুন
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Courier Tracking Form */}
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl shadow-sm p-4 sm:p-6 lg:p-8">
            <form onSubmit={handleCourierTrack}>
              <div className="mb-4 sm:mb-6">
                <label htmlFor="trackingId" className="block text-sm sm:text-base font-medium text-gray-700 dark:text-gray-100 mb-2">
                  ট্র্যাকিং আইডি
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="আপনার স্টেডফাস্ট ট্র্যাকিং আইডি লিখুন"
                  className="w-full px-4 py-3 text-sm sm:text-base border border-gray-300 dark:border-gray-500 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/20 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100"
                  required
                />
                <p className="mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-200 leading-relaxed">
                  আপনার Steadfast কুরিয়ার ট্র্যাকিং আইডি প্রদান করে আপনার শিপমেন্ট ট্র্যাক করুন
                </p>
              </div>

              <button
                type="submit"
                disabled={!trackingId.trim()}
                className="w-full px-6 py-3 text-sm sm:text-base bg-[#bc1215] text-white font-semibold rounded-lg hover:bg-[#8a0e10] focus:outline-none focus:ring-2 focus:ring-[#bc1215]/50 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#bc1215] min-h-[48px] sm:min-h-0"
              >
                Steadfast দিয়ে ট্র্যাক করুন
              </button>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-blue-900 dark:text-blue-300 mb-2 leading-relaxed">
                  ট্র্যাকিং তথ্য
                </h3>
                <ul className="text-xs sm:text-sm text-blue-800 dark:text-blue-400 space-y-1.5 list-disc list-inside leading-relaxed">
                  <li>আপনার অর্ডারের সাথে প্রদান করা ট্র্যাকিং আইডি ব্যবহার করুন</li>
                  <li>ট্র্যাকিং আইডি আপনার ফোনে পাঠানো SMS এ পাওয়া যাবে</li>
                  <li>Steadfast কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি করা হয়</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 mb-4 leading-relaxed">
            আপনার অর্ডারের সাথে সাহায্য প্রয়োজন?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 text-sm sm:text-base bg-[#046bd2] text-white font-semibold rounded-lg hover:bg-[#0353a5] focus:outline-none focus:ring-2 focus:ring-[#046bd2]/50 focus:ring-offset-2 transition-all min-h-[48px] sm:min-h-0"
          >
            যোগাযোগ করুন
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
