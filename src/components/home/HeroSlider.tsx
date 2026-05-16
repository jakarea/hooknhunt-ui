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
