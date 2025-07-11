import type { Chat } from '~/types';
import { MOCK_CHAT } from './mockData';

export default function useChats(options: { projectId?: string } = {}) {
  const chats = useState<Chat[]>('chats', () => [MOCK_CHAT]);

  function createChat() {
    const id = (chats.value.length + 1).toString();
    const chat = {
      id,
      title: `Chat ${id}`,
      projectId: options.projectId,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    };
    chats.value.push(chat);

    return chat;
  }

  return {
    chats,
    createChat
  };
}
