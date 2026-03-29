import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Necesario para que Next.js confíe en los headers del proxy inverso (Traefik)
  // y genere URLs correctas (https) en lugar de http
  experimental: {
    trustHostHeader: true,
  },
};

export default nextConfig;
