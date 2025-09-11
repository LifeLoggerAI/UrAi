import React from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function NarratorPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Narrator</h1>
      <Card header="Select Your Narrator">
        <div className="flex flex-col space-y-4">
            <Button variant='secondary'>Carl Jung</Button>
            <Button variant='secondary'>Alan Watts</Button>
            <Button variant='secondary'>Marcus Aurelius</Button>
        </div>
      </Card>
    </div>
  );
}
