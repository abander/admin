<!--
前提：table可校验且左右两边都是固定列，校验在左边、中间，校验文字过长需要设置提示样式为 position: static;为自动撑开表格列
问题：固定列表格 固定列与不固定列有校验且校验提示过长时 当输入完成时 不固定列的列不会自动缩回原来的高度
复现问题：把校验数据中 formData 的 trigger：'change' 改为 trigger: 'blur'
解决问题：把校验数据中 formData 的 trigger：'blur' 改为 trigger: 'change'
-->
<template>
  <div class="fixed-table">
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
      style="width: 60%; margin-top:10px"
      size="small"
    >
      <el-table
        border
        :data="formData.tableData"
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="id"
          label="id"
          width="300"
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
          fixed
          prop="sex"
          label="sex"
          width="300"
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
          width="180"
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
          width="300"
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
          width="300"
          label="操作"
          fixed="right"
        >
          <template>
            <el-button size="small">
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
      { id: '', sex: '', name: '', address: '' },
      { id: '', sex: '', name: '', address: '' },
      { id: '', sex: '', name: '', address: '' }
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

/*async doLayout (scope, fixed) {
    await this.$nextTick()
    setTimeout(() => {
      const domId = scope.column.id
      const targetIndex = scope.$index
      const tableDOM = this.$refs['k-table-com-edit'].$el
      // 右边固定列高度
      const fixRow = tableDOM.querySelectorAll('.el-table__fixed .el-table__fixed-body-wrapper tbody tr')[targetIndex]
      // 右边
      const fixRowRight = tableDOM.querySelectorAll('.el-table__fixed-right .el-table__fixed-body-wrapper tbody tr')[targetIndex]
      // 中间
      const targetRow = tableDOM.querySelectorAll('.el-table__body-wrapper tbody tr')[targetIndex]

      const fixCellDOM = fixRow.querySelectorAll(`td.${domId}`)
      const fixCellDOMRight = fixRowRight.querySelectorAll(`td.${domId}`)
      const targetCellDOM = targetRow.querySelectorAll(`td.${domId}`)
      /!*  const height = targetRow.getBoundingClientRect().height
      console.log(height, 'height') *!/
      if (targetCellDOM[0].children[0] && fixCellDOM[0].children[0] && fixCellDOMRight[0].children[0]) {
        // 右边不固定列同步两边固定列高度
        if (fixed === 'right') {
          console.log(targetCellDOM[0].children[0], 'targetCellDOM[0].children[0].innerHTML')
          fixCellDOM[0].children[0].innerHTML = targetCellDOM[0].children[0].innerHTML
          fixCellDOMRight[0].children[0].innerHTML = targetCellDOM[0].children[0].innerHTML
        } else {
          // 左边固定列同步中间以及右边固定列
          targetCellDOM[0].children[0].innerHTML = fixCellDOM[0].children[0].innerHTML
          fixCellDOMRight[0].children[0].innerHTML = fixCellDOM[0].children[0].innerHTML
        }
      }
    }, 500)
  },*/
</script>
<style lang="scss">
.fixed-table{
  .el-form-item__error {
    position: static;
  }
  .el-form-item--small.el-form-item {
    margin-bottom: 0
  }
}

</style>

<!--vue2写法-->
<!--<template>
  <div class="fixed-table">
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
      style="width: 60%; margin-top:10px"
      size="small"
    >
      <el-table
        border
        :data="formData.tableData"
        style="width: 100%"
      >
        <el-table-column
          fixed
          prop="id"
          label="id"
          width="300"
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
          fixed
          prop="sex"
          label="sex"
          width="300"
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
          width="180"
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
          width="300"
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
          width="300"
          label="操作"
          fixed="right"
        >
          <template>
            <el-button size="small">
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
  name: 'index',
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
          { id: '', sex: '', name: '', address: '' },
          { id: '', sex: '', name: '', address: '' },
          { id: '', sex: '', name: '', address: '' }
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
    }
  }
}
</script>
<style lang="scss">
.fixed-table{
  .el-form-item__error {
    position: static;
  }
  .el-form-item&#45;&#45;small.el-form-item {
    margin-bottom: 0
  }
}

</style>-->
