<template>
  <!-- <div ref="formula" contenteditable="true" @click="click" v-html="html"></div> -->
  <div ref="formula" :key="n" class="k--formula-editor" contenteditable="true" @click="click">
    <template v-for="(item, index) in itemList2">
      <span
        v-if="item.type == 'math' || item.type == 'brackets-start' || item.type == 'brackets-end'"
        :key="item[nodeKey] + '-' + index"
        class="k--formula-editor-item"
        :class="'k--formula-editor-item-' + item.type"
        contenteditable="false"
        :node-key="item[nodeKey]"
        >{{ item[textName] }}</span
      >
      <span
        v-else-if="item.type == 'empty'"
        :key="item[nodeKey] + '+' + index"
        class="k--formula-editor-item"
        :class="'k--formula-editor-item-' + item.type"
        v-html="emptyText"
      ></span>
      <span
        v-else
        :key="item[nodeKey] + '_' + index"
        class="k--formula-editor-item"
        contenteditable="false"
        :node-key="item[nodeKey]"
        >{{ item[textName] }}<i class="k--formula-editor-item-del" @click.stop="del(item)">X</i></span
      >
    </template>
  </div>
</template>
<script>
export default {
  props: {
    // 文本名
    textName: {
      type: String,
      default: 'text'
    },
    // 数据id(唯一值)
    nodeKey: {
      type: String,
      default: 'id'
    },
    // 数据
    data: {
      type: Array,
      default: () => []
    },
    // 拦截器集合
    interceptorObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    // 拦截器名
    interceptor: {
      type: String,
      default: 'default'
    }
  },
  data() {
    // console.log('自定义拦截器集合', this.interceptorObj)
    return {
      itemList: [],
      dataKeys: {},
      emptyText: '&nbsp;',
      n: 0,
      interceptorObj2: {
        // 默认拦截器
        default(data, itemList) {
          // const itemList = this.getData()

          const oldItem = itemList[itemList.length - 1]

          let type

          // console.log('最后一个值', oldItem)
          if (oldItem) {
            type = oldItem.type
          }

          // console.log('当前', type, '插入', data.type)

          // 插入内容
          if (oldItem && !data.type && !type) {
            // console.log('请先选择运算符')
            return { msg: '请先选择运算符' }
            // 插入运算符
          } else if (data.type == 'math' && (type == 'math' || type == 'brackets-start')) {
            // console.log('请先选择规则')
            return { type: 'math', msg: '请先选择规则' }
            // 插入开始括号符号
          } else if (data.type == 'brackets-start' && type != 'math' && type != 'brackets-start') {
            // console.log('请先选择符号111', type)
            return { type: 'brackets-start', msg: '请先选择运算符号' }
            // 插入飘带括号符号
          } else if (data.type == 'brackets-end' && type && type != 'brackets-end') {
            // console.log('请先选择规则222', type)
            return { type: 'brackets-end', msg: '请先选择规则' }
          }
        },
        ...this.interceptorObj
      }
    }
  },
  computed: {
    // html() {

    //     //<span contenteditable="false">组合a</span><span contenteditable="false">组合b</span><span contenteditable="false">组合c</span><span>&nbsp;</span>
    //     // console.log('更新了', this.itemList)
    //     const data = []
    //     this.itemList.forEach(item => {
    //         // console.log('项', item)
    //         if (item.type == 'math' || item.type == 'brackets-start' || item.type == 'brackets-end') {
    //             data.push(`<span contenteditable="false" node-key="${item[this.nodeKey]}">${item[this.textName]}</span>`)
    //         } else {
    //             data.push(`<span contenteditable="false" node-key="${item[this.nodeKey]}">${item[this.textName]}<i @click="del(item)">X</i></span>`)
    //         }

    //     });

    //     return data.join('') + '<span>&nbsp;</span>'
    // },
    itemList2() {
      // console.log('数据', this.itemList)
      return [...this.itemList, { type: 'empty' }]
    }
  },
  watch: {
    emptyText() {
      console.log('文本变化', this.emptyText)
    }
  },
  mounted() {
    this.init()
  },
  unmounted() {},
  methods: {
    // 初始化
    init() {
      this.rightClickDisable()
      this.setKeys()
      this.onkeydown()
      this.DOMNodeInserted()
    },
    // 禁用右键
    rightClickDisable() {
      this.$refs.formula.onselectstart = this.$refs.formula.oncontextmenu = function () {
        return false //取消浏览器默认操作
      }
    },
    // 设置key
    setKeys() {
      this.itemList = []
      this.data.forEach((item) => {
        this.dataKeys[item[this.nodeKey]] = item
        this.itemList.push(item)
      })
    },
    // 按键事件
    onkeydown() {
      this.$refs.formula.onkeydown = (e) => {
        // console.log('按键', e)
        if (e.keyCode !== 8) {
          return false
        }
      }
    },
    // 监听内容变化
    DOMNodeInserted() {
      let updateText = () => {
        // console.log('监听变化DOMNodeInserted')
        const node = this.$refs.formula.childNodes[this.$refs.formula.childNodes.length - 1]
        if (node && node.innerHTML != '&nbsp;') {
          // console.log('更新')
          node.innerHTML = '&nbsp;'
        }
      }

      // 监听divinput内容变化
      this.$refs.formula.addEventListener('DOMNodeInserted', updateText)
      this.$refs.formula.addEventListener('input', updateText)

      // 监听最后一个(给光标)内容变化
      // const node = this.$refs.formula.childNodes[this.$refs.formula.childNodes.length - 1]
      // if (node) {
      //     console.log('最后一个监听',node)
      //     node.addEventListener('DOMNodeInserted', () => {

      //         // if (node && node.innerHTML != '&nbsp;') {
      //         //     console.log('更新222222222222')
      //         //     node.innerHTML = '&nbsp;'
      //         // }
      //         console.log('监听变化DOMNodeInserted2222222')

      //     })
      // }
    },
    // div被点击
    click() {
      this.moveEnd()
    },
    // 光标移动到最后
    moveEnd() {
      this.$nextTick(() => {
        let el = this.$refs.formula
        let length = el.childNodes.length
        if (length) {
          let range = document.createRange()
          let sel = window.getSelection()
          range.setStart(el.childNodes[length - 1].childNodes[0], 0)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      })
    },
    // 获取当前数据
    getData() {
      const itemList = []
      this.$refs.formula.childNodes.forEach((node) => {
        const key = node.getAttribute('node-key')
        // console.log('数据', key, this.dataKeys[key])
        if (key !== null) {
          itemList.push(this.dataKeys[key])
        }
      })

      return itemList
    },
    update() {
      this.n++
      this.$nextTick(() => {
        this.rightClickDisable()
        this.onkeydown()
        // this.DOMNodeInserted()
      })
    },
    // 添加数据
    push(data) {
      // console.log('')

      const itemList = this.getData()

      // 拦截器
      const interceptor = this.interceptorObj2[this.interceptor]
      // console.log('拦截器', interceptor)
      if (interceptor) {
        const err = interceptor(data, itemList)
        if (err) {
          // console.log('异常信息', err)
          this.$emit('error', err)
          return
        }
      }

      if (data) {
        this.dataKeys[data[this.nodeKey]] = data
        itemList.push(data)
      }
      this.itemList = itemList
      this.update()
      // console.log('添加数据')
      this.moveEnd()
    },
    del(item) {
      const data = this.getData()
      // console.log('删除', item, data)
      data.forEach((o, index) => {
        if (o[this.nodeKey] == item[this.nodeKey]) {
          console.log('index', index)
          if (index > 1 && data[index - 1].type == 'math') {
            data.splice(index - 1, 2)
          } else {
            data.splice(index, 2)
          }
        }
      })

      this.itemList = data
      this.update()
    }
  }
}
</script>
<style lang="scss">
// input框
.k--formula-editor {
  width: 829px;
  height: 34px;
  background: #ffffff;
  border-radius: 2px;
  border: 1px solid #e3e7ec;
  // 组合3的样式
  .k--formula-editor-item {
    // background-color: #ecf5ff;
    background: #f0f2f5;
    display: inline-block;
    height: 32px;
    padding: 0 10px;
    line-height: 30px;
    font-size: 12px;
    color: #747f89;
    border: 1px solid #e3e7ec;
    border-radius: 4px;
    box-sizing: border-box;
    white-space: nowrap;
    .k--formula-editor-item-del {
      border-radius: 50%;
      text-align: center;
      position: relative;
      cursor: pointer;
      font-size: 12px;
      height: 16px;
      width: 16px;
      line-height: 16px;
      vertical-align: middle;
      top: -1px;
      right: -5px;
    }
  }
  // 组合3 x号的样式
  .k--formula-editor-item-math {
    // height: 32px;
    color: #212121;
    background-color: #fff;
    border: none;
  }
  // 光标插入的样式
  .k--formula-editor-item-empty {
    background-color: #fff;
    border: none;
    color: #000000;
  }
  // 括号样式
  .k--formula-editor-item-brackets-start {
    background-color: #fff;
    border: none;
    color: #000000;
  }
  .k--formula-editor-item-brackets-end {
    background-color: #fff;
    border: none;
    color: #000000;
  }
}
/*.k--formula-editor:focus-visible {
  outline: -webkit-focus-ring-color auto 1px;
  outline-color: -webkit-focus-ring-color;
  outline-style: auto;
  outline-width: 1px;
}*/
</style>
