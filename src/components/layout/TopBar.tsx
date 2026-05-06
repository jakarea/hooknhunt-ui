'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSwitcher from './LanguageSwitcher';
import SocialLinks from './SocialLinks';

export default function TopBar() {
  const { t } = useTranslation();
  const { toggleTheme } = useTheme();

  return (
    <div className="bg-[#bc1215] text-white">
      <div className="container">
        <div className="flex justify-between items-center h-9 text-sm">
          {/* Tagline */}
          <div className="flex items-center">
            <span className="hidden sm:inline">{t('header.welcome')}</span>
            <span className="sm:hidden">{t('header.welcomeShort')}</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Phone */}
            <a href="tel:8801975244202" className="flex items-center hover:opacity-80 transition-opacity">
              <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span className="hidden sm:inline">8801975244202</span>
            </a>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="hover:opacity-80 transition-opacity"
              aria-label="Toggle theme"
            >
              <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            </button>

            {/* Social Links */}
            <SocialLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
