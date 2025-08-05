import type {Metadata} from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster"
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { cn } from '@/lib/utils';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'UrAi - Your AI Companion for Life Reflection',
  description: 'Transform your daily experiences into meaningful insights with UrAi, your personal AI companion for growth and self-discovery.',
  keywords: ['AI companion', 'life reflection', 'personal growth', 'self-discovery', 'digital journal', 'AI insights'],
  authors: [{ name: 'UrAi Team' }],
  creator: 'UrAi',
  publisher: 'UrAi',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://urai.app'), // Update with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'UrAi - Your AI Companion for Life Reflection',
    description: 'Transform your daily experiences into meaningful insights with UrAi, your personal AI companion for growth and self-discovery.',
    url: 'https://urai.app',
    siteName: 'UrAi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'UrAi - AI Companion for Life Reflection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrAi - Your AI Companion for Life Reflection',
    description: 'Transform your daily experiences into meaningful insights with UrAi, your personal AI companion for growth and self-discovery.',
    images: ['/og-image.png'],
    creator: '@UrAi',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google-site-verification-code', // Add actual verification code
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <AuthProvider>
            {children}
            <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
