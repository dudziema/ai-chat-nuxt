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
    const chat = await createChat(options);

    if (chat.projectId) {
      await navigateTo(`/projects/${chat.projectId}/chats/${chat.id}`);
    } else {
      await navigateTo(`/chats/${chat.id}`);
    }
  }

  async function createChat(options: { projectId?: string; title?: string } = {}) {
    const newChat = await $fetch<Chat>('/api/chats', {
      method: 'POST',
      body: {
        projectId: options.projectId,
        title: options.title || 'New Chat'
      }
    });

    chats.value.push(newChat);

    return newChat;
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
