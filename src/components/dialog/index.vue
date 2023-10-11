<template>
  <!--@close:所有关闭都可执行  @:before-close:只有点击x号的时候才执行  -->
  <el-dialog v-model="dialogVisible" :title="title" width="50%" @close="handleClose">
    <slot></slot>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="(dialogVisible = false) || emits('beforeClose')">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'

// 接受props
const props = defineProps({
  title: String,
  isShow: {
    type: Boolean,
    default: false
  }
})

// 定义emit
const emits = defineEmits(['update:isShow', 'beforeClose', 'confirm'])

// dialog visible
const dialogVisible = computed({
  get() {
    return props.isShow
  },
  set(v) {
    // 使用emits
    emits('update:isShow', v)
  }
})

// 关闭方法
const handleClose = (done) => {
  // 使用emits
  emits('beforeClose')
  /*  $MessageBox.confirm('Are you sure to close this dialog?')
      .then(() => {
        done()
      })
      .catch(() => {
        // catch error
      })*/
}

const handleConfirm = () => {
  const done = () => (dialogVisible.value = false)
  emits('confirm', done)
}
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
<!--
props
1.defineProps()
// using Array syntax 数组语法
const props = defineProps(['foo', 'bar'])
// using Object syntax 对象语法
const props = defineProps({
  foo: String,
  bar: {
    type: Number,
    required: true,
    default: 111
  }
})

在script中使用 ，props.xxx
在template使用，直接 xxx

2.emits 自定义事件 defineEmits(string[])
子：
定义：const emits = defineEmits(['refresh'])
使用：emits('refresh','传值')
父：
<base-dialog-original :title="params.title" @refreh="reset"> </base-dialog-original>


3.v-modal
（1）第一种 简单
父
<comp v-model=show / >
相当于
<comp :modelValue="show"  @update:modelValue="(v)=> show = v" / >

（2）第二种与第一种的区别是，第一种的props的名字是默认的，第二种可以自定义为show
父
<comp v-model:show=show / >
相当于
<comp :show="show"  @update:show="(v)=> show = v" / >

以上两种 相当于在子组件接收了一个props和一个自定义事件
子
const props = defineProps({
  show: String,
})

const emits = defineEmits(['update:show'])

4.ref
暴露属性方法，通常是组件通过ref获取子组件暴露的属性或方法
子
defineExpose({text,fn})
父
ref.value.fn
ref.value.text

-->
