import type { Metadata, Viewport } from "next";
import AppProviders from "./providers";
import OnboardingGate from "@/components/layout/OnboardingGate";
import { Genesis } from "@/components/genesis";
import "@/app/globals.css";
import "@/app/life-map-polish.css";

const siteUrl =
  process.env.NEXT_PUBLIC_URAI_APP_URL ??
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://urai.app";

const title = "URAI Spatial";
const description =
  "A privacy-gated public demo for a symbolic Life Map and reflection product. Sample data only; roadmap systems are clearly labeled before they go live.";
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
  keywords: [
    "URAI",
    "public demo",
    "privacy-gated reflection",
    "symbolic life map",
    "personal reflection"
  ],
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
    images: [
      {
        url: shareImage,
        width: 1200,
        height: 630,
        alt: "URAI public demo preview",
      },
    ],
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
