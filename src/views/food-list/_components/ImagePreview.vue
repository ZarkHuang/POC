<template>
    <div class="image-container" ref="imageContainer" @click="!imageUploaded && triggerFileInput()"
        :class="{ 'no-pointer': imageUploaded }">
        <input type="file" ref="fileInput" @change="internalFileChanged" accept="image/*" hidden />

        <canvas ref="canvas"></canvas>
        <NButton color="white" circle text-color="#000" v-if="showSaveButton" @click="saveSelection"
            :style="buttonStyle">
            <NIcon :component="Checkmark" />
        </NButton>

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
import { CloudUpload, Checkmark } from '@vicons/carbon';
import CloseButton from '../_components/button/CloseButton.vue';
import { SelectionData } from '@/global'


const imageSrc = ref('');
const imageUploaded = ref(false);
const fileInput: Ref<HTMLInputElement | null> = ref(null);
const canvas = ref<HTMLCanvasElement | null>(null);
const img = ref<fabric.Image | null>(null);
const emit = defineEmits(['selection-saved']);
let selectionRect: fabric.Rect | null = null; // 將類型聲明為 fabric.Rect | null

let fabricCanvas: fabric.Canvas | null = null;
const isDrawing = ref(false);
const selections = reactive<SelectionData[]>([]); //儲存所有數據
const corners = reactive({
    origTL: { x: 0, y: 0 },
    origTR: { x: 0, y: 0 },
    origBL: { x: 0, y: 0 },
    origBR: { x: 0, y: 0 }
});

//生成隨機顏色
function getRandomColor() {
    let color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    while (color === '#000000') {
        color = '#' + Math.floor(Math.random() * 16777215).toString(16);
    }
    return color;
}



const showSaveButton = ref(false);
const buttonStyle = reactive({ position: 'absolute', left: '0px', top: '0px' });

function saveSelection() {
    const newSelection = {
        corners: JSON.parse(JSON.stringify(corners)) // 深拷貝以確保保存當前狀態
    };
    selections.push(newSelection);
    console.log('保存的框選數據:', selections.map(s => ({
        corners: {
            origTL: s.corners.origTL,
            origTR: s.corners.origTR,
            origBL: s.corners.origBL,
            origBR: s.corners.origBR
        }
    })));
    emit('selection-saved', newSelection);
    showSaveButton.value = false;
    selectionRect = null;
}




function triggerFileInput() {
    if (!imageUploaded.value && fileInput.value) {
        fileInput.value.click();
    }
}
function internalFileChanged(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target) {
                imageSrc.value = e.target.result as string;
                imageUploaded.value = true;
                initializeCanvas(imageSrc.value);
            }
        };
        reader.readAsDataURL(file);
    }
}

