<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi :span="2">
        <ImageSelector 
          :images="images.map(image => ({ url: image.thumbnailUrl, is_label: image.is_label! }))"
          @update:selectedImage="updateSelectedImage" 
          :selectedImage="selectedImage" 
          :isRecognizing="isRecognizing" />
      </NGi>
      <NGi :span="10">
        <div v-if="isLoading">
          <p>圖片資源加载中...</p>
        </div>
        <div v-else-if="images.length > 0">
          <ImageCarousel 
            :image="images[selectedImage]?.fullImageUrl || ''" 
            :selectedImage="selectedImage"
            :isLoadingImage="isLoadingImage" 
            @recognitionResult="handleRecognitionResult"
            @update:recognizing="isRecognizing = $event" 
            @update:selectedImage="updateSelectedImage" />
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
          <div v-if="selectedImage < images.length && images[selectedImage]" :key="images[selectedImage].image_id"
            class="form-content">
            <NGrid cols="12" justify="space-between" class="form-title-container"
              style="align-items: center; margin-bottom: 12px; margin-top: -12px">
              <NGi :span="3">
                <NButton @click="addNewRow" type="primary">
                  新增欄位
                </NButton>
              </NGi>
              <NGi :span="9" justify="end">
                <div style="display: flex; justify-content: flex-end; align-items: center;">
                  <NH5 class="form-title" style="margin: 0px 16px">
                    時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <EditButton 
                    :isEditing="images[selectedImage].editable" 
                    :isDisabled="!images[selectedImage].canSubmit"
                    :hasData="tableData.length > 0" 
                    @update:isEditing="handleEditingChange($event, selectedImage)"
                    @noData="showNoDataAlert" />
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
                <tr v-if="tableData.length === 0">
                  <td v-for="n in tableHeaders.length" :key="n">-</td>
                </tr>
                <tr v-else v-for="(item, index) in tableData" :key="index">
                  <td v-for="(value, key) in item" :key="key">
                    <NInput v-if="images[selectedImage].editable" v-model:value="tableData[index][key]" />
                    <span v-else>{{ value }}</span>
                  </td>
                  <td>
                    <NButton type="error" ghost @click="removeRow(index)">
                      刪除
                    </NButton>
                  </td>
                </tr>
                <tr>
                  <td colspan="4">總計：</td>
                  <td>{{ totalCalories }}</td>
                  <td>{{ totalProtein }}</td>
                  <td>{{ totalLipids }}</td>
                  <td>{{ totalCarbohydrate }}</td>
                  <td>-</td>
                  <td>-</td>
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
    <HistoryDrawer v-model:show="drawerVisible" :historyData="historyData"/>
    <Button @click="toggleDrawer" class="history-button" type="primary"><NIcon size="20" :component="ChevronLeft" /></Button>
  </NSpace>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref, watchEffect } from 'vue';
import { NInput, NButton, NGrid, NGi, NScrollbar, useDialog } from 'naive-ui';
import { ChevronLeft } from '@vicons/carbon'
import { Image } from '@/types/index.ts';
import ImageSelector from '@/views/food-list/ImageSelector.vue';
import ImageCarousel from '@/views/food-list/ImageCarousel.vue';
import EditButton from '@/views/food-list/_components/button/EditButton.vue';
import HistoryDrawer from '@/views/food-list/_components/drawer/HistoryDrawer.vue';
import { fetchUserImages, fetchImageLabelHistory, submitImageLabels , fetchHistoryData } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useMessage } from 'naive-ui';
import { tableHeaders } from '@/utils/config/index.ts';
import { useFormData } from '@/composables/formData.ts';

const images: Ref<Image[]> = ref([]);
const authStore = useAuthStore();
const dialog = useDialog();
const isSubmitting = ref(false);
const message = useMessage();
const selectedImage = ref(0);
const isLoading = ref(true);
const isRecognizing = ref(false);
const isLoadingImage = ref(false);
const drawerVisible = ref(false); // 控制 Drawer 顯示的變量
const historyData = ref([]); // 假設歷史數據是這樣的結構
const { tableData, totalCalories, totalProtein, totalLipids, totalCarbohydrate, formatHistoryData, addNewRow, removeRow, updateTotals } = useFormData();

