/**
 * 网络请求封装
 * 基于 luch-request，支持双后端（Java + Node）
 */
import Request from 'luch-request'

// 获取环境变量
const JAVA_BASE_URL = import.meta.env.VITE_JAVA_BASE_URL
const NODE_BASE_URL = import.meta.env.VITE_NODE_BASE_URL

/**
 * 创建请求实例
 * @param {Boolean} useNode - 是否使用Node后端
 */
function createRequest(useNode = false) {
  const http = new Request({
    baseURL: useNode ? NODE_BASE_URL : JAVA_BASE_URL,
    timeout: 30000,
    method: 'GET',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    custom: {
      loading: true, // 是否显示loading
      loadingText: '加载中...',
      showError: true // 是否显示错误提示
    },
    // 禁用luch-request的自动参数序列化,我们手动处理
    dataType: 'json',
    responseType: 'text'
  })

  // 请求拦截器
  http.interceptors.request.use(
    (config) => {
      // 显示loading
      if (config.custom.loading) {
        uni.showLoading({
          title: config.custom.loadingText,
          mask: true
        })
      }

      // 对于GET请求，手动处理参数序列化，确保正确的URL编码
      if (config.method === 'GET' && config.params) {
        const params = []
        Object.keys(config.params).forEach(key => {
          const value = config.params[key]
          // 只添加有值的参数
          if (value !== undefined && value !== null && value !== '') {
            // 使用encodeURIComponent确保正确的URL编码
            params.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          }
        })
        // 将序列化后的参数添加到URL
        if (params.length > 0) {
          const paramString = params.join('&')
          config.url = config.url + (config.url.includes('?') ? '&' : '?') + paramString
        }
        // 清空params，避免luch-request再次处理
        config.params = {}
      }

      // 可以在这里添加token等认证信息
      // const userStore = useUserStore()
      // if (userStore.token) {
      //   config.header.Authorization = `Bearer ${userStore.token}`
      // }

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // 响应拦截器
  http.interceptors.response.use(
    (response) => {
      // 隐藏loading
      uni.hideLoading()

      const data = response.data

      // 根据后端返回的数据结构进行处理
      // 因为后端数据不规范，这里做兼容处理
      if (data) {
        return Promise.resolve(data)
      } else {
        return Promise.reject(new Error('请求失败'))
      }
    },
    (error) => {
      // 隐藏loading
      uni.hideLoading()

      // 错误处理
      let message = '请求失败'

      if (error.statusCode) {
        switch (error.statusCode) {
          case 400:
            message = '请求参数错误'
            break
          case 401:
            message = '未授权，请重新登录'
            break
          case 403:
            message = '拒绝访问'
            break
          case 404:
            message = '请求地址不存在'
            break
          case 500:
            message = '服务器错误'
            break
          case 502:
            message = '网关错误'
            break
          case 503:
            message = '服务不可用'
            break
          case 504:
            message = '网关超时'
            break
          default:
            message = `连接错误${error.statusCode}`
        }
      } else if (error.errMsg) {
        if (error.errMsg.includes('timeout')) {
          message = '请求超时'
        } else if (error.errMsg.includes('network')) {
          message = '网络连接异常'
        }
      }

      // 是否显示错误提示
      if (error.config && error.config.custom.showError) {
        uni.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      }

      return Promise.reject(error)
    }
  )

  return http
}

// 创建Java后端请求实例（默认）
export const javaHttp = createRequest(false)

// 创建Node后端请求实例
export const nodeHttp = createRequest(true)

// 默认导出Java后端请求
export default javaHttp
