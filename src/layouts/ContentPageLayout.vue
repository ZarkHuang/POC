<script setup lang="ts"></script>

<template>
  <NLayout position="absolute">
    <NLayoutHeader bordered style="height: var(--header-height)">
      <AppHeader />
    </NLayoutHeader>

    <NLayoutContent
      position="absolute"
      :style="`top: var(--header-height); bottom: var(--footer-height); padding: 16px;`"
      content-style="height: calc(100vh - var(--header-height) - var(--footer-height));"
    >
      <RouterView />
    </NLayoutContent>

    <NLayoutFooter position="absolute" style="height: var(--footer-height)">
      <AppFooter />
    </NLayoutFooter>
  </NLayout>
</template>

<style module lang="scss">

:root {
    --header-height: 60px;
    --footer-height: 36px;
}
</style>
