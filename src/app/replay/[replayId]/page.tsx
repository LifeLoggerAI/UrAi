import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Replay",
  description: "Direct-loadable source-backed Replay route with safe recovery behavior.",
};

type PageProps = {
  params: Promise<{ replayId: string }>;
};

export default async function ReplayDetailPage({ params }: PageProps) {
  const { replayId } = await params;
  return <LifeMapUniverse initialView="replay" replayId={replayId} routeNotice="Replay restored" />;
}
