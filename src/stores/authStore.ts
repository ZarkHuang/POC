// stores/authStore.ts
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type AuthStoreState = {
  isLoggedIn: boolean
  token?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    authState: useStorage<AuthStoreState>('authState', {
      isLoggedIn: false,
      token: '',
    }),
  }),
  actions: {
    setLoginStatus(isLoggedIn: boolean, token?: string) {
      this.authState.isLoggedIn = isLoggedIn;
      this.authState.token = token;
      console.log('Token set in localStorage:', token);
    },
    logOut() {
      this.authState.isLoggedIn = false;
      this.authState.token = undefined;
    },
  },
})
