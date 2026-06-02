import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "Mirror | UrAi",
  description: "The UrAi Mirror is a reflective overlay for life patterns, emotional weather, memory stars, and becoming.",
};

export default function MirrorPage() {
  return <LifeMapUniverse initialOverlay="mirror" />;
}
