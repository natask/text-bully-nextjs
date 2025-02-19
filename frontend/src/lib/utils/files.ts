import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';
import { ReadableStream } from 'stream/web';

export const OUTPUT_DIR = path.join(process.cwd(), '../output');
export const DEFAULT_VIDEO_PATH = path.resolve(process.cwd(), '../final.mp4');

// Ensure output directory exists
export function ensureOutputDir() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
}

export interface FileInfo {
  timestamp: string;
  cleanPrompt: string;
  getPath: (type: 'mock' | 'audio' | 'video') => string;
}

export function createFileInfo(prompt: string, timestamp?: string): FileInfo {
  timestamp = timestamp || new Date().toISOString();
  const cleanPrompt = prompt.toLowerCase().replace(/[\s]/g, '_').toLowerCase().replace(/[^a-zA-Z0-9_]/g, '')
  .replace(/[^a-z0-9]/g, '_').slice(0, 50);
  
  return {
    timestamp,
    cleanPrompt,
    getPath: (type: 'mock' | 'audio' | 'video') => {
      const filename = `${timestamp}_${cleanPrompt}.${type === 'audio' ? 'wav' : type === 'video' ? 'mp4' : 'txt'}`;
      return path.resolve(OUTPUT_DIR, filename);
    }
  };
}

export function writeOutputFile(filepath: string, content: string | Buffer) {
  ensureOutputDir()
  fs.writeFileSync(filepath, content);
  return filepath;
}

export async function writeOutputFileAsync(filepath: string, content: ReadableStream) {
  ensureOutputDir()
  await fsPromises.writeFile(filepath, content);
  return filepath;
}

export async function downloadAndSaveFile(url: string, outputPath: string): Promise<string> {
  ensureOutputDir();
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }
  
  const buffer = Buffer.from(await response.arrayBuffer());
  await fsPromises.writeFile(outputPath, buffer);
  return outputPath;
}