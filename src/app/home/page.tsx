'use client'

import OrgDashboard, { OrgProvider } from '@/app/roadmap/OrgDashboard';

export default function Home() {
  return (
    <OrgProvider>
      <OrgDashboard dashboards={{}} />
    </OrgProvider>
  );
}
