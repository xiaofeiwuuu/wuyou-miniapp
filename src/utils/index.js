/**
 * 通用工具函数
 */
import dayjs from 'dayjs'

/**
 * 从文本中提取URL
 * @param {String} text - 文本内容
 * @returns {String|null} - URL或null
 */
export const extractUrl = (text) => {
  if (!text) return null

  const urlRegex = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g
  const matches = text.match(urlRegex)

  return matches && matches.length > 0 ? matches[0] : null
}

/**
 * 格式化时间
 * @param {Date|String|Number} date - 日期
 * @param {String} format - 格式
 */
export const formatTime = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间（多少天前）
 * @param {Date|String|Number} date - 日期
 */
export const getRelativeTime = (date) => {
  const now = dayjs()
  const target = dayjs(date)
  const diff = now.diff(target, 'day')

  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  if (diff < 7) return `${diff}天前`
  if (diff < 30) return `${Math.floor(diff / 7)}周前`
  if (diff < 365) return `${Math.floor(diff / 30)}个月前`
  return `${Math.floor(diff / 365)}年前`
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {Number} wait - 等待时间（毫秒）
 */
export const debounce = (func, wait = 500) => {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

/**
 * 节流函数
 * @param {Function} func - 要执行的函数
 * @param {Number} wait - 等待时间（毫秒）
 */
export const throttle = (func, wait = 500) => {
  let lastTime = 0
  return function (...args) {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func.apply(this, args)
    }
  }
}

/**
 * 跳转到小程序
 * @param {String} appId - 小程序AppID
 * @param {String} path - 跳转路径
 */
export const navigateToMiniProgram = (appId, path = '') => {
  uni.navigateToMiniProgram({
    appId,
    path,
    extraData: {},
    envVersion: 'release',
    success: () => {
      console.log('跳转成功')
    },
    fail: (error) => {
      console.error('跳转失败:', error)
      uni.showToast({
        title: '跳转失败',
        icon: 'none'
      })
    }
  })
}

/**
 * 复制文本到剪贴板
 * @param {String} text - 要复制的文本
 */
export const copyText = (text) => {
  return new Promise((resolve, reject) => {
    uni.setClipboardData({
      data: text,
      success: () => {
        uni.showToast({
          title: '复制成功',
          icon: 'success'
        })
        resolve()
      },
      fail: (error) => {
        uni.showToast({
          title: '复制失败',
          icon: 'none'
        })
        reject(error)
      }
    })
  })
}

/**
 * 从剪贴板获取文本
 */
export const getClipboardText = () => {
  return new Promise((resolve, reject) => {
    uni.getClipboardData({
      success: (res) => {
        resolve(res.data)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 显示确认对话框
 * @param {String} content - 内容
 * @param {String} title - 标题
 */
export const showConfirm = (content, title = '提示') => {
  return new Promise((resolve) => {
    uni.showModal({
      title,
      content,
      success: (res) => {
        resolve(res.confirm)
      }
    })
  })
}

/**
 * 显示Toast
 * @param {String} title - 提示内容
 * @param {String} icon - 图标类型
 * @param {Number} duration - 持续时间
 */
export const showToast = (title, icon = 'none', duration = 2000) => {
  uni.showToast({
    title,
    icon,
    duration
  })
}

/**
 * 预览图片
 * @param {Array} urls - 图片URL数组
 * @param {Number} current - 当前显示图片的索引
 */
export const previewImage = (urls, current = 0) => {
  uni.previewImage({
    urls,
    current
  })
}
