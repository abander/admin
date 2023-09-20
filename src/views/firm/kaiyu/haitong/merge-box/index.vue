<template>
  <div>
    <el-button type="success" @click="btn">合并组件测试</el-button>
    <dialog-box
      v-model:visible="isShow"
      title="测试"
      width="926px"
      :loading="loading"
      :is-check="isCheck"
      @handleSave="confirmBtn"
      @handleCancel="cancelBtn"
    >
      <div slot="content">
        <div v-loading="mergeLoading" class="content">
          <div class="content-left">
            <el-tree
              ref="mergeTree"
              class="border-directory-tree"
              :data="mergeTreeData"
              :highlight-current="true"
              :props="defaultProps"
              node-key="id"
              :current-node-key="currentNodeKey"
              default-expand-all
              @node-click="treeCheck"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node-merge">
                <span>
                  <el-tooltip
                    placement="bottom"
                    :content="node.label"
                    :disabled="node.label.length < 10"
                  >
                    <span class="target-tree-data-box">{{ node.label }}</span>
                  </el-tooltip>
                </span>
              </span>
            </el-tree>
          </div>
          <div class="content-right">
            <div class="title">板块表达式</div>
            <div class="operation">
              <formula-editor
                ref="formulaEditor"
                :data="mergePlateDetailsData"
                text-name="title"
                node-key="vcPlateTreeTypeId"
                @error="errorFn"
              />
              <div class="icon">
                <div class="add" @click="iconClick('+', 'math')">
                  <span class="add-span" /><i class="add-i" />
                </div>
                <div class="subtract" @click="iconClick('-', 'math')">
                  <span class="add-span" /><i class="add-i" />
                </div>
                <div class="ride" @click="iconClick('*', 'math')">
                  <span class="add-span" /><i class="add-i" />
                </div>
                <div class="left" @click="iconClick('(', 'brackets-start')">
                  <span class="add-span" />
                </div>
                <div class="right" @click="iconClick(')', 'brackets-end')">
                  <span class="add-span" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-box>
  </div>
</template>

