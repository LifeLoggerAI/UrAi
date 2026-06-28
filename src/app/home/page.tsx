import type { Metadata } from "next";
import GenesisProductHome from "@/components/genesis/GenesisProductHome";

export const metadata: Metadata = {
  title: "URAI Genesis | Product Home",
  description: "Enter URAI Genesis: a cinematic, launch-safe product preview with sample memories, Life Map, Replay Preview, Passport privacy, and gated future systems.",
};

export default function HomePage() {
  return <GenesisProductHome />;
}
