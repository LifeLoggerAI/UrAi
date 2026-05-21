import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Terms",
  description: "Launch-safe terms summary for the URAI public demo.",
};

export default function TermsPage() {
  return (
    <UraiRouteShell
      eyebrow="Terms"
      title="URAI V1 is a demo and early-access product surface."
      description="This page gives the public launch route a clear terms destination while the full legal terms are finalized. URAI V1 should not be presented as medical care, diagnosis, emergency support, or a replacement for professional advice."
      primaryHref="/waitlist"
      primaryLabel="Join Waitlist"
      secondaryHref="/privacy"
      secondaryLabel="Privacy"
      sections={[
        { title: "Demo scope", body: "Public demo content is illustrative and public-safe. Private user data must remain behind authenticated owner-only rules." },
        { title: "No emergency use", body: "URAI is not an emergency response system. Crisis and safety language should direct people to appropriate local help." },
        { title: "Early access", body: "Features may change as URAI completes verification, security review, and deployment evidence." },
      ]}
    />
  );
}
