import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Replay",
  description: "Replay mode inside the URAI life-map field.",
};

export default function AppLifeMapReplayPage() {
  return <LifeMapUniverse initialView="replay" />;
}
