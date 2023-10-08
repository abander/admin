export default {
  path: 'learn',
  sort: 3,
  meta: {
    title: '学习模块'
  },
  redirect: '/learn/set',
  children: [
    // 原理
    // $set
    {
      path: 'set',
      name: 'set',
      component: () => import('@/views/learn/set/index.vue'),
      meta: {
        title: 'set'
      }
    },
    // v-model
    {
      path: 'v-model',
      name: 'v-model',
      component: () => import('@/views/learn/v-model/index.vue'),
      meta: {
        title: 'v-model'
      }
    },
    {
      path: 'mixins',
      name: 'mixins',
      component: () => import('@/views/learn/mixins/index.vue'),
      meta: {
        title: 'mixins'
      }
    },
    // 父子传值
    {
      path: 'props',
      name: 'props',
      component: () => import('@/views/learn/component-transfer-value/props.vue'),
      meta: {
        title: 'props'
      }
    },

    {
      path: 'model',
      name: 'model',
      component: () => import('@/views/learn/component-transfer-value/model.vue'),
      meta: {
        title: 'model'
      }
    },
    {
      path: 'slot',
      name: 'slot',
      component: () => import('@/views/learn/slot/index.vue'),
      meta: {
        title: 'slot'
      }
    }
  ]
}
