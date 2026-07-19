import { LaunchPage } from "@/components/launch/LaunchShell";

export const metadata = {
  title: "URAI Passport",
  description: "URAI Passport is the access, consent, permission, and future data-rights layer for URAI.",
};

export default function PassportPage() {
  return <LaunchPage kind="passport" />;
}
