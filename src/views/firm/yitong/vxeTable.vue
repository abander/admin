<template>
  <div>
    <div class="panel-main-content" style="padding-bottom: 0px">
      <!--筛选栏组  已审核授权-->
      <div class="search-card contents-card card-margin">
        <div class="panel panel-default">
          <div class="panel-body">
            <!--form表单-->
            <vxe-form :data="searchForm">
              <vxe-form-item
                title="请求方账号"
                field="eq_callUser"
                :item-render="{}"
              >
                <template #default>
                  <vxe-input
                    v-model="searchForm.eq_callUser"
                    placeholder="请输入请求方账号"
                  ></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item
                title="请求方名称"
                field="like_callName"
                :item-render="{}"
              >
                <template #default>
                  <vxe-input
                    v-model="searchForm.like_callName"
                    placeholder="请输入请求方名称"
                  ></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item
                title="订单编号"
                field="eq_orderNo"
                :item-render="{}"
              >
                <template #default>
                  <vxe-input
                    v-model="searchForm.eq_orderNo"
                    placeholder="请输入订单编号"
                  ></vxe-input>
                </template>
              </vxe-form-item>

              <vxe-form-item>
                <template #default>
                  <vxe-button type="reset" icon="search" @click="reset"
                    >重置</vxe-button
                  >
                  <vxe-button type="submit" status="primary" @click="query"
                    >查询</vxe-button
                  >
                </template>
              </vxe-form-item>
            </vxe-form>
          </div>
        </div>
      </div>

      <div class="ep-card card-margin" style="position: relative">
        <div class="card-body">
          <div class="block">
            <vxe-toolbar>
              <template #buttons>
                <vxe-button
                  size="small"
                  status="danger"
                  content="终止"
                  @click="agreementSave(data, '5')"
                ></vxe-button>
                <vxe-button
                  size="small"
                  status="danger"
                  content="批量编辑申报单位"
                  @click="batchEditLimitAgentCode(data, '6')"
                ></vxe-button>
              </template>
            </vxe-toolbar>
          </div>
          <!-- 第一层表格-->
          <div class="block">
            <vxe-table
              ref="xTable1"
              border
              :data="
                data.slice((currentPage - 1) * pageSize, currentPage * pageSize)
              "
              :loading="loading"
              size="mini"
              row-id="orderResponseId"
              :checkbox-config="{ reserve: true }"
              @checkbox-change="
                (e) => {
                  selectChange(e, 1)
                }
              "
              @checkbox-all="checkboxAll1"
              @toggle-row-expand="rowExpand1"
            >
              <!--第二层表格-->
              <vxe-table-column type="expand" width="60">
                <template #content="{ row, rowIndex }">
                  <vxe-table
                    :ref="`xTable2${row.orderResponseId}`"
                    border
                    size="mini"
                    :data="row.setMealResponseList"
                    row-id="setMealResponseId"
                    @checkbox-change="
                      (e) => {
                        selectChange(e, 2)
                      }
                    "
                    @checkbox-all="checkboxAll2"
                    @toggle-row-expand="rowExpand2"
                  >
                    <!-- 三层表格-->
                    <vxe-table-column type="expand" width="60">
                      <template #content="{ row, rowIndex }">
                        <vxe-table
                          :ref="`xTable3${row.setMealResponseId}`"
                          border
                          size="mini"
                          :data="row.goodsResponseList"
                          row-id="goodsResponseId"
                          @checkbox-change="
                            (e) => {
                              selectChange(e, 3)
                            }
                          "
                          @checkbox-all="checkboxAll3"
                          @toggle-row-expand="rowExpand3"
                        >
                          <!--第四层表格-->
                          <vxe-table-column type="expand" width="60">
                            <template #content="{ row, rowIndex }">
                              <vxe-table
                                :ref="`xTable4${row.goodsResponseId}`"
                                border
                                size="mini"
                                :data="row.resourceResponseList"
                                row-id="id"
                                @checkbox-change="
                                  (e) => {
                                    selectChange(e, 4)
                                  }
                                "
                                @checkbox-all="checkboxAll4"
                              >
                                <vxe-table-column
                                  type="checkbox"
                                  width="60"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="name"
                                  title="资源名称"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="serviceCode"
                                  title="服务代码"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="authSite"
                                  title="权限"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="endTime"
                                  title="结束时间"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="state"
                                  :formatter="stateFormatter"
                                  title="状态"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="authCode"
                                  title="授权码"
                                ></vxe-table-column>
                                <vxe-table-column
                                  field="limitAgentCode"
                                  title="限制的申报单位"
                                ></vxe-table-column>
                                <vxe-table-column
                                  title="修改申报单位"
                                  width="95px"
                                >
                                  <template #default="{ row }">
                                    <vxe-button
                                      size="mini"
                                      status="warning"
                                      content="编辑"
                                      @click="editLimitAgentCode(row)"
                                    ></vxe-button>
                                  </template>
                                </vxe-table-column>
                              </vxe-table>
                            </template>
                          </vxe-table-column>
                          >
                          <vxe-table-column
                            type="checkbox"
                            width="60"
                          ></vxe-table-column>
                          <vxe-table-column
                            field="name"
                            title="商品名称"
                          ></vxe-table-column>
                        </vxe-table>
                      </template>
                    </vxe-table-column>
                    <vxe-table-column
                      type="checkbox"
                      width="60"
                    ></vxe-table-column>
                    <vxe-table-column
                      field="name"
                      title="套餐名称"
                    ></vxe-table-column>
                  </vxe-table>
                </template>
              </vxe-table-column>
              <vxe-table-column type="checkbox" width="60"></vxe-table-column>
              <vxe-table-column
                field="callUser"
                title="请求方账号"
              ></vxe-table-column>
              <vxe-table-column
                field="callName"
                title="请求方名称"
              ></vxe-table-column>
              <vxe-table-column
                field="orderName"
                title="订单名称"
              ></vxe-table-column>
              <vxe-table-column
                field="orderNo"
                title="订单编号"
              ></vxe-table-column>
              <vxe-table-column
                field="endTime"
                title="结束时间"
              ></vxe-table-column>
              <vxe-table-column
                field="state"
                :formatter="stateFormatter"
                title="状态"
              ></vxe-table-column>
            </vxe-table>
          </div>
          <!-- 限制的申报单位 弹出框         -->
          <ep-modal
            v-if="limitAgentCodeModel"
            v-model="limitAgentCodeModel"
            title="请输入"
            width="450px"
            middle
            :wrap-close="false"
            :before-close="limitAgentCodelModelClose"
          >
            <div style="border: 1px solid #9e9e9e; margin-bottom: 20px"></div>
            <div>
              <!-- 确认框form表单-->
              <ep-form
                ref="limitAgentCodeForm"
                :form="limitAgentCodeForm"
                name-width="100px"
                size="mini"
                :rules="rulesLimitAgentCode"
              >
                <ep-row :gutter="24">
                  <ep-col :col="24">
                    <ep-form-item
                      attr="modelLimitAgentCode"
                      label="限制的申报单位:"
                    >
                      <ep-input
                        v-model="limitAgentCodeForm.modelLimitAgentCode"
                        size="small"
                        name="modelLimitAgentCode"
                      ></ep-input>
                    </ep-form-item>
                  </ep-col>
                </ep-row>
              </ep-form>
            </div>
            <div slot="footer">
              <ep-button type="text" @click="limitAgentCodeModelCancel"
                >取消</ep-button
              >
              <ep-button type="primary" @click="limitAgentCodeModelConfirm"
                >确定</ep-button
              >
            </div>
          </ep-modal>
          <!-- 批量修改限制的申报单位 弹出框         -->
          <ep-modal
            v-if="batchLimitAgentCodeModel"
            v-model="batchLimitAgentCodeModel"
            title="请输入"
            width="450px"
            middle
            :wrap-close="false"
            :before-close="batchLimitAgentCodeModelClose"
          >
            <div style="border: 1px solid #9e9e9e; margin-bottom: 20px"></div>
            <div>
              <!-- 确认框form表单-->
              <ep-form
                ref="batchLimitAgentCodeModelForm"
                :form="batchLimitAgentCodeModelForm"
                name-width="100px"
                size="mini"
                :rules="rulesBatchLimitAgentCodeModel"
              >
                <ep-row :gutter="24">
                  <ep-col :col="24">
                    <ep-form-item
                      attr="batchModelLimitAgentCode"
                      label="限制的申报单位:"
                    >
                      <ep-input
                        v-model="
                          batchLimitAgentCodeModelForm.batchModelLimitAgentCode
                        "
                        size="small"
                        name="batchModelLimitAgentCode"
                      ></ep-input>
                    </ep-form-item>
                  </ep-col>
                </ep-row>
              </ep-form>
            </div>
            <div slot="footer">
              <ep-button type="text" @click="batchLimitAgentCodeModelCancel"
                >取消</ep-button
              >
              <ep-button type="primary" @click="batchLimitAgentCodeModelConfirm"
                >确定</ep-button
              >
            </div>
          </ep-modal>

          <div class="block">
            <vxe-pager
              size="mini"
              :loading="loading"
              :layouts="[
                'Total',
                'Sizes',
                'PrevPage',
                'JumpNumber',
                'NextPage',
                'FullJump',
              ]"
              :current-page="currentPage"
              :page-size="pageSize"
              :total="total"
              :page-sizes="pagesizes"
              @page-change="handlePageChange"
            >
            </vxe-pager>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import misList from 'src/base/mixins/mislist'
