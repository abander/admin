<!--
前提：可编辑表格 带校验
问题：当全部校验时 先把第二行输入完成 校验提示此时不显示了 然后在点击第二行的删除 此时可以看到第三行本该显示校验提示不显示了
复现问题：把校验数据中 formData 的 trigger：'change' 改为 trigger: 'blur'
解决问题：把校验数据中 formData 的 trigger：'blur' 改为 trigger: 'change'
-->
<template>
  <div class="check-table">
    <el-button
      size="small"
      type="primary"
      @click="submitForm('formRef')"
    >
      校验
    </el-button>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formData.rules"
      style="margin-top:10px"
      size="small"
    >
      <el-table
        border
        :data="formData.tableData"
      >
        <el-table-column
          prop="id"
          label="id"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.id'"
              :rules="formData.rules.id"
            >
              <el-input v-model="scope.row.id" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="sex"
          label="sex"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.sex'"
              :rules="formData.rules.sex"
            >
              <el-input v-model="scope.row.sex" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="name"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.name'"
              :rules="formData.rules.name"
            >
              <el-input v-model="scope.row.name" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="address"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' +scope.$index + '.address'"
              :rules="formData.rules.address"
            >
              <el-input v-model="scope.row.address" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="btn(scope)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>

<script setup>
import {reactive, ref} from 'vue'

const formData = reactive  ({
  rules: {
    id: {
      required: true,
      message: '请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id',
      trigger: 'change'
    },
    sex: {
      required: true,
      message: '请输入sex',
      trigger: 'change'
    },
    address: {
      required: true,
      message: '请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址',
      trigger: 'change'
    }
  },
  tableData: [
    { id: '', sex: '', name: '1', address: '' },
    { id: '', sex: '', name: '2', address: '' },
    { id: '', sex: '', name: '3', address: '' }
  ]
})
const formRef = ref(null)

const submitForm = (formEl) =>{
  formEl.validate((valid) => {
    if (valid) {
      alert('submit!')
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

const btn = (scope)=>{
  this.formData.tableData = this.formData.tableData.filter(item => item.name !== scope.row.name)
  console.log(this.formData.tableData, 'scope')
}
</script>

<style lang="scss">
.check-table{
  .el-form-item__error {
    position: static;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0
  }
}

</style>

<!--vue2写法-->
<!--
<template>
  <div class="check-table">
    <el-button
      size="small"
      type="primary"
      @click="submitForm('formRef')"
    >
      校验
    </el-button>

    <el-form
      ref="formRef"
      :model="formData"
      :rules="formData.rules"
      style="margin-top:10px"
      size="small"
    >
      <el-table
        border
        :data="formData.tableData"
      >
        <el-table-column
          prop="id"
          label="id"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.id'"
              :rules="formData.rules.id"
            >
              <el-input v-model="scope.row.id" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="sex"
          label="sex"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.sex'"
              :rules="formData.rules.sex"
            >
              <el-input v-model="scope.row.sex" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="name"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' + scope.$index + '.name'"
              :rules="formData.rules.name"
            >
              <el-input v-model="scope.row.name" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          prop="address"
          label="address"
        >
          <template slot-scope="scope">
            <el-form-item
              :prop="'tableData.' +scope.$index + '.address'"
              :rules="formData.rules.address"
            >
              <el-input v-model="scope.row.address" />
            </el-form-item>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              @click="btn(scope)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'KTableCom',
  data () {
    return {
      formData: {
        rules: {
          id: {
            required: true,
            message: '请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id请输入id',
            trigger: 'change'
          },
          sex: {
            required: true,
            message: '请输入sex',
            trigger: 'change'
          },
          address: {
            required: true,
            message: '请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址请输入地址',
            trigger: 'change'
          }
        },
        tableData: [
          { id: '', sex: '', name: '1', address: '' },
          { id: '', sex: '', name: '2', address: '' },
          { id: '', sex: '', name: '3', address: '' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    btn (scope) {
      this.formData.tableData = this.formData.tableData.filter(item => item.name !== scope.row.name)
      console.log(this.formData.tableData, 'scope')
    }
  }
}
</script>
<style lang="scss">
.check-table{
  .el-form-item__error {
    position: static;
  }
  .el-form-item&#45;&#45;small.el-form-item {
    margin-bottom: 0
  }
}

</style>
-->
