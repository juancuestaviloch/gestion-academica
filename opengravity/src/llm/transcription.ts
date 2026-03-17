import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import { config } from '../config/index.js';

export async function transcribeAudio(filePath: string): Promise<string> {
  if (!config.groqApiKey) throw new Error('Groq API Key missing');

  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  form.append('model', 'whisper-large-v3');
  form.append('response_format', 'json');

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${config.groqApiKey}`,
      },
    });
    return response.data.text;
  } catch (error: any) {
    console.error('Transcription Error:', error.response?.data || error.message);
    throw new Error('Falló la transcripción del audio.');
  }
}
