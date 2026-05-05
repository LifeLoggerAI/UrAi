import {spawn} from "child_process";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

import * as admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions";

setGlobalOptions({maxInstances: 10});

if (!admin.apps.length) {
  admin.initializeApp();
}

const bucket = admin.storage().bucket();

// EXISTING MOVIE RENDER CODE KEPT
export interface MovieDoc {
  durationSec?: number | null;
  renderProfile?: string | null;
  titlePngPath?: string | null;
  audioPath?: string | null;
}

export async function renderStoryMovieMP4(
  movieId: string,
  movie: MovieDoc
): Promise<{localOut: string}> {
  const total = Math.max(6, Math.min(movie.durationSec ?? 10, 120));
  const introDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);
  const midDur = Math.max(3.0, Math.round(total * 0.6 * 10) / 10);
  const outroDur = Math.max(1.5, Math.round(total * 0.2 * 10) / 10);

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `urai-${movieId}-`));
  const outPath = path.join(tmpDir, "out.mp4");

  return {localOut: outPath};
}

// NEW PIPELINE EXPORTS
export * from "./corePipeline";
