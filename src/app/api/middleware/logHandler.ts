import { promises as fs } from 'fs';
import path from 'path';

type MiddlewareRequest = {
  method?: string;
  url?: string;
  body?: unknown;
};

type MiddlewareResponse = unknown;

type LogEntry = {
  timestamp: string;
  method?: string;
  url?: string;
  body?: unknown;
};

const logFilePath = path.resolve(process.cwd(), 'data/audit-log.json');

export default async function logHandler(
  req: MiddlewareRequest,
  _res: MiddlewareResponse,
  next: () => void,
) {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    body: req.body,
  };

  let logData: LogEntry[] = [];
  try {
    const currentLog = await fs.readFile(logFilePath, 'utf-8');
    logData = JSON.parse(currentLog) as LogEntry[];
  } catch (error) {
    // File doesn't exist yet
  }

  logData.push(logEntry);
  await fs.writeFile(logFilePath, JSON.stringify(logData, null, 2));

  next();
}
