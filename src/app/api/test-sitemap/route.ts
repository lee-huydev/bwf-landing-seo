import { NextRequest, NextResponse } from "next/server";
import { fetchSitemapPages } from "@/lib/sitemap-crawler";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceUrl =
      searchParams.get("url") ||
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";

    console.log(`Fetching sitemap for: ${sourceUrl}`);

    const pages = await fetchSitemapPages(sourceUrl);

    return NextResponse.json({
      success: true,
      sourceUrl,
      totalPages: pages.length,
      pages: pages.slice(0, 20), // Return first 20 for preview
      samplePages: pages.slice(0, 5).map((page) => ({
        url: page.url,
        priority: page.priority,
        changefreq: page.changefreq,
        lastmod: page.lastmod,
      })),
    });
  } catch (error) {
    console.error("Error fetching sitemap:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
