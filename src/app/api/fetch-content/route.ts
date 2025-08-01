import { NextRequest, NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET(request: NextRequest) {
  try {
    const url =
      request.nextUrl.searchParams.get("url") ||
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Cache-Control": "no-cache",
      },
      // Remove next.revalidate to avoid cache size issues with large responses
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
    const canonical = $('link[rel="canonical"]').attr("href") || url;

    // Extract main content for SEO - optimized for performance and cache size
    const headings = $("h1, h2, h3")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 2 && text.length < 100)
      .slice(0, 8);

    const paragraphs = $("p")
      .map(function () {
        return $(this).text().trim();
      })
      .get()
      .filter((text: string) => text.length > 20 && text.length < 300)
      .slice(0, 3);

    const images = $("img")
      .map(function () {
        const src = $(this).attr("src");
        const alt = $(this).attr("alt") || "";
        if (!src || src.startsWith("data:") || src.length > 200) return null;
        return {
          src: src.startsWith("http")
            ? src
            : src.startsWith("/")
            ? `${new URL(url).origin}${src}`
            : src,
          alt: alt.length > 100 ? alt.substring(0, 100) + "..." : alt,
        };
      })
      .get()
      .filter((img): img is { src: string; alt: string } => img !== null)
      .slice(0, 3);

    return NextResponse.json({
      title,
      description,
      keywords,
      ogImage,
      canonical,
      headings, // Already limited to 8
      paragraphs, // Already limited to 3
      images, // Already limited to 3
      lastFetched: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching content:", error);

    // Fallback data
    return NextResponse.json({
      title: "BWF Ventures - Professional Investment Platform",
      description:
        "Access BWF Ventures professional investment platform with advanced portfolio management and analytics.",
      keywords:
        "investment, portfolio management, BWF Ventures, financial services",
      ogImage: "",
      canonical:
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
    });
  }
}