<script>
import FormulaEditor from './components/formula-editor/index.vue'
import DialogBox from '../../../../../components/dialog-box/index.vue'
export default {
  components: {
    FormulaEditor,
    DialogBox,
  },
  data() {
    return {
      // 弹出框显隐
      isShow: false,
      // loading
      loading: false,
      // 是否校验
      isCheck: true,
      // 条件表达式回显的数据
      mergePlateDetailsData: [
        {
          title: '规则1',
          vcPlateTreeTypeId: 'RM_1549688412901085184',
          type: null,
        },
        { title: '+', vcPlateTreeTypeId: '+', type: 'math' },
        {
          title: '合并',
          vcPlateTreeTypeId: 'RM_1549689180991393792',
          type: null,
        },
        { title: '+', vcPlateTreeTypeId: '+', type: 'math' },
        {
          title: '测试规则',
          vcPlateTreeTypeId: 'RM_1550376256539856896',
          type: null,
        },
        { title: '+', vcPlateTreeTypeId: '+', type: 'math' },
        {
          title: '12',
          vcPlateTreeTypeId: 'RM_1552833510564302848',
          type: null,
        },
        { title: '-', vcPlateTreeTypeId: '-', type: 'math' },
        {
          title: '1111',
          vcPlateTreeTypeId: 'RM_1552835073995313152',
          type: null,
        },
      ],
      // loading
      mergeLoading: false,
      // tree的数据
      mergeTreeData: [
        {
          title: 'hhh',
          isoOpen: '0',
          vcPlateTreeTypePId: '0',
          vcPlateTreeTypeId: '1551444696946208769',
          type: 1,
          children: [
            {
              title: 'hh',
              isoOpen: '0',
              vcPlateTreeTypePId: '1551444696946208769',
              vcPlateTreeTypeId: '1549576958720139266',
              type: 1,
              children: [
                {
                  title: '规则1',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1461',
                  type: 2,
                  children: [],
                  plateType: '1',
                  vcPlateCode: 'RM_1549688412901085184',
                },
                {
                  title: '合并1',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1484',
                  type: 2,
                  children: [],
                  plateType: '2',
                  vcPlateCode: 'RM_1549948877224939520',
                },
                {
                  title: '测试规则',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1568',
                  type: 2,
                  children: [],
                  plateType: '1',
                  vcPlateCode: 'RM_1550376256539856896',
                },
                {
                  title: '12',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1643',
                  type: 2,
                  children: [],
                  plateType: '1',
                  vcPlateCode: 'RM_1552833510564302848',
                },
                {
                  title: '131',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1645',
                  type: 2,
                  children: [],
                  plateType: '1',
                  vcPlateCode: 'RM_1552834092192632832',
                },
                {
                  title: '1111',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1646',
                  type: 2,
                  children: [],
                  plateType: '1',
                  vcPlateCode: 'RM_1552835073995313152',
                },
                {
                  title: '静态1',
                  isoOpen: '0',
                  vcPlateTreeTypePId: '1549576958720139266',
                  vcPlateTreeTypeId: '1662',
                  type: 2,
                  children: [],
                  plateType: '3',
                  vcPlateCode: 'RM_1554017972153094144',
                },
              ],
              plateType: '0',
              vcPlateCode: null,
            },
            {
              title: '哈哈哈哈',
              isoOpen: '0',
              vcPlateTreeTypePId: '1551444696946208769',
              vcPlateTreeTypeId: '1552836840198053889',
              type: 1,
              children: [],
              plateType: '0',
              vcPlateCode: null,
            },
            {
              title: '静态',
              isoOpen: '0',
              vcPlateTreeTypePId: '1551444696946208769',
              vcPlateTreeTypeId: '1460',
              type: 2,
              children: [],
              plateType: '3',
              vcPlateCode: 'RM_1549686202272190464',
            },
            {
              title: '测试',
              isoOpen: '0',
              vcPlateTreeTypePId: '1551444696946208769',
              vcPlateTreeTypeId: '1591',
              type: 2,
              children: [],
              plateType: '1',
              vcPlateCode: 'RM_1551492841358888960',
            },
            {
              title: '11',
              isoOpen: '0',
              vcPlateTreeTypePId: '1551444696946208769',
              vcPlateTreeTypeId: '1642',
              type: 2,
              children: [],
              plateType: '1',
              vcPlateCode: 'RM_1552832446943334400',
            },
          ],
          plateType: '0',
          vcPlateCode: null,
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'title',
      },
      currentNodeKey: '1-1',
    }
  },
  methods: {
    // icon click事件
    iconClick(title, type) {
      const item = {
        title,
        vcPlateTreeTypeId: title,
        type,
      }
      this.$refs.formulaEditor.push(item)
    },
    // tree node-click事件
    treeCheck(data, node) {
      // console.log(data, node, 'node')
      // 板块id存储
      if (data.type === 2) {
        this.$refs.formulaEditor.push({
          title: data.title,
          vcPlateTreeTypeId: data.vcPlateCode,
          data,
        })
      }
    },
    // 按钮
    btn() {
      this.isShow = true
    },
    // err 报错
    errorFn({ msg }) {
      this.$message.warning(msg)
    },
    // 取消按钮
    cancelBtn() {
      this.isShow = false
    },
    // 确定按钮
    confirmBtn() {
      this.$refs.formulaEditor
        .getValidatorData()
        .then((data) => {
          // 获取总数据
          if (data.length) {
            console.log('校验通过')
            this.isShow = false
          } else {
            this.isShow = true
            this.$message({ type: 'warning ', message: '请添加板块表达式' })
          }
        })
        .catch((err) => {
          this.$message({ type: 'warning ', message: err.msg })
          console.log('校验不通过', err)
          this.isShow = true
        })
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  display: flex;
  justify-content: space-between;
  .content-left {
    width: 208px;
    height: 570px;
    background: #ffffff;
    border-right: 1px solid #f0f2f5;
    .border-directory-tree {
      width: 100%;
      height: calc(100% - 50px);
      overflow: auto;
      .custom-tree-node-merge {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        font-size: 14px;
        width: 80%;
        .target-tree-data-box {
          display: inline-block;
          max-width: 74px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      :deep.el-tree-node > .el-tree-node__children {
        overflow: visible;
      }
    }
  }
  .content-right {
    width: calc(100% - 208px);
    height: 100%;
    background: #ffffff;
    margin: 0px 10px;
    .title {
      width: 90px;
      height: 22px;
      font-size: 14px;
      font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
      font-weight: bold;
      color: #2f4050;
      line-height: 22px;
    }
    .operation {
      .icon {
        display: flex;
        justify-content: flex-start;
        margin-top: 15px;
        cursor: pointer;
        .add {
          width: 56px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #f0f2f5;
          text-align: center;
          line-height: 24px;
          margin-right: 10px;
          .add-span {
            display: inline-block;
            width: 22px;
            height: 14px;
            background: url('../../assets/images/plate-connect.png') no-repeat;
          }
          .add-i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('../../assets/images/plate-add.png') no-repeat;
          }
        }
        .subtract {
          width: 56px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #f0f2f5;
          text-align: center;
          line-height: 24px;
          margin-right: 10px;
          .add-span {
            display: inline-block;
            width: 22px;
            height: 14px;
            background: url('../../assets/images/minus.svg') no-repeat;
          }
          .add-i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('../../assets/images/plate-subtract.png') no-repeat;
          }
        }
        .ride {
          width: 56px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #f0f2f5;
          text-align: center;
          line-height: 24px;
          margin-right: 10px;
          .add-span {
            display: inline-block;
            width: 22px;
            height: 14px;
            background: url('../../assets/images/times-sign.png') no-repeat;
          }
          .add-i {
            display: inline-block;
            width: 16px;
            height: 16px;
            background: url('../../assets/images/plate-ride.png') no-repeat;
          }
        }
        .left {
          width: 6px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #f0f2f5;
          text-align: center;
          line-height: 24px;
          margin-right: 10px;
          .add-span {
            display: inline-block;
            width: 22px;
            height: 14px;
            background: url('../../assets/images/plate-left.png') no-repeat;
          }
        }
        .right {
          width: 6px;
          height: 24px;
          border-radius: 2px;
          border: 1px solid #f0f2f5;
          text-align: center;
          line-height: 24px;
          .add-span {
            display: inline-block;
            width: 22px;
            height: 14px;
            background: url('../../assets/images/plate-right.png') no-repeat;
          }
        }
      }
    }
  }
}
</style>
