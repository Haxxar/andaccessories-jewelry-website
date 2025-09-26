
import React from 'react';
import type { Metadata } from "next";
import { Geist, Geist_Mono, Pacifico } from "next/font/google";
import "./globals.css";

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
  title: "&Accessories - Smukke Smykker Online | Danmarks Bedste Smykkeudvalg",
  description: "Opdag vores kuraterede kollektion af elegante smykker fra førende danske og internationale mærker. Ringe, halskæder, øreringe og meget mere til de bedste priser.",
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
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
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
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${pacifico.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
