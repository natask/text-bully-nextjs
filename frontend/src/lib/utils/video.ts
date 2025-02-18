import ffmpeg, { FfprobeData } from 'fluent-ffmpeg';
import fs from 'fs';

async function getMediaDuration(filePath: string): Promise<number> {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err: Error | null, metadata: FfprobeData) => {
            if (err) reject(err);
            resolve(metadata.format.duration || 0);
        });
    });
}

async function mergeVideoWithAudio(wavPath: string, videoPath: string, outputPath: string): Promise<string> {
    try {
        // Get audio duration
        const audioDuration = await getMediaDuration(wavPath);

        return new Promise((resolve, reject) => {
            ffmpeg()
                .input(videoPath)
                .inputOptions(['-stream_loop -1']) // Loop video
                .input(wavPath)
                .addOutputOptions([
                    '-c:v copy',           // Copy video codec (no re-encoding)
                    `-t ${audioDuration}`, // Match audio duration
                    '-shortest',           // End when shortest input ends
                ])
                .save(outputPath)
                .on('end', () => {
                    resolve(outputPath);
                })
                .on('error', (err: Error) => {
                    reject(err);
                });
        });
    } catch (error) {
        console.error('Error in mergeVideoWithAudio:', error);
        throw error;
    }
}

export { mergeVideoWithAudio };