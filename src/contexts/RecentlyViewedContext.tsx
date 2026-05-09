'use client';

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from 'react';
import { Product } from '@/types';

interface RecentlyViewedContextType {
  recentlyViewed: Product[];
  addToRecentlyViewed: (product: Product) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

const RECENTLY_VIEWED_STORAGE_KEY = 'hooknhunt_recently_viewed';
const MAX_RECENT_ITEMS = 10;

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  // Track which product IDs have been added in this session to prevent duplicates
  const addedIdsRef = useRef<Set<number>>(new Set());

  // Load recently viewed from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENTLY_VIEWED_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentlyViewed(parsed);
        // Initialize the ref with already viewed IDs
        addedIdsRef.current = new Set(parsed.map((p: Product) => p.id));
      }
    } catch (error) {
      console.error('Failed to load recently viewed:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save recently viewed to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(RECENTLY_VIEWED_STORAGE_KEY, JSON.stringify(recentlyViewed));
      } catch (error) {
        console.error('Failed to save recently viewed:', error);
      }
    }
  }, [recentlyViewed, isLoaded]);

  const addToRecentlyViewed = useCallback((product: Product) => {
    // Skip if this product was already added in this session
    if (addedIdsRef.current.has(product.id)) {
      return;
    }

    // Mark as added
    addedIdsRef.current.add(product.id);

    setRecentlyViewed(prev => {
      // Remove if already exists (to move to front)
      const filtered = prev.filter(p => p.id !== product.id);
      // Add to front and limit to MAX_RECENT_ITEMS
      const newRecentlyViewed = [product, ...filtered].slice(0, MAX_RECENT_ITEMS);

      // Only update if something changed
      if (newRecentlyViewed.length === prev.length && newRecentlyViewed[0]?.id === prev[0]?.id) {
        return prev;
      }

      return newRecentlyViewed;
    });
  }, []);

  const clearRecentlyViewed = () => {
    setRecentlyViewed([]);
    addedIdsRef.current.clear();
  };

  return (
    <RecentlyViewedContext.Provider
      value={{
        recentlyViewed,
        addToRecentlyViewed,
        clearRecentlyViewed,
      }}
    >
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (context === undefined) {
    throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
  }
  return context;
}