import { post } from 'utils'
import { restGet } from 'utils/index'

export default {
  name: 'PandingGrantTable',
  data() {
    return {
      data: [],
      loading: false,
      currentPageData: [], //分页分割出来的新的data，相当于ep_data
      searchForm: {
        eq_callUser: '',
        like_callName: '',
        eq_orderNo: '',
        eq_status: '1',
        orderBy: 'updateTime,desc',
      },
      //分页相关
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pagesizes: [10, 20, 50, 100, 1000],
      //复选框点击事件table1的checked状态
      type1: false,
      type2: false,
      type3: false,
      type4: false,
      records1: [], //table1的数据
      records2: [], //table2的数据
      rowType2: [], //table2的数据
      //全选按钮的状态
      checkedAll1: false,
      checkedAll2: false,
      checkedAll3: false,
      checkedAll4: false,
      selected: '', //每行的selected状态
      list1: [],
      selectRecordsBoolean1: false,
      rowExpand1Row: [],
      selectRecordsBoolean2: false,
      rowExpand2Row: [],
      selectRecordsBoolean3: false,
      selectRecordsCheckBoolean1: false,
      ids: [],
      recordsCheckedAll2: [],
      recordsCheckedAll3: [],
      recordsCheckedAll4: [],
      selectRecordsBoolean1CheckAll1: false,
      selectRecordsBoolean1CheckAll2: false,
      selectRecordsBoolean1CheckAll3: false,
      expanded1: false,
      expanded2: false,
      expanded3: false,
      checkboxAllRecords2: [],
      recordsCheckboxAll2: [],
      limitAgentCodeModel: false, //弹出框
      limitAgentCodeForm: {
        modelLimitAgentCode: '',
      },
      rulesLimitAgentCode: {},
      limitAgentCodeId: '',
      batchLimitAgentCodeModel: false,
      batchLimitAgentCodeModelForm: {
        batchModelLimitAgentCode: '',
      },
      rulesBatchLimitAgentCodeModel: {},
      status: '',
    }
  },
  created() {
    this.getDataList() //list
    this.query() //查询
  },
  activated() {
    //当切换tab页时，回到初页面，分页的还会停留在切换之前的状态
    this.getDataList()
  },
  methods: {
    stateFormatter(state) {
      var stateText = ''
      if (state.row.state === '1') {
        stateText = '已审核'
      } else if (state.row.state === '0') {
        stateText = '待审核'
      }
      return stateText
    },
    // 分页
    handlePageChange({ currentPage, pageSize }) {
      this.currentPage = currentPage
      this.pageSize = pageSize
      this.getDataList()
    },

    //当行展开或收起时会触发该事件
    //1、当table表格关闭的情况下，点击订单复选框，在展开行，下面的234复选框可以选中，已完成无报错
    rowExpand1(e) {
      //当表头为fasle时,不走当行关闭状态下点击选中，为true，表头选中下拉选中
      this.rowExpand1Row = e.row
      this.expanded1 = e.expanded
      if (this.checkedAll1 === false) {
        let selectRecords = this.$refs.xTable1.getCheckboxRecords() // 获取选择行数据
        this.selectRecordsBoolean1 = selectRecords.map((item) => {
          return item.orderResponseId === e.row.orderResponseId
        })
        this.selectRecordsBoolean1.forEach((item) => {
          if (item) {
            this.$nextTick(() => {
              if (this.$refs[`xTable2${e.row.orderResponseId}`]) {
                this.$refs[`xTable2${e.row.orderResponseId}`].setAllCheckboxRow(
                  item,
                )
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          if (this.$refs.xTable1) {
            let selectRecords = this.$refs.xTable1.getCheckboxRecords() // 获取选择行数据
            this.selectRecordsBoolean1CheckAll1 = selectRecords.map((item) => {
              return item.orderResponseId === e.row.orderResponseId
            })
            this.selectRecordsBoolean1CheckAll1.forEach((item) => {
              if (item) {
                this.$nextTick(() => {
                  if (this.$refs[`xTable2${e.row.orderResponseId}`]) {
                    this.$refs[
                      `xTable2${e.row.orderResponseId}`
                    ].setAllCheckboxRow(item)
                  }
                })
              }
            })
          }
        })
      }
      if (e.expanded == true) {
        this.$nextTick(() => {
          const checkedArr = e.row.setMealResponseList.filter((item) => {
            return item.isChecked
          })
          if (this.$refs[`xTable2${e.row.orderResponseId}`]) {
            this.$refs[`xTable2${e.row.orderResponseId}`].setCheckboxRow(
              checkedArr,
              true,
            )
          }
        })
      }
    },
    rowExpand2(e) {
      this.rowExpand2Row = e.row
      this.expanded2 = e.expanded
      if (this.checkedAll2 === false) {
        /*   this.$nextTick(() => {

             console.log(e.$table)

           if (this.$refs[`xTable2${e.$table.data.levelOneData.orderResponseId}`]) {
           let selectRecords = this.$refs[`xTable2${e.$table.data.levelOneData.orderResponseId}`].getCheckboxRecords()

           console.log(selectRecords)

           this.selectRecordsBoolean2 = selectRecords.map(item => {
             return item.setMealResponseId === e.row.setMealResponseId
           })

           this.selectRecordsBoolean2.forEach(item => {
             if (item) {
               this.$nextTick(() => {
                 if (this.$refs[`xTable3${e.row.setMealResponseId}`]) {
                   this.$refs[`xTable3${e.row.setMealResponseId}`].setAllCheckboxRow(item)
                 }
               })
             }
           })
         }
        })*/

        let selectRecords =
          this.$refs[
            `xTable2${this.rowExpand1Row.orderResponseId}`
          ].getCheckboxRecords()
        this.selectRecordsBoolean2 = selectRecords.map((item) => {
          return item.setMealResponseId === e.row.setMealResponseId
        })
        this.selectRecordsBoolean2.forEach((item) => {
          if (item) {
            this.$nextTick(() => {
              if (this.$refs[`xTable3${e.row.setMealResponseId}`]) {
                this.$refs[
                  `xTable3${e.row.setMealResponseId}`
                ].setAllCheckboxRow(item)
              }
            })
          }
        })
      } else {
        this.$nextTick(() => {
          if (this.$refs[`xTable2${this.rowExpand1Row.orderResponseId}`]) {
            let selectRecords =
              this.$refs[
                `xTable2${this.rowExpand1Row.orderResponseId}`
              ].getCheckboxRecords() // 获取选择行数据
            this.selectRecordsBoolean1CheckAll2 = selectRecords.map((item) => {
              return item.setMealResponseId === e.row.setMealResponseId
            })
            this.selectRecordsBoolean1CheckAll2.forEach((item) => {
              if (item) {
                this.$nextTick(() => {
                  if (
                    this.$refs[`xTable3${this.rowExpand2Row.setMealResponseId}`]
                  ) {
                    this.$refs[
                      `xTable3${this.rowExpand2Row.setMealResponseId}`
                    ].setAllCheckboxRow(item)
                  }
                })
              }
            })
          }
        })
      }

      if (e.expanded == true) {
        this.$nextTick(() => {
          const checkedArr = e.row.goodsResponseList.filter((item) => {
            return item.isChecked
          })
          if (this.$refs[`xTable3${e.row.setMealResponseId}`]) {
            this.$refs[`xTable3${e.row.setMealResponseId}`].setCheckboxRow(
              checkedArr,
              true,
            )
          }
        })
      }
    },
    rowExpand3(e) {
      if (this.checkedAll3 === false) {
        let selectRecords =
          this.$refs[
            `xTable3${this.rowExpand2Row.setMealResponseId}`
          ].getCheckboxRecords()
        this.selectRecordsBoolean3 = selectRecords.map((item) => {
          return item.goodsResponseId == e.row.goodsResponseId
        })
        this.selectRecordsBoolean3.forEach((item) => {
          //第二层正常是false true  第一层：true false
          if (item) {
            this.$nextTick(() => {
              if (this.$refs[`xTable4${e.row.goodsResponseId}`]) {
                this.$refs[`xTable4${e.row.goodsResponseId}`].setAllCheckboxRow(
                  item,
                )
              }
            })
          }
        })
      } else {
        if (this.$refs[`xTable3${this.rowExpand2Row.setMealResponseId}`]) {
          let selectRecords =
            this.$refs[
              `xTable3${this.rowExpand2Row.setMealResponseId}`
            ].getCheckboxRecords() // 获取选择行数据
          this.selectRecordsBoolean1CheckAll3 = selectRecords.map((item) => {
            return item.setMealResponseId === e.row.setMealResponseId
          })
          this.selectRecordsBoolean1CheckAll3.forEach((item) => {
            if (item) {
              this.$nextTick(() => {
                if (this.$refs[`xTable4${e.row.goodsResponseId}`]) {
                  this.$refs[
                    `xTable4${e.row.goodsResponseId}`
                  ].setAllCheckboxRow(item)
                }
              })
            }
          })
        }
      }
      //点击资源，合上表格，资源的复选框选中变不选中，解决：
      if (e.expanded == true) {
        this.$nextTick(() => {
          const checkedArr = e.row.resourceResponseList.filter((item) => {
            return item.isChecked
          })
          console.log(checkedArr)
          if (this.$refs[`xTable4${e.row.goodsResponseId}`]) {
            this.$refs[`xTable4${e.row.goodsResponseId}`].setCheckboxRow(
              checkedArr,
              true,
            )
          }
          if (checkedArr.length === 0) {
            this.$refs[`xTable4${e.row.goodsResponseId}`].setCheckboxRow(
              e.row.resourceResponseList,
              false,
            )
          }
        })
      }
    },
    //当手动勾选并且值发生改变时触发的事件
    //e.records  是一行的数组   e.row:是一行的对象   e.$rowIndex，有几个第3table就有多少rowIndex
    selectChange(e, type) {
      //  1234层一起加了isChecked
      //   e.row.isChecked = e.checked
      if (type === 1) {
        this.type1 = e.checked

        e.row.isChecked = e.checked
        e.row.setMealResponseList.forEach((item2) => {
          item2.isChecked = e.checked
          item2.goodsResponseList.forEach((item3) => {
            item3.isChecked = e.checked
            item3.resourceResponseList.forEach((item4) => {
              item4.isChecked = e.checked
            })
          })
        })

        this.records1 = e.row
        this.$nextTick(() => {
          if (e.checked === true) {
            this.$nextTick(() => {
              if (this.records1) {
                if (this.$refs[`xTable2${this.records1.orderResponseId}`]) {
                  this.$refs[
                    `xTable2${this.records1.orderResponseId}`
                  ].setAllCheckboxRow(true)
                  this.records1.setMealResponseList.forEach((item1) => {
                    if (item1.setMealResponseId) {
                      console.log(`xTable3${item1.setMealResponseId}`)
                      if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
                        this.$refs[
                          `xTable3${item1.setMealResponseId}`
                        ].setAllCheckboxRow(true)
                      }
                      item1.goodsResponseList.forEach((item2) => {
                        if (item2.goodsResponseId) {
                          if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                            this.$refs[
                              `xTable4${item2.goodsResponseId}`
                            ].setAllCheckboxRow(true)
                          }
                        }
                      })
                    }
                  })
                }
              }
            })
          } else if (e.checked === false) {
            this.$nextTick(() => {
              if (this.records1) {
                if (this.$refs[`xTable2${this.records1.orderResponseId}`]) {
                  this.$refs[
                    `xTable2${this.records1.orderResponseId}`
                  ].setAllCheckboxRow(false)
                }
                this.records1.setMealResponseList.forEach((item1) => {
                  if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
                    this.$refs[
                      `xTable3${item1.setMealResponseId}`
                    ].setAllCheckboxRow(false)
                  }
                  if (item1.goodsResponseList) {
                    item1.goodsResponseList.forEach((item2) => {
                      if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                        this.$refs[
                          `xTable4${item2.goodsResponseId}`
                        ].setAllCheckboxRow(false)
                      }
                    })
                  }
                })
              }
            })
          }
        })
      } else if (type === 2) {
        //点击第二table，设第三table为true，temelate中的row是第2table的数据，rowIndex是第3table的索引
        this.type2 = e.checked

        e.row.isChecked = e.checked
        e.row.goodsResponseList.forEach((item2) => {
          item2.isChecked = e.checked
          item2.resourceResponseList.forEach((item3) => {
            item3.isChecked = e.checked
          })
        })

        this.rowType2 = e.row
        this.$nextTick(() => {
          if (this.type2 === true) {
            this.$nextTick(() => {
              if (this.$refs[`xTable3${e.row.setMealResponseId}`]) {
                this.$refs[
                  `xTable3${e.row.setMealResponseId}`
                ].setAllCheckboxRow(true)
                this.records2 = e.row.goodsResponseList
                if (e.row.goodsResponseList) {
                  e.row.goodsResponseList.forEach((item) => {
                    if (this.$refs[`xTable4${item.goodsResponseId}`]) {
                      this.$refs[
                        `xTable4${item.goodsResponseId}`
                      ].setAllCheckboxRow(true)
                    }
                  })
                }
              }
            })
          } else {
            this.$nextTick(() => {
              if (this.$refs[`xTable3${e.row.setMealResponseId}`]) {
                this.$refs[
                  `xTable3${e.row.setMealResponseId}`
                ].setAllCheckboxRow(false)
                this.rowType2.goodsResponseList.forEach((item) => {
                  if (this.$refs[`xTable4${item.goodsResponseId}`]) {
                    this.$refs[
                      `xTable4${item.goodsResponseId}`
                    ].setAllCheckboxRow(false)
                  }
                })
              }
            })
          }
        })
      } else if (type === 3) {
        this.type3 = e.checked
        e.row.isChecked = e.checked
        e.row.resourceResponseList.forEach((item) => {
          item.isChecked = e.checked
        })
        this.$nextTick(() => {
          if (this.type3 === true) {
            this.$nextTick(() => {
              if (this.$refs[`xTable4${e.row.goodsResponseId}`]) {
                this.$refs[`xTable4${e.row.goodsResponseId}`].setAllCheckboxRow(
                  true,
                )
              }
            })
          } else {
            this.$nextTick(() => {
              if (this.$refs[`xTable4${e.row.goodsResponseId}`]) {
                this.$refs[`xTable4${e.row.goodsResponseId}`].setAllCheckboxRow(
                  false,
                )
              }
            })
          }
        })
      } else if (type === 4) {
        this.type4 = e.checked
        e.row.isChecked = e.checked
      }

      // 收集 id
      const ids = this.getResourceResponseListId(e.records, [])
      ids.forEach((item) => {
        const flag = this.ids.find((itm) => itm === item)
        if (!flag) {
          this.ids.push(item)
        }
      })
      if (!(e.records.length && e.records.indexOf(e.row) !== -1)) {
        // e.isChecked
        const delIds = this.getResourceResponseListId([e.row], [])
        delIds.forEach((item) => {
          const index = this.ids.findIndex((itm) => itm === item)
          if (index !== -1) {
            this.ids.splice(index, 1)
          }
        })
      }

      // 反选
      const checked = e.checked
      for (let i in e.row) {
        switch (
          i // 点击第四层
        ) {
          case 'serviceCode':
            const { levelThreeData } = e.row
            //点击第四层的table
            const table4Flag4 =
              this.$refs[
                `xTable4${e.row.levelThreeData.goodsResponseId}`
              ].isAllCheckboxChecked() //4
            levelThreeData.isChecked = table4Flag4 ? true : false

            this.$refs[
              `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
            ].setCheckboxRow(
              [levelThreeData],
              e.records.length === e.items.length,
            ) // table 3
            /*if(e.records.length === e.items.length) {
                 this.$refs[`xTable3${levelThreeData.levelTwoData.setMealResponseId}`].setCheckboxRow([levelThreeData], checked)// table 3
            }*/
            const table2Flag4 =
              this.$refs[
                `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
              ].isAllCheckboxChecked() //3

            this.$refs[
              `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
            ].setCheckboxRow([levelThreeData.levelTwoData], table2Flag4) // 2
            /*if(table2Flag4){
              this.$refs[`xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`].setCheckboxRow([levelThreeData.levelTwoData], checked) // 2
            }*/
            const table1Flag4 =
              this.$refs[
                `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
              ].isAllCheckboxChecked()

            this.$refs.xTable1.setCheckboxRow(
              [levelThreeData.levelTwoData.levelOneData],
              table1Flag4,
            ) //1
            /* if(table1Flag4){
             this.$refs.xTable1.setCheckboxRow([levelThreeData.levelTwoData.levelOneData],checked)
           }*/
            break
          case 'goodsResponseId':
            const table2Flag3 =
              this.$refs[
                `xTable3${e.row.levelTwoData.setMealResponseId}`
              ].isAllCheckboxChecked()
            e.row.levelTwoData.isChecked = table2Flag3 ? true : false

            this.$refs[
              `xTable2${e.row.levelTwoData.levelOneData.orderResponseId}`
            ].setCheckboxRow([e.row.levelTwoData], table2Flag3) // 2
            /*if(table2Flag3) {
              this.$refs[`xTable2${e.row.levelTwoData.levelOneData.orderResponseId}`].setCheckboxRow([e.row.levelTwoData], checked) // 2            }
            }*/

            const table1Flag3 =
              this.$refs[
                `xTable2${e.row.levelTwoData.levelOneData.orderResponseId}`
              ].isAllCheckboxChecked()
            this.$refs.xTable1.setCheckboxRow(
              [e.row.levelTwoData.levelOneData],
              table1Flag3,
            )
            /*if(table1Flag3){
              this.$refs.xTable1.setCheckboxRow([e.row.levelTwoData.levelOneData],checked)
            }*/

            break
          case 'setMealResponseId':
            const table1Flag2 =
              this.$refs[
                `xTable2${e.row.levelOneData.orderResponseId}`
              ].isAllCheckboxChecked()
            /*            if(table1Flag2){
                          this.$refs.xTable1.setCheckboxRow([e.row.levelOneData],checked)
                        } else {
                          this.$refs.xTable1.setCheckboxRow([e.row.levelOneData],false)
                        }*/
            this.$refs.xTable1.setCheckboxRow([e.row.levelOneData], table1Flag2)
            break
        }
      }
    },

    // 当手动勾选全选时触发的事件
    checkboxAll1(e) {
      //在table展开的时候根据表头来设置下面选中
      this.checkedAll1 = e.checked
      e.$table.data.forEach((item1) => {
        if (this.checkedAll1) {
          this.$nextTick(() => {
            if (this.$refs[`xTable2${item1.orderResponseId}`]) {
              this.$refs[`xTable2${item1.orderResponseId}`].setAllCheckboxRow(
                true,
              )
              item1.setMealResponseList.forEach((item2) => {
                if (this.$refs[`xTable3${item2.setMealResponseId}`]) {
                  this.$refs[
                    `xTable3${item2.setMealResponseId}`
                  ].setAllCheckboxRow(true)
                  item2.goodsResponseList.forEach((item3) => {
                    if (this.$refs[`xTable4${item3.goodsResponseId}`]) {
                      this.$refs[
                        `xTable4${item3.goodsResponseId}`
                      ].setAllCheckboxRow(true)
                    }
                  })
                }
              })
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.$refs[`xTable2${item1.orderResponseId}`]) {
              this.$refs[`xTable2${item1.orderResponseId}`].setAllCheckboxRow(
                false,
              )
              item1.setMealResponseList.forEach((item2) => {
                if (this.$refs[`xTable3${item2.setMealResponseId}`]) {
                  this.$refs[
                    `xTable3${item2.setMealResponseId}`
                  ].setAllCheckboxRow(false)
                  item2.goodsResponseList.forEach((item3) => {
                    if (this.$refs[`xTable4${item3.goodsResponseId}`]) {
                      this.$refs[
                        `xTable4${item3.goodsResponseId}`
                      ].setAllCheckboxRow(false)
                    }
                  })
                }
              })
            }
          })
        }
      })

      // 全选 收集 resourceResponseListId
      if (e.checked) {
        this.ids = this.getResourceResponseListId(e.records, [])
      } else {
        this.ids = []
      }
    },
    checkboxAll2(e) {
      this.checkedAll2 = e.checked
      this.recordsCheckedAll2 = e.$table.data
      /* this.recordsCheckedAll2 = e.$table.data
       e.$table.data.forEach(item1 => {
             item1.isChecked = e.checked
       })

       this.recordsCheckboxAll2=e.records
         if (this.checkedAll2) {
           this.$nextTick(() => {
             this.recordsCheckedAll2.forEach(item1=>{
               if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
                 this.$refs[`xTable3${item1.setMealResponseId}`].setAllCheckboxRow(true)
                 item1.goodsResponseList.forEach(item2 => {
                   if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                     this.$refs[`xTable4${item2.goodsResponseId}`].setAllCheckboxRow(true)
                   }
                 })
               }
             })
           })
         } else {
           this.$nextTick(() => {
             this.recordsCheckedAll2.forEach(item1=>{
               if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
                 this.$refs[`xTable3${item1.setMealResponseId}`].setAllCheckboxRow(false)
                 item1.goodsResponseList.forEach(item2 => {
                   if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                     this.$refs[`xTable4${item2.goodsResponseId}`].setAllCheckboxRow(false)
                   }
                 })
               }
             })
           })
         }*/

      e.$table.data.forEach((item1) => {
        item1.isChecked = e.checked
        item1.goodsResponseList.forEach((item2) => {
          item2.isChecked = e.checked
          item2.resourceResponseList.forEach((item3) => {
            item3.isChecked = e.checked
          })
        })

        if (this.checkedAll2) {
          this.$nextTick(() => {
            if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
              this.$refs[`xTable3${item1.setMealResponseId}`].setAllCheckboxRow(
                true,
              )
              item1.goodsResponseList.forEach((item2) => {
                if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                  this.$refs[
                    `xTable4${item2.goodsResponseId}`
                  ].setAllCheckboxRow(true)
                }
              })
            }
          })
        } else {
          this.$nextTick(() => {
            console.log(this.checkedAll2, 'false')
            console.log(e)
            if (this.$refs[`xTable3${item1.setMealResponseId}`]) {
              this.$refs[`xTable3${item1.setMealResponseId}`].setAllCheckboxRow(
                false,
              )
              item1.goodsResponseList.forEach((item2) => {
                if (this.$refs[`xTable4${item2.goodsResponseId}`]) {
                  this.$refs[
                    `xTable4${item2.goodsResponseId}`
                  ].setAllCheckboxRow(false)
                }
              })
            }
          })
        }
      })
      const ids = this.getResourceResponseListId(e.$table.data, [])
      if (e.checked) {
        // 选中表头
        ids.forEach((item) => {
          this.ids.includes(item) || this.ids.push(item) // 是否在收集id数组中，true 不push  false push进ids数组
        })
      } else {
        ids.forEach((item) => {
          // 取消选择表头
          const index = this.ids.findIndex((itm) => item === itm) // 遍历第二层 的数据， 判断是否在收集id'的总数组ids中
          if (index !== -1) {
            // findIndex 返回 -1表示 数组中不存在查找的元素
            this.ids.splice(index, 1) // 删除，从index开始删除一个
          }
        })
      }
      //表头反选
      if (e.checked) {
        e.records.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'setMealResponseId':
                const table1Flag2 =
                  this.$refs[
                    `xTable2${item.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [item.levelOneData],
                  table1Flag2,
                )
                break
            }
          }
        })
      } else {
        this.recordsCheckedAll2.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'setMealResponseId':
                const table1Flag2 =
                  this.$refs[
                    `xTable2${item.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [item.levelOneData],
                  table1Flag2,
                )
                break
            }
          }
        })
      }
    },
    checkboxAll3(e) {
      this.checkedAll3 = e.checked
      this.recordsCheckedAll3 = e.$table.data
      console.log(e.$table.data)

      e.$table.data[0].levelTwoData.isChecked = e.checked

      e.$table.data.forEach((item1) => {
        item1.isChecked = e.checked //表头点击全选，在取消点击里面的任意复选框，合上钩子，选中的复选框会消失
        item1.resourceResponseList.forEach((item2) => {
          item2.isChecked = e.checked
        })
        if (this.checkedAll3) {
          this.$nextTick(() => {
            if (this.$refs[`xTable4${item1.goodsResponseId}`]) {
              this.$refs[`xTable4${item1.goodsResponseId}`].setAllCheckboxRow(
                true,
              )
            }
          })
        } else {
          this.$nextTick(() => {
            if (this.$refs[`xTable4${item1.goodsResponseId}`]) {
              this.$refs[`xTable4${item1.goodsResponseId}`].setAllCheckboxRow(
                false,
              )
            }
          })
        }
      })

      // 收集 id
      const ids = this.getResourceResponseListId(e.$table.data, [])
      if (e.checked) {
        // 选中表头
        ids.forEach((item) => {
          this.ids.includes(item) || this.ids.push(item) // 是否在收集id数组中，true 不push  false push进ids数组
        })
      } else {
        ids.forEach((item) => {
          // 取消选择表头
          const index = this.ids.findIndex((itm) => item === itm) // 遍历第二层 的数据， 判断是否在收集id'的总数组ids中
          if (index !== -1) {
            // findIndex 返回 -1表示 数组中不存在查找的元素
            this.ids.splice(index, 1) // 删除，从index开始删除一个
          }
        })
      }

      //表头反选
      if (e.checked) {
        e.records.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'goodsResponseId':
                const table2Flag3 =
                  this.$refs[
                    `xTable3${item.levelTwoData.setMealResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs[
                  `xTable2${item.levelTwoData.levelOneData.orderResponseId}`
                ].setCheckboxRow([item.levelTwoData], table2Flag3) // 2
                const table1Flag3 =
                  this.$refs[
                    `xTable2${item.levelTwoData.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [item.levelTwoData.levelOneData],
                  table1Flag3,
                )
                break
            }
          }
        })
      } else {
        this.recordsCheckedAll3.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'goodsResponseId':
                const table2Flag3 =
                  this.$refs[
                    `xTable3${item.levelTwoData.setMealResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs[
                  `xTable2${item.levelTwoData.levelOneData.orderResponseId}`
                ].setCheckboxRow([item.levelTwoData], table2Flag3) // 2
                const table1Flag3 =
                  this.$refs[
                    `xTable2${item.levelTwoData.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [item.levelTwoData.levelOneData],
                  table1Flag3,
                )
                break
            }
          }
        })
      }
    },
    checkboxAll4(e) {
      e.$table.data.forEach((item1) => (item1.isChecked = e.checked))
      this.recordsCheckedAll4 = e.$table.data
      this.checkedAll4 = e.checked

      //点击第四层表头，选中对应行的第四层selsect，收起展开，依然会选中
      e.$table.data[0].levelThreeData.isChecked = e.checked

      const ids = this.getResourceResponseListId(e.$table.data, [])
      if (e.checked) {
        // 选中表头
        ids.forEach((item) => {
          this.ids.includes(item) || this.ids.push(item) // 是否在收集id数组中，true 不push  false push进ids数组
        })
      } else {
        ids.forEach((item) => {
          // 取消选择表头
          const index = this.ids.findIndex((itm) => item === itm) // 遍历第二层 的数据， 判断是否在收集id'的总数组ids中
          if (index !== -1) {
            // findIndex 返回 -1表示 数组中不存在查找的元素
            this.ids.splice(index, 1) // 删除，从index开始删除一个
          }
        })
      }

      //表头反选
      if (e.checked) {
        e.records.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'serviceCode':
                const { levelThreeData } = item
                this.$refs[
                  `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
                ].setCheckboxRow([levelThreeData], e.records.length) // table 3
                const table2Flag4 =
                  this.$refs[
                    `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs[
                  `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
                ].setCheckboxRow([levelThreeData.levelTwoData], table2Flag4) // 2
                const table1Flag4 =
                  this.$refs[
                    `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [levelThreeData.levelTwoData.levelOneData],
                  table1Flag4,
                )
                break
            }
          }
        })
      } else {
        this.recordsCheckedAll4.forEach((item) => {
          for (let i in item) {
            switch (
              i // 点击第2层
            ) {
              case 'serviceCode':
                const { levelThreeData } = item
                this.$refs[
                  `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
                ].setCheckboxRow([levelThreeData], e.records.length) // table 3
                const table2Flag4 =
                  this.$refs[
                    `xTable3${levelThreeData.levelTwoData.setMealResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs[
                  `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
                ].setCheckboxRow([levelThreeData.levelTwoData], table2Flag4) // 2
                const table1Flag4 =
                  this.$refs[
                    `xTable2${levelThreeData.levelTwoData.levelOneData.orderResponseId}`
                  ].isAllCheckboxChecked()
                this.$refs.xTable1.setCheckboxRow(
                  [levelThreeData.levelTwoData.levelOneData],
                  table1Flag4,
                )
                break
            }
          }
        })
      }
    },

    transformData(data) {
      data.forEach((item) => {
        // 判断是否为数组，true则表示是下级表格
        for (let i in item) {
          switch (i) {
            case 'setMealResponseList':
              item[i].forEach((itm) => {
                itm.levelOneData = item
              })
              break
            case 'goodsResponseList':
              item[i].forEach((itm) => {
                itm.levelTwoData = item
              })
              break
            case 'resourceResponseList':
              item[i].forEach((itm) => {
                itm.levelThreeData = item
              })
              break
          }
          const isArray = Array.isArray(item[i])
          if (isArray && item[i].length > 0) {
            // 递归遍历下层
            this.transformData(item[i])
          }
        }
      })
    },

    // 收集 resourceResponseListId
    getResourceResponseListId(data, idArray) {
      data = data || []
      data.forEach((item) => {
        for (let i in item) {
          const isArray = Array.isArray(item[i])
          if (isArray) {
            this.getResourceResponseListId(item[i], idArray)
          } else if (i === 'authSite') {
            idArray.includes(item.id) || idArray.push(item.id)
          }
        }
      })
      return idArray
    },

    // 遍历
    getFatherData(data, name) {
      data.forEach((item) => {
        for (let i in item) {
          if (i === name) {
            console.log(item)
          }
          if (Array.isArray(item[i])) {
            this.getFatherData(item[i], name)
          }
        }
      })
    },

    //终止
    agreementSave(row, status) {
      //不点复选框的情况下点击同意或拒绝按钮，不调接口提示用户
      if (this.ids.length === 0) {
        this.$pop('请先勾选服务')
        return
      }
      this.$post('userAuthInfoUpdateBatchStatus', {
        ids: this.ids,
        eq_status: status,
      }).then((json) => {
        this.getDataList()
        if (status == 5) {
          this.$pop({
            type: 'danger',
            message: '已终止',
          })
          this.ids = []
        }
      })
    },
    //查询
    query() {
      this.currentPage = 1
      this.getDataList()
    },
    //重置
    reset() {},
    //获取list列表得方法
    getDataList() {
      this.loading = true
      this.$post('userAuthInfoPageList', { ...this.searchForm })
        .then((json) => {
          if (json.data.rows) {
            this.data = json.data.rows
            this.total = json.data.total
            this.loading = false
            this.transformData(this.data)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    //编辑按钮
    editLimitAgentCode(e) {
      this.limitAgentCodeModel = true
      this.limitAgentCodeId = e.id
    },
    //弹出框
    limitAgentCodeModelConfirm() {
      this.$post('modLimitAgentCode', {
        id: this.limitAgentCodeId,
        limitAgentCode: this.limitAgentCodeForm.modelLimitAgentCode,
      })
        .then((json) => {
          if (json.data == 200) {
            this.ep_data.limitAgentCode =
              this.limitAgentCodeForm.modelLimitAgentCode
          }
          this.limitAgentCodeForm.modelLimitAgentCode = ''
          this.limitAgentCodeModel = false
          this.getDataList()
        })
        .catch((e) => {
          this.limitAgentCodeForm.modelLimitAgentCode = ''
          this.limitAgentCodeModel = false
        })
    },
    limitAgentCodeModelCancel() {
      this.limitAgentCodeModel = false
      this.limitAgentCodeForm.modelLimitAgentCode = ''
    },
    limitAgentCodelModelClose() {
      this.limitAgentCodeModel = false
      this.limitAgentCodeForm.modelLimitAgentCode = ''
    },

    batchEditLimitAgentCode(row, status) {
      if (this.ids.length === 0) {
        this.$pop('请先勾选服务')
        return
      }
      this.batchLimitAgentCodeModel = true
      this.status = status
    },
    batchLimitAgentCodeModelConfirm() {
      this.$post('batchModLimitAgentCode', {
        ids: this.ids,
        limitAgentCode:
          this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode,
      })
        .then((json) => {
          if (json.data == 200) {
            this.ep_data.limitAgentCode =
              this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode
          }
          this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode = ''
          this.batchLimitAgentCodeModel = false
          this.getDataList()
          this.$refs.xTable1.clearCheckboxRow()
          if (this.status == 6) {
            this.$pop({
              type: 'success',
              message: '编辑成功',
            })
            this.ids = []
          }
        })
        .catch((e) => {
          this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode = ''
          this.batchLimitAgentCodeModel = false
        })
    },
    batchLimitAgentCodeModelCancel() {
      this.batchLimitAgentCodeModel = false
      this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode = ''
    },
    batchLimitAgentCodeModelClose() {
      this.batchLimitAgentCodeModel = false
      this.batchLimitAgentCodeModelForm.batchModelLimitAgentCode = ''
    },
  },
}
</script>

<style scoped></style>
