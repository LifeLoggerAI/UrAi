import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Orb Chat Cockpit | URAI Genesis",
  description: "The /ochat route resolves to the canonical URAI Orb Chat cockpit at /orb-chat.",
  alternates: { canonical: "/orb-chat" },
};

export default function OchatPage() {
  redirect("/orb-chat");
}