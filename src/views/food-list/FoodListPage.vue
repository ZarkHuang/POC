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
                  <!-- <EditButton :isEditing="isEditing" @update:isEditing="isEditing = $event" /> -->
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
                    <td>{{ calculateResults(result, tableData).quantity }}</td>
                  <td>{{ calculateResults(result, tableData).carbohydrate }}</td>
                  <td>{{ calculateResults(result, tableData).protein }}</td>
                  <td>{{ calculateResults(result, tableData).lipids }}</td>
                  <td>{{ calculateResults(result, tableData).total }}</td>
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
// const isEditing = ref(true);
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

        // Fetch history data on initial load
        const historyResponse = await fetchHistoryData();
        // console.log('Initial History Data Response:', historyResponse);

        if (historyResponse) {
          const data = Array.isArray(historyResponse) ? historyResponse : historyResponse.data;
          const initialImageHistory = data.find((item: { image_id: string; }) => item.image_id === images.value[selectedImage.value].image_id);

          if (initialImageHistory && initialImageHistory.ai_list) {
            recognitionData.value = initialImageHistory.ai_list.map((aiItem: { food_name: any; cooking_method: any; quantity: any; quantity_name: any; calories: any; protein: any; lipids: any; carbohydrate: any; }) => ({
              '食物': aiItem.food_name,
              '烹飪方式': aiItem.cooking_method,
              '數量': String(aiItem.quantity),
              '單位': aiItem.quantity_name,
              '熱量': String(aiItem.calories),
              '蛋白質': String(aiItem.protein),
              '脂質': String(aiItem.lipids),
              '碳水化合物': String(aiItem.carbohydrate),
            }));
          } else {
            recognitionData.value = [createEmptyItem()];
          }

          if (initialImageHistory && initialImageHistory.label_list) {
            tableData.value = initialImageHistory.label_list.map((labelItem: { food_name: any; cooking_method: any; whole_milk_quantity: any; low_fat_milk_quantity: any; skim_milk_quantity: any; staple_foods_quantity: any; high_fat_meat_quantity: any; medium_fat_meat_quantity: any; low_fat_meat_quantity: any; vegetables_quantity: any; fruit_complex_sugar_quantity: any; grease_quantity: any; guzzle_quantity: any; }) => ({
              '食物': labelItem.food_name,
              '烹飪方式': labelItem.cooking_method,
              '全脂奶': String(labelItem.whole_milk_quantity),
              '低脂奶': String(labelItem.low_fat_milk_quantity),
              '脫脂奶': String(labelItem.skim_milk_quantity),
              '主食': String(labelItem.staple_foods_quantity),
              '高脂肉': String(labelItem.high_fat_meat_quantity),
              '中脂肉': String(labelItem.medium_fat_meat_quantity),
              '低脂肉': String(labelItem.low_fat_meat_quantity),
              '疏菜': String(labelItem.vegetables_quantity),
              '水果': String(labelItem.fruit_complex_sugar_quantity),
              '複糖': String(labelItem.fruit_complex_sugar_quantity),
              '油脂': String(labelItem.grease_quantity),
              '酒': String(labelItem.guzzle_quantity),
            }));
          } else {
            tableData.value = [createEmptyItem()];
          }
        }
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
        tableData.value = [createEmptyItem()];
      }
    } catch (error) {
      console.error('Error fetching label history:', error);
    }
  }
}

