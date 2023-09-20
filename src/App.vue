<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import setGlobalVar from '@/utils/global.js'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 挂载全局变量
setGlobalVar()
</script>

<style scoped></style>
