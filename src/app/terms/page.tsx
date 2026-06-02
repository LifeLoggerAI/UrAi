import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "UrAi Terms",
  description: "Launch-safe terms summary for the UrAi public demo and early-access product surface.",
};

export default function TermsPage() {
  return (
    <UraiRouteShell
      eyebrow="Terms"
      title="UrAi V1 is an early-access product surface."
      description="This page gives the public launch route a clear terms destination while the full legal terms are finalized. UrAi V1 should not be presented as medical care, diagnosis, emergency support, or a replacement for professional advice."
      primaryHref="/"
      primaryLabel="Enter UrAi"
      secondaryHref="/privacy"
      secondaryLabel="Privacy"
      sections={[
        { title: "Early-access scope", body: "Public demo content is illustrative and public-safe. Private user data must remain behind authenticated owner-only rules." },
        { title: "No emergency use", body: "UrAi is not an emergency response system. Crisis and safety language should direct people to appropriate local help." },
        { title: "Changing features", body: "Features may change as UrAi completes verification, security review, deployment evidence, and product polish." },
      ]}
    />
  );
}
