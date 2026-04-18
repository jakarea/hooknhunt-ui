'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductErrorBoundary from '@/components/product/ProductErrorBoundary';
import { useCart } from '@/context/CartContext';
import { Product as StaticProduct } from '@/types';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { CrossSaleProduct } from '@/stores/crossSellModalStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName, getLocalizedDescription, getLocalizedHighlights } from '@/stores/productStore';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

// Decode entity-encoded HTML from API (e.g. &lt;p&gt;text&amp;nbsp;more&lt;/p&gt;)
// Uses pure regex so it works during SSR (no document needed)
// Handles double-encoded HTML: first pass decodes numeric/char entities,
// second pass catches any remaining named entities after &amp; → &
function decodeHtmlEntities(html: string): string {
  let result = html;
  // Pass 1: Decode specific named entities (must decode &amp; LAST in this group)
  result = result
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
  // Pass 2: Decode numeric entities (decimal &#123; and hex &#x1A;)
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  // Clean up non-breaking spaces
  result = result.replace(/\u00A0/g, ' ');
  return result;
}

// Types matching actual API response (camelCase)
interface ApiVariant {
  id: number;
  variantName: string;
  variantSlug: string;
  sku: string;
  price: number;
  offerPrice: number | null;
  offerStarts: string | null;
  offerEnds: string | null;
  stock: number;
  weight: string;
  size: string | null;
  color: string | null;
  isActive: boolean;
}

interface ApiProduct {
  id: number;
  name: string;
  nameBn?: string;
  slug: string;
  description: string;
  descriptionBn?: string;
  shortDescription: string | null;
  shortDescriptionBn?: string | null;
  highlights: string[] | null;
  highlightsBn?: string[] | null;
  includesInBox: string[] | null;
  includesInBoxBn?: string[] | null;
  videoUrl: string | null;
  warrantyEnabled: boolean;
  warrantyDetails: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoTags: string[] | null;
  thumbnail: { id: number; fullUrl: string; alt: string } | null;
  galleryImages: { fullUrl: string }[];
  category: { id: number; name: string; slug: string } | null;
  brand: { id: number; name: string } | null;
  variants: ApiVariant[];
  crossSaleProducts?: {
    id: number;
    title: string;
    slug: string;
    thumbnail: { id: number; fullUrl: string; alt: string } | null;
    retailPrice: number;
    retailOfferPrice: number | null;
  }[];
}

// UI-facing types (kept for template compatibility)
interface Variant {
  id: number;
  sku: string;
  name: string;
  retail_price: number;
  original_price: number;
  stock_info: {
    available: number;
    in_stock: boolean;
    low_stock: boolean;
    stock_status: string;
  };
  image: {
    url: string;
    thumbnail_url: string;
    alt_text: string;
  };
}

interface Product {
  id: number;
  name: string;
  nameBn?: string;
  slug: string;
  thumbnail_url: string;
  gallery_images: string[];
  price_range: { min: string; max: string; display: string };
  has_offer: boolean;
  originalPrice: number;
  variant_count: number;
  categories: { name: string; slug: string }[];
  stock_info: {
    in_stock: boolean;
    total_available: number;
    low_stock: boolean;
    stock_status: string;
  };
  description: string;
  descriptionBn?: string | null;
  short_description: string;
  shortDescriptionBn?: string | null;
  highlights: string[];
  highlightsBn?: string[] | null;
  meta_title: string;
  meta_description: string;
  variants: Variant[];
}

