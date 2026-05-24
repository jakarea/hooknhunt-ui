'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRecentlyViewed } from '@/contexts/RecentlyViewedContext';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName } from '@/stores/productStore';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addToRecentlyViewed } = useRecentlyViewed();
  const [isAdding, setIsAdding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wishlistAnimating, setWishlistAnimating] = useState(false);
  const { language } = useLanguage();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Track recently viewed (only track once per product ID)
  useEffect(() => {
    if (mounted) {
      addToRecentlyViewed(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, product.id, addToRecentlyViewed]);

  // Get localized product name
  const localizedName = useMemo(() => getLocalizedName(product, language), [product, language]);

  // Map product properties to display properties
  const price = product.price ?? product.actual_price;
  const originalPrice = product.originalPrice ?? product.compare_at_price;
  const image = product.image_url ?? product.imageUrl ?? product.image ?? product.featured_image ?? null;
  const name = localizedName;
  const stock = product.stock ?? product.inventory_quantity;
  const variant_count = product.variant_count || 0;

  const discount = originalPrice && price
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const productInCart = mounted ? isInCart(product.id) : false;
  const productInWishlist = mounted ? isInWishlist(product.id) : false;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsAdding(true);
    addToCart({
      id: product.id,
      name: product.name || product.title,
      price: product.price || product.actual_price,
      originalPrice: product.originalPrice || product.compare_at_price,
      image: product.image_url || product.imageUrl || product.image || product.featured_image,
      slug: product.slug,
      stock: product.stock || product.inventory_quantity,
    }, 1);

    // Reset animation after 500ms
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  const handleViewCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push('/cart');
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistAnimating(true);
    toggleWishlist(product);
    setTimeout(() => setWishlistAnimating(false), 300);
  };

  return (
    <div className="group bg-white border hover:shadow-xl border-[#ffa2a2]  hover:border-[#ec3137]/30 transition-all duration-300 overflow-hidden h-full flex flex-col relative p-2 lg:p-3 rounded-none">
      <Link href={`/products/${product.slug}`} className="flex flex-col h-full">
        {/* Product Image */}
        <div className="relative overflow-hidden aspect-square p-2 flex-shrink-0 rounded-[8px]">
          {image ? (
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}

          {/* Badge Stack - Top Left */}
          <div className="flex flex-col gap-1.5 items-start absolute top-2 left-2">
            {/* Trending Badge */}
            {product.is_trending && (
              <div className="flex items-center gap-1 bg-[#bc1215] text-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full shadow-md animate-pulse">
                <span className="text-xs">🔥</span>
                <span>{t('productCard.trending')}</span>
              </div>
            )}

            {/* Discount Badge */}
            {discount > 0 && (
              <div className="bg-[#bc1215] text-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold rounded-full shadow-md">
                -{discount}%
              </div>
            )}
          </div>

          {/* Wishlist Heart Button - Top Right */}
          <button
            onClick={handleWishlistToggle}
            className={`absolute top-2 right-2 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 z-10 ${
              productInWishlist
                ? 'bg-white/90 text-red-500 scale-110'
                : 'bg-white/70 text-gray-400 hover:text-red-500 hover:scale-110 hover:bg-white/90'
            } ${wishlistAnimating ? 'scale-125' : ''}`}
            aria-label={productInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${productInWishlist ? 'fill-current' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={productInWishlist ? 0 : 2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>



          {/* View Count - Social Proof */}
          {(product.view_count ?? 0) > 0 && (
            <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-[10px] font-medium">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>{product.view_count}</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="w-full mt-2 lg:mt-3 flex-1 flex flex-col">
          {/* Product Name */}
          <h3 className="font-semibold text-black line-clamp-2 text-body-sm group-hover:text-[#bc1215] transition-colors min-h-[2.5rem] block mb-2">
            {name}
          </h3>


          {/* Price or Price Range */}
          <div className="mb-1 lg:mb-2 flex-1">
            {(variant_count === 0 || variant_count === 1) ? (
              // Single variant or no variants - show exact price
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base lg:text-lg font-bold text-[#bc1215]">
                    {price > 0 ? `৳${price.toLocaleString()}` : t('productCard.priceUnavailable')}
                  </span>
                  {originalPrice && originalPrice > price && price > 0 && (
                    <span className="text-xs lg:text-sm text-gray-400 line-through opacity-80">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Stock Status */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stock > 0 ? t('productCard.inStock') : t('productCard.outOfStock')}
                  </span>
                </div>
              </div>
            ) : (
              // Multiple variants - show minimum price with strikethrough if offer exists
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-base lg:text-lg font-bold text-[#bc1215]">
                    {price > 0 ? `৳${price.toLocaleString()}` : t('productCard.priceVaries')}
                  </span>
                  {originalPrice && originalPrice > price && price > 0 && (
                    <span className="text-xs lg:text-sm text-gray-400 line-through opacity-80">
                      ৳{originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {/* Stock Status for multiple variants */}
                <div className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className={`text-xs font-medium ${stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {stock > 0 ? t('productCard.inStock') : t('productCard.outOfStock')}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Button - Add to Cart for single variant, View Details for multiple variants */}
          {!mounted ? (
            <div className="mt-2 flex-shrink-0">
              <div className="w-full py-2.5 bg-gray-200 animate-pulse rounded-lg"></div>
            </div>
          ) : variant_count > 1 ? (
            <div className="mt-2 flex-shrink-0">
              <div className="w-full py-2.5 bg-[#bc1215] hover:bg-[#8a0e10] text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] rounded-lg cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('productCard.viewDetails')}
              </div>
            </div>
          ) : productInCart ? (
            <div className="mt-2 flex-shrink-0">
              <button
                onClick={handleViewCart}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] rounded-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('productCard.viewCart')}
              </button>
            </div>
          ) : (
            <div className="mt-2 flex-shrink-0">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0 || price <= 0}
                className={`w-full py-2.5 bg-[#bc1215] hover:bg-[#8a0e10] text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed ${isAdding ? 'scale-95' : ''}`}
              >
                {isAdding ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path className="opacity-25" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12h.01M20 12a8 8 0 11-16 0 8 8 0 0116 0z" />
                      <path className="opacity-75" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018 0" />
                    </svg>
                    {t('productCard.adding')}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {t('productCard.addToCart')}
                  </>
                )}
              </button>
            </div>
          )}


        </div>
      </Link>
    </div>
  );
}
