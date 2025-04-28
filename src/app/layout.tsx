'use client';

import { Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from '../context/CartContext';
import { UserProvider } from '../context/UserContext';
import { LocationProvider } from '../context/LocationContext';
import { GoogleAuthProviderWrapper } from '../providers/GoogleAuthProvider';
import { CheckoutProvider } from '../context/CheckoutContext';
import { RouteProtectionProvider } from '../context/RouteProtectionContext';
import Navbar from '../components/Navbar';
import Footer from '@/components/Footer';

const outfit = Outfit({ 
  subsets: ["latin"],
  variable: '--font-outfit'
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} font-sans`}>
        <UserProvider>
          <LocationProvider>
            <CartProvider>
              <CheckoutProvider>
                <RouteProtectionProvider>
                  <GoogleAuthProviderWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Navbar />
                      <main className="flex-grow">
                        {children}
                      </main>
                      <Footer />
                    </div>
                  </GoogleAuthProviderWrapper>
                </RouteProtectionProvider>
              </CheckoutProvider>
            </CartProvider>
          </LocationProvider>
        </UserProvider>
      </body>
    </html>
  );
} 