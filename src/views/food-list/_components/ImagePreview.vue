User
<template>
    <div class="image-container" ref="imageContainer" @click="!imageUploaded && triggerFileInput()"
        :class="{ 'no-pointer': imageUploaded }">
        <input type="file" ref="fileInput" @change="internalFileChanged" accept="image/*" hidden />

        <canvas ref="canvas"></canvas>
        <!-- <canvas ref="canvas" v-if="imageUploaded"></canvas> -->

        <div v-if="!imageUploaded" class="upload-area">
            <NIcon :component="CloudUpload" class="upload-icon" />
            <div class="upload-text">上傳圖片</div>
        </div>
        <CloseButton v-if="imageUploaded" @close="resetUpload" />
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { fabric } from 'fabric';
import { CloudUpload } from '@vicons/carbon';
import CloseButton from '../_components/button/CloseButton.vue';

const imageSrc = ref('');
const imageUploaded = ref(false);
const fileInput = ref(null);
const canvas = ref(null);
const img = ref(null);
let fabricCanvas: fabric.Canvas | null = null;

function triggerFileInput() {
    if (!imageUploaded.value) {
        fileInput.value.click();
    }
}

function internalFileChanged(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imageSrc.value = e.target.result as string;
            imageUploaded.value = true;
            initializeCanvas(imageSrc.value);
        };
        reader.readAsDataURL(file);
    }
}

onMounted(async () => {
    await nextTick();
    if (canvas.value) {
        const rect = canvas.value.parentElement.getBoundingClientRect();
        canvas.value.width = rect.width;
        canvas.value.height = rect.height;

        fabricCanvas = new fabric.Canvas(canvas.value, {
            selection: true,
            uniScaleTransform: true,
            hoverCursor: 'pointer',
            moveCursor: 'grab'
        });
        console.log('Canvas is ready with size:', rect.width, 'x', rect.height);
        // 測試滑鼠點擊canvas到底有沒有反應
        canvas.value.addEventListener('mousedown', () => {
            console.log('Native mousedown event on canvas');
        });

    } else {
        console.log('Canvas is not available');
    }
});

/*
 Start Drawing Canvas
*/

let imgBounds = { left: 0, top: 0, right: 0, bottom: 0 };
function initializeCanvas(imageUrl: string) {
    // console.log('Initializing canvas with image URL:', imageUrl);
    if (!fabricCanvas) {
        console.error("fabricCanvas is not initialized.");
        return;
    }

    fabric.Image.fromURL(imageUrl, (loadedImg) => {
        console.log('Image loaded:', loadedImg);
        const scale = Math.min(
            fabricCanvas.width / loadedImg.width,
            fabricCanvas.height / loadedImg.height
        );
        loadedImg.scale(scale).set({
            left: fabricCanvas.width / 2,
            top: fabricCanvas.height / 2,
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: true
        });

        fabricCanvas.clear();
        fabricCanvas.add(loadedImg);
        fabricCanvas.centerObject(loadedImg);
        fabricCanvas.renderAll();

        //設定圖的邊界
        imgBounds = {
            left: loadedImg.left - loadedImg.width * loadedImg.scaleX / 2,
            top: loadedImg.top - loadedImg.height * loadedImg.scaleY / 2,
            right: loadedImg.left + loadedImg.width * loadedImg.scaleX / 2,
            bottom: loadedImg.top + loadedImg.height * loadedImg.scaleY / 2
        };

        img.value = loadedImg;
        console.log("Image added to canvas, now initializing drawing and selection tools.");
        initDrawingAndSelection();
    }, {
        crossOrigin: 'anonymous'
    });
}

function initDrawingAndSelection() {
    console.log("Initializing drawing and selection on fabricCanvas.");
    if (!fabricCanvas) {
        console.error("Cannot initialize drawing and selection - fabricCanvas is not defined.");
        return;
    }

    let isDrawing = false;
    let origX = 0, origY = 0;
    let selectionRect = null;

    fabricCanvas.on('mouse:down', function (options) {
        const pointer = fabricCanvas.getPointer(options.e);
        if (pointer.x >= imgBounds.left && pointer.x <= imgBounds.right &&
            pointer.y >= imgBounds.top && pointer.y <= imgBounds.bottom) {
            console.log("Mouse down triggered within image bounds");

            if (selectionRect) {
                fabricCanvas.remove(selectionRect);
                selectionRect = null;
            }

            isDrawing = true;
            origX = pointer.x;
            origY = pointer.y;
            selectionRect = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: 0,
                height: 0,
                fill: 'rgba(255,0,255,0.2)',
                stroke: 'blue',
                strokeWidth: 2,
                selectable: false,
                evented: false,
            });
            fabricCanvas.add(selectionRect);
        }
    });

    fabricCanvas.on('mouse:move', function (options) {
        if (!isDrawing || !selectionRect) return;
        const pointer = fabricCanvas.getPointer(options.e);
        if (pointer.x >= imgBounds.left && pointer.x <= imgBounds.right &&
            pointer.y >= imgBounds.top && pointer.y <= imgBounds.bottom) {
            selectionRect.set({
                left: Math.min(pointer.x, origX),
                top: Math.min(pointer.y, origY),
                width: Math.abs(origX - pointer.x),
                height: Math.abs(origY - pointer.y)
            });
            fabricCanvas.renderAll();
        }
    });

    fabricCanvas.on('mouse:up', function () {
        if (!selectionRect || !img.value) return;
        console.log("Selection completed.");
        let scaleX = img.value.scaleX;
        let scaleY = img.value.scaleY;
        let imgLeft = img.value.left;
        let imgTop = img.value.top;
        let origLeft = (selectionRect.left - imgLeft) / scaleX + img.value.width * 0.5;
        let origTop = (selectionRect.top - imgTop) / scaleY + img.value.height * 0.5;
        // let origWidth = selectionRect.width / scaleX;
        // let origHeight = selectionRect.height / scaleY;
        // console.log(`Original image selection bounds: Left: ${origLeft}, Top: ${origTop}, Width: ${origWidth}, Height: ${origHeight}`);
        console.log(`Original image selection bounds: Left: ${origLeft}, Top: ${origTop}`);
        isDrawing = false;
    });

}


/*
 End Drawing Canvas
*/

function resetUpload() {
    console.log('Resetting upload...');
    imageSrc.value = '';
    imageUploaded.value = false;
    if (fabricCanvas) {
        fabricCanvas.clear();
    }
    if (fileInput.value) {
        fileInput.value.value = '';
    }
}

</script>



<style scoped>
.image-container {
    position: relative;
    width: 100%;
    height: calc(100vh - 120px);
    overflow: hidden;
    margin: 20px 0 0 0;
    cursor: pointer;
    border: 2px solid #dce4ec;
}

.no-pointer {
    cursor: default;
}

canvas {
    display: block;
    width: 100%;
    height: 100vh;
}


/* 樣式 */

.image-container:hover {
    border: 2px solid #34495e;
    transition: all 0.2s;
}

.image-container:hover .upload-text,
.image-container:hover .upload-icon {
    color: #34495e;
    transition: all 0.2s;
}

.image-container:hover .upload-icon {
    color: #34495e !important;
}

.image-container:hover::before {
    opacity: 0.6;
}

/* 
.uploaded:before {
    display: none;
} */

/* upload area */
.upload-icon {
    position: absolute;
    top: 45%;
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
</style>
