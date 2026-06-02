'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import ProductCard from '@/components/product/ProductCard';
import ProductErrorBoundary from '@/components/product/ProductErrorBoundary';
import RecentlyViewedSection from '@/components/product/RecentlyViewedSection';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product as StaticProduct } from '@/types';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';
import { CrossSaleProduct } from '@/stores/crossSellModalStore';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName, getLocalizedDescription, getLocalizedShortDescription, getLocalizedHighlights, getLocalizedIncludesInBox } from '@/stores/productStore';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';
import ProductReviews from '@/components/product/ProductReviews';

// Decode entity-encoded HTML from API and clean unwanted tags
function decodeHtmlEntities(html: string): string {
  if (!html) return '';

  let result = html;
  // Decode entities
  result = result
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');
  result = result.replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)));
  result = result.replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  result = result.replace(/ /g, ' ');
  result = result.replace(/ /g, ' ');

  // Remove script tags and their content (but keep other HTML)
  result = result.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove style tags and their content
  result = result.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove meta tags (self-closing)
  result = result.replace(/<meta\b[^>]*>/gi, '');
  // Remove link tags (self-closing)
  result = result.replace(/<link\b[^>]*>/gi, '');

  return result;
}

// Extract YouTube video ID from various URL formats
function getYouTubeVideoId(url: string): string | null {
  if (!url) return null

  // Regular expressions for different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

// YouTube Video Player Component
function YouTubeVideo({ videoUrl }: { videoUrl: string | null }) {
  const videoId = getYouTubeVideoId(videoUrl || '')

  if (!videoId) return null

  return (
    <div className="mt-8 overflow-hidden rounded-xl shadow-lg">
      <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="Product Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}

// Types
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
  // Support BOTH formats:
  // Format 1: thumbnailUrl (string)
  // Format 2: imageUrl (string) or legacy thumbnail
  thumbnailUrl?: string;
  imageUrl?: string;
  imageId?: number;
  thumbnail?: string | null;
  isActive: boolean;
}

interface ApiProduct {
  id: number;
  productCode: string | null;
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
  attributes: string[] | null;
  attributesBn?: string[] | null;
  // Support BOTH API formats:
  // Format 1 (/catalog): galleryImages as IDs, galleryImagesUrls, thumbnailUrl
  // Format 2 (/store): galleryImages as objects with imageUrl, imageUrl
  imageUrl?: string;
  imageId?: number;
  thumbnailUrl?: string; // Main product image URL (Format 1)
  galleryImages?: number[] | Array<{ imageUrl: string }>; // Can be IDs or objects
  galleryImagesUrls?: string[]; // Array of full URLs (Format 1)
  // Legacy image fields (old API format)
  image?: string;
  featured_image?: string;
  thumbnail?: { id: number; fullUrl: string; alt: string } | null;
  category?: { id: number; name: string; slug: string } | null;
  brand?: { id: number; name: string } | null;
  variants: ApiVariant[];
  crossSaleProducts?: {
    id: number;
    title: string;
    slug: string;
    thumbnail?: { id: number; fullUrl: string; alt: string } | null;
    imageUrl?: string;
    retailPrice: number;
    retailOfferPrice: number | null;
  }[];
}

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
  product_code: string | null;
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
  includesInBox: string[] | null;
  includesInBoxBn?: string[] | null;
  videoUrl: string | null;
  meta_title: string;
  meta_description: string;
  variants: Variant[];
  attributes: string[] | null;
  attributesBn?: string[] | null;
}

function ProductDetailPageContent() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const params = useParams();
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [apiProduct, setApiProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'highlights' | 'attributes' | 'reviews'>('description');
  const [thumbnailOffset, setThumbnailOffset] = useState(0);

  const slug = params.slug as string;

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.getProduct(slug);
        const data = response.data as ApiProduct;

        if (!data || !data.slug) {
          setError('Product not found');
          return;
        }

        setApiProduct(data);

        // Transform API data to UI format
        const variants: Variant[] = (data.variants || []).map((v: ApiVariant) => {
          try {
            // Get variant image: prefer thumbnailUrl, fallback to imageUrl (skip placeholders), then product image
            const placeholderPattern = /placeholder\.jpg$/;
            const productImageUrl = (data.thumbnailUrl || data.imageUrl || '') as string;
            let variantImage = productImageUrl; // Default to product image

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
              sku: v.sku || '',
              name: v.variantName || '',
              retail_price: v.offerPrice || v.price || 0,
              original_price: v.price || 0,
              stock_info: {
                available: v.stock || 0,
                in_stock: (v.stock || 0) > 0,
                low_stock: (v.stock || 0) > 0 && (v.stock || 0) <= 5,
                stock_status: (v.stock || 0) > 0 ? ((v.stock || 0) <= 5 ? 'low_stock' : 'in_stock') : 'out_of_stock',
              },
              image: {
                url: variantImage,
                thumbnail_url: variantImage,
                alt_text: v.variantName || '',
              },
            };
          } catch (err) {
            console.error('Error processing variant:', err, v);
            // Return a safe default variant
            return {
              id: v.id,
              sku: '',
              name: 'Unknown',
              retail_price: 0,
              original_price: 0,
              stock_info: {
                available: 0,
                in_stock: false,
                low_stock: false,
                stock_status: 'out_of_stock',
              },
              image: {
                url: '',
                thumbnail_url: '',
                alt_text: '',
              },
            };
          }
        });

        // Handle gallery images - support BOTH API formats
        let galleryUrls: string[] = [];
        const placeholderPattern = /placeholder\.jpg$/;

        try {
          // Use galleryImagesUrls if available (Format 1 - /catalog endpoint)
          if (data.galleryImagesUrls && Array.isArray(data.galleryImagesUrls) && data.galleryImagesUrls.length > 0) {
            galleryUrls = data.galleryImagesUrls.filter(url =>
              url && typeof url === 'string' && url.length > 0 && !placeholderPattern.test(url)
            );
          } else if (data.galleryImages && Array.isArray(data.galleryImages) && data.galleryImages.length > 0) {
            // Check if galleryImages is Format 2 (objects with imageUrl) or Format 1 (IDs)
            const firstItem = data.galleryImages[0];
            if (firstItem && typeof firstItem === 'object' && 'imageUrl' in firstItem) {
              // Format 2: Extract imageUrl from each object
              galleryUrls = (data.galleryImages as Array<{ imageUrl?: string }>)
                .map(item => item?.imageUrl)
                .filter((url): url is string => Boolean(url && url.length > 0 && !placeholderPattern.test(url)));
            }
          }

          // Add main product image if not already in gallery
          const mainImageUrl = (data.thumbnailUrl || data.imageUrl || '') as string;
          if (mainImageUrl && !galleryUrls.includes(mainImageUrl) && !placeholderPattern.test(mainImageUrl)) {
            galleryUrls.unshift(mainImageUrl);
          }

          // Add variant images to gallery (if not already included)
          variants.forEach((variant: Variant) => {
            const variantImageUrl = variant.image?.url;
            if (variantImageUrl &&
                !galleryUrls.includes(variantImageUrl) &&
                !placeholderPattern.test(variantImageUrl)) {
              // Add variant image to gallery if it's unique
              galleryUrls.push(variantImageUrl);
            }
          });
        } catch (err) {
          console.error('Error processing gallery images:', err);
          // Fallback: use main image only
          const mainImageUrl = (data.thumbnailUrl || data.imageUrl || '') as string;
          galleryUrls = mainImageUrl ? [mainImageUrl] : [];
        }

        const hasOffer = variants.some((v: Variant) => v.original_price > v.retail_price);

        const transformedProduct: Product = {
          id: data.id,
          product_code: data.productCode,
          name: data.name,
          nameBn: data.nameBn,
          slug: data.slug,
          thumbnail_url: data.thumbnailUrl || data.imageUrl || '',
          gallery_images: galleryUrls,
          price_range: {
            min: Math.min(...variants.map((v: Variant) => v.retail_price)).toString(),
            max: Math.max(...variants.map((v: Variant) => v.retail_price)).toString(),
            display: '',
          },
          has_offer: hasOffer,
          originalPrice: variants[0]?.original_price || 0,
          variant_count: variants.length,
          categories: data.category ? [{ name: data.category.name, slug: data.category.slug }] : [],
          stock_info: {
            in_stock: variants.some((v: Variant) => v.stock_info.in_stock),
            total_available: variants.reduce((sum: number, v: Variant) => sum + v.stock_info.available, 0),
            low_stock: variants.every((v: Variant) => !v.stock_info.in_stock || v.stock_info.low_stock),
            stock_status: variants.some((v: Variant) => v.stock_info.in_stock) ? 'in_stock' : 'out_of_stock',
          },
          description: decodeHtmlEntities(data.description || ''),
          descriptionBn: data.descriptionBn ? decodeHtmlEntities(data.descriptionBn) : undefined,
          short_description: decodeHtmlEntities(data.shortDescription || ''),
          shortDescriptionBn: data.shortDescriptionBn ? decodeHtmlEntities(data.shortDescriptionBn) : undefined,
          highlights: (data.highlights || []).map(decodeHtmlEntities),
          highlightsBn: data.highlightsBn?.map(decodeHtmlEntities),
          includesInBox: (data.includesInBox || []).map(decodeHtmlEntities),
          includesInBoxBn: data.includesInBoxBn?.map(decodeHtmlEntities),
          meta_title: data.seoTitle || data.name,
          meta_description: data.seoDescription || data.shortDescription || '',
          videoUrl: data.videoUrl || null,
          attributes: (data.attributes || []).map(decodeHtmlEntities),
          attributesBn: data.attributesBn?.map(decodeHtmlEntities),
          variants,
        };

        setProduct(transformedProduct);
        setSelectedVariant(variants.find((v: Variant) => v.stock_info.in_stock) || variants[0] || null);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  // Update metadata
  useEffect(() => {
    if (product?.meta_title) {
      document.title = `${product.meta_title} | Hook & Hunt`;
    }
    if (product?.meta_description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', product.meta_description);
      }
    }
  }, [product]);

  const localizedName = useMemo(() => product ? getLocalizedName(product, language) : '', [product, language]);
  const localizedDescription = useMemo(() => product ? getLocalizedDescription(product, language) : '', [product, language]);
  const localizedShortDescription = useMemo(() => product ? getLocalizedShortDescription(product, language) : null, [product, language]);
  const localizedHighlights = useMemo(() => product ? getLocalizedHighlights(product, language) : null, [product, language]);
  const localizedAttributes = useMemo(() => {
    if (!product) return [];
    // Select based on language, with fallback to the other language if empty
    let attrs = language === 'bn' ? product.attributesBn : product.attributes;
    // If selected language has no data, try fallback
    if ((!attrs || attrs.length === 0) && language === 'bn') {
      attrs = product.attributes;
    } else if ((!attrs || attrs.length === 0) && language === 'en') {
      attrs = product.attributesBn;
    }
    // Return empty array if no data (for safe rendering with .map)
    return attrs || [];
  }, [product, language]);
  const localizedIncludesInBox = useMemo(() => product ? getLocalizedIncludesInBox(product, language) : null, [product, language]);

  const currentPrice = selectedVariant?.retail_price || product?.variants[0]?.retail_price || 0;
  const originalPrice = selectedVariant?.original_price || product?.variants[0]?.original_price || 0;
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const stock = selectedVariant?.stock_info.available || 0;
  const inStock = selectedVariant?.stock_info.in_stock || false;

  const handleVariantSelect = (variant: Variant) => {
    setSelectedVariant(variant);

    // Update main image to show variant's image
    if (variant.image?.url && product?.gallery_images) {
      const variantImageIndex = product.gallery_images.indexOf(variant.image.url);
      if (variantImageIndex !== -1) {
        // Variant image is in gallery, show it
        setSelectedImageIndex(variantImageIndex);
      } else {
        // Variant image not in gallery, add it and show it
        setProduct(prev => prev ? {
          ...prev,
          gallery_images: [...prev.gallery_images, variant.image.url]
        } : null);
        setSelectedImageIndex(product.gallery_images.length);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    // Use variant image if available, otherwise fall back to product thumbnail
    const imageUrl = selectedVariant.image.url || product.thumbnail_url || '';

    addToCart({
      id: product.id,
      name: localizedName,
      price: currentPrice,
      originalPrice,
      image_url: imageUrl,
      slug: product.slug,
      stock,
    }, quantity);
  };

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    // Use variant image if available, otherwise fall back to product thumbnail
    const imageUrl = selectedVariant.image.url || product.thumbnail_url || '';

    addToCart({
      id: product.id,
      name: localizedName,
      price: currentPrice,
      originalPrice,
      image_url: imageUrl,
      slug: product.slug,
      stock,
    }, quantity, [], false); // false = don't open cart drawer

    router.push('/checkout');
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(stock, prev + delta)));
  };

  const relatedProducts = useMemo(() => {
    if (!apiProduct?.crossSaleProducts) return [];
    return apiProduct.crossSaleProducts.map((p) => ({
      id: p.id,
      product_code: '',
      name: p.title,
      title: p.title,
      slug: p.slug,
      image: p.imageUrl || p.thumbnail?.fullUrl || '',
      featured_image: p.imageUrl || p.thumbnail?.fullUrl || '',
      image_url: p.imageUrl || p.thumbnail?.fullUrl || '',
      price: p.retailOfferPrice || p.retailPrice,
      actual_price: p.retailOfferPrice || p.retailPrice,
      originalPrice: p.retailPrice,
      compare_at_price: p.retailPrice,
      stock: 10,
      inventory_quantity: 10,
      inventory_policy: 'continue' as const,
      has_variants: false,
      status: 'active' as const,
      brand: '',
      category: '',
      category_id: 0,
      variant_count: 1,
      is_trending: false,
      view_count: 0,
      weight: 0,
      unit: 'pcs',
      supplier_id: 0,
      product_link: '',
      tags: [],
      gallery: [],
      sku: '',
      barcode: '',
      hs_code: '',
      seo_title: p.title,
      seo_description: '',
      search_keywords: [],
      cost_rmb: 0,
      exchange_rate: 0,
      cost_bdt: 0,
      default_price: p.retailPrice,
      price_wholesale: p.retailPrice,
      price_retail: p.retailPrice,
      price_daraz: p.retailPrice,
      description: '',
      short_description: '',
      created_at: '',
      updated_at: '',
    }));
  }, [apiProduct]);

  const productInWishlist = product ? isInWishlist(product.id) : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fee1e1] flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-[#bc1215] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product || !selectedVariant) {
    return (
      <div className="min-h-screen bg-[#fee1e1] flex items-center justify-center">
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link href="/products" className="inline-block px-6 py-2 bg-[#bc1215] text-white rounded-lg hover:bg-[#8a0e10] transition-colors">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fee1e1] overflow-x-hidden">
      {/* Breadcrumb */}
      <div className="bg-white/50 dark:bg-[#0f0f0f]/50 border-b border-gray-200/50 dark:border-gray-800/50 overflow-x-hidden">
        <div className="container px-3 md:px-4 py-3">
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#bc1215] transition-colors">Home</Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <Link href="/products" className="hover:text-[#bc1215] transition-colors">Products</Link>
            {product.categories[0] && (
              <>
                <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <Link href={`/products?category=${product.categories[0].slug}`} className="hover:text-[#bc1215] transition-colors">
                  {product.categories[0].name}
                </Link>
              </>
            )}
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium truncate max-w-[150px]">{localizedName}</span>
          </div>
        </div>
      </div>

      <div className="container px-3 md:px-4 py-6 sm:py-8 max-w-full overflow-x-hidden">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4 min-w-0">
            {/* Main Image */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg h-64 sm:h-auto sm:aspect-square">
              {product.gallery_images[selectedImageIndex] ? (
                <Image
                  src={product.gallery_images[selectedImageIndex]}
                  alt={selectedVariant.image.alt_text || localizedName}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white px-3 py-1.5 rounded-full text-sm font-bold shadow-lg">
                  -{discount}% OFF
                </div>
              )}

            </div>

            {/* Thumbnail Gallery - Slider */}
            {product.gallery_images.length > 1 && (
              <div className="relative group overflow-hidden">
                {/* Thumbnails Container */}
                <div className="overflow-x-auto overflow-y-hidden scrollbar-hide">
                  <div
                    className="flex gap-1.5"
                  >
                    {product.gallery_images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 flex-shrink-0 w-16 transition-all ${
                          selectedImageIndex === index
                            ? 'border-[#bc1215] ring-2 ring-[#bc1215]/20'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${localizedName} ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100px"
                        />
                        {selectedImageIndex === index && (
                          <div className="absolute inset-0 bg-[#bc1215]/10 pointer-events-none rounded-xl" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2 sm:space-y-6 min-w-0 overflow-x-hidden">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {localizedName}
              </h1>
            </div>

            {/* Price & Stock */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold text-[#bc1215]">
                  ৳{currentPrice.toLocaleString()}
                </span>
                {originalPrice > currentPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

            </div>

            {/* Short Description */}
            {localizedShortDescription && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {localizedShortDescription}
              </p>
            )}

            {/* YouTube Video */}
            {product.videoUrl && <YouTubeVideo videoUrl={product.videoUrl} />}

            {/* Variant Selection */}
            {product.variants.length >= 1 && (
              <div className="space-y-3 overflow-x-hidden">
                <label className="hidden sm:flex text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider items-center gap-2">
                  <svg className="w-4 h-4 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {t('selectVariant')}
                </label>

                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant.id === variant.id;
                    const hasDiscount = variant.original_price > variant.retail_price;
                    const isOutOfStock = !variant.stock_info.in_stock;
                    const hasImage = variant.image?.url && typeof variant.image.url === 'string' && variant.image.url.trim() !== '';

                    return (
                      <button
                        key={variant.id}
                        onClick={() => !isOutOfStock && handleVariantSelect(variant)}
                        disabled={isOutOfStock}
                        className={`
                          relative group flex items-center gap-2 px-1.5 py-1.5 sm:px-2 sm:py-2 rounded-xl border-2 transition-all duration-200 text-left
                          ${isSelected
                            ? 'border-[#bc1215] bg-gradient-to-r from-[#bc1215] to-[#8a0e10] text-white shadow-md'
                            : 'border-gray-200 dark:border-gray-700 hover:border-[#bc1215]/30 text-gray-700 dark:text-gray-300'
                          }
                          ${isOutOfStock ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
                        `}
                      >
                        {/* Variant Image */}
                        {hasImage && (
                          <div className={`w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 ${isSelected ? 'ring-2 ring-white/30' : ''}`}>
                            <img
                              src={variant.image.url}
                              alt={variant.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Variant Info */}
                        <div className="flex flex-col items-start gap-0.5">
                          {/* Variant Name - remove index numbers */}
                          <span className="text-xs font-bold leading-tight">
                            {variant.name.replace(/^[\d\s\.\#]+/, '').trim()}
                          </span>

                          {/* Price */}
                          <span className="text-xs font-semibold">
                            ৳{variant.retail_price.toLocaleString()}
                          </span>
                        </div>

                        {/* Discount Badge - Desktop only */}
                        {hasDiscount && (
                          <span className="hidden sm:block px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded ml-auto">
                            -{Math.round(((variant.original_price - variant.retail_price) / variant.original_price) * 100)}%
                          </span>
                        )}

                        {/* Out of Stock */}
                        {isOutOfStock && (
                          <span className="absolute inset-0 flex items-center justify-center bg-white/70 dark:bg-black/70 rounded-xl">
                            <span className="text-[9px] font-bold text-gray-700 dark:text-gray-300">Sold Out</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-gray-200 rounded-xl">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className="px-4 py-3 text-gray-600 hover:text-[#bc1215] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="px-4 py-3 font-semibold text-gray-900 dark:text-white min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= stock}
                      className="px-4 py-3 text-gray-600 hover:text-[#bc1215] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!inStock}
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-[#bc1215] to-[#8a0e10] hover:from-[#8a0e10] hover:to-[#bc1215] text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  disabled={!inStock}
                  className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {inStock ? 'Buy Now' : 'Out of Stock'}
                </button>
              </div>

              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/8801975244202?text=${encodeURIComponent(`Hi, I want to order: ${localizedName} (৳${currentPrice.toLocaleString()}) - Quantity: ${quantity}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>{t('orderViaWhatsApp')}</span>
              </a>

              {/* Product Highlights */}
              {localizedHighlights && localizedHighlights.length > 0 && (
                <div className="bg-gradient-to-br from-[#bc1215]/5 to-[#8a0e10]/5 border border-[#bc1215]/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('keyFeatures')}</h3>
                  </div>
                  <ul className="space-y-2">
                    {localizedHighlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-[#bc1215] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Includes in Box */}
              {localizedIncludesInBox && localizedIncludesInBox.length > 0 && (
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('includesInBox')}</h3>
                  </div>
                  <ul className="space-y-2">
                    {localizedIncludesInBox.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 overflow-x-hidden">
          <div className="bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
            {/* Tab Headers */}
            <div className="flex border-b border-gray-200/50 dark:border-gray-800/50">
              <button
                onClick={() => setActiveTab('description')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'description'
                    ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Description
              </button>
              <button
                onClick={() => setActiveTab('attributes')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'attributes'
                    ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Attributes
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'reviews'
                    ? 'text-[#bc1215] border-b-2 border-[#bc1215]'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Reviews
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-6 sm:p-8">
              {activeTab === 'description' && (
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  {localizedDescription ? (
                    <div dangerouslySetInnerHTML={{ __html: localizedDescription }} />
                  ) : (
                    <p className="text-gray-500">No description available.</p>
                  )}
                </div>
              )}

              {activeTab === 'attributes' && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-[#bc1215]/5 to-[#8a0e10]/5 border border-[#bc1215]/20 rounded-2xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <svg className="w-4 h-4 text-[#bc1215]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">{t('productAttributes')}</h3>
                    </div>
                    {(localizedAttributes && localizedAttributes.length > 0) ? (
                      <ul className="space-y-2">
                        {localizedAttributes.map((attr, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-[#bc1215] flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: attr }} />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No attributes available.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <ProductReviews productSlug={product.slug} productId={product.id} />
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 overflow-x-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-8 bg-gradient-to-b from-[#bc1215] to-[#8a0e10] rounded-full"></div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Related Products
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recently Viewed */}
      <RecentlyViewedSection currentProductId={product.id} />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ProductErrorBoundary>
      <ProductDetailPageContent />
    </ProductErrorBoundary>
  );
}
