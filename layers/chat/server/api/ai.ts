import { createOllamaModel, generateChatResponse } from '../service/ai-service';
import { ChatMessageSchema } from '../schemas';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { success, data } = await readValidatedBody(event, ChatMessageSchema.safeParse);

  if (!success) {
    return 400;
  }

  const { messages } = data as {
    messages: ChatMessage[];
    chatId: string;
  };

  const ollamaModel = createOllamaModel();

  const response = await generateChatResponse(ollamaModel as LanguageModelV1, messages);

  return {
    id: messages.length.toString(),
    role: 'assistant',
    content: response
  };
});
