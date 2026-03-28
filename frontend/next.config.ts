import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
    ],
  },

  // 301 redirects from old WordPress URLs to new Next.js routes
  async redirects() {
    return [
      // Old product URL pattern: /product/slug → /products/detail/slug
      { source: '/product/:slug', destination: '/products/detail/:slug', permanent: true },
      // Old category URL pattern: /product-category/slug → /products
      { source: '/product-category/:slug', destination: '/products', permanent: true },
      // Old blog category
      { source: '/category/:slug', destination: '/blog', permanent: true },
      // Old page slugs
      { source: '/contact-us', destination: '/contact', permanent: true },
      { source: '/about-us', destination: '/about', permanent: true },
      { source: '/about-nyx-cable', destination: '/about', permanent: true },
      // Old WordPress pages
      { source: '/wp-admin', destination: '/studio', permanent: false },
      { source: '/wp-login.php', destination: '/studio', permanent: false },
      // Thai slug redirects → English slugs
      { source: '/products/detail/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5', destination: '/products/detail/control-cable', permanent: true },
      { source: '/products/detail/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%A1%E0%B8%B1%E0%B8%A5%E0%B8%95%E0%B8%B4%E0%B8%84%E0%B8%AD%E0%B8%A3%E0%B9%8C', destination: '/products/detail/multicore-cable', permanent: true },
      // Old WordPress Thai variant URL pattern
      { source: '/%E0%B8%AA%E0%B8%B2%E0%B8%A2%E0%B8%84%E0%B8%AD%E0%B8%99%E0%B9%82%E0%B8%97%E0%B8%A3%E0%B8%A5/:variant', destination: '/products/variant/:variant', permanent: true },
      // Old WordPress shop path
      { source: '/shop/:path*', destination: '/products', permanent: true },
      // Old WordPress category path: /cat/slug
      { source: '/cat/:slug', destination: '/products', permanent: true },
    ]
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
};

export default nextConfig;
