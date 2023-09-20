export default {
  path: 'test',
  sort: 5,
  meta: {
    title: '测试模块'
  },
  redirect: '/test/test',
  children: [
    {
      path: 'test',
      name: 'test',
      component: () => import('@/views/test/index.vue'),
      meta: {
        title: '测试'
      }
    }
  ]
}
