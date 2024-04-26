<script setup lang="ts">
import SignInForm from './_components/SignInForm.vue'
import brandLogoEFAI from '@/assets/efai-logo.svg'
</script>

<template>
  <NLayout embedded :class="$style.pageContainer">
    <div :class="$style.appThemeToggler">
      <AppThemeToggler />
    </div>

    <NCard size="large" content-style="width: 360px;">
      <template #header>
        <NSpace vertical justify="center" align="center">
          <NImage :src="brandLogoEFAI" preview-disabled />
          <NH2> </NH2>
        </NSpace>
      </template>

      <SignInForm />
    </NCard>

    <AppVersion :class="$style.appVersion" />
  </NLayout>
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
