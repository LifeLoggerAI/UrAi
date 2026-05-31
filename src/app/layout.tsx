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

import React from "react";
import AppProviders from "./providers";
import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://urai.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "URAI - Give it one memory",
    template: "%s | URAI",
  },
  description:
    "Give URAI one memory and watch it become the first scene of a living world.",
  applicationName: "URAI",
  keywords: [
    "URAI",
    "memory world",
    "cinematic memory",
    "living world",
    "personal world",
    "AI scene",
  ],
  authors: [{ name: "URAI Labs" }],
  creator: "URAI Labs",
  publisher: "URAI Labs",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "URAI",
    title: "URAI - Give it one memory",
    description:
      "Give URAI one memory and watch it become the first scene of a living world.",
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI - Give it one memory",
    description:
      "Give URAI one memory and watch it become the first scene of a living world.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
