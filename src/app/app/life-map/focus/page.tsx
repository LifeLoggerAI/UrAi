import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Focus",
  description: "Focus mode inside the URAI life-map field.",
};

export default function AppLifeMapFocusPage() {
  return <LifeMapUniverse initialView="focus" />;
}
