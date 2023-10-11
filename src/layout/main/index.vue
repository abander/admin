<template>
  <el-tabs
    v-model="activeTabName"
    type="border-card"
    class="main-tabs"
    @tab-remove="handleRemove"
    @tab-click="handleSwitchRoute"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.index"
      :label="item.title"
      :name="item.index"
      :closable="handleisClose(item)"
    >
      {{ item.title }}
      <router-view />
    </el-tab-pane>
  </el-tabs>
</template>

<script setup>
import useMain from './useMain.js'
import useTab from '@/layout/main/useTab.js'

const props = defineProps({
  activeTabNameProp: {
    type: String,
    default: 'home'
  },
  editableTabsProp: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['activeTabNameEdit', 'editableTabsEdit'])

const {} = useTab()

const { activeTabName, editableTabs, handleisClose, handleRemove, handleSwitchRoute } = useMain(props, emits)
</script>
<style lang="scss" scoped>
.main-tabs {
  .el-tabs--border-card .el-tabs__content {
    padding: 0;
  }
  .el-tabs--border-card > .el-tabs__content {
    padding: 0px;
  }
  .el-tabs__content {
    padding: 0 !important;
  }
}
.main-tabs > .el-tabs__content {
  background-color: brown;
  padding: 0 !important;
}
</style>
