<template>
  <div>
    <div>
      <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">全选</el-checkbox>
    </div>
    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
      <el-checkbox
        v-for="(item, index) in allItemDataChecked"
        :key="index"
        :label="item.label"
        @change="(val) => checkboxChange(val, item, index)"
        >{{ item.label }}</el-checkbox
      >
    </el-checkbox-group>
  </div>
</template>
<script>
export default {
  name: 'CheckBox',
  props: {
    allItemData: {
      type: Array,
      default: () => []
    },
    changeProps: {
      type: Function,
      default: () => false
    }
  },
  data() {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkedCities: [],
      allItemDataChecked: this.allItemData[0].allListDate,
      checkboxChangeList: []
    }
  },
  watch: {
    checkedCities(newVlaue) {
      this.checkboxChangeList = [] // 防止多次点击重复触发数据
      if (newVlaue.length === 0) {
        this.changeProps([])
      } else {
        this.allItemDataChecked.forEach((ele) => {
          newVlaue.forEach((item) => {
            if (ele.label === item) {
              this.checkboxChangeList.push(ele)
              this.checkboxChange()
            }
          })
        })
      }
    }
  },
  mounted() {
    let list = []
    if (this.allItemDataChecked.length) {
      this.allItemDataChecked.forEach((element) => {
        this.allItemData[0].selectedList.forEach((item) => {
          if (element.prop === item.prop && element.label === item.label) {
            list.push(item.label)
          }
        })
      })
      this.checkedCities = list
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.checkedCities = []
      let result = []
      this.checkedCities = val
        ? this.allItemDataChecked.forEach((element) => {
            result.push(element.label)
          })
        : []
      this.checkedCities = result
    },
    handleCheckedCitiesChange(value) {
      this.checkAll = value.length === this.allItemDataChecked.length
    },
    checkboxChange() {
      // 发现这个没用
      this.changeProps(this.checkboxChangeList)
    }
  }
}
</script>
<style></style>
