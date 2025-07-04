
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { processOnboardingVoiceAction } from '@/app/actions';
import { Loader2, Mic, BotMessageSquare, CheckCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

const prompts = [
    "To begin, tell me a dream or a goal you care about right now.",
    "That's a powerful goal. What's one small, concrete step you could take toward it this week?",
    "Perfect. When would be a good time for me to gently nudge you about that step?",
    "Got it. Lastly, is there anything specific I should watch out for on this journey? Any habits or obstacles?",
    "Thank you for sharing. I'm ready to begin this journey with you."
];

type RecordingState = 'idle' | 'requesting' | 'recording' | 'processing' | 'done';

export default function VoiceOnboardingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [promptIndex, setPromptIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [recordingState, setRecordingState] = useState<RecordingState>('idle');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        if (typeof window !== 'undefined' && navigator.mediaDevices) {
            setRecordingState('requesting');
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    const recorder = new MediaRecorder(stream);
                    mediaRecorderRef.current = recorder;
                    
                    recorder.ondataavailable = (event) => {
                        if (event.data.size > 0) {
                            audioChunksRef.current.push(event.data);
                        }
                    };
                    
                    recorder.onstop = async () => {
                        if (!user) return;
                        setRecordingState('processing');
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                        
                        const reader = new FileReader();
                        reader.readAsDataURL(audioBlob);
                        reader.onloadend = async () => {
                            const audioDataUri = reader.result as string;
                            const result = await processOnboardingVoiceAction({ userId: user.uid, audioDataUri });
                            if (result.success) {
                                setRecordingState('done');
                                toast({ title: "Welcome to Life Logger!", description: "Your journey begins now." });
                                setTimeout(() => router.push('/'), 2000);
                            } else {
                                toast({ variant: 'destructive', title: 'Onboarding Failed', description: result.error || "Could not process your reflection." });
                                setRecordingState('idle');
                            }
                        };
                        audioChunksRef.current = [];
                    };
                    setRecordingState('idle');
                })
                .catch(err => {
                    console.error("Mic access error:", err);
                    toast({ variant: 'destructive', title: 'Microphone Access Denied' });
                    setRecordingState('idle');
                });
        }
    }, [user, toast, router]);

    const handleRecordClick = () => {
        if (recordingState === 'idle' && mediaRecorderRef.current) {
            mediaRecorderRef.current.start();
            setRecordingState('recording');
            
            const advancePrompts = () => {
                setPromptIndex(prev => {
                    if (prev < prompts.length - 2) {
                        setTimeout(advancePrompts, 15000); // ~15 seconds per prompt
                        return prev + 1;
                    }
                    // After the last question, wait a bit then stop recording
                    setTimeout(() => {
                        if (mediaRecorderRef.current?.state === 'recording') {
                            mediaRecorderRef.current.stop();
                        }
                    }, 15000);
                    return prev + 1;
                });
            };
            setTimeout(advancePrompts, 15000); // Start advancing after 15s

        } else if (recordingState === 'recording' && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
    };
    
    if (loading || !user) {
        return <main className="flex min-h-screen flex-col items-center justify-center bg-background"><Loader2 className="h-12 w-12 animate-spin text-primary" /></main>;
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 sm:p-8">
            <Card className="w-full max-w-2xl animate-fadeIn text-center">
                <CardHeader>
                    <BotMessageSquare className="mx-auto h-12 w-12 text-primary animate-pulse"/>
                    <CardTitle className="font-headline text-3xl mt-4">First Reflection</CardTitle>
                    <CardDescription>Let's begin by seeding your inner voice. I'll ask a few questions. Please respond in one continuous recording.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[10rem] flex items-center justify-center p-6">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={promptIndex}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5 }}
                            className="text-xl text-foreground"
                        >
                           {prompts[promptIndex]}
                        </motion.p>
                    </AnimatePresence>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center gap-4">
                     <Button
                        onClick={handleRecordClick}
                        disabled={recordingState !== 'idle' && recordingState !== 'recording'}
                        size="lg"
                        className="w-48"
                    >
                        {recordingState === 'recording' ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Listening...</> : 'Start Reflection'}
                    </Button>
                    
                     <div className="h-10">
                        {recordingState === 'processing' && <p className="text-sm text-muted-foreground flex items-center gap-2"><Loader2 className="animate-spin" /> Analyzing your reflection...</p>}
                        {recordingState === 'done' && <p className="text-sm text-primary flex items-center gap-2"><CheckCircle2/> Welcome! Redirecting...</p>}
                    </div>

                </CardFooter>
            </Card>
        </main>
    );
}
