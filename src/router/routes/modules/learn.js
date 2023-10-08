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
      component: () => import('@/views/principle/set/index.vue'),
      meta: {
        title: 'set'
      }
    },
    // v-model
    {
      path: 'v-model',
      name: 'v-model',
      component: () => import('@/views/principle/v-model/index.vue'),
      meta: {
        title: 'v-model'
      }
    },
    {
      path: 'mixins',
      name: 'mixins',
      component: () => import('@/views/practice/mixins/index.vue'),
      meta: {
        title: '练习'
      }
    },
    // 父子传值
    {
      path: 'props',
      name: 'props',
      component: () => import('@/views/practice/component-transfer-value/props.vue'),
      meta: {
        title: 'props'
      }
    },

    {
      path: 'model',
      name: 'model',
      component: () => import('@/views/practice/component-transfer-value/model.vue'),
      meta: {
        title: 'model'
      }
    },
    {
      path: 'slot',
      name: 'slot',
      component: () => import('@/views/practice/slot/index.vue'),
      meta: {
        title: 'slot'
      }
    }
  ]
}
