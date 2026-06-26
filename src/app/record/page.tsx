"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../../components/ui/Button";

type RecorderStatus = "idle" | "recording" | "ready" | "unsupported" | "permission-denied" | "error";

const statusCopy: Record<RecorderStatus, { label: string; detail: string }> = {
  idle: {
    label: "No recording yet",
    detail: "Start a local voice note when you are ready. Nothing leaves this browser in the public launch preview.",
  },
  recording: {
    label: "Recording locally",
    detail: "URAI is capturing audio in this tab only. Stop when you want to preview it.",
  },
  ready: {
    label: "Local preview ready",
    detail: "You can play this recording here, then discard it. Upload and transcription stay gated until the approved provider path is wired.",
  },
  unsupported: {
    label: "Recording unavailable",
    detail: "This browser does not expose the microphone recording APIs URAI needs for a safe local preview.",
  },
  "permission-denied": {
    label: "Microphone permission denied",
    detail: "URAI cannot record without your explicit browser permission. No audio was captured.",
  },
  error: {
    label: "Recording stopped safely",
    detail: "Something interrupted the local recorder. No upload or transcription was attempted.",
  },
};

export default function RecordPage() {
  const [status, setStatus] = useState<RecorderStatus>("idle");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  useEffect(() => {
    if (!audioBlob) {
      setAudioUrl(null);
      return undefined;
    }

    const nextUrl = URL.createObjectURL(audioBlob);
    setAudioUrl(nextUrl);
    return () => URL.revokeObjectURL(nextUrl);
  }, [audioBlob]);

  useEffect(() => () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const releaseStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const handleStartRecording = async () => {
    setAudioBlob(null);
    setErrorMessage(null);

    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("unsupported");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];

      const recorderOptions = MediaRecorder.isTypeSupported("audio/webm") ? { mimeType: "audio/webm" } : undefined;
      const mediaRecorder = new MediaRecorder(stream, recorderOptions);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onerror = () => {
        setStatus("error");
        setErrorMessage("The local recorder reported an error before a usable preview was created.");
        releaseStream();
      };

      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || "audio/webm";
        const nextBlob = new Blob(chunksRef.current, { type });
        setAudioBlob(nextBlob.size > 0 ? nextBlob : null);
        setStatus(nextBlob.size > 0 ? "ready" : "error");
        if (nextBlob.size === 0) {
          setErrorMessage("The recording ended before audio data was captured.");
        }
        releaseStream();
      };

      mediaRecorder.start();
      setStatus("recording");
    } catch (error) {
      releaseStream();
      const isPermissionError = error instanceof DOMException && ["NotAllowedError", "SecurityError"].includes(error.name);
      setStatus(isPermissionError ? "permission-denied" : "error");
      setErrorMessage(isPermissionError ? null : "URAI could not start the local microphone preview in this browser.");
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
      return;
    }
    releaseStream();
    setStatus("idle");
  };

  const handleDiscard = () => {
    setAudioBlob(null);
    setErrorMessage(null);
    setStatus("idle");
  };

  const currentCopy = statusCopy[status];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(161,216,255,0.22),transparent_34%),linear-gradient(135deg,#07111f_0%,#121827_48%,#05070d_100%)] px-5 py-10 text-white sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-4xl flex-col justify-center">
        <div className="rounded-[2rem] border border-white/12 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <p className="text-xs uppercase tracking-[0.32em] text-sky-200/80">Voice note preview</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-light leading-tight sm:text-6xl">Capture a thought without pretending the film pipeline is live.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/68 sm:text-base">
            This launch-safe recorder creates a local audio preview only. URAI does not upload, transcribe, infer from, or store this recording until a consented provider path is wired and verified.
          </p>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_18rem]">
            <div className="rounded-[1.5rem] border border-white/12 bg-black/28 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Recorder state</p>
                  <h2 className="mt-2 text-2xl font-light">{currentCopy.label}</h2>
                </div>
                <span className="rounded-full border border-white/12 bg-white/[0.06] px-3 py-2 text-xs uppercase tracking-[0.2em] text-white/58">
                  {status === "recording" ? "local capture" : status === "ready" ? "preview" : "gated"}
                </span>
              </div>
              <p className="mt-4 text-sm leading-6 text-white/62">{currentCopy.detail}</p>
              {errorMessage ? <p className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">{errorMessage}</p> : null}

              {audioUrl ? (
                <div className="mt-6 rounded-2xl border border-white/12 bg-black/35 p-4">
                  <p className="mb-3 text-xs uppercase tracking-[0.22em] text-white/42">Local audio preview</p>
                  <audio className="w-full" src={audioUrl} controls preload="metadata" />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-white/14 bg-white/[0.03] p-5 text-sm leading-6 text-white/50">
                  No audio preview has been created yet. The public launch path stays empty until you choose to record locally.
                </div>
              )}
            </div>

            <aside className="rounded-[1.5rem] border border-white/12 bg-black/24 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">Privacy guardrail</p>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-white/62">
                <li>No background listening.</li>
                <li>No upload from this page.</li>
                <li>No placeholder transcript.</li>
                <li>No generated film claim from this recording.</li>
              </ul>
            </aside>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {status === "recording" ? (
              <Button onClick={handleStopRecording}>Stop local recording</Button>
            ) : (
              <Button onClick={handleStartRecording}>Start local recording</Button>
            )}
            <Button variant="secondary" onClick={handleDiscard} disabled={!audioBlob && status !== "error" && status !== "permission-denied"}>
              Discard preview
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
