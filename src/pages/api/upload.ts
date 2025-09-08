
import { NextApiRequest, NextApiResponse } from 'next';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uploadId, offset, totalSize } = req.query;
  const uploadDir = path.join(process.cwd(), 'uploads', uploadId as string);
  await mkdir(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, `chunk-${offset}`);

  try {
    const chunk = req.body;
    await writeFile(filePath, chunk);

    // In a real application, you would reassemble the chunks once all are received

    res.status(200).json({ message: 'Chunk uploaded successfully' });
  } catch (error) {
    console.error('Error saving chunk:', error);
    res.status(500).json({ error: 'Error saving chunk' });
  }
}
