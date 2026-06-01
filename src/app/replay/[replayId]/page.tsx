import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_REPLAY_IDS = [
  "genesis",
  "demo",
  "first-memory",
  "threshold",
  "mirror",
  "legacy",
];

export function generateStaticParams() {
  return SEEDED_REPLAY_IDS.map((replayId) => ({
    replayId,
  }));
}

export default async function ReplayPage({
  params,
}: {
  params: Promise<{ replayId: string }>;
}) {
  const { replayId } = await params;

  return (
    <SystemRoutePage
      title={`Replay: ${replayId}`}
      description="A static-export compatible replay route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This replay is ready to connect to memory playback, narrator voice,
        emotional field reconstruction, cinematic scenes, and export surfaces.
      </div>
    </SystemRoutePage>
  );
}
