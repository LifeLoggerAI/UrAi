
'use client';

/**
 * Initiates a screen recording of the current browser tab for a specified duration
 * and triggers a download of the resulting WebM video file.
 * @param element - The HTML element to record. Although getDisplayMedia records the tab, this can be used for future canvas recording.
 * @param durationMs - The duration of the recording in milliseconds.
 * @param filename - The desired filename for the downloaded video.
 */
export async function recordScene(
  element: HTMLElement,
  durationMs: number = 10000,
  filename: string = `urai-scene-${Date.now()}.webm`
) {
  if (!element || typeof navigator === 'undefined' || !navigator.mediaDevices?.getDisplayMedia) {
    alert('Screen recording is not supported by your browser.');
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        // @ts-ignore
        displaySurface: 'browser', // Record the current tab
      },
      audio: false, // No audio for scene recordings
    });

    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    const chunks: Blob[] = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    recorder.onstop = () => {
      // Stop all tracks to end the screen sharing session
      stream.getTracks().forEach(track => track.stop());

      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    };

    recorder.start();

    // Stop recording after the specified duration
    setTimeout(() => {
      if (recorder.state === 'recording') {
        recorder.stop();
      }
    }, durationMs);

  } catch (err) {
    console.error('Error starting screen recording:', err);
    alert('Could not start screen recording. Please grant permission and try again.');
  }
}
