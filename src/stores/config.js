/**
 * 应用配置状态管理
 */
import { defineStore } from 'pinia'
import { setStorage, getStorage } from '@/utils/storage'

export const useConfigStore = defineStore('config', {
  state: () => ({
    // 解析数据（临时存储）
    analysisData: null,

    // 广告实例
    interstitialAd: null, // 插屏广告
    rewardedVideoAd: null // 激励视频广告
  }),

  actions: {
    // 设置解析数据
    setAnalysisData(data) {
      this.analysisData = data
      setStorage('analysisData', data)
    },

    // 获取解析数据
    getAnalysisData() {
      if (!this.analysisData) {
        this.analysisData = getStorage('analysisData', null)
      }
      return this.analysisData
    },

    // 清除解析数据
    clearAnalysisData() {
      this.analysisData = null
      setStorage('analysisData', null)
    },

    // 设置插屏广告实例
    setInterstitialAd(ad) {
      this.interstitialAd = ad
    },

    // 设置激励视频广告实例
    setRewardedVideoAd(ad) {
      this.rewardedVideoAd = ad
    }
  }
})
