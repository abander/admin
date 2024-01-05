<!--  当封装的组件是在body里面时，需要动态设置样式时，可以参考css val()函数的方式 -->
<!--当组件的下拉或者弹出框是在body中时且又是动态的样式（例如el-tooltip），可以通过 不在body中的元素(el-button) 里面 创建style并添加css var函数样式，
然后通过popper-class给在body中的元素、不在body中的元素同一class，并为不在body中的元素添加css样式，css样式的值是css var函数
-->
<template>
  <el-tooltip class="q-tooltip" ref="qTooltipRef" :popper-class="'q-tooltip' + ' ' + keyId" v-bind="{ ...$attrs }">
    <template v-for="(index, name) in $slots" v-slot:[name]>
      <slot :name="name"> 有偶 </slot>
    </template>
  </el-tooltip>
</template>

<script setup>
import utilsCreateStyle from '@/utils/create-style.js'
import utilsCssVar from '@/utils/css-var.js'
import { getUniqueId } from '@/utils/xeutils'
import { computed, onMounted, ref } from 'vue'

const props = defineProps({
  custom: {
    type: Object,
    default: null
  }
})

const random = ref(getUniqueId('q-tooltip-'))
// 唯一id
const keyId = random.value

const qTooltipRef = ref(null)

const customStyle = computed(() => {
  return { ...props.custom }
})

onMounted(() => {
  fn()
})

const { createStyle } = utilsCreateStyle()
const { getCssVar } = utilsCssVar()

const fn = () => {
  const styleStr = `.${keyId.value} {
         ${getCssVar(customStyle)}
        }`
  createStyle(`q-tooltip-style-${Math.random()}`, styleStr, qTooltipRef.value)
}

</script>
<style lang="scss">
.q-tooltip {
  &.el-tooltip__popper {
    border-width: var(--b-width);
    box-shadow: var(--b-s);
  }
}
</style>
<!--vue2写法-->
<!--  当封装的组件是在body里面时，需要动态设置样式时，可以参考css val()函数的方式 -->
<!--<template>
  <el-tooltip
    class="q-tooltip"
    content="Top center"
    placement="top"
    :popper-class="'q-tooltip'+' '+keyId"
  >
    <el-button @click="fn">Dark</el-button>
  </el-tooltip>
</template>

<script>

import styleMixin from '../../packages/mixins/styleMixin'
import { getUniqueId } from '../../packages/util/xeutils'
export default {
  mixins: [styleMixin],
  data: () => {
    const random = getUniqueId('q-tooltip-')
    return {
      keyId: random
    }
  },
  computed: {
    customStyle () {
      return {
        '&#45;&#45;b-width': '5px',
        '&#45;&#45;b-s': '0px 3px 8px 0px #96de84'
      }
    }
  },
  mounted () {
    this.fn()
  },
  methods: {
    fn () {
      const styleStr = `.${this.keyId} {
         ${this.getStyle(this.customStyle)}
        }`
      this.createStyle(`q-tooltip-style-${Math.random()}`, styleStr)
    }
  }
}
</script>
<style lang="scss">
.q-tooltip{
  &.el-tooltip__popper{
    border-width: var(&#45;&#45;b-width);
    box-shadow: var(&#45;&#45;b-s);
  }
}
</style>-->
