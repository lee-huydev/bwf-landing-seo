"use client";

import { useState, useEffect } from "react";
import { SEOContent } from "@/lib/seo-content";

interface SEOPreviewProps {
  className?: string;
}

export default function SEOPreview({ className = "" }: SEOPreviewProps) {
  const [seoData, setSeoData] = useState<SEOContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      const response = await fetch("/api/fetch-content");
      if (response.ok) {
        const data = await response.json();
        setSeoData(data);
      }
    } catch (error) {
      console.error("Error fetching SEO data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !seoData) {
    return null;
  }

  return (
    <>
      {/* Toggle button for SEO preview */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors text-sm"
        title="Toggle SEO Preview"
      >
        SEO
      </button>

      {/* SEO Preview Panel */}
      {isVisible && (
        <div
          className={`fixed top-4 right-4 w-80 max-h-96 overflow-y-auto bg-white shadow-xl rounded-lg border z-40 ${className}`}
        >
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg">SEO Preview</h3>
              <button
                onClick={() => setIsVisible(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-sm text-gray-600">Title:</h4>
                <p className="text-sm">{seoData.title}</p>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-600">
                  Description:
                </h4>
                <p className="text-sm text-gray-800">{seoData.description}</p>
              </div>

              {seoData.keywords && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600">
                    Keywords:
                  </h4>
                  <p className="text-xs text-gray-600">{seoData.keywords}</p>
                </div>
              )}

              {seoData.headings.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600">
                    Headings ({seoData.headings.length}):
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    {seoData.headings.slice(0, 5).map((heading, index) => (
                      <li key={index} className="truncate">
                        • {heading}
                      </li>
                    ))}
                    {seoData.headings.length > 5 && (
                      <li className="text-gray-500">
                        ... and {seoData.headings.length - 5} more
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {seoData.paragraphs.length > 0 && (
                <div>
                  <h4 className="font-medium text-sm text-gray-600">
                    Content Snippets:
                  </h4>
                  <div className="text-xs text-gray-700 space-y-1">
                    {seoData.paragraphs.slice(0, 2).map((paragraph, index) => (
                      <p key={index} className="line-clamp-2">
                        {paragraph.substring(0, 100)}...
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Last fetched:{" "}
                  {new Date(seoData.lastFetched).toLocaleTimeString()}
                </p>
                {seoData.error && (
                  <p className="text-xs text-red-500 mt-1">
                    ⚠️ {seoData.error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
