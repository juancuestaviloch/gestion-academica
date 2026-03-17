import { chatWithGroq } from '../llm/provider.js';
import type { ChatMessage } from '../llm/provider.js';
import { tools, toolHandlers } from '../tools/index.js';
import { saveMessage, getHistory } from '../db/index.js';
import { syncMessageToCloud } from '../db/firebase.js';

const MAX_ITERATIONS = 5;

export async function runAgent(userId: number, userPrompt: string) {
  const history = getHistory(userId);
  const messages: ChatMessage[] = [
    { role: 'system', content: 'You are OpenGravity, a personal AI assistant. Be concise, helpful, and secure.' },
    ...history,
    { role: 'user', content: userPrompt },
  ];

  saveMessage(userId, 'user', userPrompt);
  syncMessageToCloud(userId, 'user', userPrompt);

  let iterations = 0;
  while (iterations < MAX_ITERATIONS) {
    const response = await chatWithGroq(messages, tools);
    
    if (!response.tool_calls) {
      const content = response.content || '';
      saveMessage(userId, 'assistant', content);
      syncMessageToCloud(userId, 'assistant', content);
      return content;
    }

    // Handle tool calls
    messages.push({
      role: 'assistant',
      content: response.content || '',
      tool_calls: response.tool_calls,
    } as any);

    for (const toolCall of response.tool_calls) {
      const handler = toolHandlers[toolCall.function.name];
      if (handler) {
        const result = handler(JSON.parse(toolCall.function.arguments));
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          name: toolCall.function.name,
          content: result,
        });
      }
    }
    
    iterations++;
  }

  return 'Lo siento, he alcanzado el límite de pensamiento para esta tarea.';
}
