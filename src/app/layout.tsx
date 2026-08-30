import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/providers/SessionProvider";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  themeColor: "#050508",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://lexnova.in"),
  title: {
    default: "LexNova — India's AI Legal Operating System",
    template: "%s | LexNova Legal OS",
  },
  description:
    "India's premier AI legal platform for citizens, enterprises, and advocates. Instant plain-language case intake, statutory limitation calculation, court-ready RPAD notices, and 2,400+ Bar Council verified counsel.",
  keywords: [
    "LexNova",
    "AI Lawyer India",
    "Legal Operating System",
    "Indian Law AI",
    "RPAD Legal Notice Generator",
    "Limitation Act Calculator",
    "Bar Council Advocates",
    "Legal AI Intake",
    "Consumer Court Petition",
    "Payment of Wages Act Claim",
  ],
  authors: [{ name: "LexNova Technologies" }],
  creator: "LexNova Technologies",
  publisher: "LexNova Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "LexNova — India's AI Legal Operating System",
    description:
      "Explain your dispute in plain words. Get instant statutory analysis, court notice drafting, and 1-click video consultations with verified Bar Council advocates.",
    url: "https://lexnova.in",
    siteName: "LexNova Legal OS",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/dashboard-hero.jpg",
        width: 1200,
        height: 675,
        alt: "LexNova AI Legal Operating System Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LexNova — India's AI Legal Operating System",
    description:
      "Intelligent case intake, statutory limitation clocks, and Bar Council verified advocate matching.",
    images: ["/dashboard-hero.jpg"],
    creator: "@LexNovaLegal",
  },
  alternates: {
    canonical: "https://lexnova.in",
  },
};

const JSON_LD_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "LexNova Legal Operating System",
      "operatingSystem": "Web, Cloud",
      "applicationCategory": "LegalSoftware",
      "description": "AI-powered legal operating system for plain-language case intake, statutory analysis, and advocate collaboration in India.",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR"
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "2400"
      }
    },
    {
      "@type": "Organization",
      "name": "LexNova Technologies",
      "url": "https://lexnova.in",
      "logo": "https://lexnova.in/favicon.ico",
      "sameAs": [
        "https://twitter.com/LexNovaLegal",
        "https://linkedin.com/company/lexnova"
      ]
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_STRUCTURED_DATA) }}
        />
      </head>
      <body className="antialiased font-sans bg-[#050508] text-[#F0F2F5] selection:bg-blue-500/30 selection:text-white min-h-screen">
        <NextAuthProvider>{children}</NextAuthProvider>
      </body>
    </html>
  );
}
