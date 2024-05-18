<template>
  <NSpace vertical>
    <NGrid cols="12" x-gap="12">
      <NGi :span="2">
        <ImageSelector :images="images.map(image => ({ url: image.thumbnailUrl, is_label: image.is_label! }))"
          @update:selectedImage="updateSelectedImage" :selectedImage="selectedImage" :isRecognizing="isRecognizing" />
      </NGi>
      <NGi :span="10">
        <div v-if="isLoading">
          <p>圖片資源加载中...</p>
        </div>
        <div v-else-if="images.length > 0">
          <ImageCarousel :image="images[selectedImage]?.fullImageUrl || ''" :selectedImage="selectedImage"
            :isLoadingImage="isLoadingImage" @recognitionResult="handleRecognitionResult"
            @update:recognizing="isRecognizing = $event" @update:selectedImage="updateSelectedImage" />
        </div>
        <div v-else>
          <p>沒有任何資料</p>
        </div>
      </NGi>
      <!-- 表單區域 -->
      <NGi :span="12">
        <NDivider />
        <div class="form-header">
          <PageTitle>AI辨識結果</PageTitle>
        </div>
        <div class="form-content">
          <!-- <div v-if="recognitionData.length > 0" class="form-content"> -->
          <RecognitionResultTable :recognitionData="recognitionData" :tableHeaders="tableHeaders" />
        </div>
        <NScrollbar>
          <NDivider />
          <div v-if="selectedImage < images.length && images[selectedImage]" :key="images[selectedImage].image_id"
            class="form-content">
            <NGrid cols="12" justify="space-between" class="form-title-container"
              style="align-items: center; margin-bottom: 12px;">
              <NGi :span="3">
                <div class="form-header">
                  <PageTitle>資料確認</PageTitle>
                </div>
              </NGi>
              <NGi :span="9" justify="end">
                <div style="display: flex; justify-content: flex-end; align-items: center;">
                  <NH5 class="form-title" style="margin: 0px 16px">
                    時間：
                    <NTime :time="Date.now()" type="date" />
                  </NH5>
                  <NButton @click="addNewRow" type="primary">
                    新增欄位
                  </NButton>
                  <EditButton :isEditing="isEditing" @update:isEditing="isEditing = $event" />
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
                  <td v-for="header in tableHeaders" :key="header">
                    <NInput v-model:value="item[header]" />
                  </td>
                  <td>
                    <NButton type="error" ghost @click="removeRow(index)">
                      刪除
                    </NButton>
                  </td>
                </tr>
              </tbody>
            </NTable>
            <div style="display: flex; justify-content: end; padding: 10px 0;">
              <NButton @click="confirmSubmit(images[selectedImage])"
                :disabled="!images[selectedImage].canSubmit || isSubmitting">提交</NButton>
            </div>
          </div>

          <div class="form-content">
              <div class="form-header">
                <PageTitle>計算結果</PageTitle>
              </div>
              <NTable :bordered="false" :single-line="false">
                <thead>
                  <tr>
                    <th>成分</th>
                    <th>份數</th>
                    <th>碳水化合物</th>
                    <th>蛋白質</th>
                    <th>脂肪</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(result, index) in tableResluts" :key="index">
                    <td>{{ result }}</td>
                    <td>{{ calculateResults(result, tableData[0]).quantity }}</td>
                    <td>{{ calculateResults(result, tableData[0]).carbohydrate }}</td>
                    <td>{{ calculateResults(result, tableData[0]).protein }}</td>
                    <td>{{ calculateResults(result, tableData[0]).lipids }}</td>
                    <td>{{ calculateResults(result, tableData[0]).total }}</td>
                  </tr>
                </tbody>
              </NTable>
            </div>
        </NScrollbar>
      </NGi>
    </NGrid>
    <HistoryDrawer v-model:show="drawerVisible" :historyData="historyData" />
    <Button @click="toggleDrawer" class="history-button" type="primary">
      <NIcon size="20" :component="ChevronLeft" />
    </Button>
  </NSpace>
</template>

<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue';
import { NInput, NButton, NGrid, NGi, NScrollbar, useDialog } from 'naive-ui';
import { ChevronLeft } from '@vicons/carbon'
import { Image , TableItem } from '@/types/index.ts';
import ImageSelector from '@/views/food-list/ImageSelector.vue';
import ImageCarousel from '@/views/food-list/ImageCarousel.vue';
import RecognitionResultTable from '@/views/food-list/RecognitionResultTable.vue';
import EditButton from '@/views/food-list/_components/button/EditButton.vue';
import HistoryDrawer from '@/views/food-list/_components/drawer/HistoryDrawer.vue';
import { fetchUserImages, fetchImageLabelHistory, submitImageLabels, fetchHistoryData } from '@/services/api';
import { useAuthStore } from '@/stores/authStore';
import { useMessage } from 'naive-ui';
import { tableHeaders, tableResluts } from '@/utils/config/index.ts';
import { createEmptyItem, calculateResults } from '@/utils/config/calculations.ts';

