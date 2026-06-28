import type { Metadata } from "next";
import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata: Metadata = {
  title: "Motion | URAI Genesis",
  description: "URAI Motion is a Genesis preview boundary for cinematic movement language, not a live generated-media engine.",
};

export default function MotionPage() {
  return (
    <SystemRoutePage
      eyebrow="Motion boundary"
      title="Motion is preview-only in Genesis."
      description="URAI's motion language is visible across the public Genesis experience. Provider-backed video generation, automated edits, and private media rendering remain gated until production evidence exists."
      status="guarded"
    />
  );
}
