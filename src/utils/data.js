/**
 * 自定义和数据库操作混合类
 * 整理table对外暴露的内容为全新的数据
 */
/*import settings from 'src/settings'
import store from '../store'
import { post } from 'utils'*/

/**
 * 对象变fetch的form类型传参
 */
export const obj2UrlForm = function (object, escape) {
  let result = ''
  for (var item in object) {
    if (object.hasOwnProperty(item)) {
      escape ? (result += `${item}=${encodeURIComponent(object[item])}&`) : (result += `${item}=${object[item]}&`)
    }
  }
  return result.substr(0, result.length - 1)
}

//JS 判断中英文字符长度
export function strlen(str) {
  var len = 0
  for (var i = 0; i < str.length; i++) {
    var c = str.charCodeAt(i)
    //单字节加1
    if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
      len++
    } else {
      len += 2
    }
  }
  return len
}

/**
 * 接口错误方法
 * 可跟根据接口模式覆盖
 * @param {*接口obj} object
 */
export const dataErr = function (object) {
  // return object.flag === "T"
  if (object.flag) {
    return object.flag === 'T'
  }
  // 兼容之前的接口
  if (object.code == 200) {
    return true
  }
}

/**
 *
 * @param {*} filterVal
 * @param {*} jsonData
 */
export const formatJson = function (filterVal, jsonData) {
  return jsonData.map((v) => filterVal.map((j) => v[j]))
}

/**
 * 深拷贝对象或数组
 * @param {*要拷贝的Object或者Array} obj
 */
