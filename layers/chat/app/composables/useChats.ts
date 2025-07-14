export default function useChats() {
  const chats = useState<Chat[]>('chats', () => []);
  const { data, execute, status } = useFetch<Chat[]>('/api/chats', {
    immediate: false,
    default: () => []
  });

  async function fetchChats() {
    if (status.value !== 'idle') return;
    await execute();
    chats.value = data.value || [];
  }

  async function createChatAndNavigate(options: { projectId?: string } = {}) {
    const chat = createChat(options);

    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chats/${chat.id}`);
    }
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

  function chatsInProject(projectId: string) {
    return chats.value.filter((chat) => chat.projectId === projectId);
  }

  return {
    chats,
    createChat,
    createChatAndNavigate,
    chatsInProject,
    fetchChats
  };
}
