import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  }),
  actions: {
    setLoginStatus(isLoggedIn: boolean) {
      this.isLoggedIn = isLoggedIn
      localStorage.setItem('isLoggedIn', String(isLoggedIn))
    },
    logOut() {
      this.isLoggedIn = false
      localStorage.removeItem('isLoggedIn')
    },
  },
})
