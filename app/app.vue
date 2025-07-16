<script setup lang="ts">
const { fetchChats, prefetchChatMessages } = useChats();
const { fetchProjects } = useProjects();

await Promise.all([fetchProjects(), fetchChats()]);
await callOnce(prefetchChatMessages);
</script>

<template>
  <UApp>
    <NuxtRouteAnnouncer />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
