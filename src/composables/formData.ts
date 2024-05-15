import { ref } from 'vue';
import { LabelHistoryItem } from '@/types/index.ts';

export const useFormData = () => {
  const tableData = ref<any[]>([]);
  const totalCalories = ref('-');
  const totalProtein = ref('-');
  const totalLipids = ref('-');
  const totalCarbohydrate = ref('-');

  const formatHistoryData = (historyData: LabelHistoryItem[]) => {
    return historyData.map(item => ({
      '食物(麵、飯、麵包、蔬菜..等等)': item.food_name,
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': item.cooking_method,
      '數量': String(item.quantity),
      '單位': item.quantity_name,
      '熱量 (kcal/100g)': String(item.calories),
      '蛋白質 (g/100g)': String(item.protein),
      '脂質 (g/100g)': String(item.lipids),
      '碳水化合物 (g/100g)': String(item.carbohydrate),
      '創建時間': String(item.created_at),
    }));
  };

  const addNewRow = () => {
    const newRow = {
      '食物(麵、飯、麵包、蔬菜..等等)': '',
      '烹飪方式 (炸、烤、煎、炒、滷...等等)': '',
      '數量': '0',
      '單位': '',
      '熱量 (kcal/100g)': '0',
      '蛋白質 (g/100g)': '0',
      '脂質 (g/100g)': '0',
      '碳水化合物 (g/100g)': '0',
      '提交時間': ''
    };
    tableData.value.push(newRow);
  };

  const removeRow = (index: number) => {
    tableData.value.splice(index, 1);
  };

  const updateTotals = () => {
    totalCalories.value = tableData.value.reduce((total, item) => total + parseFloat(item['熱量 (kcal/100g)'] || 0), 0);
    totalProtein.value = tableData.value.reduce((total, item) => total + parseFloat(item['蛋白質 (g/100g)'] || 0), 0);
    totalLipids.value = tableData.value.reduce((total, item) => total + parseFloat(item['脂質 (g/100g)'] || 0), 0);
    totalCarbohydrate.value = tableData.value.reduce((total, item) => total + parseFloat(item['碳水化合物 (g/100g)'] || 0), 0);
  };

  return {
    tableData,
    totalCalories,
    totalProtein,
    totalLipids,
    totalCarbohydrate,
    formatHistoryData,
    addNewRow,
    removeRow,
    updateTotals
  };
};