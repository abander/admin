<template>
  <!-- 左侧菜单栏 -->
  <el-menu
    background-color="#000000d9"
    class="el-menu-vertical"
    :default-active="tabStore.activeTabKey"
    unique-opened
    text-color="#fff"
  >
    <template v-for="item in menus">
      <!-- 两级菜单 -->
      <template v-if="item.children">
        <el-sub-menu :key="item.name" :index="item.index">
          <!-- 一级菜单标题 -->
          <template #title>
            <el-icon><document /></el-icon>
            <span>{{ item.name }}</span>
          </template>
          <!-- 二级菜单标题 -->
          <template v-for="subItem in item.children" :key="subItem.index">
            <el-menu-item :index="subItem.index" @click="() => handleMenuItem(subItem)">{{
              subItem.name
            }}</el-menu-item>
          </template>
        </el-sub-menu>
      </template>

      <!-- 一级菜单 -->
      <template v-else>
        <el-menu-item :key="item.index" :index="item.index" @click="() => handleMenuItem(item)">
          <el-icon><document /></el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script setup>
import useMenu from './useMenu.js'
import { useTabStore } from '@/stores/tab/index.js'
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import { computed, ref } from 'vue'
import ls from '@/utils/localStorage'

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
const tabStore = useTabStore()

const menus = computed(() => tabStore.menus)
const emits = defineEmits(['activeTabNameMenu', 'editableTabsMenu'])
console.log(menus)
const { asideMenu, handleMenuItem } = useMenu(props, emits)
</script>

<style lang="scss" scoped>
.el-menu-vertical {
  border-right: none;
  :deep(.el-menu-item:hover) {
    background-color: #ecf5ff95;
  }
}
</style>
