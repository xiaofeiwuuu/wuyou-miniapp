/**
 * 首页相关API
 */
import http from './request'

/**
 * 获取轮播图列表
 */
export const getLunList = (params = {}) => {
  return http.request({
    url: '/mini/lun/list',
    method: 'GET',
    params
  })
}

/**
 * 视频去水印解析
 * @param {String} url - 需要解析的视频URL
 * @param {String} key - 用户名
 * @param {String} openId - 微信OpenID
 */
export const delWatermark = ({ url, key, openId }) => {
  return http.request({
    url: '/api/delWatermark',
    method: 'GET',
    params: {
      url,
      key,
      openId
    },
    custom: {
      loadingText: '解析中...'
    }
  })
}

/**
 * 口令解析（如果需要）
 */
export const parseCommand = (params) => {
  return http.request({
    url: '/api/jyKouLing',
    method: 'GET',
    params
  })
}

/**
 * 视频下载（备用）
 */
export const downloadVideo = (params) => {
  return http.request({
    url: '/api/shiPinBy',
    method: 'GET',
    params
  })
}
