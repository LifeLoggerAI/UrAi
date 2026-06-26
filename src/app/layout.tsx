import "./globals.css";
import "./lifemap-polish.css";
import "./lifemap-production.css";
import "../styles/urai-cinematic.css";
import "../styles/urai-home-final.css";
import "../styles/urai-home-production-overlay.css";
import "../styles/urai-home-tier5.css";
import "../styles/spatial-life-map.css";
import "../styles/spatial-life-map-unwind.css";
import "../styles/cinematic-life-map.css";
import "../styles/urai-3d-world-integration.css";
import "../styles/urai-fullscreen-final-lock.css";
import "../styles/urai-aaa-loop.css";
import "../styles/urai-aaa-final-focus.css";
import "../styles/urai-home-world-composition.css";
import "../styles/urai-sacred-tech-system.css";

import type { Metadata, Viewport } from "next";
import AppProviders from "./providers";
import OnboardingGate from "@/components/layout/OnboardingGate";
import { Genesis } from "@/components/genesis";

const siteUrl = process.env.NEXT_PUBLIC_URAI_APP_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "https://urai.app";
const title = "URAI Public Demo — Symbolic Life Map";
const description = "A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.";
const shareImage = "/og/urai-public-demo.svg";

export const viewport: Viewport = {
  themeColor: "#0f766e",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  title: {
    default: title,
    template: "%s | URAI",
  },
  description,
  applicationName: "URAI",
  manifest: "/site.webmanifest",
  keywords: ["URAI", "public demo", "privacy-gated reflection", "symbolic life map", "personal reflection"],
  authors: [{ name: "URAI Labs" }],
  creator: "URAI Labs",
  publisher: "URAI Labs",
  category: "personal reflection",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    shortcut: ["/icon.svg"],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "URAI",
    title,
    description,
    images: [{ url: shareImage, width: 1200, height: 630, alt: "URAI public demo preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <Genesis />
          <OnboardingGate>{children}</OnboardingGate>
        </AppProviders>
      </body>
    </html>
  );
}
