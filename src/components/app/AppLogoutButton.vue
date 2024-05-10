<script setup lang="ts">
import { Logout } from '@vicons/carbon'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router';

const authStore = useAuthStore()
const router = useRouter()

function handleSignOutClick() {
  authStore.logOut()
  router.push('/sign-in')
}
</script>

<template>
  <NTooltip trigger="hover">
    <template #trigger>
      <NButton type="error" secondary @click="handleSignOutClick">
        <NIcon :component="Logout" />
      </NButton>
    </template>
    登出
  </NTooltip>
</template>

<style module lang="scss"></style>
