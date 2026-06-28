import type { Metadata } from "next";
import GenesisProductHome from "@/components/genesis/GenesisProductHome";

const title = "URAI Genesis | Living Life Map Preview";
const description = "Enter URAI Genesis: a cinematic, launch-safe product preview with sample memories, Life Map, Replay Preview, Passport privacy, and gated future systems.";
const shareImage = "/og/urai-public-demo.svg";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "URAI",
    title,
    description,
    images: [{ url: shareImage, width: 1200, height: 630, alt: "URAI Genesis product preview" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [shareImage],
  },
};

export default function RootPage() {
  return <GenesisProductHome />;
}
