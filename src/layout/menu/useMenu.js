import { ref } from 'vue'
import { useRouter } from 'vue-router';
export default function useArchive(props, emits) {
  // 左侧菜单选项配置
  const asideMenu = ref([
    {
      title: '用户',
      index: 'user',
    },
    {
      title: '文章',
      subs: [
        {
          title: '文章列表',
          index: 'articleList',
        },
      ],
    },
    {
      title: '测试',
      index: 'test',
    },
    {
      title: '地图',
      subs: [
        {
          title: '高德地图',
          index: 'gaoDe',
        },
      ],
    },
    {
      title: '练习',
      subs: [
        {
          title: 'mixins',
          index: 'mixins',
        },
        {
          title: '父子传值',
          index: 'props',
        },
        {
          title: 'v-model',
          index: 'model',
        },
        {
          title: '插槽',
          index: 'slot',
        },
      ],
    },
    {
      title: '功能',
      subs: [
        {
          title: '导入导出',
          index: 'uploadAndDownload',
        },
        {
          title: 'pdf',
          index: 'pdf',
        },
        {
          title: '主题',
          index: 'theme',
        },
        {
          title: 'tableCheckbox',
          index: 'tableCheckbox',
        },
        {
          title: '合并组件-弹出框形式',
          index: 'mergeBox',
        },
        {
          title: '合并组件-简便测试形式',
          index: 'versionsFirst',
        },
        {
          title: 'dynamicForm',
          index: 'dynamicForm',
        },
      ],
    },
    {
      title: '原理',
      subs: [
        {
          title: 'set',
          index: 'set',
        },
        {
          title: 'v-model',
          index: 'v-model',
        },
      ],
    },
    {
      title: '组件',
      subs: [
        {
          title: 'button',
          index: 'button',
        },
        {
          title: 'container',
          index: 'container',
        },
        {
          title: 'dialog',
          index: 'dialog',
        },
        {
          title: 'tree',
          index: 'tree',
        },
        {
          title: 'upload',
          index: 'upload',
        },
      ],
    },
  ])
  const router = useRouter()
  const activeTabName = ref('')
  const editableTabs = ref([])

  activeTabName.value = props.activeTabNameProp
  editableTabs.value = props.editableTabsProp

  //点击二级菜单标题 和 没有下一级菜单的标题
  //添加显示的标签
  const handleMenuItem = (obj) => {
    console.log(obj);
    const {menu: { routePath }} = obj
    router.push('/' + routePath)
  }

  return {
    asideMenu,
    handleMenuItem,
  }
}
