"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

import MainLayout from "./MainLayout";

type OnboardingGateProps = {
  children: ReactNode;
};

const OnboardingGate = ({ children }: OnboardingGateProps) => {
  const pathname = usePathname();
  const isOnboardingRoute = pathname?.startsWith("/onboarding");

  if (isOnboardingRoute) {
    return <>{children}</>;
  }

  return <MainLayout>{children}</MainLayout>;
};

export default OnboardingGate;
