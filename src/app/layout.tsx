import "./globals.css";
import RouteAwareLayout from "@/components/layout/RouteAwareLayout";
import { ReactNode } from "react";

export const metadata = {
  title: 'URAI',
  description: 'Your Emotional Media OS',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <RouteAwareLayout>{children}</RouteAwareLayout>
      </body>
    </html>
  );
}
