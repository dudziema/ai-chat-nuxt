import { generateText, streamText } from 'ai';
import { createOllama } from 'ollama-ai-provider';
import type { Message, LanguageModelV1 } from 'ai';

export const createOllamaModel = () => {
  const ollama = createOllama();
  return ollama('llama3.2');
};

export async function generateChatResponse(model: LanguageModelV1, messages: Message[]) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages format');
  }
  const response = await generateText({ model, messages });

  return response.text.trim();
}

export async function generateChatTitle(model: LanguageModelV1, firstMessage: string): Promise<string> {
  const response = await generateText({
    model,
    messages: [
      {
        role: 'system',
        content:
          'You are a helpful assistant that generates concise, descriptive titles for chat conversations. Generate a title that captures the essence of the conversation based on the first user message in 3 short words or less. Do not use any special characters or punctuation. The title should be clear and relevant to the topic discussed.'
      },
      {
        role: 'user',
        content: firstMessage
      }
    ]
  });

  return response.text.trim();
}

export async function streamChatResponse(model: LanguageModelV1, messages: Message[]) {
  if (!Array.isArray(messages) || messages.length === 0) {
    throw new Error('Invalid messages format');
  }

  return streamText({
    model,
    messages
  }).textStream;
}
