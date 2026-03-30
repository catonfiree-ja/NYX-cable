import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'nyxcable.com' },
      { protocol: 'http', hostname: 'nyxcable.com' },
    ],
  },
  async redirects() {
    return [
      // ─── Old slug redirects ───
      { source: '/products/detail/welding-cable', destination: '/product/welding-cable-h01n2d', permanent: true },
      { source: '/product/welding-cable', destination: '/product/welding-cable-h01n2d', permanent: true },
      { source: '/products/detail/nsshoeu', destination: '/product/nsshou', permanent: true },
      { source: '/product/nsshoeu', destination: '/product/nsshou', permanent: true },
      { source: '/products/detail/igus', destination: '/product/multiflex-cp', permanent: true },
      { source: '/product/igus', destination: '/product/multiflex-cp', permanent: true },
      // ─── Old category slug ───
      { source: '/products/rubber-cable', destination: '/category/water-resistant-cable', permanent: true },
      { source: '/category/rubber-cable', destination: '/category/water-resistant-cable', permanent: true },
      // ─── Old URL patterns (generic) ───
      { source: '/products/detail/:slug', destination: '/product/:slug', permanent: true },
      { source: '/products/:slug(control-cable|shielded-cable|twisted-pair-cable|wiring-cable|high-flex-cable|industrial-bus-cable|resistant-cable|water-resistant-cable)', destination: '/category/:slug', permanent: true },
      // ─── Original nyxcable.com URL patterns ───
      { source: '/cat/:slug', destination: '/category/:slug', permanent: true },
    ]
  },
}

export default nextConfig
