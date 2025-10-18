/**
 * 分享混入
 * 统一配置分享功能
 */
import { useUserStore } from '@/stores'

export default {
  onShareAppMessage() {
    const userStore = useUserStore()
    const { sysConfig, userId } = userStore

    return {
      title: sysConfig.fxTitle || '无忧去水印',
      imageUrl: sysConfig.fxUrl || '',
      path: `/pages/index/index?userid=${userId}`
    }
  },

  onShareTimeline() {
    const userStore = useUserStore()
    const { sysConfig } = userStore

    return {
      title: sysConfig.fxTitle || '无忧去水印',
      imageUrl: sysConfig.fxUrl || '',
      query: {}
    }
  }
}
