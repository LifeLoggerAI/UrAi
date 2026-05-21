import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Investors",
  description: "Investor-facing overview of URAI V1 launch readiness and product architecture.",
};

export default function InvestorsPage() {
  return (
    <UraiRouteShell
      eyebrow="Investors"
      title="URAI V1 is converging into a coherent launch surface."
      description="The investor route summarizes URAI as a privacy-first emotional life OS with a public demo, Home Orb, Life Map, companion layer, and Firebase-backed product architecture."
      primaryHref="/u/adamclamp"
      primaryLabel="View Public Demo"
      secondaryHref="/about"
      secondaryLabel="About URAI"
      sections={[
        { title: "Product spine", body: "Home Orb, ground layer, sky, Memory Stars, Life Map, companion, and privacy center are treated as V1 core." },
        { title: "Technical spine", body: "Next.js, Firebase, Firestore rules, waitlist API, and smoke gates form the current launch foundation." },
        { title: "Evidence-first", body: "Launch readiness is based on command output, rules tests, smoke tests, and deploy evidence rather than unsupported claims." },
      ]}
    />
  );
}
