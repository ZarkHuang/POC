ImageSelector
<template>
  <NSpace vertical align="center">
    <NButton :disabled="atTop" @click="scrollUp" type="primary" size="large">
      <NIcon size="20" :component="ArrowUp" />
    </NButton>
    <div
      class="image-scroll-container"
      ref="scrollContainer"
      @scroll="checkScrollPosition"
    >
      <NGrid cols="1" x-gap="6">
        <NGi v-for="(image, index) in images" :key="index">
          <NButton
            :style="getButtonStyle(index)"
            @click="selectImage(index)"
            style="padding: 0"
            class="test"
          >
            <div class="image-container" @click="selectImage(index)">
              <img
                :src="image.url"
                :alt="'Image ' + (index + 1)"
                class="image-preview"
              />
            </div>
          </NButton>
        </NGi>
      </NGrid>
    </div>
    <NButton
      :disabled="atBottom"
      @click="scrollDown"
      type="primary"
      size="large"
    >
      <NIcon size="20" :component="ArrowDown" />
    </NButton>
  </NSpace>
</template>

<script setup lang="ts">
import { ref, defineProps } from 'vue'
import { NButton, NIcon, NGrid, NGi, NSpace } from 'naive-ui'
import { ArrowUp, ArrowDown } from '@vicons/carbon'

const props = defineProps<{
  images: { url: string }[]
  selectedImage: number
  selectImage: (index: number) => void
}>()

const { images, selectedImage, selectImage } = props
const scrollContainer = ref<HTMLDivElement | null>(null)
const atTop = ref(true)
const atBottom = ref(false)

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

function getButtonStyle(index: number) {
  const isSelected = props.selectedImage === index
  return {
    width: isSelected ? '100px' : '80px',
    height: isSelected ? '100px' : '80px',
    margin: '8px auto',
    backgroundColor: isSelected ? '#fff' : '#f0f0f0',
    opacity: isSelected ? '1.0' : '0.5',
    filter: isSelected ? 'none' : 'grayscale(100%)',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}
</script>
<style scoped>
.image-scroll-container {
  overflow-y: auto;
  height: calc(50vh);
  max-height: 360px;
  width: 100%;
}

.image-scroll-container.test {
  width: 200px;
}

.image-scroll-container::-webkit-scrollbar {
  display: none;
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
  width: 80px;
  height: 80px;
  object-fit: cover;
}
</style>
