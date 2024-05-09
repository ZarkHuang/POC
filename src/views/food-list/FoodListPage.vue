<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi class="image-selector">
        <ImageSelector :images="images.map(image => ({ url: image.thumbnailUrl }))"
          @update:selectedImage="updateSelectedImage" :selectedImage="selectedImage" />
      </NGi>
      <NGi :span="10">
        <ImageCarousel
          :images="selectedImage < images.length ? [images[selectedImage]].map(image => ({ url: image.fullImageUrl })) : []"
          :selectedImage="selectedImage" @recognitionResult="handleRecognitionResult" />
      </NGi>
      <!-- 表單區域 -->
      <NGi :span="12">
        <NDivider />
        <div class="form-header">
          <PageTitle>辨識結果</PageTitle>
        </div>
        <NScrollbar>
          <div v-if="selectedImage < images.length" :key="images[selectedImage].image_id" class="form-content">
            <NGrid cols="1" justify="end" class="form-title-container" style="margin-bottom: 12px; margin-top: -12px">
              <NGi justify="end">
                <div style="display: flex; justify-content: flex-end; align-items: center; width: 100%;">
                  <NH5 class="form-title" style="margin: 0px 16px">圖片 ID：{{ images[selectedImage].image_id }}</NH5>
                  <NH5 class="form-title" style="margin: 0px 16px">名字：王大明</NH5>
                  <NH5 class="form-title" style="margin: 0px 16px">
                    時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <EditButton :form="images[selectedImage].formData" @edit="enableEditing"
                    :isDisabled="!images[selectedImage].canSubmit" />

                </div>
              </NGi>
            </NGrid>
            <NTable striped>
              <thead>
                <tr>
                  <th v-for="label in tableHeaders" :key="label">{{ label }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                  <td v-for="(value, key) in item" :key="key">
                    <NInput v-if="images[selectedImage].editable" :value="item[key]"/>
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
              </tbody>
            </NTable>
            <div style="display: flex; justify-content: end; padding: 10px 0;">
              <NButton @click="confirmSubmit(images[selectedImage])"
                :disabled="!images[selectedImage].canSubmit || isSubmitting.value">提交</NButton>
            </div>
          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'
import { NInput, NButton, NGrid, NGi, NScrollbar, useDialog } from 'naive-ui'
import { Image } from '@/types/index.ts'
import ImageSelector from '@/views/food-list/ImageSelector.vue' 
import ImageCarousel from '@/views/food-list/ImageCarousel.vue'
//compoment
import EditButton from '@/views/food-list/_components/button/EditButton.vue'
import { fetchUserImages, submitImageLabels } from '@/services/api/report';
import { useAuthStore } from '@/stores/authStore';

import { tableHeaders } from '@/utils/config/index.ts'

const images: Ref<Image[]> = ref([]);
const authStore = useAuthStore();
const dialog = useDialog()
const isSubmitting = ref(false);

onMounted(async () => {
  try {
    if (authStore.authState.isLoggedIn && authStore.authState.token) {
      const response = await fetchUserImages();
      if (response) {
        images.value = response.map((img) => ({
          image_id: img.image_id,
          thumbnailUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/thumbnail`,
          fullImageUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/view`,
          editable: false,  // 初始不可編輯
          canSubmit: true,   // 初始可以提交
          formData: createFormData(),
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }
});

function updateSelectedImage(index: number) {
  selectedImage.value = index;
}

const selectedImage = ref(0)

const foodLabels = []
const tableData = ref([
  {
    food_name: '中式餃子',
    cooking_method: '水煮',
    quantity: 8,
    quantity_name: '個',
    calories: 170,
    protein: 7,
    lipids: 6,
    carbohydrate: 20
  },
]);

function createFormData() {
  return {
    food_name: '',
    cooking_method: '',
    quantity: 0,
    quantity_name: '',
    calories: 0,
    protein: 0,
    lipids: 0,
    carbohydrate: 0
  };
}

function enableEditing(formData: any) {
  const currentImage = images.value[selectedImage.value];
  currentImage.editable = !currentImage.editable;
}


function confirmSubmit(image) {
  dialog.success({
    title: '確認提交',
    content: '您確定要提交這個表單嗎？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(image)
  });
}

async function submitForm(image) {
  isSubmitting.value = true;
  try {
    const response = await submitImageLabels(image.image_id, image.formData);
    console.log('Response:', response);
  } catch (error) {
    console.error('提交失敗:', error);
  } finally {
    isSubmitting.value = false;
  }
}


function handleRecognitionResult(data: any) {
  console.log('Received recognition data:', data);
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

.form-title-container {
  display: flex;
  align-items: center;
}
</style>
