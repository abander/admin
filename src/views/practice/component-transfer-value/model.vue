<template>
  <div class="parent">
    parent组件--{{ toAbout }} <br /><input v-model="toAbout" type="text" />
    <hr />
    <!--value 和 input 为默认写法，如果要修改为其他需要在子组件中使用model进行配置-->
    <!-- <About :value="toAbout" @input="val => toAbout = val"></About> -->
    <!--这个为上面代码的简写即语法糖-->
    <modelComponents v-model="toAbout"></modelComponents>

    <button @click="btn">按钮</button>
  </div>
</template>

<script>
import modelComponents from './components/modelComponents.vue'
export default {
  name: 'Model',
  components: { modelComponents },
  data() {
    return {
      toAbout: 'default'
    }
  },
  methods: {
    btn() {
      this.$router.push({
        //path: window.location.hash,
        query: {
          title: 'add'
        }
      })
      console.log(this.$router, ' this.$router22222222222')
    }
  }
}
</script>

<style scoped></style>
