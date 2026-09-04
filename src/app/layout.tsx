import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import SessionProvider from '@/components/providers/SessionProvider';
import GlobalCommandPalette from '@/components/GlobalCommandPalette';

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
    default: 'LexNova — Global AI Legal OS | Autonomous Legal Intelligence Worldwide',
    template: '%s | LexNova',
  },
  description:
    'LexNova is the global AI legal operating system for cross-border enterprises, founders, and individuals across the US, UK, EU, India, and APAC. Autonomous statutory cross-referencing, multi-jurisdiction limitation tracking, court-ready notices, and verified global counsel matching.',
  keywords: [
    'global legal AI', 'AI lawyer worldwide', 'LexNova', 'cross-border contract dispute',
    'international arbitration SIAC', 'US breach of contract', 'UK pre-action protocol',
    'GDPR compliance EU', 'statute of limitations calculator', 'delaware corporate law',
    'high court advocates', 'SRA solicitors UK', 'global debt recovery',
  ],
  authors: [{ name: 'LexNova Technologies Inc.' }],
  creator: 'LexNova',
  publisher: 'LexNova Technologies Inc.',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    siteName: 'LexNova',
    title: 'LexNova — Global AI Legal OS | Autonomous Legal Intelligence Worldwide',
    description:
      'Autonomous legal intelligence across 50+ jurisdictions. Instant cross-border statutory analysis, international limitation tracking, court-admissible notices, and verified global counsel.',
    images: [
      {
        url: `${APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'LexNova Global Legal Operating System',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LexNova — Global AI Legal OS',
    description: 'Autonomous multi-jurisdiction legal intelligence for the US, UK, EU, India & worldwide. Instant statutory mapping, international arbitration, court-ready documents.',
    images: [`${APP_URL}/og-image.jpg`],
    creator: '@LexNovaGlobal',
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
  description: 'Global AI-powered legal operating system for cross-border enterprises, founders, and individuals',
  url: APP_URL,
  logo: `${APP_URL}/icons/icon-192.png`,
  areaServed: ['US', 'GB', 'EU', 'SG', 'IN', 'AE'],
  availableLanguage: ['English', 'Spanish', 'French', 'German', 'Hindi'],
  serviceType: 'Cross-Border Legal Intelligence, Limitation Tracking & Global Counsel Matching',
  priceRange: '$19 - $499',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '2418',
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
          <GlobalCommandPalette />
          <CookieConsent />
        </SessionProvider>
      </body>
    </html>
  );
}
