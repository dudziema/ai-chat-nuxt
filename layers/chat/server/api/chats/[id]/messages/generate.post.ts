import { getMessagesByChatId, createMessageForChat } from '~~/layers/chat/server/repository/chatRepository';
import { generateChatResponse, createOllamaModel } from '~~/layers/chat/server/service/ai-service';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const history = await getMessagesByChatId(id);
  const ollamaModel = createOllamaModel();

  const reply = await generateChatResponse(ollamaModel as LanguageModelV1, history);

  return createMessageForChat({
    chatId: id,
    role: 'assistant',
    content: reply
  });
});
