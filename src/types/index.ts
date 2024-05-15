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