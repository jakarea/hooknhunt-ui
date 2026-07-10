'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#1f1515] dark:to-[#2a2a2a] flex items-center justify-center px-4 py-12">
      <div className="text-center max-w-md">
        {/* 404 Icon */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[140px] font-bold text-gray-200 dark:text-gray-800 leading-none mb-2">404</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#bc1215] to-[#ec3137] mx-auto rounded-full"></div>
        </div>

        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          পৃষ্ঠা পাওয়া যায়নি
        </h2>
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Page Not Found
        </h2>

        <p className="text-base text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
          দুঃখিত, যে পৃষ্ঠাটি আপনি খুঁজছেন তা আর পাওয়া যায় না। এটি সরানো বা স্থানান্তরিত হয়েছে।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#bc1215] hover:bg-[#8a0f12] text-white font-semibold rounded-lg transition-colors duration-300"
          >
            হোমপেজে ফিরুন
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-colors duration-300"
          >
            পণ্য দেখুন
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
          সাহায্য প্রয়োজন? <Link href="/contact" className="text-[#bc1215] hover:text-[#ec3137] font-semibold">আমাদের সাথে যোগাযোগ করুন</Link>
        </p>
      </div>
    </div>
  );
}
