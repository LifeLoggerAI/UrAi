import type { Metadata } from "next";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";

export const metadata: Metadata = {
  title: "URAI Genesis — Private Symbolic Life Interface",
  description: "A sample public Genesis route where visitors can see URAI without private user data.",
  openGraph: {
    title: "URAI Genesis — Private Symbolic Life Interface",
    description: "A sample public Genesis route where visitors can see URAI without private user data.",
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
