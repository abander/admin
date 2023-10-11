<template>
  <div class="edit-rule-box-index">
    <el-button @click="btn">按钮</el-button>
    <Parameter-edit
      v-model:parameter-edit-show="parameterEditShow"
      :parameter-datas="parameterDatas"
      @parameter-data="parameterData"
    >
    </Parameter-edit>
  </div>
</template>

<script>
/*vue3写法*/
import ParameterEdit from './components/parameter-edit.vue'
export default {
  name: 'Index',
  // components: {ParameterEdit}, /*vue3写法*/
  data() {
    return {
      parameterEditShow: false,
      // 参数数据
      parameterDatas: [],
      defaultProps: {
        children: 'children',
        label: 'vcName'
      }
    }
  },
  methods: {
    btn() {
      this.parameterEditShow = true
      // 动态form数据 text date select
      this.parameterDatas = [
        {
          vcId: '1552543242212478976',
          vcAnalysobjIndexId: 'INDEX202207283715251213',
          vcIndexParamCode: 'codes1',
          vcIndexParamName: '产品代码-text',
          vcIsrequired: '1',
          vcIsreplaceDate: '0',
          vcIsshowFlag: '1',
          vcControlType: 'TEXT',
          vcAnalysisParamDefault: '850010,850013',
          vcAnalysisParamType: 'string',
          vcAnalysisParamExplain: null,
          paramSort: null,
          vcCreateUser: '1538693483209187330',
          vcUpdateUser: '1538693483209187330',
          vcVersionId: 'V202207289314606081',
          vcParamtypeValueFrom: null,
          vcParamDefaultId: '850010,850013',
          vcControlTypeName: null,
          dupdate: '2022-07-28 14:35:28',
          dcreate: '2022-07-28 14:35:28'
        },
        {
          vcId: '1552543242216673280',
          vcAnalysobjIndexId: 'INDEX202207283715251213',
          vcIndexParamCode: 'tradeDate1',
          vcIndexParamName: '净值日期-date',
          vcIsrequired: '0',
          vcIsreplaceDate: '0',
          vcIsshowFlag: '1',
          vcControlType: 'DATE',
          vcAnalysisParamDefault: '2021-06-02',
          vcAnalysisParamType: 'string',
          vcAnalysisParamExplain: null,
          paramSort: null,
          vcCreateUser: '1538693483209187330',
          vcUpdateUser: '1538693483209187330',
          vcVersionId: 'V202207289314606081',
          vcParamtypeValueFrom: null,
          vcParamDefaultId: '20200622',
          vcControlTypeName: null,
          dupdate: '2022-07-28 14:35:28',
          dcreate: '2022-07-28 14:35:28'
        },
        {
          vcId: '1552593772121034752',
          vcAnalysobjIndexId: 'INDEX202207280268349453',
          vcIndexParamCode: 'codes2',
          vcIndexParamName: '产品代码-multiSelect',
          vcIsrequired: '1',
          vcIsreplaceDate: '0',
          vcIsshowFlag: '1',
          vcControlType: 'SELECT-MULT',
          vcAnalysisParamDefault: '100001002,100003000,100016001',
          vcAnalysisParamType: 'string',
          vcAnalysisParamExplain: null,
          paramSort: 1,
          vcCreateUser: '1534083450126696450',
          vcUpdateUser: '1534083450126696450',
          vcVersionId: 'V202207288358220809',
          vcParamtypeValueFrom: 'SCR_CATG_DET',
          vcParamDefaultId: '850005',
          vcControlTypeName: '下拉多选',
          dcreate: '2022-07-28 17:56:15',
          dupdate: '2022-07-28 17:56:15'
        },
        {
          vcId: '1552593772125229056',
          vcAnalysobjIndexId: 'INDEX202207280268349453',
          vcIndexParamCode: 'tradeDate2',
          vcIndexParamName: '交易日期-multiSelect',
          vcIsrequired: '1',
          vcIsreplaceDate: '0',
          vcIsshowFlag: '1',
          vcControlType: 'SELECT-MULT',
          vcAnalysisParamDefault: 'A,B,HK,US',
          vcAnalysisParamType: 'string',
          vcAnalysisParamExplain: null,
          paramSort: 2,
          vcCreateUser: '1534083450126696450',
          vcUpdateUser: '1534083450126696450',
          vcVersionId: 'V202207288358220809',
          vcParamtypeValueFrom: 'STK_CATG',
          vcParamDefaultId: '20210216',
          vcControlTypeName: '下拉多选',
          dcreate: '2022-07-28 17:56:15',
          dupdate: '2022-07-28 17:56:15'
        },
        {
          vcId: '1554717735764758528',
          vcAnalysobjIndexId: 'INDEX202207155701498895',
          vcIndexParamCode: 'codes3',
          vcIndexParamName: '产品代码-select',
          vcIsrequired: '1',
          vcIsreplaceDate: '0',
          vcIsshowFlag: '1',
          vcControlType: 'SELECT',
          vcAnalysisParamDefault: '1',
          vcAnalysisParamType: 'string',
          vcAnalysisParamExplain: null,
          paramSort: null,
          vcCreateUser: '1534730266510385153',
          vcUpdateUser: '1534730266510385153',
          vcVersionId: 'V202208034795458567',
          vcParamtypeValueFrom: 'PROD_TYPE',
          vcParamDefaultId: '1',
          vcControlTypeName: null,
          dupdate: '2022-08-03 14:36:08',
          dcreate: '2022-08-03 14:36:08'
        }
      ]
    },
    // 参数确定按钮赋值
    parameterData(parameterForm, str) {
      console.log(parameterForm, '保存的值')
    }
  }
}
</script>

<style scoped lang="scss"></style>
