<template>
  <div class="global-tab flex-y-center w-full pl-16px">
    <!-- 前翻 -->
    <span class="home">
      <SvgIcon code="icon-home" @handleClick="router.push('/home')" />
    </span>
    <span class="prev" v-show="translateX < 0">
      <SvgIcon code="icon-Previoustrack" @handleClick="handleScroll(200)" />
    </span>
    <div class="tab-wrap" ref="tabsOutRef">
      <div ref="tabsRef" class="h-full" :style="{ transform: `translateX(${translateX}px)` }" @scroll="handleScroll">
        <el-tag
          v-for="item in tab.tabs"
          :key="item.fullPath"
          :class="tab.activeTab === item.fullPath ? 'tab-active' : null"
          class="mx-1 tag"
          effect="light"
          type="info"
          :closable="item.fullPath !== '/home'"
          size="large"
          :disable-transitions="false"
          @close="tab.removeTab(item.fullPath)"
          @click="tab.handleClickTab(item.fullPath)"
        >
          {{ item.meta.title }}
        </el-tag>
      </div>
    </div>
    <!-- 后翻 -->
    <span class="next" v-show="translateXLeftMaxVal < translateX">
      <SvgIcon code="icon-Nexttrack" @handleClick="handleScroll(-200)" />
    </span>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTabStore } from '@/stores/tab'
import SvgIcon from '@/components/svg-icon'
import pdf from '@/views/fn/pdf/index.vue'

const route = useRoute()
const router = useRouter()
const tab = useTabStore()

// 设置最大tab-width
const maxTabTitleWidth = 121
const maxTitleWidthCss = maxTabTitleWidth + 'px'
const tabsOutRef = ref(null) // 外侧容器对象
const tabsRef = ref(null) // 实际容器大小
const translateX = ref(0)
const translateXLeftMaxVal = ref(0)

const containerPadding = computed(() => {
  const showPrev = translateX.value < 0
  let padding = '0 40px 0 70px'
  if (!showPrev) {
    padding = '0 40px 0 40px'
  }
  return padding
})

const moveToView = (index) => {
  console.log(tabsRef.value)
  const itemDom = tabsRef.value?.children[index]
  if (!itemDom) {
    return
  }
  const boxWidth = tabsOutRef.value ? tabsOutRef.value.clientWidth : 0
  const contentWidth = tabsRef.value ? tabsRef.value.clientWidth : 0
  const itemOffsetLeft = itemDom.offsetLeft
  const itemClientWidth = itemDom.clientWidth + 1
  console.log(boxWidth, contentWidth)
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
    translateX.value = -(itemOffsetLeft - (boxWidth - itemClientWidth)) - 10
  }
}

const handleScroll = (offset) => {
  const boxWidth = tabsOutRef.value ? tabsOutRef.value.clientWidth : 0
  const contentWidth = tabsRef.value ? tabsRef.value.clientWidth : 0
  console.log(4444, offset, contentWidth, boxWidth)

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

function init() {
  tab.iniTabStore(route)
}

watch(
  () => route.fullPath,
  () => {
    if (!route.meta.notTab) {
      tab.addTab(route)
      tab.setActiveTab(route.fullPath)
      // 滚动到当前activetab
      nextTick(() => {
        const findIndex = tab.tabs.findIndex((s) => s.fullPath === route.fullPath)
        const index = findIndex === -1 ? 0 : findIndex
        moveToView(index || 0)
      })
    }
  }
)

// 初始化
init()
</script>

<style scoped lang="scss">
.global-tab {
  height: 42px;
  border: 1px solid #eeeeee;
  background-color: #fafafa;
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
}

.el-tab-close {
  box-sizing: border-box;
  font-size: 16px;
  // border: solid 1px red;
  width: 44px;
}
.global-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
  width: 100%;
  display: flex;
  //padding: 0 40px 0 70px;
  padding: v-bind(containerPadding);
  box-sizing: border-box;
  .flex-1-hidden {
    flex: 1;
    overflow: hidden;
  }
  position: relative;
  .prev {
    position: absolute;
    left: 35px;
    top: 50%;
    transform: translateY(-50%);
  }
  .home {
    position: absolute;
    left: 2px;
    top: 50%;
    transform: translateY(-50%);
  }
  .next {
    position: absolute;
    right: 7px;
    top: 50%;
    transform: translateY(-50%);
  }
}
.tag {
  color: #333;
  cursor: pointer;
  font-weight: 500;
  &:hover {
    color: var(--el-color-primary);
  }
}
.mx-1 {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.h-full {
  height: 100%;
  display: flex;
  align-items: center;
  transition: transform 0.5s;
  flex-shrink: 0;
}

.tab-active {
  color: var(--el-color-primary);
}

.tab-wrap {
  width: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
}
</style>
