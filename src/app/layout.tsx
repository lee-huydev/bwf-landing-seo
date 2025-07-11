import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: process.env.NEXT_PUBLIC_SITE_NAME || "BWF Ventures - Iframe SEO",
    template: `%s | ${process.env.NEXT_PUBLIC_SITE_NAME || "BWF Ventures"}`,
  },
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "Professional iframe embedding with advanced SEO optimization",
  keywords: ["iframe", "SEO", "BWF Ventures", "professional", "embedding"],
  authors: [{ name: "BWF Ventures" }],
  creator: "BWF Ventures",
  publisher: "BWF Ventures",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || "BWF Ventures - Iframe SEO",
    title: process.env.NEXT_PUBLIC_SITE_NAME || "BWF Ventures - Iframe SEO",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Professional iframe embedding with advanced SEO optimization",
  },
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_SITE_NAME || "BWF Ventures - Iframe SEO",
    description:
      process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
      "Professional iframe embedding with advanced SEO optimization",
  },
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://bwfventures.framer.website" />
        <link rel="dns-prefetch" href="https://bwfventures.framer.website" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
