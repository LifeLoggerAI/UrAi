import UraiProductionEntry from "@/components/urai-production/UraiProductionEntry";

export const metadata = {
  title: "URAI Life Map",
  description: "The production URAI Symbolic Life Map with Memory Stars, Timeline Constellation, Focus, Replay, and narrator surfaces.",
};

export default function LifeMapPage() {
  return <UraiProductionEntry entry="lifeMap" />;
}
