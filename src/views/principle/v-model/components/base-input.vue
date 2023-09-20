<template>
  <div>
    <input :value="value" @input="handleInput" />
  </div>
</template>
<script>
export default {
  name: 'BaseInput',
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  methods: {
    handleInput(e) {
      this.$emit('input', e.target.value)
    },
  },
}
</script>
