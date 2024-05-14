import { AppThemeProviderType } from '@/global'
import { type InjectionKey } from 'vue'

export const APP_THEME_KEY = Symbol() as InjectionKey<AppThemeProviderType>
export const LOCAL_STORAGE_NAME = '__efai__intestinal__admin__'
