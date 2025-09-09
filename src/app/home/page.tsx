'use client'

import OrgDashboard, { OrgProvider } from '@/components/OrgDashboard';

export default function Home() {
  return (
    <OrgProvider>
      <OrgDashboard dashboards={{}} />
    </OrgProvider>
  );
}
