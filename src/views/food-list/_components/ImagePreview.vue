<template>
  <div
    class="image-container"
    ref="imageContainer"
    @click="!imageUploaded && triggerFileInput()"
    :class="{ 'no-pointer': imageUploaded }"
  >
    <input
      type="file"
      ref="fileInput"
      @change="internalFileChanged"
      accept="image/*"
      hidden
    />

    <canvas ref="canvas"></canvas>
    <NButton
      color="white"
      circle
      text-color="#000"
      v-if="showSaveButton"
      @click="saveSelection"
      :style="buttonStyle"
    >
      <NIcon :component="Checkmark" />
    </NButton>

    <NButton
      color="white"
      circle
      text-color="#000"
      v-if="showSaveButton"
      @click="cancelSelection"
      :style="{
        position: 'absolute',
        left: `${parseInt(buttonStyle.left, 10) + 50}px`,
        top: buttonStyle.top,
      }"
    >
      <NIcon :component="Close" />
    </NButton>

    <div v-if="!imageUploaded" class="upload-area">
      <NIcon :component="CloudUpload" class="upload-icon" />
      <div class="upload-text">上傳圖片</div>
    </div>
    <CloseButton v-if="imageUploaded" @close="resetUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { fabric } from 'fabric'
import { CloudUpload, Checkmark, Close } from '@vicons/carbon'
import CloseButton from '../_components/button/CloseButton.vue'
import { SelectionData } from '@/global'
import { useSelectionStore } from '@/stores/selectionStore'

const imageSrc = ref('')
const imageUploaded = ref(false)
const fileInput: Ref<HTMLInputElement | null> = ref(null)
const canvas = ref<HTMLCanvasElement | null>(null)
const img = ref<fabric.Image | null>(null)
let selectionRect: fabric.Rect | null = null
let fabricCanvas: fabric.Canvas | null = null
let selectionLabels = new Map()

const emit = defineEmits([
  'selection-saved',
  'selection-removed',
  'close-selection',
])
defineExpose({
  removeSelectionById,
})

//透過父組件Form刪除框選狀態以及Label
function removeSelectionById(id: string) {
  const store = useSelectionStore()
  if (!fabricCanvas) return

  const objects = fabricCanvas.getObjects() as (fabric.Object & {
    id?: string
  })[]
  objects.forEach((obj) => {
    if (obj.id === id) {
      console.log('Removing object with ID:', obj.id)
      fabricCanvas!.remove(obj)
    }
  })

  const label = selectionLabels.get(id)
  if (label) {
    fabricCanvas.remove(label.circle) // 移除圓形背景
    fabricCanvas.remove(label.label) // 移除標籤
    selectionLabels.delete(id)
  } else {
    console.log('Label not found for ID:', id)
  }
  fabricCanvas.renderAll()
  store.removeSelection(id)
}

const isDrawing = ref(false)
const selections = reactive<SelectionData[]>([])
const corners = reactive({
  origTL: { x: 0, y: 0 },
  origTR: { x: 0, y: 0 },
  origBL: { x: 0, y: 0 },
  origBR: { x: 0, y: 0 },
})

//生成隨機顏色
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

// 取消框選狀態
function cancelSelection() {
  if (fabricCanvas && selectionRect) {
    fabricCanvas.remove(selectionRect)
    let label = selectionLabels.get(selectionRect)
    if (label) {
      fabricCanvas.remove(label)
    }
    fabricCanvas.renderAll()
    selectionLabels.delete(selectionRect)
  }
  selectionRect = null
  showSaveButton.value = false
}

const showSaveButton = ref(false)
const showCloseButton = ref(false)
const buttonStyle = reactive({ position: 'absolute', left: '0px', top: '0px' })
// const currentFormId = ref('');

