import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

type JournalEntry = {
  timestamp: string;
  title?: string;
  transcription?: string;
};

const journalEntriesPath = path.resolve(process.cwd(), 'data/journal-entries.json');

export async function PUT(request: Request) {
    const { timestamp, title } = await request.json() as Partial<JournalEntry>;

    if (!timestamp || typeof title !== 'string') {
        return NextResponse.json({ error: 'Timestamp and title are required' }, { status: 400 });
    }

    let journalEntries: JournalEntry[] = [];
    try {
        const currentJournalEntries = await fs.readFile(journalEntriesPath, 'utf-8');
        journalEntries = JSON.parse(currentJournalEntries) as JournalEntry[];
    } catch (error) {
        return NextResponse.json({ error: 'Journal entries not found' }, { status: 404 });
    }

    const entryIndex = journalEntries.findIndex((entry) => entry.timestamp === timestamp);

    if (entryIndex === -1) {
        return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    journalEntries[entryIndex].title = title;

    await fs.writeFile(journalEntriesPath, JSON.stringify(journalEntries, null, 2));

    return NextResponse.json({ message: 'Journal entry updated' });
}
