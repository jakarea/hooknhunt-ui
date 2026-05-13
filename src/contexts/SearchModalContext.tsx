'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface SearchModalContextType {
  isSearchModalOpen: boolean;
  openSearchModal: () => void;
  closeSearchModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchModalContext = createContext<SearchModalContextType | undefined>(undefined);

export function SearchModalProvider({ children }: { children: ReactNode }) {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
    // Restore body scroll
    document.body.style.overflow = '';
  };

  return (
    <SearchModalContext.Provider
      value={{
        isSearchModalOpen,
        openSearchModal,
        closeSearchModal,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </SearchModalContext.Provider>
  );
}

export function useSearchModal() {
  const context = useContext(SearchModalContext);
  if (context === undefined) {
    throw new Error('useSearchModal must be used within a SearchModalProvider');
  }
  return context;
}
