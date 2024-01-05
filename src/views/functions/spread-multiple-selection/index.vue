<!--
vue 表格跨页多选

element官方文档中有两个属性row-key和reserve-selection配合使用就可以跨页多选，
首先多选肯定是要设置type="selection"，
<el-table-column
  type="selection"
  width="55"
  :reserve-selection="true"
/>

其次再el-table上加:row-key="getRowKeys"和@selection-change="handleChange"，

最后再js中
getRowKeys(row) {
  return row.id
},
handleChange(selection) {
  console.log(selection)
}，
这里的selection就是分页选中的所有项数据。
-->
<template>
  <div>
    <el-table
      border
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        label="日期"
        width="120"
        prop="date"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
    </el-table>
    <el-pagination
      v-model:current-page="currentPage"
      layout="prev, pager, next"
      :total="1000"
    />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const currentPage = ref(1)
const pageSize = ref(10)
const totalData = ref(
  Array.from({ length: 1000 }, (_, index) => {
    return {
      date: '2016-05-03',
      id: index,
      name: '王小虎' + index
      }
  })
)

const tableData = computed(() => {
  return totalData.value.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})

const getRowKeys = (row) => {
  return row.id
}

const handleChange = (selection) => {
  console.log(selection)
}
</script>

<!--vue2写法-->
<!--
<template>
  <div>
    <el-table
      border
      :data="tableData"
      :row-key="getRowKeys"
      @selection-change="handleChange"
    >
      <el-table-column
        type="selection"
        width="55"
        :reserve-selection="true"
      />
      <el-table-column
        label="日期"
        width="120"
        prop="date"
      />
      <el-table-column
        prop="name"
        label="姓名"
        width="120"
      />
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      layout="prev, pager, next"
      :total="1000"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      totalData: Array.from({ length: 1000 }, (_, index) => {
        return {
          date: '2016-05-03',
          id: index,
          name: '王小虎' + index
        }
      })
    }
  },
  computed: {
    tableData () {
      const { currentPage, totalData, pageSize } = this
      return totalData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
      )
    }
  },
  methods: {
    getRowKeys (row) {
      return row.id
    },
    handleChange (selection) {
      console.log(selection)
    }
  }
}
</script>-->
