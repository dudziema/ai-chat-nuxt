export default function useChat(chatId: string) {
  const { chats } = useChats();
  const chat = computed(() => chats.value.find((c) => c.id === chatId));

  const messages = computed<ChatMessage[]>(() => chat.value?.messages || []);

  const { data, execute, status } = useFetch<ChatMessage[]>(`/api/chats/${chatId}/messages`, {
    default: () => [],
    immediate: false
  });

  async function fetchMessages({ refresh = false }: { refresh?: boolean } = {}) {
    const hasExistingMessages = messages.value.length > 1;
    const isRequestInProgress = status.value !== 'idle';
    const shouldSkipDueToExistingMessages = !refresh && (hasExistingMessages || isRequestInProgress);

    if (shouldSkipDueToExistingMessages || !chat.value) {
      return;
    }
    await execute();
    chat.value.messages = data.value;
  }

  async function generateChatTitle(message: string) {
    if (!chat.value) return;

    const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}/title`, {
      method: 'POST',
      body: { message }
    });
    chat.value.title = updatedChat.title;
  }

  async function sendMessage(message: string) {
    if (!chat.value) return;

    if (messages.value.length === 0) {
      await generateChatTitle(message);
    }

    const optimisticUserMessage: ChatMessage = {
      id: `optimistic-user-message-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    messages.value.push(optimisticUserMessage);

    const userMessageIndex = messages.value.length - 1;

    try {
      const newMessage = await $fetch<ChatMessage>(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        body: {
          content: message,
          role: 'user'
        }
      });

      messages.value[userMessageIndex] = newMessage;
    } catch (error) {
      console.error('Error sending user message:', error);
      messages.value.splice(userMessageIndex, 1); // Remove optimistic message on error
    }
    messages.value.push({
      id: `streaming-message-${Date.now()}`,
      role: 'assistant',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const lastMessage = messages.value[messages.value.length - 1] as ChatMessage;

    try {
      const response = await $fetch<ReadableStream>(`/api/chats/${chatId}/messages/stream`, {
        method: 'POST',
        responseType: 'stream',
        body: {
          messages: messages.value
        }
      });

      const decodedStream = response.pipeThrough(new TextDecoderStream());

      const reader = decodedStream.getReader();
      await reader.read().then(async function processText({ done, value }): Promise<void> {
        if (done) {
          return;
        }
        lastMessage.content += value;
        return reader.read().then(processText);
      });
    } catch (error) {
      console.error('Error streaming message:', error);
    } finally {
      await fetchMessages({ refresh: true });
    }

    chat.value.updatedAt = new Date();
  }

  async function assignToProject(projectId: string | null) {
    if (!chat.value) return;

    const originalProjectId = chat.value.projectId;

    // Optimistically update the chat
    chat.value.projectId = projectId || undefined;

    try {
      const updatedChat = await $fetch<Chat>(`/api/chats/${chatId}`, {
        method: 'PUT',
        body: {
          projectId
        }
      });

      // Update the chat in the chats list
      const chatIndex = chats.value.findIndex((c) => c.id === chatId);
      if (chatIndex !== -1 && chats.value[chatIndex]) {
        chats.value[chatIndex].projectId = updatedChat.projectId;
        chats.value[chatIndex].updatedAt = updatedChat.updatedAt;
      }
    } catch (error) {
      console.error('Error assigning chat to project', error);
      // Revert optimistic update
      chat.value.projectId = originalProjectId;
      throw error;
    }
  }

  return {
    chat,
    messages,
    sendMessage,
    fetchMessages,
    assignToProject
  };
}