function ProductDetailPageContent() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { addToCart, closeCart } = useCart();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<StaticProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [crossSaleProducts, setCrossSaleProducts] = useState<CrossSaleProduct[]>([]);
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  // Get localized content based on current language (must be after all useState, before useCallback)
  const productName = useMemo(() => {
    if (!product) return '';
    return getLocalizedName(product, language);
  }, [product, language]);

  const productDescription = useMemo(() => {
    if (!product) return '';
    return getLocalizedDescription(product, language);
  }, [product, language]);

  const productHighlights = useMemo(() => {
    if (!product) return [];
    return getLocalizedHighlights(product, language);
  }, [product, language]);

  const handleImageChange = useCallback((index: number) => {
    if (index === selectedImage) return;
    setSelectedImage(index);
  }, [selectedImage]);

  // Map API product to UI Product type
  const mapApiProduct = useCallback((apiProduct: ApiProduct): Product => {
    const activeVariants = apiProduct.variants.filter(v => v.isActive);
    const thumbnailUrl = apiProduct.thumbnail?.fullUrl || '';
    const galleryUrls = apiProduct.galleryImages?.map((img: { fullUrl: string }) => img.fullUrl) || [];

    const totalStock = activeVariants.reduce((sum, v) => sum + (v.stock || 0), 0);
    const hasOffer = activeVariants.some(v => v.offerPrice && v.offerPrice > 0 && v.offerPrice < v.price);

    const prices = activeVariants.map(v => v.offerPrice && v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    // Original price = highest regular price among variants (for discount display)
    const originalPrice = activeVariants.length > 0
      ? Math.max(...activeVariants.map(v => v.price))
      : 0;

    const priceDisplay = minPrice === maxPrice
      ? `৳${minPrice.toLocaleString()}`
      : `৳${minPrice.toLocaleString()} - ৳${maxPrice.toLocaleString()}`;

    const uiVariants: Variant[] = activeVariants.map(v => ({
      id: v.id,
      sku: v.sku,
      name: v.variantName,
      retail_price: v.offerPrice && v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price,
      original_price: v.price,
      stock_info: {
        available: v.stock,
        in_stock: v.stock > 0,
        low_stock: v.stock > 0 && v.stock < 10,
        stock_status: v.stock > 0 ? 'in_stock' : 'out_of_stock',
      },
      image: {
        url: thumbnailUrl,
        thumbnail_url: thumbnailUrl,
        alt_text: `${apiProduct.name} - ${v.variantName}`,
      },
    }));

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      nameBn: apiProduct.nameBn,
      slug: apiProduct.slug,
      thumbnail_url: thumbnailUrl,
      gallery_images: galleryUrls,
      price_range: { min: String(minPrice), max: String(maxPrice), display: priceDisplay },
      has_offer: hasOffer,
      originalPrice,
      variant_count: activeVariants.length,
      categories: apiProduct.category ? [{ name: apiProduct.category.name, slug: apiProduct.category.slug }] : [],
      stock_info: {
        in_stock: totalStock > 0,
        total_available: totalStock,
        low_stock: totalStock > 0 && totalStock < 10,
        stock_status: totalStock > 0 ? 'in_stock' : 'out_of_stock',
      },
      description: apiProduct.description || '',
      descriptionBn: apiProduct.descriptionBn,
      short_description: apiProduct.shortDescription || '',
      shortDescriptionBn: apiProduct.shortDescriptionBn,
      highlights: (apiProduct.highlights || []).map(h => decodeHtmlEntities(h.replace(/\u00A0/g, ' '))),
      highlightsBn: apiProduct.highlightsBn,
      meta_title: apiProduct.seoTitle || apiProduct.name,
      meta_description: apiProduct.seoDescription || apiProduct.shortDescription || '',
      variants: uiVariants,
    };
  }, []);

  // Map API product to ProductCard-compatible StaticProduct
  const mapToProductCard = useCallback((apiProduct: ApiProduct): StaticProduct => {
    const activeVariants = (apiProduct.variants || []).filter((v: ApiVariant) => v.isActive);
    const prices = activeVariants.map((v: ApiVariant) => v.offerPrice && v.offerPrice > 0 && v.offerPrice < v.price ? v.offerPrice : v.price);
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const totalStock = activeVariants.reduce((sum: number, v: ApiVariant) => sum + (v.stock || 0), 0);
    const maxOriginalPrice = activeVariants.length > 0 ? Math.max(...activeVariants.map(v => v.price)) : 0;

    return {
      id: apiProduct.id,
      name: apiProduct.name,
      title: apiProduct.name,
      slug: apiProduct.slug,
      image: apiProduct.thumbnail?.fullUrl || '',
      featured_image: apiProduct.thumbnail?.fullUrl || '',
      price: minPrice,
      actual_price: minPrice,
      originalPrice: maxOriginalPrice,
      stock: totalStock,
      inventory_quantity: totalStock,
      category_id: apiProduct.category?.id || 0,
      category: apiProduct.category?.name || '',
      variant_count: activeVariants.length,
      description: apiProduct.description || '',
      short_description: apiProduct.shortDescription || '',
      product_code: '',
      sku: activeVariants[0]?.sku || '',
      tags: [],
      gallery: apiProduct.galleryImages?.map((img: { fullUrl: string }) => img.fullUrl) || [],
      has_variants: activeVariants.length > 1,
      status: 'active',
      created_at: '',
      updated_at: '',
      supplier_id: 0,
      product_link: '',
      brand: apiProduct.brand?.name || '',
      weight: 0,
      unit: 'pcs',
      cost_rmb: 0,
      exchange_rate: 0,
      cost_bdt: 0,
      default_price: minPrice,
      compare_at_price: maxOriginalPrice,
      price_wholesale: 0,
      price_retail: minPrice,
      price_daraz: 0,
      inventory_policy: 'continue',
      barcode: '',
      hs_code: '',
      seo_title: '',
      seo_description: '',
    } as StaticProduct;
  }, []);

  // Fetch product + related from API
  useEffect(() => {
    if (!slug) return;
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setSelectedImage(0);
      setQuantity(1);
      setSelectedVariant(null);

      try {
        const [productRes, relatedRes] = await Promise.all([
          api.getProduct(slug),
          api.getRelatedProducts(slug, 6),
        ]);

        if (cancelled) return;

        const apiProduct = (productRes as { data?: ApiProduct }).data;
        if (!apiProduct) {
          setError('Product not found');
          setLoading(false);
          return;
        }

        const mapped = mapApiProduct(apiProduct);
        setProduct(mapped);
        setCrossSaleProducts(apiProduct.crossSaleProducts || []);

        if (mapped.variants.length > 0) {
          setSelectedVariant(mapped.variants[0]);
        }

        const relatedData = (relatedRes as { data?: ApiProduct[] }).data;
        if (relatedData && Array.isArray(relatedData)) {
          setRelatedProducts(relatedData.map(mapToProductCard));
        }
      } catch {
        if (!cancelled) setError('Failed to load product details');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [slug, mapApiProduct, mapToProductCard]);

  // Loading state with shimmer effect
  if (loading) {
    return (
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image section shimmer */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded-lg animate-shimmer"></div>
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer" style={{ animationDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>

          {/* Content section shimmer */}
          <div className="space-y-6">
            <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-1/3 animate-shimmer"></div>
            <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"></div>
            <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-1/2 animate-shimmer"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded w-1/4 animate-shimmer"></div>
            <div className="space-y-3">
              <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"></div>
              <div className="h-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 rounded animate-shimmer"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="max-w-[1344px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          {error || t('details.description')}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn&apos;t find the product you&apos;re looking for.
        </p>
        <Link href="/products" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
          {t('breadcrumb.home')}
        </Link>
      </div>
    );
  }

  // Get current price based on selected variant or price range
  const currentPrice = selectedVariant ? selectedVariant.retail_price : parseFloat(product.price_range.min);
  const currentStock = selectedVariant ? selectedVariant.stock_info.available : product.stock_info.total_available;
  const isInStock = selectedVariant ? selectedVariant.stock_info.in_stock : product.stock_info.in_stock;
  const originalPrice = selectedVariant ? selectedVariant.original_price : product.originalPrice || 0;

  // Calculate discount percentage and saved amount
  const discountPercentage = originalPrice > 0 && originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;
  const savedAmount = originalPrice > 0 && originalPrice > currentPrice
    ? originalPrice - currentPrice
    : 0;

  // Prepare product images - filter out empty strings and null values
  const galleryImages = (() => {
    if (!product.gallery_images) return [];
    if (typeof product.gallery_images === 'string') {
      try {
        return JSON.parse(product.gallery_images);
      } catch (e) {
        console.error('Error parsing gallery_images:', e);
        return [];
      }
    }
    return Array.isArray(product.gallery_images) ? product.gallery_images : [];
  })();

  const productImages = [
    product.thumbnail_url,
    ...galleryImages
  ].filter(img => img && img.trim() !== '');

  // Related products come from API (fetched in useEffect)
  const relatedProductsList = relatedProducts;

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-6">
        <div className="flex items-center justify-start">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">{t('breadcrumb.home')}</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-[#bc1215] transition-colors">{t('breadcrumb.products')}</Link>
            {product.categories && product.categories.length > 0 && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link
                  href={`/products?category=${product.categories[0].slug}`}
                  className="hover:text-[#bc1215] transition-colors"
                >
                  {t(getCategoryTranslationKey(product.categories[0]))}
                </Link>
              </>
            )}
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">
              {productName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
            </span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 pb-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images Gallery - Professional Slider */}
          <div className="space-y-4">
            {/* Main Image with Professional Effects */}
            <div className="relative group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Progress Bar */}
              {productImages.length > 1 && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 z-20">
                  <div
                    className="h-full bg-gradient-to-r from-[#bc1215] to-[#ff6b6b] transition-all duration-300"
                    style={{ width: `${((selectedImage + 1) / productImages.length) * 100}%` }}
                  ></div>
                </div>
              )}

              {/* Image Container with Scale Effect */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                {productImages.map((img, index) => (
                  <div
                    key={index}
                    className="absolute inset-0 transition-all duration-700 ease-out"
                    style={{
                      opacity: index === selectedImage ? '1' : '0',
                      transform: index === selectedImage ? 'scale(1)' : 'scale(1.1)',
                      zIndex: index === selectedImage ? '1' : '0',
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${productName} ${index + 1}`}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
                      priority={index === 0}
                    />
                  </div>
                ))}

                {/* Overlay Gradient on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-transparent to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>

              {/* Image Counter */}
              {productImages.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold z-10 shadow-lg">
                  <span className="text-[#bc1215]">{selectedImage + 1}</span>
                  <span className="mx-1">/</span>
                  {productImages.length}
                </div>
              )}

              {/* Offer Badge - Enhanced */}
              {product.has_offer && discountPercentage > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#bc1215] to-[#ff4757] text-white px-4 py-2 text-sm font-bold rounded-xl shadow-2xl z-10 animate-bounce">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {t('offers.save', { amount: savedAmount.toLocaleString() })}
                  </div>
                </div>
              )}

              {/* Navigation Arrows - Enhanced */}
              {productImages.length > 1 && (
                <>
                  <button
                    onClick={() => handleImageChange(selectedImage === 0 ? productImages.length - 1 : selectedImage - 1)}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 min-h-[40px] sm:min-h-[48px] bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10 border border-gray-100"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleImageChange(selectedImage === productImages.length - 1 ? 0 : selectedImage + 1)}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 min-h-[40px] sm:min-h-[48px] bg-white/95 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl hover:bg-white hover:scale-110 transition-all duration-300 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 z-10 border border-gray-100"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Dot Indicators - Enhanced for mobile touch */}
              {productImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                  {productImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 transition-all duration-300 rounded-full flex items-center justify-center ${
                        selectedImage === index
                          ? 'w-8 h-2.5 sm:w-8 sm:h-2.5 bg-[#bc1215] shadow-lg'
                          : 'w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 bg-white/60 hover:bg-white/80 hover:scale-125'
                      }`}
                      aria-label={`View image ${index + 1} of ${productImages.length}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation - Enhanced with better touch targets */}
            {productImages.length > 1 && (
              <div className="bg-white rounded-xl p-2 sm:p-3 shadow-lg border border-gray-100">
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-1.5 sm:gap-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => handleImageChange(index)}
                      className={`relative aspect-square min-w-[60px] min-h-[60px] sm:min-w-0 sm:min-h-0 rounded-lg overflow-hidden transition-all duration-300 ${
                        selectedImage === index
                          ? 'ring-2 ring-[#bc1215] ring-offset-2 scale-105 shadow-md'
                          : 'opacity-60 hover:opacity-100 hover:scale-105'
                      }`}
                      aria-label={`View image ${index + 1} of ${productImages.length}`}
                    >
                      <Image
                        src={img}
                        alt={`${productName} ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 20vw, (max-width: 768px) 18vw, (max-width: 1024px) 15vw, 72px"
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-[#bc1215]/10 flex items-center justify-center">
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#bc1215] rounded-full flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-4">
            {/* Product Title & Category - Enhanced */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
              {/* Customer Rating Badge */}
              
              <div className="mb-3">
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 min-h-[2.8rem] sm:min-h-[3rem]">
                  {productName.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")}
                </h1>
              </div>

              {/* Product Meta Information - Better organized */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span className="font-medium">{t('labels.productId')} {product.id}</span>
                </span>
                {selectedVariant && (
                  <span className="flex items-center gap-1 px-2 py-1 bg-gray-50 dark:bg-gray-700 rounded-full">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span className="font-medium">{t('labels.productSku')} {selectedVariant.sku}</span>
                  </span>
                )}
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full ${isInStock ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    {isInStock ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className="font-medium">{isInStock ? t('stock.inStock') : t('stock.outOfStock')}</span>
                </span>
              </div>
            </div>

            {/* Price Section - Enhanced */}
            <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-[#bc1215]">
                    ৳{currentPrice.toLocaleString()}
                  </span>
                  {originalPrice > 0 && originalPrice > currentPrice && (
                    <>
                      <span className="text-base sm:text-lg text-gray-400 line-through">
                        ৳{originalPrice.toLocaleString()}
                      </span>
                      <span className="px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold text-xs rounded-lg border border-green-200 dark:border-green-700">
                        {t('offers.save', { amount: savedAmount.toLocaleString() })}
                      </span>
                    </>
                  )}
                </div>
              </div>
              {product.variant_count > 1 && selectedVariant && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('labels.selectedVariant')} <span className="font-medium text-gray-700 dark:text-gray-300">{selectedVariant.name}</span>
                </p>
              )}
            </div>

            {/* Variant Selection - Enhanced with Static Design */}
            {product.variants && product.variants.length > 1 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-4">
                <label className="block text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                  {t('variants.title')}
                </label>

                {/* All variants displayed in a simple list */}
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;

                    return (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 min-h-[44px] border-2 text-sm font-semibold rounded-lg transition-all ${
                          isSelected
                            ? 'border-[#bc1215] bg-[#bc1215] text-white shadow-md'
                            : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-[#bc1215] dark:hover:border-[#bc1215] hover:text-[#bc1215] dark:hover:text-[#bc1215] bg-white dark:bg-gray-700'
                        }`}
                        aria-label={t('labels.selectVariantAria', { name: variant.name })}
                      >
                        <span className="flex items-center gap-2">
                          {isSelected && (
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {variant.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Variant Info */}
                {selectedVariant && (
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600 dark:text-gray-400">
                        {t('variants.title')}: <span className="font-semibold text-gray-900 dark:text-white">{selectedVariant.name.split(' - ').pop()}</span>
                      </span>
                      <span className={`${selectedVariant.stock_info.in_stock ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-semibold`}>
                        {selectedVariant.stock_info.in_stock
                          ? t('stock.available', { count: selectedVariant.stock_info.available })
                          : t('stock.outOfStock')
                        }
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Stock Alert - Enhanced */}
            {!isInStock && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center">
                <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-sm text-red-600 dark:text-red-400">{t('stock.outOfStock')}</span>
              </div>
            )}

{/* Product Highlights */}
            {productHighlights && productHighlights.length > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 shadow-sm border border-green-100 dark:border-green-800">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white">{t('labels.highlights')}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {showAllHighlights ? productHighlights.length : Math.min(3, productHighlights.length)} / {productHighlights.length}
                      </span>
                    </div>
                    <ul className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-1">
                      {(showAllHighlights ? productHighlights : productHighlights.slice(0, 7)).map((item: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <svg className="w-4 h-4 text-green-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    {productHighlights.length > 7 && (
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => setShowAllHighlights(!showAllHighlights)}
                          className="text-xs font-semibold text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors flex items-center gap-1"
                        >
                          {showAllHighlights ? t('labels.showLess') : t('labels.showMore')}
                          <svg className={`w-3 h-3 transition-transform ${showAllHighlights ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Quantity Selector - Enhanced */}
            {(product.variant_count <= 1 || selectedVariant) && isInStock && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                    {t('quantity.label')}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 min-h-[36px] border-2 border-gray-200 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={quantity <= 1}
                    aria-label={t('quantity.decrease')}
                  >
                    <svg className="w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-bold text-gray-900 dark:text-white min-w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                    className="w-9 h-9 min-h-[36px] border-2 border-gray-200 dark:border-gray-600 hover:border-[#bc1215] dark:hover:border-[#bc1215] flex items-center justify-center transition-all rounded-lg disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={quantity >= currentStock}
                    aria-label={t('quantity.increase')}
                  >
                    <svg className="w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {currentStock}+
                  </span>
                </div>
              </div>
            )}
            {/* Action Buttons - Enhanced */}
            <div className="space-y-3">
              {(product.variant_count <= 1 || selectedVariant) ? (
                <>
                  <div className='grid grid-cols-2 items-center gap-3'>
                    <button
                      onClick={() => {
                        const productToAdd = selectedVariant ? {
                          id: product.id,
                          name: productName,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          variant_id: selectedVariant.id,
                          variant_name: selectedVariant.name,
                          stock: currentStock
                        } : {
                          id: product.id,
                          name: productName,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          stock: currentStock
                        };
                        addToCart(productToAdd, quantity);
                        closeCart();
                        router.push('/checkout');
                      }}
                      className="w-full py-3 sm:py-3.5 min-h-[48px] border-2 border-[#bc1215] bg-[#bc1215] hover:bg-[#8a0e10] text-white font-bold text-sm transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-lg rounded-xl"
                      disabled={!isInStock}
                    >
                      <svg className="w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      {t('buttons.buyNow')}
                    </button>
                    <button
                      onClick={() => {
                        const productToAdd = selectedVariant ? {
                          id: product.id,
                          name: productName,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          variant_id: selectedVariant.id,
                          variant_name: selectedVariant.name,
                          stock: currentStock
                        } : {
                          id: product.id,
                          name: productName,
                          price: currentPrice,
                          image: product.thumbnail_url,
                          slug: product.slug,
                          stock: currentStock
                        };
                        addToCart(productToAdd, quantity, crossSaleProducts);
                      }}
                      className="w-full py-3 sm:py-3.5 min-h-[48px] border-2 border-[#bc1215] text-[#bc1215] hover:bg-[#bc1215] hover:text-white font-bold text-sm transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-x-2 shadow-md rounded-xl"
                      disabled={!isInStock}
                    >
                      <svg className="w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                      {t('buttons.addToCart')}
                    </button>
                  </div>

                  {/* WhatsApp Order Button */}
                  <a
                    href={`https://wa.me/8801975244202?text=${encodeURIComponent(
                      `Hi, I'm interested in buying: ${productName}\nPrice: ৳${currentPrice.toLocaleString()}\n${selectedVariant ? `Variant: ${selectedVariant.name}\n` : ''}Please provide more details.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 sm:py-3.5 min-h-[48px] border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 shadow-md rounded-xl"
                  >
                    <svg className="w-5" fill="#25D366" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>whatsapp</title>
                        <path d="M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z"></path>
                      </g>
                    </svg>
                    {t('buttons.orderViaWhatsapp')}
                  </a>
                </>
              ) : (
                <div className="w-full py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-center text-amber-600 dark:text-amber-400 rounded-xl">
                  <p className="font-semibold text-sm">{t('variants.selectVariant')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1254px] mx-auto mb-6 lg:mb-10">
        <div className="w-full">

          <div className="grid md:grid-cols-4 gap-x-3">
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div>
                <p className="font-semibold text-sm">{t('trustBadges.freeShipping.title')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('trustBadges.freeShipping.description')}</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">{t('trustBadges.securePayment.title')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('trustBadges.securePayment.description')}</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#bc1215] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <p className="font-semibold text-sm">{t('trustBadges.easyReturns.title')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('trustBadges.easyReturns.description')}</p>
              </div>
            </div>
            <div className="flex items-start text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-[#bc1215] flex-shrink-0 mt:0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-semibold text-sm">{t('trustBadges.fastDelivery.title')}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{t('trustBadges.fastDelivery.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details - All Sections */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] py-12">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="space-y-8">
            {/* Description Section */}
            <div className="bg-white dark:bg-[#0a0a0a] p-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-[#bc1215]">
                {t('details.description')}
              </h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {productDescription ? (
                  <div
                    className="product-description text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6 overflow-hidden [&_img]:rounded-lg [&_img]:max-w-full [&_img]:h-auto [&_img]:aspect-auto [&_p]:mb-4 [&_img]:my-4"
                    style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}
                    dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(productDescription) }}
                  />
                ) : (
                  <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                    No description available for this product.
                  </p>
                )}
              </div>
            </div>

            {/* Reviews Section - Only show if reviews exist */}
            {false && (
            <div id="reviews" className="bg-white dark:bg-[#0a0a0a] p-8">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-6 pb-3 border-b-2 border-[#bc1215]">
                {t('reviews.title')}
              </h2>
              <div className="space-y-8">
                {/* Rating Summary */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 lg:p-8">
                  <div className="grid lg:grid-cols-3 gap-8 items-center">
                    {/* Left: Average Rating */}
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#bc1215] mb-2">4.8</div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-7 h-7 ${i < 4 ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Based on 2,847 reviews</p>
                    </div>

                    {/* Middle: Rating Distribution */}
                    <div className="space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const percentage = star === 5 ? 72 : star === 4 ? 18 : star === 3 ? 6 : star === 2 ? 3 : 1;
                        return (
                          <div key={star} className="flex items-center gap-3">
                            <span className="text-sm text-gray-700 dark:text-gray-300 w-20">{star} star</span>
                            <div className="flex-1 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#bc1215] rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">{percentage}%</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Right: Review Breakdown */}
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">5 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">2,049</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">4 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">513</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">3 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">171</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">2 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">86</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">1 star</span>
                        <span className="font-semibold text-gray-900 dark:text-white">28</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Featured Reviews */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Review Card 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#bc1215] to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        RA
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Rahim Ahmed</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Excellent quality fishing net! Very durable and the telescopic handle is a great feature. Used it on my last fishing trip and caught a 5kg catfish. Highly recommended for serious anglers!"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 15, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (24)</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Card 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        MK
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Mohammad Karim</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Great product for the price! The material is sturdy and the net mesh is high quality. Delivery was fast and packaging was secure. Will buy again from Hook & Hunt."
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 10, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (18)</span>
                      </div>
                    </div>
                  </div>

                  {/* Review Card 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        SH
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white">Sheikh Hassan</h4>
                        <div className="flex items-center gap-1">
                          {[...Array(4)].map((_, i) => (
                            <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Verified Purchase</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      "Good quality net but delivery took a bit longer than expected. The product itself is excellent though - strong material and good size. Would recommend to others."
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>Posted on January 8, 2026</span>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v0a1.5 1.5 0 01-3 0zM7 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0zM12 10.5v-6a1.5 1.5 0 013 0v6a1.5 1.5 0 01-3 0z" />
                        </svg>
                        <span>Helpful (12)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Write Review Button */}
                <div className="text-center">
                  <button className="px-8 py-3 min-h-[48px] bg-[#bc1215] hover:bg-[#8a0e10] text-white font-bold text-sm transition-all transform hover:scale-105 rounded-xl shadow-lg">
                    {t('reviews.writeReview')}
                  </button>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProductsList.length > 0 && (
        <section className="py-12 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{t('related.title')}</h2>
              <Link href={`/products?category=${product.categories && product.categories.length > 0 ? product.categories[0].slug : ''}`} className="text-[#bc1215] hover:text-[#8a0e10] font-semibold flex items-center gap-2">
                {t('related.viewAll')}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
              {relatedProductsList.map(relatedProduct => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

// Export with error boundary wrapper
export default function ProductDetailPage() {
  return (
    <ProductErrorBoundary>
      <ProductDetailPageContent />
    </ProductErrorBoundary>
  );
}
