import SystemRoutePage from "@/components/SystemRoutePage";

export default function AdminPage() {
  return (
    <SystemRoutePage
      title="URAI Admin"
      description="Admin is the canonical entry point for operator-only monitoring, release checks, user support, and controlled system configuration."
      status="guarded"
    />
  );
}
