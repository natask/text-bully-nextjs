import { NextResponse } from 'next/server';
import { OUTPUT_DIR } from '@/lib/utils/files';
import path from 'path';
import fs from 'fs';

const MIME_TYPES: Record<string, string> = {
  '.mp4': 'video/mp4',
  '.wav': 'audio/wav',
  '.txt': 'text/plain',
  '.json': 'application/json',
  '.mp3': 'audio/mpeg',
};

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const safeParams = await params;
    const filePath = path.join(OUTPUT_DIR, ...safeParams.path);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Get file extension and corresponding MIME type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Read file
    const fileBuffer = fs.readFileSync(filePath);

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', contentType);
    headers.set('Content-Length', fileBuffer.length.toString());

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error serving file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
