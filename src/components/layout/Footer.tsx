'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '../../../node_modules/react-i18next';
import { Category } from '@/types';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

export default function Footer() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const api = (await import('@/lib/api')).default;
        const response = await api.getCategories();
        if (response.data?.data) {
          // Sort by sort_order ascending and take top 6
          const sortedCategories = response.data.data
            .sort((a: Category, b: Category) => (a.sort_order || 0) - (b.sort_order || 0))
            .slice(0, 6)
            .map((cat: Category) => ({
              ...cat,
              name: cat.name.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
            }));
          setCategories(sortedCategories);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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
          {/* Trade License Number */}
          <div className="text-center mb-4" suppressHydrationWarning>
            <p className="text-xs md:text-sm text-white/60">
              Trade License Number: Real Trade License Number here
            </p>
          </div>

          {/* Payment Banner */}
          <div className="flex justify-center mb-4" suppressHydrationWarning>
            <img
              src="data:image/webp+xml;base64,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"
              alt="Payment Methods"
              className="h-auto w-full max-w-md object-contain"
            />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4" suppressHydrationWarning>
            <p className="text-xs md:text-sm lg:text-[17px] text-white/70 text-center md:text-left">
              &copy; {t('footer.copyright')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
