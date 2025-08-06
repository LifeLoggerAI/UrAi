'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, ChevronRight } from 'lucide-react';

// Combined phrases from both versions
const URAI_PHRASES = [
  "Your AI companion for life reflection",
  "Capture moments, understand patterns",
  "Transform experiences into insights",
  "Your personal growth journey starts here",
  "AI-powered self-discovery and awareness",
  "Every moment has meaning - let's find it",
  "Your digital mirror for inner wisdom",
  "Unlock the stories hidden in your daily life",
  "Turn life's chaos into clear understanding",
  "Your thoughts, your growth, your UrAi",
  "Discover yourself through AI-guided reflection",
  "Where memories become meaningful insights",
  "Your life, analyzed and understood",
  "Personal AI that grows with you",
  "Connect the dots of your existence",
  "Your journey to self-awareness starts now",
  "Transform daily experiences into wisdom",
  "AI that understands your unique story",
  "Your personal philosopher and guide",
  "Life's complexity, simplified through AI"
];

export function LandingPage() {
  const router = useRouter();
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % URAI_PHRASES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = () => {
    router.push('/onboarding/permissions');
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center p-4 text-center overflow-hidden">
      <header className="w-full max-w-4xl mx-auto">
        {/* Icon */}
        <div className="mb-8 mx-auto bg-primary/20 p-4 rounded-full w-20 h-20 flex items-center justify-center border border-primary/30">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline text-foreground mb-6 animate-fadeIn">
          UrAi
        </h1>
        
        {/* Rotating Phrases */}
        <div className="min-h-[3rem] mb-8">
          <p 
            className="text-lg md:text-xl text-muted-foreground animate-fadeIn"
            aria-live="polite"
            key={currentPhraseIndex}
          >
            {URAI_PHRASES[currentPhraseIndex]}
          </p>
        </div>

        {/* Description */}
        <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Your personal AI companion for life logging, self-reflection, and meaningful insights. 
          Capture your thoughts, track your growth, and discover the patterns that shape your journey.
        </p>

        {/* CTA Button */}
        <Button 
          onClick={handleGetStarted}
          size="lg"
          className="text-lg px-8 py-6 group animate-fadeIn"
          style={{ animationDelay: '500ms' }}
        >
          Get Started
          <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* Footer */}
        <p className="text-sm text-muted-foreground mt-6 opacity-70">
          Begin your journey of self-discovery today
        </p>
      </header>
    </main>
  );
}
