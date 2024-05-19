import { ref } from 'vue';
import { LabelHistoryItem, TableItem } from '@/types/index.ts';

export const useFormData = () => {
  const tableData = ref<TableItem[]>([]);

  const formatHistoryData = (historyData: LabelHistoryItem[]): TableItem[] => {
    return historyData.map(item => ({
      '食物': item.food_name,
      '烹飪方式': item.cooking_method,
      '數量': String(item.quantity),
      '單位': item.quantity_name,
      '熱量': String(item.calories),
      '蛋白質': String(item.protein),
      '脂質': String(item.lipids),
      '碳水化合物': String(item.carbohydrate),
      '全脂奶': '',
      '低脂奶': '',
      '脫脂奶': '',
      '主食': '',
      '高脂肉': '',
      '中脂肉': '',
      '低脂肉': '',
      '疏菜': '',
      '水果': '',
      '複糖': '',
      '油脂': '',
      '酒': '',
    }));
  };

  const addNewRow = (): void => {
    tableData.value.push(createEmptyItem());
  };

  const removeRow = (index: number): void => {
    tableData.value.splice(index, 1);
  };

  return {
    tableData,
    formatHistoryData,
    addNewRow,
    removeRow,
  };
};

function createEmptyItem(): TableItem {
  return {
    '食物': '',
    '烹飪方式': '',
    '數量': '0',
    '單位': '',
    '熱量': '0',
    '蛋白質': '0',
    '脂質': '0',
    '碳水化合物': '0',
    '全脂奶': '',
    '低脂奶': '',
    '脫脂奶': '',
    '主食': '',
    '高脂肉': '',
    '中脂肉': '',
    '低脂肉': '',
    '疏菜': '',
    '水果': '',
    '複糖': '',
    '油脂': '',
    '酒': ''
  };
}


export const formatHistoryData = (historyData: LabelHistoryItem[]): TableItem[] => {
  return historyData.map(item => ({
    '食物': item.food_name,
    '烹飪方式': item.cooking_method,
    '數量': String(item.quantity),
    '單位': item.quantity_name,
    '熱量': String(item.calories),
    '蛋白質': String(item.protein),
    '脂質': String(item.lipids),
    '碳水化合物': String(item.carbohydrate),
    '全脂奶': '',
    '低脂奶': '',
    '脫脂奶': '',
    '主食': '',
    '高脂肉': '',
    '中脂肉': '',
    '低脂肉': '',
    '疏菜': '',
    '水果': '',
    '複糖': '',
    '油脂': '',
    '酒': '',
  }));
};