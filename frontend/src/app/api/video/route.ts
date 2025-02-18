import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { createFileInfo, writeOutputFile, DEFAULT_VIDEO_PATH } from '@/lib/utils/files';
import { mergeVideoWithAudio } from '@/lib/utils/video';
import path from 'path';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN as string,
});

async function generateVideo(prompt: string, timestamp: string) {
  // Use Replicate's video generation model
  const output = await replicate.run(
    "cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f95957bd844003b401ca4e4a9b33baa574c549d376",
    {
      input: {
        driven_audio: prompt,
        source_image: "https://replicate.delivery/pbxt/IJK6oRHYqKqZRYi8GxKYB5bZ1c4ZUTEqvXvVcP9JwzjOeHhE/sadtalker_example.jpg",
        enhancer: "gfpgan",
        still_mode: false,
        use_ref_video: false,
        result_dir: "./results"
      }
    }
  ) as { video: Buffer };

  return output;
}

export async function POST(req: Request) {
  try {
    const { audioPath, timestamp, prompt } = await req.json();

    // const output = await generateVideo(
    //   prompt,
    //   timestamp
    // );

    // if (!output || typeof output !== 'object' || !('video' in output)) {
    //   throw new Error('Failed to generate video');
    // }

    // Create file info and save video
    const fileInfo = createFileInfo(prompt, timestamp);
    const videoOutputPath = fileInfo.getPath('video');
    
    // Merge the default video with the generated audio
    await mergeVideoWithAudio(audioPath, DEFAULT_VIDEO_PATH, videoOutputPath);
    
    // Return the URL to access the video
    const videoUrl = `/videos/${path.basename(videoOutputPath)}`;
    return NextResponse.json({ response: videoUrl });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
