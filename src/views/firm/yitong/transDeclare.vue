<template>
  <div class="panel-main-content" style="padding-bottom: 0px">
    <div class="search-card contents-card card-margin">
      <ep-row slot="contents" :gutter="20">
        <!--按钮-->
        <ep-col v-if="buttonFlag" :col="24" style="margin-left: 10px">
          <div v-if="configurationIf">
            <ep-button class="btnRound" type="success" size="small" icon="android-add-circle" @click="add"
              >新增</ep-button
            >
            <ep-button class="btnRound" type="success" size="small" icon="pause" :disabled="btnFlag" @click="hold"
              >暂存</ep-button
            >
            <ep-button
              class="btnRound"
              type="primary"
              size="small"
              icon="checkmark-circled"
              :disabled="btnFlag"
              @click="check"
              >校验</ep-button
            >
            <ep-button
              class="btnRound"
              type="success"
              size="small"
              icon="ios-paperplane"
              :disabled="btnFlag"
              @click="save"
              >保存</ep-button
            >
            <ep-button
              class="btnRound"
              type="danger"
              size="small"
              icon="checkmark-round"
              :disabled="btnFlag"
              @click="send"
              >发送</ep-button
            >
            <ep-button class="btnRound" type="primary" size="small" icon="ios-copy" @click="copy">复制</ep-button>
            <ep-button class="btnRound" type="info" size="small" icon="close-round" :disabled="btnFlag" @click="close"
              >清空</ep-button
            >
            <ep-button
              class="btnRound"
              type="primary"
              size="small"
              icon="search"
              :disabled="btnFlagPrint"
              @click="print"
              >打印</ep-button
            >
            <ep-button class="btnRound" type="success" size="small" icon="ios-copy-outline" @click="queryAssignment"
              >初始值模板</ep-button
            >
          </div>
          <div v-if="!configurationIf">
            <ep-button
              class="btnRound"
              type="primary"
              size="small"
              icon="ios-paperplane"
              @click="savetTemplateConfiguration"
              >保存</ep-button
            >
          </div>
          <!--      <ep-button class="btnRound" type="primary" size="small" icon="search" @click="refresh">查询</ep-button>-->
        </ep-col>
        <!--左边布局 -->
        <ep-col :col="12">
          <div class="base-cv cardLeft">
            <!--取消查询功能-->
            <!--        <ep-modal title="查询" v-model="refreshModal"  width="500px" :wrap-close="false" middle>
                      <ep-form ref="refreshModalForm" :form="refreshModalForm" name-width="100px"
                               size="small" :rules="refreshModalRules">
                        <ep-row :gutter="24">
                          <ep-col :col="20" :lg="20">
                            <ep-form-item attr="id" label="ID：">
                              <ep-input size='small' v-model="refreshModalForm.id" name="id"></ep-input>
                            </ep-form-item>
                          </ep-col>
                        </ep-row>
                      </ep-form>

                      <div slot="footer" class="footerModel">
                        <ep-button class="btnSaveClose" type="text" @click="closeModel">取消</ep-button>
                        <ep-button class="btnRoundComfirm" type="primary" @click="comfirmModel">确定</ep-button>
                      </div>
                    </ep-modal>-->
            <!--表单1-->
            <ep-row slot="contents" :gutter="20">
              <ep-col :col="24">
                <!--        <div class="base-cv-title"><span class="weight">单证信息</span></div>
                              <div class="base-cv-main">-->
                <fieldset class="formFieldsetOne">
                  <legend>单证信息</legend>
                  <ep-form
                    ref="appForm"
                    v-enterToNext
                    :form="appForm"
                    name-width="140px"
                    size="small"
                    :rules="page_rules"
                  >
                    <ep-row :gutter="7">
                      <ep-col v-if="!iEFlagIf" :col="12" :lg="12">
                        <ep-form-item attr="templateNo" label="模板编号">
                          <ep-input v-model="appForm.templateNo" size="small" name="templateNo" disabled></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col v-if="!iEFlagIf" :col="12" :lg="12">
                        <ep-form-item attr="templateName" label="模板名称" required>
                          <ep-input v-model="appForm.templateName" size="small" name="templateName"></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="status" label="状态">
                          <!--                      <ep-input size='small' v-model="appForm.status" name="status" disabled></ep-input>-->
                          <ep-select v-model="appForm.status" size="small" name="status" disabled>
                            <ep-select-item
                              v-for="(item, index) in statusValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="copSeqNo" label="企业内部编号">
                          <ep-input v-model="appForm.copSeqNo" size="small" name="copSeqNo" disabled></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="transPreId" label="统一编号">
                          <ep-input v-model="appForm.transPreId" size="small" name="transPreId" disabled></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="preNo" label="预录入编号">
                          <ep-input v-model="appForm.preNo" size="small" name="preNo" disabled></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="trafWay" label="境内运输方式">
                          <ep-select
                            v-model="appForm.trafWay"
                            size="small"
                            name="trafWay"
                            placeholder="请输入"
                            :mounted-remote-call="false"
                            remote
                            :remote-call="
                              (value, old, callback) => trafModeRemoteCall(value, callback, 'TRAF_MODE_STD')
                            "
                            @active-change="trafWayChange"
                          >
                            <ep-select-item
                              v-for="(item, index) in TRAF_MODE_STDValue"
                              :key="index"
                              :index="item.CODESTD"
                              :label="item.NAMESTD"
                              >{{ `${item.CODESTD}-${item.NAMESTD}` }}
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>

                      <!--                  <ep-col :col="12" :lg="12">
                                          <ep-form-item attr="customsNo" label="境内运输工具编号">
                                            <ep-select size='small' v-model="appForm.customsNo" name="customsNo" placeholder="请输入"
                                                       remote :remote-call="customsNoCall" @active-change="customsNoActiveChange">
                      &lt;!&ndash;                        <ep-select-item v-for="(item, index) in transNameValue"
                                                              :key="index" :index="item.value" :label="item.label">
                                              </ep-select-item>&ndash;&gt;
                                            </ep-select>
                                          </ep-form-item>
                                        </ep-col>-->
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="customsNo" label="境内运输工具编号">
                          <ep-search
                            v-model="appForm.customsNo"
                            size="small"
                            name="customsNo"
                            placeholder="请输入"
                            remote
                            :remote-call="customsNoCall"
                            :formatter-item-func="formatterItemFuncCustomsNo"
                            @trigger-item-click="customsNoActiveChange"
                          >
                          </ep-search>
                        </ep-form-item>
                      </ep-col>
                      <!--                  <ep-col :col="12" :lg="12">
                                          <ep-form-item attr="transName" label="境内运输工具名称">
                                            <ep-search size='small' v-model="appForm.transName" name="transName" placeholder="请输入"
                                                       remote :remote-call="transNameCall" @active-change="transNameActiveChange"
                                                       :formatter-item-func="formatterItemFuncTransName"
                                            >
                                            </ep-search>
                                          </ep-form-item>
                                        </ep-col>-->
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="transName" label="境内运输工具名称">
                          <ep-search
                            v-model="appForm.transName"
                            size="small"
                            name="transName"
                            placeholder="请输入"
                            remote
                            :remote-call="transNameCall"
                            :formatter-item-func="formatterItemFuncTransName"
                            @trigger-item-click="transNameActiveChange"
                          >
                          </ep-search>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="nativeVoyageNo" label="境内运输工具航次">
                          <ep-input v-model="appForm.nativeVoyageNo" size="small" name="nativeVoyageNo"></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="validTime" label="预计运抵指运地时间">
                          <!--                      <ep-input size='small' v-model="appForm.validTime" name="validTime"></ep-input>    formatter="YYYYMMdd"-->
                          <ep-date v-model="appForm.validTime"></ep-date>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item v-if="iEFlagIf" attr="iEFlag" label="进出口标志" required>
                          <ep-select
                            v-model="appForm.iEFlag"
                            size="small"
                            name="iEFlag"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in iEFlagValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>

                      <ep-col v-if="!iEFlagIf" :col="12" :lg="12">
                        <ep-form-item attr="iEFlag" label="进出口标志">
                          <ep-select
                            v-model="appForm.iEFlag"
                            size="small"
                            name="iEFlag"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in iEFlagValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="operType" label="操作类型">
                          <!--                      <ep-input size='small' v-model="appForm.operType" name="operType"></ep-input>-->
                          <ep-select
                            v-model="appForm.operType"
                            size="small"
                            name="operType"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in operTypeValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="goodsNote" label="商品备注">
                          <ep-input v-model="appForm.goodsNote" size="small" name="goodsNote"></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <!--                  <ep-col :col="12" :lg="12">
                                          <ep-form-item attr="applCodeScc" label="统一代码" >
                                            <ep-input size='small' v-model="appForm.applCodeScc" name="applCodeScc"></ep-input>
                                          </ep-form-item>
                                        </ep-col>-->

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="contractorCode" label="承运单位代码">
                          <ep-input v-model="appForm.contractorCode" size="small" name="contractorCode"></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="contractor" label="名称">
                          <ep-input v-model="appForm.contractor" size="small" name="contractor"></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="applCode" label="申报单位代码">
                          <ep-input v-model="appForm.applCode" size="small" name="applCode"></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="applName" label="名称">
                          <ep-input v-model="appForm.applName" size="small" name="applName"></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="eSealFlag" label="电子关锁启用标志">
                          <!--                      <ep-input size='small' v-model="appForm.eSealFlag" name="eSealFlag"></ep-input>-->
                          <ep-select
                            v-model="appForm.eSealFlag"
                            size="small"
                            name="eSealFlag"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in eSealFlagValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>
                      <ep-col v-if="trnModeFlag1" :col="12" :lg="12">
                        <ep-form-item attr="trnMode" label="转关类型">
                          <!--                      <ep-input size='small' v-model="appForm.trnMode" name="trnMode"></ep-input>-->
                          <ep-select
                            v-model="appForm.trnMode"
                            size="small"
                            name="trnMode"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in trnModeValue"
                              :key="index"
                              class="trnModeClass"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>
                      <ep-col v-if="trnModeFlag2" :col="12" :lg="12">
                        <ep-form-item attr="trnMode" label="转关类型">
                          <ep-select
                            v-model="appForm.trnMode"
                            size="small"
                            name="trnMode"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in trnModeArr"
                              :key="index"
                              class="trnModeClass"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="trnType" label="转关方式">
                          <ep-select
                            v-model="appForm.trnType"
                            size="small"
                            name="trnType"
                            placeholder="请输入"
                            filterable
                          >
                            <ep-select-item
                              v-for="(item, index) in trnTypeValue"
                              :key="index"
                              :index="item.value"
                              :label="item.label"
                            >
                            </ep-select-item>
                          </ep-select>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="contaCount" label="集装箱总数">
                          <ep-input v-model="appForm.contaCount" size="small" name="contaCount" disabled></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="contaIniCount" label="标箱数">
                          <ep-input
                            v-model="appForm.contaIniCount"
                            size="small"
                            name="contaIniCount"
                            disabled
                          ></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="contaEmptyCount" label="空箱数">
                          <ep-input v-model="appForm.contaEmptyCount" size="small" name="contaEmptyCount"></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="mftGoodsPiece" label="总件数">
                          <ep-input
                            v-model="appForm.mftGoodsPiece"
                            size="small"
                            name="mftGoodsPiece"
                            disabled
                          ></ep-input>
                        </ep-form-item>
                      </ep-col>
                      <ep-col :col="8" :lg="8">
                        <ep-form-item attr="mftGrossWeight" label="总重量(KG)">
                          <ep-input
                            v-model="appForm.mftGrossWeight"
                            size="small"
                            name="mftGrossWeight"
                            disabled
                          ></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <!--                  <ep-col :col="12" :lg="12">

                                          <ep-form-item attr="recvPort" label="进出口岸">
                                            <ep-select size='small' v-model="appForm.recvPort" name="recvPort" placeholder="请输入" :mounted-remote-call="false"
                                                       remote :remote-call="(value,old,callback)=>trafModeRemoteCall(value,callback,'CUSTOMS')" @open="open"
                                            >
                                              <ep-select-item v-for="(item, index) in CUSTOMSValue"
                                                              :key="index" :index="item.CUSTOMS_CO" :label="`${item.CUSTOMS_CO}-${item.CUSTOMS_NA}`">{{`${item.CUSTOMS_CO}-${item.CUSTOMS_NA}`}}
                                              </ep-select-item>
                                            </ep-select>

                                          </ep-form-item>
                                        </ep-col>

                                        <ep-col :col="12" :lg="12">
                                          <ep-form-item attr="sendPort" label="申报口岸">
                                            <ep-select size='small' v-model="appForm.sendPort" name="sendPort" placeholder="请输入" :mounted-remote-call="false"
                                                       remote :remote-call="(value,old,callback)=>trafModeRemoteCall(value,callback,'CUSTOMS')" @open="open">
                                              <ep-select-item v-for="(item, index) in CUSTOMSValue"
                                                              :key="index" :index="item.CUSTOMS_CO" :label="`${item.CUSTOMS_CO}-${item.CUSTOMS_NA}`">{{`${item.CUSTOMS_CO}-${item.CUSTOMS_NA}`}}
                                              </ep-select-item>
                                            </ep-select>
                                          </ep-form-item>
                                        </ep-col>-->
                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="recvPort" label="进出口岸">
                          <ep-input v-model="appForm.recvPort" size="small" name="recvPort" :maxlength="4"></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="sendPort" label="申报口岸">
                          <ep-input v-model="appForm.sendPort" size="small" name="sendPort" :maxlength="4"></ep-input>
                        </ep-form-item>
                      </ep-col>

                      <ep-col :col="12" :lg="12">
                        <ep-form-item attr="note" label="备注">
                          <ep-input v-model="appForm.note" size="small" name="note"></ep-input>
                        </ep-form-item>
                      </ep-col>
                    </ep-row>
                  </ep-form>
                </fieldset>
                <!--            </div>-->
              </ep-col>
            </ep-row>
            <!--表单2-->
            <ep-row slot="contents" :gutter="20">
              <ep-col :col="24">
                <fieldset class="formFieldsetTwo">
                  <legend>提单信息</legend>
                  <ep-form ref="appForm" :form="appFormTwo" name-width="90px" size="small" :rules="page_rules">
                    <ep-row :gutter="7">
                      <ep-col :col="24" :lg="24">
                        <div class="btnFormLeft">
                          <ep-button type="primary" size="small" icon="plus" @click="addClickFormTwo"></ep-button>
                          <ep-button type="danger" size="small" icon="minus-round" @click="delClickFormTwo"></ep-button>
                        </div>
                        <ep-table
                          ref="tableFormTwo"
                          border
                          :data="dataFormTwo"
                          :height="120"
                          size="small"
                          :settings="{
                            firstDeleteThenInsertPK: 'recordNumber'
                          }"
                          :highlight-row="true"
                          :trigger-highlight-row="true"
                          @row-click="rowClickFormTwo"
                          @cell-dblclick="cellDblclickTwo"
                        >
                          <ep-table-item type="num" column="recordNumber" title="序号"></ep-table-item>
                          <ep-table-item column="trafMode" title="运输方式">
                            <template #default="{ row }">
                              {{ transferFormData(row.trafMode, 'TRAF_MODE_STDValue') }}
                            </template>
                          </ep-table-item>
                          <ep-table-item column="shipId" title="运输工具编号"></ep-table-item>
                          <ep-table-item column="shipNameEn" title="船舶名称"></ep-table-item>
                          <ep-table-item column="voyageNo" title="航次"></ep-table-item>
                          <ep-table-item column="billNo" title="提运单"></ep-table-item>
                          <ep-table-item column="iEDate" title="日期"></ep-table-item>
                          <ep-table-item column="packNo" title="件数"></ep-table-item>
                          <ep-table-item column="grossWt" title="重量"></ep-table-item>
                          <ep-table-item column="contaC" title="集装箱数"></ep-table-item>
                          <ep-table-item column="ownerName" title="收货人"></ep-table-item>
                          <ep-table-item column="entryNo" title="报关单号"></ep-table-item>
                          <ep-table-item column="note" title="备注"></ep-table-item>
                        </ep-table>
                      </ep-col>
                    </ep-row>
                  </ep-form>
                </fieldset>
              </ep-col>
            </ep-row>
          </div>
        </ep-col>
        <!--右边布局 -->
        <ep-col :col="12">
          <div class="base-cv cardRight">
            <!--表单3-->
            <ep-row slot="contents" :gutter="20">
              <ep-col :col="24">
                <fieldset class="formFieldsetThree">
                  <legend>集装箱信息</legend>
                  <ep-form ref="appForm" :form="appFormThree" name-width="110px" size="small" :rules="page_rules">
                    <ep-row :gutter="7">
                      <ep-col :col="24" :lg="24">
                        <div class="btnFormRight">
                          <ep-button type="primary" size="small" icon="plus" @click="addClickFormThree"></ep-button>
                          <ep-button
                            type="danger"
                            size="small"
                            icon="minus-round"
                            @click="delClickFormThree"
                          ></ep-button>
                        </div>
                        <ep-table
                          ref="tableFormThree"
                          border
                          :data="dataFormThree"
                          size="small"
                          :height="120"
                          :settings="{ firstDeleteThenInsertPK: 'contaSeqno' }"
                          :highlight-row="true"
                          :trigger-highlight-row="true"
                          @row-click="rowClickFormThree"
                          @cell-dblclick="cellDblclickThree"
                        >
                          <ep-table-item column="recordNumber" title="提单序号"></ep-table-item>
                          <ep-table-item column="contaSeqno" title="集装箱序号"> </ep-table-item>
                          <ep-table-item column="contaNo" title="集装箱号"></ep-table-item>
                          <ep-table-item column="contaModel" title="规格">
                            <template #default="{ row }">
                              {{ transferFormData(row.contaModel, 'CONTA_MODELValue') }}
                            </template>
                          </ep-table-item>
                          <ep-table-item column="eSealId" title="封志号"></ep-table-item>
                          <ep-table-item column="sealNum" title=" 封志个数"></ep-table-item>
                          <ep-table-item column="sealNo" title="电子关锁号"></ep-table-item>
                          <ep-table-item column="transName" title="境内运输工具名称"></ep-table-item>
                          <ep-table-item column="transWeight" title="运输工具实际重量"></ep-table-item>
                        </ep-table>
                      </ep-col>
                    </ep-row>
                  </ep-form>
                </fieldset>
              </ep-col>
            </ep-row>
            <!--表单4-->
            <ep-row slot="contents" :gutter="20">
              <ep-col :col="24">
                <fieldset class="formFieldsetTour">
                  <legend>货物信息</legend>
                  <ep-form ref="appForm" :form="appFormTour" name-width="80px" size="small" :rules="page_rules">
                    <ep-row :gutter="7">
                      <ep-col :col="24" :lg="24">
                        <div class="btnFormRight">
                          <ep-button type="primary" size="small" icon="plus" @click="addClickFormTour"></ep-button>
                          <ep-button
                            type="danger"
                            size="small"
                            icon="minus-round"
                            @click="delClickFormTour"
                          ></ep-button>
                        </div>
                        <ep-table
                          ref="tableFormTour"
                          border
                          :data="dataFormTour"
                          size="small"
                          :height="120"
                          :settings="{ firstDeleteThenInsertPK: 'gNo' }"
                          :highlight-row="true"
                          :trigger-highlight-row="true"
                          @row-click="rowClickFormTour"
                          @cell-dblclick="cellDblclickTour"
                        >
                          <ep-table-item column="recordNumber" title="提单序号"></ep-table-item>
                          <ep-table-item column="gNo" title="商品序号"></ep-table-item>
                          <ep-table-item column="codeTs" title="商品编号">
                            <!--                        <template slot-scope="{row}">
                                                      &lt;!&ndash;                        {{transferFormData(row.codeTs,'COMPLEXValue')}}&ndash;&gt;
                                                      {{transferFormData(row.codeTs,'COMPLEXValue')}}
                                                    </template>-->
                          </ep-table-item>
                          <!--                    <ep-table-item column="codeT" title="附加编号"></ep-table-item>-->
                          <ep-table-item column="gName" title="品名及规格"></ep-table-item>
                          <ep-table-item column="packType" title="包装">
                            <template #default="{ row }">
                              {{ transferFormData(row.packType, 'WRAP_TYPEValue') }}
                            </template>
                          </ep-table-item>
                          <ep-table-item column="goodsPiece" title="件数"></ep-table-item>
                          <ep-table-item column="goodsAmount" title="数量"></ep-table-item>
                          <ep-table-item column="goodsUnit" title="单位">
                            <template #default="{ row }">
                              {{ transferFormData(row.goodsUnit, 'UNIT_STDValue') }}
                            </template>
                          </ep-table-item>
                          <ep-table-item column="goodsWeight" title="重量"></ep-table-item>
                          <ep-table-item column="goodsPrice" title="成交价格"></ep-table-item>
                          <ep-table-item column="goodsCurr" title="币制">
                            <template #default="{ row }">
                              {{ transferFormData(row.goodsCurr, 'CURR_STDValue') }}
                            </template>
                          </ep-table-item>
                        </ep-table>
                      </ep-col>
                    </ep-row>
                  </ep-form>
                </fieldset>
              </ep-col>
            </ep-row>
            <!--表单5-->
            <ep-row slot="contents" :gutter="20">
              <ep-col :col="24">
                <fieldset class="formFieldsetFive">
                  <legend>集装箱-货物 关系</legend>
                  <ep-form ref="appForm" :form="appFormFive" name-width="90px" size="small" :rules="page_rules">
                    <ep-row :gutter="7">
                      <ep-col :col="24" :lg="24">
                        <div class="btnFormRight">
                          <ep-button type="primary" size="small" icon="plus" @click="addClickFormFive"></ep-button>
                          <ep-button
                            type="danger"
                            size="small"
                            icon="minus-round"
                            @click="delClickFormFive"
                          ></ep-button>
                        </div>
                        <ep-table
                          ref="tableFormFive"
                          border
                          :data="dataFormFive"
                          size="small"
                          :height="120"
                          :settings="{ firstDeleteThenInsertPK: 'id' }"
                          :highlight-row="true"
                          :trigger-highlight-row="true"
                          @row-click="rowClickFormFive"
                          @cell-dblclick="cellDblclickFive"
                        >
                          <ep-table-item column="recordNumber" title="提单序号"></ep-table-item>
                          <!--                    <ep-table-item type="num" title="序号"></ep-table-item>-->
                          <ep-table-item column="contaSeqno" title="集装箱序号"></ep-table-item>
                          <ep-table-item column="gNo" title="商品序号"></ep-table-item>
                          <ep-table-item column="contaNo" title="集装箱号"></ep-table-item>
                          <ep-table-item column="contaGoodsCount" title="件数"></ep-table-item>
                          <ep-table-item column="contaGoodsWeight" title="重量" width="110px"></ep-table-item>
                        </ep-table>
                      </ep-col>
                    </ep-row>
                  </ep-form>
                </fieldset>
              </ep-col>
            </ep-row>
          </div>
        </ep-col>
      </ep-row>
    </div>

    <ep-modal v-model="billOfLadingModal" :title="billOfLadingTitleName" width="700px" :wrap-close="false" middle>
      <ep-form
        ref="appFormTwo"
        v-enterToNext
        :form="appFormTwo"
        name-width="100px"
        size="small"
        :rules="billOfLadingRules"
      >
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="trafMode" label="进出境运输方式">
            <ep-select
              v-if="billOfLadingModal"
              v-model="appFormTwo.trafMode"
              size="small"
              name="trafMode"
              placeholder="请输入"
              :mounted-remote-call="false"
              remote
              :remote-call="(value, old, callback) => trafModeRemoteCall(value, callback, 'TRAF_MODE_STD')"
              @open="trafModeOpen"
              @change="activeChange"
            >
              <ep-select-item
                v-for="(item, index) in TRAF_MODE_STDValue"
                :key="index"
                :index="item.CODESTD"
                :label="`${item.CODESTD}-${item.NAMESTD}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="shipId" label="运输工具编号">
            <ep-input v-model="appFormTwo.shipId" size="small" name="shipId"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="shipNameEn" label="船舶名称">
            <ep-input v-model="appFormTwo.shipNameEn" size="small" name="shipNameEn"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="voyageNo" label="航次">
            <ep-input v-model="appFormTwo.voyageNo" size="small" name="voyageNo"></ep-input>
          </ep-form-item>
        </ep-col>
        <!-- 下面原本col为8 现在改为12       -->
        <ep-col v-if="iEFlagIf" :col="11" :lg="11">
          <ep-form-item attr="billNo" label="提单号" required>
            <ep-input v-model="appFormTwo.billNo" size="small" name="billNo"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col v-if="!iEFlagIf" :col="11" :lg="11">
          <ep-form-item attr="billNo" label="提单号">
            <ep-input v-model="appFormTwo.billNo" size="small" name="billNo"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="1" :lg="1">
          <ep-button type="primary" size="small" icon="search" @click="queryBillNO"></ep-button>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaC" label="集装箱数">
            <ep-input v-model="appFormTwo.contaC" size="small" name="contaC"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="packNo" label="件数">
            <ep-input v-model="appFormTwo.packNo" size="small" name="packNo"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="grossWt" label="重量">
            <ep-input v-model="appFormTwo.grossWt" size="small" name="grossWt"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="entryNo" label="报关单号">
            <ep-input v-model="appFormTwo.entryNo" size="small" name="entryNo"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="ownerName" label="收货人">
            <ep-input v-model="appFormTwo.ownerName" size="small" name="ownerName"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="iEDate" label="进出境日期">
            <ep-date v-model="appFormTwo.iEDate" name="iEDate"></ep-date>
            <!--            <ep-input size='small' v-model="appFormTwo.iEDate" name="iEDate"></ep-input>   formatter="YYYYMMdd"-->
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <!--          <ep-form-item attr="note" label="备注">
                      <ep-input size='small' v-model="appFormTwo.note" name="note" type="textarea"
                                :autosize="{ minRows: 1, maxRows: 4}" ></ep-input>
                    </ep-form-item>-->
          <ep-form-item attr="note" label="备注">
            <ep-input v-model="appFormTwo.note" size="small" name="note"></ep-input>
          </ep-form-item>
        </ep-col>
      </ep-form>
      <div slot="footer">
        <ep-button
          v-if="billOfLadingModal"
          ref="billConfig"
          class="modelComfirm"
          type="primary"
          @click="billOfLadingComfirmModel"
          >确定</ep-button
        >
        <ep-button class="modelClose" type="text" @click="billOfLadingCloseModel">取消</ep-button>
      </div>
    </ep-modal>
    <ep-modal v-model="containerModal" :title="containerTitleName" width="700px" :wrap-close="false" middle>
      <ep-form
        ref="appFormThree"
        v-enterToNext
        :form="appFormThree"
        name-width="110px"
        size="small"
        :rules="containerModalRules"
      >
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="recordNumber" label="提单序号">
            <!--            <ep-input size='small' v-model="appFormThree.recordNumber" name="recordNumber" ></ep-input>-->
            <ep-select
              v-model="appFormThree.recordNumber"
              size="small"
              name="recordNumber"
              placeholder="请输入"
              :disabled="conRecordNumberDisabled"
              filterable
              @active-change="rNumActiveChange"
            >
              <ep-select-item
                v-for="(item, index) in dataFormTwo"
                :key="index"
                :index="index + 1"
                :label="`${index + 1}-${item.billNo}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaSeqno" label="集装箱序号">
            <ep-input
              v-model="appFormThree.contaSeqno"
              size="small"
              name="contaSeqno"
              :disabled="conContaSeqnoDisabled"
            ></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaModel" label="规格">
            <!--            <ep-input size='small' v-model="appFormThree.contaModel" name="contaModel"></ep-input>-->
            <ep-select
              v-if="containerModal"
              v-model="appFormThree.contaModel"
              size="small"
              name="contaModel"
              placeholder="请输入"
              :mounted-remote-call="false"
              remote
              :remote-call="(value, old, callback) => trafModeRemoteCall(value, callback, 'CONTA_MODEL')"
              @open="contaModelOpen"
              @change="contaModelChange"
            >
              <ep-select-item
                v-for="(item, index) in CONTA_MODELValue"
                :key="index"
                :index="item.CONTA_MODEL_CO"
                :label="`${item.CONTA_MODEL_CO}-${item.CONTA_MODEL_NAME}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaNo" label="集装箱号">
            <ep-input v-model="appFormThree.contaNo" size="small" name="contaNo" @blur="contaNoBlur"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="transName" label="境内运输工具名称">
            <ep-input v-model="appFormThree.transName" size="small" name="transName"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="transWeight" label="运输工具实际重量">
            <ep-input v-model="appFormThree.transWeight" size="small" name="transWeight"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="8" :lg="8">
          <ep-form-item attr="eSealId" label="封志（关锁）号">
            <ep-input v-model="appFormThree.eSealId" size="small" name="eSealId"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="8" :lg="8">
          <ep-form-item attr="sealNum" label="封志个数">
            <ep-input v-model="appFormThree.sealNum" size="small" name="sealNum"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="8" :lg="8">
          <ep-form-item attr="sealNo" label="电子关锁号">
            <ep-input v-model="appFormThree.sealNo" size="small" name="sealNo"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="conta1" label="备注">
            <ep-input v-model="appFormThree.conta1" size="small" name="conta1"></ep-input>
          </ep-form-item>
        </ep-col>
      </ep-form>
      <div slot="footer">
        <ep-button
          v-if="containerModal"
          ref="containerConfig"
          class="modelComfirm btnComfirm"
          type="primary"
          @click="containerModalComfirmModel"
          >确定</ep-button
        >
        <ep-button class="modelClose btnClose" type="text" @click="containerModalCloseModel">取消</ep-button>
      </div>
    </ep-modal>
    <ep-modal v-model="goodsModal" :title="goodsTitleName" width="700px" :wrap-close="false" middle class="classGoods">
      <ep-form
        ref="appFormTour"
        v-enterToNext
        :form="appFormTour"
        name-width="100px"
        size="small"
        :rules="goodsModalRules"
      >
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="recordNumber" label="提单序号">
            <!--            <ep-input size='small' v-model="appFormTour.recordNumber" name="recordNumber"></ep-input>-->
            <ep-select
              v-model="appFormTour.recordNumber"
              size="small"
              name="recordNumber"
              placeholder="请输入"
              :disabled="goodRecordNumberDisabled"
              filterable
            >
              <ep-select-item
                v-for="(item, index) in dataFormTwo"
                :key="index"
                :index="index + 1"
                :label="`${index + 1}-${item.billNo}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="gNo" label="商品序号">
            <ep-input v-model="appFormTour.gNo" size="small" name="gNo" :disabled="goodGNoDisabled"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="goodsCurr" label="币制">
            <ep-select
              v-model="appFormTour.goodsCurr"
              size="small"
              name="goodsCurr"
              placeholder="请输入"
              :mounted-remote-call="false"
              remote
              :remote-call="(value, old, callback) => trafModeRemoteCall(value, callback, 'CURR_STD')"
              @open="goodsCurrOpen"
              @change="goodsCurrChange"
            >
              <ep-select-item
                v-for="(item, index) in CURR_STDValue"
                :key="index"
                :index="item.CODESTD"
                :label="`${item.CODESTD}-${item.NAMESTD}`"
              >
                <!-- :key="index"       :index="item.CODESTD" :label="`${item.NAMESTD}-${item.ENAMESTD}`"               -->
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <!--        <ep-col :col="12" :lg="12">
                  <ep-form-item attr="codeTs" label="商品编号">
                    <ep-select size='small' v-model="appFormTour.codeTs"  name="codeTs" placeholder="请输入" :mounted-remote-call="false"
                               remote :remote-call="(value,old,callback)=>trafModeRemoteCall(value,callback,'COMPLEX')"
                               @active-change="codeTsChange" @open="codeTsOpen" @change="codeTsChangeFn" :maxlength="10">
        &lt;!&ndash;:label="`${item.CODE_TS}-${item.G_NAME}`"              &ndash;&gt;
                      <ep-select-item  v-for="(item, index) in COMPLEXValue"
                                      :key="index" :index="item.CODE_TS" :label="`${item.CODE_TS}`" >{{`${item.CODE_TS}-${item.G_NAME}`}}
                      </ep-select-item>
                    </ep-select>
                  </ep-form-item>
                </ep-col>-->
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="codeTs" label="商品编号">
            <ep-search
              v-model="appFormTour.codeTs"
              size="small"
              name="codeTs"
              placeholder="请输入"
              :maxlength="10"
              remote
              :remote-call="codeTsRemoteCall"
              :formatter-item-func="formatterItemFunccodeTs"
              @trigger-item-click="codeTsNoActiveChange"
            >
              <!--  @change="codeTsChangeFn"               -->
            </ep-search>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="gName" label="品名及规格">
            <ep-input v-model="appFormTour.gName" size="small" name="gName"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="goodsPrice" label="成交价格">
            <ep-input v-model="appFormTour.goodsPrice" size="small" name="goodsPrice"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="8" :lg="8">
          <ep-form-item attr="goodsPiece" label="件数">
            <ep-input v-model="appFormTour.goodsPiece" size="small" name="goodsPiece"></ep-input>
          </ep-form-item>
        </ep-col>
        <ep-col :col="8" :lg="8">
          <ep-form-item attr="goodsAmount" label="数量">
            <ep-input v-model="appFormTour.goodsAmount" size="small" name="goodsAmount"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="8" :lg="8">
          <ep-form-item attr="goodsUnit" label="单位" class="goodsUnit">
            <ep-select
              v-model="appFormTour.goodsUnit"
              size="small"
              name="goodsUnit"
              placeholder="请输入"
              :mounted-remote-call="false"
              remote
              :remote-call="(value, old, callback) => trafModeRemoteCall(value, callback, 'UNIT_STD')"
              @open="goodsUnitOpen"
              @change="goodsUnitChange"
            >
              <ep-select-item
                v-for="(item, index) in UNIT_STDValue"
                :key="index"
                :index="item.CODESTD"
                :label="item.CODESTD ? `${item.CODESTD}-${item.NAMESTD}` : ''"
              >
              </ep-select-item>
              <!--  :label="item.CODESTD ?`${item.CODESTD}-${item.NAMESTD}` : ''"           :label="`${item.CODESTD}-${item.NAMESTD}`" -->
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="8" :lg="8">
          <ep-form-item attr="packType" label="包装" class="packType">
            <ep-select
              v-model="appFormTour.packType"
              size="small"
              name="packType"
              placeholder="请输入"
              :mounted-remote-call="false"
              remote
              :remote-call="(value, old, callback) => trafModeRemoteCall(value, callback, 'WRAP_TYPE')"
              @open="packTypeOpen"
              @change="packTypeChange"
            >
              <ep-select-item
                v-for="(item, index) in WRAP_TYPEValue"
                :key="index"
                :index="item.WRAP_CODE"
                :label="item.WRAP_CODE ? `${item.WRAP_CODE}-${item.WRAP_NAME}` : ''"
              >
              </ep-select-item>
              <!--   :label="`${item.WRAP_CODE}-${item.WRAP_NAME}`"           -->
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="8" :lg="8">
          <ep-form-item attr="goodsWeight" label="重量（KG）">
            <ep-input v-model="appFormTour.goodsWeight" size="small" name="goodsWeight"></ep-input>
          </ep-form-item>
        </ep-col>
      </ep-form>
      <div slot="footer">
        <ep-button
          v-if="goodsModal"
          ref="goodsConfig"
          class="modelComfirm btnComfirm"
          type="primary"
          @click="goodsModalComfirmModel"
          >确定</ep-button
        >
        <ep-button class="modelClose btnClose" type="text" @click="goodsModalCloseModel">取消</ep-button>
      </div>
    </ep-modal>
    <ep-modal v-model="containerGoodsModal" :title="containerGoodsTitleName" width="700px" :wrap-close="false" middle>
      <ep-form
        ref="appFormFive"
        v-enterToNext
        :form="appFormFive"
        name-width="100px"
        size="small"
        :rules="containerGoodsModalRules"
      >
        <ep-col :col="12" :lg="12">
          <ep-form-item attr="recordNumber" label="提单序号" required>
            <!--            <ep-input size='small' v-model="appFormFive.recordNumber" name="recordNumber"></ep-input>-->
            <ep-select
              v-model="appFormFive.recordNumber"
              size="small"
              name="recordNumber"
              placeholder="请输入"
              :disabled="containersGoodSDisabled"
              filterable
              @active-change="recordNumberActiveChange"
            >
              <ep-select-item
                v-for="(item, index) in dataFormTwo"
                :key="index"
                :ext-obj="item"
                :index="index + 1"
                :label="`${index + 1}-${item.billNo}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaGoodsCount" label="件数">
            <ep-input v-model="appFormFive.contaGoodsCount" size="small" name="contaGoodsCount"></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="gNo" label="商品序号" required>
            <!--            <ep-input size='small' v-model="appFormFive.gNo" name="gNo" ></ep-input>@change="gNoActiveChange"-->
            <ep-select
              v-model="appFormFive.gNo"
              size="small"
              name="gNo"
              placeholder="请输入"
              :disabled="containersGoodSDisabled"
              filterable
            >
              <ep-select-item
                v-for="(item, index) in gNoSelect"
                :key="index"
                :index="index + 1"
                :label="`${index + 1}-${item.codeTs}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaNo" label="集装箱号">
            <ep-input v-model="appFormFive.contaNo" size="small" name="contaNo" disabled></ep-input>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaSeqno" label="集装箱序号" required>
            <!--            <ep-input size='small' v-model="appFormFive.contaSeqno" name="contaSeqno" ></ep-input>-->
            <ep-select
              v-model="appFormFive.contaSeqno"
              size="small"
              name="contaSeqno"
              placeholder="请输入"
              :disabled="containersGoodSDisabled"
              filterable
              @change="contaSeqnoChange"
            >
              <ep-select-item
                v-for="(item, index) in contaNoSelect"
                :key="index"
                :index="index + 1"
                :label="`${index + 1}-${item.contaNo}`"
              >
              </ep-select-item>
            </ep-select>
          </ep-form-item>
        </ep-col>

        <ep-col :col="12" :lg="12">
          <ep-form-item attr="contaGoodsWeight" label="重量">
            <ep-input v-model="appFormFive.contaGoodsWeight" size="small" name="contaGoodsWeight"></ep-input>
          </ep-form-item>
        </ep-col>
      </ep-form>
      <div slot="footer">
        <ep-button
          v-if="containerGoodsModal"
          ref="containerGoodsConfig"
          class="modelComfirm btnComfirm"
          type="primary"
          @click="containerGoodsComfirmModel"
          >确定</ep-button
        >
        <ep-button class="modelClose btnClose" type="text" @click="containerGoodsCloseModel">取消</ep-button>
      </div>
    </ep-modal>
    <ep-modal
      v-model="checkModal"
      title="校验结果展示"
      width="700px"
      height="230px"
      moveable
      :before-close="beforeModel"
    >
      <div class="modalContent_scroll">
        <ep-table
          ref="tableModal"
          :data="checkData"
          :height="700"
          head-color
          border
          size="small"
          :settings="{ firstDeleteThenInsertPK: 'id' }"
        >
          <ep-table-item type="num" title="序号"></ep-table-item>
          <ep-table-item column="note" title="字段名">
            <template #default="scope">{{ scope.row.verifyItem[0].note }}</template>
          </ep-table-item>
          <ep-table-item column="versionName" title="检验类型"></ep-table-item>
          <ep-table-item column="message" title="错误信息"></ep-table-item>
        </ep-table>
      </div>
    </ep-modal>

    <ep-modal
      v-model="initTemp"
      title="初始值模板选择"
      width="700px"
      height="230px"
      moveable
      :before-close="initTempModel"
    >
      <div>从以下模板中选择想用的初始值模板，请选择：</div>
      <ep-table
        ref="table"
        :data="initTempData"
        :height="700"
        head-color
        border
        size="small"
        :settings="{ firstDeleteThenInsertPK: 'id' }"
      >
        <ep-table-item type="select"></ep-table-item>
        <ep-table-item column="templateNo" title="模板编号"></ep-table-item>
        <ep-table-item column="templateName" title="模板名称"></ep-table-item>
        <ep-table-item column="createTime" title="创建时间"></ep-table-item>
      </ep-table>
      <div slot="footer">
        <ep-button type="primary" class="modelComfirm" @click="canfirmInitTemp">确定</ep-button>
        <ep-button type="text" class="modelClose" @click="cancelInitTemp">取消</ep-button>
      </div>
    </ep-modal>
  </div>
