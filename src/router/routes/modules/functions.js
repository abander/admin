export default {
  path: 'functions',
  sort: 2,
  meta: {
    title: '功能模块'
  },
  redirect: '/functions/table-checkbox',
  children: [
    // todo 1.有报错
    {
      path: 'table-checkbox',
      name: 'table-checkbox',
      component: () => import('@/views/functions/table-checkbox/index.vue'),
      meta: {
        title: '表格复选框'
      }
    },
    {
      path: 'pdf',
      name: 'pdf',
      component: () => import('@/views/functions/pdf/index.vue'),
      meta: {
        title: 'pdf'
      }
    },
    // 地图
    {
      path: 'gaoDe',
      name: 'gaoDe',
      component: () => import('@/views/functions/map/gaoDe/index.vue'),
      meta: {
        title: '高德地图'
      }
    },
    // 导入和导出
    {
      path: 'upload-and-download',
      name: 'upload-and-download',
      component: () => import('@/views/functions/upload-and-download/index.vue'),
      meta: {
        title: '导入和导出'
      }
    },
    // todo 1.有报错
    {
      path: 'dynamicForm',
      name: 'dynamicForm',
      component: () => import('@/views/functions/parameter-edit/index.vue'),
      meta: {
        title: 'dynamicForm'
      }
    },
    // 表格跨页多选
    {
      path: 'spread-multiple-selection',
      name: 'spread-multiple-selection',
      component: () => import('@/views/functions/spread-multiple-selection/index.vue'),
      meta: {
        title: '表格跨页多选'
      }
    },
    // vxe虚拟滚动 实现 自动滚动

    {
      path: 'autoScrollTable',
      name: 'autoScrollTable',
      component: () => import('@/views/functions/auto-scroll-table/index.vue'),
      meta: {
        title: 'autoScrollTable'
      }
    },
  ]
}
