<template>
  <UContainer class="page-container">
    <h1 class="title">Welcome to AI Chat</h1>
    <UButton to="/chat" class="button">Start Chatting</UButton>
  </UContainer>
</template>


<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.title {
  font-size: 2.25rem;
  font-weight: bold;
}

.button {
  margin-top: 1rem;
}
</style>