</template>

<script>
import misList from 'src/base/mixins/mislist'
import { post, cloneObj, transResultChannel, dateFormatter, isNull, isEmpty } from 'utils'
import { calaulatorSign as _calaulatorSign, getToken, request, restGet } from 'utils/index'
import CryptoAes from 'utils/bill/cryptoAes.js'
import store from 'src/store'
import md5 from 'blueimp-md5'
import { translateToSWGD } from 'src/api/bill'
import Vue from 'vue'
import changeLevelPrint from 'assets/js/changeLevelPrint.js'
import settings from 'src/settings.json'
import { queryCompanys } from 'src/api'
import { getUserExt } from 'utils/trans/trans'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'TransDeclare',
  directives: {
    //form表单enter键代替tab键换行
    enterToNext: {
      update: function (el, binding, vnode) {
        //inserted  update
        let _this = vnode.context
        let inputs = el.querySelectorAll('input')
        let buttons = el.querySelectorAll('button')

        /*let drop=document.querySelectorAll(".ep-select-list");  //获取select的option dom节点
        for(let i = 0; i <drop.length ; i++){
          if(drop[i].children[0] !== undefined){
           drop[i].children[0].style.cssText="display:none;"
          }
        }*/

        let drop = document.querySelectorAll('.goodsUnit .ep-select-list') //获取select的option dom节点
        for (let i = 0; i < drop.length; i++) {
          if (drop[i].children[0] !== undefined) {
            drop[i].children[0].style.cssText = 'display:none;'
          }
        }
        let dropPackType = document.querySelectorAll('.packType .ep-select-list') //获取select的option dom节点
        for (let i = 0; i < dropPackType.length; i++) {
          if (dropPackType[i].children[0] !== undefined) {
            dropPackType[i].children[0].style.cssText = 'display:none;'
          }
        }

        inputs = [...inputs]
        //提单号 查询按钮排到提单后
        buttons[0] && inputs.splice(5, 0, buttons[0])

        const disabledInupts = inputs.filter((v) => v.disabled)
        disabledInupts.forEach((disV) => {
          const index = inputs.findIndex((inputV) => disV.name === inputV.name)
          if (index !== -1) {
            inputs.splice(index, 1)
          }
        })

        for (var i = 0; i < inputs.length; i++) {
          var attrIndex = inputs[i].getAttribute('keyFocusIndex')
          if (attrIndex || attrIndex == 0) {
            return
          }

          inputs[i].setAttribute('keyFocusIndex', i)
          inputs[i].addEventListener('keydown', (ev) => {
            //添加keydown事件：下拉框没有keyup事件
            if (ev.keyCode === 13) {
              let targetTo = ev.srcElement.getAttribute('keyFocusTo') //返回指定属性名的属性值
              if (targetTo) {
                this.$refs[targetTo].$el.focus()
              } else {
                var attrIndex = ev.srcElement.getAttribute('keyFocusIndex')
                var ctlI = parseInt(attrIndex)
                if (ctlI < inputs.length - 1) {
                  inputs[ctlI + 1].focus()
                } else if (ctlI == inputs.length - 1) {
                  _this.$nextTick(() => {
                    if (_this.$refs.billConfig) {
                      _this.$refs.billConfig.$el.click()
                    } else if (_this.$refs.containerConfig) {
                      _this.$refs.containerConfig.$el.click()
                    } else if (_this.$refs.goodsConfig) {
                      _this.$refs.goodsConfig.$el.click()
                    } else if (_this.$refs.containerGoodsConfig) {
                      _this.$refs.containerGoodsConfig.$el.click()
                    }
                  })
                }
              }
            }
          })
        }
      }
    }
  },
  extends: misList,
  mixins: [changeLevelPrint],
  data() {
    return {
      customsBillNo: '',
      customsVoyageNo: '',
      customsTrafName: '',
      bills: [],
      trnModeFlag1: true,
      trnModeFlag2: true,
      trnModeArr: [
        { value: '1', label: '转关提前' },
        { value: 'AA', label: '出口二次转关' },
        { value: '1G', label: '提前/工厂验放' },
        { value: '1T', label: '提前/暂时进出口' },
        { value: '1E', label: '提前/中欧班列' },
        { value: '1P', label: '提前/市场采购出口' },
        { value: '1K', label: '提前/出口空运联程' }
      ],
      buttonFlag: true,
      containersGoodSDisabled: false,
      // containersDisabled:false,
      conContaSeqnoDisabled: false,
      conRecordNumberDisabled: false,
      //goodsDisabled:false,
      goodGNoDisabled: false,
      goodRecordNumberDisabled: false,

      settings: {
        pk: 'id'
      },
      tableNameList: ['COMPLEX', 'UNIT_STD', 'WRAP_TYPE', 'CURR_STD', 'CUSTOMS', 'TRAF_MODE_STD', 'CONTA_MODEL'],
      billOfLadingModal: false,
      billOfLadingRules: {},
      containerModal: false,
      containerModalRules: {},
      goodsModal: false,
      goodsModalRules: {},
      containerGoodsModal: false,
      containerGoodsModalRules: {},
      checkModal: false,
      tableModal: {},
      appForm: {
        status: '',
        transPreId: '',
        preNo: '',
        trafWay: '',
        customsNo: '',
        transName: '',
        nativeVoyageNo: '',
        validTime: '',
        contractorCode: '',
        contractor: '',
        applCode: '',
        applName: '',
        trnType: '',
        contaCount: '',
        contaIniCount: '',
        contaEmptyCount: '',
        mftGoodsPiece: '',
        mftGrossWeight: '',
        eSealFlag: '',
        applCodeScc: '',
        note: '',

        iEFlag: '',
        recvPort: '',
        sendPort: '',
        trnMode: '',
        goodsNote: '',
        copSeqNo: '',
        operType: '',
        templateName: ''
        //templateNo:''
      },
      appFormTwo: {
        trafMode: '',
        shipId: '',
        shipNameEn: '',
        iEDate: '',
        voyageNo: '',
        billNo: '',
        contaC: '',
        packNo: '',
        grossWt: '',
        ownerName: '',
        entryNo: '',
        note: '',

        // headID:'',
        recordNumber: ''
      },
      appFormThree: {
        contaNo: '',
        contaModel: '',
        eSealId: '',
        sealNum: '',
        sealNo: '',
        transName: '',
        transWeight: '',

        // headID:'',
        recordNumber: '',
        contaSeqno: '',
        conta1: ''
      },
      appFormTour: {
        codeTs: '',
        codeS: '',
        gName: '',
        packType: '',
        goodsPiece: '',
        goodsAmount: '',
        goodsWeight: '',
        goodsUnit: '',
        goodsPrice: '',
        goodsCurr: '',

        recordNumber: '',
        gNo: ''
      },
      appFormFive: {
        contaNo: '',
        contaGoodsCount: '',
        contaGoodsWeight: '',

        //headID:'',
        recordNumber: '',
        gNo: '',
        contaSeqno: ''
      },
      page_rules: {},
      dataFormTwo: [],
      dataFormThree: [],
      dataFormTour: [],
      dataFormFive: [],
      rowClickFormTwoIndex: '',
      rowClickFormThreeIndex: '',
      rowClickFormTourIndex: '',
      rowClickFormFourIndex: '',
      indexTwo: '',
      indexThree: '',
      indexTour: '',
      indexFive: '',
      id: '',
      row: '',
      flagTwo: '',
      showData: '',
      refreshModal: false,
      refreshModalForm: {
        id: ''
      },
      refreshModalRules: {},
      title: '',
      flag: '',
      appId: '',
      checkData: [],
      //转关方式
      trnTypeValue: [
        { value: '0', label: '普通有纸申报' },
        { value: '1', label: '无纸申报' }
      ],
      //进出口标志
      iEFlagValue: [
        { value: 'I', label: '进口' },
        { value: 'E', label: '出口' }
      ],
      //转关类型
      trnModeValue: [
        // {value: '', label: ''},
        { value: '22', label: '直转' },
        { value: '33', label: '批量中转' },
        { value: '66', label: '快件' },
        { value: '77', label: '退运' },
        { value: '88', label: '过境' },
        { value: '99', label: '沿海内支' },
        { value: 'YY', label: '免税转展品' },
        { value: 'ZZ', label: '其他' }
      ],
      //状态
      statusValue: [
        { value: '0', label: '暂存' },
        { value: '1', label: '保存' },
        { value: '2', label: '发送' },
        { value: '3', label: '入海关库失败' },
        { value: '4', label: '入海关库成功' },
        { value: '5', label: '海关回执文件错' },
        { value: '6', label: 'amtrix处理失败' },
        { value: '7', label: 'amtrix处理成功' },
        { value: '8', label: '信息请求待发送' },
        { value: '9', label: '提单信息请求成功' },
        { value: 'E', label: '海关审批未通过' },
        { value: 'G', label: '海关审批通过' },
        { value: 'H', label: '提单修改不成功' },
        { value: 'K', label: '自动审核不通过' },
        { value: 'L', label: '海关接受通知' },
        { value: 'M', label: '修改提单成功' },
        { value: 'R', label: '自动审核通过放行' },
        { value: 'eee', label: '海关退单' }
      ],
      //自动审核不通过 海关审批未通过 eee海关退单 暂存
      //

      //操作类型
      operTypeValue: [
        { value: 'B', label: '暂存' },
        { value: 'C', label: '申报' }
      ],
      billOfLadingTitleName: '',
      dataFormTwoCellDIndex: null,
      containerTitleName: '',
      dataFormThreeCellDIndex: null,
      goodsTitleName: '',
      dataFormTourCellDIndex: null,
      containerGoodsTitleName: '',
      dataFormFiveCellDIndex: null,
      copyTitle: '',
      copyFlag: '',
      copyData: {},
      copyId: '',
      addTitle: '',
      addFlag: '',
      addId: '',
      TRAF_MODE_STDValue: [], //TRAF_MODE_STD  trafWayValue
      CUSTOMSValue: [], // CUSTOMS    recvPortValue
      CURR_STDValue: [], // CURR_STD  goodsCurrValue
      WRAP_TYPEValue: [], //WRAP_TYPE   packTypeValue
      UNIT_STDValue: [], // UNIT_STD goodsUnitValue
      COMPLEXValue: [], // COMPLEX  gNameValue
      CONTA_MODELValue: [],

      //btnFlagHold:true,
      btnFlag: false,
      //btnFlagClose:false,
      btnFlagPrint: false,
      //btnFlagSend:true,

      status: '',
      refreshFlag: false,
      selectData: JSON.parse(window.localStorage.getItem('selectObj')),
      recordNumberContainer: '',
      recordNumberGNo: '',
      contaNoSelect: [], //集装箱-货物 关系 集装箱序号 下拉框data值
      gNoSelect: [], //集装箱-货物 关系 商品序号 下拉框data值
      extObj: {},
      container: [], //集装箱提单下拉框调接口返回的集装箱数据
      billContainer: {}, //提单号查询返回的数据
      eSealFlagValue: [
        { value: 'Y', label: '启用电子关锁' },
        { value: 'N', label: '不启用电子关锁' }
      ],
      eSealFlagQuery: '',
      TRAFData: [], //打印按钮的数据
      configurationTitle: '',
      configurationFlag: '',
      configurationeSealFlag: '',
      configurationIf: true,
      configurationAppId: '',
      iEFlagIf: true,
      //初始值模板弹出框相关数据
      initTemp: false,
      initTempData: [],
      transNameList: [],
      customsNoList: [],
      trafWayOneValue: '', //境内运输方式中选中的值

      codeTsData: []
    }
  },
  computed: {
    selectList() {
      return this.selectData || {}
    },
    userExt() {
      return this.$store.getters.getUserExt
    }
  },
  watch: {
    bills: {
      handler(e) {
        if (Object.keys(e).length) {
          //提单
          //let FORM_HEAD={}
          //保留最新的一条 覆盖之前的做法是有问题的，会把缓存的数据清掉
          // 输入报关单的去判断转关单的4个是否有值，有值就覆盖，没值就覆盖
          /*  if(!isNull(e.T_SWGD_FORM_HEAD.trafMode) || !isNull(e.T_SWGD_FORM_HEAD.trafName) || !isNull(e.T_SWGD_FORM_HEAD.voyageNo) || !isNull(e.T_SWGD_FORM_HEAD.billNo)){
            FORM_HEAD.trafMode=e.T_SWGD_FORM_HEAD.trafMode //运输方式 trafModeStd
            FORM_HEAD.shipNameEn=e.T_SWGD_FORM_HEAD.trafName //运输工具名称 /船舶
            FORM_HEAD.voyageNo=e.T_SWGD_FORM_HEAD.voyageNo //航次
            FORM_HEAD.billNo=e.T_SWGD_FORM_HEAD.billNo //提单号
            //this.dataFormTwo=[]
            //如果有length 就覆盖
            if(this.dataFormTwo && this.dataFormTwo.length){
              this.dataFormTwo[0] = Object.assign(this.dataFormTwo[0],FORM_HEAD)
              //触发数组更新
              this.dataFormTwo.splice(0,0)
            }else{
              //没有length，就添加
              this.dataFormTwo.push(FORM_HEAD)
            }
            //this.dataFormTwo.push(FORM_HEAD)
            console.log(this.dataFormTwo,'this.dataFormTwo')
            window.parent.postMessage(
                JSON.stringify({
                  type:'transObj',
                  appForm: this.appForm,
                  dataFormTwo:this.dataFormTwo,
                  dataFormThree:this.dataFormThree,
                  dataFormTour:this.dataFormTour,
                  dataFormFive:this.dataFormFive,
                }), global.CUSTOMSURL);
          }
*/
          let FORM_HEAD = {}
          //当提单信息表格有值，4个输入框有值，就不带入；没值，哪个没值哪个带入;提单信息没值，报关数据带到转关提单信息表
          if (this.dataFormTwo && this.dataFormTwo.length) {
            //提单信息表格有值
            //如果运输方式不为空，就把报关单的数据带到转关
            if (!this.dataFormTwo[0].trafMode) {
              //判断提单信息里面的input
              this.dataFormTwo[0].trafMode = e.T_SWGD_FORM_HEAD.trafMode
              //this.$set(this.dataFormTwo[0],'trafMode',e.T_SWGD_FORM_HEAD.trafMode)
            }
            /*if (!this.dataFormTwo[0].shipNameEn) {
              this.dataFormTwo[0].shipNameEn = e.T_SWGD_FORM_HEAD.trafName
            }
            if (!this.dataFormTwo[0].voyageNo) {
              this.dataFormTwo[0].voyageNo = e.T_SWGD_FORM_HEAD.voyageNo
            }
            if (!this.dataFormTwo[0].billNo) {
             this.dataFormTwo[0].billNo = e.T_SWGD_FORM_HEAD.billNo
            }*/
          } else {
            //没值
            //这个if是用来解决第一次进来数据为空，提单信息表格还会增加一条的问题
            if (
              !isNull(e.T_SWGD_FORM_HEAD.trafMode) ||
              !isNull(e.T_SWGD_FORM_HEAD.trafName) ||
              !isNull(e.T_SWGD_FORM_HEAD.voyageNo) ||
              !isNull(e.T_SWGD_FORM_HEAD.billNo)
            ) {
              FORM_HEAD.trafMode = e.T_SWGD_FORM_HEAD.trafMode //运输方式 trafModeStd
              /*FORM_HEAD.shipNameEn = e.T_SWGD_FORM_HEAD.trafName //运输工具名称 /船舶
              FORM_HEAD.voyageNo = e.T_SWGD_FORM_HEAD.voyageNo //航次
              FORM_HEAD.billNo = e.T_SWGD_FORM_HEAD.billNo //提单号*/
              this.dataFormTwo = []
              this.dataFormTwo.push(FORM_HEAD)
            }
          }
          window.parent.postMessage(
            JSON.stringify({
              type: 'transObj',
              appForm: this.appForm,
              dataFormTwo: this.dataFormTwo,
              dataFormThree: this.dataFormThree,
              dataFormTour: this.dataFormTour,
              dataFormFive: this.dataFormFive
            }),
            global.CUSTOMSURL
          )

          //商品/货物
          let FORM_LIST = []
          e.T_SWGD_FORM_LIST &&
            e.T_SWGD_FORM_LIST.forEach((item, index) => {
              item.recordNumber = '1'
              item.gNo = index + 1 //商品序号   报关的商品序号没有在数据节点里面
              //item.goodsCurr=item.tradeCurr  //币制
              item.goodsCurr = item.tradeCurrStd //币制
              item.gName = item.gName // 商品名称  品名及规格
              //item.goodsAmount=item.qtyConv //数量
              item.codeTs = item.codeTS //商品编号codeT codeS
              FORM_LIST.push(item)
              //console.log(FORM_LIST, 'FORM_LIST')
            })
          this.dataFormTour = FORM_LIST

          //集装箱 如果有就不带 如果没有 就全带过去
          if (!this.dataFormThree.length) {
            let CONTAINER = []
            e.T_SWGD_FORM_CONTAINER &&
              e.T_SWGD_FORM_CONTAINER.forEach((item, index) => {
                item.recordNumber = '1'
                item.contaSeqno = index + 1 //集装箱序号
                //item.contaSeqno=item.containerNo  //集装箱序号
                item.contaNo = item.containerId //集装箱号
                var regex1 = /[A-Z][a-z]?\d*/g
                item.contaModel = item.containerMdStdCn ? item.containerMdStdCn.match(regex1)[0] : '' //规格
                CONTAINER.push(item)
                //console.log(CONTAINER, 'CONTAINER')
              })
            this.dataFormThree = CONTAINER
            window.parent.postMessage(
              JSON.stringify({
                type: 'transObj',
                appForm: this.appForm,
                dataFormTwo: this.dataFormTwo,
                dataFormThree: this.dataFormThree,
                dataFormTour: this.dataFormTour,
                dataFormFive: this.dataFormFive
              }),
              global.CUSTOMSURL
            )
          }

          //集装箱-货物 关系
          if (!this.dataFormFive.length) {
            let CONTAINERGOOD = []
            e.T_SWGD_FORM_CONTAINER &&
              e.T_SWGD_FORM_CONTAINER.forEach((item, index) => {
                item.recordNumber = '1' //提单序号
                item.contaNo = item.containerId //集装箱号
                item.gNo = item.goodsNo //商品序号
                item.contaSeqno = index + 1 //集装箱序号
                if (item.gNo) {
                  CONTAINERGOOD.push(item)
                }
                // console.log(CONTAINERGOOD, 'CONTAINER')
              })
            this.dataFormFive = CONTAINERGOOD
            window.parent.postMessage(
              JSON.stringify({
                type: 'transObj',
                appForm: this.appForm,
                dataFormTwo: this.dataFormTwo,
                dataFormThree: this.dataFormThree,
                dataFormTour: this.dataFormTour,
                dataFormFive: this.dataFormFive
              }),
              global.CUSTOMSURL
            )
          }
        }
      }
    },
    customsBillNo: {
      handler(e) {
        console.log(e, 'eeeeeeeeeeeeeeee')
        if (this.dataFormTwo && this.dataFormTwo.length) {
          //提单信息表格有值
          //如果运输方式不为空，就把报关单的数据带到转关
          if (!this.dataFormTwo[0].billNo) {
            this.$set(this.dataFormTwo[0], 'billNo', e)
          }
        } else {
          let obj = {}
          obj.billNo = e
          this.dataFormTwo = []
          this.dataFormTwo.push(obj)
        }
      }
    },
    customsTrafName: {
      handler(e) {
        if (this.dataFormTwo && this.dataFormTwo.length) {
          //提单信息表格有值
          //如果运输方式不为空，就把报关单的数据带到转关
          if (!this.dataFormTwo[0].shipNameEn) {
            this.$set(this.dataFormTwo[0], 'shipNameEn', e)
          }
        } else {
          let obj = {}
          obj.shipNameEn = e
          this.dataFormTwo = []
          this.dataFormTwo.push(obj)
        }
      }
    },
    customsVoyageNo: {
      handler(e) {
        if (this.dataFormTwo && this.dataFormTwo.length) {
          //提单信息表格有值
          //如果运输方式不为空，就把报关单的数据带到转关
          if (!this.dataFormTwo[0].voyageNo) {
            this.$set(this.dataFormTwo[0], 'voyageNo', e)
          }
        } else {
          let obj = {}
          obj.voyageNo = e
          this.dataFormTwo = []
          this.dataFormTwo.push(obj)
        }
      }
    },
    dataFormTwo: {
      handler(now, old) {
        //console.log(now,'now------------------')
        if (!now) return
        //window.parent.postMessage(JSON.stringify({ dataFormTwo:now}), 'http://localhost:3003/');
        window.parent.postMessage(
          JSON.stringify({
            appForm: this.appForm,
            dataFormTwo: now,
            dataFormThree: this.dataFormThree,
            dataFormTour: this.dataFormTour,
            dataFormFive: this.dataFormFive,
            userExt: getUserExt(this.userExt),
            token: getToken()
          }),
          global.CUSTOMSURL
        )
        //件数
        let i = 0
        //重量
        let j = 0
        now.map((item) => {
          //if(isNaN(item.packNo)) return
          let packNo = item.packNo / 1
          i = packNo += i
          this.appForm.mftGoodsPiece = i
          /*
            let grossWt= item.grossWt
            //j= grossWt += j
            j += grossWt
            this.appForm.mftGrossWeight=j
           */
          let num1, num2, max // num1--j  num2-- item
          try {
            num1 = j.toString().split('.')[1].length
          } catch (e) {
            num1 = 0
          } //判断小数位的长度
          try {
            num2 = item.grossWt.toString().split('.')[1].length
          } catch (e) {
            num2 = 0
          }
          const temp = Math.pow(10, Math.max(num1, num2)) //取小数点位数大的去乘
          j = (j * temp + item.grossWt * temp) / temp
        })
        this.appForm.mftGrossWeight = j.toFixed(2)
        //如果是NaN就设为空
        if (isNaN(this.appForm.mftGrossWeight)) {
          this.appForm.mftGrossWeight = ''
        }
        if (isNaN(this.appForm.mftGoodsPiece)) {
          this.appForm.mftGoodsPiece = ''
        }
      },
      deep: true,
      immediate: true
    },
    /*dataFormThree(nowCon,old){
      //总数
      const contaCount=[]
      nowCon.forEach(item=>{
        if(item.contaModel==='N') return
        contaCount.push(item.contaModel)
      })
      this.appForm.contaCount=contaCount.length
      //标箱数
      let arr=[]
      nowCon.map(item=>{
        if(item.contaModel) {
          let contaModelL
          if(item.contaModel==='L') {
           contaModelL=parseInt(2+`${item.contaModel}`);
          }else if(item.contaModel==='S') {
            contaModelL=parseInt(1+`${item.contaModel}`);
          }else if(item.contaModel==='N') {
            contaModelL=parseInt(0+`${item.contaModel}`);
          }
          arr.push(contaModelL)
        }
        let sum=arr.reduce(function(a,b){
          return parseInt(a)+parseInt(b)
        },0)
          this.appForm.contaIniCount=sum
      })
    },*/
    dataFormThree: {
      handler(nowCon, old) {
        //window.parent.postMessage(JSON.stringify({ dataFormThree:nowCon}), 'http://localhost:3003/');
        window.parent.postMessage(
          JSON.stringify({
            appForm: this.appForm,
            dataFormTwo: this.dataFormTwo,
            dataFormThree: nowCon,
            dataFormTour: this.dataFormTour,
            dataFormFive: this.dataFormFive,
            userExt: getUserExt(this.userExt),
            token: getToken()
          }),
          global.CUSTOMSURL
        )
        //集装箱总数
        /* const contaCount=[]
         nowCon.forEach(item=>{
           if(item.contaModel==='N') return
           contaCount.push(item.contaModel)
         })
         this.appForm.contaCount=contaCount.length*/
        /*
        const contaCount=[]
         //规格为N的筛选除外
         nowCon.forEach(item=>{
           if(item.contaModel==='N') return
           contaCount.push(item)
         })
         console.log(contaCount,'contaCount')
         const contaNoCount=[]
         //在规格为N筛选除外的基础上对集装箱号进行去重
        contaCount.forEach(itemCount=>{
          contaNoCount.push(itemCount.contaNo)
         })
         console.log(contaNoCount,'contaNoCount')
         let contaCountLength=this.uniqueArr(contaNoCount)
         this.appForm.contaCount=contaCountLength.length*/
        //标箱数
        /* let arr=[]
         nowCon.map(item=>{
           if(item.contaModel) {
             let contaModelL
             if(item.contaModel==='L') {
               contaModelL=parseInt(2+`${item.contaModel}`);
             }else if(item.contaModel==='S') {
               contaModelL=parseInt(1+`${item.contaModel}`);
             }else if(item.contaModel==='N') {
               contaModelL=parseInt(0+`${item.contaModel}`);
             }
             arr.push(contaModelL)
           }
           let sum=arr.reduce(function(a,b){
             return parseInt(a)+parseInt(b)
           },0)
           this.appForm.contaIniCount=sum
         })*/
        this.deduplication(nowCon)
      },
      deep: true,
      immediate: true
    },
    /*'$route'(n){
      let flag=n.query.flag
      if(flag=='configuration'){
        this.configurationIf=false
      }else{
        this.configurationIf=true
      }
    },*/

    $route: {
      handler(n) {
        let flag = n.query.flag
        if (flag == 'configuration') {
          this.configurationIf = false
        } else {
          this.configurationIf = true
        }

        let btn = n.path
        if (btn == '/transPreptIndex' || btn == '/transDeclare') {
          this.buttonFlag = true
          this.trnModeFlag1 = true
          this.trnModeFlag2 = false
        } else if (btn == '/trans') {
          this.buttonFlag = false
          this.trnModeFlag2 = true
          this.trnModeFlag1 = false
        }
      },
      deep: true,
      immediate: true
    },
    appForm: {
      handler(n) {
        //window.parent.postMessage({ appForm:n}, 'http://localhost:3003/');
        window.parent.postMessage(
          JSON.stringify({
            appForm: n,
            dataFormTwo: this.dataFormTwo,
            dataFormThree: this.dataFormThree,
            dataFormTour: this.dataFormTour,
            dataFormFive: this.dataFormFive,
            userExt: getUserExt(this.userExt),
            token: getToken()
          }),
          global.CUSTOMSURL
        )
      },
      deep: true,
      immediate: true
    },
    dataFormTour: {
      handler(n) {
        //window.parent.postMessage(JSON.stringify({ dataFormTour:n}), 'http://localhost:3003/');
        window.parent.postMessage(
          JSON.stringify({
            appForm: this.appForm,
            dataFormTwo: this.dataFormTwo,
            dataFormThree: this.dataFormThree,
            dataFormTour: n,
            dataFormFive: this.dataFormFive,
            userExt: getUserExt(this.userExt),
            token: getToken()
          }),
          global.CUSTOMSURL
        )
      },
      deep: true,
      immediate: true
    },
    dataFormFive: {
      handler(n) {
        //window.parent.postMessage(JSON.stringify({ dataFormFive:n}), 'http://localhost:3003/');
        window.parent.postMessage(
          JSON.stringify({
            appForm: this.appForm,
            dataFormTwo: this.dataFormTwo,
            dataFormThree: this.dataFormThree,
            dataFormTour: this.dataFormTour,
            dataFormFive: n,
            userExt: getUserExt(this.userExt),
            token: getToken()
          }),
          global.CUSTOMSURL
        )
      },
      deep: true,
      immediate: true
    }
  },
  beforeUnmount() {
    window.removeEventListener('message', this.handle)
  },
  created() {
    let that = this
    const obj = {}
    this.tableNameList.forEach((item, index) => {
      obj[`${item}Value`] = []
      window.localStorage.setItem('selectObj', JSON.stringify(obj))
    })

    //初始把token传过去
    window.parent.postMessage(
      JSON.stringify({
        bills: [],
        userExt: [],
        token: getToken()
      }),
      global.CUSTOMSURL
    )

    /*   window.addEventListener('message',({data:{type,cusTrnFlag,bill}})=>{
         if (type=='hold') {
           that[type](cusTrnFlag)
         }else if (type=='copy') {//父组件调用子组件的复制方法
           that[type]()
         }else if(type=='billsFn'){
           that[type](bill)
         }
       })*/
    window.addEventListener('message', this.handle)
  },
  mounted() {
    //模板配置
    /* if(this.$route.query.eSealFlag){
       this.configurationeSealFlag=this.$route.query.eSealFlag
       this.configurationTitle = this.$route.query.title
       this.configurationFlag=this.$route.query.flag
     }
     if(this.$route.query.flag==='configuration'){
       this.configurationIf=false
       this.queryTemp()
     }*/
    //初始值模板 新增
    if (this.$route.query.title == '新增模板配置') {
      this.appForm.eSealFlag = 'N'
    }
    if (this.$route.query.flag === 'configuration') {
      this.configurationeSealFlag = this.$route.query.eSealFlag
      this.configurationTitle = this.$route.query.title
      this.configurationFlag = this.$route.query.flag
      if (this.$route.query.appId) {
        this.configurationAppId = this.$route.query.appId
        this.tempGetDetail(this.configurationAppId)
      }
      //按钮得控制 只显示保存
      this.configurationIf = false
      //控制 进出口标志 去掉校验require
      this.iEFlagIf = false
    }

    //复制
    this.copyTitle = this.$route.query.title
    this.copyFlag = this.$route.query.flag
    if (this.$route.query.data) {
      this.copyData = this.$route.query.data
      this.appForm = this.copyData.TRANS_PRE_HEAD
      this.dataFormTwo = this.copyData.TRANS_PRE_BILL
      this.dataFormThree = this.copyData.TRANS_PRE_CONTAINER
      this.dataFormTour = this.copyData.TRANS_PRE_GOODS
      this.dataFormFive = this.copyData.TRANS_PRE_CONTA_GOODS
    }

    //新增的时候给电子关锁启用标志默认值N
    //转关查询进到转关单申报里面的新增按钮
    if (this.$route.query.eSealFlag) {
      this.eSealFlagQuery = this.$route.query.eSealFlag
      this.appForm.eSealFlag = this.eSealFlagQuery
    }
    //转关单申报
    if (this.$route.path == '/transDeclare') {
      this.appForm.eSealFlag = 'N'
    }

    //新增
    this.addTitle = this.$route.query.title
    this.addFlag = this.$route.query.flag

    //调用下拉框
    this.reqThirdParty()

    //编辑
    /*if(this.title=='编辑'){
      this.flag=this.$route.query.flag
      if (this.$route.query.appId) {
        this.appId = this.$route.query.appId
        this.getEditInfo(this.appId)
      }
    }*/
    this.flag = this.$route.query.flag
    if (this.flag == 'edit') {
      if (this.$route.query.appId) {
        this.appId = this.$route.query.appId
        this.getEditInfo(this.appId)
      }
    }
    //判断新增的时候表单不初始发请求
    if (this.copyFlag || this.flag) {
      this.formFilter()
    }

    //报关转关
    if (this.$route.query.flag == 'transCopy') {
      if (this.$route.query.appId) {
        this.appId = this.$route.query.appId
        this.getEditInfoCopy(this.appId)
      }
    }
  },
  methods: {
    getEditInfoCopy(id) {
      this.id = id
      restGet('getDetailSearch', id).then(({ data: editData }) => {
        this.appForm = editData.TRANS_PRE_HEAD
        this.dataFormTwo = editData.TRANS_PRE_BILL
        this.dataFormThree = editData.TRANS_PRE_CONTAINER
        this.dataFormTour = editData.TRANS_PRE_GOODS
        this.dataFormFive = editData.TRANS_PRE_CONTA_GOODS
        this.status = editData.TRANS_PRE_HEAD.status
        this.$delete(this.appForm, 'id')
        this.$delete(this.appForm, 'copSeqNo')
        this.$delete(this.appForm, 'transPreId')
        this.$delete(this.appForm, 'preNo')
      })
    },
    handle(e) {
      let that = this
      const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data
      if (!data) return
      let { type, cusTrnFlag, bill, customsBillNo, customsTrafName, customsVoyageNo } = data
      if (type == 'hold') {
        that[type](cusTrnFlag)
      } else if (type == 'billsFn') {
        that[type](bill)
      } else if (type == 'billNoFn') {
        that[type](customsBillNo)
      } else if (type == 'trafNameFn') {
        that[type](customsTrafName)
      } else if (type == 'voyageNoFn') {
        that[type](customsVoyageNo)
      }
      /* else if (type=='copy') {//父组件调用子组件的复制方法
         that[type]()
       }*/
    },
    billNoFn(customsBillNo) {
      if (customsBillNo) {
        this.customsBillNo = customsBillNo
      }
    },
    trafNameFn(customsTrafName) {
      if (customsTrafName) {
        this.customsTrafName = customsTrafName
      }
    },
    voyageNoFn(customsVoyageNo) {
      if (customsVoyageNo) {
        this.customsVoyageNo = customsVoyageNo
      }
    },
    billsFn(bill) {
      if (bill) {
        this.bills = JSON.parse(bill)
      }
    },
    deduplication(data) {
      const res = []
      const map = new Map()
      for (const i of data) {
        map.set(`${i.contaModel}-${i.contaNo}`, i)
      }
      map.forEach((value, key) => {
        res.push(value)
      })
      let arr = []
      let array = []
      res.map((item) => {
        if (item.contaModel) {
          let contaModelL
          let contaModel
          if (item.contaModel === 'L') {
            contaModelL = parseInt(2 + `${item.contaModel}`)
            contaModel = parseInt(1 + `${item.contaModel}`)
          } else if (item.contaModel === 'S') {
            contaModelL = parseInt(1 + `${item.contaModel}`)
            contaModel = parseInt(1 + `${item.contaModel}`)
          } else if (item.contaModel === 'N') {
            contaModelL = parseInt(0 + `${item.contaModel}`)
            contaModel = parseInt(0 + `${item.contaModel}`)
          }
          arr.push(contaModelL)
          array.push(contaModel)
        }
        let sum = arr.reduce(function (a, b) {
          return parseInt(a) + parseInt(b)
        }, 0)
        this.appForm.contaIniCount = sum

        let sumContaCount = array.reduce(function (a, b) {
          return parseInt(a) + parseInt(b)
        }, 0)
        this.appForm.contaCount = sumContaCount
      })
    },
    //对象的去重
    /*deduplication(data) {
      console.log(data,'data')
       const res = []
       const map = new Map()
       for (const i of data) {
         map.set(`${i.contaModel}-${i.contaNo}`, i)
       }
       map.forEach((value, key) => {
         res.push(value)
       })
      console.log(res,'res')
      //return res
      let arr=[]
      res.map(item=>{
        if(item.contaModel) {
          let contaModelL
          if(item.contaModel==='L') {
            contaModelL=parseInt(2+`${item.contaModel}`);
          }else if(item.contaModel==='S') {
            contaModelL=parseInt(1+`${item.contaModel}`);
          }else if(item.contaModel==='N') {
            contaModelL=parseInt(0+`${item.contaModel}`);
          }
          arr.push(contaModelL)
        }
        let sum=arr.reduce(function(a,b){
          return parseInt(a)+parseInt(b)
        },0)
        this.appForm.contaIniCount=sum
      })
    },*/
    //数组去重
    uniqueArr(arr) {
      return Array.from(new Set(arr))
    },
    //进出口岸 申报口岸 open方法
    /* open(){
       this.formFilter()
     },*/
    //商品编号
    codeTsNoActiveChange(val) {
      //console.log(this.codeTsData,'this.codeTsData')
      let codeTsFilter = this.codeTsData.filter((item) => {
        if (item.CODE_TS == val) {
          return item.CODE_TS == val
        }
      })
      this.$set(this.appFormTour, 'gName', codeTsFilter[0].G_NAME)
      //this.appFormTour.gName=codeTsFilter[0].G_NAME
    },
    formatterItemFunccodeTs(item) {
      return `${item.value}-${item.label}`
    },
    codeTsRemoteCall(val, callback) {
      const params = {
        tableName: 'COMPLEX',
        filterData: val
      }
      this.getResponseData(params)
        .then((json) => {
          if (!json) return
          let arr = new Array()
          json.data.forEach((item, index) => {
            arr.push({
              value: item.CODE_TS,
              label: item.G_NAME
            })
          })
          this.codeTsData = json.data
          callback.done(arr)
        })
        .catch((e) => {
          //console.log(e);
          this.$pop({ type: 'danger', message: '查询失败' })
        })
    },

    //境内运输方式 active-change 方法
    trafWayChange(val) {
      this.trafWayOneValue = val
    },

    //境内运输工具名称的 远程搜索方法
    transNameCall(val, callback) {
      this.transNameList = []
      if (this.trafWayOneValue == '2' || this.trafWayOneValue == '4') {
        this.transNameInterface({ veName: val }, callback, 'transName')
      } else {
        callback.done()
      }
    },
    //境内运输工具编号 的远程搜索方法
    customsNoCall(val, callback) {
      this.customsNoList = []
      if (this.trafWayOneValue == '2' || this.trafWayOneValue == '4') {
        this.transNameInterface({ veCustomsNo: val }, callback, 'customsNo')
      } else {
        callback.done()
      }
    },
    //下拉框筛选 接口
    transNameInterface(val, callback, type) {
      this.$post('vihicleCodeFind', val)
        .then((json) => {
          let arr = new Array()
          if (json.flag == 'T') {
            if (!Object.keys(json.data).length) return
            json.data.data.forEach((item, index) => {
              arr.push({
                value: index,
                label: item.customsNo + '[' + item.transName + ']'
              })
            })
          }
          if (type == 'transName') {
            this.transNameList = json.data.data
          }
          if (type == 'customsNo') {
            this.customsNoList = json.data.data
          }
          callback.done(arr)
        })
        .catch((e) => {
          console.log(e)
          this.$pop({ type: 'danger', message: '查询失败' })
        })
    },
    //search展示内容
    formatterItemFuncCustomsNo(item) {
      return `${item.label}`
    },
    formatterItemFuncTransName(item) {
      return `${item.label}`
    },
    //@trigger-item-click 方法
    transNameActiveChange() {
      this.transNameList.forEach((item, index) => {
        if (index == this.appForm.transName) {
          this.appForm.transName = item.transName //境内运输工具编号
          this.appForm.customsNo = item.customsNo //境内运输工具编号
          this.appForm.contractorCode = item.contractorCode //承运单位编号
          this.appForm.contractor = item.contractor //承运单位名称
        }
      })
    },
    customsNoActiveChange() {
      this.customsNoList.forEach((item, index) => {
        if (index == this.appForm.customsNo) {
          this.appForm.transName = item.transName //境内运输工具名称
          this.appForm.customsNo = item.customsNo //境内运输工具名称
          this.appForm.contractorCode = item.contractorCode //承运单位编号
          this.appForm.contractor = item.contractor //承运单位名称
        }
      })
    },

    //初始值模板 编辑回显
    /* preTempGetDetail(id){
       restGet('preTempGetDetail', id).then((res)=> {
         this.appForm = res.data.TRANS_PRE_HEAD
         this.$delete(this.appForm,'id')
         this.dataFormTwo = res.data.TRANS_PRE_BILL
         this.dataFormThree = res.data.TRANS_PRE_CONTAINER
         this.dataFormTour = res.data.TRANS_PRE_GOODS
         this.dataFormFive = res.data.TRANS_PRE_CONTA_GOODS
       })
     },*/
    //初始值模板 编辑回显 promise 版本
    preTempGetDetail(id) {
      return new Promise((resolve, reject) => {
        try {
          restGet('preTempGetDetail', id).then((res) => {
            resolve(res)
          })
        } catch (e) {
          reject(e)
        }
      })
    },

    tempGetDetail(id) {
      restGet('preTempGetDetail', id).then((res) => {
        this.appForm = res.data.TRANS_PRE_HEAD
        this.dataFormTwo = res.data.TRANS_PRE_BILL
        this.dataFormThree = res.data.TRANS_PRE_CONTAINER
        this.dataFormTour = res.data.TRANS_PRE_GOODS
        this.dataFormFive = res.data.TRANS_PRE_CONTA_GOODS
      })
    },
    //初始值模板按钮
    queryAssignment() {
      this.initTemp = true
      this.preTempQueryList()
    },
    //获取所有列表接口
    preTempQueryList() {
      this.$post('preTempQueryList', {}).then((json) => {
        if (json.flag == 'T') {
          this.initTempData = json.data
        }
      })
    },
    //初始值模板选择model框的close方法
    initTempModel() {
      this.initTemp = false
    },
    //初始值模板选择model框 确定按钮
    async canfirmInitTemp() {
      this.initTemp = false
      let list = this.$refs.table.getData('select')
      let id
      if (list.length > 1) {
        this.$pop({ type: 'danger', message: '请选择一条数据操作' })
        return
      }
      if (list.length > 0) {
        id = list[0].id
        const res = await this.preTempGetDetail(id)
        this.appForm = res.data.TRANS_PRE_HEAD
        this.$delete(this.appForm, 'id')
        this.dataFormTwo = res.data.TRANS_PRE_BILL
        this.dataFormThree = res.data.TRANS_PRE_CONTAINER
        this.dataFormTour = res.data.TRANS_PRE_GOODS
        this.dataFormFive = res.data.TRANS_PRE_CONTA_GOODS
        //调用下拉框
        this.formFilter()
      }
    },
    //初始值模板选择model框 取消按钮
    cancelInitTemp() {
      this.initTemp = false
    },
    queryTemp() {
      this.$post('queryTemp', {}).then((json) => {
        if (json.flag == 'T') {
          let data = json.data.data
          this.id = data.TRANS_PRE_HEAD.id
          this.appForm = data.TRANS_PRE_HEAD
          this.dataFormTwo = data.TRANS_PRE_BILL
          this.dataFormThree = data.TRANS_PRE_CONTAINER
          this.dataFormTour = data.TRANS_PRE_GOODS
          this.dataFormFive = data.TRANS_PRE_CONTA_GOODS
        } else {
          this.$pop({
            type: 'success',
            message: json.message
          })
        }
      })
    },
    //模板配置页面的保存按钮
    savetTemplateConfiguration() {
      //模板名称不能为空校验
      if (!this.appForm.templateName) {
        this.$pop({
          type: 'warning',
          message: '模板名称不能为空'
        })
        return
      }

      const TRANS_PRE_HEAD = this.appForm
      const TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
        item.recordNumber = index + 1
        if (item.iEDate) {
          item.iEDate = item.iEDate.replace(/-/g, '')
        }
        return item
      })
      const TRANS_PRE_CONTAINER = this.dataFormThree
      const TRANS_PRE_GOODS = this.dataFormTour
      const TRANS_PRE_CONTA_GOODS = this.dataFormFive
      this.$set(this.appForm, 'status', '0')
      if (this.appForm.validTime) {
        this.$set(this.appForm, 'validTime', this.appForm.validTime.replace(/-/g, ''))
      }

      //模板名称
      if (!this.appForm.templateName) {
        this.$pop({
          type: 'warning',
          message: '模板名称不能为空！'
        })
        return
      }
      this.$post('saveTemp', {
        TRANS_PRE_HEAD,
        TRANS_PRE_BILL,
        TRANS_PRE_CONTAINER,
        TRANS_PRE_GOODS,
        TRANS_PRE_CONTA_GOODS
      }).then((json) => {
        if (Object.keys(json.data).length) {
          let data = json.data
          this.id = data.TRANS_PRE_HEAD.id
          this.appForm = data.TRANS_PRE_HEAD
          this.dataFormTwo = data.TRANS_PRE_BILL
          this.dataFormThree = data.TRANS_PRE_CONTAINER
          this.dataFormTour = data.TRANS_PRE_GOODS
          this.dataFormFive = data.TRANS_PRE_CONTA_GOODS
          this.$pop({
            type: 'success',
            message: '保存成功'
          })
        } else {
          this.$pop({
            type: 'danger',
            message: json.message
          })
        }
      })
    },
    //集装箱序号回填集装箱号
    contaSeqnoChange(v) {
      if (!v) return
      let contaNoData = this.contaNoSelect.filter((item) => item.contaSeqno === v)
      this.$set(this.appFormFive, 'contaNo', contaNoData[0].contaNo)
    },
    //根据提单号集装箱/货物变化
    recordNumberActiveChange(v, selectVm, oldSelectVm) {
      //当选择下拉框1时，下拉框2、3自动筛选
      this.contaNoSelect = this.dataFormThree.filter((item) => item.recordNumber === v)
      this.gNoSelect = this.dataFormTour.filter((item) => item.recordNumber == v)
      //提单序号进行切换时其余两个表单置为空(直接置为空会出现第一次添加下拉框不显示到input上，动态更新)
      if (selectVm) {
        if (oldSelectVm !== null) {
          if (selectVm.extObj !== oldSelectVm.extObj) {
            this.$set(this.appFormFive, 'contaSeqno', '')
            this.$set(this.appFormFive, 'contaNo', '')
            this.$set(this.appFormFive, 'gNo', '')
          }
        }
        this.extObj = { ...selectVm.extObj }
      } else {
        this.extObj = {}
      }
    },
    //提单信息查询
    queryBillNO() {
      //提单号唯一的，加校验
      let billNo = this.dataFormTwo.filter((e) => e.billNo === this.appFormTwo.billNo)
      if (billNo && billNo.length) {
        this.$pop({
          type: 'warning',
          message: '提单号不可重复！'
        })
        return
      }
      if (this.appFormTwo.billNo == undefined) {
        this.$pop({
          type: 'warning',
          message: '提单号不可为空！'
        })
        return
      }
      this.queryBillNOInInterface()
    },
    //查询接口
    queryBillNOInInterface() {
      //getBill
      const { voyageNo, shipNameEn, billNo } = this.appFormTwo
      this.$post('getBill', {
        voyage: voyageNo,
        vslName: shipNameEn,
        masterBlNo: billNo,
        houseBlNo: ''
      })
        // "houseBlNo":'this.appFormThree.contaNo'
        .then((json) => {
          //1.提单信息：BILL_NO 提单号、PACK_NO件数、GROSS_WT重量、I_E_DATE（UNLOAD_DATE）实际进出境日期
          //2.集装箱信息：BILL_NO提单号、CONTA_NO（CONTA_ID）集装箱号、CONTA_MODEL（CONTA_TYPE）规格、SEAL_NO封志关锁号
          if (!Object.keys(json.data).length) return
          if (json.data) {
            this.billContainer = json.data
            let bill = json.data.bill
            //this.appFormTwo.billNo=bill.BILL_NO
            this.appFormTwo.packNo = bill.PACK_NO
            // this.appFormTwo.grossWt=bill.GROSS_WT
            this.appFormTwo.iEDate = bill.I_E_DATE
            this.$set(this.appFormTwo, 'grossWt', bill.GROSS_WT)
            //提单信息的集装箱总数根据集装箱关联的提单信息进行回显
            if (json.data.container && json.data.container.length) {
              this.appFormTwo.contaC = json.data.container.length
            }
          }
        })
    },
    //集装箱提单下拉框
    rNumActiveChange(v) {
      let obj = {}
      const TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
        item.recordNumber = index + 1
        return item
      })
      obj = TRANS_PRE_BILL.find((item) => item.recordNumber === v)
      if (!obj) return
      const masterBlNoBillNo = obj.billNo

      const { voyageNo, shipNameEn } = this.appFormTwo
      this.$post('getBill', {
        voyage: voyageNo,
        vslName: shipNameEn,
        masterBlNo: masterBlNoBillNo,
        houseBlNo: ''
      }).then((json) => {
        if (!Object.keys(json.data).length) return
        if (json.data) {
          this.container = json.data.container
          /*getBill接口变化：
            搜索提单号返回的数据之前是两个对象，现在是一个对象一个数组，需要在集装箱信息那里通过提单序号和集装箱序号进行数组里面筛选，回显不同的数据，所以新加集装箱号失去焦点事件
            container.forEach((item, index) => {
               console.log(item,'item')
             })
            //this.appFormThree.recordNumber=container.BILL_NO
            //this.appFormThree.contaNo=container.CONTA_NO
            this.appFormThree.eSealId=container.E_SEAL_ID //eSealId 封志（关锁）号
            this.appFormThree.sealNo=container.SEAL_NO //sealNo 电子关锁号
            this.appFormThree.contaModel=container.CONTA_MODEL
            this.$set(this.appFormThree,'contaNo',container.CONTA_NO)*/
        }
      })
    },
    //集装箱号失去焦点事件
    contaNoBlur(e) {
      this.container.forEach((item, index) => {
        this.dataFormTwo.forEach((itemBillNO) => {
          if (item.BILL_NO === itemBillNO.billNo && item.CONTA_NO === e.target.value) {
            this.$set(this.appFormThree, 'eSealId', item.E_SEAL_ID)
            //this.appFormThree.eSealId=item.E_SEAL_ID //eSealId 封志（关锁）号
            this.appFormThree.sealNo = item.SEAL_NO //sealNo 电子关锁号
            this.appFormThree.contaModel = item.CONTA_MODEL
            this.appFormThree.sealNum = item.SEAL_NUM
            //this.$set(this.appFormThree,'contaNo',item.CONTA_NO)
          }
        })
      })
    },
    //商品下拉框赋值提单号
    gNoActiveChange(v) {
      /*if(!v) return
      const data= this.dataFormTour.find(item => item.gNo === v)
      if(!data) return
      this.appFormFive['recordNumber']=data.recordNumber*/
    },

    //下拉框的请求方法
    reqThirdPartySelect({ tableName, filterData = false, limit = 30, type = 'code' }) {
      const data = {
        tableName, //appForm appFormTwo境内运输方式
        filter: {
          offset: 1,
          limit
        }
      }
      var chinese = new RegExp('[\u4E00-\u9FA5]+')
      var english = new RegExp('[A-Za-z]+')
      var number = new RegExp('[0-9]+')
      // 是否模糊搜索
      if (filterData) {
        if (tableName === 'COMPLEX') {
          //商品编号
          if (type === 'code') {
            data.filter.like_codeTs = filterData
          } else {
            if (chinese.test(`${filterData}`)) {
              data.filter.like_gName = filterData
            } else if (number.test(`${filterData}`)) {
              data.filter.like_codeTs = filterData
            }
          }
        } else if (tableName === 'WRAP_TYPE') {
          //包装 WRAP_CODE WRAP_NAME
          if (type === 'code') {
            data.filter.like_wrapCode = filterData
          } else {
            /* data.filter.like_wrapName = filterData
             data.filter.like_wrapCode = filterData*/
            if (chinese.test(`${filterData}`)) {
              data.filter.like_wrapName = filterData
            } else if (number.test(`${filterData}`)) {
              data.filter.like_wrapCode = filterData
            }
          }
        } else if (tableName === 'CUSTOMS') {
          //进出口岸 申报口岸 CUSTOMS_CO  CUSTOMS_NA like_customsNa
          if (type === 'code') {
            data.filter.like_customsCo = filterData
          } else {
            /* data.filter.like_customsNa = filterData
             data.filter.like_customsCo = filterData*/
            if (chinese.test(`${filterData}`)) {
              data.filter.like_customsNa = filterData
            } else if (number.test(`${filterData}`)) {
              data.filter.like_customsCo = filterData
            }
          }
        } else if (tableName === 'CONTA_MODEL') {
          //CONTA_MODEL_CO  CONTA_MODEL_NAME
          if (type === 'code') {
            data.filter.like_contaModelCo = filterData
          } else {
            /* data.filter.like_contaModelName = filterData
             data.filter.like_contaModelCo = filterData*/
            if (chinese.test(`${filterData}`) || number.test(`${filterData}`)) {
              data.filter.like_contaModelName = filterData
            } else if (english.test(`${filterData}`)) {
              data.filter.like_contaModelCo = filterData
            }
          }
        } else {
          if (type === 'code') {
            //进出境2个   单位 币制 CODESTD  codeStd
            data.filter.like_codestd = filterData
          } else {
            /*data.filter.like_namestd = filterData
            data.filter.like_codestd = filterData*/
            if (chinese.test(`${filterData}`)) {
              data.filter.like_namestd = filterData
            } else if (number.test(`${filterData}`) || english.test(`${filterData}`)) {
              data.filter.like_codestd = filterData
            }
          }
        }
      }
      let password = ''
      let publicKey = ''
      let privateKey = ''
      this.userExt.forEach((e) => {
        if (e.applyExtKey == global.APPCODE) {
          password = JSON.parse(e.applyExtValue).SWGD_IMAP_SIGN_PASSWORD.substring(0, 16)
          privateKey = JSON.parse(e.applyExtValue).SWGD_IMAP_PRIVATE_KEY
          publicKey = JSON.parse(e.applyExtValue).SWGD_IMAP_PUBLIC_KEY
        }
      })
      let translatedDataStr = JSON.stringify(data)
      let encryptionStr = CryptoAes.encrypt(translatedDataStr, password) // 加密
      let signStr = md5(translatedDataStr + privateKey) // 加签
      return request({
        method: 'POST',
        url: global.HOST + '/swgd-paradb/v2/public/query',
        rtnType: 'json',
        dataType: 'json',
        swgdSign: true,
        cors: true,
        headers: {
          // 特有头部验证
          'X-SWGD-Sender': this.$store.getters.getLoginId,
          'X-SWGD-Sign': signStr,
          'X-SWGD-PublicKey': publicKey,
          'X-SWGD-Zipflag': 0,
          epToken: getToken()
        },
        data: {
          data: encryptionStr
        }
      })
    },
    async getResponseData(requestData) {
      const json = await this.reqThirdPartySelect(requestData)
      if (json.code === 200) {
        return this.decryptData(json.data)
      }
    },
    //解密方法
    decryptData(data) {
      let password = ''
      this.userExt.forEach((e) => {
        if (e.applyExtKey == global.APPCODE) {
          password = JSON.parse(e.applyExtValue).SWGD_IMAP_SIGN_PASSWORD.substring(0, 16)
        }
      })
      return JSON.parse(CryptoAes.decrypt(data, password))
    },
    //集中处理8个下拉框数据
    reqThirdParty() {
      const obj = {}
      let i = 0
      const timer = setInterval(() => {
        if (i > 20) {
          clearInterval(timer)
          return
        }
        i++
        const num = this.$store.getters.getUserExt.length
        if (num === 0) return
        this.tableNameList.forEach((item, index) => {
          const params = {
            tableName: item,
            limit: 30
          }
          this.getResponseData(params).then((json) => {
            json.data.forEach((item, index) => {})
            //json.data.unshift({value: '', label: ''})
            //console.log(json.data,'json.data---------------------------')
            this[`${item}Value`] = json.data // COMPLEXValue
            //获取的数据存放到local
            obj[`${item}Value`] = json.data
            window.localStorage.setItem('selectObj', JSON.stringify(obj))
          })
        })
        clearInterval(timer)
      }, 500)

      setTimeout(() => {
        this.WRAP_TYPEValue.forEach((WRAP_TYPEItem) => {
          WRAP_TYPEItem.NAMESTD = WRAP_TYPEItem.WRAP_NAME
          WRAP_TYPEItem.CODESTD = WRAP_TYPEItem.WRAP_CODE
        })
        this.COMPLEXValue.forEach((COMPLEXItem) => {
          COMPLEXItem.NAMESTD = COMPLEXItem.G_NAME
          COMPLEXItem.CODESTD = COMPLEXItem.CODE_TS
        })
        this.CONTA_MODELValue.forEach((CONTA_MODELItem) => {
          CONTA_MODELItem.NAMESTD = CONTA_MODELItem.CONTA_MODEL_NAME
          CONTA_MODELItem.CODESTD = CONTA_MODELItem.CONTA_MODEL_CO
        })
      }, 1000)
    },
    //进出境下拉框远程搜索
    trafModeRemoteCall(filterData, callback, tableName) {
      const num = this.$store.getters.getUserExt.length
      if (num === 0) return

      const params = {
        tableName,
        filterData,
        type: 'name'
      }
      this.getResponseData(params).then((json) => {
        if (!json) return
        callback.done(json.data)
        this[`${tableName}Value`] = json.data
      })
    },
    //商品编号下拉框
    codeTsChange(val, selectVm) {
      if (!val) return
      let selectData = this.COMPLEXValue.filter((item) => item.CODE_TS === val)
      this.$set(this.appFormTour, 'gName', selectData[0].G_NAME)
    },
    //表单回显
    formFilter() {
      const that = this
      //表单回显
      let i = 0
      const timer = setInterval(() => {
        const flagArr = []
        if (i > 10) {
          clearInterval(timer)
          return
        }
        i++
        const arr = ['TRAF_MODE_STDValue', 'CUSTOMSValue']
        arr.forEach((item) => {
          if (that[item].length) flagArr.push(true)
        })
        if (flagArr.length === 2) {
          const { trafWay, recvPort, sendPort } = this.appForm
          let target = this.TRAF_MODE_STDValue.find((item) => item.CODESTD === this.appForm.trafWay)
          //数据没在30条里面且表单回显的有值执行
          if (!target && trafWay) {
            const params = {
              tableName: 'TRAF_MODE_STD',
              filterData: this.appForm.trafWay
            }
            this.getResponseData(params).then(({ data }) => {
              this.TRAF_MODE_STDValue.push(data[0])
            })
          }
          let targetRecvPort = this.CUSTOMSValue.find((item) => item.CUSTOMS_CO === this.appForm.recvPort)
          if (!targetRecvPort && recvPort) {
            const params = {
              tableName: 'CUSTOMS',
              filterData: this.appForm.recvPort
            }
            this.getResponseData(params).then(({ data }) => {
              this.CUSTOMSValue.push(data[0])
            })
          }

          let targetSendPort = this.CUSTOMSValue.find((item) => item.CUSTOMS_CO === this.appForm.sendPort)
          if (!targetSendPort && sendPort) {
            const params = {
              tableName: 'CUSTOMS',
              filterData: this.appForm.sendPort
            }
            this.getResponseData(params).then(({ data }) => {
              this.CUSTOMSValue.push(data[0])
            })
          }
          clearInterval(timer)
        } else {
          return
        }
      }, 200)
    },
    //转义
    transferFormData(v, type) {
      if (this.$route.query === '/trans' || this.$route.query === '/cusTransitDeclare') {
        const obj = JSON.parse(localStorage.getItem('selectObj'))
        //this.selectList=JSON.parse(obj)
        // console.log(obj,'arrr--------------')
        // console.log(this.selectList,'selectData')
        let that = this
        let target = ''
        if (!v || !obj) return
        if (type === 'COMPLEXValue') {
          //商品编号
          //判断是否有code
          target = obj[type].find((item) => item.CODE_TS === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODE_TS === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = obj['COMPLEXValue'].find((item) => item.CODE_TS === itemData.CODE_TS)
                  if (!flag) {
                    obj['COMPLEXValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            //return `${target.CODE_TS}-${target.G_NAME}`
            return target.CODE_TS
          }
        } else if (type === 'CURR_STDValue') {
          // 币制  22
          target = obj[type].find((item) => item.CODESTD === v)

          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }

                data.forEach((itemData) => {
                  const flag = obj['CURR_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    obj['CURR_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            //return `${target.NAMESTD}-${target.ENAMESTD}`
            return target.NAMESTD
          }
        } else if (type === 'WRAP_TYPEValue') {
          //7 包装
          target = obj[type].find((item) => item.WRAP_CODE === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.WRAP_CODE === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = obj['WRAP_TYPEValue'].find((item) => item.WRAP_CODE === itemData.WRAP_CODE)
                  if (!flag) {
                    obj['WRAP_TYPEValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            return target.WRAP_NAME
          }
        } else if (type === 'UNIT_STDValue') {
          //30
          target = obj[type].find((item) => item.CODESTD === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = obj['UNIT_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    obj['UNIT_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            return target.NAMESTD
          }
        } else if (type === 'CONTA_MODELValue') {
          //规格
          // target= this[type].find(item=>item.CONTA_MODEL_CO===v)
          target = obj[type].find((item) => item.CONTA_MODEL_CO === v)
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json

              if (data && data.length) {
                target = data.find((item) => item.CONTA_MODEL_CO === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  //data是下拉框的数据中找不到的，需要发请求找，itemData是已经找到的
                  const flag = obj['CONTA_MODELValue'].find((item) => item.CONTA_MODEL_CO === itemData.CONTA_MODEL_CO) //判断请求回来的数据在不在localStorage（总数据）
                  if (!flag) {
                    obj['CONTA_MODELValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            return target.CONTA_MODEL_NAME
          }
        } else if (type === 'TRAF_MODE_STDValue') {
          // 18
          //console.log(obj,'obj-------------')
          target = obj[type].find((item) => item.CODESTD === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = obj['TRAF_MODE_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    obj['TRAF_MODE_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(obj))
                  }
                })
              }
            })
          } else {
            return target.NAMESTD
          }
        }
      } else {
        // console.log(this.selectList,'selectData')
        let that = this
        let target = ''
        if (!v || !this.selectList) return
        if (type === 'COMPLEXValue') {
          //商品编号
          //判断是否有code
          target = this.selectList[type].find((item) => item.CODE_TS === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODE_TS === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = this.selectList['COMPLEXValue'].find((item) => item.CODE_TS === itemData.CODE_TS)
                  if (!flag) {
                    this.selectList['COMPLEXValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            //return `${target.CODE_TS}-${target.G_NAME}`
            return target.CODE_TS
          }
        } else if (type === 'CURR_STDValue') {
          // 币制  22
          target = this.selectList[type].find((item) => item.CODESTD === v)

          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }

                data.forEach((itemData) => {
                  const flag = this.selectList['CURR_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    this.selectList['CURR_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            //return `${target.NAMESTD}-${target.ENAMESTD}`
            return target.NAMESTD
          }
        } else if (type === 'WRAP_TYPEValue') {
          //7 包装
          target = this.selectList[type].find((item) => item.WRAP_CODE === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.WRAP_CODE === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = this.selectList['WRAP_TYPEValue'].find((item) => item.WRAP_CODE === itemData.WRAP_CODE)
                  if (!flag) {
                    this.selectList['WRAP_TYPEValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            return target.WRAP_NAME
          }
        } else if (type === 'UNIT_STDValue') {
          //30
          target = this.selectList[type].find((item) => item.CODESTD === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = this.selectList['UNIT_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    this.selectList['UNIT_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            return target.NAMESTD
          }
        } else if (type === 'CONTA_MODELValue') {
          //规格
          // target= this[type].find(item=>item.CONTA_MODEL_CO===v)
          target = this.selectList[type].find((item) => item.CONTA_MODEL_CO === v)
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json

              if (data && data.length) {
                target = data.find((item) => item.CONTA_MODEL_CO === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  //data是下拉框的数据中找不到的，需要发请求找，itemData是已经找到的
                  const flag = this.selectList['CONTA_MODELValue'].find(
                    (item) => item.CONTA_MODEL_CO === itemData.CONTA_MODEL_CO
                  ) //判断请求回来的数据在不在localStorage（总数据）
                  if (!flag) {
                    this.selectList['CONTA_MODELValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            return target.CONTA_MODEL_NAME
          }
        } else if (type === 'TRAF_MODE_STDValue') {
          // 18
          //console.log(obj,'obj-------------')
          target = this.selectList[type].find((item) => item.CODESTD === v)
          //如果没有对应的code，需要发请求获取（30条以外的数据）
          if (!target) {
            const params = {
              tableName: type.replace('Value', ''),
              filterData: v
            }
            //发请求
            this.getResponseData(params).then((json) => {
              if (!json) return
              const { data } = json
              //判断是否有数据 有数据找到并push到总数据中
              if (data && data.length) {
                target = data.find((item) => item.CODESTD === v)
                if (data.length === 1) {
                  that[type].push(data[0])
                }
                data.forEach((itemData) => {
                  const flag = this.selectList['TRAF_MODE_STDValue'].find((item) => item.CODESTD === itemData.CODESTD)
                  if (!flag) {
                    this.selectList['TRAF_MODE_STDValue'].push(itemData)
                    window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
                  }
                })
              }
            })
          } else {
            return target.NAMESTD
          }
        }
      }
    },

    //change事件
    activeChange(value) {
      if (this.TRAF_MODE_STDValue.length) {
        const target = this.TRAF_MODE_STDValue.find((item) => item.CODESTD === value)
        if (target) {
          const flag = this.selectList['TRAF_MODE_STDValue'].find((item) => item.CODESTD === value)
          if (!flag) {
            this.selectList['TRAF_MODE_STDValue'].push(target)
            window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
          }
        }
      }
    },
    //再次打开30条
    trafModeOpen(e) {
      this.getResponseData({
        tableName: 'TRAF_MODE_STD'
      }).then((e) => {
        // e.data.unshift({CODESTD: '', NAMESTD: ''})
        this.TRAF_MODE_STDValue = e.data
      })
    },

    goodsCurrChange(value) {
      const target = this.CURR_STDValue.find((item) => item.CODESTD === value)
      if (target) {
        const flag = this.selectList['CURR_STDValue'].find((item) => item.CODESTD === value)
        if (!flag) {
          this.selectList['CURR_STDValue'].push(target)
          window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
        }
      }
    },
    goodsCurrOpen(e) {
      this.getResponseData({
        tableName: 'CURR_STD'
      }).then((e) => {
        //e.data.unshift({CODESTD: '', NAMESTD: ''})
        this.CURR_STDValue = e.data
      })
    },

    //单位
    goodsUnitChange(value) {
      const target = this.UNIT_STDValue.find((item) => item.CODESTD === value)
      if (target) {
        const flag = this.selectList['UNIT_STDValue'].find((item) => item.CODESTD === value)
        if (!flag) {
          this.selectList['UNIT_STDValue'].push(target)
          window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
        }
      }
    },
    goodsUnitOpen(e) {
      this.getResponseData({
        tableName: 'UNIT_STD'
      }).then((e) => {
        e.data.unshift({ CODESTD: '', NAMESTD: '' })
        this.UNIT_STDValue = e.data
      })
    },

    //包装
    /* packTypeOpen(value){
       const target=this.WRAP_TYPEValue.find(item=>item.WRAP_CODE===value)
       if(target){
         const flag= this.selectList['WRAP_TYPEValue'].find(item=>item.WRAP_CODE===value)
         if(!flag){
           this.selectList['WRAP_TYPEValue'].push(target)
           window.localStorage.setItem('selectObj',JSON.stringify(this.selectList))
         }
       }

     },
     packTypeChange(e){
       this.getResponseData({
         tableName:'WRAP_TYPE',
       }).then(e=>{
         e.data.unshift({WRAP_CODE: '', WRAP_NAME: ''})
         this.WRAP_TYPEValue= e.data
       })

     },*/

    packTypeChange(value) {
      const target = this.WRAP_TYPEValue.find((item) => item.WRAP_CODE === value)
      if (target) {
        const flag = this.selectList['WRAP_TYPEValue'].find((item) => item.WRAP_CODE === value)
        if (!flag) {
          this.selectList['WRAP_TYPEValue'].push(target)
          window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
        }
      }
    },
    packTypeOpen(e) {
      this.getResponseData({
        tableName: 'WRAP_TYPE'
      }).then((e) => {
        e.data.unshift({ WRAP_CODE: '', WRAP_NAME: '' })
        this.WRAP_TYPEValue = e.data
      })
    },

    //商品编号
    codeTsChangeFn(value) {
      const target = this.COMPLEXValue.find((item) => item.CODE_TS === value)
      if (target) {
        const flag = this.selectList['COMPLEXValue'].find((item) => item.CODE_TS === value)
        if (!flag) {
          this.selectList['COMPLEXValue'].push(target)
          window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
        }
      }
    },
    codeTsOpen(e) {
      this.getResponseData({
        tableName: 'COMPLEX'
      }).then((e) => {
        //this.COMPLEXValue=e.data
        //this.COMPLEXValue=[...this.COMPLEXValue,...e.data]
        //select中的数据在不在请求回来的数据中，不在就push进去
        e.data.forEach((item) => {
          if (!this.COMPLEXValue.find((findItem) => findItem.CODE_TS === item.CODE_TS)) {
            this.COMPLEXValue.push(item)
          }
        })
      })
    },
    //规格
    contaModelChange(value) {
      //  console.log(this.CONTA_MODELValue,'this.CONTA_MODELValue')
      const target = this.CONTA_MODELValue.find((item) => item.CONTA_MODEL_CO === value)
      if (target) {
        const flag = this.selectList['CONTA_MODELValue'].find((item) => item.CONTA_MODEL_CO === value)
        if (!flag) {
          this.selectList['CONTA_MODELValue'].push(target)
          window.localStorage.setItem('selectObj', JSON.stringify(this.selectList))
        }
      }
    },
    contaModelOpen(e) {
      this.getResponseData({
        tableName: 'CONTA_MODEL'
      }).then((e) => {
        // e.data.unshift({CODESTD: '', NAMESTD: ''})
        this.CONTA_MODELValue = e.data
      })
    },

    //打印
    async print() {
      if (!this.TRAFData.length) {
        const data = await this.getResponseData({
          tableName: 'TRAF_MODE_STD',
          limit: 100
        })
        this.TRAFData = data.data
      }
      this.$post('getTransByIds', { ids: [this.id] }).then((json) => {
        const data = this.getBillPosition(json.data)
        this.changeLevelPrint(data)
      })
    },
    //回显码表数据
    getBillPosition(data) {
      data.forEach((item) => {
        const trafWayData = this.TRAFData.find((itemName) => itemName.CODESTD === item.trafWay)
        if (trafWayData) {
          //回显码表数据
          item.name = trafWayData.NAMESTD
        }
      })
      return data
    },
    //暂存
    async hold(cusTrnFlag) {
      //进出口标志校验
      if (!this.appForm.iEFlag) {
        this.$pop({
          type: 'warning',
          message: '进出口标志不能为空'
        })
        return
      }

      /*   const TRANS_PRE_CONTAINER = this.dataFormThree.map((item, index) => {
     item.contaSeqno = index + 1

     /!*if(isNaN(item.recordNumber)){
       let recordNumber =item.recordNumber;
       let recordNumberMatCh=recordNumber.match(/^[a-z|A-Z]+/gi);
       recordNumberMatCh=recordNumber.match(/\d+$/gi);
       item.recordNumber=recordNumberMatCh.toString()
     }*!/

     return item
   })*/
      /* const TRANS_PRE_GOODS = this.dataFormTour.map((item, index) => {
        item.gNo = index + 1
        return item
      })*/

      /*if(this.appForm.id){
        this.$delete(this.appForm,'id')
      }else{
        const TRANS_PRE_HEAD = this.appForm
      }*/
      const TRANS_PRE_HEAD = this.appForm
      const TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
        item.recordNumber = index + 1
        if (item.iEDate) {
          item.iEDate = item.iEDate.replace(/-/g, '')
        }
        return item
      })
      const TRANS_PRE_CONTAINER = this.dataFormThree
      const TRANS_PRE_GOODS = this.dataFormTour
      const TRANS_PRE_CONTA_GOODS = this.dataFormFive
      this.$set(this.appForm, 'status', '0')
      if (this.appForm.validTime) {
        this.$set(this.appForm, 'validTime', this.appForm.validTime.replace(/-/g, ''))
      }

      //报关整合在表头加上cusTrnFlag字段
      if (cusTrnFlag == '1') {
        this.$set(this.appForm, 'cusTrnFlag', '1')
        /*if(this.dataFormTwo.length !== 1){
          this.$pop({
            type: 'warning',
            message: '提单信息只允许有一条'
          });
          return
        }*/
        if (!this.dataFormTwo.length) {
          this.$pop({
            type: 'warning',
            message: '提单信息缺失'
          })
          return
        }
      }
      this.$post('saveTrans', {
        TRANS_PRE_HEAD,
        TRANS_PRE_BILL,
        TRANS_PRE_CONTAINER,
        TRANS_PRE_GOODS,
        TRANS_PRE_CONTA_GOODS
      }).then((json) => {
        this.id = json.data.TRANS_PRE_HEAD.id
        this.appForm = json.data.TRANS_PRE_HEAD
        this.dataFormTwo = json.data.TRANS_PRE_BILL
        this.dataFormThree = json.data.TRANS_PRE_CONTAINER
        this.dataFormTour = json.data.TRANS_PRE_GOODS
        this.dataFormFive = json.data.TRANS_PRE_CONTA_GOODS

        localStorage.setItem('transHead', JSON.stringify(json.data.TRANS_PRE_HEAD))
        //this.$bus.$emit('transFlag')
        window.parent.postMessage(
          JSON.stringify({
            type: 'transFlag'
          }),
          global.CUSTOMSURL
        )

        this.$pop({
          type: 'success',
          message: '暂存成功'
        })
        //this.btnFlagPrint = true; //打印
        //this.btnFlagSend = false;   //发送

        if (this.appForm.status == '0') {
          this.btnFlagPrint = true
        } else if (
          this.appForm.status == '2' ||
          this.appForm.status == '4' ||
          this.appForm.status == 'L' ||
          this.appForm.status == 'G' ||
          this.appForm.status == 'R'
        ) {
          this.btnFlag = true
        }

        if (this.addTitle) {
          //编辑
          this.addId = json.data.TRANS_PRE_HEAD.id
          this.addTitle = '编辑' + this.addId
          this.$app.trigger('locate-tab', 'transPreptIndex', {
            title: '编辑' + this.addId,
            appId: this.addId,
            flag: 'edit'
          })
        } else {
          //新增
          console.log(this.bills, '111111')

          console.log(22222)
          this.addId = json.data.TRANS_PRE_HEAD.id

          //暂存时先是第三级，把id传给第三级备用
          this.$emit('transId', this.addId)

          this.addTitle = '编辑' + this.addId
          this.$app.trigger('close-tab')
          this.$app.trigger('locate-tab', 'transPreptIndex', {
            title: '编辑' + this.addId,
            appId: this.addId,
            flag: 'edit'
          })
        }
      })
    },
    //增加
    add() {
      this.$app.trigger('locate-tab', 'transPreptIndex', {
        title: `新增`,
        flag: 'add',
        eSealFlag: this.eSealFlagValue[1].value
      })
    },
    //复制
    copy() {
      console.log('fuzhi----------------------------')
      let TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
        return item
      })
      let TRANS_PRE_CONTAINER = this.dataFormThree.map((item, index) => {
        return item
      })
      let TRANS_PRE_GOODS = this.dataFormTour.map((item, index) => {
        return item
      })
      let TRANS_PRE_CONTA_GOODS = this.dataFormFive.map((item, index) => {
        return item
      })
      this.$delete(this.appForm, 'id')
      this.$delete(this.appForm, 'copSeqNo')
      this.$delete(this.appForm, 'transPreId')
      this.$delete(this.appForm, 'preNo')
      let copy = {
        TRANS_PRE_HEAD: this.appForm,
        TRANS_PRE_BILL: TRANS_PRE_BILL,
        TRANS_PRE_CONTAINER: TRANS_PRE_CONTAINER,
        TRANS_PRE_GOODS: TRANS_PRE_GOODS,
        TRANS_PRE_CONTA_GOODS: TRANS_PRE_CONTA_GOODS
      }
      this.$app.trigger('locate-tab', 'transPreptIndex', {
        title: `复制`,
        flag: 'copy',
        data: copy
        //eSealFlag:this.eSealFlagValue[1].value
      })
    },
    //校验按钮
    check() {
      this.checkInterface()
    },
    //校验接口
    checkInterface() {
      return new Promise((resolve, reject) => {
        const TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
          item.recordNumber = index + 1
          if (item.iEDate) {
            item.iEDate = item.iEDate.replace(/-/g, '')
          }
          return item
        })
        const TRANS_PRE_HEAD = this.appForm
        if (this.appForm.validTime) {
          this.$set(this.appForm, 'validTime', this.appForm.validTime.replace(/-/g, ''))
        }

        let body = {
          TRANS_PRE_HEAD,
          TRANS_PRE_BILL,
          TRANS_PRE_CONTAINER: this.dataFormThree,
          TRANS_PRE_GOODS: this.dataFormTour,
          TRANS_PRE_CONTA_GOODS: this.dataFormFive
        }
        this.$post('customsTransit', body).then((json) => {
          if (json.data && !json.data.length) {
            this.checkModal = false
            this.$pop({
              type: 'success',
              message: '校验成功'
            })
            resolve([])
          } else {
            this.checkModal = true
            this.checkData = json.data
            //reject(json.data)
          }
        })
      })
    },
    beforeModel() {
      this.checkModal = false
    },
    //编辑
    getEditInfo(id) {
      this.id = id
      restGet('getDetailSearch', id).then(({ data: editData }) => {
        this.appForm = editData.TRANS_PRE_HEAD
        this.dataFormTwo = editData.TRANS_PRE_BILL
        this.dataFormThree = editData.TRANS_PRE_CONTAINER
        this.dataFormTour = editData.TRANS_PRE_GOODS
        this.dataFormFive = editData.TRANS_PRE_CONTA_GOODS
        this.status = editData.TRANS_PRE_HEAD.status

        /*if(this.id===''){ //新增
          //this.btnFlag = true;
          //this.btnFlagHold = false;  //暂存
          //this.btnFlagClose = false; //清空
        }else{            //编辑
          if(this.status==='0'){//暂存
           // this.btnFlag = false;
            //this.btnFlagPrint = true; //打印
            //this.btnFlagSend = false;   //发送
          }else if(this.status==='1'){ //保存
            //this.btnFlagHold = true;
            //this.btnFlagClose = true;
            //this.btnFlag = false;
            //this.btnFlagPrint = false; //打印
            //this.btnFlagSend = false;   //发送
          }else if(this.status==='2'){  //发送
            //this.btnFlagHold = true;
            //this.btnFlagPrint = false;
            //this.btnFlagSend = false;
            //this.btnFlag=false;
          }
        }*/
        if (this.status == '0') {
          this.btnFlagPrint = true
        } else if (
          this.status == '2' ||
          this.status == '4' ||
          this.status == 'L' ||
          this.status == 'G' ||
          this.status == 'R'
        ) {
          this.btnFlag = true
        }
      })
    },
    //保存按钮
    async save() {
      //this.saveTransInterface() getNoHeadfind
      const checkData = await this.checkInterface()
      if (!checkData.length) {
        this.saveTransInterface()
      }
      //this.btnFlagHold = true;
      //this.btnFlagPrint = false;
      //this.btnFlagSend = false;

      if (this.appForm.status == '0') {
        this.btnFlagPrint = true
      } else if (
        this.appForm.status == '2' ||
        this.appForm.status == '4' ||
        this.appForm.status == 'L' ||
        this.appForm.status == 'G' ||
        this.appForm.status == 'R'
      ) {
        this.btnFlag = true
      } else {
        this.btnFlagPrint = false
        this.btnFlag = false
      }
    },
    //保存接口
    saveTransInterface() {
      /*  const TRANS_PRE_CONTAINER = this.dataFormThree.map((item,index)=>{
          item.contaSeqno=index+1

        /!*  if(isNaN(item.recordNumber)){
            let recordNumber =item.recordNumber;
            let recordNumberMatCh=recordNumber.match(/^[a-z|A-Z]+/gi);
            recordNumberMatCh=recordNumber.match(/\d+$/gi);
            item.recordNumber=recordNumberMatCh.toString()
          }*!/

          return item
        })*/
      /*const TRANS_PRE_GOODS = this.dataFormTour.map((item,index)=>{
        item.gNo=index+1
        return item
      })*/
      const TRANS_PRE_BILL = this.dataFormTwo.map((item, index) => {
        item.recordNumber = index + 1
        if (item.iEDate) {
          item.iEDate = item.iEDate.replace(/-/g, '')
        }
        return item
      })
      const TRANS_PRE_GOODS = this.dataFormTour
      const TRANS_PRE_CONTA_GOODS = this.dataFormFive
      const TRANS_PRE_CONTAINER = this.dataFormThree
      //修改保存
      if (this.id) {
        this.appForm.id = this.id
      }
      const TRANS_PRE_HEAD = this.appForm
      this.$set(this.appForm, 'status', '1')
      if (this.appForm.validTime) {
        this.$set(this.appForm, 'validTime', this.appForm.validTime.replace(/-/g, ''))
      }
      const _this = this
      return new Promise((resolve, reject) => {
        if (_this.id === '') {
          _this
            .$post('saveTrans', {
              TRANS_PRE_HEAD,
              TRANS_PRE_BILL,
              TRANS_PRE_CONTAINER,
              TRANS_PRE_GOODS,
              TRANS_PRE_CONTA_GOODS
            })
            .then((json) => {
              this.id = json.data.TRANS_PRE_HEAD.id
              resolve(json.data)
              this.appForm = json.data.TRANS_PRE_HEAD
              this.dataFormTwo = json.data.TRANS_PRE_BILL
              this.dataFormThree = json.data.TRANS_PRE_CONTAINER
              this.dataFormTour = json.data.TRANS_PRE_GOODS
              this.dataFormFive = json.data.TRANS_PRE_CONTA_GOODS

              this.appId = json.data.TRANS_PRE_HEAD.id
              this.title = '编辑' + this.appId
              // this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.appId,
                appId: this.appId,
                flag: 'edit'
              })

              this.$pop({
                type: 'success',
                message: '保存成功'
              })

              //复制
              this.copyId = json.data.TRANS_PRE_HEAD.id
              this.copyTitle = '编辑' + this.copyId
              //this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.copyId,
                appId: this.copyId,
                flag: 'edit'
              })

              //新增
              this.addId = json.data.TRANS_PRE_HEAD.id
              this.addTitle = '编辑' + this.addId
              // this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.addId,
                appId: this.addId,
                flag: 'edit'
              })
            })
            .catch((err) => reject(err.msg))
        } else {
          _this
            .$post('saveTrans', {
              TRANS_PRE_HEAD,
              TRANS_PRE_BILL,
              TRANS_PRE_CONTAINER,
              TRANS_PRE_GOODS,
              TRANS_PRE_CONTA_GOODS
            })
            .then((json) => {
              this.id = json.data.TRANS_PRE_HEAD.id
              resolve(json.data)
              this.appForm = json.data.TRANS_PRE_HEAD
              this.dataFormTwo = json.data.TRANS_PRE_BILL
              this.dataFormThree = json.data.TRANS_PRE_CONTAINER
              this.dataFormTour = json.data.TRANS_PRE_GOODS
              this.dataFormFive = json.data.TRANS_PRE_CONTA_GOODS

              this.appId = json.data.TRANS_PRE_HEAD.id
              this.title = '编辑' + this.appId
              //  this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.appId,
                appId: this.appId,
                flag: 'edit'
              })

              this.$pop({
                type: 'success',
                message: '保存成功'
              })

              //复制
              this.copyId = json.data.TRANS_PRE_HEAD.id
              this.copyTitle = '编辑' + this.copyId
              // this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.copyId,
                appId: this.copyId,
                flag: 'edit'
              })
              //新增
              this.addId = json.data.TRANS_PRE_HEAD.id
              this.addTitle = '编辑' + this.addId
              //  this.$app.trigger('close-tab')
              this.$app.trigger('locate-tab', 'transPreptIndex', {
                title: '编辑' + this.addId,
                appId: this.addId,
                flag: 'edit'
              })
            })
            .catch((err) => reject(err.msg))
        }
      })
    },
    //发送按钮
    send() {
      let id = this.id
      restGet('sendReport', id).then((json) => {
        this.getTransInterface()
        this.$pop({
          type: 'success',
          message: '报文发送成功'
        })
        /*  this.appForm={};
          this.appFormTwo={};
          this.appFormThree={};
          this.appFormTour={};
          this.appFormFive={};

          this.dataFormTwo=[];
          this.dataFormThree=[];
          this.dataFormTour=[];
          this.dataFormFive=[];*/

        //this.btnFlagHold = true;
        // this.btnFlagPrint = false;
        //this.btnFlagSend = false;
      })
    },
    //清空按钮
    close() {
      this.id = ''
      this.appForm = {}
      this.appFormTwo = {}
      this.appFormThree = {}
      this.appFormTour = {}
      this.appFormFive = {}

      this.dataFormTwo = []
      this.dataFormThree = []
      this.dataFormTour = []
      this.dataFormFive = []
    },
    //回显
    getTransInterface() {
      let id = this.id
      restGet('getDetail', id).then((json) => {
        this.appForm = json.data.TRANS_PRE_HEAD
        this.dataFormTwo = json.data.TRANS_PRE_BILL
        this.dataFormThree = json.data.TRANS_PRE_CONTAINER
        this.dataFormTour = json.data.TRANS_PRE_GOODS
        this.dataFormFive = json.data.TRANS_PRE_CONTA_GOODS

        if (this.appForm.status == '0') {
          this.btnFlagPrint = true
        } else if (
          this.appForm.status == '2' ||
          this.appForm.status == '4' ||
          this.appForm.status == 'L' ||
          this.appForm.status == 'G' ||
          this.appForm.status == 'R'
        ) {
          this.btnFlag = true
        }
      })
    },
    //查询按钮
    /* refresh(){
       this.refreshModal=true
       this.refreshModalForm.id=''
     },
     //查询模态框取消
     closeModel(){
       this.refreshModal=false
     },
     //查询模态框确定
     comfirmModel(){
       this.refreshModal=false
       let id = this.refreshModalForm.id
       restGet('getDetail', id).then(json => {
         this.appForm = json.data.TRANS_PRE_HEAD
         this.dataFormTwo = json.data.TRANS_PRE_BILL
         this.dataFormThree = json.data.TRANS_PRE_CONTAINER
         this.dataFormTour = json.data.TRANS_PRE_GOODS
         this.dataFormFive = json.data.TRANS_PRE_CONTA_GOODS
         this.id= json.data.TRANS_PRE_HEAD.id
       })
     },*/

    deepClone(o) {
      if (typeof o === 'string' || typeof o === 'number' || typeof o === 'boolean' || typeof o === 'undefined') {
        return o
      } else if (Array.isArray(o)) {
        const _arr = []
        o.forEach((item) => {
          _arr.push(item)
        })
        return _arr
      } else if (typeof o === 'object') {
        const _o = {}
        for (let key in o) {
          _o[key] = this.deepClone(o[key])
        }
        return _o
      }
    },
    //提单信息
    //模态框
    billOfLadingCloseModel() {
      this.billOfLadingModal = false
      this.dataFormTwoCellDIndex = null
    },
    billOfLadingComfirmModel() {
      /*if(billNo && billNo.length ){
        this.billOfLadingModal=true
        this.$pop({
          type:'warning',
          message:'提单号不可重复！'
        })
        return;
      }*/

      if (this.$route.query.flag == 'configuration') {
        this.billOfLadingModal = false
        if (this.dataFormTwoCellDIndex == null) {
          //新增
          let billNo = this.dataFormTwo.filter((e) => {
            if (e.billNo) {
              return e.billNo === this.appFormTwo.billNo
            }
          })
          if (billNo && billNo.length) {
            this.billOfLadingModal = true
            this.$pop({
              type: 'warning',
              message: '提单号不可重复！'
            })
            return
          }
          const obj = this.deepClone(this.appFormTwo)
          //if(!Object.keys(obj).length) return
          this.dataFormTwo.push(obj)

          //提单号查询返回的集装箱信息 直接放到集装箱表格里面，对于集装箱里面的提单序号以及集装箱序号要进行手动添加
          let billContainer = this.billContainer.container
          if (!billContainer || !billContainer.length) return
          billContainer.forEach((item) => {
            //回显集装箱表格里的数据
            item.billNo = item.BILL_NO
            item.contaModel = item.CONTA_MODEL
            item.contaNo = item.CONTA_NO
            item.sealNo = item.SEAL_NO
            item.eSealId = item.E_SEAL_ID
            item.sealNum = item.SEAL_NUM
            //添加提单序号
            let TRANS_PRE_BILL = this.dataFormTwo.map((itemRecordNumber, index) => {
              itemRecordNumber.recordNumber = index + 1
              return itemRecordNumber
            })
            TRANS_PRE_BILL.forEach((itemRecordNumberNum) => {
              item.recordNumber = itemRecordNumberNum.recordNumber
            })
            //添加集装箱序号
            let arr = this.dataFormThree.filter((itemContaSeqno) => {
              return itemContaSeqno.recordNumber === item.recordNumber
            })
            item.contaSeqno = arr.length + 1

            //表头里面的境内运输工具编号给货物信息的境内运输工具名称
            if (this.appForm.customsNo !== '') {
              this.$set(item, 'transName', this.appForm.customsNo)
            }
            this.dataFormThree.push(item)
          })
        } else {
          //编辑
          Object.assign(this.dataFormTwo[this.dataFormTwoCellDIndex], this.appFormTwo)

          //提单号查询返回的集装箱信息 直接放到集装箱表格里面，对于集装箱里面的提单序号以及集装箱序号要进行手动添加
          let billContainer = this.billContainer.container
          if (!billContainer || !billContainer.length) return
          //修改之后把原来的删除，在添加新的
          this.dataFormThree = this.dataFormThree.filter((v) => v.recordNumber !== this.dataFormTwoCellDIndex + 1)
          billContainer.forEach((item, index) => {
            const obj = {}
            obj.billNo = item.BILL_NO
            obj.contaModel = item.CONTA_MODEL
            obj.contaNo = item.CONTA_NO
            obj.sealNo = item.SEAL_NO
            obj.eSealId = item.E_SEAL_ID
            obj.sealNum = item.SEAL_NUM
            obj.recordNumber = this.dataFormTwoCellDIndex + 1
            obj.contaSeqno = index + 1

            //表头里面的境内运输工具编号给货物信息的境内运输工具名称
            if (this.appForm.customsNo !== '') {
              this.$set(obj, 'transName', this.appForm.customsNo)
            }
            this.dataFormThree.push(obj)
          })

          this.dataFormTwo.splice(0, 0)
          this.appFormTwo = {}
        }
      } else {
        if (!this.appFormTwo.billNo) {
          this.$pop({
            type: 'warning',
            message: '提单号不能为空'
          })
          this.billOfLadingModal = true
        } else {
          this.billOfLadingModal = false
          if (this.dataFormTwoCellDIndex == null) {
            //新增
            let billNo = this.dataFormTwo.filter((e) => e.billNo === this.appFormTwo.billNo)
            if (billNo && billNo.length) {
              this.billOfLadingModal = true
              this.$pop({
                type: 'warning',
                message: '提单号不可重复！'
              })
              return
            }

            const obj = this.deepClone(this.appFormTwo)
            //if(!Object.keys(obj).length) return
            this.dataFormTwo.push(obj)

            //提单号查询返回的集装箱信息 直接放到集装箱表格里面，对于集装箱里面的提单序号以及集装箱序号要进行手动添加
            let billContainer = this.billContainer.container
            if (!billContainer || !billContainer.length) return
            billContainer.forEach((item) => {
              //回显集装箱表格里的数据
              item.billNo = item.BILL_NO
              item.contaModel = item.CONTA_MODEL
              item.contaNo = item.CONTA_NO
              item.sealNo = item.SEAL_NO
              item.eSealId = item.E_SEAL_ID
              item.sealNum = item.SEAL_NUM
              //添加提单序号
              let TRANS_PRE_BILL = this.dataFormTwo.map((itemRecordNumber, index) => {
                itemRecordNumber.recordNumber = index + 1
                return itemRecordNumber
              })
              TRANS_PRE_BILL.forEach((itemRecordNumberNum) => {
                item.recordNumber = itemRecordNumberNum.recordNumber
              })
              //添加集装箱序号
              let arr = this.dataFormThree.filter((itemContaSeqno) => {
                return itemContaSeqno.recordNumber === item.recordNumber
              })
              item.contaSeqno = arr.length + 1

              //表头里面的境内运输工具编号给货物信息的境内运输工具名称
              if (this.appForm.customsNo !== '') {
                this.$set(item, 'transName', this.appForm.customsNo)
              }
              this.dataFormThree.push(item)
            })
          } else {
            //编辑
            Object.assign(this.dataFormTwo[this.dataFormTwoCellDIndex], this.appFormTwo)
            //提单号查询返回的集装箱信息 直接放到集装箱表格里面，对于集装箱里面的提单序号以及集装箱序号要进行手动添加
            let billContainer = this.billContainer.container
            if (!billContainer || !billContainer.length) {
              this.dataFormTwo.splice(0, 0)
              this.appFormTwo = {}
              return
            } else {
              //修改之后把原来的删除，在添加新的
              this.dataFormThree = this.dataFormThree.filter((v) => v.recordNumber !== this.dataFormTwoCellDIndex + 1)
              billContainer.forEach((item, index) => {
                const obj = {}
                obj.billNo = item.BILL_NO
                obj.contaModel = item.CONTA_MODEL
                obj.contaNo = item.CONTA_NO
                obj.sealNo = item.SEAL_NO
                obj.eSealId = item.E_SEAL_ID
                obj.sealNum = item.SEAL_NUM
                obj.recordNumber = this.dataFormTwoCellDIndex + 1
                obj.contaSeqno = index + 1

                //表头里面的境内运输工具编号给货物信息的境内运输工具名称
                if (this.appForm.customsNo !== '') {
                  this.$set(obj, 'transName', this.appForm.customsNo)
                }
                this.dataFormThree.push(obj)
              })
              this.dataFormTwo.splice(0, 0)
              this.appFormTwo = {}
            }
          }
        }
      }
      this.dataFormTwoCellDIndex = null
    },
    //提单信息的添加按钮
    addClickFormTwo() {
      if (this.$route.query.epToken && this.dataFormTwo.length == 1) {
        this.$pop({ type: 'danger', message: '只能有一条提单信息' })
        return
      }
      //点+号是运输方式、船舶名称给默认值
      this.$nextTick(() => {
        if (this.dataFormTwo.length !== 0) {
          if (this.dataFormTwo[0].trafMode !== '') {
            this.appFormTwo.trafMode = this.dataFormTwo[0].trafMode || ''
          }
          if (this.dataFormTwo[0].shipNameEn !== '') {
            this.appFormTwo.shipNameEn = this.dataFormTwo[0].shipNameEn || ''
          }
          if (this.dataFormTwo[0].voyageNo !== '') {
            this.appFormTwo.voyageNo = this.dataFormTwo[0].voyageNo || ''
          }
        }
      })

      this.dataFormTwoCellDIndex = null
      this.billOfLadingModal = true
      this.billOfLadingTitleName = '添加提单信息'
      this.appFormTwo = {}
    },
    //提单信息的删除按钮
    delClickFormTwo() {
      //添加之后不会连续删除
      if (this.rowClickFormTwoIndex === '') return
      //集装箱信息：提单信息表格点击删除一条，对应的集装箱信息里的内容也要删除，集装箱对应的提单序号和集装箱号重新赋值
      /* let delRow=this.dataFormTwo[this.rowClickFormTwoIndex]//当前删除的那一条信息
       let arr = this.dataFormThree.filter(item=>item.recordNumber===delRow.recordNumber) //根据删除的筛选出集装箱对应的数据
         this.dataFormThree.splice(0, arr.length); //删除对应集装箱的数据
         this.dataFormThree.forEach((item,index)=>{ //为提单序号和集装箱序号重新赋值
         })*/

      //从三个表格中找到与提单信息recordNumber相等的那条，删掉
      this.dataFormThree = this.dataFormThree.filter(
        (v) => v.recordNumber !== this.dataFormTwo[this.rowClickFormTwoIndex].recordNumber
      )
      this.dataFormTour = this.dataFormTour.filter(
        (v) => v.recordNumber !== this.dataFormTwo[this.rowClickFormTwoIndex].recordNumber
      )
      this.dataFormFive = this.dataFormFive.filter(
        (v) => v.recordNumber !== this.dataFormTwo[this.rowClickFormTwoIndex].recordNumber
      )
      //删掉提单信息的那条数据
      this.dataFormTwo.splice(this.rowClickFormTwoIndex, 1)
      //重新对提单信息的提单序号排序
      this.dataFormTwo.forEach((v, index) => {
        v.recordNumber = index + 1
      })
      //删除后根据提单信息的提单序号对其他三个表格进行排序
      this.dataFormTwo.forEach((item, i) => {
        if (i >= this.rowClickFormTwoIndex) {
          //只对删除当前条或删除当前后面的数据进行排序
          this.dataFormThree.forEach((item2) => {
            if (item2.recordNumber === item.recordNumber + 1) {
              item2.recordNumber = item.recordNumber
            }
          })
        }
      })
      /*
       let delIndex = this.rowClickFormTwoIndex + 1
        this.dataFormThree.forEach(item => {
          if(item.recordNumber > delIndex) {
            item.recordNumber -=1
          }
      })
      */
      //货物信息
      this.dataFormTwo.forEach((item, i) => {
        if (i >= this.rowClickFormTwoIndex) {
          this.dataFormTour.forEach((item2) => {
            if (item2.recordNumber === item.recordNumber + 1) {
              item2.recordNumber = item.recordNumber
            }
          })
        }
      })
      //集装箱-货物 关系
      this.dataFormTwo.forEach((item, i) => {
        if (i >= this.rowClickFormTwoIndex) {
          this.dataFormFive.forEach((item2) => {
            if (item2.recordNumber === item.recordNumber + 1) {
              item2.recordNumber = item.recordNumber
            }
          })
        }
      })

      this.dataFormThree.splice(0, 0) //更新集装箱表格
      this.dataFormTour.splice(0, 0)
      this.dataFormFive.splice(0, 0)

      // this.dataFormTwo.splice(this.rowClickFormTwoIndex, 1);
      this.rowClickFormTwoIndex = ''
    },
    //提单信息的单元格点击事件
    rowClickFormTwo(event, row, index) {
      this.appFormTwo = {
        ...row
      }
      this.rowClickFormTwoIndex = index
      this.indexTwo = index
      this.row = row
      //点击行取消行 不删除
      setTimeout(() => {
        let flag = this.$refs.tableFormTwo.getHighlightRow()
        this.flagTwo = flag
        if (!flag) {
          this.rowClickFormTwoIndex = ''
          this.indexTwo = ''
        }
      }, 100)
      /* this.$refs.tableFormThree.setHighlightRow()
       this.$refs.tableFormTour.setHighlightRow()
       this.$refs.tableFormFive.setHighlightRow()
       */
    },
    //双击表格编辑
    cellDblclickTwo(event, row, index) {
      this.appFormTwo = {}
      this.billOfLadingModal = true
      this.billOfLadingTitleName = '编辑提单信息'
      this.dataFormTwoCellDIndex = index
      this.appFormTwo = { ...row }
      this.TRAF_MODE_STDValue = this.selectList.TRAF_MODE_STDValue
    },

    //集装箱信息
    containerModalComfirmModel() {
      this.containerModal = false
      if (this.dataFormThreeCellDIndex == null) {
        //新增
        const obj = this.deepClone(this.appFormThree)

        //筛选data中的提单号（把符合条件的数据放在arr数组中）
        const arr = this.dataFormThree.filter((item) => {
          return item.recordNumber === obj.recordNumber
        })
        //用筛选出来的数据给obj添加contasequo属性（arr.length是之前有多少条，现在每添加一条就length+1）
        obj.contaSeqno = arr.length + 1

        this.dataFormThree.push(obj)
      } else {
        //编辑

        Object.assign(this.dataFormThree[this.dataFormThreeCellDIndex], this.appFormThree)

        //集装箱信息表格集装箱号修改同步集装箱-货物 关系表格的集装箱号
        const contaNoRow = this.dataFormFive.filter((item) => {
          return (
            item.contaSeqno === this.appFormThree.contaSeqno && item.recordNumber === this.appFormThree.recordNumber
          )
        })
        contaNoRow.forEach((item) => {
          this.$set(item, 'contaNo', this.appFormThree.contaNo)
        })

        //双击修改集装箱序号排列 old new都要重新排列
        let recordNumberOld = this.recordNumberContainer // old
        let recordNumberNew = this.appFormThree.recordNumber
        let j = 1
        let k = 1
        this.dataFormThree.map((item) => {
          if (item.recordNumber === recordNumberOld) {
            item.contaSeqno = j
            j++
          }
          if (item.recordNumber === recordNumberNew) {
            item.contaSeqno = k
            k++
          }
        })
        this.recordNumberContainer = null

        this.dataFormThree.splice(0, 0)
      }
      this.appFormThree = {}
      this.dataFormThreeCellDIndex = null
    },
    containerModalCloseModel() {
      this.containerModal = false
      this.dataFormThreeCellDIndex = null
    },
    addClickFormThree() {
      //表头里面的境内运输工具编号给货物信息的境内运输工具名称
      this.$nextTick(() => {
        if (this.appForm.customsNo !== '') {
          this.$set(this.appFormThree, 'transName', this.appForm.customsNo)
        }
      })

      this.dataFormThreeCellDIndex = null
      //添加时提单序号可输入编辑时不可输入；集装箱序号添加编辑都不可输入
      this.conRecordNumberDisabled = false
      this.conContaSeqnoDisabled = true

      this.containerModal = true
      this.containerTitleName = '添加集装箱信息'
      this.appFormThree = {}
    },
    delClickFormThree() {
      if (this.rowClickFormThreeIndex === '') return

      //集装箱信息:点击删除，关系表对应的删除
      let delRow = this.dataFormThree[this.rowClickFormThreeIndex]
      /* let index = this.dataFormFive.findIndex(item=>item.recordNumber===delRow.recordNumber && item.contaSeqno===delRow.contaSeqno)
       if (index !== -1) {
         this.dataFormFive.splice(index, 1);
       }*/
      this.dataFormFive = this.dataFormFive.filter(
        (item) => !(item.recordNumber === delRow.recordNumber && item.contaSeqno === delRow.contaSeqno)
      )

      //找到当前要删除的提单号
      const recordNumber = this.dataFormThree[this.rowClickFormThreeIndex].recordNumber
      let i = 1

      this.dataFormThree.splice(this.rowClickFormThreeIndex, 1)

      //如果表格中的提单号和要删除的提单号一样，
      this.dataFormThree.map((item) => {
        const flag = item.recordNumber === recordNumber
        if (flag) {
          item.contaSeqno = i
          i++
        }
      })

      this.rowClickFormThreeIndex = ''
      this.appFormThree = {}
    },
    rowClickFormThree(event, row, index) {
      this.appFormThree = { ...row }
      setTimeout(() => {
        const flag = this.$refs.tableFormThree.getHighlightRow()
        if (!flag) {
          this.rowClickFormThreeIndex = ''
          this.indexThree = ''
        } else {
          this.rowClickFormThreeIndex = index
          this.indexThree = index
        }
      }, 100)
      this.recordNumberContainer = null
      this.recordNumberContainer = row.recordNumber
    },
    cellDblclickThree(event, row, index) {
      this.appFormThree = {}
      this.conRecordNumberDisabled = true
      this.conContaSeqnoDisabled = true
      this.containerModal = true
      this.containerTitleName = '编辑集装箱信息'

      this.dataFormThreeCellDIndex = index
      this.appFormThree = { ...row }
      this.CONTA_MODELValue = this.selectList.CONTA_MODELValue
    },

    //货物信息
    goodsModalComfirmModel() {
      let _this = this
      this.goodsModal = false
      if (this.dataFormTourCellDIndex == null) {
        let obj = this.deepClone(this.appFormTour)
        const arr = this.dataFormTour.filter((item) => {
          return item.recordNumber === obj.recordNumber
        })
        obj.gNo = arr.length + 1
        this.dataFormTour.push(obj)
      } else {
        Object.assign(this.dataFormTour[this.dataFormTourCellDIndex], this.appFormTour)

        //双击修改集装箱序号排列
        let recordNumberOld = this.recordNumberGNo // old
        let recordNumberNew = this.appFormTour.recordNumber
        let j = 1
        let k = 1
        this.dataFormTour.map((item) => {
          if (item.recordNumber === recordNumberOld) {
            item.gNo = j
            j++
          }
          if (item.recordNumber === recordNumberNew) {
            item.gNo = k
            k++
          }
        })
        this.recordNumberGNo = null

        this.dataFormTour.splice(0, 0)
        this.appFormTour = {}
      }
      this.dataFormTourCellDIndex = null
    },
    goodsModalCloseModel() {
      this.goodsModal = false
      this.dataFormTourCellDIndex = null
    },
    addClickFormTour() {
      if (this.$route.query.epToken) {
        this.goodsModal = false
        this.$pop({ type: 'warning', message: '货物信息不能新增！' })
      } else {
        this.dataFormTourCellDIndex = null
        // 添加时提单序号可输入编辑时不可输入；商品序号添加编辑都不可输入
        this.goodGNoDisabled = true
        this.goodRecordNumberDisabled = false
        this.goodsModal = true
        this.goodsTitleName = '添加货物信息'
        this.appFormTour = {}
      }
    },
    delClickFormTour() {
      if (this.$route.query.epToken) {
        this.goodsModal = false
        this.$pop({ type: 'warning', message: '货物信息不能删除！' })
      } else {
        if (this.rowClickFormTourIndex === '') return

        //货物信息:点击删除，关系表对应的删除
        let delRow = this.dataFormTour[this.rowClickFormTourIndex]
        this.dataFormFive = this.dataFormFive.filter(
          (item) => !(item.recordNumber === delRow.recordNumber && item.gNo === delRow.gNo)
        )

        const recordNumber = this.dataFormTour[this.rowClickFormTourIndex].recordNumber
        let i = 1

        this.dataFormTour.splice(this.rowClickFormTourIndex, 1)

        //如果表格中的提单号和要删除的提单号一样，
        this.dataFormTour.map((item) => {
          const flag = item.recordNumber === recordNumber
          if (flag) {
            item.gNo = i
            i++
          }
        })

        this.rowClickFormTourIndex = ''
      }
    },
    rowClickFormTour(event, row, index) {
      this.appFormTour = {
        ...row
      }
      setTimeout(() => {
        const flag = this.$refs.tableFormTour.getHighlightRow()
        if (!flag) {
          this.rowClickFormTourIndex = ''
          this.indexTour = ''
        } else {
          this.rowClickFormTourIndex = index
          this.indexTour = index
        }
      }, 100)

      this.recordNumberGNo = null
      this.recordNumberGNo = row.recordNumber
    },
    cellDblclickTour(event, row, index) {
      if (this.$route.query.epToken) {
        this.goodsModal = false
        this.$pop({ type: 'warning', message: '货物信息不能修改！' })
      } else {
        this.appFormTour = {}
        //this.goodsDisabled=true
        this.goodGNoDisabled = true
        this.goodRecordNumberDisabled = true
        this.goodsModal = true
        this.goodsTitleName = '编辑货物信息'
        this.dataFormTourCellDIndex = index
        this.appFormTour = { ...row }
        this.COMPLEXValue = this.selectList.COMPLEXValue
      }
    },

    //集装箱-货物 关系
    containerGoodsComfirmModel() {
      //校验3个下拉框哪个没填提示
      let errorMessage = ''
      if (!this.appFormFive.recordNumber || !this.appFormFive.gNo || !this.appFormFive.contaSeqno) {
        if (!this.appFormFive.recordNumber) {
          errorMessage = '提单序号不能为空! '
        }
        if (!this.appFormFive.gNo) {
          errorMessage = errorMessage + '商品序号不能为空! '
        }
        if (!this.appFormFive.contaSeqno) {
          errorMessage = errorMessage + '集装箱序号不能为空! '
        }
        if (errorMessage) {
          this.$pop({
            type: 'danger',
            message: errorMessage
          })
        }
        return
      }

      // 校验重复记录数组 三个字段拼接字符串（把表格中的校验字段拼接成字符串）
      const arr = this.dataFormFive.map((item) => {
        return '' + item.recordNumber + item.gNo + item.contaSeqno
      })
      if (this.dataFormFiveCellDIndex == null) {
        //新增逻辑
        const obj = this.deepClone(this.appFormFive)

        //把表单里面的3字段拼接字符串
        const checkData = '' + obj.recordNumber + obj.gNo + obj.contaSeqno
        //arr是数组，每个对象是字符串（‘111’），去arr找到表单对应的对象代表重复，校验
        if (arr.find((item) => item === checkData)) {
          this.$pop({
            type: 'danger',
            message: `提单序号为：${obj.recordNumber}, 集装箱序号为：${obj.contaSeqno}, 商品序号为：${obj.gNo} 的记录已存在！`
          })
          return false
        }

        this.dataFormFive.push(obj)
      } else {
        //编辑逻辑
        //编辑：校验如果表格中和表单输入的序号一样，就提示
        /* const checkData ='' + this.appFormFive.recordNumber +  this.appFormFive.gNo + this.appFormFive.contaSeqno
         if (arr.findIndex(item=>item === checkData) !== -1) {
         this.$pop({
           type: 'danger',
           message: `提单序号为：${this.appFormFive.recordNumber}, 集装箱序号为：${this.appFormFive.contaSeqno}, 商品序号为：${this.appFormFive.gNo} 的记录已存在！`
         })
         return false
       }*/
        Object.assign(this.dataFormFive[this.dataFormFiveCellDIndex], this.appFormFive)
        this.dataFormFive.splice(0, 0)
        this.dataFormFiveCellDIndex = null
        this.appFormFive = {}
      }

      this.containerGoodsModal = false
    },
    containerGoodsCloseModel() {
      this.containerGoodsModal = false
      this.appFormFive = {}
    },
    addClickFormFive() {
      //双击时有index,但取消和点×时没有把index置为空，点击添加时index就有值会走编辑，所有要置为null
      this.dataFormFiveCellDIndex = null
      this.containersGoodSDisabled = false
      this.containerGoodsModal = true
      this.containerGoodsTitleName = '添加集装箱-货物信息'
      this.appFormFive = {}
    },
    delClickFormFive() {
      if (this.rowClickFormFiveIndex === '') return
      this.dataFormFive.splice(this.rowClickFormFiveIndex, 1)
      this.rowClickFormFiveIndex = ''
    },
    rowClickFormFive(event, row, index) {
      this.appFormFive = {
        ...row
      }
      setTimeout(() => {
        const flag = this.$refs.tableFormFive.getHighlightRow()
        if (!flag) {
          this.rowClickFormFiveIndex = ''
          this.indexFive = ''
        } else {
          this.rowClickFormFiveIndex = index
          this.indexFive = index
        }
      }, 100)
    },
    cellDblclickFive(event, row, index) {
      this.appFormFive = {}
      this.containersGoodSDisabled = true
      this.containerGoodsModal = true
      this.containerGoodsTitleName = '编辑集装箱-货物信息'

      this.dataFormFiveCellDIndex = index
      this.appFormFive = { ...row }
    }
  }
}
</script>
