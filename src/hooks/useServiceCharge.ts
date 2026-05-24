import { useState, useEffect } from 'react';
import type { ServiceChargeSettings } from '@/types/delivery';

export function useServiceCharge() {
  const [settings, setSettings] = useState<ServiceChargeSettings>({
    enabled: false,
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Service charge endpoint doesn't exist yet, use default settings
  // TODO: Implement backend endpoint /public/settings/website when available
  useEffect(() => {
    setSettings({
      enabled: false,
      amount: 0,
    });
    setLoading(false);
  }, []);

  return { settings, loading, error };
}
