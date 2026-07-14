'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ReviewsSlider() {
  const { t } = useTranslation();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const reviews = [
    {
      id: 1,
      textKey: 'home.reviews.review1.text',
      nameKey: 'home.reviews.review1.name',
      gradient: 'from-[#ffe5e5] to-[#ffd4d4] dark:from-[#8a0f12] dark:to-[#6b0c0e]',
    },
    {
      id: 2,
      textKey: 'home.reviews.review2.text',
      nameKey: 'home.reviews.review2.name',
      gradient: 'from-[#ffe8f0] to-[#ffd9e8] dark:from-[#8a0f12] dark:to-[#6b0c0e]',
    },
    {
      id: 3,
      textKey: 'home.reviews.review3.text',
      nameKey: 'home.reviews.review3.name',
      gradient: 'from-[#fff5e8] to-[#ffe8cc] dark:from-[#8a0f12] dark:to-[#6b0c0e]',
    },
    {
      id: 4,
      textKey: 'home.reviews.review1.text',
      nameKey: 'home.reviews.review1.name',
      gradient: 'from-[#e8f5ff] to-[#ccebff] dark:from-[#8a0f12] dark:to-[#6b0c0e]',
    },
    {
      id: 5,
      textKey: 'home.reviews.review2.text',
      nameKey: 'home.reviews.review2.name',
      gradient: 'from-[#e8ffe8] to-[#ccffcc] dark:from-[#8a0f12] dark:to-[#6b0c0e]',
    },
  ];

  // Auto-scroll functionality - infinite seamless scrolling
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const startAutoScroll = () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);

      scrollIntervalRef.current = setInterval(() => {
        if (isHovered) return; // Pause on hover

        const scrollAmount = 1; // Smooth scroll speed
        slider.scrollLeft += scrollAmount;

        // Get single item width (reviews are w-80 md:w-96, gap-4)
        const itemWidth = 320 + 16; // 80 * 4 + gap of 4
        const maxScroll = slider.scrollWidth - slider.clientWidth;

        // Seamless infinite scroll - reset when reaching end
        if (slider.scrollLeft >= maxScroll - 10) {
          slider.scrollLeft = 0;
        }
      }, 16); // ~60fps for smooth animation
    };

    startAutoScroll();

    return () => {
      if (scrollIntervalRef.current) clearInterval(scrollIntervalRef.current);
    };
  }, [isHovered]);

  return (
    <section className="bg-[#fee1e1] dark:bg-[#322020] py-10 md:py-14 transition-colors duration-200">
      <div className="container px-3 md:px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {t('home.reviews.title')}
          </h3>
        </div>

        {/* Carousel Slider */}
        <div
          ref={sliderRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {reviews.map((review) => (
            <div key={review.id} className="flex-shrink-0 w-80 md:w-96 snap-start">
              <div
                className={`relative bg-gradient-to-br ${review.gradient} rounded-none p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full overflow-hidden`}
              >
                {/* Decorative Circles */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-white dark:bg-[#2a2a2a]/5 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white dark:bg-[#2a2a2a]/5 rounded-full blur-xl"></div>
                <div className="absolute top-12 right-4 w-16 h-16 bg-white dark:bg-[#2a2a2a]/3 rounded-full blur-lg"></div>

                {/* Stars */}
                <div className="flex items-center gap-1 mb-4 relative z-10">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-gray-900 dark:text-white/90 text-base leading-relaxed mb-4 relative z-10">
                  {t(review.textKey)}
                </p>

                {/* Customer Name */}
                <p className="text-sm font-semibold text-gray-900 dark:text-white relative z-10">
                  {t(review.nameKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
