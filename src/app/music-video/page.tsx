import type { Metadata } from "next";
import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata: Metadata = {
  title: "Music Video | URAI Genesis",
  description: "URAI Music Video is a gated roadmap surface. Genesis may show labeled previews, never fake completed private media.",
};

export default function MusicVideoPage() {
  return (
    <SystemRoutePage
      eyebrow="Generated media boundary"
      title="Music videos stay gated."
      description="The public Genesis launch can show sample visual language and preview cards, but real user-owned music-video generation requires consent, provider configuration, storage proof, and live smoke evidence before it can be claimed."
      status="guarded"
    />
  );
}
