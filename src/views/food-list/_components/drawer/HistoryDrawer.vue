<template>
  <NDrawer v-model:show="active" :width="600" :placement="placement">
    <NDrawerContent title="歷史紀錄">
      <div class="drawer-header">
        <NInput v-model:value="searchQuery" placeholder="搜尋..." />
      </div>
      <div class="history-list">
        <div class="history-item" v-for="(item, index) in filteredHistoryItems" :key="index">
          <div class="history-image-container">
            <img :src="item.image" alt="Food Image" class="history-image" />
          </div>
          <div class="history-details">
            <p><strong>食物：</strong>{{ item.food }}</p>
            <p><strong>烹煮方式：</strong>{{ item.cookingMethod }}</p>
            <p><strong>數量：</strong>{{ item.quantity }}</p>
            <p><strong>單位：</strong>{{ item.unit }}</p>
            <p><strong>熱量：</strong>{{ item.calories }} kcal</p>
            <p><strong>蛋白質：</strong>{{ item.protein }} g</p>
            <p><strong>脂質：</strong>{{ item.fat }} g</p>
            <p><strong>碳水化合物：</strong>{{ item.carbs }} g</p>
            <p><strong>提交時間：</strong>{{ item.submissionTime }}</p>
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
import { ref, computed } from 'vue'
import { NInput, NPagination, NDrawer, NDrawerContent } from 'naive-ui'
import type { DrawerPlacement } from 'naive-ui'

const active = ref(false)
const placement = ref<DrawerPlacement>('right')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)

const historyItems = ref([
  {
    image: 'path/to/image1.jpg',
    food: '豬肉餃子',
    cookingMethod: '煮',
    quantity: 10,
    unit: '顆',
    calories: 300,
    protein: 15,
    fat: 20,
    carbs: 40,
    submissionTime: '2024-05-15 12:00'
  },
  {
    image: 'path/to/image2.jpg',
    food: '牛肉麵',
    cookingMethod: '煮',
    quantity: 1,
    unit: '碗',
    calories: 500,
    protein: 30,
    fat: 25,
    carbs: 60,
    submissionTime: '2024-05-14 18:30'
  },
  {
    image: 'path/to/image2.jpg',
    food: '牛肉麵',
    cookingMethod: '煮',
    quantity: 1,
    unit: '碗',
    calories: 500,
    protein: 30,
    fat: 25,
    carbs: 60,
    submissionTime: '2024-05-14 18:30'
  },
  {
    image: 'path/to/image2.jpg',
    food: '牛肉麵',
    cookingMethod: '煮',
    quantity: 1,
    unit: '碗',
    calories: 500,
    protein: 30,
    fat: 25,
    carbs: 60,
    submissionTime: '2024-05-14 18:30'
  },
  {
    image: 'path/to/image2.jpg',
    food: '牛肉麵',
    cookingMethod: '煮',
    quantity: 1,
    unit: '碗',
    calories: 500,
    protein: 30,
    fat: 25,
    carbs: 60,
    submissionTime: '2024-05-14 18:30'
  },
  // ... 其他歷史紀錄項目
])

const filteredHistoryItems = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return historyItems.value.filter(item =>
    item.food.toLowerCase().includes(query) ||
    item.cookingMethod.toLowerCase().includes(query) ||
    item.unit.toLowerCase().includes(query)
  ).slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

const totalPages = computed(() => Math.ceil(historyItems.value.length / pageSize.value))
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
