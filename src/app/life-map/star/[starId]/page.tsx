import type { Metadata } from "next";
import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata: Metadata = {
  title: "Life Map Star | URAI",
  description: "Direct-loadable Life Map star route with safe parent fallback behavior.",
};

type PageProps = {
  params: Promise<{ starId: string }> | { starId: string };
};

export default async function LifeMapStarPage({ params }: PageProps) {
  const resolvedParams = await Promise.resolve(params);
  const starId = resolvedParams.starId;

  return <LifeMapUniverse initialView="lifeMap" selectedStarId={starId} routeNotice="Selected star context" />;
}
