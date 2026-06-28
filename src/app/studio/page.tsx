import type { Metadata } from "next";
import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata: Metadata = {
  title: "Studio | URAI Genesis",
  description: "URAI Studio is a gated production surface, not a public-live creator console.",
};

export default function StudioPage() {
  return (
    <SystemRoutePage
      eyebrow="Studio boundary"
      title="Studio is gated for Genesis."
      description="URAI Studio is reserved for future creator, admin, and production workflows. The public Genesis launch shows the product shape without opening private production controls or generated media pipelines."
      status="guarded"
    />
  );
}
