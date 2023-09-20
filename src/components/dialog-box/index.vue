<template>
  <div class="base-dialog">
    <!-- v-on="$listeners"   -->
    <el-dialog v-bind="$attrs">
      <div v-loading="loading">
        <div class="content">
          <slot name="content"></slot>
        </div>
        <div v-if="isShowFooter" slot="footer" class="base-dialog-footer">
          <div v-if="$slots.default">
            <slot name="footer"></slot>
          </div>
          <div v-else>
            <!--          <el-button  @click="$emit('update:visible',false)">{{cancel_name}}</el-button>-->
            <el-button @click="cancelBtn">{{ cancel_name }}</el-button>
            <el-button type="primary" @click="confirmBtn">{{
              confirm_name
            }}</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Index',
  props: {
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
    loading: {
      //loading
      type: Boolean,
      default: false,
    },
    isCheck: {
      //是否需要校验
      type: Boolean,
      default: false,
    },
  },
  methods: {
    confirmBtn() {
      // 触发保存
      if (this.isCheck) {
        this.$emit('handleSave')
      } else {
        this.$emit('update:visible', false)
      }
    },
    cancelBtn() {
      // 触发取消
      if (this.isCheck) {
        this.$emit('handleCancel')
      } else {
        this.$emit('update:visible', false)
      }
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
      font-size: 16px;
    }
  }
  .el-dialog__body {
    padding-left: 25px;
  }
}
.base-dialog-footer {
  display: flex;
  justify-content: end;
  margin-top: 10px;
}
</style>
