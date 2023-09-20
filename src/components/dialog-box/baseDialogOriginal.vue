<template>
  <div class="base-dialog">
    <el-dialog
      v-model:visible="visible"
      :title="title"
      :width="width"
      :append-to-body="appendToBody"
    >
      <slot></slot>
      <div v-if="isShowFooter" slot="footer">
        <el-button @click="visible = false">{{ cancel_name }}</el-button>
        <el-button type="primary" @click="confirmBtn">{{
          confirm_name
        }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'BaseDialogOriginal',
  props: {
    title: {
      // 标题
      type: String,
      default: '提示',
    },
    isShow: {
      // 弹窗是否展示
      type: Boolean,
      default: false,
    },
    width: {
      //弹窗宽度
      type: String,
      default: '',
    },
    cancel_name: {
      //取消按钮名称
      type: String,
      default: '取 消',
    },
    confirm_name: {
      //确定按钮名称
      type: String,
      default: '确 定',
    },
    isShowFooter: {
      //是否自定底部
      type: Boolean,
      default: true,
    },
    appendToBody: {
      // 是否将自身插入至 body 元素，有嵌套的弹窗时一定要设置
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {
    visible: {
      get() {
        return this.isShow
      },
      set(val) {
        this.$emit('update:isShow', false)
      },
    },
  },
  created() {},
  mounted() {},

  methods: {
    confirmBtn() {
      // 触发保存
      //this.$emit('handleClick')
      this.$emit('update:isShow', false)
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .el-dialog {
  .el-dialog__header {
    box-shadow: 0px 0px 5px 0px rgba(136, 152, 157, 0.3);
    border-radius: 6px 6px 0px 0px;
    padding: 20px 20px 18px 25px;
    .el-dialog__title {
      color: #212121;
      font-weight: 16px;
    }
  }
  .el-dialog__body {
    padding-left: 25px;
  }
}
</style>
