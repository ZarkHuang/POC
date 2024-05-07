import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

type AuthStoreState = {
  isLoggedIn: boolean
  token?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 使用 useStorage 來持久化存儲 isLoggedIn 和 token
    authState: useStorage<AuthStoreState>('authState', {
      isLoggedIn: false,
      token: undefined,
    }),
  }),
  actions: {
    setLoginStatus(isLoggedIn: boolean, token?: string) {
      this.authState.isLoggedIn = isLoggedIn
      this.authState.token = token // 保存 token
      // localStorage 的操作可以省略，因為 useStorage 已經處理了持久化
    },
    logOut() {
      this.authState.isLoggedIn = false
      this.authState.token = undefined // 清除 token
    },
  },
})
