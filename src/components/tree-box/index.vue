<template>
  <div class="tree-box">
    <div class="tree-filter">
      <el-input
        v-if="filterInput"
        v-bind="$attrs"
        v-model.trim="filterText"
        size="mini"
        placeholder="请输入目录名称"
        clearable
        v-on="$listeners"
        @keyup.native="trimMiddle"
      />
      <slot name="topSlot"></slot>
    </div>
    <div class="tree-parcel">
      <el-tree
        v-if="treeData.length"
        v-bind="$attrs"
        ref="tree"
        class="plate-tree-specific"
        :data="treeData"
        :expand-on-click-node="false"
        :current-node-key="currentNodeKey"
        :filter-node-method="filterNode"
        highlight-current
        :draggable="true"
        v-on="$listeners"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span class="tree-label">
            <img class="tree-img" :src="treeLabelParams.src" />
            <el-tooltip
              placement="bottom"
              :content="node.label"
              :disabled="node.label.length < treeLabelParams.tooltipDisable"
            >
              <span class="target-tree-data-box-span">{{ node.label }}</span>
            </el-tooltip>
          </span>
          <!--       dropdown     -->
          <span>
            <el-dropdown trigger="hover">
              <span class="el-dropdown-link">
                <el-button type="text" size="mini" icon="el-icon-more" />
              </span>
              <el-dropdown-menu v-if="data.plateType === '0'" slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in liDataThree"
                  :key="index"
                  :divided="item.divided"
                  :class="{ 'danger-color': item.value === 'delete' }"
                  @click.native="getTreeOperateItem(item, data)"
                >
                  <i :class="item.icon" />
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu v-else slot="dropdown">
                <el-dropdown-item
                  v-for="(item, index) in liDataSix"
                  :key="index"
                  :divided="item.divided"
                  :class="{ 'danger-color': item.value === 'delete' }"
                  @click.native="getTreeOperateItem(item, data)"
                >
                  <i :class="item.icon" />
                  {{ item.label }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  props: {
    // 是否显示筛选框
    filterInput: {
      type: Boolean,
      default: true
    },
    // tree数据
    treeData: {
      type: Array,
      default: () => []
    },
    // tree当前高亮的节点
    currentNodeKey: {
      type: String,
      default: ''
    },
    // img、tooltip
    treeLabelParams: {
      type: Object,
      default: () => {}
    },
    // 根据业务需求 ...显示3个还是6个下拉
    liDataSix: {
      type: Array,
      default: () => []
    },
    // 根据业务需求 ...显示3个还是6个下拉
    liDataThree: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: null
    }
  },
  watch: {
    // tree filter
    filterText(val) {
      this.$refs.tree && this.$refs.tree.filter(val)
    }
  },
  methods: {
    // 禁止输入空格方法
    trimMiddle() {
      this.$emit('mq-trim-middle')
    },
    // 树节点搜索
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // dropdown-menu click方法
    getTreeOperateItem() {}
  }
}
</script>

<style scoped></style>
