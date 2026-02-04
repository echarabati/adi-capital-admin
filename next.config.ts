import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';
import withPWA from '@ducanh2912/next-pwa';

// =============================================================================
// Security Headers
// =============================================================================
// Applied to all routes by default. See docs/SECURITY.md for details.
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

// =============================================================================
// Next.js Configuration
// =============================================================================
const nextConfig: NextConfig = {
  // Empty turbopack config silences the webpack/turbopack warning
  // next-pwa uses webpack but works fine with Turbopack for dev
  turbopack: {},

  // Allow external images from OAuth providers (Google, GitHub, etc.)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google profile pictures
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com', // GitHub profile pictures
      },
    ],
  },

  // Security headers for all routes
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

// =============================================================================
// PWA Configuration
// =============================================================================
const pwaConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  workboxOptions: {
    skipWaiting: true,
    clientsClaim: true,
    // CRITICAL: API default is NetworkOnly (security-first)
    runtimeCaching: [
      // Next.js static - CacheFirst (immutable hashes)
      {
        urlPattern: /\/_next\/static\/.*/i,
        handler: 'CacheFirst',
        options: { cacheName: 'next-static' },
      },
      // Media & fonts only (js/css already covered by _next/static)
      {
        urlPattern: /\.(woff2?|png|jpg|webp|svg|ico)$/i,
        handler: 'StaleWhileRevalidate',
        options: { cacheName: 'static-assets' },
      },
      // API - NetworkOnly by default (safe)
      {
        urlPattern: /\/api\/.*/i,
        handler: 'NetworkOnly',
      },
    ],
  },
});

// =============================================================================
// Sentry Configuration (only active if DSN is defined)
// =============================================================================
const sentryEnabled = !!process.env.NEXT_PUBLIC_SENTRY_DSN;

const sentryConfig = sentryEnabled
  ? withSentryConfig(pwaConfig(nextConfig), {
      // Sentry organization settings
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,

      // Silent build outputs
      silent: !process.env.CI,

      // Source maps (hidden in production)
      sourcemaps: {
        deleteSourcemapsAfterUpload: true,
      },
    })
  : pwaConfig(nextConfig);

export default sentryConfig;
