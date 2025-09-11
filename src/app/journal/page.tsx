import React from 'react';
import Card from '../../components/ui/Card';
import journalEntries from '../../../data/journal-entries.json';

export default function JournalPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Journal</h1>
      <div className="space-y-4">
        {journalEntries.map((entry, index) => (
          <Card key={index} header={entry.timestamp}>
            <p>{entry.transcription}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
