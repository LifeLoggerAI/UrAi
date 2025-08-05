'use client';

import { useEffect, useRef, useState } from 'react';
import { useAuth } from './auth-provider';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { analyzeAndLogCameraFrameAction } from '@/app/actions';
import type { User } from '@/lib/types';

const CAPTURE_INTERVAL_MS = 60 * 1000; // Capture every 60 seconds

export function PassiveCameraCapture() {
  const { user } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    if (user) {
      const checkSettings = async () => {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const settings = (userDoc.data() as User).settings;
          if (settings?.faceEmotionEnabled) {
            setIsEnabled(true);
          }
        }
      };
      checkSettings();
    }
  }, [user]);

  useEffect(() => {
    if (!isEnabled) return;

    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setHasPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasPermission(false);
      }
    };

    getCameraPermission();
  }, [isEnabled]);

  useEffect(() => {
    if (!hasPermission || !user) return;

    const intervalId = setInterval(() => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        if (context) {
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageDataUri = canvas.toDataURL('image/jpeg');
          if (user?.uid) {
            analyzeAndLogCameraFrameAction({
              userId: user.uid,
              imageDataUri,
            }).catch(err => console.error('Failed to analyze frame:', err));
          }
        }
      }
    }, CAPTURE_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [hasPermission, user]);

  if (!isEnabled) {
    return null;
  }

  return (
    <>
      <video ref={videoRef} className="hidden" autoPlay muted playsInline />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
