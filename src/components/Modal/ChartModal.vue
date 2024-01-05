<script setup lang="ts">
import { useVModel } from '@vueuse/core'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})
const emits = defineEmits(['update:visible', 'before-close'])
const visible = useVModel(props, 'visible', emits)
</script>

<template>
  <div class="chart-modal-wrap">
    <el-dialog
      class="chart-modal"
      v-model="visible"
      :width="$attrs?.width || 1120"
      v-bind="$attrs"
      @before-close="(done:Function)=>emits('before-close',done)"
    >
      <slot />
      <template #footer>
        <slot name="footer"></slot>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
@import 'style.scss';
</style>
