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
}

export interface Image {
  editable: any
  formData: any
  formItems: any
  canSubmit: any
  image_id: string | number | symbol | undefined
  thumbnailUrl: string;
  fullImageUrl: string;
}
