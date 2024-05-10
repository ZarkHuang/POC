<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi class="image-selector">
        <ImageSelector :images="images.map(image => ({ url: image.thumbnailUrl }))"
          @update:selectedImage="updateSelectedImage" :selectedImage="selectedImage" />
      </NGi>
      <NGi :span="10">
        <div v-if="isLoading">
          <p>圖片資源加载中...</p>
        </div>
        <div v-else-if="images.length > 0">
          <ImageCarousel :images="images.map(image => ({ url: image.fullImageUrl }))" :selectedImage="selectedImage"
            @recognitionResult="handleRecognitionResult" />
        </div>
        <div v-else>
          <p>沒有任何資料</p>
        </div>
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
                    <NInput v-if="images[selectedImage].editable" v-model="item[key]" />
                    <span v-else>{{ value }}</span>
                  </td>
                </tr>
                <tr v-if="tableData.length === 0">
                  <td v-for="n in tableHeaders.length" :key="n">-</td>
                </tr>
                <tr>
                  <td colspan="4">總計：</td>
                  <td>{{ totalCalories }}</td>
                  <td>{{ totalProtein }}</td>
                  <td>{{ totalLipids }}</td>
                  <td>{{ totalCarbohydrate }}</td>
                </tr>
              </tbody>
            </NTable>
            <div style="display: flex; justify-content: end; padding: 10px 0;">
              <NButton @click="confirmSubmit(images[selectedImage])"
                :disabled="!images[selectedImage].canSubmit || isSubmitting">提交</NButton>
            </div>

          </div>
        </NScrollbar>
      </NGi>
    </NGrid>
  </NSpace>
</template>
User
<script setup lang="ts">
import { ref, onMounted, Ref, watchEffect } from 'vue'
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

const totalCalories = ref('-');
const totalProtein = ref('-');
const totalLipids = ref('-');
const totalCarbohydrate = ref('-');

const selectedImage = ref(0)
const tableData: Ref<any[]> = ref([]);
  const isLoading = ref(true);

onMounted(async () => {
  try {
    if (authStore.authState.isLoggedIn && authStore.authState.token) {
      const response = await fetchUserImages();
      if (response) {
        images.value = response.map((img: { image_id: string }) => ({
          image_id: img.image_id,
          thumbnailUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/thumbnail`,
          fullImageUrl: `https://food-ai.efaipd.com/api/images/${img.image_id}/view`,
          editable: false,  // 初始不可編輯
          canSubmit: true,   // 初始可以提交
        }));
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  }finally {
    isLoading.value = false; // 加载完成
  }
  
});

function updateSelectedImage(index: number) {
  selectedImage.value = index;
  const currentImage = images.value[index];
  tableData.value = currentImage.formData || []; 
}

function enableEditing() {
  const currentImage = images.value[selectedImage.value];
  currentImage.editable = !currentImage.editable;
}

function confirmSubmit(image: Image) {
  dialog.success({
    title: '確認提交',
    content: '您確定要提交這個表單嗎？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(image)
  });
}
import {useMessage,} from 'naive-ui'
const message = useMessage()

async function submitForm(image: Image) {
  const imageId: string = image.image_id as string;
  isSubmitting.value = true;
  try {
    const response = await submitImageLabels(imageId, image.formData);
    console.log('Response:', response);
    message.success('資料提交成功');
  } catch (error) {
    console.error('提交失敗:', error);
    message.error('提交失敗');
  } finally {
    isSubmitting.value = false;
  }
}

function handleRecognitionResult(data: any) {
  console.log('Received recognition data:', data);

  if (data.error) {
    tableData.value = [{
      '食物(麵、飯、麵包、蔬菜..等等)': '請重新辨識',
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': '',
      '數量': '',
      '單位': '',
      '熱量 (kcal/100g)': '',
      '蛋白質 (g/100g)': '',
      '脂質 (g/100g)': '',
      '碳水化合物 (g/100g)': '',
    }];
  } else if (Array.isArray(data)) {
    const formattedData = data.map((item: any) => ({
      '食物(麵、飯、麵包、蔬菜..等等)': item.food_name,
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': item.cooking_method,
      '數量': item.quantity,
      '單位': item.quantity_name,
      '熱量 (kcal/100g)': item.calories,
      '蛋白質 (g/100g)': item.protein,
      '脂質 (g/100g)': item.lipids,
      '碳水化合物 (g/100g)': item.carbohydrate,
    }));
    tableData.value = formattedData;
  } else {
    tableData.value = [{
      '食物(麵、飯、麵包、蔬菜..等等)': '請重新辨識',
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': '',
      '數量': '',
      '單位': '',
      '熱量 (kcal/100g)': '',
      '蛋白質 (g/100g)': '',
      '脂質 (g/100g)': '',
      '碳水化合物 (g/100g)': '',
    }];
  }
}

watchEffect(() => {
  totalCalories.value = tableData.value.reduce((total, item) => total + parseFloat(item['熱量 (kcal/100g)'] || 0), 0);
  totalProtein.value = tableData.value.reduce((total, item) => total + parseFloat(item['蛋白質 (g/100g)'] || 0), 0);
  totalLipids.value = tableData.value.reduce((total, item) => total + parseFloat(item['脂質 (g/100g)'] || 0), 0);
  totalCarbohydrate.value = tableData.value.reduce((total, item) => total + parseFloat(item['碳水化合物 (g/100g)'] || 0), 0);
});

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
