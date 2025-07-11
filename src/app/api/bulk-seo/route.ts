import { NextResponse } from "next/server";
import { getAllPagePaths } from "@/lib/sitemap-crawler";
import { fetchSEOContent, SEOContent } from "@/lib/seo-content";

interface PageResult {
  path: string;
  url: string;
  seo: SEOContent;
}

export async function GET() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";

    // Get all page paths
    const paths = await getAllPagePaths(baseUrl);

    // Fetch SEO content for each page
    const results = await Promise.allSettled(
      paths.map(async (path) => {
        const fullUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;
        const seoContent = await fetchSEOContent(fullUrl);
        return {
          path,
          url: fullUrl,
          seo: seoContent,
        };
      })
    );

    const successful = results
      .filter(
        (result): result is PromiseFulfilledResult<PageResult> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    const failed = results
      .filter(
        (result): result is PromiseRejectedResult =>
          result.status === "rejected"
      )
      .map((result) => ({ error: result.reason?.message || "Unknown error" }));

    return NextResponse.json({
      success: true,
      totalPages: paths.length,
      successfulPages: successful.length,
      failedPages: failed.length,
      data: successful,
      errors: failed,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in bulk SEO generation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
