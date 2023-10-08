<template>
  <div>
    <ul class="content">
      <li v-for="(list, index) in getLists" :key="index" v-html="list.name + list.content"></li>
    </ul>
    <span>{{ propNum }}</span>
    <button @click="btnFn">子向父</button>
  </div>
</template>
<script>
export default {
  name: 'PropsContent',
  props: {
    propNum: {
      // 接受父子组件传递的属性
      type: Number,
      default: 0
    },
    lists: Array
  },
  data() {
    return {
      getLists: this.lists
    }
  },
  mounted() {
    this.getLists.push({
      name: '03',
      content: '不要在乎内容，我就是测试'
    })
  },
  methods: {
    btnFn() {
      this.$emit('listClick', '子向父传值通过$emit')
    }
  }
}
</script>
