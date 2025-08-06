import type { Metadata } from 'next';
import { Toaster } from "@/components/ui/toaster";
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

// Use a local fallback for fonts to avoid network issues
const fontSans =
  "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif";

export const metadata: Metadata = {
  title: 'UrAi - Your Personal AI for Life Logging & Self-Reflection',
  description:
    'Transform your thoughts into insights with UrAi. Your personal AI companion for life logging, self-reflection, and meaningful growth. Discover patterns, track progress, and unlock your inner wisdom.',
  keywords: [
    'life logging',
    'AI companion',
    'self-reflection',
    'personal growth',
    'mindfulness',
    'journaling'
  ],
  authors: [{ name: 'UrAi Team' }],
  creator: 'UrAi',
  publisher: 'UrAi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false
  },
  metadataBase: new URL('https://urai.app'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'UrAi - Your Personal AI for Life Logging & Self-Reflection',
    description:
      'Transform your thoughts into insights with UrAi. Your personal AI companion for life logging, self-reflection, and meaningful growth.',
    url: 'https://urai.app',
    siteName: 'UrAi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UrAi - Personal AI for Life Logging'
      }
    ],
    locale: 'en_US',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrAi - Your Personal AI for Life Logging & Self-Reflection',
    description:
      'Transform your thoughts into insights with UrAi. Your personal AI companion for life logging, self-reflection, and meaningful growth.',
    images: ['/og-image.png'],
    creator: '@UrAi'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'google-site-verification-code' // ✅ Replace with your actual verification code
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn('min-h-screen bg-background font-sans antialiased')}
        style={{ fontFamily: fontSans }}
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
