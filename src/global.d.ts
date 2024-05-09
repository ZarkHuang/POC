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
interface HistoryItem {
  id: string;
  label: string;
  data: FormData;
  imageUrl: string | undefined;
  timestamp: number;
  originalImageUrl?: string;
}

