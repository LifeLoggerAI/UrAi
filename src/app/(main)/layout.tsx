import type { ReactNode } from 'react';
import MainLayout from '@/components/layout/MainLayout';

export default function MainGroupLayout({ children }: { children: ReactNode }) {
  return <MainLayout>{children}</MainLayout>;
}
