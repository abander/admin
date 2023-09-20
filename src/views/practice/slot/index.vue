<template>
  <!--
1、默认插槽：
 子组件中的slot就是默认插槽； 在父组件引用子组件，然后在子组件标签中间写上希望传到子组件的东西。当组件渲染的时候，<slot></slot> 将会被替换为：默认插槽 占位
 -->
  <!--  <Solt-child>默认插槽 占位</Solt-child>-->

  <!--
2、具名插槽：有名字的插槽。有时我们需要多个插槽，就会用到具名插槽
（1）一个不带 name 的 <slot> 插槽会带有隐含的名字“default”。
（2）v-slot 只能添加在 <template> 上
（3）<template> 元素中的所有内容都将会被传入相应的插槽。任何没有被包裹在带有 v-slot 的 <template> 中的内容都会被视为默认插槽的内容。
-->
  <!-- <div>
      <Solt-child>
        <template v-slot:header>
          <div>我是 header</div>
        </template>
&lt;!&ndash;        <div>我没有名字</div>&ndash;&gt;
        <template v-slot:default>
          <div>我没有名字</div>
        </template>
&lt;!&ndash;        <template v-slot:footer>
          <div>我是 footer</div>
        </template>&ndash;&gt;
&lt;!&ndash;  简写形式：      &ndash;&gt;
        <template #footer>
          <div>我是 footer</div>
        </template>
      </Solt-child>
</div>-->

  <!--  <div>
    <div>具名插槽-父组件</div>
    <sold-child>
      <template v-slot:header>header</template>
      <p>A paragraph for the main content.</p>
      <p>And another one.</p>
      <template v-slot:footer>footer</template>
    </sold-child>
  </div>-->

  <!--
 3、作用域插槽：想在父组件访问子组件中才有的数据，这时就要用到作用域插槽
 （1）子组件中：为了让 user 在父级的插槽内容中可用，我们可以将 user 作为 <slot> 元素的一个 attribute 绑定上去：:user="user"
 （2）父组件中：绑定在 <slot> 元素上的 attribute 被称为插槽 prop。现在在父级作用域中，我们可以使用带值的 v-slot 来定义我们提供的插槽 prop 的名字，slotProps名字任意换
  -->
  <div>
    <!--
    当需要接收插槽 props 时，默认插槽和具名插槽的使用方式有一些小区别
    默认插槽如何接受 props，通过子组件标签上的 v-slot 指令，直接接收到了一个插槽 props 对象
-->
    <Solt-child>
      <template #default="slotProps">
        {{ slotProps.user.lastName }}
      </template>
    </Solt-child>
  </div>
</template>

<script setup>
import SoltChild from './components/slot-child.vue'
/*export default {
  name: "index",
  // components:{SoldChild}
}*/
</script>

<style scoped></style>
