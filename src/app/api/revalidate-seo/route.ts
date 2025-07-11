import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getAllPagePaths } from "@/lib/sitemap-crawler";

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret (optional security)
    const authHeader = request.headers.get("authorization");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";

    // Get all page paths
    const paths = await getAllPagePaths(baseUrl);

    // Revalidate all pages to trigger re-fetch of SEO content
    const revalidationResults = await Promise.allSettled(
      paths.map(async (path) => {
        revalidatePath(path);
        return { path, status: "revalidated" };
      })
    );

    const successful = revalidationResults
      .filter(
        (
          result
        ): result is PromiseFulfilledResult<{ path: string; status: string }> =>
          result.status === "fulfilled"
      )
      .map((result) => result.value);

    return NextResponse.json({
      success: true,
      message: "SEO content revalidated for all pages",
      revalidatedPaths: successful,
      totalPaths: paths.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in SEO revalidation webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "SEO Revalidation Webhook",
    timestamp: new Date().toISOString(),
  });
}
