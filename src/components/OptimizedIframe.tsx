"use client";

import { useState, useEffect, useCallback } from "react";

interface OptimizedIframeProps {
  src?: string;
  title?: string;
  className?: string;
  loading?: "lazy" | "eager";
  sandbox?: string;
  favicon?: string;
  themeColor?: string;
}

export default function OptimizedIframe({
  src = "https://bwfventures.framer.website",
  className = "",
  loading = "lazy",
  sandbox = "allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation",
  favicon,
  themeColor = "#3b82f6",
}: OptimizedIframeProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleLoad = useCallback(() => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setHasError(false);
    }, 300);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    setProgress(0);
  }, []);

  // Simulate loading progress
  useEffect(() => {
    if (isLoading && (isIntersecting || loading === "eager")) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [isLoading, isIntersecting, loading]);

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
      {/* Loading State with Progress */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="w-full max-w-sm px-8">
            <div className="space-y-6">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg border border-gray-200">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt="Platform favicon"
                      className="w-8 h-8 object-contain"
                      onError={(e) => {
                        // Fallback to lightning icon if favicon fails to load
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextElementSibling?.setAttribute(
                          "style",
                          "display: block"
                        );
                      }}
                      // eslint-disable-next-line @next/next/no-img-element
                    />
                  ) : null}
                  <svg
                    className={`w-8 h-8 ${favicon ? "hidden" : "block"}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{
                      display: favicon ? "none" : "block",
                      color: themeColor,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div
                  className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200"
                  style={
                    {
                      "--theme-color": themeColor,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className="h-full transition-all duration-300 ease-in-out rounded-full"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: `var(--theme-color, ${themeColor})`,
                      minWidth: progress > 0 ? "8px" : "0px",
                    }}
                  />
                </div>
              </div>
            </div>
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
              className="px-4 py-2 text-white rounded-md hover:opacity-90 transition-colors"
              style={{
                backgroundColor: themeColor,
              }}
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
          //   title={title}
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
    </div>
  );
}
