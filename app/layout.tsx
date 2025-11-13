
import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";
import CookieConsent from './components/CookieConsent';

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-pacifico',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "&Accessories - Smukke Smykker til Bedste Priser | Sammenlign Ringe, Halskæder & Øreringe",
  description: "Sammenlign priser på smukke smykker - ringe, halskæder, øreringe og armbånd fra Danmarks bedste smykkemærker. Find dit perfekte smykke til de bedste priser hos &Accessories.",
  keywords: "smykker, ringe, halskæder, øreringe, armbånd, vedhæng, danske smykker, online smykker, smykkeudvalg",
  authors: [{ name: "&Accessories" }],
  creator: "&Accessories",
  publisher: "&Accessories",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://andaccessories.dk'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "&Accessories - Smukke Smykker Online",
    description: "Opdag vores kuraterede kollektion af elegante smykker fra førende danske og internationale mærker.",
    url: 'https://andaccessories.dk',
    siteName: '&Accessories',
    images: [
      {
        url: '/android-chrome-512x512.png',
        width: 512,
        height: 512,
        alt: '&Accessories - Smukke Smykker Online',
      },
    ],
    locale: 'da_DK',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "&Accessories - Smukke Smykker Online",
    description: "Opdag vores kuraterede kollektion af elegante smykker fra førende danske og internationale mærker.",
    images: ['/android-chrome-512x512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      {
        rel: 'icon',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        rel: 'icon',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" suppressHydrationWarning={true}>
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#ec4899" />
        {/* Google Analytics - Will be loaded conditionally based on consent */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Google Analytics will be loaded conditionally
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              
              // Load GA4 only if user has consented to statistics cookies
              function loadGoogleAnalytics() {
                if (typeof window !== 'undefined') {
                  const consent = localStorage.getItem('cookie-consent');
                  if (consent) {
                    try {
                      const consentData = JSON.parse(consent);
                      if (consentData.statistics) {
                        // Load GA4 script
                        const script = document.createElement('script');
                        script.async = true;
                        script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
                        document.head.appendChild(script);
                        
                        // Configure GA4
                        gtag('config', 'GA_MEASUREMENT_ID', {
                          anonymize_ip: true,
                          cookie_flags: 'SameSite=Lax;Secure'
                        });
                      }
                    } catch (error) {
                      console.error('Error loading Google Analytics:', error);
                    }
                  }
                }
              }
              
              // Load GA4 on page load if consent exists
              if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', loadGoogleAnalytics);
              } else {
                loadGoogleAnalytics();
              }
            `
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
