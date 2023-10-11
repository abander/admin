<template>
  <div class="content">
    <propsComponent :lists="lists" :prop-num="num" @listClick="listFn"></propsComponent>
  </div>
</template>
<script>
import propsComponent from './components/propsComponents.vue'
export default {
  name: 'Props',
  components: { propsComponent },
  data() {
    return {
      lists: [],
      num: 0
    }
  },
  mounted() {
    this.lists = [
      {
        name: '01',
        content: 'hi,'
      },
      {
        name: '02',
        content: 'my name is Ellyliang'
      }
    ]
  },
  methods: {
    listFn(val) {
      console.log(val) // '子向父传值通过$emit'
    }
  }
}
</script>
