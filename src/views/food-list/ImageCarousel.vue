<template>
    <div class="carousel-container">
        <NSpin :show="isLoadingImage || isRecognizing">
            <div class="carousel-image-container" v-if="image">
                <div>
                    <img :src="image" class="carousel-image" loading="lazy" alt="Carousel Image" />
                </div>
            </div>
        </NSpin>
        <div class="button-container">
            <NButton @click="triggerRecognition" :disabled="clickCounts[selectedImage] >= 3 || isRecognizing"
                type="primary">圖像辨識</NButton>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { NButton, NSpin } from 'naive-ui';
import { recognizeImage } from '@/services/api/report';

const props = defineProps<{
    image: string;
    selectedImage: number;
    isLoadingImage: boolean; // 新增 prop
}>();

const emit = defineEmits(['recognitionResult', 'update:recognizing']);
const clickCounts = ref<Record<number, number>>({});
const isRecognizing = ref(false);

function extractImageId(url: string) {
    const parts = url.split('/');
    const imageId = parts[parts.length - 2];
    return imageId;
}

async function triggerRecognition() {
  if (!(props.selectedImage in clickCounts.value)) {
    clickCounts.value[props.selectedImage] = 0;
  }
  if (clickCounts.value[props.selectedImage] < 3) {
    clickCounts.value[props.selectedImage]++;
    const imageUrl = props.image;
    const imageId = extractImageId(imageUrl);
    if (imageId) {
      try {
        isRecognizing.value = true;
        emit('update:recognizing', true);
        const response = await recognizeImage(imageId);
        if (response.error_code) {
          emit('recognitionResult', { response: { error_desc: response.error_desc }, selectedIndex: props.selectedImage });
        } else {
          emit('recognitionResult', { response, selectedIndex: props.selectedImage });
        }
      } catch (error) {
        console.error('API call failed:', error);
        emit('recognitionResult', { response: { error_desc: 'API 呼叫失敗，請稍後再試。' }, selectedIndex: props.selectedImage });
      } finally {
        isRecognizing.value = false;
        emit('update:recognizing', false);
      }
    }
  }
}

</script>

<style scoped>
.carousel-container {
    display: flex;
    flex-direction: column;
}

.button-container {
    display: flex;
    justify-content: flex-end;
}

.carousel-image-container {
    position: relative;
    width: 100%;
    height: calc(50vh + 48px);
    border: 2px solid #dce4ec;
    margin-bottom: 24px;
}

.carousel-image {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
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
