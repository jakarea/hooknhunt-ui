import { useState, useEffect } from 'react';
import type { ServiceChargeSettings } from '@/types/delivery';

interface ServiceChargeResponse {
  success: boolean;
  data: {
    serviceChargeEnabled: boolean;
    serviceChargeAmount: number;
  };
}

export function useServiceCharge() {
  const [settings, setSettings] = useState<ServiceChargeSettings>({
    enabled: false,
    amount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServiceCharge = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://hooknhunt-api.test/api/v2'}/public/settings/website`;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const json = await response.json();

        // The API returns { success: true, data: { serviceChargeEnabled: true, serviceChargeAmount: 20 } }
        if (json?.success && json?.data) {
          const newSettings = {
            enabled: json.data.serviceChargeEnabled,
            amount: json.data.serviceChargeAmount,
          };
          setSettings(newSettings);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch service charge settings';
        setError(message);
        console.error('[useServiceCharge] Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceCharge();
  }, []);

  return { settings, loading, error };
}
