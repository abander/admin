<template>
  <div>
    <k-formula-editor ref="formulaEditor" :data="data" @error="errorAdd" />
    <button @click="add({ text: '内容1', id: 11 })">内容1</button>
    <button @click="add({ text: '内容2', id: 12 })">内容2</button>
    <button @click="add({ text: '内容3', id: 13 })">内容3</button>
    <button @click="add({ text: '内容4', id: 14 })">内容4</button>
    <button @click="add({ text: '+', id: 31, type: 'math' })">+</button>
    <button @click="add({ text: '-', id: 32, type: 'math' })">-</button>
    <button @click="add({ text: '*', id: 33, type: 'math' })">*</button>
    <button @click="add({ text: '(', id: 34, type: 'brackets-start' })">(</button>
    <button @click="add({ text: ')', id: 35, type: 'brackets-end' })">)</button>
    <button @click="btnSave">保存</button>
  </div>
</template>

<script>
import KFormulaEditor from './formula-editor.vue'

export default {
  components: {
    KFormulaEditor
  },
  data() {
    return {
      data: [
        {
          id: 1,
          text: '组合1'
        },
        {
          id: 31,
          text: '+',
          type: 'math'
        },
        {
          id: 2,
          text: '组合2'
        },
        {
          id: 32,
          text: '-',
          type: 'math'
        },
        {
          id: 3,
          text: '组合3'
        },
        {
          id: 33,
          text: '*',
          type: 'math'
        },
        {
          id: 4,
          text: '组合4'
        }
      ]
    }
  },
  methods: {
    add(data) {
      this.$refs.formulaEditor.push(data)
    },
    errorAdd(e) {
      //校验 不能重复点击字符或者运算符
      console.log(e, 'eeeeeeeee')
    },
    btnSave() {
      //获取input的id和name
      console.log(this.$refs.formulaEditor.getData(), '222222')
      console.log(22222)
    }
  }
}
</script>

<style lang="scss"></style>
