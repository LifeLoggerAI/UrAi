
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { addAudioEventAction } from '@/app/actions';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RecordButton } from '@/components/record-button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

type RecordingState = 'idle' | 'requesting' | 'recording' | 'processing';

export function NoteForm({ userId }: { userId: string }) {
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingStart, setRecordingStart] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Request permission on component mount
    setRecordingState('requesting');
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        setHasPermission(true);
        setRecordingState('idle');
        mediaRecorderRef.current = new MediaRecorder(stream);
        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };
        mediaRecorderRef.current.onstop = handleRecordingStop;
      })
      .catch(err => {
        console.error("Error accessing microphone:", err);
        setHasPermission(false);
        setRecordingState('idle');
        toast({
            variant: "destructive",
            title: "Microphone Access Denied",
            description: "Please enable microphone permissions in your browser settings.",
        });
      });
  }, [toast]);

  const handleRecordingStop = async () => {
    setRecordingState('processing');
    const durationSec = (Date.now() - recordingStart) / 1000;
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    // Convert blob to data URI
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const base64Data = reader.result as string;

      try {
        const result = await addAudioEventAction({ userId, audioDataUri: base64Data, durationSec });
        if (result.success) {
          toast({
            title: "Voice Event Logged",
            description: "Your memory has been successfully processed and saved.",
          });
        } else {
          throw new Error(result.error || "An unknown error occurred.");
        }
      } catch (error) {
        console.error("Failed to process audio:", error);
        toast({
          variant: "destructive",
          title: "Processing Failed",
          description: (error as Error).message,
        });
      } finally {
        setRecordingState('idle');
        audioChunksRef.current = [];
      }
    };
  };

  const toggleRecording = () => {
    if (recordingState === 'recording') {
      mediaRecorderRef.current?.stop();
    } else {
      audioChunksRef.current = []; // Clear previous chunks
      setRecordingStart(Date.now());
      mediaRecorderRef.current?.start();
      setRecordingState('recording');
    }
  };

  return (
    <Card className="w-full shadow-lg border-border/60">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Log a New Voice Event</CardTitle>
        <CardDescription>Press the button to start recording your voice. The AI will analyze and categorize it for you.</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasPermission && recordingState === 'idle' && (
          <Alert variant="destructive">
            <AlertTitle>Microphone Access Required</AlertTitle>
            <AlertDescription>
              This app needs access to your microphone to record voice events. Please grant permission when prompted.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-center">
        <RecordButton
          recordingState={recordingState}
          disabled={!hasPermission || recordingState === 'requesting' || recordingState === 'processing'}
          onClick={toggleRecording}
        />
      </CardFooter>
    </Card>
  );
}

    