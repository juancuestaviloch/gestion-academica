import dotenv from 'dotenv';
dotenv.config();

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN || '',
  allowedUserIds: (process.env.TELEGRAM_ALLOWED_USER_IDS || '').split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id)),
  groqApiKey: process.env.GROQ_API_KEY || '',
  openrouterApiKey: process.env.OPENROUTER_API_KEY || '',
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || '',
  dbPath: process.env.DB_PATH || './memory.db',
};

if (!config.telegramToken) console.warn('Missing TELEGRAM_BOT_TOKEN');
if (!config.groqApiKey) console.warn('Missing GROQ_API_KEY');
