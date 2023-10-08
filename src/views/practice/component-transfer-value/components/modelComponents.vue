<template>
  <div class="home">
    children组件{{ value + '' }}
    <hr />
    <input v-model="childAbout" type="text" />
  </div>
</template>

<script>
export default {
  name: 'ModelComponents',
  // 使用value进行接收
  props: ['value'],
  computed: {
    childAbout: {
      get() {
        return this.value
      },
      set(val) {
        // 调用父组件的input方法，将变量放在第二个参数，即可改变父组件的变量
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style scoped></style>
