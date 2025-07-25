<script setup lang="ts">
const props = defineProps<{
  chat: Chat;
  messages: ChatMessage[];
  typing: boolean;
}>();

const emit = defineEmits<{
  (e: 'send-message', message: string): void;
}>();

const { showScrollButton, scrollToBottom, pinToBottom } = useChatScroll();

function handleSendMessage(message: string) {
  emit('send-message', message);
}

watch(() => props.messages, pinToBottom, { deep: true, immediate: true });

const route = useRoute();
const isOnProjectPage = computed(() => !!route.params.projectId);

const isAssignModalOpen = ref(false);

function openAssignModal() {
  isAssignModalOpen.value = true;
}

function closeAssignModal() {
  isAssignModalOpen.value = false;
}
</script>

<template>
  <div
    ref="scrollContainer"
    class="scroll-container"
  >
    <UContainer class="chat-container">
      <div
        v-if="!messages?.length"
        class="empty-state"
      >
        <div class="empty-state-card">
          <h2 class="empty-state-title">Start your chat</h2>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </div>

      <template v-else>
        <div class="chat-header">
          <h1 class="title">
            <TypewriterText :text="chat.title || 'Chat with AI'" />
          </h1>

          <UButton
            v-if="!isOnProjectPage"
            color="neutral"
            variant="soft"
            icon="i-heroicons-folder-plus"
            size="sm"
            @click="openAssignModal"
          >
            Assign to Project
          </UButton>
        </div>

        <div class="messages-container">
          <div
            v-for="message in messages"
            :key="message.id"
            class="message"
            :class="{
              'message-user': message.role === 'user',
              'message-ai': message.role === 'assistant'
            }"
          >
            <div class="message-content">
              <MarkdownRenderer
                :cache-key="message.id"
                :content="message.content"
              />
            </div>
          </div>

          <span
            v-if="typing"
            class="typing-indicator"
          >
            &#9611;
          </span>
        </div>

        <div class="message-form-container">
          <div class="scroll-to-bottom-button-container">
            <UButton
              v-if="showScrollButton"
              color="neutral"
              variant="outline"
              icon="i-heroicons-arrow-down"
              class="rounded-full shadow-sm"
              @click="() => scrollToBottom()"
            />
          </div>
          <ChatInput @send-message="handleSendMessage" />
        </div>
      </template>
    </UContainer>

    <LazyAssignToProjectModal
      v-if="isAssignModalOpen"
      :chat-id="chat.id"
      @close="closeAssignModal"
    />
  </div>
</template>

<style scoped>
/* ===== Layout & Container Styles ===== */
.scroll-container {
  overflow-y: auto;
  width: 100%;
  box-sizing: border-box;
  flex: 1 1 auto;
  min-height: 0;
}

.chat-container {
  max-width: 800px;
  height: 100%;
}

/* ===== Header Styles ===== */
.chat-header {
  margin-bottom: 1.5rem;
  padding: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--ui-text);
}

/* ===== Messages Container ===== */
.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  overflow-y: auto;
  padding-bottom: 8rem;
}

/* ===== Message Styles ===== */
.message {
  padding: 1rem;
  border-radius: var(--ui-radius);
  transition: all 0.2s;
}

.message-user {
  background-color: var(--ui-bg-muted);
  border: 1px solid var(--ui-border);
  width: 70%;
  align-self: flex-end;
}

.message-ai {
  width: 100%;
  padding: 1rem 0;
  border: none;
  background: none;
}

.message-content {
  color: var(--ui-text);
  word-wrap: break-word;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

/* ===== Input Form Styles ===== */
.message-form-container {
  position: fixed;
  bottom: 1.5rem;
  max-width: 800px;
  width: calc(100% - 3rem); /* Account for container padding */
  z-index: 10;
}

.scroll-to-bottom-button-container {
  position: absolute;
  bottom: calc(100% + 1rem);
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.scroll-to-bottom-button-container :deep(button) {
  pointer-events: auto;
}

/* ===== Empty State Styles ===== */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 100%;
}

.empty-state-card {
  background-color: var(--ui-bg-elevated);
  padding: 2rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.empty-state-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--ui-text-muted);
  text-align: center;
}

.empty-state-message {
  font-size: 1rem;
  color: var(--ui-text-muted);
}

/* ===== Utility Styles ===== */
/* Hide scrollbar across browsers */
.message-input {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.message-input::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.typing-indicator {
  display: inline-block;
  animation: pulse 1s infinite;
  margin-left: 0.25rem;
}
</style>
