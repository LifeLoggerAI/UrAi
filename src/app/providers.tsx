'use client';

import * as React from 'react';

export default function AppProviders({ children }: { children: React.ReactNode }) {
  // Add any real providers here later (theme, query, auth, etc.)
  return <>{children}</>;
}
