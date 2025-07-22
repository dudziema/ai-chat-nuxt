import { updateChat, getChatByIdForUser } from '../../../repository/chatRepository';

import { generateChatTitle, createOllamaModel } from '~~/layers/chat/server/service/ai-service';
import { UpdateChatTitleSchema } from '../../../schemas';
import { getAuthenticatedUserId } from '#layers/auth/server/utils/auth';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const userId = await getAuthenticatedUserId(event);

  // Verify user owns the chat
  const chat = await getChatByIdForUser(id, userId);
  if (!chat) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Chat not found'
    });
  }

  const { success, data } = await readValidatedBody(event, UpdateChatTitleSchema.safeParse);

  if (!success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request'
    });
  }

  const ollamaModel = createOllamaModel() as LanguageModelV1;
  const title = await generateChatTitle(ollamaModel, data.message);

  return updateChat(id, { title });
});
