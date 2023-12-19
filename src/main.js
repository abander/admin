import { createApp } from 'vue'
import App from './App.vue'
import AppLoading from '@/components/app-loading'

// router
import router from './router/index'
// pinia
import { setupStore } from '@/stores/index.js'
//引入Elmessage的css样式文件
import 'element-plus/dist/index.css'

// 路由守卫
import '@/router/permission'
// 样式
import './styles/common.scss'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
async function setupApp() {
  // app loading
  const appLoading = createApp(AppLoading)

  appLoading.mount('#appLoading')

  const app = createApp(App)

  // store plugin: pinia
  await setupStore(app)

  // vue router
  app.use(router)
  app.use(VXETable)
  await router.isReady()

  appLoading.unmount()

  // mount app
  app.mount('#app')
}

setupApp()
