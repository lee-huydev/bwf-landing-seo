import { DefaultSeoProps } from "next-seo";

export const seoConfig: DefaultSeoProps = {
  titleTemplate: "%s | BWF Ventures",
  defaultTitle: "BWF Ventures - Professional Investment Platform",
  description:
    "Professional iframe embedding with advanced SEO optimization for BWF Ventures investment platform",
  canonical: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "BWF Ventures",
    title: "BWF Ventures - Professional Investment Platform",
    description:
      "Professional iframe embedding with advanced SEO optimization for BWF Ventures investment platform",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "BWF Ventures",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    handle: "@bwfventures",
    site: "@bwfventures",
    cardType: "summary_large_image",
  },
  additionalMetaTags: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
    {
      name: "theme-color",
      content: "#000000",
    },
    {
      httpEquiv: "x-ua-compatible",
      content: "IE=edge",
    },
  ],
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/favicon.ico",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "76x76",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
    {
      rel: "preconnect",
      href: "https://bwfventures.framer.website",
    },
    {
      rel: "dns-prefetch",
      href: "https://bwfventures.framer.website",
    },
  ],
};
