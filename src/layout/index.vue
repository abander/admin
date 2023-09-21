<template>
  <div class="layout">
    <el-container class="layout-content">
      <div
        style="
          width: 210px;
          overflow: hidden;
          flex: 0 0 210px;
          max-width: 210px;
          min-width: 210px;
          transition: all 0.2s ease 0s;
        "
      ></div>
      <!-- 左侧菜单栏 -->
      <el-aside class="layout-aside">
        <div class="layout-aside-children">
          <div class="layout-aside-logo">VUE-ADMIN</div>
          <div class="layout-aside-menu">
            <Menu
              :active-tab-name-prop="activeTabName"
              :editable-tabs-prop="editableTabs"
              @activeTabNameMenu="activeTabNameMenu"
              @editableTabsMenu="editableTabsMenu"
            ></Menu>
          </div>
        </div>
      </el-aside>

      <el-container class="layout-container">
        <!-- header头部菜单 -->
        <el-header class="layout-container-header">
          <Header></Header>
        </el-header>

        <!-- 主体模块：标签页 + 当前路由内容 -->
        <el-main class="layout-container-main">
          <Tab />
          <div class="container">
            <el-card class="c-card">
              <router-view></router-view>
            </el-card>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { Document, Menu as IconMenu, Location, Setting } from '@element-plus/icons-vue'
import Menu from './menu/index.vue'
import Header from './header/index.vue'
import Main from './main/index.vue'
import Tab from './tab/index.vue'
/*import { ref } from 'vue'
//当前选项卡
const activeTabName = ref('')
//需要显示的标签数组
const editableTabs = ref([])*/

import { ref } from 'vue'
//当前选项卡
const activeTabName = ref('home')
//需要显示的标签数组
const editableTabs = ref([{ title: '首页', index: 'home' }])

const activeTabNameEdit = (e) => {
  activeTabName.value = e
}
const editableTabsEdit = (e) => {
  editableTabs.value = e
}

const activeTabNameMenu = (e) => {
  activeTabName.value = e
}
const editableTabsMenu = (e) => {
  editableTabs.value = e
}
</script>

<style scoped lang="scss">
.layout {
  display: flex;
  width: 100%;
  min-height: 100%;
  flex-direction: column;
  background: #f0f2f5;
  .layout-content {
    min-height: 100%;
    flex-direction: row;
    display: flex;
    flex: auto;
    background: #f0f2f5;
    .layout-aside {
      flex: 0 0 210px;
      max-width: 210px;
      min-width: 210px;
      width: 210px;
      position: fixed;
      top: 0;
      left: 0;
      height: 100%;
      z-index: 510;
      background: #001529;
      transition: all 0.2s;
      overflow: hidden;
      .layout-aside-children {
        height: 100%;
        margin-top: -0.1px;
        padding-top: 0.1px;
        .layout-aside-logo {
          height: 32px;
          line-height: 32px;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          transition: all 0.5s;
          text-align: center;
          padding: 10px;
        }
        .layout-aside-menu {
          height: calc(100% - 48px);
          position: relative;
          overflow: auto;
          width: 100%;
        }
      }
    }
    .layout-container {
      width: 0;
      margin-left: 1px;
      display: flex;
      flex: auto;
      flex-direction: column;
      min-height: 0;
      background: #f0f2f5;
      .layout-container-header {
        padding: 0;
        height: 58px;
        :deep(.el-menu--horizontal) {
          justify-content: flex-end; /* 将消息中心和我的控制台摆放在最右侧 */
          border-bottom: none; /* 去除默认的边框样式 */
        }
      }
      .layout-container-main {
        background-color: #e9eef3;
        --el-main-padding: 0px;
      }
    }
  }
}
.container {
  height: calc(100vh - 114px);
  padding: 16px;
  box-sizing: border-box;
  .c-card {
    width: 100%;
    height: 100%;
  }
}
</style>
