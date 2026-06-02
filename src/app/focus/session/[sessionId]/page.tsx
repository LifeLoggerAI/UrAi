import LifeMapUniverse from "@/components/life-map/LifeMapUniverse";

export const metadata = {
  title: "URAI Focus Session",
  description: "Direct-loadable Focus session route with safe recovery behavior.",
};

type PageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function FocusSessionPage({ params }: PageProps) {
  const { sessionId } = await params;
  return <LifeMapUniverse initialView="focus" sessionId={sessionId} routeNotice="Focus session restored" />;
}
