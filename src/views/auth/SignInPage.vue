<script setup lang="ts">
import SignInForm from './_components/SignInForm.vue'
import brandLogoEFAI from '@/assets/efai-logo.svg'
</script>

<template>
  <n-layout embedded :class="$style.pageContainer">
    <div :class="$style.appThemeToggler">
      <app-theme-toggler />
    </div>

    <n-card size="large" content-style="width: 360px;">
      <template #header>
        <n-space vertical justify="center" align="center">
          <n-image :src="brandLogoEFAI" preview-disabled />
          <n-h2> </n-h2>
        </n-space>
      </template>

      <sign-in-form />
    </n-card>

    <app-version :class="$style.appVersion" />
  </n-layout>
</template>

<style module lang="scss">
.pageContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100%;
}

.appThemeToggler {
  position: absolute;
  top: 16px;
  right: 16px;
}

.appVersion {
  margin-top: 8px;
}
</style>
