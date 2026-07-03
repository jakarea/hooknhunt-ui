'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCrossSellModal, CrossSaleProduct } from '@/stores/crossSellModalStore';
import { useCart } from '@/context/CartContext';
import { CartProduct } from '@/types';

export default function CrossSellModal() {
  const { isOpen, addedProductName, crossSaleProducts, close } = useCrossSellModal();
  const { t } = useTranslation();
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setIsExiting(false);
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        close();
        setIsExiting(false);
      }, 250);
    }, 15000);
    return () => clearTimeout(timer);
  }, [isOpen, close]);

  // Hide if no cross-sell products available
  if (!isOpen || crossSaleProducts.length === 0) return null;

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      close();
      setIsExiting(false);
    }, 250);
  };

  // Show max 3 products
  const displayProducts = crossSaleProducts.slice(0, 3);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isExiting ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-[#ec3137] to-[#8a0f12]">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-bold">{t('cart.crossSell.added')}</span>
          </div>
          <button
            onClick={handleClose}
            className="text-white/70 hover:text-white transition-colors p-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Added product name */}
        <div className="px-5 py-2 bg-green-50 border-b border-green-100">
          <p className="text-xs text-green-700 font-medium truncate">
            {addedProductName}
          </p>
        </div>

        {/* Cross-Sell Products — max 3-card grid */}
        <div className="p-4">
          <p className="text-xs text-gray-500 font-medium mb-3">
            {t('cart.crossSell.mightAlsoLike')}
          </p>

          <div className="grid grid-cols-3 gap-3">
            {displayProducts.map((product) => (
              <CrossSellCard key={product.id} product={product} onClose={handleClose} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CrossSellCard({ product, onClose }: { product: CrossSaleProduct; onClose: () => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const imageUrl = product.thumbnail?.fullUrl || '';
  const displayPrice = product.retailOfferPrice ?? product.retailPrice;
  const hasOriginalPrice = product.retailOfferPrice && product.retailOfferPrice < product.retailPrice;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    const cartProduct: CartProduct = {
      id: product.id,
      name: product.title,
      price: displayPrice,
      image_url: imageUrl,
      slug: product.slug,
      stock: 999,
    };
    addToCart(cartProduct);

    setTimeout(() => setIsAdding(false), 800);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      onClick={onClose}
      className="group bg-white dark:bg-[#2a2a2a] border border-gray-100 hover:border-gray-200 rounded-none overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 33vw, 200px"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Action overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 p-1.5">
          <button
            onClick={handleQuickAdd}
            className="w-full py-1.5 bg-[#ec3137] hover:bg-[#8a0f12] text-white text-[10px] font-bold rounded flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            {isAdding ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t('cart.crossSell.added')}
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('cart.crossSell.add')}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-2 flex flex-col gap-0.5">
        <h4 className="text-[11px] leading-tight font-medium text-gray-700 line-clamp-2 group-hover:text-[#ec3137] transition-colors">
          {product.title}
        </h4>
        <div className="flex items-baseline gap-1">
          <span className="text-xs font-bold text-[#ec3137]">
            ৳{displayPrice.toLocaleString()}
          </span>
          {hasOriginalPrice && (
            <span className="text-[9px] text-gray-400 line-through">
              ৳{product.retailPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
