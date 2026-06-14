'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { WishlistProvider } from '@/contexts/WishlistContext';
import { RecentlyViewedProvider } from '@/contexts/RecentlyViewedContext';
import { SearchModalProvider } from '@/contexts/SearchModalContext';
import { AffiliateTrackingProvider } from '@/contexts/AffiliateTrackingContext';
import { I18nextProvider } from '../../node_modules/react-i18next';
import i18n from '@/lib/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <AffiliateTrackingProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <RecentlyViewedProvider>
                  <SearchModalProvider>
                    {children}
                  </SearchModalProvider>
                </RecentlyViewedProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </AffiliateTrackingProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
