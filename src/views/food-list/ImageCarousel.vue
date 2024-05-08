<template>
    <div class="carousel-image-container">
        <NCarousel :current-index="selectedImage" :show-dots="false" trigger="click">
            <NCarouselItem v-for="(image, index) in images" :key="index">
                <div>
                    <img :src="image.url" class="carousel-image" loading="lazy" alt="Carousel Image" />
                </div>
            </NCarouselItem>
        </NCarousel>
        <NButton @click="triggerRecognition" type="primary">圖像辨識</NButton>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { NCarousel, NCarouselItem, NButton } from 'naive-ui';
import { recognizeImage } from '@/services/api/report';

const props = defineProps<{
    images: { url: string }[];
    selectedImage: number;
}>();

const emit = defineEmits(['recognitionResult']);

function extractImageId(url) {
    const parts = url.split('/');
    const imageId = parts[parts.length - 2];
    return imageId;
}

async function triggerRecognition() {
    const imageUrl = props.images[props.selectedImage].url;
    const imageId = extractImageId(imageUrl);
    console.log("Extracted image ID:", imageId);
    if (imageId) {
        try {
            const response = await recognizeImage(imageId);
            console.log(response.data.data)
            if (response.data.error_code === 0) {
                emit('recognitionResult', response.data.data);
            } else {
                console.error('Recognition error:');
            }
        } catch (error) {
            console.error('API call failed:', error);
        }
    }
}

</script>



<style scoped>
.carousel-image-container {
    position: relative;
    width: 100%;
    height: calc(50vh);
    border: 2px solid #dce4ec;
    margin-bottom: 24px;
    /* overflow: hidden; */
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
