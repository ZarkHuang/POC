<script setup lang="ts"></script>

<template>
  <NLayout position="absolute">
    <NLayoutHeader bordered style="height: 60px">
      <AppHeader />
    </NLayoutHeader>

    <NLayoutContent
      position="absolute"
      style="top: 60px; bottom: 36px"
      content-style="padding: 16px;"
    >
      <RouterView />
    </NLayoutContent>

    <NLayoutFooter position="absolute" style="height: 36px">
      <AppFooter />
    </NLayoutFooter>
  </NLayout>
</template>

<style module lang="scss"></style>
