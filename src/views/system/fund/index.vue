<template>
  <div class="fund-wrap" style="height: 100%">
    <p style="margin-bottom: 20px; display: flex; justify-content: space-between">
      <vxe-button @click="toAdd" status="primary" icon="vxe-icon-add">新增</vxe-button>
      <vxe-button @click="fundStore.getSaveFunds" status="success" icon="vxe-icon-add">刷新</vxe-button>
    </p>
    <div style="height: calc(100% - 54px)">
      <vxe-table
        border
        height="100%"
        :loading="fundStore.loading"
        :row-config="{ isHover: true, isCurrent: true }"
        :sort-config="{ multiple: true, trigger: 'cell' }"
        :data="tableData"
      >
        <vxe-column type="seq" width="60"></vxe-column>
        <vxe-column field="name" title="Name" sortable></vxe-column>
        <vxe-column field="rate" title="Rate" sortable>
          <template #default="{ row }">
            <el-tag :type="row.rate && row.rate.includes('-') ? 'success' : 'error'" class="mx-1" effect="dark">
              {{ row.rate }}
              <span style="font-size: 14px">%</span>
            </el-tag>
          </template>
        </vxe-column>
        <vxe-column field="updateTime" title="updateTime" sortable></vxe-column>
        <vxe-column title="操作" width="60">
          <template #default="{ row }">
            <vxe-button
              type="text"
              :loading="addLoading"
              icon="vxe-icon-delete"
              status="danger"
              @click="add({ isAdd: true, FundCode: row.code })"
            ></vxe-button>
          </template>
        </vxe-column>
      </vxe-table>
    </div>
    <Modal v-model:visible="modalState.show">
      <div style="height: 100%">
        <div class="search" style="margin: 10px 0 20px">
          <el-input
            v-model="key"
            @keydown.enter="search(key)"
            clearable
            placeholder="Please input"
            @clear="search(null)"
          >
            <template #prepend>
              <el-button :icon="Search" />
            </template>
            <template #append>
              <el-button type="primary" @click="search(key)"> 搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="table" style="height: calc(100% - 62px)">
          <vxe-table
            border
            show-overflow
            height="100%"
            :row-config="{ isHover: true, isCurrent: true }"
            :data="filterData"
            :scroll-y="{ enabled: true }"
          >
            <vxe-column type="seq" width="100"></vxe-column>
            <vxe-column field="FundCode" title="Code"></vxe-column>
            <vxe-column field="FundName" title="Name" sortable></vxe-column>
            <vxe-column title="操作" width="180">
              <template #default="{ row }">
                <vxe-button status="primary" :loading="addLoading" size="mini" @click="add(row)">
                  {{ check(row) ? '移除' : '添加' }}
                </vxe-button>
              </template>
            </vxe-column>
          </vxe-table>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, reactive } from 'vue'
import { useFundStore } from '../../../stores/fund'
import Modal from '../../../components/Modal'
import { cloneDeep, isEmpty } from 'lodash-es'
import { Search } from '@element-plus/icons-vue'
import { userStore } from '../../../stores/user'
import { updateSaveFundsApi } from '../../../api/system/fund'
import { ElMessage } from 'element-plus'

const fundStore = useFundStore()
const tableData = computed(() => {
  return fundStore.saveFunds
})
let timer = null

// add
const modalState = reactive({
  show: false,
  data: []
})
const toAdd = () => {
  modalState.show = true
}
const filterData = ref(fundStore.allFunds)
const key = ref()
const search = (key) => {
  if (isEmpty(key)) return (filterData.value = cloneDeep(fundStore.allFunds))
  filterData.value = cloneDeep(fundStore.allFunds).filter((item) => (item.FundName + item.FundCode).includes(key))
}
const check = (row) => {
  row.isAdd = !!fundStore.saveFunds.find((v) => v.code === row.FundCode)
  console.log(row)
  return row.isAdd
}

const addLoading = ref(false)
const user = userStore()
const add = async (row) => {
  console.log(row)
  const type = row.isAdd ? 'remove' : 'add'
  const params = {
    type,
    code: row.FundCode,
    username: user.user.username
  }
  try {
    addLoading.value = true
    const { code, message, data } = await updateSaveFundsApi(params)
    if (code === 200) {
      ElMessage.success(type)
      row.isAdd = !row.isAdd
      fundStore.getSaveFunds()
    } else {
      ElMessage.error(message || type + ' failed')
    }
  } catch (e) {
    console.log(e)
    ElMessage.error(' failed')
  } finally {
    addLoading.value = false
  }
}
function init() {
  fundStore.getSaveFunds()
  timer = setInterval(() => {
    fundStore.getSaveFunds()
  }, 600000)
}
onMounted(init)
onBeforeUnmount(() => {
  window.clearInterval(timer)
})
</script>

<style lang="scss" scoped>
:deep(.el-tag__content) {
  font-size: 16px;
}
</style>
