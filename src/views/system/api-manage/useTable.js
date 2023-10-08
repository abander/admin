import { onMounted, ref, watch, reactive } from 'vue'
import { ElMessage } from 'element-plus'

/**
 * @desc table 统一请求hook
 * @param options
 */
export default function useTable(options) {
  //       接口，    form表单数据，      返回数据处理，      是否显示错误信息，    是否在mounted中调，      节流时间
  const {
    request,
    extReqData = {},
    handleResponseData,
    showErrMsg = true,
    immediately = true,
    updateDelay = 100
  } = options || {}

  // 当前分页信息
  const pageState = reactive({
    page: 1,
    size: 10,
    total: 0
  })

  // 表格数据
  const tableData = ref([])

  // loading
  const loading = ref(false)

  // 节流标志
  const triggerFlag = ref(false)

  // 获取数据 TODO: 未做表格头部筛选处理
  const getTableData = async () => {
    // 节流
    if (triggerFlag.value) return
    triggerFlag.value = true
    setTimeout(() => {
      triggerFlag.value = false
    }, updateDelay)

    // 参数处理
    try {
      const params = {
        ...pageState,
        ...extReqData.value
      }

      loading.value = true
      // 发送请求
      const { code, data, message = '请求错误！', total } = await request(params)
      if (code === 200) {
        console.log(total, data, 'to')
        // 额外处理返回数据
        handleResponseData && handleResponseData(data)
        tableData.value = data
        pageState.total = total
      } else {
        // 展示接口返回错误
        showErrMsg && message && ElMessage.error(message)
      }
    } catch (e) {
      console.log(`----- ${request} failed ----- error: ${e}`)
    } finally {
      loading.value = false
    }
  }
  // 分页信息改变，重新请求, 注意 分页组件需要使用v-model绑定size与page才能出发
  watch(
    () => [pageState.page, pageState.size],
    async () => {
      await getTableData()
    }
  )

  // 是否初始化加载
  onMounted(async () => {
    if (immediately) await getTableData()
  })

  return {
    pageState,
    tableData,
    getTableData,
    loading
  }
}
