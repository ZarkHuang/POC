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
