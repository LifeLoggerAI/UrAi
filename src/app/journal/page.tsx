import { promises as fs } from 'fs';
import path from 'path';
import React from 'react';
import Card from '../../components/ui/Card';

type JournalEntry = {
  timestamp: string;
  transcription: string;
};

export const dynamic = 'force-dynamic';

async function getJournalEntries(): Promise<JournalEntry[]> {
  const filePath = path.join(process.cwd(), 'data', 'journal-entries.json');
  const fileContents = await fs.readFile(filePath, 'utf-8');

  const entries: JournalEntry[] = JSON.parse(fileContents);

  return entries;
}

export default async function JournalPage() {
  const journalEntries = await getJournalEntries();

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
