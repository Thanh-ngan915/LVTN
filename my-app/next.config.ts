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
        source: '/api/admin/settlements/:path*',
        destination: `${GATEWAY_URL}/api/admin/settlements/:path*`,
      },
      {
        source: '/api/admin/:path*',
        destination: `${GATEWAY_URL}/api/admin/:path*`,
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
        destination: `${GATEWAY_URL}/uploads/:path*`,
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
        destination: `${GATEWAY_URL}/api/auth/:path*`,
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
         source: '/api/complaints/:path*',
         destination: `${GATEWAY_URL}/api/complaints/:path*`,
      },
      {
         source: '/api/complaints',
         destination: `${GATEWAY_URL}/api/complaints`,
      },
      {
         source: '/api/vouchers/:path*',
         destination: `${GATEWAY_URL}/api/vouchers/:path*`,
      },
      {
         source: '/api/seller/:path*',
         destination: `${GATEWAY_URL}/api/seller/:path*`,
      },

      // Livestream service - direct
      {
        source: '/api/livestream/:path*',
        destination: `${GATEWAY_URL}/api/livestream/:path*`,
      },
      {
        source: '/api/chat/:path*',
        destination: `${GATEWAY_URL}/api/chat/:path*`,
      },
      // Catch-all - phải đặt CUỐI CÙNG
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
