<script setup lang="ts">
import brandLogoEFAI from '@/assets/efai-logo.svg'
</script>

<template>
  <div :class="$style.headerContainer">
    <NSpace align="center">
      <NImage :src="brandLogoEFAI" preview-disabled height="28" />
      <!-- <div :class="$style.headerTitle">基因寶管理後台</div> -->
    </NSpace>

    <NSpace>
      <AppThemeToggler />

      <AppLogoutButton />
    </NSpace>
  </div>
</template>

<style module lang="scss">
.headerContainer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  height: 100%;
}

.headerTitle {
  font-size: 16px;
}
</style>
