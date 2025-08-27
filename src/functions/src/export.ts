
'use server';

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { spawn } from 'child_process';
import ffmpeg from 'ffmpeg-static';
import fetch from 'node-fetch';

const db = admin.firestore();
const bucket = admin.storage().bucket();

const FFMPEG_TIMEOUT_MS = 180000; // 3 minutes
const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

async function validateAndDownload(url: string, dest: string): Promise<void> {
  const headRes = await fetch(url, { method: 'HEAD' });
  if (!headRes.ok) {
    throw new Error(`Asset not found at ${url} (status: ${headRes.status})`);
  }

  const contentLength = headRes.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Asset at ${url} exceeds max size of ${MAX_FILE_SIZE_BYTES / 1024 / 1024}MB.`);
  }

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.statusText}`);
  
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(dest);
    res.body?.pipe(fileStream);
    res.body?.on('error', reject);
    fileStream.on('finish', resolve);
    fileStream.on('error', reject);
  });
}

export const exportWorker = functions
  .runWith({ timeoutSeconds: 300, memory: '1GB' })
  .firestore.document('exportQueue/{jobId}')
  .onCreate(async (snap, context) => {
    const jobId = context.params.jobId;
    const jobRef = snap.ref;

    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), `export-${jobId}-`));
    const tempFiles: string[] = [];
    
    const updateJob = (data: object) => jobRef.update({ ...data, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    try {
      await updateJob({ status: 'processing', startedAt: admin.firestore.FieldValue.serverTimestamp() });

      const jobData = snap.data();
      const { uid, payload } = jobData;
      const { skyUrl, groundUrl, overlayUrl, audioUrl, durationSec = 10 } = payload;

      const skyPath = path.join(tempDir, 'sky.mp4');
      const groundPath = path.join(tempDir, 'ground.mp4');
      const outputPath = path.join(tempDir, 'output.mp4');
      tempFiles.push(skyPath, groundPath, outputPath);

      const downloadPromises = [
        validateAndDownload(skyUrl, skyPath),
        validateAndDownload(groundUrl, groundPath),
      ];

      if (overlayUrl) {
        const overlayPath = path.join(tempDir, 'overlay.webm');
        tempFiles.push(overlayPath);
        downloadPromises.push(validateAndDownload(overlayUrl, overlayPath));
      }
      if (audioUrl) {
        const audioPath = path.join(tempDir, 'audio.mp3');
        tempFiles.push(audioPath);
        downloadPromises.push(validateAndDownload(audioUrl, audioPath));
      }

      await Promise.all(downloadPromises);

      const inputs = [
        '-i', skyPath,
        '-i', groundPath,
      ];
      if (overlayUrl) inputs.push('-i', path.join(tempDir, 'overlay.webm'));
      if (audioUrl) inputs.push('-i', path.join(tempDir, 'audio.mp3'));

      const filterComplex = [
        '[0:v][1:v]blend=all_mode=screen[bg]',
        overlayUrl ? '[bg][2:v]overlay[outv]' : '[bg]copy[outv]',
      ].join(';');

      const ffmpegArgs = [
        ...inputs,
        '-filter_complex', filterComplex,
        '-map', '[outv]',
        ...(audioUrl ? ['-map', `${inputs.length / 2}:a`, '-c:a', 'aac', '-shortest'] : []),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-t', String(durationSec),
        '-y', outputPath,
      ];

      await new Promise<void>((resolve, reject) => {
        const process = spawn(ffmpeg, ffmpegArgs, { timeout: FFMPEG_TIMEOUT_MS });
        let stderr = '';
        process.stderr.on('data', (data) => (stderr += data.toString()));
        
        process.on('close', (code) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`FFmpeg exited with code ${code}. Stderr: ${stderr}`));
          }
        });
        
        process.on('error', (err) => {
          if ((err as any).code === 'ETIMEDOUT') {
            reject(new Error(`FFmpeg process timed out after ${FFMPEG_TIMEOUT_MS / 1000}s.`));
          } else {
            reject(err);
          }
        });
      });

      const destination = `user-exports/${uid}/${jobId}.mp4`;
      await bucket.upload(outputPath, { destination, resumable: false });

      const [signedUrl] = await bucket.file(destination).getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      await updateJob({
        status: 'done',
        url: signedUrl,
        finishedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (error: any) {
      console.error(`Export job ${jobId} failed`, error);
      await updateJob({
        status: 'failed',
        error: error.message || 'An unknown error occurred.',
        finishedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      // Re-throw to trigger Cloud Function's automatic retry for transient errors
      throw error;
    } finally {
      // Cleanup temp files
      try {
        if (fs.existsSync(tempDir)) {
          fs.rmSync(tempDir, { recursive: true, force: true });
        }
      } catch (e) {
        console.error(`Failed to clean up temp directory ${tempDir}`, e);
      }
    }
  });

    