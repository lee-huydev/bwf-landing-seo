import { MetadataRoute } from "next";
import { fetchSitemapPages } from "@/lib/sitemap-crawler";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const sourceUrl =
    process.env.NEXT_PUBLIC_IFRAME_URL || "https://bwfventures.framer.website";

  try {
    // Fetch sitemap from the original source site
    const sourceSitemapPages = await fetchSitemapPages(sourceUrl);

    console.log(
      `Fetched ${sourceSitemapPages.length} pages from source sitemap`
    );

    // Convert source sitemap to our format with our domain
    const sitemapEntries: MetadataRoute.Sitemap = sourceSitemapPages.map(
      (page) => {
        // Extract path from source URL
        const sourcePath = new URL(page.url).pathname;

        // Create our URL with the same path
        const ourUrl = sourcePath === "/" ? baseUrl : `${baseUrl}${sourcePath}`;

        return {
          url: ourUrl,
          lastModified: page.lastmod ? new Date(page.lastmod) : new Date(),
          changeFrequency:
            (page.changefreq as MetadataRoute.Sitemap[0]["changeFrequency"]) ||
            "weekly",
          priority: page.priority || 0.5,
        };
      }
    );

    // Ensure homepage has highest priority
    const homepageIndex = sitemapEntries.findIndex(
      (entry) => entry.url === baseUrl || entry.url === `${baseUrl}/`
    );

    if (homepageIndex >= 0) {
      sitemapEntries[homepageIndex].priority = 1.0;
      sitemapEntries[homepageIndex].changeFrequency = "daily";
    } else {
      // Add homepage if not found
      sitemapEntries.unshift({
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1.0,
      });
    }

    return sitemapEntries;
  } catch (error) {
    console.error("Error fetching source sitemap:", error);

    // Fallback to basic sitemap
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
      {
        url: `${baseUrl}/platform`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      },
    ];
  }
}
