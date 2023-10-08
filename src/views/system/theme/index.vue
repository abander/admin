<template>
  <h3 id="test">11111</h3>
</template>

<script>
import obj from './test.json'
export default {
  name: 'Index',
  data() {
    return {}
  },
  mounted() {
    /* let obj = {
      h3:{
        color:'#ff0 !important',
        height:'200px'
      },
      '.aa':{color:'#0ff'}
    }*/
    // console.log(obj, 'obj')
    let css = ''
    // Object.keys 中 key是属性名 obj[key]是属性值
    Object.keys(obj).forEach((key) => {
      console.log(key, obj[key]), '2222222'
      // css = css + key {
      // '' = '' + h3 {
      // h3 {
      css += key + '{\n'
      let item = obj[key]
      console.log(item, 'item')
      Object.keys(item).forEach((k) => {
        css += k + ':' + item[k] + ';\n'
      })
      css += '}\n'
    })
    // console.log(css, 'css')
    this.addStyleNode(css)
    // document.getElementById('test').innerHTML=css
  },
  methods: {
    addStyleNode(str) {
      var styleNode = document.createElement('style')
      styleNode.type = 'text/css'
      if (styleNode.styleSheet) {
        styleNode.styleSheet.cssText = str //ie下要通过 styleSheet.cssText写入.
      } else {
        styleNode.innerHTML = str //在ff中， innerHTML是可读写的，但在ie中，它是只读的.
      }
      document.getElementsByTagName('head')[0].appendChild(styleNode)
    }
  }
}
</script>
