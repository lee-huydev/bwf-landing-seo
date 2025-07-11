import OptimizedIframe from "@/components/OptimizedIframe";
import SEOPreview from "@/components/SEOPreview";
import { Metadata } from "next";
import { fetchSEOContent } from "@/lib/seo-content";
import { getAllPagePaths } from "@/lib/sitemap-crawler";
import { notFound } from "next/navigation";

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

    return {
      title: seoContent.title,
      description: seoContent.description,
      keywords: seoContent.keywords,
      openGraph: {
        title: seoContent.title,
        description: seoContent.description,
        images: seoContent.ogImage ? [{ url: seoContent.ogImage }] : [],
        url: fullUrl,
      },
      twitter: {
        title: seoContent.title,
        description: seoContent.description,
        images: seoContent.ogImage ? [seoContent.ogImage] : [],
      },
      alternates: {
        canonical: fullUrl,
      },
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
        <main className="min-h-screen">
          {/* SEO-optimized content from fetched data */}
          <div className="sr-only">
            {seoContent.headings.length > 0 && (
              <h1>{seoContent.headings[0] || `BWF Ventures - ${path}`}</h1>
            )}

            {seoContent.headings.slice(1, 4).map((heading, index) => (
              <h2 key={index}>{heading}</h2>
            ))}

            {seoContent.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}

            <div>
              <h3>Key Information</h3>
              <p>Title: {seoContent.title}</p>
              <p>Description: {seoContent.description}</p>
              {seoContent.keywords && <p>Keywords: {seoContent.keywords}</p>}
            </div>

            {seoContent.images.length > 0 && (
              <div>
                <h3>Images</h3>
                {seoContent.images.slice(0, 5).map((img, index) => (
                  <div key={index}>
                    {img.src && <img src={img.src} alt={img.alt} />}{" "}
                    {/* eslint-disable-line @next/next/no-img-element */}
                    <p>{img.alt}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visible iframe content */}
          <OptimizedIframe
            src={fullUrl}
            title={seoContent.title}
            className="w-full min-h-screen border-0"
          />

          {/* Development SEO preview */}
          {process.env.NODE_ENV === "development" && (
            <div className="fixed bottom-4 right-4 z-50">
              <SEOPreview />
            </div>
          )}
        </main>
      </>
    );
  } catch (error) {
    console.error(`Error loading page ${fullUrl}:`, error);
    notFound();
  }
}
