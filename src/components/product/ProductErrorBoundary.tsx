'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ProductErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Product page error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.932-3L13.932 3c.77-.533 1.94-.167 2.432.532l.642.642c.532.533.168 1.4.168 1.932.532l3.064 2.064c.533.532.168 1.4.168 1.932.532l.642-.642c.532-.533.168-1.4.168-1.932-.532l-3.064-2.064c-.532-.533-.168-1.4.168-1.932-.532L4.568 6.932C4.038 7.466 3.672 8.132 3.07 8.632l-.642.642c-.532.533-.168 1.4-.532 1.932l2.064 3.064c.532.533.168 1.4.168 1.932.532l.642-.642c.532-.533.168-1.4.168-1.932-.532L3.07 13.932c-.532-.533-.168-1.4-.532-1.932l.642-.642c.532-.533.168-1.4.168-1.932.532L6.5 12.068c-.532-.533-.168-1.4.168-1.932.532l-.642.642c-.532-.533.168-1.4-.532-1.932L5.068 9.5c-.532-.533-.168-1.4-.532-1.932l.642-.642c.532-.533.168-1.4.168-1.932.532l2.064-3.064c.532-.533.168-1.4.168-1.932-.532l.642.642c.532.533.168 1.4.168 1.932.532l3.064-2.064c.532-.533.168-1.4.168-1.932-.532l.642-.642c.532-.533.168-1.4.168-1.932-.532L12.932 4.568C13.466 4.038 14.132 3.672 14.632 3.07l-.642-.642c-.532-.533-.168-1.4-.532-1.932l-2.064-3.064c-.532-.533-.168-1.4-.532-1.932l-.642-.642c-.532-.533-.168-1.4-.532-1.932L6.5 2.07c-.532-.533-.168-1.4.168-1.932.532l-.642.642c-.532-.533.168-1.4.168-1.932.532l-2.064 3.064c-.532.533-.168 1.4-.532 1.932l.642.642c.532.533.168 1.4.168 1.932.532l3.064 2.064c.532.533.168 1.4.168 1.932.532l.642-.642c.532-.533.168-1.4.168-1.932-.532z"
                />
              </svg>
            </div>

            {/* Error Message */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-200 mb-6">
              We couldn't load this product. Please try again or contact support if the problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-left">
                <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2.5 min-h-[44px] bg-[#bc1215] hover:bg-[#8a0e10] text-white font-semibold text-sm rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Again
              </button>
              <a
                href="/products"
                className="px-6 py-2.5 min-h-[44px] bg-gray-200 dark:bg-[#1a1a1a] hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold text-sm rounded-xl transition-all transform hover:scale-[1.02] inline-flex items-center justify-center"
              >
                Browse Products
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
