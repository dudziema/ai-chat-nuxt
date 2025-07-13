import { updateChat } from '../../../repository/chatRepository';
import { generateChatTitle, createOllamaModel } from '../../../service/ai-service';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const { message } = await readBody(event);

  const ollamaModel = createOllamaModel();

  const title = await generateChatTitle(ollamaModel as LanguageModelV1, message);

  return updateChat(id, { title });
});
