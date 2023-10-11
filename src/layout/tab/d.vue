<template>
  <div class="second-bar">
    <!--    <button @click="addTab">add</button>-->
    <svg
      class="home-svg"
      width="46px"
      height="46px"
      viewBox="0 0 46 46"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      @click="toHome"
    >
      <!-- Generator: Sketch 60 (88103) - https://sketch.com -->
      <title>首页</title>
      <desc>Created with Sketch.</desc>
      <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="iPhone-8-Plus" transform="translate(-37.000000, -54.000000)">
          <g id="首页" transform="translate(31.000000, 48.000000)">
            <ellipse id="椭圆形" fill="#53BDEF" cx="29.5" cy="33" rx="12.5" ry="8"></ellipse>
            <image
              x="0"
              y="0"
              width="58"
              height="58"
              xlink:href="data:image/png;base64,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"
            ></image>
          </g>
        </g>
      </g>
    </svg>
    <!--prev-icon-->
    <i v-show="translateX < 0" class="iconfont icon-quanbugongnengshouqi prev-icon" @click="handleScroll(200)"></i>
    <!--tab-->
    <div ref="tabsOutRef" class="tab-box">
      <div ref="tabsRef" class="tab-panel" :style="{ transform: `translateX(${translateX}px)` }">
        <el-tooltip
          v-for="(tab, index) in tabList"
          :key="`eps-tab-nav-${index}`"
          effect="light"
          :content="tab.meta.title"
          placement="top"
          :disabled="!tab.showToolTip"
        >
          <div
            class="tab-item"
            :class="$route.fullPath === tab.fullPath ? 'tab-active' : null"
            @click="tabItemClick(tab)"
          >
            <span class="item-dot"></span>
            <span class="name text-ellipsis">{{ tab.meta.title }}</span>
            <i class="iconfont icon-close" @click.stop="delTab(index)"></i>
          </div>
        </el-tooltip>
      </div>
    </div>
    <!--next-icon-->
    <i
      v-show="translateXLeftMaxVal < translateX"
      class="iconfont icon-quanbugongnengmoren next-icon"
      @click="handleScroll(-200)"
    ></i>

    <!--close-->
    <el-dropdown v-show="tabList.length !== 0">
      <span class="el-dropdown-link">
        <el-icon class="el-tab-close">
          <CircleCloseFilled />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="closeAllTab('all')">关闭所有</el-dropdown-item>
          <el-dropdown-item @click="closeAllTab('other')">关闭其它</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { useSecondNavStore } from '@/store/modules/secondNav'
import { checkOverFlow, deepCopy } from '@/utils/tool'
import { useCacheStore } from '@/store/modules/cache'

const cacheStore = useCacheStore()
const secondNavStore = useSecondNavStore()

const [route, router] = [useRoute(), useRouter()]

// 设置最大tab-width
const maxTabTitleWidth = 121
const maxTitleWidthCss = maxTabTitleWidth + 'px'
const tabList = ref([])
const tabsOutRef = ref(null) // 外侧容器对象
const tabsRef = ref(null) // 实际容器大小
const translateX = ref(0)
const translateXLeftMaxVal = ref(0)

// navItem - 滑动到对应位置
const moveToView = (index) => {
  const itemDom = tabsRef.value?.children[index]
  if (!itemDom) {
    return
  }
  const boxWidth = tabsOutRef.value ? tabsOutRef.value.clientWidth : 0
  const contentWidth = tabsRef.value ? tabsRef.value.clientWidth : 0
  const itemOffsetLeft = itemDom.offsetLeft
  const itemClientWidth = itemDom.clientWidth + 1

  translateXLeftMaxVal.value = boxWidth - contentWidth // 设置向左最大滚动距离

  if (contentWidth < boxWidth || itemOffsetLeft === 0) {
    // 所有item的集合长度小于box宽度或者当前是第一个item
    translateX.value = 0
  } else if (itemOffsetLeft < -translateX.value) {
    // 标签在可视区域左侧
    translateX.value = -itemOffsetLeft
  } else if (itemOffsetLeft > -translateX.value && itemOffsetLeft + itemClientWidth < -translateX.value + boxWidth) {
    // 标签在可视区域
    translateX.value = Math.min(0, boxWidth - itemClientWidth - itemOffsetLeft)
  } else {
    // 标签在可视区域右侧
    translateX.value = -(itemOffsetLeft - (boxWidth - itemClientWidth)) - 5
  }
}

const handleScroll = (offset) => {
  const boxWidth = tabsOutRef.value ? tabsOutRef.value.clientWidth : 0
  const contentWidth = tabsRef.value ? tabsRef.value.clientWidth : 0
  if (offset > 0) {
    translateX.value = Math.min(0, translateX.value + offset)
  } else {
    if (boxWidth < contentWidth) {
      if (translateX.value >= -(contentWidth - boxWidth)) {
        translateX.value = Math.max(translateX.value + offset, boxWidth - contentWidth)
      }
    } else {
      translateX.value = 0
    }
  }
}

/** ********************初始化********************** */
// 监听pina内容变化 从而初始化菜单
watch(
  () => secondNavStore.tabList,
  () => {
    initTabList()
  },
  {
    deep: true
  }
)

