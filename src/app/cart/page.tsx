'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import AnimatedCounter from '@/components/common/AnimatedCounter';
import { useTranslation } from 'react-i18next';
import DeleteConfirmModal from '@/components/cart/DeleteConfirmModal';
import CrossSellSection from '@/components/cart/CrossSellSection';
import { useLanguage } from '@/contexts/LanguageContext';
import { getLocalizedName } from '@/stores/productStore';

export default function CartPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { cartItems, removeFromCart, updateQuantity, getCartCount } = useCart();

  // Track selected items (all selected by default)
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [mounted, setMounted] = useState(false);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  // Helper to get localized product name
  const getLocalizedNameForProduct = useMemo(() => (product: any) => {
    return getLocalizedName(product, language);
  }, [language]);

  // Fix hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize all items as selected when cart changes
  useEffect(() => {
    setSelectedItems(new Set(cartItems.map(item => item.product.id)));
  }, [cartItems]);

  // Calculate totals based on selected items only
  const calculateSelectedTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product.id))
      .reduce((sum, item) => sum + (item.product.price || 0) * item.quantity, 0);
  };

  const calculateSelectedOriginalTotal = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product.id))
      .reduce((sum, item) => {
        const price = item.product.originalPrice || item.product.price || 0;
        return sum + price * item.quantity;
      }, 0);
  };

  const getSelectedCount = () => {
    return cartItems
      .filter(item => selectedItems.has(item.product.id))
      .reduce((count, item) => count + item.quantity, 0);
  };

  const subtotal = calculateSelectedTotal();
  const originalTotal = calculateSelectedOriginalTotal();
  const shippingThreshold = 5000;

  // Shipping is calculated at checkout based on location
  const total = subtotal;

  // Toggle individual item selection (uses product ID)
  const toggleItemSelection = (productId: number) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  // Toggle all items selection
  const toggleSelectAll = () => {
    if (selectedItems.size === cartItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cartItems.map(item => item.product.id)));
    }
  };

  // Handle delete confirmation
  const handleDeleteClick = (productId: number, productName: string) => {
    setItemToDelete({ id: productId, name: productName });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeFromCart(itemToDelete.id);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  const allSelected = cartItems.length > 0 && selectedItems.size === cartItems.length;
  const hasDiscount = originalTotal > subtotal;

  if (!mounted) {
    return null;
  }

  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
          <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <Link href="/" className="hover:text-[#ec3137] transition-colors">
                {t('common.home')}
              </Link>
              <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-gray-900 dark:text-white font-medium">{t('cart.page.title')}</span>
            </div>
          </div>
        </div>

        {/* Empty Cart State */}
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-20">
          <div className="text-center max-w-md mx-auto">
            <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mb-8 flex items-center justify-center">
              <svg
                className="w-16 h-16 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('cart.page.emptyTitle')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              {t('cart.page.emptyMessage')}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {t('cart.page.startShopping')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <Link href="/" className="hover:text-[#ec3137] transition-colors">
              {t('common.home')}
            </Link>
            <svg className="w-4 h-4 mx-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">{t('cart.page.title')}</span>
          </div>
        </div>
      </div>

      {/* Page Header with Select All */}
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            {/* Select All */}
            <div className="flex items-center gap-3">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={toggleSelectAll}
                    className="w-5 h-5 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137] focus:ring-offset-0 cursor-pointer"
                  />
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                  {t('cart.page.selectAll')} ({getCartCount()} {getCartCount() === 1 ? t('cart.page.item') : t('cart.page.items')})
                </span>
              </label>
            </div>

            {/* Total Display */}
            <div className="flex items-center gap-2 text-right">
              <span className="text-gray-700 dark:text-gray-300 font-medium">{t('cart.page.yourTotal')}</span>
              {hasDiscount && (
                <span className="text-lg text-red-600 dark:text-red-400 line-through font-semibold">
                  ৳{originalTotal.toLocaleString()}
                </span>
              )}
              <span className="text-2xl font-bold text-[#ec3137]">
                ৳{subtotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-2">
            {cartItems.map((item, index) => {
              const isSelected = selectedItems.has(item.product.id);

              return (
                <div
                  key={item.id}
                  className={`bg-white dark:bg-[#0a0a0a] border ${
                    isSelected
                      ? 'border-[#ec3137] shadow-sm'
                      : 'border-gray-200 dark:border-gray-800'
                  } p-3 sm:p-4 transition-all duration-300 animate-slideIn rounded-lg`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex gap-3">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 pt-0.5">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleItemSelection(item.product.id)}
                        className="w-4 h-4 text-[#ec3137] border-2 border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-[#ec3137] focus:ring-offset-0 cursor-pointer"
                      />
                    </div>

                    {/* Product Image */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="flex-shrink-0 group"
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 overflow-hidden rounded-md">
                        <Image
                          src={item.product.variant_image || item.product.image || '/placeholder-image.jpg'}
                          alt={getLocalizedNameForProduct(item.product) || 'Product'}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 640px) 64px, 80px"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link href={`/products/${item.product.slug}`}>
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white hover:text-[#ec3137] transition-colors line-clamp-1 leading-tight">
                            {getLocalizedNameForProduct(item.product)}
                          </h3>
                          {item.product.variant_name && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                              {item.product.variant_name}
                            </p>
                          )}
                        </Link>
                        {/* Remove Button - Desktop */}
                        <button
                          onClick={() => handleDeleteClick(item.id, getLocalizedNameForProduct(item.product) || 'Product')}
                          className="hidden sm:flex flex-shrink-0 p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          aria-label="Remove item"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center justify-between gap-3 mt-1.5">
                        {/* Price */}
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-sm sm:text-base font-bold text-[#ec3137]">
                            ৳{(item.product.price || 0).toLocaleString()}
                          </span>
                          {item.product.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">
                              ৳{(item.product.originalPrice || 0).toLocaleString()}
                            </span>
                          )}
                        </div>

                        {/* Quantity + Subtotal */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:border-[#ec3137] text-gray-600 dark:text-gray-300 transition-colors rounded"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                            </svg>
                          </button>

                          <span className="w-6 text-center font-semibold text-gray-900 dark:text-white text-sm">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= (item.product.stock || 999)}
                            className="w-6 h-6 flex items-center justify-center border border-gray-300 dark:border-gray-600 hover:border-[#ec3137] text-gray-600 dark:text-gray-300 transition-colors disabled:opacity-40 disabled:cursor-not-allowed rounded"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                          </button>

                          {/* Subtotal - Desktop */}
                          <span className="hidden md:inline ml-2 text-sm font-bold text-gray-900 dark:text-white">
                            ৳{((item.product.price || 0) * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Stock Warning */}
                      {item.quantity >= (item.product.stock || 999) && (
                        <p className="text-[10px] text-orange-600 dark:text-orange-400 mt-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {t('cart.page.only')} {item.product.stock} {t('cart.page.available')}
                        </p>
                      )}

                      {/* Mobile Remove Button */}
                      <button
                        onClick={() => handleDeleteClick(item.id, getLocalizedNameForProduct(item.product) || 'Product')}
                        className="sm:hidden mt-2 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        {t('cart.page.remove')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Continue Shopping */}
            <div className="pt-4">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-semibold transition-all duration-300 transform hover:scale-[1.02] rounded"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {t('cart.page.continueShopping')}
              </Link>
            </div>

            {/* Cross-Sell Section */}
            <CrossSellSection />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#0a0a0a] border-2 border-gray-200 dark:border-gray-800 sticky top-24 rounded-lg overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#ec3137] to-[#8a0f12] text-white p-6">
                <h2 className="text-2xl font-bold">{t('cart.page.orderSummary')}</h2>
                <p className="text-sm text-white/90 mt-1">
                  {getSelectedCount()} {t('cart.page.selected')} {getSelectedCount() === 1 ? t('cart.page.item') : t('cart.page.items')}
                </p>
              </div>

              <div className="p-6">
                {selectedItems.size === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-600 dark:text-gray-400">
                      {t('cart.page.noItemsSelected')}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Summary Items */}
                    <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>{t('cart.page.subtotal')} ({getSelectedCount()} {getSelectedCount() === 1 ? t('cart.page.item') : t('cart.page.items')})</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          <AnimatedCounter
                            value={subtotal}
                            prefix="৳"
                            duration={600}
                          />
                        </span>
                      </div>
                      {hasDiscount && (
                        <div className="flex justify-between text-sm text-green-600 dark:text-green-400">
                          <span>{t('cart.page.productDiscount')}</span>
                          <span className="font-semibold">
                            -<AnimatedCounter
                              value={originalTotal - subtotal}
                              prefix="৳"
                              duration={600}
                            />
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>
                          <span>{t('cart.page.shipping')}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            (Calculated at checkout based on location)
                          </span>
                        </span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {t('cart.page.calculatedAtCheckout')}
                        </span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">{t('cart.page.subtotal')}</span>
                        <div className="text-right">
                          {hasDiscount && (
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                              ৳{originalTotal.toLocaleString()}
                            </p>
                          )}
                          <span className="text-3xl font-bold text-[#ec3137]">
                            <AnimatedCounter
                              value={subtotal}
                              prefix="৳"
                              duration={600}
                            />
                          </span>
                          {hasDiscount && (
                            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                              {t('cart.page.youSaved')} <AnimatedCounter
                                value={originalTotal - subtotal}
                                prefix="৳"
                                duration={600}
                              />!
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        * Delivery charge will be calculated at checkout based on your location
                      </p>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={() => router.push('/checkout')}
                      disabled={selectedItems.size === 0}
                      className="w-full py-4 bg-gradient-to-r from-[#ec3137] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#ec3137] text-white font-bold text-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg transform hover:scale-[1.02] rounded disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                    >
                      <span>{t('cart.page.proceedToCheckout')}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>

                    {/* Trust Badges */}
                    <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{t('cart.page.secureCheckout')}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {t('cart.page.freeShippingOver')} ৳{shippingThreshold.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">{t('cart.page.easyReturns')}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        productName={itemToDelete?.name || ''}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
