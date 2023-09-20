/**
 * 下划线字段转驼峰   ABC_TEST -> abcTest
 * @param {*} params
 */
export function covertToCamelCase(word) {
  return word.toLowerCase().replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase()
  })
}

/**
 * 删除字符串的指定区间并返回新的字符串
 * 还不完善！！！！
 */
export function delStringSection(word, start, end) {
  let left = '',
    right = ''
  if (start >= 0) {
    left = word.slice(0, start)
    right = word.slice(end + 1, word.length)
  } else {
    if (end + 1 === 0) {
      end = word.length
    }
    left = word.slice(0, start)
    right = word.slice(end + 1, word.length)
  }
  return left + right
}
