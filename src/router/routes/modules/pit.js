export default {
  path: 'pit',
  sort: 6,
  meta: {
    title: '踩坑模块'
  },
  redirect: '/pit/check-table',
  children: [
    {
      path: 'check-table',
      name: 'check-table',
      component: () => import('@/views/pit/check-table/index.vue'),
      meta: {
        title: '校验表格'
      }
    },
    {
      path: 'fixed-table',
      name: 'fixed-table',
      component: () => import('@/views/pit/fixed-table/index.vue'),
      meta: {
        title: '固定列表格'
      }
    }
  ]
}
