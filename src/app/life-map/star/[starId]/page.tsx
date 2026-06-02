import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Star Focus",
  description: "Direct-loadable Life Map star route with safe parent fallback behavior.",
};

type PageProps = {
  params: Promise<{ starId: string }>;
};

export default async function LifeMapStarPage({ params }: PageProps) {
  const { starId } = await params;
  return <LifeMapUniverse initialView="lifeMap" selectedStarId={starId} routeNotice="Selected star context" />;
}
