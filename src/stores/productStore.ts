import { create } from 'zustand';
import api from '@/lib/api';
import { Product } from '@/types';

export interface ProductFilters {
  category_id?: number;
  search?: string;
  sort_by?: string;
}

// Helper to get language-specific content (English by default, Bangla if language is 'bn' with null check fallback)
export function getLocalizedName<T extends { name?: string; name_en?: string; name_bn?: string }>(
  item: T,
  language: string
): string {
  // If Bangla is requested and exists, use it
  if (language === 'bn' && item.name_bn != null && item.name_bn !== '') return item.name_bn;
  // Otherwise use English version if exists, or fallback to default name
  return item.name_en || item.name || '';
}

export function getLocalizedDescription<T extends { description?: string; description_en?: string; description_bn?: string }>(
  item: T,
  language: string
): string {
  // If Bangla is requested and exists, use it
  if (language === 'bn' && item.description_bn != null && item.description_bn !== '') return item.description_bn;
  // Otherwise use English version if exists, or fallback to default description
  return item.description_en || item.description || '';
}

export function getLocalizedShortDescription<T extends { shortDescription?: string | null; shortDescription_en?: string | null; shortDescription_bn?: string | null }>(
  item: T,
  language: string
): string | null {
  // If Bangla is requested and exists, use it
  if (language === 'bn' && item.shortDescription_bn != null && item.shortDescription_bn !== '') return item.shortDescription_bn;
  // Otherwise use English version if exists, or fallback to default
  return item.shortDescription_en || item.shortDescription || null;
}

export function getLocalizedHighlights<T extends { highlights?: string[] | null; highlights_en?: string[] | null; highlights_bn?: string[] | null }>(
  item: T,
  language: string
): string[] | null {
  // If Bangla is requested and exists (non-empty array), use it
  if (language === 'bn' && item.highlights_bn != null && item.highlights_bn.length > 0) return item.highlights_bn;
  // Otherwise use English version if exists and non-empty, or fallback to default
  return (item.highlights_en && item.highlights_en.length > 0) ? item.highlights_en : (item.highlights || null);
}

// Matches actual API response (camelCase)
export interface ApiVariant {
  id: number;
  variantName: string;
  variantSlug: string;
  sku: string;
  price: number;
  offerPrice: number;
  offerStarts: string | null;
  offerEnds: string | null;
  stock: number;
  weight: string;
  size: string | null;
  color: string | null;
  isActive: boolean;
}

export interface ApiThumbnail {
  id: number;
  fullUrl: string;
  alt: string;
}

export interface ApiGalleryImage {
  fullUrl: string;
}

export interface ApiProduct {
  id: number;
  name: string;
  name_en?: string;
  name_bn?: string;
  slug: string;
  description: string;
  description_en?: string;
  description_bn?: string;
  shortDescription: string | null;
  shortDescription_en?: string | null;
  shortDescription_bn?: string | null;
  highlights: string[] | null;
  highlights_en?: string[] | null;
  highlights_bn?: string[] | null;
  includesInBox: string[] | null;
  videoUrl: string | null;
  warrantyEnabled: boolean;
  warrantyDetails: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoTags: string[] | null;
  thumbnail: ApiThumbnail | null;
  galleryImages: ApiGalleryImage[];
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string } | null;
  variants: ApiVariant[];
}

const PER_PAGE = 12;

export const getActiveVariants = (variants: ApiVariant[]): ApiVariant[] =>
  variants.filter((v) => v.isActive);

export const getDisplayPrice = (v: ApiVariant): number =>
  v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price;

