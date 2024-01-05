<template>
  <div>
    <Dialog :title="title" v-model:isShow="params.isShow" @before-close="beforeClose" @confirm="confirm">
      <el-form ref="formRef" :model="formValue" label-width="120px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formValue.name" />
        </el-form-item>
        <el-form-item label="消息组件类型" prop="componentsType">
          <el-select v-model="formValue.componentsType">
            <el-option
              v-for="item in ['message', 'messageBox', 'notification']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="消息状态类型" prop="statusType">
          <el-select v-model="formValue.statusType" class="m-2">
            <el-option
              v-for="item in ['error', 'success', 'info', 'warning']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="提示内容" prop="content">
          <el-input v-model="formValue.content" type="textarea" />
        </el-form-item>
        <el-form-item label="配置" prop="options">
          <div class="code-wrap">
            <CodeMirror v-model:value="formValue.options" />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from '@/components/dialog/index.vue'
import { computed, reactive, ref, watch } from 'vue'
import { cloneObj, objIsEmpty } from '@/utils/data.js'
import { useVModel } from '@vueuse/core'
import { addMsg, updateMsg } from '@/api/system/msgManage.js'
import CodeMirror from '@/views/components/codemirror/CodeMirror.vue'

// prop
const props = defineProps({
  editData: {
    type: Object,
    default: () => ({})
  }
})

// emit
const emits = defineEmits(['update:editData', 'getTable'])

// modal title
const title = computed(() => {
  const isEdit = !objIsEmpty(props.editData || {})
  return isEdit ? '编辑' : '新增'
})

/* form */
const formRef = ref(null)

const getFormValue = () => ({
  name: '',
  componentsType: '',
  statusType: '',
  content: '',
  options: '{}'
})
const formValue = reactive(getFormValue())

const rules = computed(() => {
  const isMsg = formValue.componentsType === 'message'
  return {
    name: [{ required: true, message: 'Please input name', trigger: 'blur' }],
    statusType: [{ required: isMsg, message: 'Please select', trigger: 'change' }],
    componentsType: [{ required: true, message: 'Please select', trigger: 'change' }],
    options: [
      {
        validator: (rule, value, callback) => {
          console.log(value)
          if (value) {
            try {
              Object.keys(JSON.parse(value))
              callback()
            } catch {
              callback(new Error('请填写对象JSON格式配置'))
            }
          } else {
            callback(new Error('请填写对象JSON格式配置'))
          }
        }
      }
    ],
    content: [{ required: true, message: 'Please input content', trigger: 'blur' }]
  }
})

// 定义modal Visible
const params = reactive({
  isShow: false
})

// 打开弹窗
const openDialog = () => {
  params.isShow = true
}
// ref用法：需要先定义在使用
defineExpose({ openDialog })

// 双向绑定 关闭弹窗使用
// 使用useVModel： 相当于computed
const editDataTemp = useVModel(props, 'editData', emits)

// 编辑
const handleEditData = (editData, isEdit) => {
  for (const [key] of Object.entries(formValue)) {
    if (key === 'auth' && !isEdit) {
      formValue[key] = 0
    } else {
      formValue[key] = isEdit ? editData[key] : ''
      if (key === 'options') {
        formValue[key] = '{}'
      }
    }
  }
}

// 关闭弹窗
const beforeClose = () => {
  editDataTemp.value = {}
}

// 编辑
watch(
  () => props.editData,
  (v) => {
    // 不为空，表示为编辑
    const isEdit = !objIsEmpty(v || {})
    handleEditData(v, isEdit)
    //flush: 'post' 相当于nextick，在dom更新之后执行 handler
  },
  { immediate: true, deep: true, flush: 'post' }
)

const confirm = async (done) => {
  if (!formRef.value) return
  const flag = await formRef.value.validate((valid) => valid)
  if (!flag) return
  const id = props.editData?._id
  const params = cloneObj(formValue)
  let api = addMsg
  if (id) {
    // 编辑
    params.id = id
    api = updateMsg
  }
  const { code, msg } = await api(params)
  if (code === 200) {
    $Message({ message: msg, type: 'success' })
    done()
    emits('getTable')
  }
}
</script>

<style>
.el-form-item__label {
  font-weight: 700;
}
.code-wrap {
  width: 100%;
  height: 100px;
  border: 1px solid #eee;
}
</style>
