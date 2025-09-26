import './globals.css';
import type { Metadata } from 'next';
import AppProviders from './providers';
import React from 'react';

export const metadata: Metadata = {
  title: 'URAI',
  description: 'Your Emotional Media OS',
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