function saveSelection() {
  if (!fabricCanvas || !selectionRect) {
    console.error('Fabric canvas or selection rectangle is not initialized.')
    return
  }
  const store = useSelectionStore()
  const selectionIndex = store.nextLabelIndex
  const uniqueId = `${Date.now()}-${selectionIndex}`
  const cornersObject = JSON.parse(JSON.stringify(corners))

  // 設定透明度以隱藏框選矩形進行截圖
  const originalOpacity = selectionRect.opacity
  selectionRect.set({ opacity: 0 })

  // 截取框選範圍內的圖片
  const croppedImgUrl = fabricCanvas.toDataURL({
    format: 'png',
    left: selectionRect.left,
    top: selectionRect.top,
    width: selectionRect.width,
    height: selectionRect.height,
  })

  // 還原框選矩形的透明度
  selectionRect.set({ opacity: originalOpacity })
  fabricCanvas.renderAll()

  // 轉換 corners 物件的值為字串
  const cornersString = formatCorners(cornersObject)
  const newSelection = {
    id: uniqueId,
    imageUrl: croppedImgUrl,
    corners: cornersObject,
  }

  selections.push(newSelection)
  emit('selection-saved', {
    id: uniqueId,
    data: newSelection,
    labelIndex: selectionIndex,
    imageUrl: croppedImgUrl,
    corners: cornersString,
  })
  store.addSelection(newSelection)

  if (selectionRect) {
    selectionRect.id = uniqueId

    // 創建文字標籤
    const labelText = `Image${selectionIndex}`
    const label = new fabric.Text(labelText, {
      left: (selectionRect.left ?? 0) + 5,
      top: (selectionRect.top ?? 0) - 20,
      fontSize: 12,
      fill: 'black',
      selectable: false,
    })

    const circle = new fabric.Rect({
      left: (label.left ?? 0) - 5,
      top: (label.top ?? 0) - 2,
      fill: '#ffffff',
      width: (label.width ?? 0) + 10,
      height: (label.height ?? 0) + 5,
      rx: 10, // Round corners
      ry: 10,
      shadow: '2px 2px 5px rgba(0,0,0,0.2)',
      selectable: false,
    })

    fabricCanvas.add(circle, label)

    selectionLabels.set(uniqueId, { circle, label })
  }
  showSaveButton.value = false
  showCloseButton.value = true
}

function formatCorners(corners: SelectionData['corners']) {
  const values = Object.values(corners)
  return values
    .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
    .join(' | ')
}

function triggerFileInput() {
  if (!imageUploaded.value && fileInput.value) {
    fileInput.value.click()
  }
}
function internalFileChanged(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target) {
        imageSrc.value = e.target.result as string
        imageUploaded.value = true
        initializeCanvas(imageSrc.value)
      }
    }
    reader.readAsDataURL(file)
  }
}

onMounted(async () => {
  await nextTick()
  if (canvas.value) {
    const rect = canvas.value.parentElement!.getBoundingClientRect()
    canvas.value.width = rect.width
    canvas.value.height = rect.height

    fabricCanvas = new fabric.Canvas(canvas.value, {
      selection: true,
      hoverCursor: 'pointer',
      moveCursor: 'grab',
    })
    console.log('Canvas is ready with size:', rect.width, 'x', rect.height)
  } else {
    console.log('Canvas is not available')
  }
})

/*
 Start Drawing Canvas
*/
let imgBounds = { left: 0, top: 0, right: 0, bottom: 0 }
function initializeCanvas(imageUrl: string) {
  // console.log('Initializing canvas with image URL:', imageUrl);
  if (!fabricCanvas) {
    console.error('fabricCanvas is not initialized.')
    return
  }

  fabric.Image.fromURL(
    imageUrl,
    (loadedImg) => {
      // 原始圖片的長寬
      console.log(
        'Original image dimensions:',
        loadedImg.width,
        'x',
        loadedImg.height,
      )
      if (fabricCanvas) {
        console.log('Image loaded:', loadedImg)
        const scale = Math.min(
          (fabricCanvas.width ?? 0) / (loadedImg.width ?? 0),
          (fabricCanvas.height ?? 0) / (loadedImg.height ?? 0),
          (fabricCanvas.height ?? 0) / (loadedImg.height ?? 0),
        )

        loadedImg.scale(scale).set({
          left: fabricCanvas?.width ?? 0 / 2,
          top: fabricCanvas?.height ?? 0 / 2,
          originX: 'center',
          originY: 'center',
          selectable: false,
        })

        fabricCanvas.clear()
        fabricCanvas.add(loadedImg)
        fabricCanvas.centerObject(loadedImg)
        fabricCanvas.renderAll()

        //設定圖的邊界
        imgBounds = {
          left:
            (loadedImg.left ?? 0) -
            ((loadedImg.width ?? 0) * (loadedImg.scaleX ?? 0)) / 2,
          top:
            (loadedImg.top ?? 0) -
            ((loadedImg.height ?? 0) * (loadedImg.scaleY ?? 0)) / 2,
          right:
            (loadedImg.left ?? 0) +
            ((loadedImg.width ?? 0) * (loadedImg.scaleX ?? 0)) / 2,
          bottom:
            (loadedImg.top ?? 0) +
            ((loadedImg.height ?? 0) * (loadedImg.scaleY ?? 0)) / 2,
        }
        img.value = loadedImg
        // console.log("Image added to canvas, now initializing drawing and selection tools.");
        initDrawingAndSelection()
      }
    },
    {
      crossOrigin: 'anonymous',
    },
  )
}

