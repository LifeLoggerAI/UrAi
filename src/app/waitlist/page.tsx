import { LaunchPage } from "@/components/launch/LaunchShell";

export const metadata = {
  title: "Join the URAI Waitlist",
  description: "Join the URAI early list for private beta, Worlds, Make Mine, creators, press, and founding access.",
};

export default function WaitlistPage() {
  return <LaunchPage kind="waitlist" />;
}
