import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Should figure out a better way for this. I do not want to host files though.
    domains: ["images.unsplash.com", "none.com", "www.cultura.trentino.it", "www.italyguide.info", "www.visitdolomites.com", "info.campingmario.com", "www.comune.trento.it"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/map",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
