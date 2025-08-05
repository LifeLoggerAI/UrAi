'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const uriPhrases = [
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
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % uriPhrases.length);
        setIsVisible(true);
      }, 150);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <header className="w-full max-w-4xl space-y-8 animate-fadeIn">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-foreground">
            UrAi
          </h1>
          
          <div 
            className="h-16 flex items-center justify-center"
            aria-live="polite"
            aria-label="Rotating phrases about UrAi"
          >
            <p 
              className={`text-xl md:text-2xl text-muted-foreground transition-opacity duration-150 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {uriPhrases[currentPhraseIndex]}
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
              Welcome to UrAi, your AI companion for life reflection and personal growth. 
              Discover patterns, gain insights, and understand yourself better.
            </p>
            
            <Link href="/onboarding/permissions">
              <Button size="lg" className="text-lg px-8 py-6 gap-2">
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
      </div>
      
      <footer className="p-4 text-center text-sm text-muted-foreground">
        <p>Start your journey of self-discovery today</p>
      </footer>
    </main>
  );
}