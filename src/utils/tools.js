/**
 * @param {Object} obj1 对象
 * @param {Object} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
export const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */ else return !keysArr1.some((key) => obj1[key] != obj2[key])
}

/**
 * @param {Object} obj
 * @param {*} key
 * @description 判断一个对象是否存在key，如果传入第二个参数key，则是判断这个obj对象是否存在key这个属性
 * 如果没有传入key这个参数，则判断obj对象是否有键值对
 */
export const objHasKey = (obj, key) => {
  if (key) return key in obj
  else {
    let keysArr = Object.keys(obj)
    return keysArr.length
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的交集, 两个数组的元素为数值或字符串
 */
export const getIntersectionArr = (arr1, arr2) => {
  console.log('arr')
  let len = Math.min(arr1.length, arr2.length)
  let i = -1
  let res = []
  while (++i < len) {
    const item = arr2[i]
    if (arr1.indexOf(item) > -1) res.push(item)
  }
  return res
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnionArr = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}

/**
 * @description 获取窗口可视范围的高度
 * @returns {number}
 */
export function getClientHeight() {
  let clientHeight = 0
  if (document.body.clientHeight && document.documentElement.clientHeight) {
    clientHeight =
      document.body.clientHeight < document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  } else {
    clientHeight =
      document.body.clientHeight > document.documentElement.clientHeight
        ? document.body.clientHeight
        : document.documentElement.clientHeight
  }
  return clientHeight
}

/**
 * @description 获取窗口可视范围的高度
 * @returns {number}
 */
export function getPageViewWidth() {
  let d = document,
    a = d.compatMode == 'BackCompat' ? d.body : d.documentElement
  return a.clientWidth
}

/**
 * @description 获取滚动条距顶部高度
 * @returns {number}
 */
export function getPageScrollTop() {
  let a = document
  return a.documentElement.scrollTop || a.body.scrollTop
}

/**
 * @description 开启全屏显示
 * @param {*} element 需要开启全屏的dom节点
 */
export function launchFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if (element.mozRequestFullScreen) {
    element.mozRequestFullScreen()
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen()
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullScreen()
  }
}

/**
 *
 * @description 关闭全屏
 */
export function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen()
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen()
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen()
  }
}

/**
 * @description 滚动条滚动到目标元素的位置
 * @param element
 */
export const smoothScroll = (element) => {
  document.querySelector(element).scrollIntoView({
    behavior: 'smooth'
  })
}

/**
 * @description 回到顶部
 */
export const scrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop)
    window.scrollTo(0, c - c / 8)
  }
}

/**
 * @description 页面自适应 rem
 * @param { number } width
 */
export function AutoResponse(width = 750) {
  const target = document.documentElement
  target.clientWidth >= 600
    ? (target.style.fontSize = '80px')
    : (target.style.fontSize = (target.clientWidth / width) * 100 + 'px')
}

// 浏览器相关工具函数

/**
 * @description localStorage 设置
 * 目前对象值如果是函数 、RegExp等特殊对象存贮会被忽略
 * @param { String } key  属性
 * @param { string } value 值
 */
export const localStorageSet = (key, value) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  localStorage.setItem(key, value)
}

/**
 * @param {String} key  属性
 * @param {*} value 存贮值
 * @param { number } expire 过期时间,毫秒数
 * @description localStorage 存贮某一段时间失效
 */
export const localStorageSetExpire = (key, value, expire) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  localStorage.setItem(key, value)
  setTimeout(() => {
    localStorage.removeItem(key)
  }, expire)
}

/**
 * @param {String} key  属性
 * @param {*} value 存贮值
 * @param {String} expire 过期时间,毫秒数
 * @description sessionStorage 存贮某一段时间失效
 */
export const sessionStorageSetExpire = (key, value, expire) => {
  if (typeof value === 'object') value = JSON.stringify(value)
  sessionStorage.setItem(key, value)
  setTimeout(() => {
    sessionStorage.removeItem(key)
  }, expire)
}

// 字符串类

/**
 *  @param { number } num
 *  @description 金钱格式化，三位加逗号
 */
export const formatMoney = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

/**
 * @param file
 * @param format  指定文件格式
 * @param size  指定文件大小(字节)
 * @param formatMsg 格式错误提示
 * @param sizeMsg   大小超出限制提示
 * @returns {Promise<any>}
 * @description 获取文件base64编码
 */
export function fileToBase64String(
  file,
  format = ['jpg', 'jpeg', 'png', 'gif'],
  size = 20 * 1024 * 1024,
  formatMsg = '文件格式不正确',
  sizeMsg = '文件大小超出限制'
) {
  return new Promise((resolve, reject) => {
    // 格式过滤
    let suffix = file.type.split('/')[1].toLowerCase()
    let inFormat = false
    for (let i = 0; i < format.length; i++) {
      if (suffix === format[i]) {
        inFormat = true
        break
      }
    }
    if (!inFormat) {
      reject(formatMsg)
    }
    // 大小过滤
    if (file.size > size) {
      reject(sizeMsg)
    }
    // 转base64字符串
    let fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.onload = () => {
      let res = fileReader.result
      resolve({ base64String: res, suffix: suffix })
      reject('异常文件，请重新选择')
    }
  })
}

/**
 *  @param { base64 } base64
 *  @param { string } filename 转换后的文件名
 *  @description base64转文件
 */
export const base64ToFile = (base64, filename) => {
  let arr = base64.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1] // 图片后缀
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, { type: mime })
}

// 数据处理
/**
 *
 * @param data 源数据
 * @param pid
 * @param pidName
 * @param idName
 * @param childrenName
 * @param key
 * @returns {*[]}
 */
