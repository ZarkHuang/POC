interface Window {
  $message: any
}

type AppThemeProviderType = {
  isDarkTheme: Ref<boolean>
  toggleDarkTheme: () => void
}

type TesterType = {
  id: string
  pname: string
  units: string
  grams: string | number
  cook: string
  kcal: string | number
}

export interface SelectionData {
  id: string
  imageUrl: string
  corners: {
    origTL: { x: number; y: number }
    origTR: { x: number; y: number }
    origBL: { x: number; y: number }
    origBR: { x: number; y: number }
  }
}

interface FormData {
  [key: string]: string | null
}

interface HistoryItem {
  id: string
  label: string
  imageUrl: string
  timestamp: number
}

interface FormItem {
  label: string;
  path: string;
  value?: string; // 根據需要可添加更多屬性
}

interface FormInstance {
  id: string;
  data: FormData;
  editable: boolean;
  label?: string;
  labelIndex: number;
  imageUrl: string;
  isCustom: boolean;
  canSubmit: boolean;
  inputGroups: { path: string; label: string }[][];
  originalImageUrl?: string;
  formItems: FormItem[];
}

interface HistoryItem {
  id: string;
  label: string;
  data: FormData;
  imageUrl: string | undefined;
  timestamp: number;
  originalImageUrl?: string;
}

