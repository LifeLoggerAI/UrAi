import SystemRoutePage from "@/components/SystemRoutePage";

export default async function StarDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  await Promise.resolve(params);

  return (
    <SystemRoutePage
      eyebrow="Private star detail"
      title="Star detail is owner-gated."
      description="Direct app star links stay closed until auth, consent, and owner-scoped Firestore reads prove the viewer can open the memory. No private star identifier or seeded object name is shown here."
      status="guarded"
    >
      <div className="rounded-[1.5rem] border border-amber-100/16 bg-amber-100/[0.055] p-5 text-sm leading-6 text-amber-50/78">
        Genesis can show the public Life Map preview. Real star details, evidence rails, exports, and generated replay links remain private and consent-bound.
      </div>
    </SystemRoutePage>
  );
}
