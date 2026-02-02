import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const appName = process.env.NEXT_PUBLIC_APP_NAME || 'TimeKast App';
  const shortName = process.env.NEXT_PUBLIC_APP_SHORT_NAME || appName;

  return {
    name: appName,
    short_name: shortName,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Built with TimeKast Starter Kit',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a1628', // midnight theme
    theme_color: '#1e40af',
    icons: [
      { src: '/pwa/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa/icon-512.png', sizes: '512x512', type: 'image/png' },
      {
        src: '/pwa/maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
