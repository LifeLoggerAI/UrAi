import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "URAI Privacy Settings",
  description: "Review URAI privacy controls, consent posture, and data rights.",
};

export default function PrivacySettingsPage() {
  return (
    <UraiRouteShell
      eyebrow="Privacy Settings"
      title="Privacy controls stay close to the Home Orb."
      description="URAI V1 centers owner-only data, consent-gated signals, public-safe demo data, and clear data request paths. Passive sensing remains gated until consent and production proof are complete."
      primaryHref="/privacy"
      primaryLabel="Read Privacy Model"
      secondaryHref="/home"
      secondaryLabel="Return Home"
      sections={[
        { title: "Owner-only", body: "Private profile, HomeWorld, journal, Memory Stars, and narrator data must remain readable only by the signed-in owner." },
        { title: "Consent ledger", body: "Sensitive and passive sources should be represented through explicit consent records and never silently enabled." },
        { title: "Data rights", body: "Export and account data request paths must be available before broad launch." },
      ]}
    />
  );
}
