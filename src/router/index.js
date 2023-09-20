// createRouter用来新建路由实例，createWebHashHistory用来配置我们内容使用hash的模式（也就是路径上会通过#来区分）
import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from '@/router/routes'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 收集菜单
const allRoutes = routes[0].children
export { allRoutes }
export default router
