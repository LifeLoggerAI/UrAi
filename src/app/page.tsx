import HomePage from "./home/page";

export const metadata = {
  title: "URAI",
  description: "URAI — your living world, memory field, and cinematic life interface.",
};

// URAI canonical home shell:
// Keep `/` visually identical to `/home` while preserving the Tier 1 lock signal.
export default function Page() {
  return <HomePage />;
}