<template>
  <div>
    <!--      <input type="text" :value="value" @input="">-->
    <input type="text" @input="handelInput" />
    <span>{{ b }}</span>
  </div>
</template>

<script>
export default {
  name: 'ZhInput',
  props: {
    value: String,
    b: String
  },
  methods: {
    handelInput(e) {
      this.$emit('changeB', 'iiiii')
    }
  }
}
</script>

<style scoped></style>
