import { TableItem } from '@/types/index.ts';

export function createEmptyItem(): TableItem {
  return {
    '食物': '',
    '烹飪方式': '',
    '數量': '',
    '單位': '',
    '熱量': '',
    '蛋白質': '',
    '脂質': '',
    '碳水化合物': '',
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
  };
}
export function calculateResults(type: string, items: Record<string, string | number>[]): {
  quantity: number;
  carbohydrate: number;
  protein: number;
  lipids: number;
  total: number;
} {
  let totalQuantity = 0;
  let totalCarbohydrate = 0;
  let totalProtein = 0;
  let totalLipids = 0;

  items.forEach(item => {
    const quantity = parseFloat(item[type] as string) || 0;
    totalQuantity += quantity;

    switch (type) {
      case '全脂奶':
        totalCarbohydrate += quantity * 12 * 4;
        totalProtein += quantity * 8 * 4;
        totalLipids += quantity * 8 * 9;
        break;
      case '低脂奶':
        totalCarbohydrate += quantity * 12 * 4;
        totalProtein += quantity * 8 * 4;
        totalLipids += quantity * 4 * 9;
        break;
      case '脫脂奶':
        totalCarbohydrate += quantity * 12 * 4;
        totalProtein += quantity * 8 * 4;
        totalLipids += quantity * 0 * 9;
        break;
      case '主食':
        totalCarbohydrate += quantity * 15 * 4;
        totalProtein += quantity * 1.5 * 4;
        totalLipids += quantity * 0 * 9;
        break;
      case '高脂肉':
        totalCarbohydrate += quantity * 0 * 4;
        totalProtein += quantity * 7 * 4;
        totalLipids += quantity * 10 * 9;
        break;
      case '中脂肉':
        totalCarbohydrate += quantity * 0 * 4;
        totalProtein += quantity * 7 * 4;
        totalLipids += quantity * 5 * 9;
        break;
      case '低脂肉':
        totalCarbohydrate += quantity * 0 * 4;
        totalProtein += quantity * 7 * 4;
        totalLipids += quantity * 3 * 9;
        break;
      case '疏菜':
        totalCarbohydrate += quantity * 5 * 4;
        totalProtein += quantity * 1 * 4;
        totalLipids += quantity * 0 * 9;
        break;
      case '水果':
      case '複糖':
        totalCarbohydrate += quantity * 15 * 4;
        totalProtein += quantity * 0 * 4;
        totalLipids += quantity * 0 * 9;
        break;
      case '油脂':
        totalCarbohydrate += quantity * 0 * 4;
        totalProtein += quantity * 0 * 4;
        totalLipids += quantity * 5 * 9;
        break;
      case '酒':
        totalCarbohydrate += quantity * 0 * 4;
        totalProtein += quantity * 0 * 4;
        totalLipids += quantity * 10 * 9;
        break;
      default:
        break;
    }
  });

  const total = totalCarbohydrate + totalProtein + totalLipids;

  return {
    quantity: totalQuantity,
    carbohydrate: totalCarbohydrate,
    protein: totalProtein,
    lipids: totalLipids,
    total
  };
}
