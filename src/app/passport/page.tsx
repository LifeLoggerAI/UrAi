import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { NotificationControlPanel } from "@/components/passport/NotificationControlPanel";
import UraiRouteShell from "@/components/urai/UraiRouteShell";

export const metadata = {
  title: "Passport | UrAi",
  description: "UrAi Passport is the app permission and consent preview for identity, data rights, privacy choices, and future personalization controls.",
};

export default function PassportPage() {
  return (
    <>
      <UraiRouteShell
        eyebrow="Passport"
        title="Your permissions should travel with you."
        description="UrAi Passport is the app-facing permission layer for consent, identity, data rights, and future personalization controls. It should explain what the app can use, what remains private, and where broader trust controls live."
        primaryHref="/privacy"
        primaryLabel="Review App Privacy"
        secondaryHref="https://uraiprivacy.com"
        secondaryLabel="URAI Privacy Center"
        sections={[
          { title: "Consent first", body: "Sensitive features should only expand with clear permission and implementation-safe wording." },
          { title: "User-owned controls", body: "Passport should point users toward privacy, export, deletion, and future control paths." },
          { title: "No hidden sales surface", body: "Passport belongs to the app experience, not ads, studio work, or investor routing." },
        ]}
      />
      <div className="space-y-6 bg-slate-950 px-5 pb-12 sm:px-8">
        <NotificationControlPanel />
        <div className="mx-auto max-w-5xl">
          <NotificationCenter />
        </div>
      </div>
    </>
  );
}
