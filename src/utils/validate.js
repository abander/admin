import { isEmpty } from './data'

/* 邮箱是否为空 */
export function isNullEmail(str) {
  const reg =
    /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/i
  return reg.test(str)
}

/* 数字 */
export function validateNumber(str) {
  var reg = /^[0-9]*$/
  return reg.test(str)
}

/* 验证：输入的数字长度验证
   格式："6,10"
*/
export function validateNumberLength(str, range) {
  var ranges = range.split(',')
  var low = ranges[0] == ',' ? 0 : parseInt(ranges[0])
  var high = ranges[1] == '' ? '' : parseInt(ranges[1])
  var reg = eval('/^\\d{' + low + ',' + high + '}$/;')
  return reg.test(str)
}

/* 手机号*/
export function validatePhone(str) {
  const reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
  return reg.test(str)
}

/* 是否是邮箱*/
export function isWscnEmail(str) {
  const reg =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(str.trim())
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

export function validatPass(str) {
  const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{6,20}$/
  return reg.test(str)
}

/**
 *
 * @param rule
 * @param value
 * @param callback
 * @param isRequired 是否可以为空
 * @param reg        正则表达式，没有就空
 * @param regMassge  正则表达式提示消息
 * @param length     值长度
 * @returns {*}
 */
export function checkInput(
  rule,
  value,
  callback,
  isRequired,
  reg,
  regMassge,
  length,
) {
  if (isRequired == 'Y') {
    if (value == '' || value == null) {
      return '不能为空'
    }
  }
  if (value != '' && value != null) {
    if (reg != null && reg != '') {
      if (!reg.test(value)) {
        return regMassge
      }
    }
    let size = getByteLen(value)
    if (size > length) {
      return '值超长'
    }
  }
}

function getByteLen(val) {
  var len = 0
  for (var i = 0; i < val.length; i++) {
    var a = val.charAt(i)
    if (a.match(/[^\x00-\xff]/gi) != null) {
      len += 3
    } else {
      len += 1
    }
  }
  return len
}
