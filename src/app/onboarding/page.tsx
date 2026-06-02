"use client";

import Button from '@/components/ui/Button';

export default function OnboardingPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center text-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">URAI</h1>
      <p className="text-lg mb-8">Your Emotional Media OS</p>
      <Button variant="primary" onClick={() => window.location.href='/home'}>
        Get Started
      </Button>
    </div>
  );
}
