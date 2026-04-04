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

const sortByOrder = (sliders: Slider[]): Slider[] =>
  [...sliders].sort((a, b) => a.sort_order - b.sort_order);

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
      const sliders = sortByOrder(rawSliders);

      set({ sliders, loading: false, fetched: true });
    } catch (error: unknown) {
      const message = error instanceof Error
        ? error.message
        : 'Failed to fetch sliders';
      set({ error: message, loading: false, fetched: true });
    }
  },
}));
