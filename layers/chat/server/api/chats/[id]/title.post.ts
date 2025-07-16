import { updateChat } from '../../../repository/chatRepository';
import { generateChatTitle, createOllamaModel } from '../../../service/ai-service';
import { UpdateChatTitleSchema } from '../../../schemas';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const { success, data } = await readValidatedBody(event, UpdateChatTitleSchema.safeParse);

  if (!success) {
    return 400;
  }

  const ollamaModel = createOllamaModel();

  const title = await generateChatTitle(ollamaModel as LanguageModelV1, data.message);

  return updateChat(id, { title });
});
