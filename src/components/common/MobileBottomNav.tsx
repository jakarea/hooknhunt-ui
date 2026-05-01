'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useTranslation } from 'react-i18next';

/**
 * MobileBottomNav - Bottom navigation bar for mobile devices
 * Thumb-zone optimized quick access to key sections
 */
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { getCartCount } = useCart();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = getCartCount();

  const navItems = [
    {
      href: '/',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Home',
    },
    {
      href: '/products',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      label: 'Search',
    },
    {
      href: '/cart',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      label: 'Cart',
      badge: cartCount > 0 ? cartCount : null,
    },
    {
      href: '/account',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Account',
    },
  ];

  // Don't render on desktop or during SSR
  if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
    return null;
  }

  if (!mounted) return null;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800 z-50 pb-safe">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex flex-col items-center justify-center
                min-w-[64px] min-h-[56px] px-2 py-1
                transition-colors duration-200
                ${isActive(item.href)
                  ? 'text-[#ec3137]'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              {/* Badge for cart */}
              {item.badge && (
                <span className="absolute top-1 right-2 flex h-5 w-5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ec3137] opacity-75"></span>
                  <span className="relative inline-flex rounded-full bg-[#ec3137] text-white text-[10px] font-bold items-center justify-center h-5 w-5">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                </span>
              )}

              {/* Icon */}
              <div className={isActive(item.href) ? 'scale-110' : ''}>
                {item.icon}
              </div>

              {/* Label */}
              <span className="text-[10px] sm:text-xs font-medium mt-0.5">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="lg:hidden h-16" />
    </>
  );
}
