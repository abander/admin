<template>
  <div class="global-tab flex-y-center w-full pl-16px">
    <div ref="bsWrapper" class="flex-1-hidden h-full">
      <better-scroll ref="bsScroll" :options="{ scrollX: true, scrollY: false, click: canClick }">
        <tab-detail @scroll="handleScroll" />
      </better-scroll>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useElementBounding } from '@vueuse/core'
import { useTabStore } from '@/stores/tab'
import BetterScroll from './components/better-scroll.vue'
import TabDetail from '@/layout/tab/components/tab-detail.vue'

// defineOptions({ name: 'GlobalTab' });

const route = useRoute()
const tab = useTabStore()
const deviceInfo = { device: 9 }

const bsWrapper = ref()
const { width: bsWrapperWidth, left: bsWrapperLeft } = useElementBounding(bsWrapper)

const bsScroll = ref()

const canClick = Boolean(deviceInfo.device.type)

function handleScroll(clientX) {
  const currentX = clientX - bsWrapperLeft.value
  const deltaX = currentX - bsWrapperWidth.value / 2
  if (bsScroll.value) {
    const { maxScrollX, x: leftX } = bsScroll.value.instance
    const rightX = maxScrollX - leftX
    const update = deltaX > 0 ? Math.max(-deltaX, rightX) : Math.min(-deltaX, -leftX)
    bsScroll.value?.instance.scrollBy(update, 0, 300)
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
    }
  }
)

// 初始化
init()
</script>

<style scoped lang="scss">
.global-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
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
      //@include vertical-center;
      color: #515a6e;
      border: 1px solid #e8eaec !important;
      border-radius: 2px;
      box-sizing: border-box;
      height: 100%;
      margin-right: 4px;
      // 垂直水平居中
      display: flex;
      align-items: center;
      justify-content: center;
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
          color: red;
        }
      }

      .name {
        display: inline-block;
        margin: 0 12px;
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
  width: 44px;
}
.global-tab {
  box-shadow: 0 1px 2px rgb(0 21 41 / 8%);
  //flex-y-center w-full pl-16px
  width: 100%;
  display: flex;
  .flex-1-hidden {
    flex: 1;
    overflow: hidden;
  }
}
</style>
