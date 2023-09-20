<template>
  <!--    <div>
      <p style="color:red">默认插槽-子组件</p>
      <slot>不传默认展示</slot>
    </div>-->

  <!--    <div>
      <p style="color:red">默认插槽-子组件</p>
      <header>
        <slot name="header"></slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer"></slot>
      </footer>
    </div>-->

  <!--  <div>
    <div>具名插槽-子组件</div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>-->

  <div>
    <p style="color: red">作用域插槽--子组件</p>
    <slot :user="user"></slot>
  </div>
</template>

<!--<script>
export default {
  name: "slot-child",
  data(){
    return {
      user: {
        lastName: 'wwww'
      }
    }
  }
}
</script>-->
<script setup>
import { ref } from 'vue'
const user = ref({ lastName: '子组件' })
</script>
