'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Category } from '@/types';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

type ActiveGateway = 'sslcommerz' | 'eps' | null;

export default function Footer() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeGateway, setActiveGateway] = useState<ActiveGateway>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const api = (await import('@/lib/api')).default;

        // Add 10-second timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Categories fetch timeout')), 10000);
        });

        // Race between API call and timeout
        const response = await Promise.race([api.getCategories(), timeoutPromise]);

        if (response && (response as { data?: { data?: Category[] } }).data?.data) {
          // Sort by sort_order ascending and take top 6
          const sortedCategories = (response as { data: { data: Category[] } }).data.data
            .sort((a: Category, b: Category) => (a.sort_order || 0) - (b.sort_order || 0))
            .slice(0, 6)
            .map((cat: Category) => ({
              ...cat,
              name: cat.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            }));
          setCategories(sortedCategories);
        }
      } catch (error) {
        // Better error logging that handles all error types
        const errorDetails = {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as { status?: number })?.status,
          name: error instanceof Error ? error.name : undefined,
          stack: error instanceof Error ? error.stack : undefined,
          raw: error
        };
        console.error('Failed to fetch categories:', errorDetails);
        // Graceful degradation: set empty categories instead of keeping loading state
        setCategories([]);
      } finally {
        // Always set loading to false
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch active payment gateway
  useEffect(() => {
    const fetchActiveGateway = async () => {
      try {
        const api = (await import('@/lib/api')).default;

        // Add 10-second timeout to prevent hanging
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Payment gateway fetch timeout')), 10000);
        });

        // Race between API call and timeout
        const response = await Promise.race([api.getActivePaymentGateway(), timeoutPromise]);

        if (response && (response as { data?: { activeGateway?: ActiveGateway } }).data?.activeGateway) {
          setActiveGateway((response as { data: { activeGateway: ActiveGateway } }).data.activeGateway);
        }
      } catch (error) {
        // Better error logging that handles all error types
        const errorDetails = {
          message: error instanceof Error ? error.message : 'Unknown error',
          status: (error as { status?: number })?.status,
          name: error instanceof Error ? error.name : undefined,
          stack: error instanceof Error ? error.stack : undefined,
          raw: error
        };
        console.error('Failed to fetch active payment gateway:', errorDetails);
        // Graceful degradation: keep null (will show default SSLCommerz logo)
        setActiveGateway(null);
      }
    };

    fetchActiveGateway();
  }, []);

  return (
    <footer className="bg-black text-white transition-colors duration-200 overflow-x-hidden" suppressHydrationWarning>
      {/* Main Footer Content */}
      <div className="max-w-[1192px] mx-auto px-3 md:px-4 py-8 md:py-12" suppressHydrationWarning>
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-x-2 gap-y-6 md:gap-x-8 md:gap-y-8 lg:gap-x-12 lg:gap-y-12" suppressHydrationWarning>
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1" suppressHydrationWarning>
            <Link href="/" className="inline-block mb-3 md:mb-5">
             <Image
                  src="/hook-and-hunt-logo.svg"
                  alt="Hook & Hunt"
                  width={140}
                  height={46}
                  className="h-8 md:h-11 w-auto"
                />
            </Link>
            <p className="text-sm md:text-[17px] text-white/80 mb-3 md:mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-2 md:gap-3 mt-4 md:mt-6" suppressHydrationWarning>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group flex-shrink-0"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group flex-shrink-0"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#ec3137] transition-colors group flex-shrink-0"
              >
                <svg className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product Categories */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-bold text-sm md:text-[17px] mb-3 md:mb-5">{t('footer.categories')}</h3>
            {loading ? (
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <ul className="space-y-2 md:space-y-3">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/products?category=${category.slug}`}
                      className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group"
                    >
                      <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                      <span className="truncate">{t(getCategoryTranslationKey(category))}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Customer Service */}
          <div suppressHydrationWarning>
            <h3 className="text-white font-bold text-sm md:text-[17px] mb-3 md:mb-5">{t('footer.customerService')}</h3>
            <ul className="space-y-2 md:space-y-3">
              <li>
                <Link href="/about-us" className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  {t('footer.aboutUs')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  {t('footer.contactUs')}
                </Link>
              </li>
              <li>
                <Link href="/delivery-policy" className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  {t('footer.shipping')}
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  {t('footer.returns')}
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-sm md:text-[17px] text-white/70 hover:text-white transition-colors flex items-center group">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/30 rounded-full mr-1.5 md:mr-2 group-hover:bg-white transition-colors flex-shrink-0"></span>
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-1" suppressHydrationWarning>
            <h3 className="text-white font-bold text-sm md:text-[17px] mb-3 md:mb-5">{t('footer.getInTouch')}</h3>
            <ul className="space-y-3 md:space-y-4">
              <li className="flex items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm md:text-[17px] mb-0.5">{t('footer.location')}</p>
                  <span className="text-white/70 text-sm md:text-[17px]">{t('footer.address')}</span>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm md:text-[17px] mb-0.5">{t('footer.phone')}</p>
                  <a href="tel:+8801975244202" className="text-white/70 text-sm md:text-[17px] hover:text-white transition-colors">
                    {t('footer.phoneNumber')}
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-[#ec3137]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-medium text-sm md:text-[17px] mb-0.5">{t('footer.email')}</p>
                  <a href="mailto:Support@hooknhunt.com" className="text-white/70 text-sm md:text-[17px] hover:text-white transition-colors break-all">
                    {t('footer.emailAddress')}
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10" suppressHydrationWarning>
        <div className="max-w-[1192px] mx-auto px-3 md:px-4 py-4 md:py-6" suppressHydrationWarning>
          {/* Payment Banner */}
          <div className="flex justify-center mb-4" suppressHydrationWarning>
            <img
              src={activeGateway === 'eps' ? '/eps-payment-all-logo.png' : '/SSLCommerz-Pay-With-logo-All-Size-01.png'}
              alt="Payment Methods"
              className="h-auto w-full"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4" suppressHydrationWarning>
            <p className="text-xs md:text-sm lg:text-[17px] text-white/70 text-center md:text-left">
              &copy; {t('footer.copyright')}
            </p>
            <p className="text-xs md:text-sm text-white/60 text-center md:text-right">
              Trade License Number: 21611
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
