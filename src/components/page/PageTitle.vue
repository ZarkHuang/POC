<script setup lang="ts"></script>

<template>
  <div :class="$style.titleContainer">
    <div :class="$style.titlePrefix"></div>

    <div :class="$style.titleText">
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.titleContainer {
  position: relative;
  margin-bottom: 8px;
  padding: 0 16px;
}

.titlePrefix {
  position: absolute;
  top: 50%;
  left: 0;
  width: 4px;
  height: 60%;
  background-color: #777777;
  transform: translateY(-50%);
}

.titleText {
  font-size: 18px;
  font-weight: bold;
}
</style>
