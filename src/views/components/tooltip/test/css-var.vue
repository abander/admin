<!--为做el-tooltip组件动态样式做示例-->
<template>
  <div class="hhhh">
    <span class="ww">QQ</span>
  </div>
</template>

<script setup>
import utilsCreateStyle from '@/utils/create-style.js'
import { onMounted, ref } from 'vue'

const hh = ref('red')

onMounted(() => {
  fn()
})

const { createStyle } = utilsCreateStyle()
const fn = () => {
  createStyle(
    'idq',
    `.ww {
        --color: red;
    }`
  )
}
</script>

<style lang="scss">
.hhhh {
  .ww {
    color: var(--color);
  }
}
</style>