function formatHistoryData(historyData: any[]): TableItem[] {
  return historyData.map(item => ({
    '食物': item.food_name || '',
    '烹飪方式': item.cooking_method || '',
    '數量': item.quantity ? String(item.quantity) : '',
    '單位': item.quantity_name || '',
    '熱量': item.calories ? String(item.calories) : '',
    '蛋白質': item.protein ? String(item.protein) : '',
    '脂質': item.lipids ? String(item.lipids) : '',
    '碳水化合物': item.carbohydrate ? String(item.carbohydrate) : '',
    '全脂奶': item.whole_milk_quantity ? String(item.whole_milk_quantity) : '',
    '低脂奶': item.low_fat_milk_quantity ? String(item.low_fat_milk_quantity) : '',
    '脫脂奶': item.skim_milk_quantity ? String(item.skim_milk_quantity) : '',
    '主食': item.staple_foods_quantity ? String(item.staple_foods_quantity) : '',
    '高脂肉': item.high_fat_meat_quantity ? String(item.high_fat_meat_quantity) : '',
    '中脂肉': item.medium_fat_meat_quantity ? String(item.medium_fat_meat_quantity) : '',
    '低脂肉': item.low_fat_meat_quantity ? String(item.low_fat_meat_quantity) : '',
    '疏菜': item.vegetables_quantity ? String(item.vegetables_quantity) : '',
    '水果': item.fruit_complex_sugar_quantity ? String(item.fruit_complex_sugar_quantity) : '',
    '複糖': item.fruit_complex_sugar_quantity ? String(item.fruit_complex_sugar_quantity) : '',
    '油脂': item.grease_quantity ? String(item.grease_quantity) : '',
    '酒': item.guzzle_quantity ? String(item.guzzle_quantity) : ''
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

  fetchHistoryData().then(response => {
    // console.log('History Data Response:', response);
    if (response) {
      const data = Array.isArray(response) ? response : response.data;
      // console.log('有資料？', data);
      const imageHistory = data.find((item: { image_id: string; }) => item.image_id === images.value[selectedImage.value].image_id);
      console.log('Image History:', imageHistory); 

      if (imageHistory && imageHistory.ai_list) {
        recognitionData.value = imageHistory.ai_list.map((aiItem: { food_name: any; cooking_method: any; quantity: any; quantity_name: any; calories: any; protein: any; lipids: any; carbohydrate: any; }) => ({
          '食物': aiItem.food_name,
          '烹飪方式': aiItem.cooking_method,
          '數量': String(aiItem.quantity),
          '單位': aiItem.quantity_name,
          '熱量': String(aiItem.calories),
          '蛋白質': String(aiItem.protein),
          '脂質': String(aiItem.lipids),
          '碳水化合物': String(aiItem.carbohydrate),
        }));
      } else {
        recognitionData.value = [createEmptyItem()];
      }
      if (imageHistory && imageHistory.label_list) {
        tableData.value = imageHistory.label_list.map((labelItem: { food_name: any; cooking_method: any; whole_milk_quantity: any; low_fat_milk_quantity: any; skim_milk_quantity: any; staple_foods_quantity: any; high_fat_meat_quantity: any; medium_fat_meat_quantity: any; low_fat_meat_quantity: any; vegetables_quantity: any; fruit_complex_sugar_quantity: any; grease_quantity: any; guzzle_quantity: any; }) => ({
          '食物': labelItem.food_name,
          '烹飪方式': labelItem.cooking_method,
          '全脂奶': String(labelItem.whole_milk_quantity),
          '低脂奶': String(labelItem.low_fat_milk_quantity),
          '脫脂奶': String(labelItem.skim_milk_quantity),
          '主食': String(labelItem.staple_foods_quantity),
          '高脂肉': String(labelItem.high_fat_meat_quantity),
          '中脂肉': String(labelItem.medium_fat_meat_quantity),
          '低脂肉': String(labelItem.low_fat_meat_quantity),
          '疏菜': String(labelItem.vegetables_quantity),
          '水果': String(labelItem.fruit_complex_sugar_quantity),
          '複糖': String(labelItem.fruit_complex_sugar_quantity),
          '油脂': String(labelItem.grease_quantity),
          '酒': String(labelItem.guzzle_quantity),
        }));
      } else {
        tableData.value = [createEmptyItem()];
      }
    } else {
      console.error('Invalid response structure:', response);
      recognitionData.value = [createEmptyItem()];
      tableData.value = [createEmptyItem()];
    }
  }).catch(error => {
    console.error('Error fetching history data:', error);
  });
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


type DataItem = {
  food_name: string;
  cooking_method: string;
  whole_milk_quantity?: number;
  low_fat_milk_quantity?: number;
  skim_milk_quantity?: number;
  staple_foods_quantity?: number;
  high_fat_meat_quantity?: number;
  medium_fat_meat_quantity?: number;
  low_fat_meat_quantity?: number;
  vegetables_quantity?: number;
  fruit_complex_sugar_quantity?: number;
  grease_quantity?: number;
  guzzle_quantity?: number;
  quantity_name?: string;
  quantity?: number;
  calories?: number;
  protein?: number;
  lipids?: number;
  carbohydrate?: number;
};


async function submitForm(image: Image) {
  const labelData: DataItem[] = tableData.value.map(item => ({
    food_name: item['食物'],
    cooking_method: item['烹飪方式'],
    whole_milk_quantity: parseFloat(item['全脂奶']) || 0,
    low_fat_milk_quantity: parseFloat(item['低脂奶']) || 0,
    skim_milk_quantity: parseFloat(item['脫脂奶']) || 0,
    staple_foods_quantity: parseFloat(item['主食']) || 0,
    high_fat_meat_quantity: parseFloat(item['高脂肉']) || 0,
    medium_fat_meat_quantity: parseFloat(item['中脂肉']) || 0,
    low_fat_meat_quantity: parseFloat(item['低脂肉']) || 0,
    vegetables_quantity: parseFloat(item['疏菜']) || 0,
    fruit_complex_sugar_quantity: parseFloat(item['水果']) || 0,
    grease_quantity: parseFloat(item['油脂']) || 0,
    guzzle_quantity: parseFloat(item['酒']) || 0,
  }));

  // 從 AI 認識結果中提取數據
  const aiData = recognitionData.value.map(item => ({
    food_name: item['食物'],
    quantity_name: item['單位'],
    quantity: parseInt(item['數量'], 10) || 0,
    cooking_method: item['烹飪方式'],
    calories: parseFloat(item['熱量']) || 0,
    protein: parseFloat(item['蛋白質']) || 0,
    lipids: parseFloat(item['脂質']) || 0,
    carbohydrate: parseFloat(item['碳水化合物']) || 0
  }));

  // 準備提交到 API 的資料
  const submissionPayload = {
    label_data: labelData,
    ai_data: aiData.length > 0 ? aiData : []
  };

  console.log('submissionPayload:', submissionPayload);

  // 提交前的資料驗證
  const { isValid, errors } = validateLabelData(labelData.concat(aiData));
  if (!isValid) {
    message.warning('資料不完整或格式不正確，請檢查並填寫所有必填項目。');
    errors.forEach(error => {
      message.error(error);
    });
    return;
  }

  isSubmitting.value = true;
  try {
    const response = await submitImageLabels(image.image_id, submissionPayload);
    console.log('Response:', response);
    const imageIndex = images.value.findIndex(img => img.image_id === image.image_id);
    if (imageIndex !== -1) {
      images.value[imageIndex].is_label = true;
    }
    // 這裡刪除fetchLabelHistoryForSelectedImage()，以避免重置tableData
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

  // 過濾掉空行
  const nonEmptyData = labelData.filter(item => 
    item.food_name || item.cooking_method || item.quantity || item.calories || item.protein || item.lipids || item.carbohydrate || item.quantity_name
  );

  nonEmptyData.forEach((item, index) => {
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