export function cloneObj(obj) {
  let str,
    newobj = obj.constructor === Array ? [] : {}
  if (typeof obj !== 'object') {
    return
  } else if (window.JSON) {
    str = JSON.stringify(obj)
    newobj = JSON.parse(str)
  } else {
    for (var i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}

/**
 * 为object添加属性
 * @param {*待添加的data} data
 * @param {*需要添加的属性} props
 */
export function addProps(data, props) {
  let length = data.length
  for (let i = 0; i < length; i++) {
    for (let key in props) {
      data[i][key] = props[key]
    }
  }
}

/**
 * 合并object
 * @param {*目标对象} target
 * @param {*合并的对象} source
 */
export function merge(target, source) {
  let res = { ...target }
  for (var key in source) {
    res[key] = source[key]
  }
  return res
}

// 合并对象，如果target内没有对象结构则不合并
export function mergeNotInObject(target, source) {
  let res = { ...target }
  for (var key in source) {
    if (target.hasOwnProperty(key)) {
      res[key] = source[key]
    }
  }
  return res
}

/**
 * Object是否为空
 * @param {*对象} object
 */
export function objIsEmpty(object) {
  return object === undefined || object === null || JSON.stringify(object) === '{}'
}

/**
 * 是否为空
 * @param {*参数项} item
 */
export function isEmpty(item) {
  return item === undefined || item === null || item === ''
}

export function isArray(v) {
  return v instanceof Array
}

/**
 * $ref去重
 */
export function refRemove(key, json) {
  let keyArr = key.split('.')
  keyArr.splice(0, 1)
  let obj = { ...json }
  if (keyArr.length > 0) {
    keyArr.forEach((item) => {
      if (item.indexOf('[') !== -1) {
        let itemStr = item.replace(']', '')
        let itemArr = itemStr.split('[')
        obj = obj[itemArr[0]][itemArr[1]]
      } else {
        obj = obj[item]
      }
    })
  }
  return obj
}

/**
 * Array转换为obj，来方便翻译读取数据
 * @param {Array} arr 待处理的array
 * @param {String|Number} keyName 输出Object的key
 * @param {String|Number} valueName 输出Object的value
 * @param {Boolean} keyIsLikeArr key是否为类array
 * EXAMPLE:
 * 输入：
 * arr: [ { key: '11', value: 'test1' }, { key: '22', value: 'test2' } ]
 * keyName: 'key'; valueName: 'value'
 *
 * 输出：{ '11': 'test1', '22': 'test2' }
 */
export function arrayTransfToObjWithKey(arr, keyName, valueName, keyIsLikeArr) {
  let res = {}
  arr.forEach((item) => {
    let resKey = item[keyName]
    if (resKey) {
      // 解决类array的key的问题
      if (keyIsLikeArr) {
        let keyArr = resKey.split(',')
        keyArr.forEach((innerItem) => {
          if (typeof innerItem === 'string') {
            let realKey = innerItem.trim()
            res[realKey] = item[valueName]
          }
        })
      } else {
        res[resKey] = item[valueName]
      }
    }
  })
  return res
}

/**
 * 基础查找table翻译，与上面的方法配合使用
 * @param {Object} row
 * @param {String} columnName
 * @param {Object} transfObj
 *
 * 输入：
 * row: { test: '1', test1: '2' }
 * columnName: test
 * transfObj: { 1: 'merj', 2: 'jzmiao' }
 * 输出：'merj'
 */
export function baseTbFormatter(row, columnName, transfObj) {
  let columnValue = row[columnName]
  if (columnValue) {
    return transfObj[columnValue] || ''
  }
  return columnValue || ''
}
export function isNull(val, defaultValue) {
  let isNulltemp = val === '' || val === undefined || val === null
  if (defaultValue !== undefined) {
    if (isNulltemp) {
      return defaultValue
    }
    return val
  } else {
    return isNulltemp
  }
}

/**
 * start
 */
export function generateIndex(data, key, addNum) {
  if (undefined === addNum) {
    addNum = 1
  }
  data.forEach((item, index) => {
    item[key] = String(index + addNum)
  })
}
// array为对象集合中提取某个key
export function arrayObj2Arr(arr, key, canRepeat) {
  let res = []
  arr.forEach((item) => {
    let pushVal = item[key]
    if (pushVal && (canRepeat || res.indexOf(pushVal) === -1)) {
      res.push(pushVal)
    }
  })
  return res
}
// 联动赋值 cover-有值得话是否覆盖
export function linkageToSetOtherData(linkObj, value, linkList, extObj, cover = true) {
  if (value) {
    linkList.forEach((item) => {
      let itemKeyObj = typeof item === 'string' ? { from: item, to: item } : item
      if (cover) {
        linkObj[itemKeyObj.to] = extObj[itemKeyObj.from] || ''
      } else if (!cover && isNull(linkObj[itemKeyObj.to])) {
        linkObj[itemKeyObj.to] = extObj[itemKeyObj.from] || ''
      } else if (!cover && !isNull(linkObj[itemKeyObj.to])) {
        for (const key in extObj) {
          if (linkObj.hasOwnProperty(key)) {
            linkObj[key] = extObj[key]
          }
        }
      }
    })
  } else {
    linkList.forEach((item) => {
      let resetItemKey = typeof item === 'string' ? item : item.to
      if (cover) {
        linkObj[resetItemKey] = ''
      } else if (!cover && isNull(linkObj[resetItemKey])) {
        linkObj[resetItemKey] = ''
      } else if (!cover && !isNull(linkObj[resetItemKey])) {
        linkObj[resetItemKey] = ''
      }
    })
  }
}
export const noopData = (data) => {
  return data
}
export const noop = () => {}

export function filterCodeMap(val, codeKey, tempArr, topNum) {
  let res = [],
    codeMapArr = cacheCodeMap[codeKey] || [],
    currentNum = 0
  // Max Render Size
  // More Element reduce VueRender efficiency!
  topNum = topNum || 200

  if (codeMapArr.length > 0) {
    if (isEmpty(val)) {
      res = codeMapArr.slice(0, topNum)
    } else {
      codeMapArr.forEach((item) => {
        let match = tempArr.some((key) => {
          let word = (item[key] || '') + ''
          return word.indexOf(val) > -1
        })
        if (match && currentNum < topNum) {
          currentNum += 1
          res.push({ ...item })
        }
      })
    }
  }
  return res
}
