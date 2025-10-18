/**
 * 用户状态管理
 */
import { defineStore } from 'pinia'
import { setStorage, getStorage, StorageKeys } from '@/utils/storage'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    openId: '',
    userName: '',
    signInTime: '',
    syNumber: 0, // 剩余解析次数
    isVip: 0, // 是否VIP (0=普通, 1=VIP)
    dqTime: '', // VIP到期时间
    sysConfig: {
      fxTitle: '', // 分享标题
      fxUrl: '', // 分享图片
      cpAd: '', // 插屏广告ID
      jlAd: '', // 激励视频广告ID
      spAd: '', // 视频广告ID
      gg: '', // 公告内容
      initialNumber: 5, // 新人福利次数
      yqNumber: 10, // 邀请奖励次数
      qdNumber: 3, // 签到奖励次数
      adtime: 0 // 广告免广告时长(分钟)
    }
  }),

  getters: {
    // 是否已登录
    isLogin: (state) => {
      return !!(state.userId && state.openId)
    },

    // 是否今天已签到
    isSignedToday: (state) => {
      if (!state.signInTime) return false

      const signInDate = new Date(state.signInTime)
      const today = new Date()

      return (
        signInDate.getFullYear() === today.getFullYear() &&
        signInDate.getMonth() === today.getMonth() &&
        signInDate.getDate() === today.getDate()
      )
    }
  },

  actions: {
    // 设置用户信息
    setUserInfo(userInfo) {
      this.userId = userInfo.userId || ''
      this.openId = userInfo.openId || ''
      this.userName = userInfo.userName || ''
      this.signInTime = userInfo.signInTime || ''
      this.syNumber = userInfo.syNumber || 0
      this.isVip = userInfo.isVip || 0
      this.dqTime = userInfo.dqTime || ''

      if (userInfo.sysConfig) {
        this.sysConfig = {
          ...this.sysConfig,
          ...userInfo.sysConfig
        }
      }

      // 同步到本地存储
      setStorage(StorageKeys.USER_INFO, {
        userId: this.userId,
        openId: this.openId,
        userName: this.userName,
        signInTime: this.signInTime,
        syNumber: this.syNumber,
        isVip: this.isVip,
        dqTime: this.dqTime,
        sysConfig: this.sysConfig
      })
    },

    // 更新剩余次数
    updateSyNumber(number) {
      this.syNumber = number

      const userInfo = getStorage(StorageKeys.USER_INFO, {})
      userInfo.syNumber = this.syNumber
      setStorage(StorageKeys.USER_INFO, userInfo)
    },

    // 更新签到时间
    updateSignInTime(time) {
      this.signInTime = time || new Date().toISOString()

      // 更新本地存储
      const userInfo = getStorage(StorageKeys.USER_INFO, {})
      userInfo.signInTime = this.signInTime
      setStorage(StorageKeys.USER_INFO, userInfo)
    },

    // 从本地存储恢复用户信息
    restoreUserInfo() {
      const userInfo = getStorage(StorageKeys.USER_INFO, null)
      if (userInfo) {
        this.setUserInfo(userInfo)
      }
    },

    // 清除用户信息
    clearUserInfo() {
      this.$reset()
      setStorage(StorageKeys.USER_INFO, null)
    }
  }
})
