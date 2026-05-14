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
        source: '/uploads/:path*',
        destination: 'http://localhost:8085/uploads/:path*',
      },
      {
        source: '/api/users/:path*',
        destination: 'http://localhost:8080/api/users/:path*',
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
        source: '/api/orders/:path*',
        destination: 'http://localhost:8088/api/orders/:path*',
      },
      {
        source: '/api/orders',
        destination: 'http://localhost:8088/api/orders',
      },
      {
         source: '/api/stores/:path*',
         destination: 'http://localhost:8090/api/stores/:path*',
      },
      {
         source: '/api/stores',
         destination: 'http://localhost:8090/api/stores',
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
