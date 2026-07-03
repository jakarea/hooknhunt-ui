'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import api from '@/lib/api';
import { useTranslation } from 'react-i18next';

interface ThankYouVariant {
  id: number;
  variantName: string;
  price: number;
  offerPrice: number | null;
  stock: number;
}

interface ThankYouProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail: { id: number; fullUrl: string; alt: string } | null;
  variants: ThankYouVariant[];
}

type GiftStatus = 'loading' | 'offering' | 'adding' | 'added' | 'expired' | 'error' | 'unavailable';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { t } = useTranslation();

  const [mounted, setMounted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  // Gift section state
  const [giftProduct, setGiftProduct] = useState<ThankYouProduct | null>(null);
  const [giftStatus, setGiftStatus] = useState<GiftStatus>('loading');
  const [giftError, setGiftError] = useState('');
  const [timeLeft, setTimeLeft] = useState(60); // 60-second countdown

  const invoiceNo = searchParams.get('invoice') || '';
  const orderTotal = parseFloat(searchParams.get('total') || '0');
  const customerName = searchParams.get('name') || 'Customer';
  const paymentStatus = searchParams.get('payment_status') || '';
  const gateway = searchParams.get('gateway') || '';

  // Payment failure detection
  const isPaymentFailed = paymentStatus === 'failed';
  const isSSLCommerz = gateway === 'sslcommerz';
  const isEPS = gateway === 'eps';

  useEffect(() => {
    setMounted(true);
    // Only clear cart if payment succeeded (not failed)
    if (!isPaymentFailed) {
      clearCart();
    }

    const confettiTimer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(confettiTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPaymentFailed]);

  // Fetch thank-you product
  useEffect(() => {
    let cancelled = false;

    const fetchGift = async () => {
      try {
        const res = await api.getThankYouProducts(1);
        if (cancelled) return;

        const products = (res as { data?: ThankYouProduct[] }).data;
        if (products && products.length > 0) {
          setGiftProduct(products[0]);
          setGiftStatus('offering');
        } else {
          setGiftStatus('unavailable');
        }
      } catch {
        if (!cancelled) setGiftStatus('unavailable');
      }
    };

    fetchGift();
    return () => { cancelled = true; };
  }, []);

  // 60-second countdown timer for exclusive offer
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);
  const statusRef = useRef(giftStatus);

  // Keep statusRef in sync
  useEffect(() => {
    statusRef.current = giftStatus;
  }, [giftStatus]);

  useEffect(() => {
    // Only start if we're in offering state and not already running
    if (isActiveRef.current || giftStatus !== 'offering') return;

    isActiveRef.current = true;

    intervalRef.current = setInterval(() => {
      if (statusRef.current !== 'offering') {
        clearInterval(intervalRef.current!);
        isActiveRef.current = false;
        return;
      }

      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          isActiveRef.current = false;
          setGiftStatus('expired');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isActiveRef.current = false;
    };
    // Empty deps - only run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddGift = async () => {
    if (!giftProduct || !invoiceNo) return;

    setGiftStatus('adding');
    try {
      const res = await api.addThankYouToOrder(invoiceNo, giftProduct.id);
      const response = res as { status?: boolean; message?: string };

      if (response.status === false) {
        setGiftError(response.message || 'Failed to add product');
        setGiftStatus('error');
        return;
      }

      setGiftStatus('added');
    } catch (err: unknown) {
      const apiErr = err as { status?: number; message?: string };
      if (apiErr.status === 410) {
        setGiftStatus('expired');
        return;
      }
      setGiftError(apiErr.message || 'Something went wrong');
      setGiftStatus('error');
    }
  };

  if (!mounted) return null;

  const giftVariant = giftProduct?.variants?.[0];
  const giftOriginalPrice = giftVariant?.price ?? 0;
  const giftOfferPrice = giftVariant?.offerPrice ?? 0;
  const hasOffer = giftOfferPrice > 0 && giftOfferPrice < giftOriginalPrice;
  const giftDisplayPrice = hasOffer ? giftOfferPrice : giftOriginalPrice;
  const giftDiscountPct = hasOffer
    ? Math.round(((giftOriginalPrice - giftOfferPrice) / giftOriginalPrice) * 100)
    : 0;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-[#0a0a0a] dark:to-gray-900 min-h-screen relative overflow-hidden">
      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-10%',
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <div
                className={`w-3 h-3 ${['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'][Math.floor(Math.random() * 5)]}`}
                style={{ transform: `rotate(${Math.random() * 360}deg)` }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 xl:px-12 py-12">
        {/* Success Message - with payment failure detection */}
        <div className="text-center mb-10 animate-slideUp">
          <div className="relative inline-block mb-6">
            <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center animate-scaleIn shadow-2xl">
              <svg className="w-16 h-16 text-white animate-checkmark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {t('orderSuccess.title', { name: customerName })}
          </h1>

          {/* SSL Commerz - Payment Failed */}
          {isPaymentFailed && isSSLCommerz && (
            <>
              <p className="text-lg text-amber-600 dark:text-amber-400 mb-1 font-semibold">
                Payment collection pending
              </p>
              <p className="text-gray-600 dark:text-gray-200 mb-2">
                Your payment via SSLCommerz could not be processed. We'll contact you shortly to collect payment via cash on delivery.
              </p>
            </>
          )}

          {/* EPS - Payment Failed */}
          {isPaymentFailed && isEPS && (
            <>
              <p className="text-lg text-amber-600 dark:text-amber-400 mb-1 font-semibold">
                Payment collection pending
              </p>
              <p className="text-gray-600 dark:text-gray-200 mb-2">
                Your payment via EPS could not be processed. We'll contact you shortly to collect payment via cash on delivery.
              </p>
            </>
          )}

          {/* Normal Success - No payment failure */}
          {!isPaymentFailed && (
            <p className="text-lg text-gray-600 dark:text-gray-200 mb-1">
              {t('orderSuccess.confirmed')}
            </p>
          )}

          {invoiceNo && (
            <p className="text-base text-gray-600 dark:text-gray-200">
              {t('orderSuccess.invoice')}: <span className="font-bold text-[#ec3137]">{invoiceNo}</span>
            </p>
          )}
        </div>

        {/* Order Summary Card */}
        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-500 rounded-xl p-6 mb-8 shadow-lg animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('orderSuccess.summary')}</h2>

            {/* SSL Commerz - Payment Failed Status */}
            {isPaymentFailed && isSSLCommerz && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Payment pending (SSLCommerz failed)</span>
              </div>
            )}

            {/* EPS - Payment Failed Status */}
            {isPaymentFailed && isEPS && (
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-sm">Payment pending (EPS failed)</span>
              </div>
            )}

            {/* Normal Success Status */}
            {!isPaymentFailed && (
              <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-sm">{t('orderSuccess.confirmedStatus')}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-xs text-gray-500 dark:text-gray-200 mb-0.5">{t('orderSuccess.total')}</p>
              <p className="text-lg font-bold text-[#ec3137]">৳{orderTotal.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-gray-500 dark:text-gray-200 mb-0.5">{t('orderSuccess.delivery')}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{t('orderSuccess.deliveryDays')}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 dark:bg-[#0f0f0f] rounded-lg">
              <svg className="w-8 h-8 mx-auto mb-2 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-gray-500 dark:text-gray-200 mb-0.5">{t('orderSuccess.email')}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{t('orderSuccess.sent')}</p>
            </div>
          </div>
        </div>

        {/* Exclusive Offer Section — only if payment succeeded and product available */}
        {!isPaymentFailed && (giftStatus === 'offering' || giftStatus === 'adding' || giftStatus === 'added' || giftStatus === 'expired' || giftStatus === 'error') && giftProduct && (
          <div className="border-2 border-amber-300 dark:border-amber-800 rounded-xl p-5 mb-8 bg-amber-50/50 dark:bg-amber-900/10 animate-slideUp" style={{ animationDelay: '0.3s' }}>

            {/* Added state */}
            {giftStatus === 'added' ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-green-900 dark:text-green-100 mb-1">
                  {t('orderSuccess.addedToOrder')}
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  {t('orderSuccess.addedToOrderDesc')}
                </p>
              </div>
            ) : giftStatus === 'expired' ? (
              /* Expired state */
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-500 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-500 dark:text-gray-200 mb-1">
                  {t('orderSuccess.offerExpired')}
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {t('orderSuccess.offerExpiredDesc')}
                </p>
              </div>
            ) : (
              <>
                {/* Header with countdown timer */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🔥</span>
                    <div>
                      <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 uppercase tracking-wide">
                        {t('orderSuccess.specialOffer')}
                      </h3>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {t('orderSuccess.onlyThisPage')}
                      </p>
                    </div>
                  </div>
                  {/* Countdown Timer */}
                  <div className={`border rounded-lg px-3 py-1.5 text-center ${
                    timeLeft <= 10
                      ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800'
                      : 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700'
                  }`}>
                    <p className="text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400">{t('orderSuccess.offerEndsIn')}</p>
                    <p className={`text-xl font-bold font-mono ${
                      timeLeft <= 10 ? 'text-red-600 animate-pulse' : 'text-amber-700 dark:text-amber-300'
                    }`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-[#0a0a0a] border border-amber-200 dark:border-amber-900 rounded-lg p-3">
                  {/* Product Image */}
                  {giftProduct.thumbnail?.fullUrl ? (
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                      <Image
                        src={giftProduct.thumbnail.fullUrl}
                        alt={giftProduct.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                        unoptimized
                      />
                      {hasOffer && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#ec3137] text-white text-[10px] font-bold rounded">
                          -{giftDiscountPct}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg bg-gray-100 dark:bg-[#1a1a1a] flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2 mb-1">
                      {giftProduct.name}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-[#ec3137]">
                        ৳{giftDisplayPrice.toLocaleString()}
                      </span>
                      {hasOffer && (
                        <span className="text-sm text-gray-400 line-through">
                          ৳{giftOriginalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {giftStatus === 'offering' && (
                      <button
                        onClick={handleAddGift}
                        className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold rounded-lg transition-colors min-h-[44px]"
                      >
                        {t('orderSuccess.addToOrder')} — ৳{giftDisplayPrice.toLocaleString()}
                      </button>
                    )}

                    {giftStatus === 'adding' && (
                      <button disabled className="px-4 py-2.5 bg-amber-400 text-white text-sm font-bold rounded-lg min-h-[44px] flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {t('orderSuccess.adding')}
                      </button>
                    )}

                    {giftStatus === 'error' && (
                      <div className="text-right">
                        <p className="text-red-500 text-xs mb-1 max-w-[160px]">{giftError}</p>
                        <button
                          onClick={handleAddGift}
                          className="text-amber-600 dark:text-amber-400 underline text-sm font-medium"
                        >
                          {t('orderSuccess.tryAgain')}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Next Steps */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-500 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('orderSuccess.trackOrder')}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-200 mb-3">{t('orderSuccess.trackOrderDesc')}</p>
            <Link href="/track-order" className="text-[#ec3137] hover:underline font-semibold text-xs">{t('orderSuccess.trackOrderLink')}</Link>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-500 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('orderSuccess.continueShopping')}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-200 mb-3">{t('orderSuccess.continueShoppingDesc')}</p>
            <Link href="/products" className="text-[#ec3137] hover:underline font-semibold text-xs">{t('orderSuccess.browseProducts')}</Link>
          </div>

          <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-500 rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full mx-auto mb-3 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">{t('orderSuccess.needHelp')}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-200 mb-3">{t('orderSuccess.needHelpDesc')}</p>
            <Link href="/contact" className="text-[#ec3137] hover:underline font-semibold text-xs">{t('orderSuccess.contactUs')}</Link>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 hover:bg-gray-900 dark:hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {t('orderSuccess.backToHome')}
          </Link>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes confetti {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes checkmark {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-confetti { animation: confetti linear forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
        .animate-scaleIn { animation: scaleIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
        .animate-checkmark { stroke-dasharray: 100; animation: checkmark 0.6s ease-out 0.3s forwards; }
      `}</style>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
