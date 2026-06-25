'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface AffiliateTrackingContextType {
  referralCode: string | null;
  referralId: number | null;
}

const AffiliateTrackingContext = createContext<AffiliateTrackingContextType | undefined>(undefined);

/**
 * Simple affiliate tracking: Just capture the last ref code from URL and store it
 * Backend will use the code to find affiliate and create commission
 * No need for referral_id or complex tracking logic
 */
export function AffiliateTrackingProvider({ children }: { children: ReactNode }) {
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralId, setReferralId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check URL for ?ref=CODE
      const urlParams = new URLSearchParams(window.location.search);
      const refParam = urlParams.get('ref');

      if (refParam) {
        const code = refParam.toUpperCase();
        console.log('✅ Referral code captured from URL:', code);

        // Store the code in localStorage (this is what will be used for orders)
        localStorage.setItem('affiliate_referral', code);
        setReferralCode(code);
      } else {
        // If no ref in URL, restore from localStorage (use the LAST code)
        const storedCode = localStorage.getItem('affiliate_referral');
        if (storedCode) {
          console.log('✅ Using stored referral code:', storedCode);
          setReferralCode(storedCode);
        }
      }
    }
  }, []);

  return (
    <AffiliateTrackingContext.Provider
      value={{
        referralCode,
        referralId,
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
