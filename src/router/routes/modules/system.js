export default {
  path: 'system',
  sort: 1,
  meta: {
    title: '系统管理'
  },
  redirect: '/system/theme',
  children: [
    {
      path: 'theme',
      name: 'theme',
      component: () => import('@/views/fn/theme/index.vue'),
      meta: {
        title: '主题'
      }
    }
  ]
}
