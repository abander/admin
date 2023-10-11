<!--编辑规则参数弹出框组件-->
<template>
  <div class="parameter-edit">
    <Dialog-box
      v-model:visible="isShow"
      title="测试"
      width="500px"
      :loading="loading"
      :is-check="isCheck"
      @handleSave="parameterVisibleConfirm('parameterFormRef')"
      @handleCancel="parameterVisibleCancel('parameterFormRef')"
    >
      <div slot="content">
        <el-form
          ref="parameterFormRef"
          v-loading="loadingParamet"
          :inline="true"
          :rules="parameterFormRules"
          :model="parameterForm"
          size="mini"
          label-position="right"
          label-width="100px"
        >
          <el-row :gutter="20">
            <el-col v-for="(item, index) in paramDetailsData" :key="index" :span="24">
              <el-form-item
                v-if="item.vcIsshowFlag === '1' && item.vcControlType !== 'PLATE_SELECT'"
                class="form-margin"
                :label="`${item.vcIndexParamName}：`"
                :prop="item.vcIndexParamCode"
              >
                <el-input
                  v-if="item.vcControlType === 'TEXT' && item.vcIsshowFlag === '1'"
                  v-model.trim="parameterForm[item.vcIndexParamCode]"
                  class="parameter-form"
                  placeholder="请输入内容"
                  maxlength="200"
                  @keyup.native="
                    parameterForm[item.vcIndexParamCode] = parameterForm[item.vcIndexParamCode].replace(/\s+/g, '')
                  "
                />

                <!--                            日期-->
                <el-date-picker
                  v-if="item.vcControlType === 'DATE' && item.vcIsshowFlag === '1'"
                  v-model="parameterForm[item.vcIndexParamCode]"
                  class="parameter-form"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                />

                <!--      单选select        -->
                <el-select
                  v-if="item.vcControlType === 'SELECT' && item.vcIsshowFlag === '1'"
                  v-model="parameterForm[item.vcIndexParamCode]"
                  class="parameter-form"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="items in item.options || []"
                    :key="items.value"
                    :label="items.label"
                    :value="items.label"
                  />
                </el-select>

                <!--多选-->
                <el-select
                  v-if="item.vcControlType === 'SELECT-MULT' && item.vcIsshowFlag === '1'"
                  v-model="parameterForm[item.vcIndexParamCode]"
                  class="parameter-form"
                  multiple
                  placeholder="请选择"
                >
                  <el-option
                    v-for="itemss in item.options || []"
                    :key="itemss.value"
                    :label="itemss.label"
                    :value="itemss.label"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </Dialog-box>
  </div>
</template>

