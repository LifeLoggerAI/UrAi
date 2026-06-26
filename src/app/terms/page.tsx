import type { Metadata } from "next";
import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata: Metadata = {
  title: "Terms | URAI",
  description: "Launch-safe terms summary for the URAI public demo, early-access scope, safety boundaries, and gated private features.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms | URAI",
    description: "Early-access scope, safety boundaries, and gated-feature terms for the URAI public demo.",
    url: "/terms",
    images: [{ url: "/og/urai-public-demo.svg", width: 1200, height: 630, alt: "URAI terms summary" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms | URAI",
    description: "Early-access scope, safety boundaries, and gated-feature terms for the URAI public demo.",
    images: ["/og/urai-public-demo.svg"],
  },
};

export default function TermsPage() {
  return (
    <UraiRouteShell
      eyebrow="Terms"
      title="URAI is an early-access public demo surface."
      description="This page gives the public launch route a clear terms destination while the full legal terms are finalized. URAI should not be presented as medical care, diagnosis, emergency support, or a replacement for professional advice."
      primaryHref="/"
      primaryLabel="Enter URAI"
      secondaryHref="/privacy"
      secondaryLabel="Privacy"
      sections={[
        { title: "Early-access scope", body: "Public demo content is illustrative and public-safe. Private user data must remain behind authenticated owner-only rules." },
        { title: "No emergency use", body: "URAI is not an emergency response system. Crisis and safety language should direct people to appropriate local help." },
        { title: "Changing features", body: "Features may change as URAI completes verification, security review, deployment evidence, and product polish." },
      ]}
    />
  );
}
