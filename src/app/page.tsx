import HomePage, { metadata } from "./home/page";

export { metadata };

// URAI canonical home shell: keep root visually identical to /home while preserving Tier 1 lock signal.
export default function Page() {
  return <HomePage />;
}
