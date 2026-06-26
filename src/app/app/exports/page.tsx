import SystemRoutePage from "@/components/SystemRoutePage";

export default function ExportsPage() {
  return (
    <SystemRoutePage
      title="Export Hub"
      description="Gated export preview surface. PDF, PNG, story, SRT, and video export jobs are not live user exports yet; they require owner-scoped storage, delete/export controls, and live smoke evidence before production use."
      status="guarded"
    />
  );
}
