import { createSSRApp } from 'vue'
import App from './App.vue'
import pinia from './stores'

// 引入 uview-plus
import uviewPlus from 'uview-plus'

export function createApp() {
  const app = createSSRApp(App)

  // 使用 Pinia
  app.use(pinia)

  // 使用 uview-plus
  app.use(uviewPlus)

  return {
    app
  }
}
