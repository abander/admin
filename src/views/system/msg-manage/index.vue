<template>
  <div class="api-manage-view">
    <el-card class="card-content">
      <el-form ref="formRef" :model="formValue" :inline="true" size="small">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formValue.keyword" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button type="primary" @click="reset">清空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="add">新增</el-button>
    </el-card>
    <el-card class="card-content">
      <el-table class="table" :data="tableData" v-loading="loading" size="small">
        <el-table-column type="expand">
          <template #default="{ row }">
            <div class="display-options">
              <CodeMirror :value="row.options" :readonly="true" />
            </div>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <div class="action-warp">
              <el-popconfirm class="remove-m-l" title="Are you sure to delete this?" @confirm="handleDel(row)">
                <template #reference>
                  <el-button link type="primary" size="small">删除</el-button>
                </template>
              </el-popconfirm>
              <el-button class="remove-m-l" link type="primary" size="small" @click="handelEdit(row)">编辑</el-button>
              <el-button class="remove-m-l" link type="primary" size="small" @click="handelSendMsg(row)">触发</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:current-page="pageState.page"
        v-model:page-size="pageState.size"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        v-model:total="pageState.total"
        small
      />
    </el-card>
    <View ref="view" v-model:edit-data="editData" @get-table="getTableData"></View>
  </div>
</template>

<script setup>
import View from './modal/view/index.vue'
import { getMsg, updateMsg, addMsg, delMsg } from '@/api/system/msgManage'
import useTable from '@/hook/useTable.js'
import { ref } from 'vue'
import useSendMsg from './useSendMsg'
import CodeMirror from '@/views/components/codemirror/CodeMirror.vue'

const { handelSendMsg } = useSendMsg()
// form value
const formValue = ref({
  keyword: ''
})

// form ref  清空时使用
const formRef = ref()
const view = ref()

// table column
const columns = ref([
  { prop: 'name', label: '名称', width: 150 },
  { prop: 'componentsType', label: '消息组件类型', width: 120 },
  { prop: 'statusType', label: '消息状态类型', width: 120 },
  { prop: 'content', label: '提示内容', width: 80 },
  { prop: 'updateTime', label: '更新时间', width: 180 }
])

// 清空
const reset = () => {
  if (!formRef.value) return
  formRef.value?.resetFields()
}

// 表格
const options = {
  request: getMsg,
  extReqData: formValue
}
const { tableData, loading, pageState, getTableData } = useTable(options)

// 新增
const add = () => {
  view.value.openDialog()
}

// 编辑
const editData = ref({})
const handelEdit = (row) => {
  editData.value = row
  view.value.openDialog()
}

// 删除
const handleDel = async (row) => {
  const { code, msg } = await delMsg(row._id)
  if (code === 200) {
    getTableData()
    $Message({ message: msg, type: 'success' })
  } else {
    $Message({ message: msg, type: 'error' })
  }
}
</script>

<style lang="scss">
.api-manage-view {
  .card-content {
    margin: 10px;
    .table {
      margin-bottom: 10px;
    }
  }
  .display-options {
    width: 100%;
    padding: 16px;
    height: 250px;
  }
  .action-warp {
    display: flex;
    flex-wrap: wrap;
    .remove-m-l {
      margin-left: 6px;
    }
  }
}
</style>
