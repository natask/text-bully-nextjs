import Replicate from "replicate";
import { writeFile } from "node:fs/promises";
import { REPLICATE_API_TOKEN } from "./config.js";

async function main() {
    const replicate = new Replicate({
        auth: REPLICATE_API_TOKEN,
    });

    const input = {
        gen_text: "My name is Charles",
        ref_text: "never underestimate the power of the scout's code",
        ref_audio: "https://replicate.delivery/pbxt/LnHEJTVWhjLcpGQJTBralyztLwl8diaLyHjP2a1KXJ8dxVWv/Teemo_Original_Taunt.ogg"
    };

    try {
        const output = await replicate.run(
            "x-lance/f5-tts:87faf6dd7a692dd82043f662e76369cab126a2cf1937e25a9d41e0b834fd230e",
            { input }
        );

        // Save the audio file
        await writeFile("output.wav", Buffer.from(output));
        console.log("Successfully saved output.wav");
    } catch (error) {
        console.error("Error:", error.message);
    }
}

main().catch(console.error);