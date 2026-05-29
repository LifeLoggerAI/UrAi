import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const localStorePath = path.resolve(process.cwd(), 'data/local-store.json');
const logFilePath = path.resolve(process.cwd(), 'data/audit-log.json');

type AuditLogEntry = {
  timestamp: string;
  method: string;
  url: string;
  body: string;
};

async function logRequest(request: Request) {
  const { method, url } = request;
  const body = await request.clone().text();
  const logEntry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    method,
    url,
    body,
  };

  let logData: AuditLogEntry[] = [];
  try {
    const currentLog = await fs.readFile(logFilePath, 'utf-8');
    const parsed = JSON.parse(currentLog) as AuditLogEntry[];
    logData = Array.isArray(parsed) ? parsed : [];
  } catch {
    // File doesn't exist yet, it will be created.
  }

  logData.push(logEntry);
  await fs.writeFile(logFilePath, JSON.stringify(logData, null, 2));
}

export async function GET(request: Request) {
  await logRequest(request);
  const data = await fs.readFile(localStorePath, 'utf-8');
  return NextResponse.json(JSON.parse(data));
}

export async function POST(request: Request) {
  await logRequest(request);
  const newData = await request.json();
  await fs.writeFile(localStorePath, JSON.stringify(newData, null, 2));
  return NextResponse.json({ message: 'Data saved locally' });
}
