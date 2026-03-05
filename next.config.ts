import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Wymagane do Dockerfile — generuje minimalny server.js
  output: "standalone",
};

export default nextConfig;