import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const transcriptionsPath = path.resolve(process.cwd(), 'data/transcriptions.json');
const journalEntriesPath = path.resolve(process.cwd(), 'data/journal-entries.json');
const audioUploadPath = path.resolve(process.cwd(), 'public/audio');

async function saveTranscription(transcription: string) {
    let transcriptions = [];
    try {
        const currentTranscriptions = await fs.readFile(transcriptionsPath, 'utf-8');
        transcriptions = JSON.parse(currentTranscriptions);
    } catch (error) {
        // File doesn't exist yet
    }

    transcriptions.push({
        timestamp: new Date().toISOString(),
        transcription,
    });
    await fs.writeFile(transcriptionsPath, JSON.stringify(transcriptions, null, 2));
}

async function saveJournalEntry(transcription: string) {
    let journalEntries = [];
    try {
        const currentJournalEntries = await fs.readFile(journalEntriesPath, 'utf-8');
        journalEntries = JSON.parse(currentJournalEntries);
    } catch (error) {
        // File doesn't exist yet
    }

    journalEntries.push({
        timestamp: new Date().toISOString(),
        transcription,
    });
    await fs.writeFile(journalEntriesPath, JSON.stringify(journalEntries, null, 2));
}

export async function POST(request: Request) {
    const formData = await request.formData();
    const audio = formData.get('audio') as File;

    if (!audio) {
        return NextResponse.json({ error: 'No audio file provided' }, { status: 400 });
    }

    // Create the upload directory if it doesn't exist
    try {
        await fs.mkdir(audioUploadPath, { recursive: true });
    } catch (error) {
        console.error('Error creating upload directory:', error);
    }
    
    const audioBuffer = Buffer.from(await audio.arrayBuffer());
    const audioFileName = `${new Date().toISOString()}-${audio.name}`;
    const audioFilePath = path.join(audioUploadPath, audioFileName);

    await fs.writeFile(audioFilePath, audioBuffer);


    const dummyTranscription = "This is a dummy transcription of your audio recording.";

    await saveTranscription(dummyTranscription);
    await saveJournalEntry(dummyTranscription);

    return NextResponse.json({ transcription: dummyTranscription });
}
