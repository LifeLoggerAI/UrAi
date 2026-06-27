import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata = {
  title: "Early Access | URAI",
  description: "Join the URAI early access path for Genesis, the orb companion, Life Map, Mirror, Passport, and emotional weather previews.",
};

export default function EarlyAccessPage() {
  return (
    <SystemRoutePage
      title="URAI Early Access"
      description="Early Access is the app invitation shell for onboarding people into Genesis, the orb companion, Life Map, Mirror, Passport, and emotional weather previews."
      status="guarded"
    />
  );
}
