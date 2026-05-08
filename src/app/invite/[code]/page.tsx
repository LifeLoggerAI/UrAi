import SystemRoutePage from "@/components/SystemRoutePage";

type InvitePageProps = {
  params: Promise<{ code: string }>;
};

export default async function InvitePage({ params }: InvitePageProps) {
  const { code } = await params;

  return (
    <SystemRoutePage
      title="URAI Invite"
      description={`Invite ${code} is ready for the URAI early access flow, companion onboarding, and Life Map activation.`}
      status="guarded"
    />
  );
}
