import HomeWorldSmokeContract from "@/components/urai/HomeWorldSmokeContract";
import UraiResolvedHomeScene from "@/components/urai/UraiResolvedHomeScene";
import { parseWorldEntryState } from "@/lib/world-entry";

export const metadata = {
  title: "URAI Inner Sky Shrine",
  description: "Canonical URAI home shrine with orb, sky, ground, and Memory Galaxy gateway.",
};

type HomePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const entryState = parseWorldEntryState(params);

  return (
    <>
      <UraiResolvedHomeScene entryState={entryState} />
      <HomeWorldSmokeContract />
    </>
  );
}
