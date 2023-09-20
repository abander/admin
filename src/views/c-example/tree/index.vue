<template>
  <div>
    <Tree-box
      :filter-input="true"
      :tree-data="treeDatas"
      node-key="id"
      :props="defaultProps"
      :current-node-key="currentNode"
      :tree-label-params="treeLabelParams"
      :li-data-six="liDataSixDirectory"
      :li-data-three="liDataThreePlate"
      @node-click="nodeClick"
      @node-drop="nodeDrag"
    >
      <template #topSlot>
        <div>1111111</div>
      </template>
    </Tree-box>
  </div>
</template>

<script>
import TreeBox from '../../../components/tree-box/index.vue'
export default {
  name: 'Index',
  // components: {TreeBox},
  data() {
    return {
      treeDatas: [
        {
          id: '1',
          label: '一级 1',
          plateType: '1',
          children: [
            {
              id: '12',
              label: '二级 1-1',
              plateType: '0',
              children: [
                {
                  id: '123',
                  label: '三级 1-1-1',
                  plateType: '0',
                },
              ],
            },
          ],
        },
        {
          id: '2',
          label: '一级 2',
          plateType: '1',
          children: [
            {
              id: '22',
              label: '二级 2-1',
              plateType: '0',
              children: [
                {
                  id: '234',
                  label: '三级 2-1-1',
                  plateType: '0',
                },
              ],
            },
            {
              id: '23',
              label: '二级 2-2',
              plateType: '0',
              children: [
                {
                  id: '2345',
                  label: '三级 2-2-1',
                  plateType: '0',
                },
              ],
            },
          ],
        },
        {
          id: '3',
          label: '一级 3',
          plateType: '1',
          children: [
            {
              id: '34',
              label: '二级 3-1',
              plateType: '0',
              children: [
                {
                  id: '345',
                  label: '三级 3-1-1',
                  plateType: '0',
                },
              ],
            },
            {
              id: '45',
              label: '二级 3-2',
              plateType: '0',
              children: [
                {
                  id: '456',
                  label: '三级 3-2-1',
                  plateType: '0',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      currentNode: null,
      treeLabelParams: {
        src: '../../../assets/images/img2.png',
        tooltipDisable: 10,
      },
      liDataThreePlate: [
        {
          value: 'export',
          label: '导出板块',
          divided: false,
          icon: 'el-icon-download',
        },
        {
          value: 'rename',
          label: '重命名',
          divided: true,
          icon: 'el-icon-edit-outline',
        },
        {
          value: 'delete',
          label: '删除',
          divided: true,
          icon: 'el-icon-delete',
        },
      ],
      liDataSixDirectory: [
        {
          value: 'add',
          label: '添加板块',
          divided: false,
          icon: 'el-icon-plus',
        },
        {
          value: 'import',
          label: '导入板块',
          divided: true,
          icon: 'el-icon-download',
        },
        {
          value: 'addSibling',
          label: '添加同级目录',
          divided: true,
          icon: 'el-icon-plus',
        },
        {
          value: 'addChidren',
          label: '添加子级目录',
          divided: true,
          icon: 'el-icon-plus',
        },
        {
          value: 'rename',
          label: '重命名',
          divided: true,
          icon: 'el-icon-edit-outline',
        },
        {
          value: 'delete',
          label: '删除',
          divided: true,
          icon: 'el-icon-delete',
        },
      ],
    }
  },
  methods: {
    nodeClick(data, node) {
      console.log(data, node, '2222222')
    },
    nodeDrag(node, dropNode, position, event) {
      console.log(node, dropNode, position, event)
    },
  },
}
</script>

<style scoped></style>
