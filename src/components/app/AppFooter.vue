<script setup lang="ts">
const currentYear = computed(() => {
  return new Date().getFullYear()
})
</script>

<template>
  <div :class="$style.appFooterContainer">
    <NText depth="3">
      &copy; 2018-{{ currentYear }} EverFortune.AI Co., Ltd. All Rights Reserved
    </NText>

    <AppVersion :class="$style.appVersion" />
  </div>
</template>

<style module lang="scss">
.appFooterContainer {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 12px;
}

.appVersion {
  position: absolute;
  top: 50%;
}
</style>
