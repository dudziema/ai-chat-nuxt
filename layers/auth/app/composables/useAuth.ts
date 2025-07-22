export const useAuth = () => {
  const { loggedIn, user, session, fetch, clear } = useUserSession();

  const logout = async () => {
    await clear();
    await navigateTo('/login');
  };
  const isAuthenticated = computed(() => loggedIn.value);
  const userName = computed(() => (user.value as GithubUser)?.name ?? (user.value as GithubUser)?.email ?? 'User');
  const userAvatar = computed(() => (user.value as GithubUser)?.avatar ?? null);
  const userEmail = computed(() => (user.value as GithubUser)?.email ?? null);
  return {
    user: readonly(user),
    session: readonly(session),
    refresh: fetch,
    isAuthenticated,
    userName,
    userAvatar,
    userEmail,
    logout
  };
};
