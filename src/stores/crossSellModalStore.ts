import { create } from 'zustand';

export interface CrossSaleProduct {
  id: number;
  title: string;
  slug: string;
  thumbnail: {
    id: number;
    fullUrl: string;
    alt: string;
  } | null;
  retailPrice: number;
  retailOfferPrice: number | null;
}

interface CrossSellModalState {
  isOpen: boolean;
  addedProductName: string;
  crossSaleProducts: CrossSaleProduct[];
  show: (productName: string, crossSaleProducts?: CrossSaleProduct[]) => void;
  setProducts: (products: CrossSaleProduct[]) => void;
  close: () => void;
}

export const useCrossSellModal = create<CrossSellModalState>((set) => ({
  isOpen: false,
  addedProductName: '',
  crossSaleProducts: [],
  show: (productName: string, crossSaleProducts: CrossSaleProduct[] = []) =>
    set({ isOpen: true, addedProductName: productName, crossSaleProducts }),
  setProducts: (products: CrossSaleProduct[]) =>
    set({ crossSaleProducts: products }),
  close: () => set({ isOpen: false, addedProductName: '', crossSaleProducts: [] }),
}));
