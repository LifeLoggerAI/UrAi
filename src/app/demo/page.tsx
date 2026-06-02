import SystemRoutePage from "@/components/SystemRoutePage";

export default function DemoPage() {
  return (
    <SystemRoutePage
      title="URAI Demo"
      description="URAI demo mode opens the public companion shell, narrator preview, and Life Map entry points without requiring a signed-in account."
      status="demo"
    />
  );
}
