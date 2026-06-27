import type { Metadata } from "next";
import UraiWorldShell from "@/components/world/UraiWorldShell";
import { getUraiWorldLayer } from "@/data/uraiWorldSystem";

const layer = getUraiWorldLayer("chat");

export const metadata: Metadata = {
  title: "Orb Chat Cockpit | URAI Genesis",
  description: layer.metadataDescription,
  alternates: { canonical: "/orb-chat" },
  openGraph: {
    title: "URAI Orb Chat Cockpit | Genesis",
    description: layer.metadataDescription,
    url: "/orb-chat",
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Orb Chat Cockpit | Genesis",
    description: layer.metadataDescription,
    images: ["/og/urai-genesis-preview.png"],
  },
};

export default function OrbChatPage() {
  return <UraiWorldShell layerId="chat" />;
}