import { create } from 'zustand';
import { CrossSaleProduct } from './crossSellModalStore';

interface CrossCartState {
  // Map: cart product ID → its cross-sell products
  crossSellsByProduct: Record<number, CrossSaleProduct[]>;
  hydrated: boolean;
  addCrossSells: (productId: number, products: CrossSaleProduct[]) => void;
  removeCrossSells: (productId: number) => void;
  clearAll: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'cross_cart';

function persist(data: Record<number, CrossSaleProduct[]>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function loadFromStorage(): Record<number, CrossSaleProduct[]> {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch {
      // ignore parse errors
    }
  }
  return {};
}

export const useCrossCartStore = create<CrossCartState>((set, get) => ({
  crossSellsByProduct: {},
  hydrated: false,

  hydrate: () => {
    if (get().hydrated) return;
    const data = loadFromStorage();
    set({ crossSellsByProduct: data, hydrated: true });
  },

  addCrossSells: (productId, products) =>
    set((state) => {
      const next = { ...state.crossSellsByProduct };
      if (products.length > 0) {
        next[productId] = products;
      }
      persist(next);
      return { crossSellsByProduct: next };
    }),

  removeCrossSells: (productId) =>
    set((state) => {
      const next = { ...state.crossSellsByProduct };
      delete next[productId];
      persist(next);
      return { crossSellsByProduct: next };
    }),

  clearAll: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
    set({ crossSellsByProduct: {} });
  },
}));