const images: Ref<Image[]> = ref([]);
const authStore = useAuthStore();
const dialog = useDialog();
const isSubmitting = ref(false);
const message = useMessage();
const selectedImage = ref(0);
const isLoading = ref(true);
const isRecognizing = ref(false);
const isLoadingImage = ref(false);
const drawerVisible = ref(false);
const historyData = ref([]);
const tableData = ref<TableItem[]>([createEmptyItem()]);
const isEditing = ref(true);
const recognitionData: Ref<any[]> = ref([]);

onMounted(async () => {
  try {
    if (authStore.authState.isLoggedIn && authStore.authState.token) {
      const response = await fetchUserImages();
      if (response) {
        const apiUrl = import.meta.env.VITE_APP_HOST_API_URL || 'https://food-ai.everfortuneai.com.tw/api';
        images.value = response.map((img: Image) => ({
          image_id: img.image_id,
          is_label: img.is_label,
          thumbnailUrl: `${apiUrl}/images/${img.image_id}/thumbnail`,
          fullImageUrl: `${apiUrl}/images/${img.image_id}/view`,
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
        tableData.value = formatHistoryData(historyData) ? [] : [];
      } else {
        tableData.value = [createEmptyItem()];
      }
    } catch (error) {
      console.error('Error fetching label history:', error);
    }
  }
}
function formatHistoryData(historyData: any[]) {
  return historyData.map(item => ({
    '食物': item.food_name,
    '烹飪方式': item.cooking_method,
    '數量': item.quantity,
    '單位': item.quantity_name,
    '熱量': item.calories,
    '蛋白質': item.protein,
    '脂質': item.lipids,
    '碳水化合物': item.carbohydrate,
    '創建時間': item.created_at
  }));
}

function removeRow(index: number) {
  tableData.value.splice(index, 1);
}

function addNewRow() {
  tableData.value.push(createEmptyItem());
}

async function updateSelectedImage(index: number) {
  selectedImage.value = index;
  isLoadingImage.value = true;
  await fetchLabelHistoryForSelectedImage();
  isLoadingImage.value = false;
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

async function submitForm(image: Image) {
  const labelData = tableData.value.map(item => ({
    food_name: item['食物'],
    quantity_name: item['單位'],
    quantity: parseFloat(item['數量']),
    cooking_method: item['烹飪方式'],
    calories: parseFloat(item['熱量']),
    protein: parseFloat(item['蛋白質']),
    lipids: parseFloat(item['脂質']),
    carbohydrate: parseFloat(item['碳水化合物']),
    created_at: item['創建時間']
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

function validateLabelData(labelData: any[]): { isValid: boolean, errors: string[] } {
  const errors: string[] = [];

  labelData.forEach((item, index) => {
    if (!item.food_name) errors.push(`第 ${index + 1} 行的食物名稱為必填項目`);
    if (!item.cooking_method) errors.push(`第 ${index + 1} 行的烹飪方式為必填項目`);
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

function handleRecognitionResult({ response, selectedIndex }: { response: any, selectedIndex: number }) {
  console.log('response:', response);

  if (!response) {
    recognitionData.value = [createEmptyItem()];
    tableData.value = [createEmptyItem()];
    return;
  }

  if (response.error_desc) {
    const errorItem = { ...createEmptyItem(), '食物': response.error_desc };
    recognitionData.value = [errorItem];
    tableData.value = [createEmptyItem()];
    return;
  }

  if (Array.isArray(response)) {
    const recognitionResults = response.map(item => ({
      '食物': item.food_name,
      '烹飪方式': item.cooking_method,
      '數量': String(item.quantity),
      '單位': item.quantity_name,
      '熱量': String(item.calories),
      '蛋白質': String(item.protein),
      '脂質': String(item.lipids),
      '碳水化合物': String(item.carbohydrate),
    }));

    // 更新辨識結果表
    recognitionData.value = recognitionResults;
    images.value[selectedIndex].is_label = true;

    // 更新資料確認表，可以根據需要選擇是否要更新某些特定欄位
    const newItems = response.map(item => {
      const newItem = createEmptyItem();
      newItem['食物'] = item.food_name;
      newItem['烹飪方式'] = item.cooking_method;

      Object.keys(item).forEach(key => {
        if (key in newItem) {
          newItem[key] = String(item[key]);
        }
      });

      return newItem;
    });
    tableData.value = newItems;
  } else {
    recognitionData.value = [createEmptyItem()];
    tableData.value = [createEmptyItem()];
  }
}



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
  border: 1px solid #ccc
}

.history-button:hover {
  opacity: 1;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
  background-color: #18a058;
  opacity: 0.8;
  color: #eee;
}
</style>