export const mapApiProduct = (p: ApiProduct): Product => {
  const activeVariants = getActiveVariants(p.variants);
  const imageUrl = p.thumbnail?.fullUrl || '';
  const galleryUrls = p.galleryImages?.map((img) => img.fullUrl) || [];

  const totalStock = activeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
  const variantCount = activeVariants.length;
  const firstVariant = activeVariants[0];

  // Calculate min price (lowest offer or regular) and its corresponding original price
  const displayPrices = activeVariants.map(getDisplayPrice);
  const minDisplayPrice = displayPrices.length > 0 ? Math.min(...displayPrices) : 0;

  // Find the variant that has the minimum display price, get its original price
  // Only set originalPrice if that variant has an actual offer
  let originalPrice: number | undefined = undefined;
  for (const v of activeVariants) {
    const variantDisplayPrice = getDisplayPrice(v);
    if (variantDisplayPrice === minDisplayPrice && v.offerPrice > 0 && v.offerPrice < v.price) {
      originalPrice = v.price;
      break;
    }
  }

  const price = minDisplayPrice;

  // Price range for multi-variant
  let priceRangeDisplay = '';
  if (variantCount > 1) {
    const displayPrices = activeVariants.map(getDisplayPrice);
    const minP = Math.min(...displayPrices);
    const maxP = Math.max(...displayPrices);
    priceRangeDisplay = minP === maxP
      ? `৳${minP.toLocaleString()}`
      : `৳${minP.toLocaleString()} - ৳${maxP.toLocaleString()}`;
  }

  return {
    id: p.id,
    product_code: '',
    title: p.name,
    slug: p.slug,
    name: p.name,
    price,
    originalPrice: originalPrice ?? undefined,
    image: imageUrl,
    featured_image: imageUrl,
    stock: totalStock,
    inventory_quantity: totalStock,
    category: p.category?.name || '',
    category_id: p.category?.id || 0,
    variant_count: variantCount,
    price_range_display: priceRangeDisplay,
    description: p.description || '',
    short_description: p.shortDescription || '',
    sku: firstVariant?.sku || '',
    gallery: galleryUrls,
    variants: activeVariants.map((v) => ({
      id: v.id,
      product_id: p.id,
      title: v.variantName,
      sku: v.sku,
      price: v.price,
      compare_at_price: v.offerPrice || 0,
      cost_price: 0,
      inventory_quantity: v.stock,
      weight: parseFloat(v.weight) || 0,
      image: imageUrl,
      barcode: '',
      created_at: '',
      updated_at: '',
    })),
    tags: [],
    has_variants: variantCount > 1,
    status: 'active',
    created_at: '',
    updated_at: '',
    supplier_id: 0,
    product_link: '',
    brand: p.brand?.name || '',
    weight: 0,
    unit: 'pcs',
    cost_rmb: 0,
    exchange_rate: 0,
    cost_bdt: 0,
    actual_price: price,
    default_price: price,
    compare_at_price: originalPrice || 0,
    price_wholesale: 0,
    price_retail: price,
    price_daraz: 0,
    inventory_policy: 'continue',
    barcode: '',
    hs_code: '',
    seo_title: p.seoTitle || '',
    seo_description: p.seoDescription || '',
  };
};

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  currentPage: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  currentFilters: ProductFilters;

  fetchProducts: (filters?: ProductFilters, reset?: boolean) => Promise<void>;
  loadMore: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  loading: false,
  error: null,
  fetched: false,
  currentPage: 0,
  totalPages: 0,
  total: 0,
  hasMore: true,
  currentFilters: {},

  fetchProducts: async (filters?: ProductFilters, reset?: boolean) => {
    const state = get();
    const mergedFilters = { ...state.currentFilters, ...filters };
    const isFilterChange = JSON.stringify(mergedFilters) !== JSON.stringify(state.currentFilters);

    if (!reset && !isFilterChange && state.fetched && !filters) return;

    set({ loading: true, error: null, currentFilters: mergedFilters });

    try {
      const response = await api.getProducts({
        ...mergedFilters,
        page: 1,
        per_page: PER_PAGE,
      });

      const paginated = response.data as unknown as {
        data: ApiProduct[];
        total: number;
        last_page: number;
        current_page: number;
        next_page_url: string | null;
      };

      const products = (paginated?.data ?? []).map(mapApiProduct);

      set({
        products,
        loading: false,
        fetched: true,
        currentPage: paginated?.current_page || 1,
        totalPages: paginated?.last_page || 1,
        total: paginated?.total || 0,
        hasMore: !!paginated?.next_page_url,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch products';
      set({ error: message, loading: false, fetched: true });
    }
  },

  loadMore: async () => {
    const state = get();
    if (state.loading || !state.hasMore) return;

    const nextPage = state.currentPage + 1;
    set({ loading: true, error: null });

    try {
      const response = await api.getProducts({
        ...state.currentFilters,
        page: nextPage,
        per_page: PER_PAGE,
      });

      const paginated = response.data as unknown as {
        data: ApiProduct[];
        total: number;
        last_page: number;
        current_page: number;
        next_page_url: string | null;
      };

      const newProducts = (paginated?.data ?? []).map(mapApiProduct);

      set({
        products: [...state.products, ...newProducts],
        loading: false,
        currentPage: paginated?.current_page || nextPage,
        totalPages: paginated?.last_page || state.totalPages,
        total: paginated?.total || state.total,
        hasMore: !!paginated?.next_page_url,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load more products';
      set({ error: message, loading: false });
    }
  },
}));
