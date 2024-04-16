<template>
    <div class="wrap">
        <FileUploadButton :fileName="fileName" @file-selected="handleFileSelected" />
        <ImagePreview :file="selectedFile" @update:file="handleFileSelected" @reset="handleReset" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import FileUploadButton from '@/views/food-list/_components/FileUploadButton.vue';
import ImagePreview from '@/views/food-list/_components/ImagePreview.vue';

const selectedFile = ref<File | null>(null);
const fileName = ref('未選擇文件...');

function handleFileSelected(file: File | undefined) {
    if (file) { 
        selectedFile.value = file;
        fileName.value = file.name;
    } else {
        selectedFile.value = null;
        fileName.value = '未選擇文件...';
    }
}

function handleReset() {
    selectedFile.value = null;
    fileName.value = '未選擇名稱...';
}
</script>


<style>
.wrap {
    width: 100%;
    height: calc(100vh - 120px);
    margin: 0 auto;
    text-align: center;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}


.image-container img {
    max-width: 100%;
}
</style>
