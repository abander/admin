export default {
  path: 'functions',
  sort: 2,
  meta: {
    title: '功能模块'
  },
  redirect: '/functions/apiManage',
  children: [
    // 码表-》管理api
    {
      path: 'apiManage',
      name: 'apiManage',
      component: () => import('@/views/api-manage/index.vue'),
      meta: {
        title: 'api管理'
      }
    },
    {
      path: 'user',
      name: 'User',
      component: () => import('@/views/user/index.vue'),
      meta: {
        title: '用户管理',
        notMenu: false
      }
    },
    {
      path: 'articleList',
      name: 'articleList',
      component: () => import('@/views/article/index.vue'),
      meta: {
        title: '文章管理'
      }
    },
    {
      path: 'socket-online',
      name: 'socket-online',
      component: () => import('@/views/socket-online/socket-online.vue'),
      meta: {
        title: 'chat-online'
      }
    }
  ]
}
