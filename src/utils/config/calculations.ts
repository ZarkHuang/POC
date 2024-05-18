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
    '創建時間': '',
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

  
  export function calculateResults(type: string, item: Record<string, string | number>) {
    if (!item || !(type in item)) {
      return {
        quantity: 0,
        carbohydrate: 0,
        protein: 0,
        lipids: 0,
        total: 0
      };
    }
  
    const quantity = parseFloat(item[type] as string) || 0;
    let carbohydrate = 0;
    let protein = 0;
    let lipids = 0;
  
    switch (type) {
      case '全脂奶':
        carbohydrate = quantity * 12 * 4;
        protein = quantity * 8 * 4;
        lipids = quantity * 8 * 9;
        break;
      case '低脂奶':
        carbohydrate = quantity * 12 * 4;
        protein = quantity * 8 * 4;
        lipids = quantity * 4 * 9;
        break;
      case '脫脂奶':
        carbohydrate = quantity * 12 * 4;
        protein = quantity * 8 * 4;
        lipids = quantity * 0 * 9;
        break;
      case '主食':
        carbohydrate = quantity * 15 * 4;
        protein = quantity * 1.5 * 4;
        lipids = quantity * 0 * 9;
        break;
      case '高脂肉':
        carbohydrate = quantity * 0 * 4;
        protein = quantity * 7 * 4;
        lipids = quantity * 10 * 9;
        break;
      case '中脂肉':
        carbohydrate = quantity * 0 * 4;
        protein = quantity * 7 * 4;
        lipids = quantity * 5 * 9;
        break;
      case '低脂肉':
        carbohydrate = quantity * 0 * 4;
        protein = quantity * 7 * 4;
        lipids = quantity * 3 * 9;
        break;
      case '疏菜':
        carbohydrate = quantity * 5 * 4;
        protein = quantity * 1 * 4;
        lipids = quantity * 0 * 9;
        break;
      case '水果':
      case '複糖':
        carbohydrate = quantity * 15 * 4;
        protein = quantity * 0 * 4;
        lipids = quantity * 0 * 9;
        break;
      case '油脂':
        carbohydrate = quantity * 0 * 4;
        protein = quantity * 0 * 4;
        lipids = quantity * 5 * 9;
        break;
      case '酒':
        carbohydrate = quantity * 0 * 4;
        protein = quantity * 0 * 4;
        lipids = quantity * 10 * 9;
        break;
      default:
        break;
    }
  
    const total = carbohydrate + protein + lipids;
  
    return {
      quantity,
      carbohydrate,
      protein,
      lipids,
      total
    };
  }
  