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
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), `urai-${movieId}-`));
  const outPath = path.join(tmpDir, "out.mp4");
  return {localOut: outPath};
}

export * from "./corePipeline";
export * from "./personalMirror";
export * from "./predictiveMirror";
export * from "./challengeMirror";
