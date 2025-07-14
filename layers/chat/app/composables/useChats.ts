export default function useChats() {
  const {
    data: chats,
    execute,
    status
  } = useAsyncData<Chat[]>(
    'chats',
    () => {
      return $fetch<Chat[]>('/api/chats');
    },
    {
      immediate: false,
      default: () => []
    }
  );

  async function fetchChats() {
    if (status.value !== 'idle') return;
    await execute();
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