onMounted(async () => {
    await nextTick();
    if (canvas.value) {
        const rect = canvas.value.parentElement!.getBoundingClientRect();
        canvas.value.width = rect.width;
        canvas.value.height = rect.height;

        fabricCanvas = new fabric.Canvas(canvas.value, {
            selection: true,
            hoverCursor: 'pointer',
            moveCursor: 'grab'
        });
        console.log('Canvas is ready with size:', rect.width, 'x', rect.height);

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
        if (fabricCanvas) {
        console.log('Image loaded:', loadedImg);
        const scale = Math.min(
                (fabricCanvas.width ?? 0) / (loadedImg.width ?? 0),
                (fabricCanvas.height ?? 0) / (loadedImg.height ?? 0) 
            );

        loadedImg.scale(scale).set({
            left: fabricCanvas?.width ?? 0  / 2,
            top: fabricCanvas?.height ?? 0 / 2,
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
            left: (loadedImg.left ?? 0) - (loadedImg.width ?? 0) * (loadedImg.scaleX ?? 0) / 2,
            top: (loadedImg.top ?? 0) - (loadedImg.height ?? 0) * (loadedImg.scaleY  ?? 0) / 2,
            right: (loadedImg.left ?? 0) + (loadedImg.width ?? 0) * (loadedImg.scaleX ?? 0) / 2,
            bottom: (loadedImg.top ?? 0) + (loadedImg.height ?? 0) * (loadedImg.scaleY  ?? 0) / 2
        };
        img.value = loadedImg;
        initDrawingAndSelection();
    }}, {
        crossOrigin: 'anonymous'
    });
}

function initDrawingAndSelection() {
    console.log("Initializing drawing and selection on fabricCanvas.");
    if (!fabricCanvas) {
        console.error("Cannot initialize drawing and selection - fabricCanvas is not defined.");
        return;
    }

    let origX = 0, origY = 0;

    fabricCanvas.on('mouse:down', function (options) {
        const pointer = fabricCanvas!.getPointer(options.e);

        if (selectionRect) {
            fabricCanvas!.remove(selectionRect);
            selectionRect = null;
            showSaveButton.value = false;
        }

        if (pointer.x >= imgBounds.left && pointer.x <= imgBounds.right &&
            pointer.y >= imgBounds.top && pointer.y <= imgBounds.bottom) {
            const color = getRandomColor();
            isDrawing.value = true;
            origX = pointer.x;
            origY = pointer.y;
            selectionRect = new fabric.Rect({
                left: origX,
                top: origY,
                originX: 'left',
                originY: 'top',
                width: 0,
                height: 0,
                fill: color + '80',
                stroke: color,
                strokeWidth: 4,
                selectable: false,
                evented: false,
            });
            fabricCanvas!.add(selectionRect);
        }
    });


    fabricCanvas.on('mouse:move', function (options) {
        if (!isDrawing.value || !selectionRect) return;
        const pointer = fabricCanvas!.getPointer(options.e);
        if (pointer.x >= imgBounds.left && pointer.x <= imgBounds.right &&
            pointer.y >= imgBounds.top && pointer.y <= imgBounds.bottom) {
            selectionRect.set({
                left: Math.min(pointer.x, origX),
                top: Math.min(pointer.y, origY),
                width: Math.abs(origX - pointer.x),
                height: Math.abs(origY - pointer.y)
            });
            fabricCanvas!.renderAll();
        }
    });

    fabricCanvas.on('mouse:up', function () {
        if (!selectionRect || !img.value) return;

        if ((selectionRect.width ?? 0) > 30 && (selectionRect.height ?? 0) > 30) {
            let buttonX = (selectionRect.left ?? 0) + (selectionRect.width ?? 0) - 32;
            let buttonY = (selectionRect.top ?? 0) + (selectionRect.height ?? 0) + 10;
            buttonStyle.left = `${buttonX}px`;
            buttonStyle.top = `${buttonY}px`;
            showSaveButton.value = true;

            // 計算寬選四個角落的xy距離
            let scaleX = img.value.scaleX ?? 0;
            let scaleY = img.value.scaleY ?? 0;
            corners.origTL.x = ((selectionRect.left ?? 0) - (img.value.left ?? 0)) / scaleX + (img.value.width ?? 0) * 0.5;
            corners.origTL.y = ((selectionRect.top ?? 0) - (img.value.top ?? 0)) / scaleY + (img.value.height ?? 0) * 0.5;
            corners.origTR.x = corners.origTL.x + ((selectionRect.width ?? 0) / scaleX);
            corners.origTR.y = corners.origTL.y;
            corners.origBL.x = corners.origTL.x;
            corners.origBL.y = corners.origTL.y + ((selectionRect.height ?? 0) / scaleY);
            corners.origBR.x = corners.origTL.x + ((selectionRect.width ?? 0) / scaleX);
            corners.origBR.y = corners.origTL.y + ((selectionRect.height ?? 0) / scaleY);
        }

        isDrawing.value = false;  // 結束繪畫狀態
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
