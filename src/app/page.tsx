import OptimizedIframe from "@/components/OptimizedIframe";
import SEOPreview from "@/components/SEOPreview";
import { Metadata } from "next";
import { fetchSEOContent } from "@/lib/seo-content";

export async function generateMetadata(): Promise<Metadata> {
  const seoContent = await fetchSEOContent();

  return {
    title: seoContent.title,
    description: seoContent.description,
    keywords: seoContent.keywords,
    openGraph: {
      title: seoContent.title,
      description: seoContent.description,
      images: seoContent.ogImage ? [{ url: seoContent.ogImage }] : [],
    },
    twitter: {
      title: seoContent.title,
      description: seoContent.description,
      images: seoContent.ogImage ? [seoContent.ogImage] : [],
    },
  };
}

export default async function Home() {
  // Fetch SEO content on server-side for better SEO
  const seoContent = await fetchSEOContent();

  return (
    <>
      <main className="min-h-screen">
        {/* SEO-optimized content from fetched data */}
        <div className="sr-only">
          {seoContent.headings.length > 0 && (
            <h1>
              {seoContent.headings[0] ||
                "BWF Ventures - Professional Investment Platform"}
            </h1>
          )}

          {seoContent.headings.slice(1, 4).map((heading, index) => (
            <h2 key={index}>{heading}</h2>
          ))}

          {seoContent.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}

          <div>
            <h3>Key Features:</h3>
            <ul>
              <li>Advanced Portfolio Management</li>
              <li>Real-time Market Analytics</li>
              <li>Professional Investment Tools</li>
              <li>Risk Management Solutions</li>
              <li>Performance Tracking</li>
            </ul>
          </div>

          {seoContent.images.length > 0 && (
            <div>
              {seoContent.images.map((image, index) => (
                <div
                  key={index}
                  data-seo-image={image.src}
                  data-seo-alt={
                    image.alt || `BWF Ventures feature ${index + 1}`
                  }
                  style={{ display: "none" }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Client-side iframe for actual functionality */}
        <OptimizedIframe className="w-full h-screen" loading="eager" />
      </main>

      {/* SEO Preview Component (only in development) */}
      {process.env.NODE_ENV === "development" && <SEOPreview />}
    </>
  );
}
