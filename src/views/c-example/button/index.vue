<template>
  <div>
    <Button-box :auto-loading="true" @click="submit"> 自动loading按钮</Button-box>
    <Button-box type="primary" round>圆角按钮</Button-box>
  </div>
</template>

<script>
import ButtonBox from '../../../components/button-box/index.vue'
export default {
  name: 'Index',
  // components:{ButtonBox},
  methods: {
    submit(done) {
      // 这里供业务组件处理一些事情,比如ajax请求,此处用setTimeout模拟,    执行done()方法消失loading
      setTimeout(() => {
        done()
      }, 1000)
    }
  }
}
</script>

<style scoped></style>
