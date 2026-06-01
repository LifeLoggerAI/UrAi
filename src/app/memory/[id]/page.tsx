import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_MEMORY_IDS = [
  "genesis",
  "first-memory",
  "threshold",
  "mirror",
  "legacy",
];

export function generateStaticParams() {
  return SEEDED_MEMORY_IDS.map((id) => ({
    id,
  }));
}

export default async function MemoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <SystemRoutePage
      title={`Memory: ${id}`}
      description="A static-export compatible symbolic memory route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This memory is ready to connect to memoryShards, lifeMapEvents,
        replay scenes, narrator reflections, rituals, and exports.
      </div>
    </SystemRoutePage>
  );
}
