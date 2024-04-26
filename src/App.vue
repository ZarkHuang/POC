<script setup lang="ts">
import { darkTheme, zhTW, dateZhTW, type GlobalComponentConfig } from 'naive-ui'
import { APP_THEME_KEY } from '@/utils/config'
// import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const themeOverrides: GlobalComponentConfig = {}

const isDarkTheme = ref(false)
const theme = computed(() => {
  return isDarkTheme.value ? darkTheme : undefined
})

function toggleDarkTheme() {
  isDarkTheme.value = !isDarkTheme.value
}

provide(APP_THEME_KEY, {
  isDarkTheme,
  toggleDarkTheme,
})

onMounted(() => {
  if (!authStore.isLoggedIn) {
    router.push('/sign-in')
  }
})
</script>

<template>
  <NConfigProvider
    :theme="theme"
    :theme-overrides="themeOverrides"
    :locale="zhTW"
    :date-locale="dateZhTW"
  >
    <NMessageProvider>
      <NDialogProvider>
        <component :is="route.meta.layout || 'div'">
          <RouterView />
        </component>
      </NDialogProvider>
    </NMessageProvider>
  </NConfigProvider>
  <VueQueryDevtools />
</template>

<style module lang="scss"></style>
