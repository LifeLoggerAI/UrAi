import './globals.css';
import './lifemap-polish.css';
import './lifemap-production.css';
import '../styles/urai-cinematic.css';
import '../styles/urai-home-final.css';
import '../styles/urai-home-production-overlay.css';
import '../styles/spatial-life-map.css';
import '../styles/spatial-life-map-unwind.css';
import '../styles/cinematic-life-map.css';
import '../styles/urai-fullscreen-final-lock.css';
import React from 'react';
import AppProviders from './providers';
import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3014';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: 'URAI', template: '%s | URAI' },
  description: 'URAI cinematic life map and home shrine.',
  applicationName: 'URAI'
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
