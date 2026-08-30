import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import SessionProvider from '@/components/providers/SessionProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://lexnova.in';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'LexNova — AI Legal OS | India\'s Legal Operating System',
    template: '%s | LexNova',
  },
  description:
    'LexNova is India\'s AI-powered legal operating system. Get instant legal analysis, automated limitation tracking, court-ready documents, and connect with 2,400+ verified advocates.',
  keywords: [
    'legal advice India', 'AI lawyer', 'LexNova', 'consumer forum complaint',
    'Bar Council advocate', 'legal notice India', 'limitation period calculator',
    'employment law India', 'tenant rights India', 'cyber crime complaint India',
  ],
  authors: [{ name: 'LexNova Technologies Pvt. Ltd.' }],
  creator: 'LexNova',
  publisher: 'LexNova Technologies Pvt. Ltd.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: APP_URL,
    siteName: 'LexNova',
    title: 'LexNova — AI Legal OS | India\'s Legal Operating System',
    description:
      'Explain your dispute in plain language. Get instant statutory analysis, limitation tracking, court-ready notices, and verified advocate matching.',
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'LexNova Legal Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexNova — AI Legal OS',
    description: 'India\'s AI-powered legal operating system. Instant statutory analysis, advocate matching, court-ready documents.',
    images: [`${APP_URL}/og-image.jpg`],
    creator: '@LexNovaIN',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LexNova',
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export const viewport: Viewport = {
  themeColor: '#050508',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD structured data for legal service
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: 'LexNova',
  description: 'AI-powered legal operating system for India',
  url: APP_URL,
  logo: `${APP_URL}/icons/icon-192.png`,
  areaServed: 'IN',
  availableLanguage: ['English', 'Hindi'],
  serviceType: 'Legal Information & Advocate Matching',
  priceRange: '₹799 - ₹4999',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '1062',
    bestRating: '5',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <head>
        {/* Preconnect to external services */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Apple PWA */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="LexNova" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#050508" />
        <meta name="msapplication-TileImage" content="/icons/icon-144.png" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <SessionProvider>
          {children}
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
