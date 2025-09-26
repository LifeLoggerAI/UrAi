"use client";
import React from 'react';
import Button from '@/components/ui/Button';
import Chip from '@/components/ui/Chip';

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center text-center">
      <div className="absolute left-0 right-0 top-0 flex items-center justify-between p-4">
        <span className="text-sm">Listening locally</span>
        <Button variant="secondary">Local-Only</Button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-4 h-60 w-40 rounded-full bg-white/10"></div>
        <div className="mb-8 h-16 w-16 rounded-full bg-blue-500 shadow-lg"></div>

        <Button variant="primary" onClick={() => (window.location.href = '/life-map')}>
          Tap the sky
        </Button>
      </div>

      <div className="mb-24 flex space-x-4">
        <Chip>Mirror</Chip>
        <Chip>Narrator</Chip>
        <Chip>Rituals</Chip>
      </div>
    </div>
  );
}
