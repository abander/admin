<!--1、input  v-model-->
<template>
  <div>
    <base-input v-model="username" />
    <span @click="username = username + 1">000000</span>
  </div>
</template>
<script>
import BaseInput from './components/base-input.vue'
export default {
  name: 'Index',
  components: { BaseInput },
  data() {
    return {
      username: '',
    }
  },
}
</script>

<!--2、input -->
<!--<template>
  <div>
    <base-input :value="username" @input="handleinput"></base-input>
  </div>
</template>
<script>
import BaseInput from "../components/input/baseInput";
export default {
  name: "home",
  components:{BaseInput},
  data(){
    return {
      username:''
    }
  },
  methods:{
    handleinput(e){
      this.username=e
    }
  }
}
</script>-->

<!--3、input -->
<!--
<template>
  <div style="display: flex;flex-direction: column">
    &lt;!&ndash;  <input v-model="a" type="text"> {{a}}
      <input :value="value" @input="input" type="text">{{value}}&ndash;&gt;
    &lt;!&ndash;  <zhinput v-model="a"></zhinput>&ndash;&gt;
    &lt;!&ndash;  <zhinput :value="a" @input="e=>a = e" :b.sync="value"></zhinput>&ndash;&gt;
    <zhinput :value="a" @input="e=>a = e" :b="value" @changeB="e=> value = e"></zhinput>
  </div>
</template>
<script>
import zhinput from './components/zh-input'
export default {
  name: 'v-helloWorld',
  components: {
    zhinput
  },
  data () {
    return {
      a: '',
      value: '00000',
      msg: 'Welcome to Your Vue.js App'
    }
  },
  watch:{
    a(v) {
      console.log(v)
    },
    value(v) {
      console.log(v)
    },
  },
  methods: {
    input(v) {
      this.value = v.target.value
    }
  }
}
</script>
<style>

</style>-->
