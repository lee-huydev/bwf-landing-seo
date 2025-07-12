import OptimizedIframe from "@/components/OptimizedIframe";
import SEOPreview from "@/components/SEOPreview";
import { Metadata } from "next";
import { fetchSEOContent, SEOContent } from "@/lib/seo-content";
import { getAllPagePaths } from "@/lib/sitemap-crawler";
import { notFound } from "next/navigation";

// JSON-LD structured data component for dynamic pages
function StructuredData({
  seoContent,
  fullUrl,
}: {
  seoContent: SEOContent;
  fullUrl: string;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seoContent.canonical}/#organization`,
        name:
          seoContent.title ||
          process.env.NEXT_PUBLIC_SITE_NAME ||
          "Professional Platform",
        url: seoContent.canonical,
        description: seoContent.description,
        ...(seoContent.ogImage && {
          logo: {
            "@type": "ImageObject",
            url: seoContent.ogImage,
          },
        }),
      },
      {
        "@type": "WebSite",
        "@id": `${seoContent.canonical}/#website`,
        url: seoContent.canonical,
        name: seoContent.title,
        description: seoContent.description,
        publisher: {
          "@id": `${seoContent.canonical}/#organization`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "WebPage",
        "@id": `${fullUrl}/#webpage`,
        url: fullUrl,
        name: seoContent.title,
        description: seoContent.description,
        isPartOf: {
          "@id": `${seoContent.canonical}/#website`,
        },
        about: {
          "@id": `${seoContent.canonical}/#organization`,
        },
        datePublished: new Date().toISOString(),
        dateModified: seoContent.lastFetched,
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: seoContent.headings[0] || "Home",
              item: seoContent.canonical,
            },
            {
              "@type": "ListItem",
              position: 2,
              name: seoContent.title,
              item: fullUrl,
            },
          ],
        },
      },
      // Add Article schema if we have content
      ...(seoContent.paragraphs.length > 0
        ? [
            {
              "@type": "Article",
              "@id": `${fullUrl}/#article`,
              headline: seoContent.title,
              description: seoContent.description,
              author: {
                "@id": `${seoContent.canonical}/#organization`,
              },
              publisher: {
                "@id": `${seoContent.canonical}/#organization`,
              },
              datePublished: new Date().toISOString(),
              dateModified: seoContent.lastFetched,
              mainEntityOfPage: {
                "@id": `${fullUrl}/#webpage`,
              },
              ...(seoContent.ogImage && {
                image: {
                  "@type": "ImageObject",
                  url: seoContent.ogImage,
                },
              }),
              ...(seoContent.keywords && { keywords: seoContent.keywords }),
            },
          ]
        : []),
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface PageProps {
  params: Promise<{
    slug?: string[];
  }>;
}

