import { Groq } from 'groq-sdk';
import { config } from '../config/index.js';

const groq = new Groq({ apiKey: config.groqApiKey });

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_call_id?: string;
  name?: string;
}

export async function chatWithGroq(messages: ChatMessage[], tools?: any[]) {
  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: messages as any,
      tools: tools,
      tool_choice: 'auto',
    });
    return response.choices[0].message;
  } catch (error: any) {
    console.error('Groq API Error:', error.message);
    if (config.openrouterApiKey) {
      return chatWithOpenRouter(messages, tools);
    }
    throw error;
  }
}

async function chatWithOpenRouter(messages: ChatMessage[], tools?: any[]) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openrouterApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.openrouterModel,
        messages: messages,
        tools: tools,
      }),
    });
    const data = await response.json() as any;
    return data.choices[0].message;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.message);
    throw error;
  }
}
