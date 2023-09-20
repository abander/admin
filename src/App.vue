<template>
  <router-view></router-view>
</template>

<script setup>
import setGlobalVar from '@/utils/global.js'

// 挂载全局变量
setGlobalVar()
</script>

<style scoped></style>
