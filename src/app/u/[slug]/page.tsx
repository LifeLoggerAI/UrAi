import type { Metadata } from "next";
import { PublicDemoShell } from "@/components/demo/PublicDemoShell";
import { getDemoRouteConfig } from "@/lib/demo/demoDataRegistry";
import { UraiDemoProvider } from "@/providers/UraiDemoProvider";

export const metadata: Metadata = {
  title: "URAI Genesis Demo",
  description: "A sample public view of URAI’s symbolic interface, built around permission, reflection, and user-owned memory.",
  openGraph: {
    title: "URAI Genesis Demo",
    description: "A sample public view of URAI’s symbolic interface, built around permission, reflection, and user-owned memory.",
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
