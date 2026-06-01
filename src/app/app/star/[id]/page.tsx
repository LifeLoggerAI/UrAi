import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_STAR_IDS = [
  "genesis",
  "first-memory",
  "threshold",
  "mirror",
  "legacy",
];

export function generateStaticParams() {
  return SEEDED_STAR_IDS.map((id) => ({
    id,
  }));
}

export default async function StarDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SystemRoutePage
      title={`Star Detail: ${id}`}
      description="A symbolic memory detail view connected to insight, ritual, replay, and export surfaces."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This seeded star is ready to connect to lifeMapEvents, memoryShards,
        insights, rituals, and exports.
      </div>
    </SystemRoutePage>
  );
}
