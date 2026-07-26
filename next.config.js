const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
  },
});

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

module.exports = withPWA(nextConfig);
