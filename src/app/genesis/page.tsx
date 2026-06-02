import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "Genesis | UrAi",
  description: "UrAi Genesis is the first quiet entry into the life-map galaxy, orb companion, memory stars, and emotional weather experience.",
};

export default function GenesisPage() {
  return (
    <UraiRouteShell
      eyebrow="Genesis"
      title="The first star in your living galaxy."
      description="Genesis is the soft entry into UrAi: a quiet world that can begin before the app knows everything, then bloom into memory stars, emotional weather, the orb companion, and the life-map galaxy as patterns appear."
      primaryHref="/"
      primaryLabel="Enter Genesis"
      secondaryHref="/privacy"
      secondaryLabel="Privacy"
      sections={[
        { title: "Start quiet", body: "UrAi can open as a calm sky before any profile, journal, or setup ritual is required." },
        { title: "Let one memory bloom", body: "An optional memory can become the first visible star in the life-map experience." },
        { title: "Stay in control", body: "Genesis should remain symbolic, reversible, and connected to the app privacy route." },
      ]}
    />
  );
}
