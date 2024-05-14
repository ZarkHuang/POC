export interface FormInstance {
  id: string;
  data: FormData;
  editable: boolean;
  label?: string;
  labelIndex: number;
  imageUrl: string;
  isCustom: boolean;
  canSubmit: boolean;
  imageId: string;
  inputGroups: { path: string; label: string }[][];
  originalImageUrl?: string;
  formItems: [];
}

export interface FormData {
  food_name: string;
  cooking_method: string;
  quantity: number;
  calories: number;
  protein: number;
  lipids: number;
  carbohydrate: number;
  quantity_name: string;
  created_at?: string;
}

export interface Image {
  editable: boolean;  // 指明是否可編輯
  formData: FormData | null;  // 指定為FormData型別或無數據時為null
  formItems: FormInstance[];  // 假設formItems是一組FormInstance的數據
  canSubmit: boolean;  // 指明是否可提交
  image_id: string;  // 明確指定為字符串型別
  thumbnailUrl: string;
  fullImageUrl: string;
  is_label?: boolean;  // 如果從API獲得的數據包含is_label
}

export interface LabelHistoryItem {
  food_name: string;
  cooking_method: string;
  quantity: number;
  quantity_name: string;
  calories: number;
  protein: number;
  lipids: number;
  carbohydrate: number;
  created_at: string;
}