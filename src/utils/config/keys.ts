import { AppThemeProviderType } from '@/global'
import { type InjectionKey } from 'vue'

export const APP_THEME_KEY = Symbol() as InjectionKey<AppThemeProviderType>
