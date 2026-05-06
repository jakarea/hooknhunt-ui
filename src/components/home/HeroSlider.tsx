'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { useSliderStore } from '@/stores/sliderStore';

const extractYoutubeId = (url: string): string | null => {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([a-zA-Z0-9_-]{11})/
  );
  return match?.[1] ?? null;
};

function SkeletonSlider() {
  return (
    <section className="w-full bg-gray-900">
      <div className="w-full h-[350px] md:h-[400px] lg:h-[450px] animate-pulse bg-gray-800" />
    </section>
  );
}

function VideoBackground({ videoId }: { videoId: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&disablekb=1`}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300%] h-[300%] pointer-events-none"
        allow="autoplay; encrypted-media"
        title="Slider video"
        style={{ border: 0 }}
      />
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}

function SlideContent({
  slide,
  isTransitioning,
  viewAllLabel,
}: {
  slide: {
    capsule_title: string;
    title: string;
    sub_title: string;
    features_list: string[];
    cta1_label: string | null;
    cta1_link: string | null;
    cta2_label: string | null;
    cta2_link: string | null;
  };
  isTransitioning: boolean;
  viewAllLabel: string;
}) {
  return (
    <div className="relative h-full flex items-center">
      <div className="max-w-[1344px] mx-auto px-4 lg:px-8 xl:px-12 w-full">
        <div className="max-w-2xl">
          {slide.capsule_title && (
            <div className="inline-block mb-4 animate-fadeInUp">
              <span className="px-4 py-2 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] text-white text-label-md font-bold rounded-full shadow-lg">
                {slide.capsule_title}
              </span>
            </div>
          )}

          <h2 className="text-heading-xl md:text-heading-2xl lg:text-display-sm font-bold text-white mb-6 leading-tight animate-fadeInUp delay-200">
            {slide.title}
          </h2>


          <p className="text-body-lg md:text-body-xl text-gray-200 mb-8 max-w-xl leading-relaxed animate-fadeInUp delay-400">{slide.sub_title}</p>


          {slide.features_list.length > 0 && (
            <div className="flex flex-wrap gap-3 mb-8 animate-fadeInUp delay-500">
              {slide.features_list.map((feature, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm rounded-full border border-white/20"
                >
                  <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {feature}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-4 animate-fadeInUp delay-600">
            {slide.cta1_label && slide.cta1_link && (
              <Link
                href={slide.cta1_link}
                className="group px-8 py-4 bg-gradient-to-r from-[#bc1215] to-[#8a0f12] hover:from-[#8a0f12] hover:to-[#bc1215] text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center gap-2 cursor-pointer"
              >
                {slide.cta1_label}
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}
            {slide.cta2_label && slide.cta2_link && (
              <Link
                href={slide.cta2_link}
                className="px-8 py-4 glass-button text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {slide.cta2_label}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            )}
            {!slide.cta1_label && (
              <Link
                href="/products"
                className="px-8 py-4 glass-button text-white font-semibold rounded-lg flex items-center gap-2 cursor-pointer"
              >
                {viewAllLabel}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSlider() {
  const { t } = useTranslation();
  const { sliders, loading, fetchSliders } = useSliderStore();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    fetchSliders();
  }, [fetchSliders]);

  const slideCount = sliders.length;
  const viewAllLabel = t('hero.viewAll');

  const goToSlide = useCallback((index: number) => {
    if (index === currentSlide || isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [currentSlide, isTransitioning]);

  const nextSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slideCount);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [isTransitioning, slideCount]);

  const prevSlide = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
      setIsTransitioning(false);
    }, 300);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, [isTransitioning, slideCount]);

  useEffect(() => {
    if (!isAutoPlaying || slideCount <= 1) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slideCount);
        setIsTransitioning(false);
      }, 300);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, slideCount]);

  if (loading) return <SkeletonSlider />;
  if (slideCount === 0) return null;

  return (
    <section className="w-full bg-gray-900 dark:bg-black relative overflow-hidden max-w-[1192px] mx-auto">
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#bc1215]/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-[#046bd2]/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400/10 rounded-full blur-lg animate-bounce" />
      </div>

      <div className="relative w-full h-[300px] md:h-[360px] lg:h-[400px] overflow-hidden">
        <div className="relative h-full">
          {sliders.map((slide, index) => {
            const videoId = slide.video_url ? extractYoutubeId(slide.video_url) : null;
            const isImageSlide = slide.image_url && !videoId;

            return (
              <div
                key={`${slide.sort_order}-${index}`}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 translate-x-0 scale-100'
                    : index < currentSlide
                      ? 'opacity-0 -translate-x-full scale-95'
                      : 'opacity-0 translate-x-full scale-95'
                }`}
              >
                {/* Background */}
                <div className="absolute inset-0">
                  {isImageSlide && (
                    <Image
                      src={slide.image_url!}
                      alt={slide.title}
                      fill
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                      sizes="100vw"
                      priority={index === 0}
                    />
                  )}
                  {videoId && <VideoBackground videoId={videoId} />}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent dark:from-black/95 dark:via-black/80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                {/* Content */}
                {/* <SlideContent
                  slide={slide}
                  isTransitioning={isTransitioning}
                  viewAllLabel={viewAllLabel}
                /> */}
              </div>
            );
          })}
        </div>

        {slideCount > 1 && (
          <>
            {/* Navigation Arrows */}
            {/* <button
              onClick={prevSlide}
              disabled={isTransitioning}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
              aria-label="Previous slide"
            >
              <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              disabled={isTransitioning}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 glass-button text-white flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 group disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
              aria-label="Next slide"
            >
              <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button> */}

            {/* Dots Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-10">
              {sliders.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  disabled={isTransitioning}
                  className={`transition-all duration-500 rounded-full flex items-center gap-2 cursor-pointer ${
                    index === currentSlide
                      ? 'w-2.5 h-2.5 bg-[#fff] shadow-lg'
                      : 'w-2.5 h-2.5 hover:scale-125 bg-gray-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                >
                  {/* {index === currentSlide && (
                    <span className="text-xs text-white font-bold ml-2">
                      {index + 1}
                    </span>
                  )} */}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
