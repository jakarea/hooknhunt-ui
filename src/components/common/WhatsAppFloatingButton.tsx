'use client';

import React, { useState, useEffect } from 'react';

/**
 * WhatsAppFloatingButton - Floating WhatsApp support button
 * Positioned for easy access on mobile devices
 */
export default function WhatsAppFloatingButton() {
  const [mounted, setMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    setMounted(true);

    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  const whatsappNumber = '8801975244202';
  const whatsappURL = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="fixed bottom-20 right-4 z-50 lg:bottom-6 lg:right-6">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 w-48 bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <p className="text-sm font-medium">
            Need help? Chat with us!
          </p>
          {/* Arrow */}
          <div className="absolute top-full right-4 -mt-1">
            <svg className="w-2 h-2 text-gray-900 dark:text-white" fill="currentColor" viewBox="0 0 8 8">
              <path d="M0 0L8 0L4 4Z" transform="rotate(180 4 4)" />
            </svg>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <a
        href={whatsappURL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
      >
        <svg
          className="w-7 h-7"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.505-.827-.505-.308 0-.67.015-.973.015-.3 0-.79.114-1.204.57-.414.457-1.578 1.543-1.578 3.766 0 2.224 1.62 4.372 1.844 4.673.225.3 3.182 4.86 7.71 6.804 1.077.466 1.92.674 2.574.567.712-.103 2.204-.9 2.514-1.769.31-.869.31-1.614.217-1.769-.093-.155-.34-.249-.67-.445zM12.042 22C6.478 22 2 17.522 2 12S6.478 2 12.042 2c2.446 0 4.78.61 6.877 1.782l-2.033 6.26c-.148.456-.54.773-1.02.836-.48.063-.987.03-1.438-.165-.45-.194-.94-.466-1.436-.815-.496-.35-.99-.77-1.436-1.012-.445-.242-.862-.46-1.236-.644-.373-.184-.694-.345-.945-.475-.25-.13-.433-.245-.522-.335-.089-.09-.133-.18-.133-.27 0-.09.044-.18.133-.27.089-.09.245-.18.475-.335.23-.155.52-.33.89-.49.37-.16.82-.265 1.09-.315.27-.05.58-.075.93-.075.35 0 .66.025.93.075.27.05.52.155.89.315.37.16.66.33.89.49.23.155.4.245.53.335.13.09.22.18.27.27.04.09.04.18.13.27 0 .09-.044.18-.133.27-.089.09-.245.18-.475.335-.23.155-.52.33-.89.49-.37.16-.82.265-1.09.315-.27.05-.58.075-.93.075-.35 0-.66-.025-.93-.075-.27-.05-.52-.155-.89-.315-.37-.16-.66-.33-.89-.49-.23-.155-.4-.245-.53-.335-.13-.09-.22-.18-.27-.27-.04-.09-.04-.18-.13-.27 0-.09.044-.18.133-.27.089-.09.245-.18.475-.335.23-.155.52-.33.89-.49.37-.16.82-.265 1.09-.315.27-.05.58-.075.93-.075z" />
        </svg>
      </a>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