<script>
/*vue3写法*/
import DialogBox from '../../../../components/dialog-box/index.vue'
export default {
  name: 'Index',
  // components:{DialogBox}, /*vue3写法*/
  props: {
    // 显隐
    parameterEditShow: {
      type: Boolean,
      default: false
    },
    // 参数form表单数据
    parameterDatas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // loading
      loading: false,
      // 是否校验
      isCheck: true,
      // loading
      loadingParamet: false,
      // rules
      parameterFormRules: {},
      // form
      parameterForm: {},
      // 参数form表单数据
      paramDetailsData: [],
      // 下拉框调接口需要用的
      vcCode: ''
    }
  },
  computed: {
    // 显隐
    isShow: {
      get() {
        return this.parameterEditShow
      },
      set(v) {
        this.$emit('update:parameterEditShow', v)
      }
    }
  },
  watch: {
    // 回显的数据
    parameterDatas: {
      handler(val) {
        if (val) {
          this.paramDetailsData = this.clone(val)
          this.setParameterFormEcho(this.paramDetailsData)
        }
      },
      deep: true
    }
  },
  methods: {
    // 参数form表单回显
    setParameterFormEcho(paramDetailsData) {
      if (paramDetailsData.length) {
        // vcIsshowFlag为0的时候，会取上一次form的值，在这里清空
        this.parameterForm = {}
        paramDetailsData.forEach((item) => {
          // 动态设置form里面的key 和v-model对应
          if (item.vcControlType === 'SELECT-MULT') {
            // 多选是数组的时候
            if (
              item.vcAnalysisParamDefault &&
              Array.isArray(item.vcAnalysisParamDefault) &&
              item.vcAnalysisParamDefault.length
            ) {
              const vcAnalysisParamDefaultString = item.vcAnalysisParamDefault.join(',')
              const vcAnalysisParamDefaultMult = vcAnalysisParamDefaultString.split(',')
              this.$set(this.parameterForm, item.vcIndexParamCode, vcAnalysisParamDefaultMult)
              this.selectChange()
            } else {
              // 多选是字符串的时候 新添加的就是字符串
              const vcAnalysisParamDefaultMult = item.vcAnalysisParamDefault && item.vcAnalysisParamDefault.split(',')
              this.$set(this.parameterForm, item.vcIndexParamCode, vcAnalysisParamDefaultMult)
              this.selectChange()
            }
          } else if (item.vcControlType === 'SELECT') {
            this.$set(this.parameterForm, item.vcIndexParamCode, item.vcAnalysisParamDefault)
            this.selectChange()
          } else {
            if (item.vcIsshowFlag === '1') {
              this.$set(this.parameterForm, item.vcIndexParamCode, item.vcAnalysisParamDefault)
            } else {
              // 为0的时候value设置为null，保存的时候key直接删掉
              this.$set(this.parameterForm, item.vcIndexParamCode, null)
            }
          }
          // 给form加校验
          const { trigger, message, required } = this.getFormItemRule(
            item.vcControlType,
            item.vcIndexParamName,
            item.vcIsrequired
          )
          this.parameterFormRules[item.vcIndexParamCode] = [{ required, trigger, message }]
        })
      }
    },
    // 参数下拉框option接口
    selectChange() {
      for (let i = 0; i < this.paramDetailsData.length; i++) {
        if (
          this.paramDetailsData[i].vcControlType === 'SELECT-MULT' ||
          this.paramDetailsData[i].vcControlType === 'SELECT'
        ) {
          /*
          // 调下拉框的接口
          const indexsetParamInfoList = [
            {
              vcIndexsetParamCode: 'itemId',
              vcIndexsetParamType: this.paramDetailsData[i].vcAnalysisParamType,
              vcIndexsetParamDefault: this.paramDetailsData[i].vcParamtypeValueFrom
            }
          ]
          getExcIndexSetTrialCopy({
            indexsetParamInfoList: this.clone(indexsetParamInfoList),
            vcIndexsetId: '123',
            pageNo: 1,
            pageSize: 100
          }).then(res => {
            const optionsData = res.data.tableResultSet.tableData.map(item => {
              return Object.assign({}, {
                label: item.subItemName,
                value: item.subItemCode
              })
            })
            // 对默认值value转换对应的label显示在下拉框中
            this.convertSelect(this.paramDetailsData[i], optionsData)
            // 设置给paramDetailsData参数中有selct的数据options
            this.$set(this.paramDetailsData[i], 'options', optionsData)
          })*/
          let tableData = []
          if (this.paramDetailsData[i].vcIndexParamCode === 'codes2') {
            tableData = [
              { subItemCode: '100001001', subItemName: '普通股' },
              { subItemCode: '100001002', subItemName: '优先股' },
              { subItemCode: '100001003', subItemName: '非上市交易证券' },
              { subItemCode: '100001004', subItemName: '合订证券' },
              { subItemCode: '100002001', subItemName: '开放式基金' },
              { subItemCode: '100002002', subItemName: '封闭式基金' },
              { subItemCode: '100003000', subItemName: '债券' },
              { subItemCode: '100003001', subItemName: '短期融资券' },
              { subItemCode: '100003002', subItemName: '金融债' },
              { subItemCode: '100003003', subItemName: '普通可转债' },
              { subItemCode: '100003004', subItemName: '分离交易可转债' },
              { subItemCode: '100003005', subItemName: '央行票据' },
              { subItemCode: '100003006', subItemName: '企债' },
              { subItemCode: '100003007', subItemName: '国债' },
              { subItemCode: '100003008', subItemName: '资产支持证券' },
              { subItemCode: '100003010', subItemName: '信用风险缓释凭证' },
              { subItemCode: '100003013', subItemName: '存款证' },
              { subItemCode: '100003021', subItemName: '信用联结票据' },
              { subItemCode: '100003022', subItemName: '可交换公司债券' },
              { subItemCode: '100003023', subItemName: '标准化票据' },
              { subItemCode: '100003024', subItemName: '置换票据' },
              { subItemCode: '100004001', subItemName: '权证' },
              { subItemCode: '100004002', subItemName: '牛熊证' },
              { subItemCode: '100004003', subItemName: '股票挂钩票据' },
              { subItemCode: '100004004', subItemName: '供股权' },
              { subItemCode: '100004005', subItemName: '权利' },
              { subItemCode: '100004006', subItemName: '界内证' },
              { subItemCode: '100005007', subItemName: '利率期货' },
              { subItemCode: '100007001', subItemName: '股票指数' },
              { subItemCode: '100007002', subItemName: '基金指数' },
              { subItemCode: '100007003', subItemName: '债券指数' },
              { subItemCode: '100007004', subItemName: '其他指数' },
              { subItemCode: '100007005', subItemName: '商品指数' },
              { subItemCode: '100008001', subItemName: '回购利率' },
              { subItemCode: '100008002', subItemName: '同业拆借利率' },
              { subItemCode: '100008003', subItemName: '利率互换' },
              { subItemCode: '100009001', subItemName: '限定性券商理财产品' },
              { subItemCode: '100009002', subItemName: '非限定性券商理财产品' },
              { subItemCode: '100009003', subItemName: '保险投资产品' },
              { subItemCode: '100009004', subItemName: '企业年金养老金产品' },
              { subItemCode: '100009005', subItemName: '券商专项产品' },
              { subItemCode: '100009006', subItemName: '定向资管产品' },
              {
                subItemCode: '100009007',
                subItemName: '基础建设及不动产投资计划'
              },
              { subItemCode: '100009008', subItemName: '基金子公司产品' },
              { subItemCode: '100009009', subItemName: '互联网金融产品' },
              { subItemCode: '100009010', subItemName: '债券质押报价式回购' },
              { subItemCode: '100009011', subItemName: '券商收益凭证' },
              { subItemCode: '100009013', subItemName: '基金公司专户产品' },
              { subItemCode: '100009014', subItemName: '期货公司产品' },
              { subItemCode: '100009015', subItemName: '养老保障产品' },
              { subItemCode: '100010001', subItemName: '人民币银行理财产品' },
              { subItemCode: '100010002', subItemName: '外币银行理财产品' },
              { subItemCode: '100010003', subItemName: '银行收藏品' },
              { subItemCode: '100011001', subItemName: '贷款投资信托产品' },
              { subItemCode: '100011002', subItemName: '房地产投资信托产品' },
              { subItemCode: '100011003', subItemName: '股权投资信托产品' },
              { subItemCode: '100011004', subItemName: '黄金投资信托产品' },
              { subItemCode: '100011005', subItemName: '权益投资信托产品' },
              { subItemCode: '100011006', subItemName: '外汇投资信托产品' },
              { subItemCode: '100011007', subItemName: '债权投资信托产品' },
              { subItemCode: '100011008', subItemName: '证券投资信托产品' },
              { subItemCode: '100011009', subItemName: '其他投资信托产品' },
              { subItemCode: '100011010', subItemName: '单一资金信托产品' },
              { subItemCode: '100011011', subItemName: '融资租赁信托产品' },
              { subItemCode: '100011012', subItemName: '组合投资信托产品' },
              { subItemCode: '100014001', subItemName: '企债回购' },
              { subItemCode: '100014002', subItemName: '国债回购' },
              { subItemCode: '100014003', subItemName: '买断式回购' },
              { subItemCode: '100016001', subItemName: '其他' },
              { subItemCode: '100017001', subItemName: '股票期权' },
              { subItemCode: '100017002', subItemName: '指数期权' },
              { subItemCode: '100017004', subItemName: 'ETF期权' },
              { subItemCode: '100017005', subItemName: '商品期权' },
              { subItemCode: '100017006', subItemName: '货币期权' },
              { subItemCode: '703001001', subItemName: '贵金属' },
              { subItemCode: '703001002', subItemName: '有色' },
              { subItemCode: '703001003', subItemName: '煤焦钢矿' },
              { subItemCode: '703001004', subItemName: '非金属建材' },
              { subItemCode: '703001005', subItemName: '能源' },
              { subItemCode: '703001006', subItemName: '化工' },
              { subItemCode: '703001007', subItemName: '谷物' },
              { subItemCode: '703001008', subItemName: '油脂油料' },
              { subItemCode: '703001009', subItemName: '软商品' },
              { subItemCode: '703001010', subItemName: '农副产品' },
              { subItemCode: '703002000', subItemName: '指数类' },
              { subItemCode: '703003000', subItemName: '利率类' },
              { subItemCode: '703007001', subItemName: '跨品种套利' },
              { subItemCode: '703007002', subItemName: '跨期套利' }
            ]
          } else if (this.paramDetailsData[i].vcIndexParamCode === 'tradeDate2') {
            tableData = [
              { subItemCode: 'A', subItemName: 'A股' },
              { subItemCode: 'B', subItemName: 'B股' },
              { subItemCode: 'HK', subItemName: '港股' },
              { subItemCode: 'US', subItemName: '美股' }
            ]
          } else if (this.paramDetailsData[i].vcIndexParamCode === 'codes3') {
            tableData = [
              { subItemCode: '1', subItemName: '集合' },
              { subItemCode: '2', subItemName: '单一' },
              { subItemCode: '3', subItemName: '专项' },
              { subItemCode: '4', subItemName: '公募基金' },
              { subItemCode: '5', subItemName: 'QDII' },
              { subItemCode: '6', subItemName: '社保基金' },
              { subItemCode: '7', subItemName: 'ETF基金' },
              { subItemCode: '8', subItemName: 'ETF联接基金' }
            ]
          }
          const optionsData = tableData.map((item) => {
            return Object.assign(
              {},
              {
                label: item.subItemName,
                value: item.subItemCode
              }
            )
          })
          // 对默认值value转换对应的label显示在下拉框中
          this.convertSelect(this.paramDetailsData[i], optionsData)
          // 设置给paramDetailsData参数中有selct的数据options
          this.$set(this.paramDetailsData[i], 'options', optionsData)
        }
      }
    },
    // 对默认值value转换对应的label显示在下拉框中
    convertSelect({ vcControlType, vcAnalysisParamDefault, vcIndexParamCode }, optionsData) {
      // 分别对下拉框单选、多选做处理
      if (vcControlType === 'SELECT') {
        // 找到对应的label
        // 新增的时候默认值是value，点击设置默认值是label
        const value = optionsData.find((v) =>
          v.value === vcAnalysisParamDefault ? v.value === vcAnalysisParamDefault : v.label === vcAnalysisParamDefault
        )?.label
        // 给form里面的key进行重写赋值(label)   只有新增的时候会赋值label
        if (value) {
          this.$set(this.parameterForm, vcIndexParamCode, value)
        }
      } else {
        // 多选的时候 新增的时候默认值是value字符串需要转数组 点击设置的时候是label是数组
        let vcAnalysisParamDefaultSplit = null
        if (vcAnalysisParamDefault && Array.isArray(vcAnalysisParamDefault) && vcAnalysisParamDefault.length) {
          vcAnalysisParamDefaultSplit = vcAnalysisParamDefault
        } else {
          vcAnalysisParamDefaultSplit = vcAnalysisParamDefault.split(',')
        }
        let value = []
        value = vcAnalysisParamDefaultSplit.map((item) => {
          return optionsData.find((v) => (v.value === item ? v.value === item : v.label === item))?.label
        })
        if (value) {
          this.$set(this.parameterForm, vcIndexParamCode, value)
        }
      }
    },
    // 参数 校验
    getFormItemRule(type, name, req) {
      let trigger = 'blur'
      const required = req === '1' // 处理required
      switch (
        type // 处理blur、change类型
      ) {
        case 'SELECT-MULT':
          trigger = 'change'
          break
        case 'SELECT':
          trigger = 'change'
          break
        default:
          break
      }
      // 处理 message
      const message = `请${trigger === 'change' ? '选择' : '输入'}${name}`
      return { trigger, message, required }
    },
    // 参数 取消按钮  公司在环境上面
    parameterVisibleCancel(formName) {
      this.$refs[formName].resetFields()
      this.parameterIndex = null
      this.isShow = false
    },
    // 校验
    checkFormFn(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate((valid) => {
          resolve(valid)
        })
      })
    },
    // 参数 确定按钮
    async parameterVisibleConfirm(formName) {
      const flag = await this.checkFormFn(formName)
      if (flag) {
        this.isShow = false
        // 显示表格里面需要字符串类型
        let str = ''
        for (const i in this.parameterForm) {
          if (Array.isArray(this.parameterForm[i])) {
            const objCopy = { ...this.parameterForm[i] }
            for (const i in objCopy) {
              str += objCopy[i] + ','
            }
          } else {
            // 当参数不显示时为null 过滤掉
            if (this.parameterForm[i] !== null) {
              str += this.parameterForm[i] + ','
            } else {
              // 为null的value，key删除
              this.$delete(this.parameterForm, i)
            }
          }
        }
        str = str.slice(0, str.length - 1)
        // 触发父组件 确定的时候把数据放到表格里
        this.$emit('parameter-data', this.parameterForm, str)
      } else {
        return false
      }
    },
    // clone方法
    clone(target) {
      let result
      if (Array.isArray(target)) {
        result = []
        target.forEach((item) => {
          result.push(this.clone(item))
        })
      } else if (typeof target === 'object' && target !== null) {
        result = {}
        for (const key in target) {
          if (Object.hasOwnProperty.call(target, key)) {
            result[key] = this.clone(target[key])
          }
        }
      } else {
        result = target
      }
      return result
    }
  }
}
</script>

<style scoped lang="scss">
.form-margin {
  width: 100%;
  /*/deep/.el-form-item__label{
    margin-right: 5px !important;
  }
  /deep/.el-form-item__content{
    width: calc(100% - 120px) !important;
    .parameter-form{
      width: 100%;
    }
  }*/
  /*vue3写法*/
  :deep.el-form-item__label {
    margin-right: 5px !important;
  }
  :deep.el-form-item__content {
    width: calc(100% - 120px) !important;
    .parameter-form {
      width: 100%;
    }
  }
}
</style>
