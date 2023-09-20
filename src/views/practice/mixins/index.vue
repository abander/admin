<template>
  <div>
    <div @click="handleMixin">调用mixin方法:vue文件</div>
    <div @click="handleMixinJs">调用mixin方法:js文件</div>
  </div>
</template>
<script>
import Mixin from './components/mixin.vue'
import mixinJs from './components/mixinJs.js'
export default {
  name: 'Index',
  //mixins: [Mixin],
  mixins: [mixinJs],
  methods: {
    //混入vue文件
    handleMixin() {
      console.log(
        '直接可以获取到mixin.vue中data数据 mixin-data====>>>',
        this.mixinData,
      )
      let mixfun = this.mixinFunction()
      console.log(
        '直接可以获取到mixin.vue中methods方法 mixin-functions====>>>',
        mixfun,
      )
    },
    //混入js文件
    handleMixinJs() {
      console.log('直接可以获取到mixinJs中data数据 mixin-data====>>>', this.x)
      let showModel = this.showModel()
      console.log(
        '直接可以获取到mixinJs中methods方法 mixin-functions====>>>',
        showModel,
      )
    },
  },
}
</script>

<style scoped></style>
