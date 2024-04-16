<template>
    <div class="image-container" ref="imageContainer" @mousedown="startDrawing" @mouseup="finishDrawing" @mousemove="draw">
        <div :class="{ 'thumb': true, 'uploaded': imageUploaded }" @click.self="triggerFileInput">
            <input type="file" ref="fileInput" @change="internalFileChanged" accept="image/*" hidden />
            <div v-if="!imageUploaded">
                <NIcon :component="CloudUpload" class="upload-icon" :style="{ color: 'white' }" />
                <div class="upload-text">上傳圖片</div>
            </div>

            <div v-else>
                <CloseButton @close="resetUpload" style="z-index:99"/>
                <img :src="imageSrc" @load="onImageLoad" />
                <canvas v-show="imageUploaded" ref="canvas"></canvas>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref , reactive } from 'vue';
import { CloudUpload } from '@vicons/carbon';
import CloseButton from '../_components/button/CloseButton.vue';

const imageSrc = ref('');
const imageUploaded = ref(false);
const fileInput = ref(null);
const canvas = ref(null);
const context = ref(null);
const drawing = ref(false);
const start = reactive({ x: 0, y: 0 });
const selectedArea = reactive({ x: 0, y: 0, width: 0, height: 0 });


function triggerFileInput() {
  fileInput.value.click();
}

function internalFileChanged(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imageSrc.value = e.target.result as string;
      imageUploaded.value = true;
    };
    reader.readAsDataURL(file);
  }
}

function onImageLoad(event) {
  const img = event.target;
  if (canvas.value) {
    canvas.value.width = img.clientWidth; 
    canvas.value.height = img.clientHeight; 
    canvas.value.style.display = 'block';
    context.value = canvas.value.getContext('2d');
  }
}


function startDrawing(event) {
  drawing.value = true;
  start.x = event.offsetX;
  start.y = event.offsetY;
}

function draw(event) {
  if (drawing.value && canvas.value) {
    const rectWidth = event.offsetX - start.x;
    const rectHeight = event.offsetY - start.y;
    context.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    context.value.beginPath();
    context.value.setLineDash([5, 3]);  
    context.value.strokeStyle = 'red';
    context.value.lineWidth = 4;
    context.value.rect(start.x, start.y, rectWidth, rectHeight);
    context.value.stroke();
  }
}


function finishDrawing(event) {
  drawing.value = false;
  selectedArea.x = start.x;
  selectedArea.y = start.y;
  selectedArea.width = event.offsetX - start.x;
  selectedArea.height = event.offsetY - start.y;
}

function resetUpload() {
    imageSrc.value = '';
    imageUploaded.value = false;
    if (fileInput.value) {
        fileInput.value.value = '';
    }
    if (canvas.value && context.value) {
        context.value.clearRect(0, 0, canvas.value.width, canvas.value.height); 
    }
}

</script>


<style scoped>
.image-container {
  position: relative;
  width: 100%; 
  height: auto;
}

.thumb {
    position: relative;
    height: calc(100vh - 120px);
    width: 100%;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid #dce4ec;
}

.thumb:before {
    content: '';
    display: block;
    position: absolute;
    width: 98%;
    height: 98%;
    border: 3px dashed #34495e;
    z-index: 9;
    top: 1%;
    left: 1%;
    opacity: 0;
    transition: all 0.2s;
    pointer-events: none;
}

.uploaded:before {
    display: none;
}

.thumb:hover .upload-text,
.thumb:hover .upload-icon {
    color: #34495e;
}

.thumb:hover .upload-icon {
    color: #34495e !important;
}

.thumb:hover::before {
    opacity: 0.6;
}

.thumb img {
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    margin: auto;
    display: block;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
}

/* upload area */
.upload-icon {
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    display: block;
    margin: 0 auto;
    color: #d9d9d9;
}

.upload-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: #d9d9d9;
    margin-top: 10px;
    font-weight: 600;
}

.thumb img, canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;   
  height: auto;  
  max-width: 100%;  
  max-height: 100%; 
}


</style>