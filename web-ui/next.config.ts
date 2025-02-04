import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["images.unsplash.com", "none.com"], // Should figure out a better way for this. I do not want to host files though.
  },
};

export default nextConfig;
