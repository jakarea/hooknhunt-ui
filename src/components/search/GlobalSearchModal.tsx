'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchModal } from '@/contexts/SearchModalContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface Suggestion {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  category: string | null;
  price: number | null;
}

export default function GlobalSearchModal() {
  const { isSearchModalOpen, closeSearchModal, openSearchModal, searchQuery, setSearchQuery } = useSearchModal();
  const router = useRouter();
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Focus input when modal opens
  useEffect(() => {
    if (isSearchModalOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isSearchModalOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isSearchModalOpen) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [isSearchModalOpen]);

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const fetchSuggestions = async () => {
        setIsSearching(true);
        try {
          // Use searchProducts instead of searchSuggestions for better results
          const response = await api.searchProducts({
            q: searchQuery.trim(),
            per_page: 8
          });

          // Handle different response formats - cast response.data to any
          const responseData = (response.data as any)?.data || (response.data as any) || [];

          // If it's an array, use it directly
          if (Array.isArray(responseData)) {
            setSuggestions(responseData.map((p: any) => ({
              id: p.id,
              name: p.name || p.title,
              slug: p.slug,
              image: p.image || p.featured_image || p.thumbnail || null,
              category: p.category_name || null,
              price: p.price || p.actual_price || p.retail_price || null
            })));
          } else {
            setSuggestions([]);
          }

          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        } finally {
          setIsSearching(false);
        }
      };

      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  const handleSuggestionClick = (slug: string) => {
    closeSearchModal();
    router.push(`/products/${slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeSearchModal();
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeSearchModal();
    }
  };

  // Handle escape key and Ctrl+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Close modal on Escape
      if (e.key === 'Escape' && isSearchModalOpen) {
        closeSearchModal();
      }
      // Open modal on Ctrl+K (both Windows and Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (!isSearchModalOpen) {
          openSearchModal();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, closeSearchModal, openSearchModal]);

  if (!isSearchModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32"
      onClick={handleBackdropClick}
    >
      <div
        className="w-full max-w-2xl mx-4 bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-2xl overflow-hidden animate-fadeInDown"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <form onSubmit={handleSearch} className="relative">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('header.search') || 'Search products...'}
              className="w-full h-12 pl-12 pr-24 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/10 transition-all bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-gray-100 placeholder-gray-400"
              autoFocus
            />
            {/* Search Icon */}
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {/* Action Buttons */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={closeSearchModal}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                aria-label="Close search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </form>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-3 border-gray-300 border-t-[#bc1215]"></div>
              </div>
            ) : suggestions.length > 0 ? (
              <div className="p-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wider">
                  Products
                </div>
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    onClick={() => handleSuggestionClick(suggestion.slug)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition-colors"
                  >
                    {suggestion.image && (
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <Image
                          src={suggestion.image}
                          alt={suggestion.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {suggestion.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        {suggestion.category && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {suggestion.category}
                          </span>
                        )}
                        {suggestion.price && (
                          <span className="text-xs font-semibold text-[#bc1215]">
                            ৳{suggestion.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                ))}
                <button
                  onClick={handleSearch}
                  className="w-full text-center text-sm text-[#bc1215] font-medium py-3 mt-2 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            ) : searchQuery.trim().length >= 2 ? (
              <div className="p-8 text-center">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400">No products found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Try different keywords</p>
              </div>
            ) : null}
          </div>
        )}

        {/* Search Tips - Empty State */}
        {!showSuggestions && (
          <div className="p-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Start typing to search for products
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Fishing Rod', 'Lure', 'Hook', 'Line'].map((tip) => (
                <button
                  key={tip}
                  onClick={() => setSearchQuery(tip)}
                  className="px-3 py-1.5 text-xs font-medium bg-gray-100 dark:bg-[#2a2a2a] text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-[#333] transition-colors"
                >
                  {tip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
