import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { config } from '../config/index.js';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = 'pNInz6obpgmqMArAY7XM'; // "Anthony" or similar high-quality voice

export async function textToSpeech(text: string, userId: number): Promise<string> {
  if (!ELEVENLABS_API_KEY) throw new Error('ElevenLabs API Key missing');

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`;
  const response = await axios.post(url, {
    text: text,
    model_id: 'eleven_multilingual_v2',
    voice_settings: {
      stability: 0.5,
      similarity_boost: 0.75,
    }
  }, {
    headers: {
      'xi-api-key': ELEVENLABS_API_KEY,
      'Content-Type': 'application/json',
    },
    responseType: 'arraybuffer'
  });

  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
  
  const filePath = path.join(tempDir, `voice_${userId}_${Date.now()}.mp3`);
  fs.writeFileSync(filePath, Buffer.from(response.data));
  return filePath;
}
