import Link from "next/link";
import SystemRoutePage from "@/components/SystemRoutePage";

const stars = [
  { id: "recovery-bloom", label: "Recovery Bloom", tone: "calm" },
  { id: "focus-rise", label: "Focus Rise", tone: "bright" },
  { id: "council-whisper", label: "Council Whisper", tone: "soft" },
];

export default function LifeMapPage() {
  return (
    <SystemRoutePage
      title="Symbolic Life Map"
      description="A starfield timeline for memory shards, rituals, recovery blooms, and symbolic life events."
      status="demo"
    >
      <div className="grid gap-3 md:grid-cols-3">
        {stars.map((star) => (
          <Link key={star.id} href={`/app/star/${star.id}`} className="rounded-2xl border border-white/10 bg-white/10 p-4 hover:bg-white/15">
            <div className="text-lg">✦ {star.label}</div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/50">{star.tone}</div>
          </Link>
        ))}
      </div>
    </SystemRoutePage>
  );
}