onMounted(async () => {
  try {
    if (authStore.authState.isLoggedIn && authStore.authState.token) {
      const response = await fetchUserImages();
      if (response) {
        images.value = response.map((img: Image) => ({
          image_id: img.image_id,
          is_label: img.is_label,
          thumbnailUrl: `https://food-ai.everfortuneai.com.tw/api/images/${img.image_id}/thumbnail`,
          fullImageUrl: `https://food-ai.everfortuneai.com.tw/api/images/${img.image_id}/view`,
          editable: false,
          canSubmit: true,
        }));
        await fetchLabelHistoryForSelectedImage();
      }
    }
  } catch (error) {
    console.error('Error fetching images:', error);
  } finally {
    isLoading.value = false;
  }
});

async function fetchLabelHistoryForSelectedImage() {
  if (selectedImage.value !== null && images.value.length > 0 && selectedImage.value < images.value.length) {
    const currentImage = images.value[selectedImage.value];
    try {
      const historyData = await fetchImageLabelHistory(currentImage.image_id);
      if (historyData && historyData.length > 0) {
        tableData.value = formatHistoryData(historyData);
      } else {
        tableData.value = [];
      }
    } catch (error) {
      console.error('Error fetching label history:', error);
    }
  }
  updateTotals();
}

function showNoDataAlert() {
  message.warning('需要有資料才能編輯。');
}

async function updateSelectedImage(index: number) {
  selectedImage.value = index;
  isLoadingImage.value = true;
  await fetchLabelHistoryForSelectedImage();
  isLoadingImage.value = false;
}

function handleEditingChange(newEditingState: boolean, index: number) {
  const currentImage: Image | undefined = images.value[index];
  if (currentImage) {
    currentImage.editable = newEditingState;
    if ('editConfirmed' in currentImage) {
      currentImage.editConfirmed = !newEditingState;
    }
  }
}

function confirmSubmit(image: Image) {
  if (image.editable) {
    message.error('請先確認編輯後再提交。');
    return;
  }
  if ('editConfirmed' in image && !image.editConfirmed) {
    message.error('請先確認編輯後再提交。');
    return;
  }
  if (tableData.value.length === 0 || tableData.value.every(row => Object.values(row).every(value => !value))) {
    message.error('沒有有效的數據可以提交。請確保表單已填寫。');
    return;
  }

  dialog.success({
    title: '確認提交',
    content: '您確定要提交這個表單嗎？',
    positiveText: '確定',
    negativeText: '取消',
    onPositiveClick: () => submitForm(image)
  });
}

