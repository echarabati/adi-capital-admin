import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/components/ui/sonner';
import { Providers } from '@/components/providers/Providers';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#1e40af',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'TimeKast Starter',
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'TimeKast Factory - Starter Kit Template',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: process.env.NEXT_PUBLIC_APP_NAME || 'TimeKast App',
  },
  icons: {
    icon: '/icon.png', // Transparent favicon for browser tab
    apple: { url: '/pwa/apple-touch-icon.png', sizes: '180x180' }, // Opaque icon for iOS
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="midnight" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