watch(
  () => route.fullPath,
  () => {
    const { fullPath, name, meta, query, path } = route
    const menu = {
      path,
      fullPath,
      name,
      meta: {
        ...(meta || {})
      },
      query: {
        ...(query || {})
      }
    }

    /* 设置tab-title */
    let title = menu.meta.title
    if (menu.query.key || menu.query.key === '0') {
      title = menu.meta?.title + '-' + menu.query.key
    }
    /* 设置tab-title-tooltip 暂定所有显示详细title的query字段为code*/
    if (menu.meta.showTabToolTip) {
      title = menu.meta?.title + '-' + (menu.query.code || menu.query.key)
      menu.showToolTip = checkOverFlow(title, maxTabTitleWidth)
    }
    menu.meta.title = title
    /* 设置无权限tabname */
    if (menu?.query['no-access-name']) {
      menu.meta.title = menu?.query['no-access-name']
    }
    /* 添加tabs */
    if (!menu.meta.notTab) {
      secondNavStore.addTab(menu)
      /* 滚动tab到最新 */
      nextTick(() => {
        const findIndex = secondNavStore.tabList.findIndex((s) => s.fullPath === fullPath)
        const index = findIndex === -1 ? 0 : findIndex
        moveToView(index || 0)
      })
    }
    menu.meta.alive && cacheStore.addCache(route.fullPath)
  },
  { immediate: true }
)

const initTabList = () => {
  // 从缓存内读取菜单， 初始化菜单， 深拷贝下
  tabList.value = deepCopy(secondNavStore.tabList)
}
initTabList()

const resetNavStatus = () => {
  translateX.value = 0
  translateXLeftMaxVal.value = 0
}

/** ******************** tab事件 ********************** */
const delTab = (index) => {
  cacheStore.removeCache(tabList.value[index].fullPath)
  // 如果删除的是当前选中的项，跳转到前一个， 若前一个没有 跳转到后一个，
  if (tabList.value[index].fullPath === route.fullPath) {
    // 记录地址
    const [prevIndex, nextIndex] = [index - 1, index + 1]
    let redirectPath = '/'
    // 如果前面有，跳转到前一个
    if (prevIndex !== -1) {
      redirectPath = tabList.value[prevIndex].fullPath || tabList.value[prevIndex].path
    }
    // 如果前面没有 并且后面有
    else if (prevIndex === -1 && nextIndex <= tabList.value.length && tabList.value.length !== 1) {
      redirectPath = tabList.value[nextIndex].fullPath || tabList.value[nextIndex].path
    }
    tabList.value.splice(index, 1)
    router.push(redirectPath)
  } else {
    // 直接删除
    tabList.value.splice(index, 1)
  }
  // judgeIsCanMove()
  secondNavStore.setTabList(tabList.value)
}

const closeAllTab = (type) => {
  if (type === 'all') {
    cacheStore.updateCache([])
    tabList.value = []
    router.push('/')
    nextTick(() => {
      resetNavStatus()
    })
    //
  } else if (type === 'other') {
    // 关闭当前路由之外
    const curPageTab = tabList.value.filter((tab) => tab.fullPath === route.fullPath)
    if (curPageTab) {
      tabList.value = curPageTab
      cacheStore.updateCache([curPageTab.fullPath])
      nextTick(() => {
        moveToView(1)
      })
    } else {
      tabList.value = []
      cacheStore.updateCache([])
    }
  }
  secondNavStore.setTabList(tabList.value)
}

const tabItemClick = (tab) => {
  if (route.fullPath === tab.fullPath) return
  router.push(tab.fullPath || tab.path)
}

const toHome = () => {
  if (route.path !== '/choose-prj') {
    router.push('/')
  }
}

onMounted(() => {
  $bus.busOn('cloneTabTo', (to) => {
    const current = route.fullPath
    const index = tabList.value.findIndex((tab) => current === tab.fullPath)
    if (index !== -1) {
      delTab(index)
      to && router.replace(to)
    }
  })
})
</script>

<style scoped lang="scss">
.second-bar {
  height: 46px !important;
  line-height: 46px;
  box-sizing: border-box;
  border-bottom: solid 1px $theme;
  background-color: white;
  color: #515a6e;
  padding: 0 20px;
  @include vertical-center;
  justify-content: flex-start;

  .home-svg {
    cursor: pointer;
    transform: scale(0.5);
  }

  .item-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #e8eaec;
    transition: 0.3s;
  }

  .name {
    display: inline-block;
    margin: 0 12px;
    font-size: 12px;
  }

  .iconfont {
    font-size: 12px;
  }

  .tab-active {
    .item-dot {
      background-color: $theme !important;
    }
  }

  img {
    width: 24px;
    height: 24px;
    cursor: pointer;
  }

  .prev-icon {
    cursor: pointer;
    margin-right: 8px;

    &:hover {
      color: $theme;
    }
  }

  .next-icon {
    cursor: pointer;
    margin-left: 8px;
  }

  .tab-box {
    // border: solid 1px red;
    width: calc(100% - 50px - 64px);
    display: flex;
    align-items: center;
    height: 32px;
    overflow: hidden;
    padding: 0 16px;

    .tab-panel {
      // background-color: #48a148;
      box-sizing: border-box;
      height: 32px;
      display: flex;
      align-items: center;
      transition: transform 0.5s;
      flex-shrink: 0;
      .tab-item {
        flex-shrink: 0;
        cursor: pointer;
        @include vertical-center;
        color: #515a6e;
        border: 1px solid #e8eaec !important;
        border-radius: 2px;
        box-sizing: border-box;
        height: 100%;
        margin-right: 4px;
        padding: 0 12px;

        .item-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #e8eaec;
        }

        &:hover {
          i {
            cursor: pointer;
            color: $theme;
          }
        }

        .name {
          display: inline-block;
          margin: 0 12px;
          max-width: v-bind(maxTitleWidthCss);
        }

        i {
          font-size: 12px;
        }

        .icon-close {
          font-size: 12px;
          transform: scale(0.8);
          color: #b5b5b5;
        }
      }
    }
  }

  .el-tab-close {
    box-sizing: border-box;
    font-size: 16px;
    // border: solid 1px red;
    width: 40px;
  }
}
</style>
