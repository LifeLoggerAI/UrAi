import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Cognitive Mirror | URAI",
  description: "The public Cognitive Mirror route now resolves to the canonical URAI Mirror chamber at /mirror.",
  alternates: { canonical: "/mirror" },
};

export default function CognitiveMirrorPage() {
  redirect("/mirror");
}
