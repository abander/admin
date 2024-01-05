/**
 * useEventListener mounted自动注册事件监听，unmounted自动销毁事件监听
 * useScroll  监听滚动事件
 */
import { useScroll, useEventListener, useElementSize } from '@vueuse/core'
import {nextTick, onBeforeMount, onBeforeUnmount, ref, watchEffect} from 'vue'

/**
 *
 * @param options：
 *                  step: 每次移动高度
 *                 speed: 移动时间间隔
 */
export default function useTableScroll(options = {}) {
  let timer = null
  let timer2 = null
  const tableRef = ref(null)
  const stop = ref(true)
  const { step = 48, speed = 1000 } = options
  const calcStep = (current) => {
    const updateTime = speed / 150
    const miniStep = step / updateTime
    const target = current.value + step
    const toView = () => {
      current.value = miniStep + current.value
    }
    timer2 = setInterval(() => {
      console.log('timer2')
      if (current.value >= target) {
        clearInterval(timer2)
        return
      }
      toView()
    }, updateTime)
  }

  const replaceMTop = (el, reset) => {
    if (!el) return
    const getRegex = /margin-top:\s*(-?\d+px);/
    const replaceRegex = /margin-top:\s*(-?\d+px);/
    let currentTop = el.style.cssText.match(getRegex) ? parseInt(el.style.cssText.match(getRegex)[1]) : 0
    const replacement = `margin-top: ${reset ? 0 : currentTop - step}px;`
    el.style.cssText = el.style.cssText.replace(replaceRegex, replacement)
  }
  const scroll = () => {
    // 在执行新的计时器前将之前的计时器清除
    if (timer) clearInterval(timer)
    // 获取表格滚动区域的dom

    const scrollDom = tableRef.value?.$el.querySelector('.vxe-table--body-wrapper .vxe-body--y-space')
    const realDom = tableRef.value?.$el.querySelector('.vxe-table--body-wrapper .vxe-table--body')
    const wapper = tableRef.value?.$el.querySelector('.vxe-table--body-wrapper')
    const { x, y } = useScroll(wapper)
    const { height: totalHeight } = useElementSize(scrollDom)
    // 增加监听事件鼠标移入停止滚动
    useEventListener(wapper, 'mouseover', () => (stop.value = false))
    // 鼠标移出恢复滚动

    useEventListener(wapper, 'mouseout', () => (stop.value = true))

    // // 设置每秒滚动一行
    timer = setInterval(() => {
      console.log('timer')
      if (stop.value) {
        // 设置每次滚动的像素
        //y.value += step
        calcStep(y)
        // 当滚动到底部时修改scrollTop回到顶部
        if (totalHeight.value < scrollDom.marginTop) {
        }
      }
    }, speed)
  }

  onBeforeUnmount(() => {
    if (timer) window.clearInterval(timer)
    if (timer2) window.clearInterval(timer2)
  })
  return {
    stop,
    tableRef,
    scroll: () => nextTick(scroll)
  }
}
