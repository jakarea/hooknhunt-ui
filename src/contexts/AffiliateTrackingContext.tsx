'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AffiliateTrackingContextType {
  referralCode: string | null;
  referralId: number | null;
  isTracked: boolean;
  trackReferral: (code: string) => Promise<void>;
}

const AffiliateTrackingContext = createContext<AffiliateTrackingContextType | undefined>(undefined);

export function AffiliateTrackingProvider({ children }: { children: ReactNode }) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralId, setReferralId] = useState<number | null>(null);
  const [isTracked, setIsTracked] = useState(false);

  useEffect(() => {
    // Check if we already have a tracked referral in localStorage
    const storedReferral = localStorage.getItem('affiliate_referral');
    const storedReferralId = localStorage.getItem('affiliate_referral_id');
    const storedTrackedAt = localStorage.getItem('affiliate_tracked_at');

    if (storedTrackedAt) {
      const trackingTime = parseInt(storedTrackedAt);
      const timeSinceTracking = Date.now() - trackingTime;

      // Periods
      const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
      const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

      // Less than 7 days: First referrer is locked (cannot be overwritten)
      if (timeSinceTracking < sevenDaysInMs) {
        setReferralCode(storedReferral);
        setReferralId(storedReferralId ? parseInt(storedReferralId) : null);
        setIsTracked(true);
      }
      // 7-30 days: Stored referral exists but CAN be overwritten by new code
      else if (timeSinceTracking < thirtyDaysInMs) {
        setReferralCode(storedReferral);
        setReferralId(storedReferralId ? parseInt(storedReferralId) : null);
        setIsTracked(true);
        // Will check URL for potential new referrer
      }
      // After 30 days: Clear everything, no tracking
      else {
        localStorage.removeItem('affiliate_referral');
        localStorage.removeItem('affiliate_referral_id');
        localStorage.removeItem('affiliate_tracked_at');
        setReferralCode(null);
        setReferralId(null);
        setIsTracked(false);
      }
    }

    // Check URL for ?ref=CODE parameter
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');

      if (refParam) {
        const newCode = refParam.toUpperCase();
        const trackingTime = storedTrackedAt ? parseInt(storedTrackedAt) : 0;
        const timeSinceTracking = Date.now() - trackingTime;
        const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;

        // Only track if:
        // 1. No existing tracking, OR
        // 2. Existing tracking is 7+ days old but less than 30 days (overwrite window)
        if (!storedTrackedAt || (timeSinceTracking >= sevenDaysInMs && timeSinceTracking < thirtyDaysInMs)) {
          trackReferral(newCode);
        }
      }
    }
  }, []);

  const trackReferral = async (code: string) => {
    try {
      const response = await fetch('https://hooknhunt-api.test/api/v2/store/affiliate/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referral_code: code,
          landing_page: window.location.pathname,
          user_agent: navigator.userAgent,
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        setReferralCode(code);
        setReferralId(data.data.referral_id || null);
        setIsTracked(true);

        // Store in localStorage with timestamp
        localStorage.setItem('affiliate_referral', code);
        localStorage.setItem('affiliate_referral_id', String(data.data.referral_id || ''));
        localStorage.setItem('affiliate_tracked_at', String(Date.now()));

        console.log('Affiliate referral tracked:', {
          referralCode: code,
          referralId: data.data.referral_id,
        });
      }
    } catch (error) {
      console.error('Failed to track affiliate referral:', error);
      // Still store the code locally even if API call fails
      setReferralCode(code);
      localStorage.setItem('affiliate_referral', code);
      localStorage.setItem('affiliate_tracked_at', String(Date.now()));
    }
  };

  return (
    <AffiliateTrackingContext.Provider
      value={{
        referralCode,
        referralId,
        isTracked,
        trackReferral,
      }}
    >
      {children}
    </AffiliateTrackingContext.Provider>
  );
}

export function useAffiliateTracking() {
  const context = useContext(AffiliateTrackingContext);
  if (context === undefined) {
    throw new Error('useAffiliateTracking must be used within an AffiliateTrackingProvider');
  }
  return context;
}
