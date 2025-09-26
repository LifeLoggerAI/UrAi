"use client";

import React from "react";
import { usePathname } from "next/navigation";

import MainLayout from "@/components/layout/MainLayout";

type RouteAwareLayoutProps = {
  children: React.ReactNode;
};

const RouteAwareLayout = ({ children }: RouteAwareLayoutProps) => {
  const pathname = usePathname();
  const isOnboardingRoute = pathname === "/onboarding" || pathname?.startsWith("/onboarding/");

  if (isOnboardingRoute) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default RouteAwareLayout;
