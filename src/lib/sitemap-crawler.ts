import * as cheerio from "cheerio";

export interface SitemapPage {
  url: string;
  priority?: number;
  changefreq?: string;
  lastmod?: string;
}

/**
 * Crawl sitemap.xml to get all pages
 */
export async function fetchSitemapPages(
  baseUrl: string
): Promise<SitemapPage[]> {
  try {
    // Try to fetch sitemap.xml
    const sitemapUrl = `${baseUrl}/sitemap.xml`;

    const pages = await fetchSitemapIndex(sitemapUrl);

    if (pages.length === 0) {
      console.warn(
        `No pages found in sitemap at ${sitemapUrl}, falling back to manual discovery`
      );
      return await discoverPagesManually(baseUrl);
    }

    console.log(`Found ${pages.length} pages in sitemap`);
    return pages;
  } catch (error) {
    console.warn(
      `Error fetching sitemap, falling back to manual discovery:`,
      error
    );
    return await discoverPagesManually(baseUrl);
  }
}

/**
 * Fetch sitemap index and all referenced sitemaps
 */
async function fetchSitemapIndex(sitemapUrl: string): Promise<SitemapPage[]> {
  try {
    const response = await fetch(sitemapUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sitemap index: ${response.status}`);
    }

    const sitemapXml = await response.text();
    const $ = cheerio.load(sitemapXml, { xmlMode: true });

    // Check if this is a sitemap index
    if ($("sitemapindex").length > 0) {
      console.log("Found sitemap index, fetching individual sitemaps...");

      const allPages: SitemapPage[] = [];
      const sitemapUrls: string[] = [];

      $("sitemap loc").each((_, element) => {
        const loc = $(element).text();
        if (loc) {
          sitemapUrls.push(loc);
        }
      });

      // Fetch each sitemap (limit to prevent too many requests)
      const limitedSitemaps = sitemapUrls.slice(0, 10);

      for (const url of limitedSitemaps) {
        try {
          const pages = await fetchSingleSitemap(url);
          allPages.push(...pages);
        } catch (error) {
          console.warn(`Failed to fetch sitemap ${url}:`, error);
        }
      }

      return allPages;
    } else {
      // This is a regular sitemap
      return await fetchSingleSitemap(sitemapUrl);
    }
  } catch (error) {
    console.error("Error fetching sitemap index:", error);
    throw error;
  }
}

/**
 * Fetch a single sitemap XML file
 */
async function fetchSingleSitemap(sitemapUrl: string): Promise<SitemapPage[]> {
  const response = await fetch(sitemapUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
    },
    next: {
      revalidate: 3600, // Cache for 1 hour
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch sitemap: ${response.status}`);
  }

  const sitemapXml = await response.text();
  const $ = cheerio.load(sitemapXml, { xmlMode: true });

  const pages: SitemapPage[] = [];

  $("url").each((_, element) => {
    const loc = $(element).find("loc").text();
    const priority =
      parseFloat($(element).find("priority").text()) || undefined;
    const changefreq = $(element).find("changefreq").text() || undefined;
    const lastmod = $(element).find("lastmod").text() || undefined;

    if (loc) {
      pages.push({
        url: loc,
        priority,
        changefreq,
        lastmod,
      });
    }
  });

  return pages;
}

/**
 * Manual page discovery by crawling links from homepage
 */
async function discoverPagesManually(baseUrl: string): Promise<SitemapPage[]> {
  try {
    const response = await fetch(baseUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; BWF-SEO-Bot/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch homepage: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const pages: SitemapPage[] = [];
    const foundUrls = new Set<string>();

    // Add the homepage
    foundUrls.add(baseUrl);
    pages.push({ url: baseUrl, priority: 1.0 });

    // Find all internal links
    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      let fullUrl: string;

      if (href.startsWith("http")) {
        // Absolute URL - check if it's the same domain
        const linkDomain = new URL(href).origin;
        const baseDomain = new URL(baseUrl).origin;
        if (linkDomain !== baseDomain) return;
        fullUrl = href;
      } else if (href.startsWith("/")) {
        // Relative URL from root
        fullUrl = `${new URL(baseUrl).origin}${href}`;
      } else if (href.startsWith("#") || href.startsWith("?")) {
        // Fragment or query - skip
        return;
      } else {
        // Relative URL
        fullUrl = `${baseUrl.replace(/\/$/, "")}/${href}`;
      }

      // Clean up URL
      try {
        const url = new URL(fullUrl);
        const cleanUrl = `${url.origin}${url.pathname}`;

        if (!foundUrls.has(cleanUrl)) {
          foundUrls.add(cleanUrl);
          pages.push({ url: cleanUrl, priority: 0.8 });
        }
      } catch {
        // Invalid URL, skip
        console.warn(`Invalid URL found: ${fullUrl}`);
      }
    });

    return pages;
  } catch (error) {
    console.error("Error in manual page discovery:", error);
    return [{ url: baseUrl, priority: 1.0 }];
  }
}

/**
 * Get all unique page paths for Next.js dynamic routing
 */
export async function getAllPagePaths(baseUrl: string): Promise<string[]> {
  const pages = await fetchSitemapPages(baseUrl);
  const baseDomain = new URL(baseUrl).origin;

  return pages
    .map((page) => {
      try {
        const url = new URL(page.url);
        if (url.origin !== baseDomain) return null;

        let path = url.pathname;

        // Convert to Next.js format
        if (path === "/") return "/";

        // Remove trailing slash
        path = path.replace(/\/$/, "");

        return path;
      } catch {
        return null;
      }
    })
    .filter((path): path is string => path !== null)
    .filter((path, index, array) => array.indexOf(path) === index); // Remove duplicates
}
