import HomeWorldSmokeContract from "@/components/urai/HomeWorldSmokeContract";
import { HomeScene } from "@/components/urai/home/HomeScene";
import WorldEntryOverlay from "@/components/urai/WorldEntryOverlay";
import WorldEntryPersistenceBridge from "@/components/urai/WorldEntryPersistenceBridge";
import { parseWorldEntryState } from "@/lib/world-entry";

export const metadata = {
  title: "URAI Genesis Home",
  description: "Polished URAI Genesis home with sky, orb, ground, and Memory Galaxy gateway.",
};

type HomePageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default function HomePage({ searchParams }: HomePageProps) {
  const entryState = parseWorldEntryState(searchParams);

  return (
    <>
      <HomeScene />
      <WorldEntryPersistenceBridge entryState={entryState} />
      <WorldEntryOverlay entryState={entryState} />
      <HomeWorldSmokeContract />
    </>
  );
}
