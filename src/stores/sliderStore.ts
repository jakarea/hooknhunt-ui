import { create } from 'zustand';
import api from '@/lib/api';
import { Slider } from '@/types';

interface SliderState {
  sliders: Slider[];
  loading: boolean;
  error: string | null;
  fetched: boolean;

  fetchSliders: () => Promise<void>;
}

// Normalize slider data from camelCase (API) to snake_case (component)
const normalizeSlider = (slider: Slider): Slider => ({
  image_url: slider.imageUrl ?? slider.image_url ?? null,
  video_url: slider.videoUrl ?? slider.video_url ?? null,
  capsule_title: slider.capsuleTitle ?? slider.capsule_title ?? '',
  title: slider.title ?? '',
  sub_title: slider.subTitle ?? slider.sub_title ?? '',
  features: slider.features ?? null,
  features_list: slider.featuresList ?? slider.features_list ?? [],
  cta1_label: slider.cta1Label ?? slider.cta1_label ?? null,
  cta1_link: slider.cta1Link ?? slider.cta1_link ?? null,
  cta2_label: slider.cta2Label ?? slider.cta2_label ?? null,
  cta2_link: slider.cta2Link ?? slider.cta2_link ?? null,
  sort_order: slider.sortOrder ?? slider.sort_order ?? 0,
});

const sortByOrder = (sliders: Slider[]): Slider[] =>
  [...sliders].sort((a, b) => {
    const orderA = a.sortOrder ?? a.sort_order ?? 0;
    const orderB = b.sortOrder ?? b.sort_order ?? 0;
    return orderA - orderB;
  });

export const useSliderStore = create<SliderState>((set, get) => ({
  sliders: [],
  loading: false,
  error: null,
  fetched: false,

  fetchSliders: async () => {
    if (get().fetched) return;

    set({ loading: true, error: null });

    try {
      const response = await api.getSliders();
      const rawSliders = (response.data ?? []) as unknown as Slider[];
      // Normalize camelCase API response to snake_case for components
      const normalizedSliders = rawSliders.map(normalizeSlider);
      const sliders = sortByOrder(normalizedSliders);

      set({ sliders, loading: false, fetched: true });
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Failed to fetch sliders';
      set({ error: message, loading: false, fetched: true });
    }
  },
}));
