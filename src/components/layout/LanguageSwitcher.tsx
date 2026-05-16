'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeLanguage('bn')}
        className={`px-2 py-0.5 text-xs font-medium transition-colors ${
          language === 'bn'
            ? 'bg-white text-[#bc1215]'
            : 'bg-transparent text-[#bc1215]/70 hover:text-[#bc1215] hover:bg-white/20'
        }`}
      >
        বাংলা
      </button>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-0.5 text-xs font-medium transition-colors ${
          language === 'en'
            ? 'bg-white text-[#bc1215]'
            : 'bg-transparent text-[#bc1215]/70 hover:text-[#bc1215] hover:bg-white/20'
        }`}
      >
        EN
      </button>
    </div>
  );
}
