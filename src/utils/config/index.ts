export * from './keys'
import { ref } from 'vue'

  
export const tableHeaders = ref([
    '食物(麵、飯、麵包、蔬菜..等等)',
    '烹飪方式 (炸、烤、煎、炒、滷...等等)',
    '數量',
    '單位',
    '熱量 (kcal/100g)',
    '蛋白質 (g/100g)',
    '脂質 (g/100g)',
    '碳水碳水化合物 (g/100g)',
    '提交時間',
    '狀態'
  ]);