<template>
  <NDrawer v-model:show="active" :width="600" :placement="placement">
    <NDrawerContent title="歷史紀錄">
      <div class="drawer-header">
        <NInput v-model:value="searchQuery" placeholder="搜尋..." />
      </div>
      <div class="history-list">
        <div class="history-item" v-for="(item, index) in paginatedHistoryItems" :key="index">
          <div class="history-image-container">
            <img :src="getThumbnailUrl(item.image_id)" alt="Food Image" class="history-image" />
          </div>
          <div class="history-details" v-if="item.label_list && item.label_list.length > 0">
            <p><strong>食物：</strong>{{ item.label_list[0].food_name }}</p>
            <p><strong>烹煮方式：</strong>{{ item.label_list[0].cooking_method }}</p>
            <p><strong>數量：</strong>{{ item.label_list[0].quantity }}</p>
            <p><strong>單位：</strong>{{ item.label_list[0].quantity_name }}</p>
            <p><strong>熱量：</strong>{{ item.label_list[0].calories }} kcal</p>
            <p><strong>蛋白質：</strong>{{ item.label_list[0].protein }} g</p>
            <p><strong>脂質：</strong>{{ item.label_list[0].lipids }} g</p>
            <p><strong>碳水化合物：</strong>{{ item.label_list[0].carbohydrate }} g</p>
            <p><strong>提交時間：</strong>{{ item.updated_at }}</p>
          </div>
        </div>
      </div>
      <div class="drawer-footer">
        <NPagination v-model:page="currentPage" :page-size="pageSize" :page-count="totalPages" show-size-picker />
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { NInput, NPagination, NDrawer, NDrawerContent } from 'naive-ui'
import type { DrawerPlacement } from 'naive-ui'
import { HistoryItem } from '@/types/index.ts';

const active = ref(false)
const placement = ref<DrawerPlacement>('right')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const historyItems = ref<HistoryItem[]>([]) // 使用定義的類型

const props = defineProps<{
  historyData: HistoryItem[]
}>()

watch(() => props.historyData, (newData) => {
  historyItems.value = newData
})

const filteredHistoryItems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return historyItems.value.filter(item =>
    item.label_list &&
    item.label_list.length > 0 &&
    (
      item.label_list[0].food_name.toLowerCase().includes(query) ||
      item.label_list[0].cooking_method.toLowerCase().includes(query) ||
      item.label_list[0].quantity_name.toLowerCase().includes(query)
    )
  )
})

const paginatedHistoryItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredHistoryItems.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredHistoryItems.value.length / pageSize.value))

function getThumbnailUrl(imageId: string) {
  return `https://food-ai.everfortuneai.com.tw/api${imageId}/thumbnail`
}

// function getThumbnailUrl(imageId: string) {
//   const apiUrl = import.meta.env.VITE_APP_HOST_API_URL;
//   return `${apiUrl}/images/${imageId}/thumbnail`;
// }

</script>

<style scoped>
.drawer-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.history-list {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0 20px;
}

.history-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.history-image-container {
  flex-shrink: 0;
  margin-right: 16px;
}

.history-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.history-details {
  flex-grow: 1;
}

.history-details p {
  margin: 4px 0;
  font-size: 14px;
}

.drawer-footer {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}
</style>
