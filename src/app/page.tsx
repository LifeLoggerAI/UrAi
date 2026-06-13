'use client';

import UraiHomeLaunchSurface from "@/components/urai/UraiHomeLaunchSurface";
import UraiProviderTree from "@/providers/UraiProviderTree";

// Triggering CI/CD workflow
export default function RootPage() {
  return (
    <UraiProviderTree>
      <UraiHomeLaunchSurface />
    </UraiProviderTree>
  );
}
