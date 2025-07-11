import type { Chat } from '~/types';
import { MOCK_CHAT } from './mockData';

export default function useChats() {
  const chats = useState<Chat[]>('chats', () => [MOCK_CHAT]);

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = createChat(options);

    await navigateTo(`/chats/${chat.id}`);
  }

  function createChat(options: { projectId?: string } = {}) {
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

  function chatInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  return {
    chats,
    createChat,
    createChatAndNavigate,
    chatInProject
  };
}
