import { NextResponse } from 'next/server';
import { OUTPUT_DIR } from '@/lib/utils/files';
import { join } from 'path';
import fs from 'fs';

const MIME_TYPES: Record<string, string> = {
  mp4: 'video/mp4',
  webm: 'video/webm',
  wav: 'audio/wav',
  mp3: 'audio/mpeg'
};

export async function GET(requet: Request, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const safeParams = await params;
    const filePath = join(OUTPUT_DIR, ...safeParams.path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    const ext = filePath.split('.').pop()?.toLowerCase() || '';
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

    const fileBuffer = fs.readFileSync(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
      },
    });
  } catch (error) {
    console.error('Error serving video:', error);
    return new NextResponse('Error serving video', { status: 500 });
  }
}
