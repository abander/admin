<template>
  <el-button v-bind="$attrs" :loading="loadingStatus" @click="handleClick">
    <slot />
  </el-button>
</template>

<script>
export default {
  name: 'Index',
  props: {
    autoLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      loadingStatus: false,
    }
  },
  methods: {
    handleClick() {
      if (this.autoLoading) {
        this.loadingStatus = true
      }
      this.$emit('click', () => {
        this.loadingStatus = false
      })
    },
  },
}
</script>

<style scoped></style>
