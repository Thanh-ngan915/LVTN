import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/products/:path*',
        destination: 'http://localhost:8087/api/products/:path*',
      },
      {
        source: '/api/categories/:path*',
        destination: 'http://localhost:8087/api/categories/:path*',
      },
      {
        source: '/api/categories',
        destination: 'http://localhost:8087/api/categories',
      },
      {
        source: '/api/ratings/:path*',
        destination: 'http://localhost:8088/api/ratings/:path*',
      },
      {
        source: '/api/cart/:path*',
        destination: 'http://localhost:8087/api/cart/:path*',
      },
      {
        source: '/api/cart',
        destination: 'http://localhost:8087/api/cart',
      },
      {
        source: '/api/:path*',
        destination: 'http://localhost:8086/api/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
