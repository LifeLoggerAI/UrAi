import './globals.css';
import './lifemap-polish.css';
import './lifemap-production.css';
import '../styles/urai-cinematic.css';
import '../styles/urai-home-final.css';
import '../styles/urai-home-production-overlay.css';
import '../styles/spatial-life-map.css';
import '../styles/spatial-life-map-unwind.css';
import '../styles/urai-fullscreen-final-lock.css';
import React from 'react';
import AppProviders from './providers';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3014';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'URAI — Passive Emotional OS',
    template: '%s | URAI'
  },
  description:
    'URAI is a passive emotional operating system prototype for memory, mood forecasting, symbolic reflection, and companion narration.',
  applicationName: 'URAI',
  keywords: [
    'URAI',
    'emotional operating system',
    'passive life logging',
    'memory constellation',
    'AI companion',
    'mood forecasting'
  ],
  authors: [{ name: 'URAI Labs' }],
  creator: 'URAI Labs',
  publisher: 'URAI Labs',
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName: 'URAI',
    title: 'URAI — Passive Emotional OS',
    description:
      'A symbolic life mirror for memory, mood forecasting, emotional reflection, and companion narration.'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'URAI — Passive Emotional OS',
    description:
      'A symbolic life mirror for memory, mood forecasting, emotional reflection, and companion narration.'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
