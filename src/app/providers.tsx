'use client';

import { PropsWithChildren } from 'react';
import { usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { initAuthClient } from './auth';

const { AuthProvider } = initAuthClient();

export default function AppProviders({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const isOnboardingRoute = pathname?.startsWith('/onboarding');

  return (
    <AuthProvider>
      {isOnboardingRoute ? children : <MainLayout>{children}</MainLayout>}
    </AuthProvider>
  );
}

