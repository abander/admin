// 页面层路由权限：当在login页面且没有token时，可以直接修改url进入home页面，为了防止这个问题，以下是解决方案

import router from './index'
import { getToken } from '@/utils/auth.js'
// 白名单：不登录也可以访问的页面
const whiteList = ['/login']

router.beforeEach((to, from, next) => {
  // 目前使用sessionStorage测试路由守卫，做了退出登录使用store里面的token判断
  const token = getToken()
  //判断是否有权限返回登录界面
  if (token) {
    if (to.path === '/login') {
      next('/')
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.path)) {
      next()
    } else {
      next('/login')
    }
  }
})
