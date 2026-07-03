import type { Metadata } from "next";
import { Anek_Bangla,Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartSidebar from "@/components/cart/CartSidebar";
import CrossSellModal from "@/components/cart/CrossSellModal";
import MobileBottomNav from "@/components/common/MobileBottomNav";
import GlobalSearchModal from "@/components/search/GlobalSearchModal";
import ErrorBoundary from "@/components/ErrorBoundary";
import TrackingScripts from "@/components/TrackingScripts";

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

const anekBangla = Anek_Bangla({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Hook & Hunt - Premium Fishing Accessories",
  description: "Your premier destination for quality fishing accessories and equipment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Ensure dark mode is applied before page renders
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
                document.documentElement.style.background = '#0a0a0a';
                document.body.style.background = '#0a0a0a';
                document.body.style.color = '#ededed';
              })();
            `,
          }}
        />
      </head>
      <body className={`${notoSansBengali.className} ${anekBangla.className} antialiased dark:bg-[#0a0a0a] dark:text-gray-100 bg-white text-gray-900 transition-colors duration-200`} suppressHydrationWarning>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Remove browser extension injected attributes before hydration
                const removeExtensionAttrs = () => {
                  const attrs = ['bis_skin_checked', 'bis_depth', 'bis_size'];
                  const elements = document.querySelectorAll('*');
                  elements.forEach(el => {
                    attrs.forEach(attr => {
                      if (el.hasAttribute && el.hasAttribute(attr)) {
                        el.removeAttribute(attr);
                      }
                    });
                  });
                };
                removeExtensionAttrs();
                // Also observe for dynamic changes
                if (typeof MutationObserver !== 'undefined') {
                  const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                      if (mutation.type === 'attributes') {
                        const target = mutation.target;
                        const attrName = mutation.attributeName;
                        if (attrName && (attrName.startsWith('bis_') || attrName === 'bis_skin_checked' || attrName === 'bis_depth' || attrName === 'bis_size')) {
                          target.removeAttribute(attrName);
                        }
                      }
                    });
                  });
                  observer.observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ['bis_skin_checked', 'bis_depth', 'bis_size']
                  });
                }
              })();
            `,
          }}
        />
        <TrackingScripts />
        <ErrorBoundary>
          <LanguageProvider>
            <Providers>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartSidebar />
              <CrossSellModal />
              <MobileBottomNav />
              <GlobalSearchModal />
            </Providers>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
