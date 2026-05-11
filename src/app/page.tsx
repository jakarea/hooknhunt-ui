'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import HeroSlider from '@/components/home/HeroSlider';
import TrendingProduct from '@/components/home/TrendingProduct';
import Categories from '@/components/home/Categories';
import RecentlySold from '@/components/home/RecentlySold';
import FloatingActionButton from '@/components/common/FloatingActionButton';
import NewArrivals from '@/components/home/NewArrivals';
import RecomendedYou from '@/components/home/RecomendedYou';


export default function Home() {
  const { t } = useTranslation();

  return (
    <>
      {/* Hidden H1 for SEO */}
      <h1 className="sr-only">Hook & Hunt - Premium Fishing Accessories in Bangladesh</h1>

      <div className="bg-[#fee1e1]">
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

      {/* Customer Reviews - Trust & Social Proof */}
      <section className="bg-[#fee1e1] dark:bg-[#0f0f0f] py-10 md:py-14 transition-colors duration-200">
        <div className="container">
          {/* Left-aligned Header */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{t('home.reviews.title')}</h3>
          </div>

          {/* Horizontal Scrolling Reviews */}
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
               style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {/* Review 1 */}
            <div className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div className="relative bg-gradient-to-br from-[#8a0f12] to-[#6b0c0e] rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t('home.reviews.review1.text')}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-white relative z-10">
                  {t('home.reviews.review1.name')}
                </p>
              </div>
            </div>

            {/* Review 2 */}
            <div className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div className="relative bg-gradient-to-br from-[#8a0f12] to-[#6b0c0e] rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t('home.reviews.review2.text')}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-white relative z-10">
                  {t('home.reviews.review2.name')}
                </p>
              </div>
            </div>

            {/* Review 3 */}
            <div className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div className="relative bg-gradient-to-br from-[#8a0f12] to-[#6b0c0e] rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t('home.reviews.review3.text')}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-white relative z-10">
                  {t('home.reviews.review3.name')}
                </p>
              </div>
            </div>

            {/* Review 4 */}
            <div className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div className="relative bg-gradient-to-br from-[#8a0f12] to-[#6b0c0e] rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t('home.reviews.review1.text')}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-white relative z-10">
                  {t('home.reviews.review1.name')}
                </p>
              </div>
            </div>

            {/* Review 5 */}
            <div className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div className="relative bg-gradient-to-br from-[#8a0f12] to-[#6b0c0e] rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t('home.reviews.review2.text')}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-white relative z-10">
                  {t('home.reviews.review2.name')}
                </p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>

      {/* Features - Trust Indicators */}
      <section className="bg-gradient-to-br from-[#ec3137] to-[#8a0f12] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white transform -rotate-45"></div>
        </div>

        <div className="container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
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
              <span className="text-heading-lg font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.shipping.title')}</span>
              <p className="text-white/90 text-body-lg font-semibold">{t('home.features.shipping.featureDesc')}</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
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
              <span className="text-heading-lg font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.payment.title')}</span>
              <p className="text-white/90 text-body-lg font-semibold">{t('home.features.payment.featureDesc')}</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>

            <div className="group text-center transform hover:scale-105 transition-all duration-500">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:bg-white/30 transition-all duration-300 group-hover:shadow-2xl rounded-xl">
                <svg
                  className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
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
              <span className="text-heading-lg font-extrabold mb-3 group-hover:scale-105 transition-transform duration-300 block">{t('home.features.returns.title')}</span>
              <p className="text-white/90 text-body-lg font-semibold">{t('home.features.returns.featureDesc')}</p>
              <div className="w-16 h-1 bg-white/40 mx-auto mt-4 group-hover:w-24 transition-all duration-300"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
    </>
  );
}
