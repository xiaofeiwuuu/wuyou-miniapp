/**
 * 推荐相关API
 */
import http from './request'

/**
 * 获取推荐小程序列表
 * @param {String} dlUser - 用户名
 */
export const getTjList = (dlUser) => {
  return http.request({
    url: '/api/tjList',
    method: 'GET',
    params: {
      dlUser
    }
  })
}

/**
 * 获取邀请列表
 * @param {String} userId - 用户ID
 */
export const getInviteList = (userId) => {
  return http.request({
    url: '/api/inviteList',
    method: 'GET',
    params: {
      userId
    }
  })
}
