<template>
  <div>
    <div>
      <el-table ref="table" :data="tableData" border style="width: 100%">
        <el-table-column prop="index" label="序号" width="150">
          <template #default="scope">
            <div>{{ scope.$index + 1 }}</div>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in againRender"
          :key="index"
          :width="item.width"
          :prop="item.prop"
          show-overflow-tooltip
          :label="item.label"
        ></el-table-column>
      </el-table>
    </div>
    <div class="dsadas">
      <new-checkbox :all-item-data="itemList" :change-props="changeProps" />
    </div>
  </div>
</template>
<script>
import axios from 'axios'
// 采用异步加载,防止父组件引入子组件，子组件的的钩子函数全部执行完毕
const newCheckbox = () => ({
  component: import('./components/checkBox.vue'),
  delay: 2000,
  timeout: 2000,
})
export default {
  name: 'Index',
  components: { newCheckbox },
  data() {
    return {
      tableData: [],
      againRender: [],
      itemList: [
        {
          allListDate: [
            // 后台数据结构跟这有一样
            { label: '姓名', width: '120', prop: 'name' },
            { label: '性别', width: '120', prop: 'sex' },
            { prop: 'age', label: '年龄', width: '120' },
            { prop: 'styChild', label: '身份', width: '120' },
            { prop: 'gradeClass', label: '学历', width: '200' },
          ],
          selectedList: [
            { label: '姓名', width: '120', prop: 'name' },
            { label: '性别', width: '120', prop: 'sex' },
            { prop: 'age', label: '年龄', width: '120' },
          ],
        },
      ],
    }
  },
  mounted() {
    this.getElementVauleHieen()
  },
  methods: {
    changeProps(value) {
      this.$nextTick((_) => {
        this.againRender = value
        this.$refs.table.doLayout
      })
    },
    getElementVauleHieen() {
      axios.get('http://localhost:3000/elementVauleHieen').then((res) => {
        this.tableData = res.data
      })
    },
  },
}
</script>
<style></style>
