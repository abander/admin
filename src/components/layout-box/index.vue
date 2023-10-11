<template>
  <div class="l-item-wrapper" :class="border && 'is-border'">
    <div v-if="showHeader" class="l-item__title" :style="titleStyle">
      <span class="l-item__title-text">
        <slot name="title">{{ title }}</slot>
      </span>
      <div :class="['l-item__extra m-l-10px', extraNoMargin && 'no-margin']">
        <slot name="extra" />
      </div>
    </div>

    <div :class="['l-item__content', contentNoPadding && 'no-padding', showHeader && 'no-radius']">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'LayoutBox',
  props: {
    /*
     **标题
     **/
    title: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left'
    },
    justify: {
      type: String,
      default: 'left'
    },
    extraNoMargin: {
      type: Boolean,
      default: true
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    contentNoPadding: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: true
    },
    headerHeight: {
      type: String,
      default: ''
    }
  },
  computed: {
    titleStyle() {
      return {
        justifyContent: this.justify,
        alignItems: this.align,
        height: this.headerHeight
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.l-item-wrapper {
  display: flex;
  flex-direction: column;
  padding: 0 8px 8px !important;
  background: none !important;
  &.is-border {
    border: none !important;
  }

  .l-item__title {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 8px;
    border: 1px solid #dcdfe6;
    border-bottom: none !important;
    background-color: #fff;
    border-radius: 3px 3px 0 0;
    .l-item__title-text {
      font-size: 16px;
      font-weight: bold;
      word-break: keep-all;
      color: #2f4050;
    }
  }

  .l-item__extra {
    flex: 1 1 auto;
    display: flex;
    align-items: center;

    &.no-margin {
      * {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
      }
    }

    // 统一高度，加 !important 可能别的地方会有更高的权重覆盖
    [class*='--small'],
    [class*='--mini'] {
      [class*='__inner'] {
        height: 24px !important;
        padding: 0 12px !important;
        line-height: 24px !important;
      }
    }
    .el-input--prefix .el-input__inner {
      padding-left: 30px !important;
    }
  }

  .l-item__content {
    flex: 1 1 auto;
    padding: 8px 10px !important;
    border: 1px solid #dcdfe6;
    border-radius: 3px;
    background-color: #fff;
    &.no-padding {
      padding: 0;
    }
    &.no-radius {
      border-radius: 0 0 3px 3px;
    }
  }
}
</style>
