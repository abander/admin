<template></template>
<script>
export default {
  name: 'Mixins',
  data() {
    return {
      mixinData: 'mixin中的变量'
    }
  },
  methods: {
    mixinFunction() {
      return '我是mixins里面的公共方法'
    }
  }
}
</script>

<style scoped></style>
