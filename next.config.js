/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce response headers
  poweredByHeader: false,

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
    // Enable partial pre-rendering for faster initial loads
    optimizePackageImports: ["recharts", "date-fns", "zod"],
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Custom headers for caching static assets
  async headers() {
    return [
      {
        source: "/:path*.(svg|png|jpg|jpeg|webp|avif|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
