import SystemRoutePage from "@/components/SystemRoutePage";

export const metadata = {
  title: "Early Access | UrAi",
  description: "Join the UrAi early access path for Genesis, the orb companion, Life Map, Mirror, Passport, and emotional weather previews.",
};

export default function EarlyAccessPage() {
  return (
    <SystemRoutePage
      title="UrAi Early Access"
      description="Early Access is the app invitation shell for onboarding people into Genesis, the orb companion, Life Map, Mirror, Passport, and emotional weather previews."
      status="guarded"
    />
  );
}