function initDrawingAndSelection() {
  // console.log("Initializing drawing and selection on fabricCanvas.");
  if (!fabricCanvas) {
    console.error(
      'Cannot initialize drawing and selection - fabricCanvas is not defined.',
    )
    return
  }

  let origX = 0,
    origY = 0

  fabricCanvas.on('mouse:down', function (options) {
    const pointer = fabricCanvas!.getPointer(options.e)

    if (selectionRect && showSaveButton.value) {
      if (fabricCanvas && selectionRect) {
        fabricCanvas.remove(selectionRect)
        let label = selectionLabels.get(selectionRect)
        if (label) {
          fabricCanvas.remove(label)
        }
      }
      fabricCanvas!.remove(selectionRect)
      fabricCanvas!.renderAll()
      selectionRect = null
      showSaveButton.value = false
    }

    if (
      pointer.x >= imgBounds.left &&
      pointer.x <= imgBounds.right &&
      pointer.y >= imgBounds.top &&
      pointer.y <= imgBounds.bottom
    ) {
      const color = getRandomColor()
      isDrawing.value = true
      origX = pointer.x
      origY = pointer.y
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
      })
      fabricCanvas!.add(selectionRect)
    }
  })

  fabricCanvas.on('mouse:move', function (options) {
    if (!isDrawing.value || !selectionRect) return
    const pointer = fabricCanvas!.getPointer(options.e)
    if (
      pointer.x >= imgBounds.left &&
      pointer.x <= imgBounds.right &&
      pointer.y >= imgBounds.top &&
      pointer.y <= imgBounds.bottom
    ) {
      selectionRect.set({
        left: Math.min(pointer.x, origX),
        top: Math.min(pointer.y, origY),
        width: Math.abs(origX - pointer.x),
        height: Math.abs(origY - pointer.y),
      })
      fabricCanvas!.renderAll()
    }
  })

  fabricCanvas.on('mouse:up', function () {
    if (!selectionRect || !img.value) return

    if ((selectionRect.width ?? 0) > 30 && (selectionRect.height ?? 0) > 30) {
      let buttonX = (selectionRect.left ?? 0) + (selectionRect.width ?? 0) - 80
      let buttonY = (selectionRect.top ?? 0) + (selectionRect.height ?? 0) + 10
      buttonStyle.left = `${buttonX}px`
      buttonStyle.top = `${buttonY}px`
      showSaveButton.value = true

      let scaleX = img.value.scaleX ?? 0
      let scaleY = img.value.scaleY ?? 0
      corners.origTL.x =
        ((selectionRect.left ?? 0) - (img.value.left ?? 0)) / scaleX +
        (img.value.width ?? 0) * 0.5
      corners.origTL.y =
        ((selectionRect.top ?? 0) - (img.value.top ?? 0)) / scaleY +
        (img.value.height ?? 0) * 0.5
      corners.origTR.x = corners.origTL.x + (selectionRect.width ?? 0) / scaleX
      corners.origTR.y = corners.origTL.y
      corners.origBL.x = corners.origTL.x
      corners.origBL.y = corners.origTL.y + (selectionRect.height ?? 0) / scaleY
      corners.origBR.x = corners.origTL.x + (selectionRect.width ?? 0) / scaleX
      corners.origBR.y = corners.origTL.y + (selectionRect.height ?? 0) / scaleY
    } else {
      fabricCanvas!.remove(selectionRect)
      selectionRect = null
    }
    isDrawing.value = false
  })
}

/*
 End Drawing Canvas
*/

function resetUpload() {
  console.log('Resetting upload...')
  imageSrc.value = ''
  imageUploaded.value = false
  if (fabricCanvas) {
    fabricCanvas.clear()
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 130px);
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
