import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  // Server-rendered share images read the local static font faces at runtime.
  outputFileTracingIncludes: {
    "/opengraph-image": ["./public/fonts/*.ttf"],
    "/showcase/*/opengraph-image": ["./public/fonts/*.ttf"],
    "/gigs/*/opengraph-image": ["./public/fonts/*.ttf"],
    "/competitions/*/opengraph-image": ["./public/fonts/*.ttf"],
  },
  images: {
    // Project images can be pasted from any https URL; avatars come from
    // Google / Supabase Storage. Allow any https host for next/image.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