export function getTreeData(data, pid, pidName = 'parentId', idName = 'id', childrenName = 'children', key) {
  let arr = []
  for (let i = 0; i < data.length; i++) {
    if (data[i][pidName] == pid) {
      data[i].key = data[i][idName]
      data[i][childrenName] = getTreeData(data, data[i][idName], pidName, idName, childrenName)
      arr.push(data[i])
    }
  }

  return arr
}

/**
 * @param {*} item
 * @param { array } data
 * @description 查询数组中是否存在某个元素并返回元素第一次出现的下标
 */
export function inArray(item, data) {
  for (let i = 0; i < data.length; i++) {
    if (item === data[i]) {
      return i
    }
  }
  return -1
}

/**
 * @param { function } func
 * @param { number } wait 延迟执行毫秒数
 * @param { boolean } immediate  true 表立即执行，false 表非立即执行
 * @description 防抖函数
 */
export function debounce(func, wait, immediate) {
  let timeout
  return function () {
    let context = this
    let args = arguments

    if (timeout) clearTimeout(timeout)
    if (immediate) {
      let callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}

/**
 * @param { function } func 函数
 * @param { number } wait 延迟执行毫秒数
 * @param { number } type 1 表时间戳版，2 表定时器版
 * @description 节流函数
 */
export function throttle(func, wait, type) {
  let previous, timeout
  if (type === 1) {
    previous = 0
  } else if (type === 2) {
    timeout = null
  }
  return function () {
    let context = this
    let args = arguments
    if (type === 1) {
      let now = Date.now()

      if (now - previous > wait) {
        func.apply(context, args)
        previous = now
      }
    } else if (type === 2) {
      if (!timeout) {
        timeout = setTimeout(() => {
          timeout = null
          func.apply(context, args)
        }, wait)
      }
    }
  }
}

/**
 * @param {*} target
 * @description 判断数据类型
 */
export function type(target) {
  let ret = typeof target
  let template = {
    '[object Array]': 'array',
    '[object Object]': 'object',
    '[object Number]': 'number - object',
    '[object Boolean]': 'boolean - object',
    '[object String]': 'string-object'
  }

  if (target === null) {
    return 'null'
  } else if (ret == 'object') {
    let str = Object.prototype.toString.call(target)
    return template[str]
  } else {
    return ret
  }
}

/**
 * @description 生成指定范围的随机数
 * @param { number } min
 * @param { number } max
 */
export const RandomNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

/**
 * @description 数组中 某个元素出现的次数
 * @param { array } arr
 * @param {*} value
 */
export function countOccurrences(arr, value) {
  return arr.reduce((a, v) => (v === value ? a + 1 : a + 0), 0)
}

/**
 * @description 去除空格
 * @param { string } str 待处理字符串
 * @param  { number } type 去除空格类型 1-所有空格  2-前后空格  3-前空格 4-后空格 默认为1
 */
export function trim(str, type = 1) {
  if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return
  switch (type) {
    case 1:
      return str.replace(/\s/g, '')
    case 2:
      return str.replace(/(^\s)|(\s*$)/g, '')
    case 3:
      return str.replace(/(^\s)/g, '')
    case 4:
      return str.replace(/(\s$)/g, '')
    default:
      return str
  }
}

/**
 * @description 大小写转换
 * @param { string } str 待转换的字符串
 * @param { number } type 1-全大写 2-全小写 3-首字母大写 其他-不转换
 */

export function turnCase(str, type) {
  switch (type) {
    case 1:
      return str.toUpperCase()
    case 2:
      return str.toLowerCase()
    case 3:
      return str[0].toUpperCase() + str.substr(1).toLowerCase()
    default:
      return str
  }
}

/**
 * @description 转义html(防XSS攻击)
 * @param str
 */
export const escapeHTML = (str) => {
  str.replace(
    /[&<>'"]/g,
    (tag) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[tag] || tag
  )
}

/**
 * @description 数字超过规定大小加上加号“+”，如数字超过99显示99+
 * @param { number } val 输入的数字
 * @param { number } maxNum 数字规定界限
 */
export const outOfNum = (val, maxNum) => {
  val = val ? val - 0 : 0
  if (val > maxNum) {
    return `${maxNum}+`
  } else {
    return val
  }
}

/**
 * @description 数组转li列表，将数组的元素转换为<li>标签，并将其附加到给定ID的列表中。
 * @param {Array} arr 传入的数组
 * @param {String} listID  插入的父元素的id
 * @returns {*}
 */
export const arrayToHtmlList = (arr, listID) =>
  ((el) => (
    (el = document.querySelector('#' + listID)), (el.innerHTML += arr.map((item) => `<li>${item}</li>`).join(''))
  ))()

/**
 * @description 只执行一次的函数
 * @param fn
 * @returns {(function(): void)|*}
 */
export const onceFn = (fn) => {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}

/**
 * @description 全等判断
                在两个变量之间进行深度比较以确定它们是否全等。
 * @param a
 * @param b
 * @returns {boolean}
 */
export const equals = (a, b) => {
  if (a === b) return true
  if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime()
  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b
  if (a.prototype !== b.prototype) return false
  let keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false
  return keys.every((k) => equals(a[k], b[k]))
}

/**
 * @description 四舍五入到指定位数
 * @param {Number} n 目标数组
 * @param {*} decimals 位数
 * @returns {number}
 */
export const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)

/**
 * @description 隐藏指定元素
 * @param el
 */
export const hide = (...el) => [...el].forEach((e) => (e.style.display = 'none'))
