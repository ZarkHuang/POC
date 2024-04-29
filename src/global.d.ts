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
  originalImageUrl: string
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
  originalImageUrl: string
  timestamp: number
}

interface FormInstance {
  id: string
  data: FormData
  editable: boolean
  label?: string
  labelIndex: number
  imageUrl: string
  originalImageUrl?: string
  isCustom: boolean
  canSubmit: boolean
}

export interface HistoryItem {
  id: string
  label: string
  data: FormData
  imageUrl: string
  timestamp: number
}
