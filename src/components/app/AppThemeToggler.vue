<script setup lang="ts">
import { Sun, Moon } from '@vicons/carbon'
import { APP_THEME_KEY } from '@/utils/config'

const { isDarkTheme, toggleDarkTheme } = inject(
  APP_THEME_KEY,
) as AppThemeProviderType
</script>

<template>
  <n-button @click="toggleDarkTheme">
    <n-icon v-if="isDarkTheme" :component="Moon" />
    <n-icon v-else :component="Sun" />
  </n-button>
</template>

<style module lang="scss"></style>
