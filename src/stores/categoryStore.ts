import { create } from 'zustand';
import api from '@/lib/api';
import { Category } from '@/types';

interface CategoryState {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetched: boolean;

  fetchCategories: () => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  fetched: false,

  fetchCategories: async () => {
    // Note: Removed 'fetched' check to always fetch fresh data from API
    set({ loading: true, error: null });

    try {
      const response = await api.getCategories();

      // API returns paginated: { data: { data: Category[], total: number } }
      const paginatedData = response.data as unknown as { data: Category[]; total: number };
      const rawCategories = paginatedData?.data ?? [];

      // Decode HTML entities in category names (API returns e.g. "Bags &amp; Accessories")
      const categories = rawCategories.map(cat => ({
        ...cat,
        name: cat.name
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&nbsp;/g, ' '),
      }));

      set({ categories, loading: false, fetched: true });
    } catch (error: unknown) {
      // On error, set error state
      const message = error instanceof Error ? error.message : 'Failed to fetch categories';
      set({ categories: [], error: message, loading: false, fetched: true });
    }
  },
}));
