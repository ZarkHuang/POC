<script setup lang="ts">
import { Logout } from '@vicons/carbon'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

function handleSignOutClick() {
  authStore.logOut()
  router.push('/sign-in')
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <n-button type="error" secondary @click="handleSignOutClick">
        <n-icon :component="Logout" />
      </n-button>
    </template>
    登出
  </n-tooltip>
</template>

<style module lang="scss"></style>
