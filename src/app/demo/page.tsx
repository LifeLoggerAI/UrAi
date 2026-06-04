import type { Metadata } from "next";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";

const description = "This public demo uses sample data so you can experience URAI’s symbolic interface safely.";

export const metadata: Metadata = {
  title: "URAI Genesis Demo",
  description,
  openGraph: {
    title: "URAI Genesis Demo",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "URAI Genesis Demo",
    description,
    images: ["/og/urai-genesis-preview.png"],
  },
};

export default function DemoPage() {
  return (
    <UraiDemoProvider initialMode="public_demo" profileId="public">
      <PublicDemoShell />
    </UraiDemoProvider>
  );
}
