import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_SESSION_IDS = [
  "genesis",
  "demo",
  "morning-focus",
  "deep-work",
  "recovery",
];

export function generateStaticParams() {
  return SEEDED_SESSION_IDS.map((sessionId) => ({
    sessionId,
  }));
}

export default async function FocusSessionPage({
  params,
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;

  return (
    <SystemRoutePage
      title={`Focus Session: ${sessionId}`}
      description="A static-export compatible focus session route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This focus session is ready to connect to rhythm state, cognitive load,
        recovery timing, narrator guidance, and session replay.
      </div>
    </SystemRoutePage>
  );
}
