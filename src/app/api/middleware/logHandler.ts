import { promises as fs } from 'fs';
import path from 'path';

const logFilePath = path.resolve(process.cwd(), 'data/audit-log.json');

export default async function logHandler(req, res, next) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    body: req.body,
  };

  let logData = [];
  try {
    const currentLog = await fs.readFile(logFilePath, 'utf-8');
    logData = JSON.parse(currentLog);
  } catch (error) {
    // File doesn't exist yet
  }

  logData.push(logEntry);
  await fs.writeFile(logFilePath, JSON.stringify(logData, null, 2));

  next();
}
