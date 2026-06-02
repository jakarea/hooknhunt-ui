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
// Helper function to decode HTML entities
function decodeHtmlEntities(text: string): string {
  if (!text) return ''
  const txt = document.createElement('textarea')
  txt.innerHTML = text
  return txt.value
}

// Helper to check if URL is a placeholder image
function isPlaceholderImage(url: string): boolean {
  if (!url) return true
  return /placeholder\.jpg$/.test(url) || url.includes('placeholder')
}

export function getLocalizedName<T extends { name?: string; nameBn?: string | null; name_en?: string }>(
  item: T,
  language: string
): string {
  let name = ''
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).nameBn && (item as any).nameBn !== '') name = (item as any).nameBn;
    else if ((item as any).name_bn && (item as any).name_bn !== '') name = (item as any).name_bn;
  }
  // Otherwise use English version if exists, or fallback to default name
  if (!name) {
    name = ((item as any).name_en || (item as any).name) || ''
  }
  // Decode HTML entities (e.g., &amp; → &)
  return decodeHtmlEntities(name)
}

export function getLocalizedDescription<T extends { description?: string; descriptionBn?: string | null; description_en?: string }>(
  item: T,
  language: string
): string {
  let description = ''
  // If Bangla is requested and exists (try both naming conventions), use it
  if (language === 'bn') {
    if ((item as any).descriptionBn && (item as any).descriptionBn !== '') description = (item as any).descriptionBn;
    else if ((item as any).description_bn && (item as any).description_bn !== '') description = (item as any).description_bn;
  }
  // Otherwise use English version or fallback to default
  if (!description) {
    description = item.description || ''
  }
  // Decode HTML entities (e.g., &amp; → &)
  return decodeHtmlEntities(description)
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
  // Note: Empty array [] is truthy in JS, so check length explicitly
  const highlights = item.highlights;
  return (highlights && highlights.length > 0) ? highlights : null;
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
  // Note: Empty array [] is truthy in JS, so check length explicitly
  const includesInBox = item.includesInBox;
  return (includesInBox && includesInBox.length > 0) ? includesInBox : null;
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
  // Support BOTH formats:
  // Format 1: thumbnailUrl
  // Format 2: imageUrl
  thumbnailUrl?: string;
  imageUrl?: string;
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
  retailName?: string;   // Retail-specific name
  nameBn?: string | null;       // Bangla name
  slug: string;
  title?: string;        // Display title (alias for retailName/name)
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
  // Support BOTH API formats:
  // Format 1: galleryImages as array of IDs, galleryImagesUrls as array of URLs
  // Format 2: galleryImages as array of objects with imageUrl field
  galleryImages: number[] | Array<{ imageUrl: string }>;
  galleryImagesUrls?: string[];          // Optional - only in Format 1
  thumbnailUrl?: string;                 // Optional - only in Format 1
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string } | null;
  variants: ApiVariant[];
  // New format - camelCase (actual API response)
  imageUrl?: string;   // Main image URL
  imageId?: number;    // Main image ID
  // Legacy fields (for backward compatibility)
  image?: string;       // Main image URL
  featured_image?: string; // Featured image URL
  price?: number;       // Calculated display price
  actual_price?: number; // Alias for price
  originalPrice?: number; // Original price before discount
  compare_at_price?: number; // Alias for originalPrice
  stock?: number;       // Total stock across variants
  inventory_quantity?: number; // Alias for stock
  variant_count?: number; // Number of active variants
}

const PER_PAGE = 12;

export const getActiveVariants = (variants: ApiVariant[]): ApiVariant[] =>
  variants.filter((v) => v.isActive);

export const getDisplayPrice = (v: ApiVariant): number =>
  v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price;

