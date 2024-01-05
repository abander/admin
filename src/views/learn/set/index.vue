<!--原理：直接通过this点的形式不能修改对象，要通过this.$set的方式修改-->
<template>
  <div>
    {{ user.name }}
    {{ user.age }}
    <button @click="addUserAgeField">增加一个年纪字段</button>
  </div>
</template>

<script>
export default {
  name: 'Index',
  data() {
    return {
      user: {
        name: 'test'
      }
    }
  },
  created() {},
  methods: {
    addUserAgeField() {
      //this.user.age = 20 //这样是不起作用, 不会被Observer
      this.$set(this.user, 'age', 20) // 应该使用
    }
  }
}
</script>

<style scoped></style>
