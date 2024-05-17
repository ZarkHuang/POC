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
  editable: boolean;  
  formData: FormData | null;  
  formItems: FormInstance[];  
  canSubmit: boolean; 
  image_id: string;
  thumbnailUrl: string;
  fullImageUrl: string;
  is_label?: boolean;
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

export interface Label {
  food_name: string;
  quantity_name: string;
  quantity: number;
  cooking_method: string;
  calories: number;
  protein: number;
  lipids: number;
  carbohydrate: number;
}

export interface HistoryItem {
  image_id: string;
  label_list: Label[];
  updated_at: string;
}

export interface TableItem {
  '食物(麵、飯、麵包、蔬菜..等等)': string;
  '烹飪方式 (炸、烤、煎、炒、滷...等等)': string;
  '數量': string;
  '單位': string;
  '熱量': string;
  '蛋白質': string;
  '脂質': string;
  '碳水化合物': string;
  '創建時間': string;
  [key: string]: string;
}
