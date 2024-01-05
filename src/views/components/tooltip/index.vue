<template>
  <div>
<!-- 功能1：可以为不同的tooltip设置独一无二的样式   -->
    <div>
      <h4>功能1：可以为不同的tooltip设置独一无二的样式</h4>
      <Tooltip
        content="哈哈哈"
        placement="top"
        :custom="{
        '--b-width': '5px',
        '--b-s': '0px 3px 8px 0px #96de84'
      }"
      >
        <el-button> top </el-button>
      </Tooltip>
      <Tooltip
        content="哈哈哈"
        placement="top"
        :custom="{
        '--b-width': '4px',
        '--b-s': '0px 3px 8px 0px red'
      }"
      >
        <el-button> top </el-button>
      </Tooltip>
    </div>
  </div>
</template>

<script setup>
import Tooltip from '@/components/tooltip/tooltip.vue'
</script>

<style scoped></style>
