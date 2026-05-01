'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useCrossSellModal } from '@/stores/crossSellModalStore';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import CartDeliveryEstimate from '@/components/cart/CartDeliveryEstimate';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName } from '@/stores/productStore';

export default function CartSidebar() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartCount,
    isCartOpen,
    closeCart,
  } = useCart();

  const { crossSaleProducts: crossSellProducts } = useCrossSellModal();

  const [mounted, setMounted] = useState(false);

  // Helper to get localized product name
  const getLocalizedNameForProduct = useMemo(() => (product: any) => {
    return getLocalizedName(product, language);
  }, [language]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  const handleViewCart = () => {
    closeCart();
    router.push('/cart');
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[380px] bg-white dark:bg-[#0a0a0a] shadow-2xl z-[101] transform transition-transform duration-300 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#ec3137] to-[#8a0f12] text-white px-5 py-4 flex items-center justify-between flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[#ec3137] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                  {getCartCount()}
                </span>
              )}
            </div>
            <div>
              <h2 className="text-heading-lg font-bold tracking-tight">{t('cart.sidebar.title')}</h2>
              <p className="text-label-sm text-white/90 font-semibold">
                {getCartCount()} {getCartCount() === 1 ? t('cart.sidebar.item') : t('cart.sidebar.items')}
              </p>
            </div>
          </div>
          <button onClick={closeCart} className="p-2 hover:bg-white/20 rounded-full transition-colors" aria-label={t('cart.sidebar.close')}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-heading-lg font-bold text-gray-900 dark:text-white mb-2 block">{t('cart.sidebar.empty')}</span>
              <p className="text-body-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs">{t('cart.sidebar.emptyMessage')}</p>
              <button onClick={closeCart} className="px-6 py-3 bg-[#ec3137] hover:bg-[#8a0f12] text-white text-body-sm font-semibold transition-colors rounded-xl shadow-md hover:shadow-lg">
                {t('common.continueShopping')}
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => (
              <div
                key={item.id}
                className="flex gap-3 bg-white dark:bg-[#111] p-3 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm animate-slideIn hover:shadow-md transition-shadow"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link href={`/products/${item.product.slug}`} onClick={closeCart} className="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <Image
                    src={item.product.variant_image || item.product.image || '/placeholder-image.jpg'}
                    alt={getLocalizedNameForProduct(item.product) || 'Product'}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </Link>
                <div className="flex-1 min-w-0 flex flex-col">
                  <div className="flex items-start justify-between gap-2 flex-1">
                    <Link href={`/products/${item.product.slug}`} onClick={closeCart} className="min-w-0 flex-1">
                      <span className="font-semibold text-gray-900 dark:text-white text-body-sm line-clamp-2 hover:text-[#ec3137] transition-colors leading-snug block">
                        {getLocalizedNameForProduct(item.product)}
                      </span>
                      {item.product.variant_name && (
                        <p className="text-label-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{item.product.variant_name}</p>
                      )}
                    </Link>
                    <button onClick={() => removeFromCart(item.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0" aria-label={t('cart.sidebar.remove')}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-[#ec3137] hover:text-[#ec3137] transition-all font-medium" aria-label={t('cart.sidebar.decrease')}>
                        <svg className="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" /></svg>
                      </button>
                      <span className="w-7 text-center font-bold text-gray-900 dark:text-white text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= (item.product.stock || 999)} className="w-7 h-7 flex items-center justify-center border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:border-[#ec3137] hover:text-[#ec3137] transition-all font-medium disabled:opacity-40 disabled:cursor-not-allowed" aria-label={t('cart.sidebar.increase')}>
                        <svg className="w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                    <p className="font-bold text-[#ec3137] text-base">৳{((item.product.price || 0) * item.quantity).toLocaleString()}</p>
                  </div>
                  {item.quantity >= (item.product.stock || 999) && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-1.5 font-medium">{t('cart.sidebar.maxStock')}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cross-Sell — dynamic from API */}
        {cartItems.length > 0 && crossSellProducts.length > 0 && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 px-4 py-3 bg-white dark:bg-[#0a0a0a]">
            <span className="text-body-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 block">{t('cart.sidebar.youMightAlsoLike')}</span>
            <div className="grid grid-cols-2 gap-3">
              {crossSellProducts.filter(p => !cartItems.some(item => item.product.id === p.id)).slice(0, 2).map((product) => {
                const imageUrl = product.thumbnail?.fullUrl || '';
                const displayPrice = product.retailOfferPrice ?? product.retailPrice;
                const hasDiscount = product.retailOfferPrice && product.retailOfferPrice < product.retailPrice;
                const discountPct = hasDiscount
                  ? Math.round(((product.retailPrice - product.retailOfferPrice!) / product.retailPrice) * 100)
                  : 0;

                return (
                  <Link key={product.id} href={`/products/${product.slug}`} onClick={closeCart} className="group border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:border-[#ec3137] transition-all hover:shadow-md">
                    <div className="relative h-24 bg-gray-50 dark:bg-gray-900">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={product.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="170px" unoptimized />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                      )}
                      {hasDiscount && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#ec3137] text-white text-xs font-bold rounded-md shadow-sm">-{discountPct}%</div>
                      )}
                    </div>
                    <div className="p-2.5">
                      <span className="text-label-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-2 leading-snug group-hover:text-[#ec3137] transition-colors min-h-[2.25rem] block">{product.title}</span>
                      <div className="flex items-baseline gap-1 mt-1.5">
                        <span className="text-body-sm font-bold text-[#ec3137]">৳{displayPrice.toLocaleString()}</span>
                        {hasDiscount && (
                          <span className="text-label-xs text-gray-400 line-through">৳{product.retailPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart({
                            id: product.id,
                            name: product.title,
                            price: displayPrice,
                            image: imageUrl,
                            slug: product.slug,
                            stock: 999,
                          });
                        }}
                        className="mt-2 w-full py-2 bg-[#ec3137] hover:bg-[#8a0f12] text-white text-label-xs font-bold rounded-lg transition-colors shadow-sm"
                      >{t('cart.sidebar.add')}</button>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-800 px-5 py-4 space-y-3 bg-gray-50 dark:bg-[#0f0f0f] flex-shrink-0">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700 dark:text-gray-300 text-body-sm">{t('cart.sidebar.subtotal')}</span>
              <span className="font-bold text-lg text-[#ec3137]">
                <AnimatedCounter value={getCartTotal()} prefix="৳" duration={600} />
              </span>
            </div>

            {/* Delivery Estimate */}
            <CartDeliveryEstimate />

            <p className="text-label-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">{t('cart.sidebar.shippingNote')}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleViewCart} className="py-2.5 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white text-body-sm font-semibold transition-colors rounded-xl flex items-center justify-center gap-2 shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {t('cart.sidebar.viewCart')}
              </button>
              <button onClick={handleCheckout} className="py-2.5 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white text-body-sm font-bold transition-all rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg">
                {t('cart.sidebar.proceedToCheckout')}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </>
  );
}
