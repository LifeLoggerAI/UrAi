import { redirect } from "next/navigation";

export const metadata = {
  title: "URAI Inner Sky Shrine",
  description: "Canonical URAI home shrine with orb, sky, ground, and Memory Galaxy gateway.",
};

export default function HomePage() {
  redirect("/");
}
