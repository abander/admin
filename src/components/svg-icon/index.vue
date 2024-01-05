<template>
  <el-tooltip effect="dark" :disabled="!tooltip" :content="tooltip" placement="top">
    <div class="box-item" @click="handleClick">
      <svg
        :class="['icon-color', 'pointer', disabled ? 'icon-disabled' : '']"
        aria-hidden="true"
        :style="{ '--icon-color': color || '#5386ed', ...style }"
      >
        <use :xlink:href="`#${code}`" />
      </svg>
    </div>
  </el-tooltip>
</template>

<script setup>
import { iconProps } from './defineIcon'
const props = defineProps(iconProps)

const emits = defineEmits(['handleClick'])
const handleClick = () => {
  emits('handleClick')
}
</script>

<style scoped lang="scss">
.icon-color {
  use {
    fill: var(--icon-color) !important;
  }

  height: 26px;
  width: 26px;
}
.box-item {
  display: flex;
  align-items: center;
}
.icon-disabled {
  cursor: not-allowed !important;
  use {
    fill: #606266 !important;
  }
}
</style>