export async function generateStaticParams() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_IFRAME_URL ||
      "https://bwfventures.framer.website";
    const paths = await getAllPagePaths(baseUrl);

    return paths
      .filter((path) => path !== "/") // Exclude homepage (handled by main page.tsx)
      .map((path) => ({
        slug: path.split("/").filter(Boolean), // Convert "/about/team" to ["about", "team"]
      }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const path = resolvedParams.slug ? `/${resolvedParams.slug.join("/")}` : "/";
  const baseUrl =
    process.env.NEXT_PUBLIC_IFRAME_URL || "https://bwfventures.framer.website";
  const fullUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;

  console.log(`Generating metadata for: ${fullUrl}`);

  try {
    const seoContent = await fetchSEOContent(fullUrl);

    console.log("SEO Content fetched:", seoContent);

    return {
      title:
        seoContent.title ||
        process.env.NEXT_PUBLIC_SITE_NAME ||
        "Professional Platform",
      description:
        seoContent.description ||
        process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
        "",
      ...(seoContent.keywords && { keywords: seoContent.keywords }),
      ...(seoContent.title && { authors: [{ name: seoContent.title }] }),
      creator: seoContent.title || process.env.NEXT_PUBLIC_SITE_NAME || "",
      publisher: seoContent.title || process.env.NEXT_PUBLIC_SITE_NAME || "",
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
      openGraph: {
        type: "website",
        locale: "en_US",
        url: fullUrl,
        title: seoContent.title || process.env.NEXT_PUBLIC_SITE_NAME || "",
        description:
          seoContent.description ||
          process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
          "",
        siteName: seoContent.title || process.env.NEXT_PUBLIC_SITE_NAME || "",
        ...(seoContent.ogImage && {
          images: [
            {
              url: seoContent.ogImage,
              width: 1200,
              height: 630,
              alt: seoContent.title || "Page Image",
            },
          ],
        }),
      },
      twitter: {
        card: "summary_large_image",
        title: seoContent.title || process.env.NEXT_PUBLIC_SITE_NAME || "",
        description:
          seoContent.description ||
          process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
          "",
        ...(seoContent.ogImage && { images: [seoContent.ogImage] }),
      },
      alternates: {
        canonical: fullUrl,
      },
      icons: {
        icon: seoContent.favicon || "/favicon.ico",
        shortcut: seoContent.favicon || "/favicon.ico",
        apple: seoContent.favicon || "/favicon.ico",
      },
      ...(seoContent.description &&
        seoContent.description.toLowerCase().includes("business") && {
          category: "Business Platform",
        }),
    };
  } catch (error) {
    console.error(`Error generating metadata for ${fullUrl}:`, error);
    notFound();
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  const path = resolvedParams.slug ? `/${resolvedParams.slug.join("/")}` : "/";
  const baseUrl =
    process.env.NEXT_PUBLIC_IFRAME_URL || "https://bwfventures.framer.website";
  const fullUrl = path === "/" ? baseUrl : `${baseUrl}${path}`;

  try {
    // Fetch SEO content on server-side for better SEO
    const seoContent = await fetchSEOContent(fullUrl);

    return (
      <>
        {/* JSON-LD Structured Data */}
        <StructuredData seoContent={seoContent} fullUrl={fullUrl} />

        <main className="min-h-screen">
          {/* SEO-optimized content from fetched data */}
          <div className="sr-only">
            {/* Main heading - prioritize from source */}
            {seoContent.headings.length > 0 && (
              <h1>
                {seoContent.headings[0] || seoContent.title || `Page - ${path}`}
              </h1>
            )}

            {/* Subheadings from source */}
            {seoContent.headings.slice(1, 6).map((heading, index) => (
              <h2 key={index}>{heading}</h2>
            ))}

            {/* Main content paragraphs from source */}
            {seoContent.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            {/* About section - use source description */}
            {seoContent.description && (
              <div>
                <h3>About {seoContent.title || "Page"}</h3>
                <p>{seoContent.description}</p>
              </div>
            )}

            {/* Keywords for SEO - only if available from source */}
            {seoContent.keywords && (
              <div>
                <h3>Focus Areas:</h3>
                <p>Keywords: {seoContent.keywords}</p>
              </div>
            )}

            {/* Images with proper alt text from source */}
            {seoContent.images.length > 0 && (
              <div>
                <h3>Page Features</h3>
                {seoContent.images.slice(0, 5).map((img, index) => (
                  <div key={index}>
                    {img.src && (
                      <img
                        src={img.src}
                        alt={img.alt || `Page feature ${index + 1}`}
                        style={{ display: "none" }}
                        // eslint-disable-next-line @next/next/no-img-element
                      />
                    )}
                    <p>{img.alt || `Page content ${index + 1}`}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Contact Information - use source canonical */}
            <div>
              <h3>Page Information</h3>
              <address>
                <p>{seoContent.title || "Professional Page"}</p>
                {seoContent.description && <p>{seoContent.description}</p>}
                <p>
                  URL: <a href={fullUrl}>{fullUrl}</a>
                </p>
              </address>
            </div>
          </div>

          {/* Visible iframe content */}
          <OptimizedIframe
            src={fullUrl}
            title={seoContent.title}
            className="w-full min-h-screen border-0"
            favicon={seoContent.favicon}
            themeColor={process.env.NEXT_PUBLIC_THEME_COLOR}
          />

          {/* Development SEO preview */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 z-50">
              <SEOPreview />
            </div>
          )}
        </main>

        {/* Structured data for SEO */}
        <StructuredData seoContent={seoContent} fullUrl={fullUrl} />
      </>
    );
  } catch (error) {
    console.error(`Error loading page ${fullUrl}:`, error);
    notFound();
  }
}
