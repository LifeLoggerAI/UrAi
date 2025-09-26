"use client";

import React from 'react';
import Button from '../../components/ui/Button';

export default function RecordPage() {
  const [isRecording, setIsRecording] = React.useState(false);
  const [audioBlob, setAudioBlob] = React.useState<Blob | null>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const [transcription, setTranscription] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleStartRecording = async () => {
    setAudioBlob(null);
    setTranscription('');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const audioChunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      setAudioBlob(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSendAudio = async () => {
    if (!audioBlob) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    setTranscription(data.transcription);
    setIsLoading(false);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">Record Your Thoughts</h1>
      <div className="flex flex-col items-center space-y-4 w-full max-w-xs">
        {!isRecording ? (
          <Button onClick={handleStartRecording} disabled={isLoading}>
            Start Recording
          </Button>
        ) : (
          <Button onClick={handleStopRecording} disabled={isLoading}>
            Stop Recording
          </Button>
        )}
        {audioBlob && (
          <div className="mt-4">
            <Button onClick={handleSendAudio} disabled={isLoading}>
              {isLoading ? 'Transcribing...' : 'Send for Transcription'}
            </Button>
          </div>
        )}
        {transcription && (
          <div className="mt-4 p-4 bg-white/10 rounded-lg">
            <h2 className="text-lg font-bold mb-2">Transcription:</h2>
            <p>{transcription}</p>
          </div>
        )}
      </div>
    </div>
  );
}
