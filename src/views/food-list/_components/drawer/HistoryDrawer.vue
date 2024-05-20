<template>
  <NDrawer v-model:show="active" :width="600" :placement="placement">
    <NDrawerContent title="AI辨識歷史紀錄">
      <div class="history-list">
        <div
          class="history-item"
          v-for="(item, index) in paginatedHistoryItems"
          :key="index"
          @click="handleHistoryItemClick(item.image_id)"
        >
          <div class="history-image-container">
            <img :src="getThumbnailUrl(item.image_id)" alt="Food Image" class="history-image" />
          </div>
          <div class="history-details">
            <p><strong>食物：</strong>{{ getFoodNames(item) }}</p>
            <p><strong>烹煮方式：</strong>{{ getCookingMethods(item) }}</p>
            <p><strong>數量：</strong>{{ getQuantities(item) }}</p>
            <p><strong>單位：</strong>{{ getQuantityNames(item) }}</p>
            <p><strong>熱量：</strong>{{ getTotalCalories(item) }} kcal</p>
            <p><strong>蛋白質：</strong>{{ getTotalProtein(item) }} g</p>
            <p><strong>脂質：</strong>{{ getTotalLipids(item) }} g</p>
            <p><strong>碳水化合物：</strong>{{ getTotalCarbohydrates(item) }} g</p>
            <p><strong>AI辨識時間：</strong>{{ item.updated_at }}</p>
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
import { NPagination, NDrawer, NDrawerContent } from 'naive-ui'
import type { DrawerPlacement } from 'naive-ui'
import { HistoryItem } from '@/types/index.ts';
import { getFoodNames, getCookingMethods, getQuantities, getQuantityNames, getTotalCalories, getTotalProtein, getTotalLipids, getTotalCarbohydrates } from '@/utils/config/calculations.ts';

const active = ref(false)
const placement = ref<DrawerPlacement>('right')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const historyItems = ref<HistoryItem[]>([])

const props = defineProps<{
  historyData: HistoryItem[]
}>()

const emit = defineEmits(['selectHistoryItem'])

watch(() => props.historyData, (newData) => {
  historyItems.value = newData
})

const filteredHistoryItems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return historyItems.value.filter(item =>
    item.ai_list &&
    item.ai_list.length > 0 &&
    (
      item.ai_list.some(ai => ai.food_name.toLowerCase().includes(query)) ||
      item.ai_list.some(ai => ai.cooking_method.toLowerCase().includes(query)) ||
      item.ai_list.some(ai => ai.quantity_name.toLowerCase().includes(query))
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
  const apiUrl = import.meta.env.VITE_APP_HOST_API_URL || 'https://food-ai.everfortuneai.com.tw/api';
  return `${apiUrl}/images/${imageId}/thumbnail`;
}

function handleHistoryItemClick(imageId: string) {
  // console.log('success')
  emit('selectHistoryItem', imageId);
}
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
  cursor: pointer;
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
