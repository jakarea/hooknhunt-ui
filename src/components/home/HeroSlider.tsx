'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSliderStore } from '@/stores/sliderStore';

export default function HeroSlider() {
  const { sliders, loading, fetchSliders } = useSliderStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  // Auto-play slider
  useEffect(() => {
    if (sliders.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (loading) {
    return (
      <section className="w-full relative">
        <div className="container mx-auto overflow-hidden">
          <div className="relative h-[219px] md:h-[360px] lg:h-[400px] w-full bg-gray-200 animate-pulse" />
        </div>
      </section>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <section className="w-full relative">
      <div className="container mx-auto overflow-hidden">
        <div className="relative h-[219px] md:h-[360px] lg:h-[400px] w-full bg-[#ccc]">
          {/* Slides */}
          {sliders.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {slide.image_url ? (
                <img
                  src={slide.image_url}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                />
              ) : slide.video_url ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
                  {slide.video_url.includes('youtube.com') || slide.video_url.includes('youtu.be') ? (
                    <div className="absolute inset-0 pointer-events-none">
                      <iframe
                        src={slide.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') + '?autoplay=1&mute=1&loop=1&playlist=' + (slide.video_url.split('v=')[1]?.split('&')[0] || '') + '&enablejsapi=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&cc_load_policy=0&disablekb=1&fs=0&playsinline=1&html5=1&widgetid=1'}
                        title={slide.title}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.78vh] h-[56.25vw] min-w-full min-h-full"
                        style={{ pointerEvents: 'none' }}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                    </div>
                  ) : (
                    <video
                      src={slide.video_url}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  )}
                </div>
              ) : null}

              {/* Overlay - only for image slides */}
              {slide.image_url && (
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
              )}

              {/* Content - only for image slides */}
              {slide.image_url && (
                <div className="absolute inset-0 flex items-center">
                  <div className="container mx-auto px-6 md:px-8">
                    <div className="max-w-xl">
                      {/* Capsule Title */}
                      {slide.capsule_title && (
                        <div className="inline-block px-3 py-1 mb-3 md:mb-4 text-xs font-semibold uppercase tracking-wider text-white bg-[#ec3137]/80 backdrop-blur-sm rounded-full">
                          {slide.capsule_title}
                        </div>
                      )}

                      {/* Title */}
                      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2 md:mb-3">
                        {slide.title}
                      </h2>

                      {/* Subtitle */}
                      {slide.sub_title && (
                        <p className="text-sm md:text-base text-white/90 mb-4 md:mb-6">
                          {slide.sub_title}
                        </p>
                      )}

                      {/* Features */}
                      {slide.features && (
                        <p className="text-xs md:text-sm text-white/80 mb-4 md:mb-6">
                          {slide.features}
                        </p>
                      )}

                      {/* CTAs */}
                      <div className="flex flex-wrap gap-3">
                        {slide.cta1_label && slide.cta1_link && (
                          <Link
                            href={slide.cta1_link}
                            className="inline-block px-6 py-3 bg-[#ec3137] hover:bg-[#c5282d] text-white font-semibold rounded-lg transition-colors duration-300 text-sm md:text-base"
                          >
                            {slide.cta1_label}
                          </Link>
                        )}
                        {slide.cta2_label && slide.cta2_link && (
                          <Link
                            href={slide.cta2_link}
                            className="inline-block px-6 py-3 bg-white hover:bg-gray-100 text-gray-900 font-semibold rounded-lg transition-colors duration-300 text-sm md:text-base"
                          >
                            {slide.cta2_label}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Dots Navigation - Only for image slides */}
          {!sliders[currentSlide]?.video_url && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {sliders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
