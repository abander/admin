export default {
  path: 'components',
  sort: 4,
  meta: {
    title: '组件'
  },
  redirect: '/components/button',
  // 嵌套路由
  children: [
    // 组件示例
    {
      path: 'button',
      name: 'button',
      component: () => import('@/views/components/button/index.vue'),
      meta: {
        title: 'button'
      }
    },
    {
      path: 'container',
      name: 'container',
      component: () => import('@/views/components/container/index.vue'),
      meta: {
        title: 'container'
      }
    },
    {
      path: 'dialog',
      name: 'dialog',
      component: () => import('@/views/components/dialog/index.vue'),
      meta: {
        title: 'dialog'
      }
    },
    {
      path: 'tree',
      name: 'tree',
      component: () => import('@/views/components/tree/index.vue'),
      meta: {
        title: 'tree'
      }
    },
    {
      path: 'upload',
      name: 'upload',
      component: () => import('@/views/components/upload/index.vue'),
      meta: {
        title: '上传'
      }
    },
    // 合并组件  弹出框形式
    {
      path: 'merge-box',
      name: 'merge-box',
      component: () => import('@/views/components/merge-box/index.vue'),
      meta: {
        title: '合并组件'
      }
    },
    // 合并组件 简便测试形式
    {
      path: 'simple-merge-box',
      name: 'simple-merge-box',
      component: () => import('@/views/components/simple-merge-box/index.vue'),
      meta: {
        title: '合并组件简便'
      }
    }
  ]
}
