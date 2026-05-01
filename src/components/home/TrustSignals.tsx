'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * TrustSignals - Homepage trust section
 * Shows customer count, guarantees, and social proof
 */
export default function TrustSignals() {
  const { t } = useTranslation();

  const stats = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      number: '10,000+',
      label: 'Happy Anglers',
      description: 'Trusted by fishermen across Bangladesh',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      number: '100%',
      label: 'Original Products',
      description: 'Genuine equipment, no fakes guaranteed',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      number: '2-3 Days',
      label: 'Fast Delivery',
      description: 'Quick delivery across Bangladesh',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      number: 'COD',
      label: 'Cash on Delivery',
      description: 'Pay when you receive, nationwide',
    },
  ];

  const guarantees = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-8.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: 'Quality Guarantee',
      description: 'All products are inspected for quality',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: 'Easy Returns',
      description: '7-day return policy for unused items',
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 8V5z" />
        </svg>
      ),
      title: 'WhatsApp Support',
      description: 'Quick help via WhatsApp chat',
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-[#ec3137] to-[#8a0f12] rounded-2xl flex items-center justify-center text-white shadow-md">
                  {stat.icon}
                </div>
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-[#ec3137] mb-1 sm:mb-2 block">
                {stat.number}
              </span>
              <p className="text-body-sm sm:text-body-md font-semibold text-gray-900 dark:text-white mb-1">
                {stat.label}
              </p>
              <p className="text-label-sm sm:text-label-md text-gray-600 dark:text-gray-400">
                {stat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 sm:p-8 border border-green-200 dark:border-green-800">
          <h3 className="text-heading-lg sm:text-heading-xl font-bold text-gray-900 dark:text-white text-center mb-6 sm:mb-8">
            Why Choose Hook & Hunt?
          </h3>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
            {guarantees.map((guarantee, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-white dark:bg-white/10 backdrop-blur-sm rounded-xl border border-green-200 dark:border-green-700/50 hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-3">
                  {guarantee.icon}
                </div>
                <span className="text-body-sm sm:text-body-md font-semibold text-gray-900 dark:text-white mb-2 block">
                  {guarantee.title}
                </span>
                <p className="text-label-sm sm:text-label-md text-gray-600 dark:text-gray-400">
                  {guarantee.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-body-md sm:text-body-lg text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
            Join thousands of satisfied anglers across Bangladesh
          </p>
          <a
            href="https://wa.me/8801975244202"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.05-1.256-.463-2.39-1.475z" />
            </svg>
            Chat with Us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
