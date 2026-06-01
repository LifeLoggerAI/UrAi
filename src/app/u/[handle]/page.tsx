import SystemRoutePage from "@/components/SystemRoutePage";

const SEEDED_HANDLES = [
  "adamclamp",
  "lifeloggerai",
  "urai",
  "demo",
  "genesis",
];

export function generateStaticParams() {
  return SEEDED_HANDLES.map((handle) => ({
    handle,
  }));
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  return (
    <SystemRoutePage
      title={`URAI Profile: @${handle}`}
      description="A static-export compatible public profile route for URAI Genesis."
      status="demo"
    >
      <div className="rounded-2xl bg-white/10 p-4 text-sm text-white/70">
        This profile is ready to connect to public scrolls, Passport identity,
        demo memories, creator pages, and shareable Genesis experiences.
      </div>
    </SystemRoutePage>
  );
}
