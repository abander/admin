// createRouter用来新建路由实例，createWebHashHistory用来配置我们内容使用hash的模式（也就是路径上会通过#来区分）
import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/login/login.vue'),
    meta: {
      title: '登录',
      hide: true // 不在menus中展示
    }
  },
  {
    path: '/',
    name: 'Layout',
    component: () => import('../layout/index.vue'),
    // 嵌套路由
    children: [
      // {
      //   // 这里不设置值，是把main作为默认页面
      //   path: '',
      //   redirect: '/home',
      //   meta: {
      //     hide: true, // 不在menus中展示
      //
      //     notMenu: true, // 不在tabs中展示  未实现
      //   },
      // },
      {
        // 这里不设置值，是把main作为默认页面
        path: 'home',
        name: 'Main',
        component: () => import('../views/main/index.vue'),
        meta: {
          title: '首页',
          hide: true
        }
      },
      {
        path: 'user',
        name: 'User',
        component: () => import('../views/user/index.vue'),
        meta: {
          title: '用户管理',
          notMenu: false
        }
      },
      {
        path: 'articleList',
        name: 'articleList',
        component: () => import('../views/article/index.vue'),
        meta: {
          title: '文章管理'
        }
      },
      {
        path: 'test',
        name: 'test',
        component: () => import('../views/test/index.vue'),
        meta: {
          title: '测试'
        }
      },
      // 地图
      {
        path: 'gaoDe',
        name: 'gaoDe',
        component: () => import('../views/map/gaoDe/index.vue'),
        meta: {
          title: '高德地图'
        }
      },
      // 练习
      // mixins练习
      {
        path: 'mixins',
        name: 'mixins',
        component: () => import('../views/practice/mixins/index.vue'),
        meta: {
          title: '练习'
        }
      },
      // 父子传值
      {
        path: 'props',
        name: 'props',
        component: () => import('../views/practice/component-transfer-value/props.vue'),
        meta: {
          title: 'props'
        }
      },

      {
        path: 'model',
        name: 'model',
        component: () => import('../views/practice/component-transfer-value/model.vue'),
        meta: {
          title: 'model'
        }
      },
      {
        path: 'slot',
        name: 'slot',
        component: () => import('../views/practice/slot/index.vue'),
        meta: {
          title: 'slot'
        }
      },
      // 功能
      // 导入和导出
      {
        path: 'uploadAndDownload',
        name: 'uploadAndDownload',
        component: () => import('../views/fn/upload-and-download/index.vue'),
        meta: {
          title: '导入和导出'
        }
      },
      {
        path: 'pdf',
        name: 'pdf',
        component: () => import('../views/fn/pdf/index.vue'),
        meta: {
          title: 'pdf'
        }
      },
      {
        path: 'theme',
        name: 'theme',
        component: () => import('../views/fn/theme/index.vue'),
        meta: {
          title: '主题'
        }
      },
      // todo 1.有报错
      {
        path: 'tableCheckbox',
        name: 'tableCheckbox',
        component: () => import('../views/firm/kaiyu/haitong/table-checkbox/index.vue'),
        meta: {
          title: '表格复选框'
        }
      },
      // 合并组件  弹出框形式
      {
        path: 'mergeBox',
        name: 'mergeBox',
        component: () => import('../views/firm/kaiyu/haitong/merge-box/index.vue'),
        meta: {
          title: '合并组件'
        }
      },
      // 合并组件 简便测试形式
      {
        path: 'versionsFirst',
        name: 'versionsFirst',
        component: () => import('../views/firm/kaiyu/haitong/merge-box/components/versions-first/index.vue'),
        meta: {
          title: 'versionsFirst'
        }
      },
      // todo 1.有报错
      {
        path: 'dynamicForm',
        name: 'dynamicForm',
        component: () => import('../views/firm/kaiyu/haitong/parameter-edit/index.vue'),
        meta: {
          title: 'dynamicForm'
        }
      },
      // 原理
      // $set
      {
        path: 'set',
        name: 'set',
        component: () => import('../views/principle/set/index.vue'),
        meta: {
          title: 'set'
        }
      },
      // v-model
      {
        path: 'v-model',
        name: 'v-model',
        component: () => import('../views/principle/v-model/index.vue'),
        meta: {
          title: 'v-model'
        }
      },
      // 组件示例
      {
        path: 'button',
        name: 'button',
        component: () => import('../views/c-example/button/index.vue'),
        meta: {
          title: 'button'
        }
      },
      {
        path: 'container',
        name: 'container',
        component: () => import('../views/c-example/container/index.vue'),
        meta: {
          title: 'container'
        }
      },
      {
        path: 'dialog',
        name: 'dialog',
        component: () => import('../views/c-example/dialog/index.vue'),
        meta: {
          title: 'dialog'
        }
      },
      {
        path: 'tree',
        name: 'tree',
        component: () => import('../views/c-example/tree/index.vue'),
        meta: {
          title: 'tree'
        }
      },
      {
        path: 'upload',
        name: 'upload',
        component: () => import('../views/c-example/upload/index.vue'),
        meta: {
          title: '上传'
        }
      },
      // 码表-》管理api
      {
        path: 'apiManage',
        name: 'apiManage',
        component: () => import('../views/api-manage/index.vue'),
        meta: {
          title: 'api管理'
        }
      }
    ],
    meta: {
      notMenu: true
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export { routes }
export default router
