<template>
  <div class="api-manage-view">
    <el-card class="card-content">
      <el-form ref="formRef" :model="formValue" :inline="true" label-width="120px" size="small">
        <el-form-item label="关键字" prop="keyword">
          <el-input v-model="formValue.keyword" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="formValue.type" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
          <el-button type="primary" @click="reset">清空</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" size="small" @click="add">新增</el-button>
      <el-table class="table" :data="tableData" v-loading="loading" size="small">
        <el-table-column
          show-overflow-tooltip
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
        />
        <el-table-column label="auth">
          <template #default="scope">
            <span v-if="scope.row.auth === 0">{{ '否' }}</span>
            <span v-else>{{ '是' }}</span>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="120">
          <template #default="{ row }">
            <!--            <el-button link type="primary" size="small" @click="handleDel(row)">删除</el-button>-->
            <el-popconfirm title="Are you sure to delete this?" @confirm="handleDel(row)">
              <template #reference>
                <el-button link type="primary" size="small">删除</el-button>
              </template>
            </el-popconfirm>
            <el-button link type="primary" size="small" @click="handelEdit(row)">编辑</el-button>
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
import { delCommon, getCommon } from '@/api/apiManage.js'
import useTable from '@/views/api-manage/useTable.js'
import View from '@/views/api-manage/modal/view/index.vue'
import { ref } from 'vue'

// form value
const formValue = ref({
  keyword: '',
  type: ''
})

// form ref  清空时使用
const formRef = ref()
const view = ref()

// table column
const columns = ref([
  { prop: 'name', label: '名称', width: 150 },
  { prop: 'type', label: '类型', width: 80 },
  { prop: 'requestUrl', label: '请求地址', width: 200 },
  { prop: 'methods', label: '请求方法', width: 80 },
  { prop: 'params', label: 'URL请求参数', width: 100 },
  { prop: 'needKey', label: '需要KEY？', width: 80 },
  { prop: 'keyFiled', label: 'KEY字段名', width: 80 },
  { prop: 'apiKey', label: 'apiKey', width: 80 },
  // { prop: 'auth', label: 'auth', width: 80 },
  { prop: 'note', label: '备注', width: 80 },
  { prop: 'updateTime', label: '更新时间', width: 180 }
])

// 清空
const reset = () => {
  if (!formRef.value) return
  formRef.value?.resetFields()
}

// 表格
const options = {
  request: getCommon,
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
  const { code, msg } = await delCommon(row._id)
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
}
</style>
