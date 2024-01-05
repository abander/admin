import XEUtils from 'xe-utils'

/**
 * @desc 获取一个全局唯一标识
 * @param prefix 唯一数前缀
 * @returns {*} 全局唯一标识
 */
export const getUniqueId = (prefix = 'k-ui') => {
  return XEUtils.uniqueId(prefix)
}
