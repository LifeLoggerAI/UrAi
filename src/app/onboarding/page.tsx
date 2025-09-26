"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">URAI</h1>
      <p className="text-lg mb-8">Your Emotional Media OS</p>
      <Button variant="primary" onClick={() => router.push('/home')}>
        Get Started
      </Button>
    </div>
  );
}
