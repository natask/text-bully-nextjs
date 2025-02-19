import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeStatic from 'ffprobe-static';
import fs from 'fs';
import path from 'path';

// Set ffmpeg paths
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeStatic.path);

async function getMediaDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err: Error | null, metadata: any) => {
            if (err) reject(err);
            resolve(metadata.format.duration || 0);
        });
    });
}

async function mergeVideoWithAudio(wavPath: string, videoPath: string, outputPath: string): Promise<string> {
    try {
        // Get audio duration
        const audioPath = path.resolve(process.cwd(), wavPath);
        const audioDuration = await getMediaDuration(audioPath);
        console.log('Audio duration:', audioDuration);

        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(videoPath)
                .input(audioPath)
                .outputOptions([
                    '-c:v copy',
                    '-c:a aac',
                    '-strict experimental'
                ])
                .save(outputPath)
                .on('end', () => {
                    console.log('Finished processing');
                    resolve(outputPath);
                })
                .on('error', (err: Error) => {
                    console.error('Error:', err);
                    reject(err);
                });
        });
    } catch (error) {
        console.error('Error in mergeVideoWithAudio:', error);
        throw error;
    }
}

export { mergeVideoWithAudio };