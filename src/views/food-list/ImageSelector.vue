<template>
  <NSpace vertical align="center">
    <NButton :disabled="atTop" @click="scrollUp" type="primary" size="large">
      <NIcon size="20" :component="ArrowUp" />
    </NButton>
    <div class="image-scroll-container" ref="scrollContainer" @scroll="checkScrollPosition">
      <NGrid cols="1" x-gap="6">
        <NGi v-for="(image, index) in images" :key="image.url">
          <NButton :class="['image-button', { selected: index === selectedImage }]" @click="selectImage(index)">
            <div class="image-container">
              <NSpin :show="isRecognizing && index === selectedImage">
              <img :src="image.url" :alt="'Image ' + (index + 1)" loading="lazy" class="image-preview" />
            </NSpin>
              <NIcon v-if="image.is_label" size="24" :component="CheckmarkFilled" class="label-icon" />
            </div>
          </NButton>
        </NGi>
      </NGrid>
    </div>
    <NButton :disabled="atBottom" @click="scrollDown" type="primary" size="large">
      <NIcon size="20" :component="ArrowDown" />
    </NButton>
    <NButton :disabled="atTop" @click="scrollToSelected" type="primary" size="large">
      回到選擇的圖片
    </NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { NButton, NIcon, NGrid, NGi, NSpace } from 'naive-ui'
import { ArrowUp, ArrowDown, CheckmarkFilled } from '@vicons/carbon'

const { images, selectedImage, isRecognizing } = defineProps<{
  images: { url: string, is_label: boolean }[]
  selectedImage: number
  isRecognizing: boolean
}>();

const scrollContainer = ref<HTMLDivElement | null>(null)
const atTop = ref(true)
const atBottom = ref(false)
const emit = defineEmits(['update:selectedImage']);

function selectImage(index: any) {
  emit('update:selectedImage', index);
}

function scrollToSelected() {
  const selectedImageElement = document.querySelector('.image-button.selected');
  if (selectedImageElement) {
    selectedImageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function scrollUp() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop -= 60
    checkScrollPosition()
  }
}

function scrollDown() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop += 60
    checkScrollPosition()
  }
}

function checkScrollPosition() {
  const container = scrollContainer.value
  if (!container) return
  atTop.value = container.scrollTop === 0
  atBottom.value =
    container.scrollTop + container.clientHeight >= container.scrollHeight
}
</script>

<style scoped>
.image-button {
  width: 200px;
  height: 120px;
  margin: 8px auto;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease-in-out;
}

.image-button:not(.selected) .image-preview {
  filter: grayscale(100%);
  opacity: 0.6
}

.image-button.selected {
  width: 220px;
  height: 120px;
  background-color: #fff;
  opacity: 1.0;
}

.label-icon {
  position: absolute;
  color: green;
  background-color: #fff;
  border-radius: 50%;
  z-index: 1;
}

.image-scroll-container {
  overflow-y: auto;
  height: calc(50vh);
  max-height: 360px;
  width: 100%;
}

.image-scroll-container::-webkit-scrollbar {
  /* display: none; */
}

.image-container {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.image-preview {
  width: 180px;
  height: 100px;
  object-fit: cover;
}
</style>