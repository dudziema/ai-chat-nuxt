import { getMessagesByChatId, createMessageForChat } from '~~/layers/chat/server/repository/chatRepository';
import { streamChatResponse, createOllamaModel } from '~~/layers/chat/server/service/ai-service';
import type { LanguageModelV1 } from 'ai';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const history = await getMessagesByChatId(id);
  const ollamaModel = createOllamaModel();

  const stream = await streamChatResponse(ollamaModel as LanguageModelV1, history);

  setResponseHeaders(event, {
    'Content-Type': 'text/html',
    'Cache-Control': 'no-cache',
    'Transfer-Encoding': 'chunked'
  });

  let completeResponse = '';
  const transformStream = new TransformStream({
    transform(chunk, controller) {
      completeResponse += chunk;
      controller.enqueue(chunk);
    },

    async flush() {
      await createMessageForChat({
        chatId: id,
        role: 'assistant',
        content: completeResponse
      });
    }
  });
  return stream.pipeThrough(transformStream);
});
