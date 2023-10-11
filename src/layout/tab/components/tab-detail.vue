<template>
  <div ref="tabRef" class="flex h-full pr-18px" :class="[isChromeMode ? 'items-end' : 'items-center']">
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

<style scoped lang="scss"></style>
