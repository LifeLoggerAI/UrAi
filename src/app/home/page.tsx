import React from 'react';
import MainLayout from '../components/layout/MainLayout';
import Button from '../components/ui/Button';
import Chip from '../components/ui/Chip';

export default function HomePage() {
  return (
    <MainLayout>
      <div className="relative h-screen flex flex-col items-center justify-center text-center">
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <span className="text-sm">Listening locally</span>
          <Button variant="secondary">Local-Only</Button>
        </div>

        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="w-40 h-60 bg-white/10 rounded-full mb-4"></div>
          <div className="w-16 h-16 bg-blue-500 rounded-full shadow-lg mb-8"></div>

          <Button variant="primary" onClick={() => window.location.href='/life-map'}>
            Tap the sky
          </Button>
        </div>

        <div className="flex space-x-4 mb-24">
          <Chip>Mirror</Chip>
          <Chip>Narrator</Chip>
          <Chip>Rituals</Chip>
        </div>
      </div>
    </MainLayout>
  );
}
