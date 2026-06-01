import { HomeScene } from "@/components/urai/home/HomeScene";

export const metadata = {
  title: "URAI App Shell",
  description: "Authenticated URAI shell entry into the app-scoped life map.",
};

export default function AppIndexPage() {
  return <HomeScene ascentTarget="/app/life-map" />;
}
