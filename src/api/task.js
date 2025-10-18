/**
 * 任务相关API
 */
import http from './request'

/**
 * 用户签到
 * @param {String} userId - 用户ID
 * @param {String} userName - 用户名
 */
export const signIn = ({ userId, userName }) => {
  return http.request({
    url: '/api/signIn',
    method: 'GET',
    params: {
      userId,
      userName
    },
    custom: {
      loadingText: '签到中...'
    }
  })
}

/**
 * 观看广告增加次数
 * @param {String} userId - 用户ID
 */
export const adAddNumber = (userId) => {
  return http.request({
    url: '/api/adAddNumber',
    method: 'GET',
    params: {
      userId
    },
    custom: {
      loading: false
    }
  })
}

/**
 * 卡密充值
 * @param {Object} params - 充值参数
 */
export const keyPay = (params) => {
  return http.request({
    url: '/api/keyPay',
    method: 'GET',
    params,
    custom: {
      loadingText: '充值中...'
    }
  })
}
