/**
 * 用户相关API
 */
import http from './request'

/**
 * 微信自动登录
 * @param {String} code - 微信登录code
 * @param {String} user - 用户名
 * @param {String} oldUserId - 邀请人用户ID（可选）
 */
export const autoLoginWx = ({ code, user, oldUserId = '' }) => {
  return http.request({
    url: '/api/autoLoginWx',
    method: 'GET',
    params: {
      code,
      user,
      oldUserId
    },
    custom: {
      loadingText: '登录中...',
      showError: true
    }
  })
}

/**
 * 获取用户信息
 * @param {String} userId - 用户ID
 */
export const getUserInfo = (userId) => {
  return http.request({
    url: '/api/getUserInfo',
    method: 'GET',
    params: {
      userId
    }
  })
}