function validateLabelData(labelData: any[]): { isValid: boolean, errors: string[] } {
  const errors: string[] = [];

  labelData.forEach((item, index) => {
    if (!item.food_name) errors.push(`第 ${index + 1} 行的食物名稱為必填項目`);
    if (!item.quantity_name) errors.push(`第 ${index + 1} 行的數量單位為必填項目`);
    if (!item.cooking_method) errors.push(`第 ${index + 1} 行的烹飪方式為必填項目`);
    if (item.quantity <= 0) errors.push(`第 ${index + 1} 行的數量必須大於 0`);
    if (item.calories <= 0) errors.push(`第 ${index + 1} 行的熱量必須大於 0`);
    if (item.protein <= 0) errors.push(`第 ${index + 1} 行的蛋白質必須大於 0`); 
    if (item.lipids <= 0) errors.push(`第 ${index + 1} 行的脂質必須大於 0`);
    if (item.carbohydrate <= 0) errors.push(`第 ${index + 1} 行的碳水化合物必須大於 0`);
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

async function submitForm(image: Image) {
  const labelData = tableData.value.map(item => ({
    food_name: item['食物(麵、飯、麵包、蔬菜..等等)'],
    quantity_name: item['單位'],
    quantity: parseFloat(item['數量']),
    cooking_method: item['烹飪方式 (炸、烤、煎、炒、滷...等等)'],
    calories: parseFloat(item['熱量 (kcal/100g)']),
    protein: parseFloat(item['蛋白質 (g/100g)']),
    lipids: parseFloat(item['脂質 (g/100g)']),
    carbohydrate: parseFloat(item['碳水化合物 (g/100g)'])
  }));

  const { isValid, errors } = validateLabelData(labelData);

  if (!isValid) {
    message.warning('資料不完整或格式不正確，請檢查並填寫所有必填項目。');
    errors.forEach(error => {
      message.error(error);
    });
    return;
  }

  const submissionPayload = { label_data: labelData };
  isSubmitting.value = true;
  try {
    const response = await submitImageLabels(image.image_id, submissionPayload);
    console.log('Response:', response);
    fetchLabelHistoryForSelectedImage();
    message.success('資料提交成功');
  } catch (error) {
    console.error('提交失敗:', error);
    message.error('提交失敗');
  } finally {
    isSubmitting.value = false;
  }
}

function handleRecognitionResult({ response, selectedIndex }: { response: any, selectedIndex: number }) {
  console.log('Received recognition data:', response);

  // 檢查 response 是否為 null 或 undefined
  if (!response) {
    tableData.value = [{
      '食物(麵、飯、麵包、蔬菜..等等)': '沒有收到有效的回應。',
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': '',
      '數量': '',
      '單位': '',
      '熱量 (kcal/100g)': '',
      '蛋白質 (g/100g)': '',
      '脂質 (g/100g)': '',
      '碳水化合物 (g/100g)': '',
      '創建時間': ''
    }];
    return;
  }

  // 檢查 response 是否包含 error_desc
  if (response.error_desc) {
    tableData.value = [{
      '食物(麵、飯、麵包、蔬菜..等等)': response.error_desc,
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': '',
      '數量': '',
      '單位': '',
      '熱量 (kcal/100g)': '',
      '蛋白質 (g/100g)': '',
      '脂質 (g/100g)': '',
      '碳水化合物 (g/100g)': '',
      '創建時間': ''
    }];
  } else if (Array.isArray(response)) {
    tableData.value = response.map((item: any) => ({
      '食物(麵、飯、麵包、蔬菜..等等)': item.food_name,
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': item.cooking_method,
      '數量': String(item.quantity),
      '單位': item.quantity_name,
      '熱量 (kcal/100g)': String(item.calories),
      '蛋白質 (g/100g)': String(item.protein),
      '脂質 (g/100g)': String(item.lipids),
      '碳水化合物 (g/100g)': String(item.carbohydrate),
      '創建時間': ''
    }));
    images.value[selectedIndex].is_label = true;
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
      '創建時間': ''
    }];
  }
  updateTotals();
}

watchEffect(() => {
  totalCalories.value = tableData.value.reduce((total, item) => total + parseFloat(item['熱量 (kcal/100g)'] || 0), 0);
  totalProtein.value = tableData.value.reduce((total, item) => total + parseFloat(item['蛋白質 (g/100g)'] || 0), 0);
  totalLipids.value = tableData.value.reduce((total, item) => total + parseFloat(item['脂質 (g/100g)'] || 0), 0);
  totalCarbohydrate.value = tableData.value.reduce((total, item) => total + parseFloat(item['碳水化合物 (g/100g)'] || 0), 0);
});

function toggleDrawer() {
  drawerVisible.value = !drawerVisible.value;
  if (drawerVisible.value) {
    fetchHistoryData().then(response => {
      historyData.value = response;
    }).catch(error => {
      console.error('Error fetching history data:', error);
    });
  }
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

.history-button {
  position: fixed;
  top: 50%;
  right: 16px;
  transform: translateY(-50%);
  height: 120px;
  width: 32px;
  z-index: 1000;
  background-color: none;
  color: #000;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  opacity: 0.5; 
  transition: opacity 0.3s, box-shadow 0.3s;
  border:1px solid #ccc
}

.history-button:hover {
  opacity: 1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  background-color: #18a058; 
  opacity: 0.8; 
  color: #eee;
}

</style>
