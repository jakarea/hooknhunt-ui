'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useCrossCartStore } from '@/stores/crossCartStore';
import { CrossSaleProduct } from '@/stores/crossSellModalStore';

export default function CrossSellSection() {
  const { t } = useTranslation();
  const { cartItems, addToCart, isInCart } = useCart();
  const crossSellsByProduct = useCrossCartStore((s) => s.crossSellsByProduct);
  const hydrate = useCrossCartStore((s) => s.hydrate);

  // Hydrate cross-sell data from localStorage on mount
  useEffect(() => { hydrate(); }, [hydrate]);

  // Flatten, deduplicate, filter out items already in cart
  const crossSellProducts = useMemo(() => {
    const seen = new Map<number, CrossSaleProduct>();
    Object.values(crossSellsByProduct).forEach((products) => {
      products.forEach((p) => {
        if (!seen.has(p.id)) {
          seen.set(p.id, p);
        }
      });
    });

    // Filter out products already in cart
    const filtered: CrossSaleProduct[] = [];
    seen.forEach((p) => {
      if (!isInCart(p.id)) {
        filtered.push(p);
      }
    });

    return filtered;
  }, [crossSellsByProduct, cartItems, isInCart]);

  if (crossSellProducts.length === 0) return null;

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm md:text-base font-bold text-gray-900 dark:text-white">
          {t('cart.crossSell.title')}
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {crossSellProducts.map((product) => (
          <CrossSellCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function CrossSellCard({ product }: { product: CrossSaleProduct }) {
  const [isAdding, setIsAdding] = useState(false);
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const imageUrl = product.thumbnail?.fullUrl || '';
  const displayPrice = product.retailOfferPrice ?? product.retailPrice;
  const hasDiscount = product.retailOfferPrice != null && product.retailOfferPrice < product.retailPrice;
  const discountPct = hasDiscount
    ? Math.round(((product.retailPrice - product.retailOfferPrice!) / product.retailPrice) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);

    addToCart({
      id: product.id,
      name: product.title,
      price: displayPrice,
      image: imageUrl,
      slug: product.slug,
      stock: 999,
    });

    setTimeout(() => setIsAdding(false), 600);
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white dark:bg-[#111] border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md flex flex-col"
    >
      <div className="relative aspect-[4/3] bg-gray-50 dark:bg-gray-900 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {hasDiscount && (
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-[#ec3137] text-white text-[9px] font-bold rounded">
            -{discountPct}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 p-1.5">
          <button
            onClick={handleQuickAdd}
            className="w-full py-1.5 bg-[#ec3137] hover:bg-[#8a0f12] text-white text-[11px] font-bold rounded flex items-center justify-center gap-1 transition-colors active:scale-95"
          >
            {isAdding ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {t('cart.crossSell.added')}
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                {t('cart.crossSell.add')}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="p-2 flex flex-col flex-1 gap-0.5">
        <h3 className="text-xs leading-snug font-medium text-gray-700 dark:text-gray-300 line-clamp-2 group-hover:text-[#ec3137] transition-colors">
          {product.title}
        </h3>
        <div className="mt-auto flex items-baseline gap-1.5">
          <span className="text-xs font-bold text-[#ec3137]">
            ৳{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-gray-400 line-through">
              ৳{product.retailPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
