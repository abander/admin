<template>
  <el-menu
    class="el-menu-horizontal"
    mode="horizontal"
    background-color="#fff"
    text-color="#a6a6a6"
    active-text-color="#ffd04b"
  >
    <el-menu-item index="1" class="fr">{{
      store.getUser.username
    }}</el-menu-item>
    <el-sub-menu index="2" class="fr">
      <template #title class="fr">我的工作台</template>
      <el-menu-item index="2-1">我的消息</el-menu-item>
      <el-menu-item index="2-2">设置</el-menu-item>
      <el-menu-item index="2-3" @click="exitLogin">退出登陆</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import useHeader from './useHeader.js'
import { userStore } from '@/stores/user'
const store = userStore()

const { exitLogin } = useHeader()
</script>

<style lang="scss" scoped></style>
