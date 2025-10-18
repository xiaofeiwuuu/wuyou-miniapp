/**
 * 本地存储工具
 * 封装 uni.storage API
 */

/**
 * 存储数据
 * @param {String} key - 键名
 * @param {Any} value - 值
 */
export const setStorage = (key, value) => {
  try {
    uni.setStorageSync(key, value)
    return true
  } catch (e) {
    console.error('存储失败:', e)
    return false
  }
}

/**
 * 获取数据
 * @param {String} key - 键名
 * @param {Any} defaultValue - 默认值
 */
export const getStorage = (key, defaultValue = null) => {
  try {
    const value = uni.getStorageSync(key)
    return value !== '' ? value : defaultValue
  } catch (e) {
    console.error('读取失败:', e)
    return defaultValue
  }
}

/**
 * 删除数据
 * @param {String} key - 键名
 */
export const removeStorage = (key) => {
  try {
    uni.removeStorageSync(key)
    return true
  } catch (e) {
    console.error('删除失败:', e)
    return false
  }
}

/**
 * 清空所有数据
 */
export const clearStorage = () => {
  try {
    uni.clearStorageSync()
    return true
  } catch (e) {
    console.error('清空失败:', e)
    return false
  }
}

// 常用的存储key
export const StorageKeys = {
  USER_INFO: 'appUser', // 用户信息
  ANALYSIS_DATA: 'analysisData', // 解析数据
  USERNAME: 'username', // 用户名
  OPEN_ID: 'openId' // OpenID
}
