<template>
  <div>
    <Dialog :title="title"  v-model:isShow="params.isShow" @before-close="beforeClose" @confirm="confirm">
      <el-form
          ref="formRef"
          :model="formValue"
          :inline="true"
          label-width="120px"
          size="small"
          :rules="rules"
      >
        <el-form-item label="名称" prop="name">
          <el-input v-model="formValue.name" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="formValue.type" />
        </el-form-item>
        <el-form-item label="请求地址" prop="requestUrl">
          <el-input v-model="formValue.requestUrl" />
        </el-form-item>
        <el-form-item label="请求方法" prop="methods">
          <el-input v-model="formValue.methods" />
        </el-form-item>
        <el-form-item label="需要KEY？" prop="needKey">
          <el-input v-model="formValue.needKey" />
        </el-form-item>
        <el-form-item label="KEY字段名" prop="keyFiled">
          <el-input v-model="formValue.keyFiled" />
        </el-form-item>
        <el-form-item label="apiKey" prop="apiKey">
          <el-input v-model="formValue.apiKey" />
        </el-form-item>
        <el-form-item label="auth" prop="auth">
          <el-input-number v-model="formValue.auth" />
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input type="textarea" v-model="formValue.note" />
        </el-form-item>
        <el-form-item label="URL请求参数" prop="params">
          <el-input type="textarea" v-model="formValue.params" />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import Dialog from "@/components/dialog/index.vue";
import {computed, reactive, ref, watch} from "vue";
import {cloneObj, objIsEmpty} from "@/utils/data.js";
import {useVModel} from "@vueuse/core";
import {addCommonApi, updateCommonApi} from "@/api/apiManage.js";


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
const title = computed(()=>{
    const isEdit = !objIsEmpty(props.editData || {})
    return isEdit ? '编辑' : '新增'
})

/* form */
const formRef = ref(null)

const formValue = reactive({
  name: '',
  type: '',
  requestUrl: '',
  methods: '',
  params: '',
  needKey: '',
  keyFiled: '',
  apiKey: '',
  auth: 0,
  note: ''
})

const rules = {
  name: [
    { required: true, message: 'Please input name', trigger: 'blur' },
  ],
  type: [
    { required: true, message: 'Please input type', trigger: 'blur' },
  ],
  requestUrl: [
    { required: true, message: 'Please input requestUrl', trigger: 'blur' },
  ],
  methods: [
    { required: true, message: 'Please input methods', trigger: 'blur' },
  ]
}

// 定义modal Visible
const params = reactive({
  isShow: false
})

// 打开弹窗
const openDialog = () => {
  params.isShow = true
}
// ref用法：需要先定义在使用
defineExpose({openDialog})

// 双向绑定 关闭弹窗使用
// 使用useVModel： 相当于computed
const editDataTemp = useVModel(props,'editData',emits)

// 编辑
const handleEditData = (editData,isEdit) => {
    for (const [key] of Object.entries(formValue)) {
      if(key === 'auth' && !isEdit){
        formValue[key] = 0
      }else{
        formValue[key] = isEdit ? editData[key] :  ''
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
    (v)=>{
      // 不为空，表示为编辑
      const isEdit = !objIsEmpty(v || {})
      handleEditData(v,isEdit)
  //flush: 'post' 相当于nextick，在dom更新之后执行 handler
},{immediate: true,deep: true,flush: 'post'})

const confirm = async(done) => {
    const addApi = await addCommonApi
    const editApi = await updateCommonApi
    if (!formRef.value) return
    const flag = await formRef.value.validate(valid => valid)
    if (!flag) return
    const id = props.editData?._id
    const params = cloneObj(formValue)
    let api = addApi
    if (id) {
      // 编辑
      params.id = id
      api = editApi
    }
    const {code, msg} = await api(params)
    if (code === 200) {
      $Message({message: msg, type: 'success'})
      done()
      emits("getTable")
    }else{
      $Message({message: msg, type: 'error'})
    }
}
</script>

<style>
.el-form-item__label {
  font-weight: 700;
}
</style>

