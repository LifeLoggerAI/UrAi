
'use client'

import React, { useState, useRef, useEffect } from 'react';
import { processAudioForAI } from '@/app/actions';
import { generateAvatar } from '@/ai/flows/generate-avatar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RecordButton } from '@/components/record-button';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { db } from '@/lib/firebase';
import { doc, writeBatch, collection, query, where, getDocs, limit, increment, arrayUnion } from "firebase/firestore";
import type { AudioEvent, VoiceEvent, Person } from '@/lib/types';

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
    if (typeof window !== "undefined") {
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
    }
  }, [toast]);

  const handleRecordingStop = async () => {
    setRecordingState('processing');
    const durationSec = (Date.now() - recordingStart) / 1000;
    const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
    
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = async () => {
      const audioDataUri = reader.result as string;

      try {
        const aiResult = await processAudioForAI({ audioDataUri });

        if (aiResult.error || !aiResult.analysis) {
            throw new Error(aiResult.error || "AI processing failed.");
        }

        const { transcript, analysis } = aiResult;

        const audioEventId = crypto.randomUUID();
        const voiceEventId = crypto.randomUUID();
        const timestamp = Date.now();
        const batch = writeBatch(db);

        const newAudioEvent: AudioEvent = {
            id: audioEventId,
            uid: userId,
            storagePath: `audio/${userId}/${audioEventId}.webm`,
            startTs: timestamp - Math.round(durationSec * 1000),
            endTs: timestamp,
            durationSec: Math.round(durationSec),
            transcriptionStatus: 'complete',
        };
        batch.set(doc(db, "audioEvents", newAudioEvent.id), newAudioEvent);

        const newVoiceEvent: VoiceEvent = {
            id: voiceEventId,
            uid: userId,
            audioEventId: audioEventId,
            speakerLabel: 'user',
            text: transcript,
            createdAt: timestamp,
            emotion: analysis.emotion,
            sentimentScore: analysis.sentimentScore,
            toneShift: analysis.toneShift,
            voiceArchetype: analysis.voiceArchetype,
            people: analysis.people || [],
            tasks: analysis.tasks || [],
        };
        batch.set(doc(db, "voiceEvents", newVoiceEvent.id), newVoiceEvent);

        if (analysis.people && analysis.people.length > 0) {
            const peopleRef = collection(db, "people");
            for (const personName of analysis.people) {
                const q = query(peopleRef, where("uid", "==", userId), where("name", "==", personName), limit(1));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    const newPersonRef = doc(peopleRef);
                    const avatarResult = await generateAvatar({ name: personName, role: analysis.voiceArchetype });
                    const avatarUrl = avatarResult?.avatarDataUri || `https://placehold.co/128x128.png?text=${personName.charAt(0).toUpperCase()}`;

                    const newPerson: Person = {
                        id: newPersonRef.id,
                        uid: userId,
                        name: personName,
                        lastSeen: timestamp,
                        familiarityIndex: 1,
                        socialRoleHistory: [{ date: timestamp, role: analysis.voiceArchetype }],
                        avatarUrl: avatarUrl
                    };
                    batch.set(newPersonRef, newPerson);
                } else {
                    const personDoc = querySnapshot.docs[0];
                    batch.update(personDoc.ref, {
                        lastSeen: timestamp,
                        familiarityIndex: increment(1),
                        socialRoleHistory: arrayUnion({ date: timestamp, role: analysis.voiceArchetype })
                    });
                }
            }
        }
        
        await batch.commit();

        toast({
          title: "Voice Event Logged",
          description: "Your memory has been successfully processed and saved.",
        });
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
    } else if (recordingState === 'idle' && mediaRecorderRef.current) {
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
