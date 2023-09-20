export default {
  path: 'components',
  sort: 4,
  meta: {
    title: '组件'
  },
  redirect: '/components/tableCheckbox',
  // 嵌套路由
  children: [
    // todo 1.有报错
    {
      path: 'tableCheckbox',
      name: 'tableCheckbox',
      component: () => import('@/views/firm/kaiyu/haitong/table-checkbox/index.vue'),
      meta: {
        title: '表格复选框'
      }
    },
    // 合并组件  弹出框形式
    {
      path: 'mergeBox',
      name: 'mergeBox',
      component: () => import('@/views/firm/kaiyu/haitong/merge-box/index.vue'),
      meta: {
        title: '合并组件'
      }
    },
    // 合并组件 简便测试形式
    {
      path: 'versionsFirst',
      name: 'versionsFirst',
      component: () => import('@/views/firm/kaiyu/haitong/merge-box/components/versions-first/index.vue'),
      meta: {
        title: 'versionsFirst'
      }
    },
    // todo 1.有报错
    {
      path: 'dynamicForm',
      name: 'dynamicForm',
      component: () => import('@/views/firm/kaiyu/haitong/parameter-edit/index.vue'),
      meta: {
        title: 'dynamicForm'
      }
    },
    // 组件示例
    {
      path: 'button',
      name: 'button',
      component: () => import('@/views/c-example/button/index.vue'),
      meta: {
        title: 'button'
      }
    },
    {
      path: 'container',
      name: 'container',
      component: () => import('@/views/c-example/container/index.vue'),
      meta: {
        title: 'container'
      }
    },
    {
      path: 'dialog',
      name: 'dialog',
      component: () => import('@/views/c-example/dialog/index.vue'),
      meta: {
        title: 'dialog'
      }
    },
    {
      path: 'tree',
      name: 'tree',
      component: () => import('@/views/c-example/tree/index.vue'),
      meta: {
        title: 'tree'
      }
    },
    {
      path: 'upload',
      name: 'upload',
      component: () => import('@/views/c-example/upload/index.vue'),
      meta: {
        title: '上传'
      }
    },
    {
      path: 'pdf',
      name: 'pdf',
      component: () => import('@/views/fn/pdf/index.vue'),
      meta: {
        title: 'pdf'
      }
    },
    // 地图
    {
      path: 'gaoDe',
      name: 'gaoDe',
      component: () => import('@/views/map/gaoDe/index.vue'),
      meta: {
        title: '高德地图'
      }
    },
    // 导入和导出
    {
      path: 'uploadAndDownload',
      name: 'uploadAndDownload',
      component: () => import('@/views/fn/upload-and-download/index.vue'),
      meta: {
        title: '导入和导出'
      }
    }
  ]
}
