'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import type { DeliveryBreakdown } from '@/utils/shippingUtils';

interface DeliveryCalculationHookResult {
  deliveryCharge: number;
  breakdown: DeliveryBreakdown | null;
  loading: boolean;
  error: string | null;
  calculateDelivery: (weight: number, division: string, orderAmount: number) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for calculating delivery charges with progressive discount support
 */
export function useDeliveryCalculation(): DeliveryCalculationHookResult {
  const [deliveryCharge, setDeliveryCharge] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<DeliveryBreakdown | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const calculateDelivery = useCallback(async (weight: number, division: string, orderAmount: number) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.calculateDeliveryCharge({
        weight,
        division,
        order_amount: orderAmount,
      });

      if (response.data) {
        setDeliveryCharge(response.data.charge);
        setBreakdown(response.data.breakdown as DeliveryBreakdown);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to calculate delivery charge';
      setError(errorMessage);
      console.error('Delivery calculation error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    deliveryCharge,
    breakdown,
    loading,
    error,
    calculateDelivery,
    clearError,
  };
}

/**
 * Custom hook for fetching delivery settings (public)
 */
export function useDeliverySettings() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v2/store/delivery-settings`);
        const data = await response.json();

        if (data.success) {
          setSettings(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch delivery settings');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch delivery settings');
        console.error('Delivery settings error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading, error };
}
