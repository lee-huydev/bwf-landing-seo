"use client";

import { useState, useEffect, useCallback } from "react";

interface OptimizedIframeProps {
  src?: string;
  title?: string;
  className?: string;
  loading?: "lazy" | "eager";
  sandbox?: string;
}

export default function OptimizedIframe({
  src = process.env.NEXT_PUBLIC_IFRAME_URL ||
    "https://bwfventures.framer.website",
  title = "BWF Ventures - Professional Investment Platform",
  className = "",
  loading = "lazy",
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation",
}: OptimizedIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const iframeContainer = document.querySelector("[data-iframe-container]");
    if (iframeContainer) {
      observer.observe(iframeContainer);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      data-iframe-container
      className={`relative w-full h-screen overflow-hidden ${className}`}
      role="main"
      aria-label="BWF Ventures Platform"
    >
      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading BWF Ventures Platform...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-red-500 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Platform
            </h2>
            <p className="text-gray-600 mb-4">
              We&apos;re experiencing technical difficulties loading the BWF
              Ventures platform. Please try refreshing the page or contact
              support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Iframe */}
      {(isIntersecting || loading === "eager") && (
        <iframe
          src={src}
          title={title}
          loading={loading}
          sandbox={sandbox}
          onLoad={handleLoad}
          onError={handleError}
          className={`w-full h-full border-0 ${
            isLoading ? "opacity-0" : "opacity-100"
          } transition-opacity duration-300`}
          allow="accelerometer; autoplay; camera; encrypted-media; geolocation; gyroscope; microphone; midi; payment; usb; xr-spatial-tracking"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      )}

      {/* SEO Content for Search Engines */}
      <div className="sr-only">
        <h1>BWF Ventures - Professional Investment Platform</h1>
        <p>
          Access our comprehensive investment platform featuring advanced
          portfolio management, real-time analytics, and professional-grade
          investment tools. BWF Ventures provides institutional-quality
          investment solutions for sophisticated investors.
        </p>
        <ul>
          <li>Advanced Portfolio Management</li>
          <li>Real-time Market Analytics</li>
          <li>Professional Investment Tools</li>
          <li>Risk Management Solutions</li>
          <li>Performance Tracking</li>
        </ul>
      </div>
    </div>
  );
}
