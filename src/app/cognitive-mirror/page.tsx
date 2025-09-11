import React from 'react';
import Card from '../../components/ui/Card';

export default function CognitiveMirrorPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Cognitive Mirror</h1>
      <Card header="Mood Trends">
        <p>This is where the user's mood trends will be displayed.</p>
        {/* Placeholder for chart */}
        <div className="w-full h-64 bg-white/10 rounded-lg mt-4"></div>
      </Card>
    </div>
  );
}
