import { baseRoutes, LOGIN, NOT_FOUND_ROUTE } from "@/router/routes/baseRoutes";

const modules = import.meta.globEager('./modules/*.js')

// 模块化
const asyncRoutes = []
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default)
})
asyncRoutes.sort((a, b) => a.sort - b.sort)
console.log(asyncRoutes)
const routes = [
  {
    path: '/',
    name: 'Layout',
    component: () => import('@/layout/index.vue'),
    redirect: '/home',
    // 嵌套路由
    children: [...baseRoutes, ...asyncRoutes, NOT_FOUND_ROUTE]
    // TODO : 嵌套路由，mete继承？？？
// NOT_FOUND_ROUTEΩ
  },
  LOGIN
]

export { routes }
