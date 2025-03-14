import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { OUTPUT_DIR } from '@/lib/utils/files';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  // Ensure params is properly awaited
  const { filename } = await params;
  
  // Security check to prevent directory traversal attacks
  if (filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Invalid filename', { status: 400 });
  }

  const filePath = path.resolve(OUTPUT_DIR, filename);
  
  try {
    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }

    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Determine content type based on file extension
    let contentType = 'application/octet-stream';
    if (filename.endsWith('.wav')) {
      contentType = 'audio/wav';
    } else if (filename.endsWith('.mp3')) {
      contentType = 'audio/mpeg';
    } else if (filename.endsWith('.mp4')) {
      contentType = 'video/mp4';
    } else if (filename.endsWith('.txt')) {
      contentType = 'text/plain';
    }

    // Return the file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${filename}"`,
        'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
      },
    });
  } catch (error) {
    console.error('Error serving asset:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
