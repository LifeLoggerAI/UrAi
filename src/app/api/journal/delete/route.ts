import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const journalEntriesPath = path.resolve(process.cwd(), 'data/journal-entries.json');

export async function DELETE(request: Request) {
    const { timestamp } = await request.json();

    let journalEntries = [];
    try {
        const currentJournalEntries = await fs.readFile(journalEntriesPath, 'utf-8');
        journalEntries = JSON.parse(currentJournalEntries);
    } catch (error) {
        return NextResponse.json({ error: 'Journal entries not found' }, { status: 404 });
    }

    const updatedJournalEntries = journalEntries.filter(entry => entry.timestamp !== timestamp);

    if (updatedJournalEntries.length === journalEntries.length) {
        return NextResponse.json({ error: 'Journal entry not found' }, { status: 404 });
    }

    await fs.writeFile(journalEntriesPath, JSON.stringify(updatedJournalEntries, null, 2));

    return NextResponse.json({ message: 'Journal entry deleted' });
}
