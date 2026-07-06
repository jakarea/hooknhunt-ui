'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import HeroSlider from '@/components/home/HeroSlider';
import TrendingProduct from '@/components/home/TrendingProduct';
import Categories from '@/components/home/Categories';
import RecentlySold from '@/components/home/RecentlySold';
import NewArrivals from '@/components/home/NewArrivals';
import RecomendedYou from '@/components/home/RecomendedYou';
import ReviewsSlider from '@/components/home/ReviewsSlider';


export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Hook & Hunt - Premium Fishing Accessories in Bangladesh</h1>

      <div className="bg-[#fee1e1] dark:bg-[#322020]">
        {/* Hero Slider - Full Screen */}
        <HeroSlider />


        {/* Dynamic Trending Products */}
        <TrendingProduct />

      {/* Categories - Minimalist Style */}
      <Categories />

      {/* Recently Sold - Social Proof & Trust */}
      <RecentlySold />

      {/* New Arrival - Fresh Content */}
      <NewArrivals />

      
      <RecomendedYou />

      {/* Customer Reviews - Soft Auto-Scrolling Slider */}
      <ReviewsSlider />

      {/* Features - Trust Indicators */}
      <section className="bg-gradient-to-br from-[#ec3137] to-[#8a0f12] text-white py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white dark:bg-[#2a2a2a] transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white dark:bg-[#2a2a2a] transform -rotate-45"></div>
        </div>

        <div className="container relative z-10 px-3 md:px-4">
          <div className="grid grid-cols-3 gap-2 md:gap-4 lg:gap-8">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-xl group-hover:bg-white dark:bg-[#2a2a2a]/30 transition-all duration-300 group-hover:shadow-2xl rounded-lg sm:rounded-xl">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-heading-lg font-extrabold mb-1 sm:mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.shipping.title')}</span>
              <p className="text-white/90 text-[10px] sm:text-xs md:text-sm lg:text-body-lg font-semibold">{t('home.features.shipping.featureDesc')}</p>
              <div className="w-8 h-0.5 sm:w-12 md:w-14 lg:w-16 bg-white dark:bg-[#2a2a2a]/40 mx-auto mt-2 sm:mt-3 lg:mt-4 group-hover:w-10 sm:group-hover:w-16 lg:group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-xl group-hover:bg-white dark:bg-[#2a2a2a]/30 transition-all duration-300 group-hover:shadow-2xl rounded-lg sm:rounded-xl">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-heading-lg font-extrabold mb-1 sm:mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.payment.title')}</span>
              <p className="text-white/90 text-[10px] sm:text-xs md:text-sm lg:text-body-lg font-semibold">{t('home.features.payment.featureDesc')}</p>
              <div className="w-8 h-0.5 sm:w-12 md:w-14 lg:w-16 bg-white dark:bg-[#2a2a2a]/40 mx-auto mt-2 sm:mt-3 lg:mt-4 group-hover:w-10 sm:group-hover:w-16 lg:group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 shadow-xl group-hover:bg-white dark:bg-[#2a2a2a]/30 transition-all duration-300 group-hover:shadow-2xl rounded-lg sm:rounded-xl">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 group-hover:scale-110 transition-transform duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-heading-lg font-extrabold mb-1 sm:mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.returns.title')}</span>
              <p className="text-white/90 text-[10px] sm:text-xs md:text-sm lg:text-body-lg font-semibold">{t('home.features.returns.featureDesc')}</p>
              <div className="w-8 h-0.5 sm:w-12 md:w-14 lg:w-16 bg-white dark:bg-[#2a2a2a]/40 mx-auto mt-2 sm:mt-3 lg:mt-4 group-hover:w-10 sm:group-hover:w-16 lg:group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
