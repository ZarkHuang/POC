<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi class="image-selector">
        <NSpace vertical align="center">
          <NButton :disabled="atTop" @click="scrollUp" type="primary" size="large">
            <NIcon size="20" :component="ArrowUp" />
          </NButton>
          <div class="image-scroll-container" ref="scrollContainer" @scroll="checkScrollPosition">
            <NGrid cols="1" x-gap="6">
              <NGi v-for="(image, index) in images" :key="index">
                <NButton :style="getButtonStyle(index)" @click="selectImage(index)" style='padding:0'>
                  <div class="image-container" @click="selectImage(index)">
                    <img :src="image.url" :alt="'Image ' + (index + 1)" class="image-preview" />
                  </div>
                </NButton>
              </NGi>
            </NGrid>
          </div>
          <NButton :disabled="atBottom" @click="scrollDown" type="primary" size="large">
            <NIcon size="20" :component="ArrowDown" />
          </NButton>
        </NSpace>
      </NGi>

      <NGi :span="10">
        <NCarousel :current-index="selectedImage" :show-dots="false" trigger="click" class="carousel-image-container">
          <NCarouselItem v-for="(image, index) in images" :key="index">
            <div>
              <img :src="image.url" class="carousel-image" alt="Carousel Image" />
            </div>
          </NCarouselItem>
        </NCarousel>
      </NGi>

      <!-- 表單區域 -->
      <NGi :span="12">
        <NDivider />
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
        </div>

        <NScrollbar>
          <div v-for="form in forms" :key="form.id" class="form-content">
            <NGrid cols="1" justify="end" class="form-title-container" style="margin-bottom: 12px; margin-top: -12px">
              <NGi justify="end">
                <div style="display: flex; justify-content: flex-end; align-items: center; width: 100%;">
                  <NH5 class="form-title" style="margin: 0px 16px">名字：王大明</NH5>
                  <NH5 class="form-title" style="margin: 0px 16px">
                    時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <EditButton type="primary" ghost :form="form" @edit="enableEditing" :isDisabled="isSubmitting" />
                </div>
              </NGi>
            </NGrid>

            <NSpace vertical>
              <NTable striped>
                <thead>
                  <tr>
                    <th v-for="label in foodLabels" :key="label">{{ label }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in form.inputGroups" :key="row[0]?.path">
                    <td v-for="item in row" :key="item.path">
                      <NInput v-model:value="form.data[item.path]" :disabled="!form.editable" />
                    </td>
                  </tr>
                </tbody>
              </NTable>
            </NSpace>

            <div style="display: flex; justify-content: space-between">
              <NButton @click="addMultipleInputs(form)" type="primary" style="margin-left: 10px;">+</NButton>
              <NButton @click="confirmSubmit(form)" :disabled="!form.canSubmit" style="margin-right: 10px">提交</NButton>
            </div>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { NInput, NButton, NGrid, NGi, NScrollbar } from 'naive-ui'
import { FormData, FormInstance, HistoryItem } from '@/global'
//icon
import { ArrowUp, ArrowDown } from '@vicons/carbon'
//compoe
import EditButton from '@/views/food-list/_components/button/EditButton.vue'

const images = reactive([
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel4.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel3.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel2.jpeg' },
  { url: 'https://naive-ui.oss-cn-beijing.aliyuncs.com/carousel-img/carousel1.jpeg' },
])
let selectedImage = ref(0)
const scrollContainer = ref<HTMLDivElement | null>(null)
const atTop = ref(true);
const atBottom = ref(false);
const history: Ref<HistoryItem[]> = ref([])
const forms = reactive<FormInstance[]>([])
let idCounter = 0

const foodLabels = [
  '食物',
  '麵、飯、麵包、蔬菜、水果、豬肉、豆干、等等) ',
  '烹飪方式 (炸、烤、煎、炒、滷、蒸、等等)',
  '調味(醬:糖醋/泰式/蘑菇/黑胡椒/等等、辣椒、起司粉、等等)',
  '熱量 (kcal/100g)',
  '蛋白質 (g/100g)',
  '脂質 (g/100g)',
  '碳水 (g/100g)',
]

const formItems = foodLabels.map((label, i) => ({
  label: label,
  path: `name${i + 1}`,
}))

function selectImage(index: number) {
  selectedImage.value = index
}

function scrollUp() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop -= 60;
    checkScrollPosition();
  }
}

function scrollDown() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollTop += 60;
    checkScrollPosition();
  }
}

function checkScrollPosition() {
  const container = scrollContainer.value;
  if (!container) return;
  atTop.value = container.scrollTop === 0;
  atBottom.value = container.scrollTop + container.clientHeight >= container.scrollHeight;
}

function getButtonStyle(index: number) {
  const isSelected = selectedImage.value === index
  return {
    width: isSelected ? '60px' : '50px',
    height: isSelected ? '60px' : '50px',
    margin: '8px auto',
    backgroundColor: isSelected ? '#fff' : '#f0f0f0',
    color: isSelected ? 'black' : 'black',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
}

function createFormData(): FormData {
  return formItems.reduce(
    (acc, item) => ({
      ...acc,
      [item.path]: '',
    }),
    {},
  )
}

function createFormItems() {
  return foodLabels.map((label, index) => ({
    label: label,
    path: `name${index + 1}`,
  }))
}

function addMultipleInputs(form: FormInstance) {
  const newFormItems = foodLabels.map((label, index) => ({
    label: label,
    path: `name${form.formItems.length + index + 1}`, // 確保鍵值唯一
  }));

  // 新增至 formItems 和 inputGroups
  form.formItems.push(...newFormItems);
  form.inputGroups.push(newFormItems);

  // 初始化空的輸入數據
  newFormItems.forEach((item) => {
    form.data[item.path] = '';
  });
}

// 新增初始表單
forms.push({
  id: `form-${idCounter++}`,
  data: createFormData(),
  formItems: createFormItems(),
  inputGroups: [createFormItems()],
  editable: true,
  canSubmit: true,
})

const dialog = useDialog()
const isSubmitting = ref(false)
function confirmSubmit(form: FormInstance) {
  if (!form.canSubmit) return;

  dialog.success({
    title: '確認提交',
    content: '您確定要提交這個表單嗎？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(form),
  });
}


function submitForm(form: FormInstance) {
  console.log('提交:', form.data);

  form.editable = false;
  form.canSubmit = false;

  history.value.push({
    id: form.id,
    label: form.label || `Image${form.labelIndex}`,
    data: { ...form.data },
    imageUrl: form.imageUrl,
    originalImageUrl: form.originalImageUrl || '',
    timestamp: Date.now(),
  });
}

function enableEditing(form: FormInstance) {
  form.editable = true
  form.canSubmit = true
}

</script>

<style scoped>
.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-content {
  position: relative;
  top: 24px;
  width: 100%;
  margin-bottom: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #dce4ec;
  padding: 20px;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-part,
.right-part {
  flex: 1;
  padding: 5px;
}

.form-title-container {
  display: flex;
  align-items: center;
}

.form-image-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
}

.default-icon-container {
  width: 50px;
  height: 50px;
  margin-right: 12px;
  max-height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  border-radius: 8px;
}

.form-image-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 10px;
  border-radius: 8px;
}

.form-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
  min-width: 120px;
  margin-right: 12px;
}

.form-label {
  height: 100px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
}

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

.image-scroll-container::-webkit-scrollbar {
  display: none;
}

.image-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-preview {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
