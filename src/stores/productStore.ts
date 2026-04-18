import { create } from 'zustand';
import api from '@/lib/api';
import { Product } from '@/types';

export interface ProductFilters {
  category_id?: number;
  search?: string;
  sort_by?: string;
}

// Helper to get language-specific content (English by default, Bangla if language is 'bn')
// Supports both naming conventions: nameBn/name_en and descriptionBn/description_en
export function getLocalizedName<T extends { name?: string; nameBn?: string | null; name_en?: string }>(
  item: T,
  language: string
): string {
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).nameBn && (item as any).nameBn !== '') return (item as any).nameBn;
    if ((item as any).name_bn && (item as any).name_bn !== '') return (item as any).name_bn;
  }
  // Otherwise use English version if exists, or fallback to default name
  return ((item as any).name_en || (item as any).name) || '';
}

export function getLocalizedDescription<T extends { description?: string; descriptionBn?: string | null; description_en?: string }>(
  item: T,
  language: string
): string {
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).descriptionBn && (item as any).descriptionBn !== '') return (item as any).descriptionBn;
    if ((item as any).description_bn && (item as any).description_bn !== '') return (item as any).description_bn;
  }
  // Otherwise use English version or fallback to default
  return item.description || '';
}

export function getLocalizedShortDescription<T extends { shortDescription?: string | null; shortDescriptionBn?: string | null; shortDescription_en?: string | null }>(
  item: T,
  language: string
): string | null {
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).shortDescriptionBn && (item as any).shortDescriptionBn !== '') return (item as any).shortDescriptionBn;
    if ((item as any).shortDescription_bn && (item as any).shortDescription_bn !== '') return (item as any).shortDescription_bn;
  }
  // Otherwise use English version or fallback to default
  return item.shortDescription || null;
}

export function getLocalizedHighlights<T extends { highlights?: string[] | null; highlightsBn?: string[] | null; highlights_en?: string[] | null }>(
  item: T,
  language: string
): string[] | null {
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).highlightsBn && (item as any).highlightsBn.length > 0) return (item as any).highlightsBn;
    if ((item as any).highlights_bn && (item as any).highlights_bn.length > 0) return (item as any).highlights_bn;
  }
  // Otherwise use English version or fallback to default
  return item.highlights || null;
}

export function getLocalizedIncludesInBox<T extends { includesInBox?: string[] | null; includesInBoxBn?: string[] | null }>(
  item: T,
  language: string
): string[] | null {
  // If Bangla is requested and exists, use it
  if (language === 'bn') {
    if ((item as any).includesInBoxBn && (item as any).includesInBoxBn.length > 0) return (item as any).includesInBoxBn;
  }
  // Otherwise use English version or fallback to default
  return item.includesInBox || null;
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
  name: string;          // English name (default)
  nameBn?: string | null;       // Bangla name
  slug: string;
  description: string;  // English description (default)
  descriptionBn?: string | null; // Bangla description
  shortDescription: string | null;
  shortDescriptionBn?: string | null;
  highlights: string[] | null;    // English highlights (default)
  highlightsBn?: string[] | null; // Bangla highlights
  includesInBox: string[] | null; // English includes box (default)
  includesInBoxBn?: string[] | null; // Bangla includes box
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
    nameBn: p.nameBn,
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
    descriptionBn: p.descriptionBn,
    short_description: p.shortDescription || '',
    shortDescriptionBn: p.shortDescriptionBn,
    highlights: p.highlights || null,
    highlightsBn: p.highlightsBn || null,
    includesInBox: p.includesInBox || null,
    includesInBoxBn: p.includesInBoxBn || null,
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
