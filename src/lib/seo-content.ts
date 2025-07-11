import * as cheerio from "cheerio";

export interface SEOContent {
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonical: string;
  headings: string[];
  paragraphs: string[];
  images: Array<{ src?: string; alt: string }>;
  lastFetched: string;
  error?: string;
}

export async function fetchSEOContent(url?: string): Promise<SEOContent> {
  try {
    const targetUrl =
      url ||
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";

    // Direct fetch in server environment
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
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

    // Extract main content for SEO
    const headings = $("h1, h2, h3")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 0);

    const paragraphs = $("p")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 20);

    const images = $("img")
      .map(function () {
        return {
          src: $(this).attr("src"),
          alt: $(this).attr("alt") || "",
        };
      })
      .get();

    return {
      title,
      description,
      keywords,
      ogImage,
      canonical,
      headings: headings.slice(0, 10), // Limit to first 10 headings
      paragraphs: paragraphs.slice(0, 5), // Limit to first 5 paragraphs
      images: images.slice(0, 5), // Limit to first 5 images
      lastFetched: new Date().toISOString(),
    };
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
