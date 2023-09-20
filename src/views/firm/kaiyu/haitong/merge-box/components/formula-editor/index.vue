<template>
  <!-- <div ref="formula" contenteditable="true" @click="click" v-html="html"></div> -->
  <div class="k--formula-editor">
    <div
      ref="formula"
      :key="n"
      contenteditable="true"
      class="k--formula-editor-input"
      @click="click"
    >
      <template v-for="(item, index) in itemList2">
        <span
          v-if="
            item.type === 'math' ||
            item.type === 'brackets-start' ||
            item.type === 'brackets-end'
          "
          :key="item[nodeKey] + '-' + index"
          class="k--formula-editor-item"
          :class="'k--formula-editor-item-' + item.type"
          contenteditable="false"
          :node-key="item[nodeKey]"
          >{{ item[textName] }}</span
        >
        <span
          v-else-if="item.type === 'empty'"
          :key="item[nodeKey] + '+' + index"
          class="k--formula-editor-item"
          :class="'k--formula-editor-item-' + item.type"
          v-html="emptyText"
        />
        <span
          v-else
          :key="item[nodeKey] + '_' + index"
          class="k--formula-editor-item"
          contenteditable="false"
          :node-key="item[nodeKey]"
          >{{ item[textName]
          }}<i
            class="k--formula-editor-item-del"
            @click.stop="del(item, index)"
        /></span>
      </template>
    </div>
    <div v-if="itemList2.length === 1" class="k--formula-editor-placeholder">
      {{ placeholder }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'Index',
  props: {
    // placeholder 显示
    placeholder: {
      type: String,
      default: '请选择板块',
    },
    // 文本名
    textName: {
      type: String,
      default: 'text',
    },
    // 数据id(唯一值)
    nodeKey: {
      type: String,
      default: 'id',
    },
    // 数据
    data: {
      type: Array,
      default: () => [],
    },
    // 拦截器集合
    interceptorObj: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 拦截器名
    interceptor: {
      type: String,
      default: 'default',
    },
    // 校验集合
    validatorObj: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // 校验名
    validator: {
      type: String,
      default: 'default',
    },
  },
  data() {
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
          console.log('code', data, itemList, oldItem)

          // tree去重
          /* if (!data.type) {
            const o = itemList.find(item => {
              return item.vcPlateTreeTypeId === data.vcPlateTreeTypeId
            })
            if (o) {
              return { msg: '板块不能重复添加' }
            }
          } */
          /* var data = ['(',1,'(','(',22,'(',')',')',')',')','(','(','(','(',')',')',')']
          var obj = {left:0,right:0}
          data.forEach(item=>{
            if(item==='('){
              obj.left++
            }else if(item===')'){
              obj.right++
            }
          }) */
          // 左括号小于右括号 点击右括号校验左括号是否存在
          const obj = this.getAroundBracket(itemList)
          if (data.type === 'brackets-end' && obj.right >= obj.left) {
            return { msg: '缺少括号' }
          }
          // 板块表达式的开头禁止输入“+”“-”“*”，点击时直接提示“请先选择规则”
          if (data.type === 'math' && !itemList.length) {
            return { msg: '请先选择规则' }
          }

          if (oldItem) {
            type = oldItem.type
          }

          // console.log('当前', type, '插入', data.type)

          // 插入内容
          if (oldItem && !data.type && !type) {
            return { msg: '请先选择运算符' }
            // 插入运算符
          } else if (
            data.type === 'math' &&
            (type === 'math' || type === 'brackets-start')
          ) {
            // console.log('请先选择规则')
            return { type: 'math', msg: '请先选择规则' }
            // 插入开始括号符号
          } else if (
            data.type === 'brackets-start' &&
            type !== 'math' &&
            type !== 'brackets-start' &&
            itemList.length > 0
          ) {
            // console.log('请先选择符号111888888888888', type, itemList)
            return { type: 'brackets-start', msg: '请先选择运算符号' }
            // 插入飘带括号符号
          } else if (
            data.type === 'brackets-end' &&
            type &&
            type !== 'brackets-end'
          ) {
            // console.log('请先选择规则222', type)
            return { type: 'brackets-end', msg: '请先选择规则' }
          }
        },
        ...this.interceptorObj,
      },
      validatorObj2: {
        default(data) {
          // const data = this.getData()
          let str = ''
          data.forEach((item) => {
            if (item.type === 'math') {
              str += item[this.textName]
            } else if (item.type === 'brackets-start') {
              str += '('
            } else if (item.type === 'brackets-end') {
              str += ')'
            } else {
              str += ' 1 '
            }
          })
          // 左括号小于右括号 点击右括号校验左括号是否存在
          const obj = this.getAroundBracket(data)
          if (obj.left !== obj.right) {
            const err = {
              msg: '缺少右括号',
              type: 'brackets-end',
              error: new Error('缺少右括号'),
            }
            return Promise.reject(err)
          }

          return Promise.resolve()
            .then(() => {
              // eslint-disable-next-line no-unused-vars
              let window, self, document, Cookie, CookieStore
              // eslint-disable-next-line no-eval
              eval(str)

              return data
            })
            .catch((error) => {
              const err = { msg: '校验不通过', type: 'eval', error }
              return Promise.reject(err)
            })
        },
        ...this.validatorObj,
      },
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
      return [...this.itemList, { type: 'empty' }]
    },
  },
  watch: {
    data() {
      this.setKeys()
    },
    emptyText() {
      console.log('文本变化', this.emptyText)
    },
  },
  created() {
    this.interceptorObj2.default = this.interceptorObj2.default.bind(this)
    this.validatorObj2.default = this.validatorObj2.default.bind(this)
  },
  mounted() {
    this.init()
  },
  unmounted() {},
  methods: {
    // 获取左右括号
    getAroundBracket(itemList) {
      // 左括号小于右括号 点击右括号校验左括号是否存在
      const obj = { left: 0, right: 0 }
      itemList.forEach((item) => {
        console.log(item, 'item')
        if (item.type === 'brackets-start') {
          obj.left++
        } else if (item.type === 'brackets-end') {
          obj.right++
        }
      })
      return obj
    },
    // 初始化
    init() {
      this.rightClickDisable()
      this.setKeys()
      this.onkeydown()
      this.DOMNodeInserted()
    },
    // 禁用右键
    rightClickDisable() {
      this.$refs.formula.onselectstart = this.$refs.formula.oncontextmenu =
        function () {
          return false // 取消浏览器默认操作
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
      this.$refs.formula.onkeyup = () => {
        clearTimeout(this.oldItemTimeout)
        this.oldItemTimeout = setTimeout(() => {
          this.emptyImport()
          this.moveEnd()
        }, 100)
      }
      this.$refs.formula.onkeydown = (e) => {
        if (e.keyCode !== 8) {
          return false
        }
        setTimeout(() => {
          this.itemList = this.getData()
          this.update()
          this.moveEnd()
        })
      }
    },
    // 监听内容变化
    DOMNodeInserted() {
      const updateText = () => {
        this.emptyImport()
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
    // 不能输入中文、数字、英文
    emptyImport() {
      const node =
        this.$refs.formula.childNodes[this.$refs.formula.childNodes.length - 1]
      if (
        node &&
        !node.getAttribute('node-key') &&
        node.innerHTML !== '&nbsp;'
      ) {
        node.innerHTML = '&nbsp;'
      }
    },
    // div被点击
    click() {
      this.moveEnd()
    },
    // 光标移动到最后
    moveEnd() {
      this.$nextTick(() => {
        const el = this.$refs.formula
        const length = el.childNodes.length
        if (length) {
          const range = document.createRange()
          const sel = window.getSelection()
          range.setStart(el.childNodes[length - 1].childNodes[0], 0)
          range.collapse(true)
          sel.removeAllRanges()
          sel.addRange(range)
        }
      })
    },
    // 校验获取数据
    getValidatorData() {
      return this.validatorObj2[this.validator](this.getData())
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
      const itemList = this.getData()
      // 拦截器
      const interceptor = this.interceptorObj2[this.interceptor]
      if (interceptor) {
        const err = interceptor(data, itemList)
        if (err) {
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
      this.moveEnd()
    },
    del(item, index) {
      const data = this.getData()
      // console.log('删除', item, data)
      // data.forEach((o, index) => {
      //   if (o[this.nodeKey] === item[this.nodeKey]) {
      //     console.log('index', index)
      //     if (index > 1 && data[index - 1].type === 'math') {
      //       // data.splice(index - 1, 2) //去掉左边的符号
      //       data.splice(index, 2) // 去掉右边的符号
      //     } else {
      //       data.splice(index, 2)
      //     }
      //   }
      // })

      if (index > 1 && data[index - 1].type === 'math') {
        // data.splice(index - 1, 2) //去掉左边的符号
        data.splice(index, 2) // 去掉右边的符号
      } else {
        data.splice(index, 2)
      }

      this.itemList = data
      this.update()
    },
  },
}
</script>
<style lang="scss">
// input框
// 6.22日 修改组件 去掉去重 height为68px 超出加滚动条
.k--formula-editor {
  position: relative;
  .k--formula-editor-input {
    // width: 829px;
    // height: 34px;
    width: 100%;
    max-height: 68px;
    background: #ffffff;
    border-radius: 2px;
    border: 1px solid #e3e7ec;
    overflow-y: auto;
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
        text-align: center;
        position: relative;
        cursor: pointer;
        font-size: 12px;
        height: 16px;
        width: 16px;
        line-height: 16px;
        vertical-align: middle;
        top: 1px;
        right: -9px;
        display: inline-block;
        background: url(../../../../assets/images/close.svg) no-repeat;
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
  .k--formula-editor-placeholder {
    position: absolute;
    top: 6px;
    left: 15px;
    color: #c0c4cc;
  }
}
</style>
