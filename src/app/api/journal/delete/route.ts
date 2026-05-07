import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

type JournalEntry = {
  timestamp: string;
  title?: string;
  transcription?: string;
};

const journalEntriesPath = path.resolve(process.cwd(), 'data/journal-entries.json');

export async function DELETE(request: Request) {
    const { timestamp } = await request.json() as Partial<JournalEntry>;

    if (!timestamp) {
        return NextResponse.json({ error: 'Timestamp is required' }, { status: 400 });
    }

    let journalEntries: JournalEntry[] = [];
    try {
        const currentJournalEntries = await fs.readFile(journalEntriesPath, 'utf-8');
        journalEntries = JSON.parse(currentJournalEntries) as JournalEntry[];
    } catch (error) {
        return NextResponse.json({ error: 'Journal entries not found' }, { status: 404 });
    }

    const updatedJournalEntries = journalEntries.filter((entry) => entry.timestamp !== timestamp);

    if (updatedJournalEntries.length === journalEntries.length) {
        return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    await fs.writeFile(journalEntriesPath, JSON.stringify(updatedJournalEntries, null, 2));

    return NextResponse.json({ message: 'Journal entry deleted' });
}
