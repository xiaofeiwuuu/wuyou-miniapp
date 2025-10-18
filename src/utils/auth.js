/**
 * 认证相关工具
 */
import { autoLoginWx } from '@/api'
import { setStorage, getStorage, StorageKeys } from './storage'

/**
 * 微信登录
 * @param {String} inviteUserId - 邀请人用户ID（可选）
 */
export const wxLogin = (inviteUserId = '') => {
  return new Promise((resolve, reject) => {
    // 调用微信登录
    const username = import.meta.env.VITE_APP_USERNAME || 'admin'

    uni.login({
      provider: 'weixin',
      success: async (loginRes) => {
        try {
          if (!loginRes.code) {
            throw new Error('微信登录失败: 未获取到code')
          }

          const code = loginRes.code

          // 调用后端登录接口
          const res = await autoLoginWx({
            code,
            user: username,
            oldUserId: inviteUserId || 0
          })

          if (res && res.data) {
            // 存储用户信息
            setStorage(StorageKeys.USER_INFO, res.data)
            resolve(res.data)
          } else {
            const errorMsg = res?.msg || '登录失败,请重试'
            throw new Error(errorMsg)
          }
        } catch (error) {
          console.error('登录错误:', error)
          // 开发环境下,使用模拟数据
          if (import.meta.env.VITE_APP_ENV === 'development') {
            console.warn('开发环境登录失败,使用模拟数据')
            const mockUserInfo = {
              userId: 572,
              openId: 'dev_openid_' + Date.now(),
              userName: username,
              signInTime: '',
              sysConfig: {
                fxTitle: '无忧去水印',
                fxUrl: '',
                cpAd: '',
                jlAd: ''
              }
            }
            setStorage(StorageKeys.USER_INFO, mockUserInfo)
            resolve(mockUserInfo)
          } else {
            reject(error)
          }
        }
      },
      fail: (error) => {
        console.error('微信登录失败:', error)
        reject(error)
      }
    })
  })
}

/**
 * 获取用户信息
 */
export const getUserData = () => {
  return getStorage(StorageKeys.USER_INFO, null)
}

/**
 * 检查是否已登录
 */
export const isLoggedIn = () => {
  const userInfo = getUserData()
  return userInfo && userInfo.userId && userInfo.openId
}

/**
 * 检查今天是否已签到
 */
export const isSignedInToday = () => {
  const userInfo = getUserData()
  if (!userInfo || !userInfo.signInTime) {
    return false
  }

  const signInDate = new Date(userInfo.signInTime)
  const today = new Date()

  return (
    signInDate.getFullYear() === today.getFullYear() &&
    signInDate.getMonth() === today.getMonth() &&
    signInDate.getDate() === today.getDate()
  )
}

/**
 * 退出登录
 */
export const logout = () => {
  setStorage(StorageKeys.USER_INFO, null)
}
