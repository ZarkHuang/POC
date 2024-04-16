import { createApp } from 'vue'
import { router } from '@/router'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { vueQueryPluginOptions } from '@/libs/vue-query'
import App from './App.vue'
import '@/styles/index.module.css'
import 'vfonts/OpenSans.css'

const pinia = createPinia()

const app = createApp(App)

app.config.errorHandler = (err, instance, info) => {
  console.warn('[Vue errorHandler]', err, instance, info)
}

app.config.warnHandler = (msg, instance, trace) => {
  console.warn('[Vue warnHandler]', msg, instance, trace)
}

app.use(router)
app.use(pinia)
app.use(VueQueryPlugin, vueQueryPluginOptions)
app.mount('#app')
