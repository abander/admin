const baseRoutes = [
  {
    // 这里不设置值，是把main作为默认页面
    path: 'home',
    name: 'Main',
    component: () => import('@/views/main/index.vue'),
    meta: {
      title: '首页',
      hide: true
    }
  }
]

const NOT_FOUND_ROUTE = {
  path: '/:pathMatch(.*)',
  name: '404',
  component: () => import('@/views/biz/404.vue'),
  meta: {
    title: '页面未找到',
    hide: true // 不在menus中展示
  }
}

const LOGIN = {
  path: '/login',
  name: 'Login',
  component: () => import('@/views/login/login.vue'),
  meta: {
    title: '登录',
    hide: true, // 不在menus中展示,
    notTab: true // 不在标签页中展示
  }
}
export { baseRoutes, NOT_FOUND_ROUTE, LOGIN }
