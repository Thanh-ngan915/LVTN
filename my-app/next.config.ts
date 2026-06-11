import type { NextConfig } from "next";

// Sử dụng env vars để hỗ trợ cả dev (localhost) và Docker (service names)
const PRODUCT_SVC    = process.env.PRODUCT_SERVICE_URL    || "http://localhost:8087";
const USER_SVC       = process.env.USER_SERVICE_URL       || "http://localhost:8085";
const ORDER_SVC      = process.env.ORDER_SERVICE_URL      || "http://localhost:8088";
const STORE_SVC      = process.env.STORE_SERVICE_URL      || "http://localhost:8090";
const GATEWAY_URL    = process.env.GATEWAY_URL            || "http://localhost:8080";
const LIVESTREAM_SVC = process.env.LIVESTREAM_SERVICE_URL || "http://localhost:8086";

const nextConfig: NextConfig = {
  output: 'standalone', // Bắt buộc cho Dockerfile multi-stage build
  async rewrites() {
    return [
      {
        source: '/api/admin/:path*',
        destination: `${USER_SVC}/api/admin/:path*`,
      },
      {
        source: '/api/products/:path*',
        destination: `${GATEWAY_URL}/api/products/:path*`,
      },
      {
        source: '/api/categories/:path*',
        destination: `${GATEWAY_URL}/api/categories/:path*`,
      },
      {
        source: '/api/categories',
        destination: `${GATEWAY_URL}/api/categories`,
      },
      {
        source: '/uploads/:path*',
        destination: `${USER_SVC}/uploads/:path*`,
      },
      {
        source: '/api/users/:path*',
        destination: `${GATEWAY_URL}/api/users/:path*`,
      },
      {
        source: '/api/ratings/:path*',
        destination: `${GATEWAY_URL}/api/ratings/:path*`,
      },
      {
        source: '/api/cart/:path*',
        destination: `${GATEWAY_URL}/api/cart/:path*`,
      },
      {
        source: '/api/auth/:path*',
        destination: `${USER_SVC}/api/auth/:path*`,
      },
      {
        source: '/api/cart',
        destination: `${GATEWAY_URL}/api/cart`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${GATEWAY_URL}/api/orders/:path*`,
      },
      {
        source: '/api/orders',
        destination: `${GATEWAY_URL}/api/orders`,
      },
      {
         source: '/api/stores/:path*',
         destination: `${GATEWAY_URL}/api/stores/:path*`,
      },
      {
         source: '/api/stores',
         destination: `${GATEWAY_URL}/api/stores`,
      },
      {
            source: '/api/:path*',
            destination: `${GATEWAY_URL}/api/:path*`,
      },
      {
         source: '/api/vouchers/:path*',
         destination: `${GATEWAY_URL}/api/vouchers/:path*`,
      },
      {
         source: '/api/seller/:path*',
         destination: `${ORDER_SVC}/api/seller/:path*`,
      },
      {
        source: '/api/:path*',
        destination: `${GATEWAY_URL}/api/:path*`,
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
