import React from 'react';
import Chip from '../../components/ui/Chip';

export default function LifeMapPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Life Map</h1>
      <div className="flex flex-wrap gap-2">
        <Chip>Calm</Chip>
        <Chip>Growth</Chip>
        <Chip>Joy</Chip>
        <Chip>Focus</Chip>
        <Chip>Tension</Chip>
      </div>
    </div>
  );
}
