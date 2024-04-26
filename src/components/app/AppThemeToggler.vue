<script setup lang="ts">
import { Sun, Moon } from '@vicons/carbon'
import { APP_THEME_KEY } from '@/utils/config'
import { AppThemeProviderType } from '@/global'

const { isDarkTheme, toggleDarkTheme } = inject(
  APP_THEME_KEY,
) as AppThemeProviderType
</script>

<template>
  <NButton @click="toggleDarkTheme">
    <NIcon v-if="isDarkTheme" :component="Moon" />
    <NIcon v-else :component="Sun" />
  </NButton>
</template>

<style module lang="scss"></style>
