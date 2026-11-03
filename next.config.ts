import type { NextConfig } from "next";

// The site lives at https://sdooodly.github.io/saveTheSadhya/, so production
// builds need the /saveTheSadhya prefix. `next build` always runs with
// NODE_ENV=production, so no environment variables need remembering;
// `next dev` runs at the root (http://localhost:3000/).
const basePath = process.env.NODE_ENV === "production" ? "/saveTheSadhya" : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
