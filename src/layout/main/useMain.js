import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export default function useArchive(props, emits) {
  const router = useRouter()
  const activeTabName = ref('')
  const editableTabs = ref([])

  editableTabs.value = props.editableTabsProp

  const handleRemove = (tabPaneName) => {
    let tempArr = editableTabs.value
    let eleIndex = editableTabs.value.findIndex((item) => item.index == tabPaneName)
    //上一个路由的index
    let routeIndex
    for (let p in tempArr) {
      if (tempArr[p].index == tabPaneName) {
        routeIndex = tempArr[p - 1].index
      }
    }
    //高亮和退到前一个路由
    activeTabName.value = routeIndex
    router.push('/' + routeIndex)
    //删除当前关闭的路由标签
    editableTabs.value.splice(eleIndex, 1)

    emits('activeTabNameEdit', activeTabName.value)
    emits('editableTabsEdit', editableTabs.value)
  }

  //点击切换tab标签，切换组件
  const handleSwitchRoute = (tabsPaneContext) => {
    let tabPaneName = tabsPaneContext.paneName
    //处理一个特殊情况，首页的index 为 '' ，这里取得值为0
    if (tabPaneName == 0) {
      tabPaneName = ''
    }
    router.push('/' + tabPaneName)
  }

  const handleisClose = (item) => {
    if (item.index == 'home') {
      return false
    }
    return true
  }

  watch(
    () => props.activeTabNameProp,
    (v) => {
      v && (activeTabName.value = v)
    },
    { immediate: true }
  )
  return {
    activeTabName,
    editableTabs,
    handleRemove,
    handleSwitchRoute,
    handleisClose
  }
}
