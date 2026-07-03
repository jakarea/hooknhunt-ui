'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useCategoryStore } from '@/stores/categoryStore';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearchModal } from '@/contexts/SearchModalContext';
import LanguageSwitcher from './LanguageSwitcher';
import { getCategoryTranslationKey } from '@/utils/categoryTranslations';

export default function Header() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isNavSticky, setIsNavSticky] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

  const categories = useCategoryStore((s) => s.categories);
  const fetchCategories = useCategoryStore((s) => s.fetchCategories);
  const { getCartCount, toggleCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const { toggleTheme } = useTheme();
  const { openSearchModal } = useSearchModal();

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch categories once from API (store deduplicates)
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const handleScroll = () => {
      setIsNavSticky(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/hot-deals', label: t('nav.hotDeals'), icon: '🔥' },
    { href: '/products', label: t('nav.allProduct'), icon: '🎣' },
  ];

  const navItemsAfterCategory = [
    { href: '/track-order', label: t('nav.trackOrder'), icon: '📦' },
    { href: '/reviews', label: t('nav.reviews'), icon: '⭐' },
    { href: '/contact', label: t('nav.contact'), icon: '📞' },
  ];

  return (
    <header className="bg-white dark:bg-[#0a0a0a] z-50">
      {/* Merged Header Section: All Elements in One Line */}
      <div className="bg-[#fee1e1] dark:bg-[#0a0a0a]">
        <div className="container px-3 md:px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4 py-3 sm:py-4">
            {/* Left: Logo */}
            <Link href="/" className="flex-shrink-0">
               <Image
                  src="/hook-and-hunt-logo.svg"
                  alt="Hook & Hunt"
                  width={150}
                  height={50}
                  className="h-9 sm:h-10 lg:h-12 w-auto"
                />
            </Link>

            {/* Welcome - Hidden on small screens */}
            {/* <div className="hidden lg:block text-sm text-gray-600 dark:text-gray-200 flex-shrink-0">
              {t('header.welcome')}
            </div> */}

            {/* Center: Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  readOnly
                  onClick={openSearchModal}
                  onFocus={openSearchModal}
                  placeholder={(t('header.search') || 'Search products') + ' ⌘K'}
                  className="w-full h-9 sm:h-10 pl-10 pr-12 text-sm border-2 border-gray-200 dark:border-gray-400 rounded-full focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/10 transition-all bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 cursor-pointer"
                />
                <div className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:flex items-center gap-0.5 text-gray-400">
                  <span className="text-xs font-medium">⌘</span>
                  <span className="text-xs font-bold">K</span>
                </div>
              </div>
            </div>

            {/* Right: Top Bar Elements + Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Phone - Desktop */}
              <a href="tel:8801975244202" className="hidden xl:flex items-center gap-1.5 text-sm text-white bg-[#ec3137] px-3 py-1.5 rounded-lg hover:bg-[#c5282d] transition-colors">
                <svg className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden 2xl:inline font-medium text-white">8801975244202</span>
              </a>

              {/* Language Switcher - Desktop */}
              <div className="hidden lg:block">
                <LanguageSwitcher />
              </div>

               {/* Theme Toggle - Desktop */}
               <button
                onClick={toggleTheme}
                className="hidden lg:flex w-9 h-9 bg-[#ec3137]/90 hover:bg-[#ec3137]/70 transition-colors rounded-lg items-center justify-center"
                aria-label="Toggle theme"
              > 
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </button>
              {/* Account */}
              {mounted && !isLoading && (
                <Link
                  href={isAuthenticated ? "/account" : "/login"}
                  className="hidden lg:flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3 py-1.5 sm:py-2 rounded-lg bg-[#ec3137]/90 hover:bg-[#ec3137]/70 transition-colors"
                >
                  <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium text-white">
                    {isAuthenticated ? t('header.account') : t('header.login')}
                  </span>
                </Link>
              )}

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#8a0f12] hover:bg-[#6b0c0e] transition-colors"
              >
                <svg className="w-4 sm:w-5 h-4 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {mounted && getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-white text-[#8a0f12] text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-sm">
                    {getCartCount()}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 bg-[#ec3137] hover:bg-[#c5282d] rounded-lg flex items-center justify-center transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu - Desktop */}
      <div className={`hidden lg:block bg-[#bc1215] dark:bg-[#1a1a1a] transition-all py-1 duration-300 ${isNavSticky ? 'sticky top-0 z-40 shadow-md' : ''}`}>
        <div className="container px-3 md:px-4">
          <nav className="flex items-center justify-start gap-5 sm:gap-7 lg:gap-10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm md:text-base font-medium text-white hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                {/* {item.icon && <span className="text-base">{item.icon}</span>} */}
                {item.label}
              </Link>
            ))}

            {/* Category Dropdown - After All Product, with Hover */}
            <div
              className="relative group"
              onMouseEnter={() => setIsCategoryDropdownOpen(true)}
              onMouseLeave={() => setIsCategoryDropdownOpen(false)}
            >
              <button className="py-2 text-sm md:text-base font-medium text-white hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5">
                {/* <span className="text-base">📁</span> */}
                {t('nav.category')}
                <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu - Shows on Hover */}
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#1a1a1a] rounded-lg shadow-lg border border-gray-200 dark:border-gray-400 py-2 z-50 transition-opacity duration-200 ${isCategoryDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <div className="max-h-[400px] overflow-y-auto">
                  {categories.map((category) => {
                    const imageUrl = category.imageUrl || '';
                    return (
                      <Link
                        key={category.id}
                        href={`/products?category=${category.slug}`}
                        className="flex items-center gap-3 px-4 py-2 text-sm md:text-base text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#2a2a2a] hover:text-[#bc1215] transition-colors"
                      >
                        <span className="relative w-6 h-6 flex-shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-[#1a1a1a]">
                          {imageUrl && (
                            <Image
                              src={imageUrl}
                              alt={t(getCategoryTranslationKey(category))}
                              fill
                              className="object-cover"
                              sizes="24px"
                            />
                          )}
                        </span>
                        <span className="truncate">{t(getCategoryTranslationKey(category))}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Track Order & Contact - After Category */}
            {navItemsAfterCategory.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="py-2 text-sm md:text-base font-medium text-white hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5"
              >
                {/* {item.icon && <span className="text-base">{item.icon}</span>} */}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <>
        {/* Backdrop Overlay */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-64 max-w-[80vw] bg-white dark:bg-[#0a0a0a] z-[100] transform transition-transform duration-300 ease-out lg:hidden shadow-2xl ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-400 bg-[#fee1e1] dark:bg-[#1a1a1a]">
            <Link href="/" className="flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
              <Image
                src="/hook-and-hunt-logo.svg"
                alt="Hook & Hunt"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/80 hover:bg-white transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="overflow-y-auto h-full pb-20 px-3">
            {/* Mobile Search */}
            <div className="py-4 border-b border-gray-100 dark:border-gray-400">
              <div className="relative flex items-center">
                <input
                  type="text"
                  readOnly
                  onClick={openSearchModal}
                  onFocus={openSearchModal}
                  placeholder={(t('header.search') || 'Search') + ' ⌘K'}
                  className="w-full h-10 pl-10 pr-4 text-sm border border-gray-200 dark:border-gray-400 rounded-lg focus:outline-none focus:border-[#bc1215] focus:ring-2 focus:ring-[#bc1215]/10 transition-all bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 cursor-pointer"
                />
                <svg className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* User Actions - Mobile */}
            <div className="py-3 border-b border-gray-100 dark:border-gray-400 flex items-center gap-2">
              {mounted && !isLoading && (
                <Link
                  href={isAuthenticated ? "/account" : "/login"}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#ec3137] hover:bg-[#c5282d] transition-colors text-white font-medium text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {isAuthenticated ? t('header.account') : t('header.login')}
                </Link>
              )}
              <div className="flex gap-2">
                <button
                  onClick={toggleTheme}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] transition-colors"
                  aria-label="Toggle theme"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </button>
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}

              {/* Collapsible Categories */}
              <div className="pt-2">
                <button
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                  className="w-full flex items-center justify-between px-3 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors rounded-lg"
                >
                  <span>{t('nav.category')}</span>
                  <svg
                    className={`w-5 h-5 transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isMobileCategoryOpen ? 'max-h-96 mt-1' : 'max-h-0'
                  }`}
                >
                  <div className="px-2 py-2 space-y-1 bg-gray-50 dark:bg-[#1a1a1a] rounded-lg mx-3">
                    {categories.map((category) => {
                      const imageUrl = category.imageUrl || '';
                      return (
                        <Link
                          key={category.id}
                          href={`/products?category=${category.slug}`}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-white dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors rounded-md"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <span className="relative w-6 h-6 flex-shrink-0 rounded overflow-hidden bg-gray-200 dark:bg-[#1a1a1a]">
                            {imageUrl && (
                              <Image
                                src={imageUrl}
                                alt={t(getCategoryTranslationKey(category))}
                                fill
                                className="object-cover"
                                sizes="24px"
                              />
                            )}
                          </span>
                          <span className="truncate">{t(getCategoryTranslationKey(category))}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Track Order & Contact - After Categories */}
              <div className="pt-2 border-t border-gray-100 dark:border-gray-400 mt-2">
                {navItemsAfterCategory.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#1a1a1a] hover:text-[#bc1215] transition-colors rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Contact Info - Bottom */}
            <div className="py-4 mt-auto border-t border-gray-100 dark:border-gray-400">
              <a
                href="tel:8801975244202"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#ec3137] hover:bg-[#c5282d] text-white rounded-lg transition-colors font-medium mb-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                8801975244202
              </a>
              <a
                href="https://wa.me/8801975244202"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </>
    </header>
  );
}
