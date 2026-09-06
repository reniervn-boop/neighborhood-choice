import type { NextConfig } from "next";

/**
 * Firebase Storage host for this project, derived from the public bucket name
 * so it follows the environment rather than being pinned to one project.
 */
const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

const nextConfig: NextConfig = {
  // Don't advertise the framework version to anyone scanning the site.
  poweredByHeader: false,

  images: {
    remotePatterns: [
      // Resident photo uploads (reports, listings, event photos).
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      ...(storageBucket
        ? ([{ protocol: "https", hostname: storageBucket }] as const)
        : []),
    ],
    // Cadastral maps and photos are re-encoded on demand; a long TTL keeps
    // repeat visits cheap on mobile data.
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // The app is not meant to be framed by anyone.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak resident report URLs to third-party sites.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Geolocation drives report location; the Halloween report form uses
          // capture="environment" on its file input, so keep camera allowed.
          {
            key: "Permissions-Policy",
            value: "microphone=(), payment=(), geolocation=(self), camera=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
