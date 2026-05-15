import { seedNarratorCues, seedReplayBeats, seedReplayEra, seedStars } from "./seed-data";

export default function UraiProductionEntry({ entry }: { entry: "home" | "lifeMap" | "replay" }) {
  return (
    <main data-urai-production-entry={entry}>
      <h1>URAI Production Cinematic Root</h1>
      <p>{seedStars.length} Memory Stars ready.</p>
      <p>{seedReplayBeats.length} Replay Beats ready.</p>
      <p>{seedNarratorCues.length} narrator cues ready.</p>
      <p>{seedReplayEra.title}</p>
    </main>
  );
}
