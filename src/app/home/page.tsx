import UraiResolvedHomeScene from "@/components/urai/UraiResolvedHomeScene";
import UraiHomeAccessibilityLayer from "@/components/urai/UraiHomeAccessibilityLayer";

export const metadata = {
  title: "URAI Inner Sky Shrine",
  description: "Canonical URAI home shrine with orb, sky, ground, and Memory Galaxy gateway.",
};

export default function HomePage() {
  return <><UraiResolvedHomeScene /><UraiHomeAccessibilityLayer /></>;
}
