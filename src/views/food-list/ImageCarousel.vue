ImageCarousel
<template>
  <NCarousel
    :current-index="selectedImage"
    :show-dots="false"
    trigger="click"
    class="carousel-image-container"
  >
    <NCarouselItem v-for="(image, index) in images" :key="index">
      <div>
        <img :src="image.url" class="carousel-image" alt="Carousel Image" />
      </div>
    </NCarouselItem>
  </NCarousel>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { NCarousel, NCarouselItem } from 'naive-ui'

const props = defineProps<{
  images: { url: string }[]
  selectedImage: number
}>()
</script>

<style scoped>
.carousel-image-container {
  position: relative;
  width: 100%;
  height: calc(50vh);
  border: 2px solid #dce4ec;
  margin-bottom: 24px;
  overflow: hidden;
}

.carousel-image {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.image-selector {
  flex: 0 0 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

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
