import SystemRoutePage from "@/components/SystemRoutePage";

export default function DashboardPage() {
  return (
    <SystemRoutePage
      title="URAI Dashboard"
      description="The dashboard summarizes app status, route coverage, launch checks, and operational readiness for the V1 app shell."
      status="guarded"
    />
  );
}
