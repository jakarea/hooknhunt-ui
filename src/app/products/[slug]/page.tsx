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
import { getLocalizedName, getLocalizedDescription, getLocalizedHighlights } from '@/stores/productStore';
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
  meta_title: string;
  meta_description: string;
  variants: Variant[];
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
  const [activeTab, setActiveTab] = useState<'description' | 'highlights' | 'reviews'>('description');
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
        const variants: Variant[] = data.variants.map((v: ApiVariant) => ({
          id: v.id,
          sku: v.sku,
          name: v.variantName,
          retail_price: v.offerPrice || v.price,
          original_price: v.price,
          stock_info: {
            available: v.stock,
            in_stock: v.stock > 0,
            low_stock: v.stock > 0 && v.stock <= 5,
            stock_status: v.stock > 0 ? (v.stock <= 5 ? 'low_stock' : 'in_stock') : 'out_of_stock',
          },
          image: {
            url: v.thumbnail || data.thumbnail?.fullUrl || '',
            thumbnail_url: v.thumbnail || data.thumbnail?.fullUrl || '',
            alt_text: data.thumbnail?.alt || v.variantName,
          },
        }));

        const galleryUrls = data.galleryImages?.map((img: { fullUrl: string }) => img.fullUrl) || [];
        if (data.thumbnail?.fullUrl && !galleryUrls.includes(data.thumbnail.fullUrl)) {
          galleryUrls.unshift(data.thumbnail.fullUrl);
        }

        const hasOffer = variants.some((v: Variant) => v.original_price > v.retail_price);

        const transformedProduct: Product = {
          id: data.id,
          product_code: data.productCode,
          name: data.name,
          nameBn: data.nameBn,
          slug: data.slug,
          thumbnail_url: data.thumbnail?.fullUrl || '',
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
          meta_title: data.seoTitle || data.name,
          meta_description: data.seoDescription || data.shortDescription || '',
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
  const localizedHighlights = useMemo(() => product ? getLocalizedHighlights(product, language) : [], [product, language]);

  const currentPrice = selectedVariant?.retail_price || product?.variants[0]?.retail_price || 0;
  const originalPrice = selectedVariant?.original_price || product?.variants[0]?.original_price || 0;
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
  const stock = selectedVariant?.stock_info.available || 0;
  const inStock = selectedVariant?.stock_info.in_stock || false;
  const lowStock = selectedVariant?.stock_info.low_stock || false;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
      id: product.id,
      name: localizedName,
      price: currentPrice,
      originalPrice,
      image: selectedVariant.image.url,
      slug: product.slug,
      stock,
    }, quantity);
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(stock, prev + delta)));
  };

  const relatedProducts = useMemo(() => {
    if (!apiProduct?.crossSaleProducts) return [];
    return apiProduct.crossSaleProducts.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      image: p.thumbnail?.fullUrl || '',
      price: p.retailOfferPrice || p.retailPrice,
      originalPrice: p.retailPrice,
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
    <div className="min-h-screen bg-[#fee1e1]">
      {/* Breadcrumb */}
      <div className="bg-white/50 dark:bg-[#0f0f0f]/50 border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container py-3">
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

      <div className="container py-6 sm:py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-lg aspect-square">
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

              {/* Low Stock Badge */}
              {lowStock && inStock && (
                <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Only {stock} left
                </div>
              )}
            </div>

            {/* Thumbnail Gallery - Slider */}
            {product.gallery_images.length > 1 && (
              <div className="relative group">
                {/* Thumbnails Container */}
                <div className="overflow-hidden">
                  <div
                    className="flex gap-1 transition-transform duration-300 ease-out"
                    style={{ transform: `translateX(-${thumbnailOffset * (100 / 6)}%)` }}
                  >
                    {product.gallery_images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 flex-shrink-0 w-[calc((100%-10px)/6)] transition-all ${
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

                {/* Left Arrow - Show on Hover */}
                {thumbnailOffset > 0 && (
                  <button
                    onClick={() => setThumbnailOffset(Math.max(0, thumbnailOffset - 6))}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-full p-2 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}

                {/* Right Arrow - Show on Hover */}
                {thumbnailOffset + 6 < product.gallery_images.length && (
                  <button
                    onClick={() => setThumbnailOffset(Math.min(product.gallery_images.length - 6, thumbnailOffset + 6))}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-full p-2 bg-white dark:bg-[#0a0a0a] rounded-lg shadow-lg hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                {localizedName}
              </h1>
              {product.product_code && (
                <p className="text-sm text-gray-500 mt-1">SKU: {product.product_code}</p>
              )}
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

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {inStock ? (lowStock ? `Low Stock (${stock})` : 'In Stock') : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Short Description */}
            {product.short_description && (
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {product.short_description}
              </p>
            )}

            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4 text-[#bc1215]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  {t('selectVariant')}
                </label>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => {
                    const isSelected = selectedVariant.id === variant.id;
                    const hasDiscount = variant.original_price > variant.retail_price;
                    const isOutOfStock = !variant.stock_info.in_stock;
                    const hasImage = variant.image && typeof variant.image === 'string' && variant.image.trim() !== '';

                    return (
                      <button
                        key={variant.id}
                        onClick={() => !isOutOfStock && setSelectedVariant(variant)}
                        disabled={isOutOfStock}
                        className={`
                          relative group flex items-center gap-2 px-2 py-2 rounded-xl border-2 transition-all duration-200
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
                              src={variant.image}
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

                        {/* Discount Badge */}
                        {hasDiscount && (
                          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[9px] font-bold rounded ml-auto">
                            -{Math.round(((variant.original_price - variant.retail_price) / variant.original_price) * 100)}%
                          </span>
                        )}

                        {/* Checkmark */}
                        {isSelected && (
                          <svg className="w-3.5 h-3.5 text-white ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
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

            {/* Quantity & Add to Cart */}
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

              {/* WhatsApp Order Button */}
              <a
                href={`https://wa.me/8801975244202?text=${encodeURIComponent(`Hi, I want to order: ${localizedName} (৳${currentPrice.toLocaleString()}) - Quantity: ${quantity}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.505-.827-.505-.308 0-.67.015-.973.015-.3 0-.79.114-1.204.57-.414.457-1.578 1.543-1.578 3.766 0 2.224 1.62 4.372 1.844 4.673.225.3 3.182 4.86 7.71 6.804 1.077.466 1.92.674 2.574.567.712-.103 2.204-.9 2.514-1.769.31-.869.31-1.614.217-1.769-.093-.155-.34-.249-.67-.445zM12.042 22C6.478 22 2 17.522 2 12S6.478 2 12.042 2C17.566 2 22 6.478 22 12s-4.434 10-9.958 10z" />
                </svg>
                <span>{t('orderViaWhatsApp')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12">
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
                  {(product.description || product.short_description) ? (
                    <div dangerouslySetInnerHTML={{ __html: product.description || product.short_description || 'No description available.' }} />
                  ) : (
                    <p className="text-gray-500">No description available.</p>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <ProductReviews productId={product.id} />
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
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
                  product={{
                    id: relatedProduct.id,
                    name: relatedProduct.title,
                    title: relatedProduct.title,
                    slug: relatedProduct.slug,
                    image: relatedProduct.image,
                    featured_image: relatedProduct.image,
                    price: relatedProduct.price,
                    actual_price: relatedProduct.price,
                    originalPrice: relatedProduct.originalPrice,
                    compare_at_price: relatedProduct.originalPrice,
                    stock: 10,
                    inventory_quantity: 10,
                    variant_count: 1,
                    is_trending: false,
                    view_count: 0,
                  }}
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
