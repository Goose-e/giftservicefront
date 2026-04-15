import { computed, reactive } from 'vue';
import { LocalStorageTokenStorage } from '../frontendBackendProtocolClient';

const userKey = 'gift-service-user';

const state = reactive({
  user: readUser()
});

function readUser() {
  try {
    return JSON.parse(localStorage.getItem(userKey) || 'null');
  } catch {
    return null;
  }
}

export const authStore = {
  state,
  isAuthenticated: computed(() => {
    const tokenStorage = new LocalStorageTokenStorage();
    return Boolean(state.user && tokenStorage.getTokens()?.accessToken);
  }),
  setUser(user) {
    state.user = user;
    localStorage.setItem(userKey, JSON.stringify(user));
  },
  clear() {
    state.user = null;
    localStorage.removeItem(userKey);
    new LocalStorageTokenStorage().clearTokens();
  }
};
