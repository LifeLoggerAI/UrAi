import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_STAR_IDS = [
  "genesis",
  "first-memory",
  "threshold",
  "mirror",
  "legacy",
];

export function generateStaticParams() {
  return SEEDED_STAR_IDS.map((starId) => ({
    starId,
  }));
}

export default async function LifeMapStarPage({
  params,
}: {
  params: Promise<{ starId: string }>;
}) {
  const { starId } = await params;

  return (
    <SystemRoutePage
      title={`Life Map Star: ${starId}`}
      description="A static-export compatible life-map star detail route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This life-map star is ready to connect to memory shards, symbolic
        events, emotional field reconstruction, replay scenes, and exports.
      </div>
    </SystemRoutePage>
  );
}
