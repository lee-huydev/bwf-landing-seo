import OptimizedIframe from "@/components/OptimizedIframe";
import SEOPreview from "@/components/SEOPreview";
import { Metadata } from "next";
import { fetchSEOContent, SEOContent } from "@/lib/seo-content";

// JSON-LD structured data component
function StructuredData({ seoContent }: { seoContent: SEOContent }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${seoContent.canonical}/#organization`,
        name:
          seoContent.title ||
          process.env.NEXT_PUBLIC_SITE_NAME ||
          "Investment Platform",
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
        "@id": `${seoContent.canonical}/#webpage`,
        url: seoContent.canonical,
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
          ],
        },
      },
      // Only add Service schema if we have relevant content from source
      ...(seoContent.description &&
      seoContent.description.toLowerCase().includes("platform")
        ? [
            {
              "@type": "Service",
              name: seoContent.title,
              description: seoContent.description,
              provider: {
                "@id": `${seoContent.canonical}/#organization`,
              },
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

export async function generateMetadata(): Promise<Metadata> {
  const seoContent = await fetchSEOContent();

  return {
    title:
      seoContent.title ||
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Professional Platform",
    description:
      seoContent.description || process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "",
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
      url: seoContent.canonical,
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
            alt: seoContent.title || "Platform Image",
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
      canonical: seoContent.canonical,
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
    other: {
      ...(seoContent.title && { "application-name": seoContent.title }),
      "apple-mobile-web-app-capable": "yes",
      "apple-mobile-web-app-status-bar-style": "default",
      ...(seoContent.title && {
        "apple-mobile-web-app-title": seoContent.title,
      }),
      "format-detection": "telephone=no",
      "mobile-web-app-capable": "yes",
      "theme-color": "#000000",
    },
  };
}

export default async function Home() {
  // Fetch SEO content on server-side for better SEO
  const seoContent = await fetchSEOContent();

  // console.log("SEO Content fetched:", seoContent);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <StructuredData seoContent={seoContent} />

      <main className="min-h-screen">
        {/* SEO-optimized content from fetched data */}
        <div className="sr-only">
          {/* Main heading - prioritize from source */}
          {seoContent.headings.length > 0 && (
            <h1>
              {seoContent.headings[0] ||
                process.env.NEXT_PUBLIC_SITE_NAME ||
                "Professional Platform"}
            </h1>
          )}

          {/* Subheadings */}
          {seoContent.headings.slice(1, 6).map((heading, index) => (
            <h2 key={index}>{heading}</h2>
          ))}

          {/* Main content paragraphs */}
          {seoContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          {/* About section - use source description */}
          {seoContent.description && (
            <div>
              <h2>About {seoContent.title || "Platform"}</h2>
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

          {/* Images with proper alt text */}
          {seoContent.images.length > 0 && (
            <div>
              <h3>Platform Features</h3>
              {seoContent.images.map((image, index) => (
                <div key={index}>
                  <img
                    src={image.src}
                    alt={image.alt || `Platform feature ${index + 1}`}
                    style={{ display: "none" }}
                    // eslint-disable-next-line @next/next/no-img-element
                  />
                  <p>{image.alt || `Platform interface ${index + 1}`}</p>
                </div>
              ))}
            </div>
          )}

          {/* Contact Information - use source canonical */}
          <div>
            <h3>Contact Information</h3>
            <address>
              <p>{seoContent.title || "Professional Platform"}</p>
              {seoContent.description && <p>{seoContent.description}</p>}
              <p>
                Website:{" "}
                <a href={seoContent.canonical}>{seoContent.canonical}</a>
              </p>
            </address>
          </div>

          {/* FAQ Section - only if we have content from source */}
          {(seoContent.title || seoContent.description) && (
            <div>
              <h3>Frequently Asked Questions</h3>
              {seoContent.title && (
                <div>
                  <h4>What is {seoContent.title}?</h4>
                  <p>
                    {seoContent.description ||
                      "A professional platform providing advanced solutions."}
                  </p>
                </div>
              )}
              {seoContent.description &&
                seoContent.description.toLowerCase().includes("platform") && (
                  <div>
                    <h4>How does the platform work?</h4>
                    <p>
                      Our platform provides comprehensive solutions and
                      professional services.
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>

        {/* Client-side iframe for actual functionality */}
        <OptimizedIframe
          src={process.env.NEXT_PUBLIC_IFRAME_URL}
          className="w-full h-screen"
          loading="eager"
          favicon={seoContent.favicon}
          themeColor={process.env.NEXT_PUBLIC_THEME_COLOR}
        />
      </main>

      {/* SEO Preview Component (only in development) */}
      {process.env.NODE_ENV === "development" && <SEOPreview />}
    </>
  );
}
