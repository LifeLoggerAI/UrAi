
'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { addFaceSnapshotAction } from '@/app/actions';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { Camera, Loader2, VideoOff } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function FacialEmotionCapture() {
  const { user } = useAuth();
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const getCameraPermission = async () => {
      if (typeof window !== 'undefined' && navigator.mediaDevices) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
        }
      }
    };
    getCameraPermission();
    
    return () => {
        // Cleanup: stop camera stream when component unmounts
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, []);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current || !user) return;
    setIsProcessing(true);
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageDataUri = canvas.toDataURL('image/jpeg');

    try {
        const result = await addFaceSnapshotAction({ userId: user.uid, imageDataUri });
        if(result.success) {
            toast({ title: 'Emotion Captured', description: 'Your emotional state has been analyzed and logged.' });
        } else {
            throw new Error(result.error || 'Failed to process snapshot.');
        }
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion Snapshot</CardTitle>
        <CardDescription>Capture your current emotion through your camera for analysis.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video w-full overflow-hidden rounded-md border bg-muted">
           <video ref={videoRef} className="h-full w-full object-cover" autoPlay muted playsInline />
           <canvas ref={canvasRef} className="hidden" />
           {!hasCameraPermission && (
             <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                <VideoOff className="h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Camera access is required.</p>
             </div>
           )}
        </div>
         <Button onClick={handleCapture} disabled={!hasCameraPermission || isProcessing} className="w-full">
            {isProcessing ? <Loader2 className="animate-spin" /> : <Camera />}
            Capture & Analyze
         </Button>
      </CardContent>
    </Card>
  );
}
