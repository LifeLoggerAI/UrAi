import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_INVITE_CODES = [
  "genesis",
  "demo",
  "adam",
  "urai",
  "preview",
];

export function generateStaticParams() {
  return SEEDED_INVITE_CODES.map((code) => ({
    code,
  }));
}

export default async function InvitePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  return (
    <SystemRoutePage
      title={`Invite: ${code}`}
      description="A static-export compatible invite preview route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This invite code is ready to connect to Firebase invite validation,
        onboarding access, Passport permissions, and Genesis preview flows.
      </div>
    </SystemRoutePage>
  );
}