export const mapApiProduct = (p: ApiProduct): Product => {
  try {
    // Handle both optimized list responses (with pre-calculated fields)
    // and full detail responses (with variants array)
    const hasVariants = p.variants && p.variants.length > 0;

    let imageUrl = '';

    if (p.imageUrl) {
      // Use new camelCase imageUrl field (actual API response)
      // Filter out placeholder images
      if (!isPlaceholderImage(p.imageUrl)) {
        imageUrl = p.imageUrl;
      }
    } else if (p.image || p.featured_image) {
      // Fall back to legacy image fields
      const legacyUrl = p.featured_image || p.image || '';
      if (legacyUrl && !isPlaceholderImage(legacyUrl)) {
        imageUrl = legacyUrl;
      }
    } else if (p.thumbnail?.fullUrl) {
      // Fall back to thumbnail object for detail API
      if (!isPlaceholderImage(p.thumbnail.fullUrl)) {
        imageUrl = p.thumbnail.fullUrl;
      }
    }

    let price = 0;
    let originalPrice: number | undefined = undefined;
    let totalStock = 0;
    let variantCount = 0;
    let sku = '';
    let priceRangeDisplay = '';
    let activeVariants: ApiVariant[] = [];

    if (hasVariants) {
      // Full variant data available (detail API)
      activeVariants = getActiveVariants(p.variants);
      totalStock = activeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
      variantCount = activeVariants.length;
      const firstVariant = activeVariants[0];

      // Calculate min price (lowest offer or regular) and its corresponding original price
      const displayPrices = activeVariants.map(getDisplayPrice);
      const minDisplayPrice = displayPrices.length > 0 ? Math.min(...displayPrices) : 0;

      // Find the variant that has the minimum display price, get its original price
      // Only set originalPrice if that variant has an actual offer
      for (const v of activeVariants) {
        const variantDisplayPrice = getDisplayPrice(v);
        if (variantDisplayPrice === minDisplayPrice && v.offerPrice > 0 && v.offerPrice < v.price) {
          originalPrice = v.price;
          break;
        }
      }

      price = minDisplayPrice;
      sku = firstVariant?.sku || '';

      // Price range for multi-variant
      if (variantCount > 1) {
        const minP = Math.min(...displayPrices);
        const maxP = Math.max(...displayPrices);
        priceRangeDisplay = minP === maxP
          ? `৳${minP.toLocaleString()}`
          : `৳${minP.toLocaleString()} - ৳${maxP.toLocaleString()}`;
      }
    } else {
      // Optimized list API with pre-calculated fields
      price = p.price ?? p.actual_price ?? 0;
      originalPrice = p.originalPrice ?? p.compare_at_price ?? undefined;
      totalStock = p.stock ?? p.inventory_quantity ?? 0;
      variantCount = p.variant_count ?? 0;
    }

    // Handle galleryImagesUrls (Format 1) or galleryImages (Format 2: objects with imageUrl)
    let galleryUrls: string[] = [];
    if (p.galleryImagesUrls && p.galleryImagesUrls.length > 0) {
      // Format 1: Use the URLs directly from API response
      galleryUrls = p.galleryImagesUrls;
    } else if (p.galleryImages && p.galleryImages.length > 0) {
      // Format 2: galleryImages is array of objects with imageUrl field
      // OR Format 1 legacy: galleryImages is array of IDs (numbers)
      const firstItem = p.galleryImages[0];
      if (typeof firstItem === 'object' && firstItem !== null && 'imageUrl' in firstItem) {
        // Format 2: Extract imageUrl from each object
        galleryUrls = p.galleryImages
          .map((item: { imageUrl?: string }) => item.imageUrl)
          .filter((url): url is string => Boolean(url && !isPlaceholderImage(url)));
      } else {
        // Format 1 legacy: galleryImages is array of IDs, build from variants
        const variantImages = p.variants
          .map((v: ApiVariant) => v.thumbnailUrl)
          .filter((url): url is string => Boolean(url && !isPlaceholderImage(url)));
        galleryUrls = [...new Set(variantImages)];
      }
    }

    return {
      id: p.id,
      product_code: '',
      title: p.retailName || p.name,
      slug: p.slug,
      name: p.name,
      nameBn: p.nameBn,
      price,
      originalPrice: originalPrice ?? undefined,
      image_url: imageUrl, // New standardized field (camelCase)
      image_id: p.imageId, // New field (camelCase)
      image: imageUrl, // Legacy field (for backward compatibility)
      featured_image: imageUrl, // Legacy field
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
      sku: sku,
      gallery_images: galleryUrls.map(url => ({ image_url: url })), // New format
      gallery: galleryUrls, // Legacy format
      variants: activeVariants.map((v) => {
        // Get variant image: prefer thumbnailUrl, fallback to imageUrl (skip placeholders), then product image
        const placeholderPattern = /placeholder\.jpg$/;
        let variantImage = imageUrl; // Default to product image

        // Try variant's thumbnailUrl first (if not placeholder)
        if (v.thumbnailUrl && !placeholderPattern.test(v.thumbnailUrl)) {
          variantImage = v.thumbnailUrl;
        }
        // Then try variant's imageUrl (if not placeholder)
        else if (v.imageUrl && !placeholderPattern.test(v.imageUrl)) {
          variantImage = v.imageUrl;
        }

        return {
          id: v.id,
          product_id: p.id,
          title: v.variantName,
          sku: v.sku,
          price: v.price,
          compare_at_price: v.offerPrice || 0,
          cost_price: 0,
          inventory_quantity: v.stock,
          weight: parseFloat(v.weight) || 0,
          image_url: variantImage, // Use variant image or product image
          image: variantImage, // Legacy field
          barcode: '',
          created_at: '',
          updated_at: '',
        };
      }),
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
  } catch (error) {
    console.error('Error mapping product:', error, p);
    // Return a minimal valid Product object to prevent total failure
    return {
      id: p.id || 0,
      product_code: '',
      title: p.name || 'Unknown Product',
      slug: p.slug || '',
      name: p.name || 'Unknown Product',
      sku: '',
      description: '',
      short_description: '',
      supplier_id: 0,
      product_link: '',
      category_id: 0,
      brand: '',
      tags: [],
      featured_image: '',
      gallery: [],
      weight: 0,
      unit: 'pcs',
      cost_rmb: 0,
      exchange_rate: 0,
      cost_bdt: 0,
      actual_price: 0,
      default_price: 0,
      compare_at_price: 0,
      price_wholesale: 0,
      price_retail: 0,
      price_daraz: 0,
      inventory_quantity: 0,
      inventory_policy: 'continue',
      has_variants: false,
      status: 'active',
      created_at: '',
      updated_at: '',
      barcode: '',
      hs_code: '',
      seo_title: '',
      seo_description: '',
      price: 0,
      image: '',
      stock: 0,
      nameBn: undefined,
      originalPrice: undefined,
      category: '',
      variant_count: 0,
      price_range_display: '',
      descriptionBn: undefined,
      shortDescriptionBn: undefined,
      highlights: null,
      highlightsBn: undefined,
      includesInBox: null,
      includesInBoxBn: undefined,
      rating: undefined,
      reviews: undefined,
      has_offer: undefined,
      thumbnail_url: undefined,
    };
  }
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

    // Clear products on reset or filter change
    const shouldReset = reset || isFilterChange;
    if (shouldReset) {
      set({ products: [], currentPage: 0 });
    }

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
        last_page?: number;
        lastPage?: number;
        current_page?: number;
        currentPage?: number;
        next_page_url?: string | null;
        nextPageUrl?: string | null;
      };

      const productsCount = paginated?.data?.length || 0;
      const total = paginated?.total || 0;
      const currentPage = paginated?.currentPage || paginated?.current_page || 1;
      const lastPage = paginated?.lastPage || paginated?.last_page || Math.ceil(total / PER_PAGE);

      const products = (paginated?.data ?? []).map(mapApiProduct);

      set({
        products,
        loading: false,
        fetched: true,
        currentPage,
        totalPages: lastPage,
        total,
        // More reliable: check if current page is less than last page
        hasMore: currentPage < lastPage,
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
        last_page?: number;
        lastPage?: number;
        current_page?: number;
        currentPage?: number;
        next_page_url?: string | null;
        nextPageUrl?: string | null;
      };

      const newProductsCount = paginated?.data?.length || 0;
      const total = paginated?.total || state.total;
      const currentPage = paginated?.currentPage || paginated?.current_page || nextPage;
      const lastPage = paginated?.lastPage || paginated?.last_page || Math.ceil(total / PER_PAGE);

      const newProducts = (paginated?.data ?? []).map(mapApiProduct);

      set({
        products: [...state.products, ...newProducts],
        loading: false,
        currentPage,
        totalPages: lastPage,
        total,
        // More reliable: check if current page is less than last page
        hasMore: currentPage < lastPage,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load more products';
      set({ error: message, loading: false });
    }
  },
}));
