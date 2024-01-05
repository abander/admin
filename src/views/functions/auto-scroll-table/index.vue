<template>
  <el-button type="primary" @click="stop = !stop">{{ stop ? '停止' : '开始' }}</el-button>
  <div class="auto-scroll-table">
    <vxe-table
      border
      show-overflow
      stripe
      :row-config="{ isHover: true }"
      :data="tableData"
      height="500"
      ref="tableRef"
    >
      <vxe-column type="seq" width="100"></vxe-column>
      <vxe-column field="name" title="Name" sortable></vxe-column>
      <vxe-column field="role" title="Role"></vxe-column>
      <vxe-column field="sex" title="Sex"></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import useTableScroll from './useTableScroll'

const { tableRef, scroll, stop } = useTableScroll()
console.log(tableRef)
const tableData = ref([])

setTimeout(() => {
  // 模拟数据
  const mockList = []
  for (let index = 0; index < 2000; index++) {
    mockList.push({
      id: index,
      name: 'Test' + index,
      role: 'Developer',
      sex: '男'
    })
  }
  tableData.value = mockList
  scroll()
}, 100)
</script>

<style scoped lang="scss">
.auto-scroll-table {
  height: 500px;
  margin-top: 20px;
}
:deep(.vxe-table--body-wrapper) {
  transition: 0.1s ease;
}
</style>
