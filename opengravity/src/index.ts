import { Bot, InputFile } from 'grammy';
import { config } from './config/index.js';
import { runAgent } from './agent/loop.js';
import { transcribeAudio } from './llm/transcription.js';
import { textToSpeech } from './llm/speech.js';
import fs from 'fs';
import path from 'path';

if (!config.telegramToken) {
  console.error('TELEGRAM_BOT_TOKEN is missing!');
  process.exit(1);
}

const bot = new Bot(config.telegramToken);

// Whitelist Middleware
bot.use(async (ctx, next) => {
  const userId = ctx.from?.id;
  if (!userId || !config.allowedUserIds.includes(userId)) {
    console.log(`Unauthorized access attempt from User ID: ${userId}`);
    if (userId) await ctx.reply(`Acceso denegado. Tu ID (${userId}) no está en la whitelist.`);
    return;
  }
  return next();
});

bot.command('start', (ctx) => ctx.reply('¡Hola! Soy OpenGravity, tu Agente Personal local. ¿En qué puedo ayudarte hoy?'));

bot.on('message:text', async (ctx) => {
  const userId = ctx.from.id;
  const text = ctx.message.text;

  await ctx.replyWithChatAction('typing');

  try {
    const response = await runAgent(userId, text);
    
    // If the user asked for voice, respond with voice
    if (text.toLowerCase().includes('formato voz') || text.toLowerCase().includes('háblame')) {
      await ctx.replyWithChatAction('record_voice');
      const voicePath = await textToSpeech(response, userId);
      await ctx.replyWithVoice(new InputFile(voicePath));
      if (fs.existsSync(voicePath)) fs.unlinkSync(voicePath); // cleanup
    } else {
      await ctx.reply(response);
    }
  } catch (error: any) {
    console.error('Agent Error:', error);
    await ctx.reply('Hubo un error al procesar tu solicitud: ' + error.message);
  }
});

bot.on('message:voice', async (ctx) => {
  const userId = ctx.from.id;
  await ctx.replyWithChatAction('typing');

  try {
    const file = await ctx.getFile();
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);
    const voicePath = path.join(tempDir, `input_${userId}_${Date.now()}.ogg`);
    
    // Download file
    const url = `https://api.telegram.org/file/bot${config.telegramToken}/${file.file_path}`;
    const response = await fetch(url);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(voicePath, buffer);

    const transcription = await transcribeAudio(voicePath);
    await ctx.reply(`🎙️ **Transcripción:** ${transcription}`, { parse_mode: 'Markdown' });

    const agentResponse = await runAgent(userId, transcription);
    
    // Respond with voice
    await ctx.replyWithChatAction('record_voice');
    const responseVoicePath = await textToSpeech(agentResponse, userId);
    await ctx.replyWithVoice(new InputFile(responseVoicePath));
    
    // Cleanup
    if (fs.existsSync(voicePath)) fs.unlinkSync(voicePath);
    if (fs.existsSync(responseVoicePath)) fs.unlinkSync(responseVoicePath);
  } catch (error: any) {
    console.error('Voice Processing Error:', error);
    await ctx.reply('No pude procesar tu audio: ' + error.message);
  }
});

console.log('OpenGravity is starting with Grammy...');
bot.start();
