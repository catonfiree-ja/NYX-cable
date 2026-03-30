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
      // ─── Old slug redirects (existing) ───
      { source: '/products/detail/welding-cable', destination: '/product/welding-cable-h01n2d', permanent: true },
      { source: '/product/welding-cable', destination: '/product/welding-cable-h01n2d', permanent: true },
      { source: '/products/detail/nsshoeu', destination: '/product/nsshou', permanent: true },
      { source: '/product/nsshoeu', destination: '/product/nsshou', permanent: true },
      { source: '/products/detail/igus', destination: '/product/multiflex-cp', permanent: true },
      { source: '/product/igus', destination: '/product/multiflex-cp', permanent: true },
      // ─── Old category slugs (from CSV) ───
      { source: '/products/rubber-cable', destination: '/category/water-resistant-cable', permanent: true },
      { source: '/category/rubber-cable', destination: '/category/water-resistant-cable', permanent: true },
      { source: '/cat/shield-cable', destination: '/category/shielded-cable', permanent: true },
      { source: '/cat/belden', destination: '/category/twisted-pair-cable', permanent: true },
      { source: '/cat/lift-cable', destination: '/category/water-resistant-cable', permanent: true },
      { source: '/cat/dragchain-cable', destination: '/category/high-flex-cable', permanent: true },
      { source: '/cat/automation-cable', destination: '/category/industrial-bus-cable', permanent: true },
      { source: '/cat/heat-resistant-cable', destination: '/category/resistant-cable', permanent: true },
      // ─── Old product slugs → new slugs (from CSV) ───
      { source: '/product/olflex', destination: '/product/olflex-classic-115-cy', permanent: true },
      { source: '/product/double-shield-cable', destination: '/product/double-shielded-cable', permanent: true },
      { source: '/product/rs485-cable', destination: '/product/rs485-rs422-sttp', permanent: true },
      { source: '/product/belden', destination: '/product/rs485-rs422-belden', permanent: true },
      { source: '/product/hosiwell', destination: '/product/rs485-rs422-hosiwell', permanent: true },
      { source: '/product/liycy-tp', destination: '/product/rs485-rs422-liycy-tp', permanent: true },
      { source: '/product/twisted-pair', destination: '/product/rs485-rs422', permanent: true },
      { source: '/product/pvc-flat-cable-h07vvh6-f', destination: '/product/h07vvh6-f', permanent: true },
      { source: '/product/classic-fd-810', destination: '/product/multiflex-p', permanent: true },
      { source: '/product/chainflex', destination: '/product/multiflex-cy', permanent: true },
      { source: '/product/welding-robot-cable', destination: '/product/robot-cable', permanent: true },
      { source: '/product/profibus-cable-outdoor', destination: '/product/profibus-outdoor', permanent: true },
      { source: '/product/profibus-cable-motion-drag-chain', destination: '/product/profibus-drag-chain', permanent: true },
      { source: '/product/profibus-connector-6es7972-0ba12', destination: '/product/profibus-connector-90', permanent: true },
      { source: '/product/profibus-connector-6es7972-0bb12', destination: '/product/profibus-connector-90pg', permanent: true },
      { source: '/product/profinet-cable', destination: '/product/profinet-type-a', permanent: true },
      { source: '/product/profinet-connector-6gk1901-1bb10', destination: '/product/profinet-connector-180', permanent: true },
      { source: '/product/cc-link-cable', destination: '/product/cc-link', permanent: true },
      { source: '/product/heat-resistant-cable', destination: '/product/sif', permanent: true },
      { source: '/product/sif-gl-200', destination: '/product/sif-gl', permanent: true },
      { source: '/product/ignition-wire', destination: '/product/siaf-ignition-wire', permanent: true },
      { source: '/product/pfa-ptfe-etfe-fep', destination: '/product/pfa-cable', permanent: true },
      // ─── Old URL patterns (generic) ───
      { source: '/products/detail/:slug', destination: '/product/:slug', permanent: true },
      { source: '/products/:slug(control-cable|shielded-cable|twisted-pair-cable|wiring-cable|high-flex-cable|industrial-bus-cable|resistant-cable|water-resistant-cable)', destination: '/category/:slug', permanent: true },
      // ─── Original nyxcable.com /cat/ pattern ───
      { source: '/cat/:slug', destination: '/category/:slug', permanent: true },
    ]
  },
}

export default nextConfig
