import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Life Map",
  description:
    "The immersive URAI Life Map world: a cinematic spatial memory galaxy for reflection, recovery, purpose, and legacy.",
};

export default function Page() {
  return <LifeMapUniverse initialView="lifeMap" />;
}
