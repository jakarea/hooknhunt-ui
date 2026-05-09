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
import FloatingActionButton from "@/components/common/FloatingActionButton";
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
    <html lang="bn" suppressHydrationWarning>
      <head>

      </head>
      <body className={`${notoSansBengali.className} ${anekBangla.className} antialiased bg-white text-gray-900 transition-colors duration-200`} suppressHydrationWarning>
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
              <FloatingActionButton />
            </Providers>
          </LanguageProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
