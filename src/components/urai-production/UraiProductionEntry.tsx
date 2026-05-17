import UraiProductionClient from "./UraiProductionClient";
import { seedNarratorCues, seedReplayBeats, seedReplayEra, seedStars } from "./seed-data";

export default function UraiProductionEntry({ entry }: { entry: "home" | "lifeMap" | "replay" }) {
  return (
    <UraiProductionClient
      entry={entry}
      data={{
        stars: seedStars,
        replayEra: seedReplayEra,
        replayBeats: seedReplayBeats,
        narratorCues: seedNarratorCues,
      }}
    />
  );
}
