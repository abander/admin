export default {
  path: 'system',
  sort: 1,
  meta: {
    title: '系统管理'
  },
  // 跳父路由的时候自动定位到第一个子路由（操作：在路由中只留 http://127.0.0.1:4000/admin/#/system，这时候会自动跳转到 http://127.0.0.1:4000/admin/#/system/theme）
  redirect: '/system/theme',
  children: [
    {
      path: 'theme',
      name: 'theme',
      component: () => import('@/views/system/theme/index.vue'),
      meta: {
        title: '主题'
      }
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/system/user/index.vue'),
      meta: {
        title: '用户管理',
        notMenu: false
      }
    },
    {
      path: 'article',
      name: 'article',
      component: () => import('@/views/system/article/index.vue'),
      meta: {
        title: '文章管理'
      }
    },
    // 码表-》管理api
    {
      path: 'apiManage',
      name: 'apiManage',
      component: () => import('@/views/system/api-manage/index.vue'),
      meta: {
        title: 'api管理'
      }
    },
    {
      path: 'socket-online',
      name: 'socket-online',
      component: () => import('@/views/system/socket-online/socket-online.vue'),
      meta: {
        title: 'chat-online'
      }
    }
  ]
}
