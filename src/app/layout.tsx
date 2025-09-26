import "./globals.css";
import { ReactNode } from "react";

import OnboardingGate from "../components/layout/OnboardingGate";

export const metadata = {
  title: "URAI",
  description: "Your Emotional Media OS",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <OnboardingGate>{children}</OnboardingGate>
      </body>
    </html>
  );
}
