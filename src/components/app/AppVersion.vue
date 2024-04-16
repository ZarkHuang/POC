<script setup lang="ts">
const appVersion = import.meta.env.VITE_APP_VERSION
</script>

<template>
  <div :class="$style.appVersion">{{ appVersion }}</div>
</template>

<style module lang="scss">
.appVersion {
  font-size: 12px;
  text-align: center;
  color: rgba(darkgray, 0.2);
}
</style>
