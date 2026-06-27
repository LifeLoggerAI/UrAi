import SystemRoutePage from "@/components/SystemRoutePage";

type InvitePageProps = {
  params: Promise<{ code: string }> | { code: string };
};

export default async function InvitePage({ params }: InvitePageProps) {
  await Promise.resolve(params);

  return (
    <SystemRoutePage
      eyebrow="Invite boundary"
      title="This invite is guarded."
      description="URAI invite links are verified before any private onboarding opens. The public route never echoes invite codes, account state, or access decisions."
      status="guarded"
    />
  );
}
