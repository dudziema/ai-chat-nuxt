import { createMessageForChat } from '~~/layers/chat/server/repository/chatRepository';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);
  const body = await readBody(event);

  return createMessageForChat({
    chatId: id,
    role: body.role,
    content: body.content
  });
});
