import * as cheerio from "cheerio";

// Simple in-memory cache to avoid repeated fetches
const cache = new Map<string, { data: SEOContent; timestamp: number }>();
const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds

export interface SEOContent {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  favicon: string; // Add favicon URL
  headings: string[];
  paragraphs: string[];
  images: Array<{ src?: string; alt: string }>;
  lastFetched: string;
  error?: string;
}

export async function fetchSEOContent(url?: string): Promise<SEOContent> {
  const targetUrl =
    url ||
    process.env.NEXT_PUBLIC_IFRAME_URL ||
    "https://bwfventures.framer.website";

  // Check cache first
  const cached = cache.get(targetUrl);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log(`Using cached SEO content for: ${targetUrl}`);
    return cached.data;
  }

  try {
    // Check cache first
    const cached = cache.get(targetUrl);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      console.log(`Cache hit for: ${targetUrl}`);
      return { ...cached.data, error: undefined }; // Return cached data without error
    }

    // Direct fetch in server environment without Next.js cache for large responses
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
      },
      // Remove next.revalidate to avoid cache size issues
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract important SEO information
    const title =
      $("title").text() ||
      $('meta[property="og:title"]').attr("content") ||
      "BWF Ventures";
    const description =
      $('meta[name="description"]').attr("content") ||
      $('meta[property="og:description"]').attr("content") ||
      "Professional investment platform";
    const keywords = $('meta[name="keywords"]').attr("content") || "";
    const ogImage = $('meta[property="og:image"]').attr("content") || "";
    const canonical = $('link[rel="canonical"]').attr("href") || targetUrl;

    // Extract favicon with multiple fallback options
    const extractFavicon = (): string => {
      // Priority order for favicon extraction
      const faviconSelectors = [
        'link[rel="icon"][type="image/svg+xml"]', // SVG favicon (best quality)
        'link[rel="icon"][sizes*="32"]', // 32x32 favicon
        'link[rel="icon"][sizes*="16"]', // 16x16 favicon
        'link[rel="shortcut icon"]', // Traditional favicon
        'link[rel="icon"]', // Generic icon
        'link[rel="apple-touch-icon"]', // Apple touch icon as fallback
      ];

      for (const selector of faviconSelectors) {
        const faviconUrl = $(selector).attr("href");
        if (faviconUrl) {
          // Convert relative URLs to absolute
          if (faviconUrl.startsWith("http")) {
            return faviconUrl;
          } else if (faviconUrl.startsWith("//")) {
            return `https:${faviconUrl}`;
          } else if (faviconUrl.startsWith("/")) {
            return `${new URL(targetUrl).origin}${faviconUrl}`;
          } else {
            return `${new URL(targetUrl).origin}/${faviconUrl}`;
          }
        }
      }

      // Final fallback to /favicon.ico
      return `${new URL(targetUrl).origin}/favicon.ico`;
    };

    const favicon = extractFavicon();

    // Extract main content for SEO - be more selective to reduce payload
    const headings = $("h1, h2, h3")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 2 && text.length < 100) // Filter reasonable heading lengths
      .slice(0, 8); // Reduce to 8 headings

    const paragraphs = $("p")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 20 && text.length < 300) // Filter meaningful paragraphs
      .slice(0, 3); // Reduce to 3 paragraphs

    const images = $("img")
      .map(function () {
        const src = $(this).attr("src");
        const alt = $(this).attr("alt") || "";
        // Only include images with meaningful alt text or reasonable src
        if (!src || src.startsWith("data:") || src.length > 200) return null;
        return {
          src: src.startsWith("http")
            ? src
            : src.startsWith("/")
            ? `${new URL(targetUrl).origin}${src}`
            : src,
          alt: alt.length > 100 ? alt.substring(0, 100) + "..." : alt,
        };
      })
      .get()
      .filter((img): img is { src: string; alt: string } => img !== null)
      .slice(0, 3); // Reduce to 3 images

    const seoContent: SEOContent = {
      title,
      description,
      keywords,
      ogImage,
      canonical,
      favicon,
      headings,
      paragraphs,
      images,
      lastFetched: new Date().toISOString(),
    };

    // Update cache
    cache.set(targetUrl, { data: seoContent, timestamp: Date.now() });

    console.log(
      `SEO content fetched successfully for: ${targetUrl} (${headings.length} headings, ${paragraphs.length} paragraphs, ${images.length} images)`
    );

    return seoContent;
  } catch (error) {
    console.error("Error fetching SEO content:", error);

    // Return fallback data
    return {
      title: "BWF Ventures - Professional Investment Platform",
      description:
        "Access BWF Ventures professional investment platform with advanced portfolio management and analytics.",
      keywords:
        "investment, portfolio management, BWF Ventures, financial services",
      ogImage: "",
      canonical:
        url ||
        process.env.NEXT_PUBLIC_IFRAME_URL ||
        "https://bwfventures.framer.website",
      favicon: `${
        new URL(
          url ||
            process.env.NEXT_PUBLIC_IFRAME_URL ||
            "https://bwfventures.framer.website"
        ).origin
      }/favicon.ico`,
      headings: [
        "BWF Ventures",
        "Professional Investment Platform",
        "Portfolio Management",
      ],
      paragraphs: [
        "Professional investment solutions for sophisticated investors.",
      ],
      images: [],
      lastFetched: new Date().toISOString(),
      error: "Failed to fetch content, using fallback data",
    };
  }
}
