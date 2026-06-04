import type { Metadata } from "next";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { getDemoRouteConfig } from "@/lib/demo/demoDataRegistry";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";

const description = "A sample public view of URAI’s symbolic interface, built around permission, reflection, and user-owned memory.";

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

export default function PublicUserDemoPage({ params }: { params: { slug: string } }) {
  const config = getDemoRouteConfig(params.slug);
  const founder = config.showFounderBadge;
  return (
    <UraiDemoProvider initialMode={founder ? "founder_demo" : "public_demo"} profileId={config.profileId}>
      <PublicDemoShell founder={founder} />
    </UraiDemoProvider>
  );
}
