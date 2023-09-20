<template>
  <div ref="tabRef" class="flex h-full pr-18px" :class="[isChromeMode ? 'items-end' : 'items-center']">
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
    <!--    <div ref="tabsRef" class="tab-panel">-->
    <!--      <div-->
    <!--        v-for="item in tab.tabs"-->
    <!--        :key="item.fullPath"-->
    <!--        class="tab-item"-->
    <!--        :class="tab.activeTab === item.fullPath ? 'tab-active' : null"-->
    <!--        @click="tab.handleClickTab(item.fullPath)"-->
    <!--      >-->
    <!--        <span class="item-dot"></span>-->
    <!--        <span class="name">{{ item.meta.title }}</span>-->
    <!--        <i-->
    <!--          class="iconfont icon-close"-->
    <!--          @click.stop="tab.removeTab(item.fullPath)"-->
    <!--        ></i>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { useTabStore } from '@/stores/tab'

const emit = defineEmits(['scroll'])
const tab = useTabStore()

const isChromeMode = true

// 获取当前激活的tab的clientX
const tabRef = ref()
async function getActiveTabClientX() {
  await nextTick()
  if (tabRef.value && tabRef.value.children.length && tabRef.value.children[tab.activeTabIndex]) {
    const activeTabElement = tabRef.value.children[tab.activeTabIndex]
    const { x, width } = activeTabElement.getBoundingClientRect()
    const clientX = x + width / 2
    setTimeout(() => {
      emit('scroll', clientX)
    }, 50)
  }
}

watch(
  () => tab.activeTabIndex,
  () => {
    getActiveTabClientX()
  },
  {
    immediate: true
  }
)
</script>

<style scoped lang="scss">
.tab-panel {
  // background-color: #48a148;
  box-sizing: border-box;
  height: 48px;
  display: flex;
  align-items: center;
  transition: transform 0.5s;
  flex-shrink: 0;
  .tab-item {
    flex-shrink: 0;
    cursor: pointer;
    // @include vertical-center;
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
        // color: $theme;
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
}

.tab-active {
  color: var(--el-color-primary);
}
</style>
