import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createFileInfo, writeOutputFileAsync } from '@/lib/utils/files';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

export async function POST(req: Request) {
  try {
    const { text, timestamp, prompt } = await req.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Invalid text format. Expected string.' }, { status: 400 });
    }

    const input = {
      gen_text: text,
      ref_text: "you look fruity",
      ref_audio: "https://drive.google.com/uc?export=download&id=1pOvnyq4HcYLbVuHwLpnIjEFIP5wvM8NF"
    };

    const output = await replicate.run(
      "x-lance/f5-tts:87faf6dd7a692dd82043f662e76369cab126a2cf1937e25a9d41e0b834fd230e",
      { input }
    );

    // Download the audio file from the output URL
    const response = await fetch(output);
    if (!response.ok) {
      throw new Error(`Failed to download audio: ${response.statusText}`);
    }
    
    const audioBuffer = Buffer.from(await response.arrayBuffer());

    // Save the audio file
    const fileInfo = createFileInfo(prompt, timestamp);
    const wavOutputPath = await writeOutputFileAsync(fileInfo.getPath('audio'), audioBuffer);
    console.log('Audio file saved at:', wavOutputPath);
    
    return NextResponse.json({ response: wavOutputPath });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate speech' }, { status: 500 });
  }
}
