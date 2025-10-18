<template>
  <view class="video-container">
    <!-- 视频播放器 -->
    <video
      v-if="videoUrl"
      id="videoPlayer"
      :src="videoUrl"
      class="video-player"
      :poster="coverImage"
      :show-center-play-btn="false"
      :show-play-btn="false"
      :controls="false"
      :autoplay="false"
      :enable-progress-gesture="true"
      :object-fit="'contain'"
      @play="onPlay"
      @pause="onPause"
      @timeupdate="onTimeUpdate"
      @ended="onEnded"
    ></video>

    <!-- 播放/暂停按钮 -->
    <view v-if="videoUrl && !isPlaying" class="play-btn" @tap="handlePlay">
      <view class="play-icon">▶</view>
    </view>

    <!-- 暂停按钮(播放时点击视频区域暂停) -->
    <view v-if="videoUrl && isPlaying" class="video-overlay" @tap="handlePlay"></view>

    <!-- 视频信息和操作区 -->
    <view class="video-info" v-if="videoUrl">
      <!-- 左侧文案区 -->
      <view class="info-left">
        <view class="video-title" @tap="copyTitle">
          <text class="title-text">{{ title }}</text>
          <!-- <text class="copy-icon">📋</text> -->
        </view>
        <view class="video-subtitle" v-if="videoUrl">
          <text class="subtitle-text">点击文案可复制</text>
        </view>
      </view>

      <!-- 右侧操作按钮组 -->
      <view class="info-right">
        <view v-if="coverImage" class="action-item" @tap="showImageModal">
          <image src="/static/icon/picture.png" class="action-icon" mode="aspectFit" />
          <text class="action-text">图片</text>
        </view>
        <view class="action-item" @tap="downloadVideo">
          <image src="/static/icon/download.png" class="action-icon" mode="aspectFit" />
          <text class="action-text">下载</text>
        </view>
      </view>
    </view>

    <!-- 进度条 -->
    <view v-if="videoUrl && isPlaying" class="progress-bar">
      <view class="progress-time">{{ currentTimeStr }} / {{ durationStr }}</view>
      <view class="progress-track">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="!videoUrl" class="empty">
      <view class="empty-icon">📹</view>
      <text class="empty-text">暂无视频数据</text>
      <view class="back-btn" @tap="goBack">返回首页</view>
    </view>

    <!-- 图片弹窗 -->
    <view v-if="showModal" class="image-modal" @tap="closeImageModal">
      <view class="modal-content" @tap.stop>
        <view class="modal-header">
          <text class="modal-title">封面图片</text>
          <view class="modal-close" @tap="closeImageModal">✕</view>
        </view>
        <view class="modal-body">
          <image
            :src="coverImage"
            class="modal-image"
            mode="aspectFit"
            @tap="previewImage"
          />
          <view class="modal-tip">点击图片放大,长按保存</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores'
import { showToast } from '@/utils'

export default {
  data() {
    return {
      videoUrl: '',
      title: '',
      coverImage: '',
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      showModal: false
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },
    progressPercent() {
      if (!this.duration) return 0
      return (this.currentTime / this.duration) * 100
    },
    currentTimeStr() {
      return this.formatTime(this.currentTime)
    },
    durationStr() {
      return this.formatTime(this.duration)
    }
  },

  onLoad() {
    const analysisData = uni.getStorageSync('analysisData')
    console.log('视频页获取的数据:', analysisData)

    if (analysisData) {
      // 修复字段名: url 而不是 video_url
      this.videoUrl = analysisData.url || ''
      this.title = analysisData.title || '无标题'
      this.coverImage = analysisData.img || ''

      if (!this.videoUrl) {
        showToast('视频链接获取失败')
      }
    } else {
      showToast('未找到视频数据')
    }

    // 显示插屏广告 - 非会员才展示
    this.showInterstitialAdIfNeeded()
  },

  onUnload() {
    // 页面卸载时停止播放
    const videoContext = uni.createVideoContext('videoPlayer', this)
    if (videoContext) {
      videoContext.pause()
    }
  },

  onShareAppMessage() {
    const { sysConfig, userId } = this.userStore
    return {
      title: sysConfig.fxTitle || '无忧去水印',
      imageUrl: sysConfig.fxUrl || '',
      path: `/pages/index/index?userid=${userId}`
    }
  },

  onShareTimeline() {
    const { sysConfig } = this.userStore
    return {
      title: sysConfig.fxTitle || '无忧去水印',
      imageUrl: sysConfig.fxUrl || ''
    }
  },

  methods: {
    // 播放控制
    handlePlay() {
      const videoContext = uni.createVideoContext('videoPlayer', this)
      if (this.isPlaying) {
        videoContext.pause()
      } else {
        videoContext.play()
      }
    },

    onPlay() {
      this.isPlaying = true
    },

    onPause() {
      this.isPlaying = false
    },

    onTimeUpdate(e) {
      this.currentTime = e.detail.currentTime
      this.duration = e.detail.duration
    },

    onEnded() {
      this.isPlaying = false
    },

    // 格式化时间
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    },

    // 复制标题
    copyTitle() {
      if (!this.title) return

      uni.setClipboardData({
        data: this.title,
        success: () => {
          showToast('文案已复制', 'success')
        },
        fail: () => {
          showToast('复制失败')
        }
      })
    },

    // 下载视频
    async downloadVideo() {
      if (!this.videoUrl) {
        showToast('视频链接无效')
        return
      }

      uni.showLoading({ title: '下载中...' })

      try {
        // 尝试直接下载
        await this.directDownload(this.videoUrl)
      } catch (error) {
        console.error('直接下载失败,尝试代理下载:', error)
        // 直接下载失败,尝试使用服务端代理
        try {
          await this.proxyDownload(this.videoUrl)
        } catch (proxyError) {
          console.error('代理下载也失败:', proxyError)
          uni.hideLoading()
          showToast('下载失败,请稍后重试')
        }
      }
    },

    // 直接下载
    directDownload(videoUrl) {
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: videoUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              this.saveVideoToAlbum(res.tempFilePath)
                .then(resolve)
                .catch(reject)
            } else {
              reject(new Error(`下载失败,状态码: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },

    // 代理下载(备用方案)
    proxyDownload(videoUrl) {
      return new Promise((resolve, reject) => {
        const fileName = `video_${Date.now()}.mp4`
        const serverUrl = 'https://node.xiaofeiwuuu.top'
        const proxyUrl = `${serverUrl}/system/get_file_stream?url=${encodeURIComponent(videoUrl)}&filename=${encodeURIComponent(fileName)}`

        console.log('使用代理下载:', proxyUrl)

        // #ifdef MP-WEIXIN
        const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`
        // #endif

        uni.downloadFile({
          url: proxyUrl,
          // #ifdef MP-WEIXIN
          filePath: filePath,
          // #endif
          success: (res) => {
            if (res.statusCode === 200) {
              const savePath = res.filePath || res.tempFilePath
              this.saveVideoToAlbum(savePath)
                .then(resolve)
                .catch(reject)
            } else {
              reject(new Error(`代理下载失败,状态码: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    },

    // 保存视频到相册
    saveVideoToAlbum(filePath) {
      return new Promise((resolve, reject) => {
        uni.hideLoading()
        uni.showLoading({ title: '保存中...' })

        uni.saveVideoToPhotosAlbum({
          filePath: filePath,
          success: () => {
            uni.hideLoading()
            showToast('保存成功', 'success')
            resolve()
          },
          fail: (err) => {
            uni.hideLoading()
            if (err.errMsg.includes('auth')) {
              uni.showModal({
                title: '提示',
                content: '需要授权访问相册',
                confirmText: '去设置',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    uni.openSetting()
                  }
                }
              })
            } else {
              showToast('保存失败')
            }
            reject(err)
          }
        })
      })
    },

    // 返回首页
    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/index/index' })
        }
      })
    },

    // 显示图片弹窗
    showImageModal() {
      this.showModal = true
    },

    // 关闭图片弹窗
    closeImageModal() {
      this.showModal = false
    },

    // 预览图片
    previewImage() {
      uni.previewImage({
        urls: [this.coverImage],
        current: this.coverImage
      })
    },

    // 显示插屏广告(非会员)
    showInterstitialAdIfNeeded() {
      // 检查是否是会员
      if (this.userStore.isVip === 1) {
        console.log('会员用户,跳过广告')
        return
      }

      const { sysConfig } = this.userStore
      if (!sysConfig || !sysConfig.cpAd) {
        console.log('未配置插屏广告')
        return
      }

      // 延迟1秒展示
      setTimeout(() => {
        this.showInterstitialAd(sysConfig.cpAd)
      }, 1000)
    },

    // 显示插屏广告
    showInterstitialAd(adUnitId) {
      // #ifdef MP-WEIXIN
      if (typeof wx !== 'undefined' && wx.createInterstitialAd) {
        try {
          const ad = wx.createInterstitialAd({ adUnitId })

          ad.onLoad(() => {
            console.log('插屏广告加载成功')
          })

          ad.onError((err) => {
            console.warn('插屏广告加载失败:', err)
          })

          ad.show().catch((err) => {
            if (err.errCode === 2001) {
              console.warn('广告展示时机受限,稍后再试')
            } else {
              console.warn('广告展示失败:', err.errMsg)
            }
          })
        } catch (error) {
          console.warn('创建插屏广告失败:', error)
        }
      }
      // #endif
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  overflow: hidden;
}

.video-player {
  width: 100vw;
  height: 100vh;
  background-color: #000;
}

// 播放按钮
.play-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  z-index: 10;

  &:active {
    transform: translate(-50%, -50%) scale(0.9);
  }

  .play-icon {
    font-size: 48rpx;
    color: #000;
    margin-left: 8rpx;
  }
}

// 视频覆盖层(用于暂停)
.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 200rpx;
  z-index: 5;
}

// 视频信息区
.video-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 32rpx;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  z-index: 10;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

// 左侧文案区
.info-left {
  flex: 1;
  padding-right: 32rpx;
}

.video-title {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16rpx;
  cursor: pointer;

  &:active {
    opacity: 0.8;
  }

  .title-text {
    flex: 1;
    font-size: 28rpx;
    line-height: 1.5;
    color: #fff;
    font-weight: 500;
    word-break: break-all;
  }

  .copy-icon {
    font-size: 32rpx;
    margin-left: 16rpx;
    flex-shrink: 0;
  }
}

.video-subtitle {
  .subtitle-text {
    font-size: 24rpx;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 右侧操作按钮组
.info-right {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.9);
    opacity: 0.8;
  }

  .action-icon {
    width: 80rpx;
    height: 80rpx;
    filter: drop-shadow(0 4rpx 8rpx rgba(0, 0, 0, 0.3));
  }
}

.action-text {
  font-size: 24rpx;
  color: #fff;
  font-weight: 500;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
}

// 进度条
.progress-bar {
  position: absolute;
  bottom: 200rpx;
  left: 32rpx;
  right: 32rpx;
  z-index: 10;
}

.progress-time {
  font-size: 24rpx;
  color: #fff;
  margin-bottom: 12rpx;
  text-shadow: 0 2rpx 4rpx rgba(0, 0, 0, 0.5);
}

.progress-track {
  width: 100%;
  height: 6rpx;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ff69b4, #ff1493);
  border-radius: 3rpx;
  transition: width 0.3s ease;
}

// 空状态
.empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.6;
  }

  .empty-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 28rpx;
    margin-bottom: 48rpx;
  }

  .back-btn {
    padding: 24rpx 48rpx;
    background: linear-gradient(135deg, #ff69b4, #ff1493);
    color: #fff;
    font-size: 28rpx;
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(255, 20, 147, 0.4);

    &:active {
      opacity: 0.8;
      transform: scale(0.95);
    }
  }
}

// 图片弹窗
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-content {
  width: 90vw;
  max-width: 600rpx;
  background: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx;
  border-bottom: 1rpx solid #eee;

  .modal-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }

  .modal-close {
    width: 56rpx;
    height: 56rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #999;
    cursor: pointer;

    &:active {
      color: #333;
    }
  }
}

.modal-body {
  padding: 32rpx;
  max-height: 60vh;
  overflow-y: auto;
}

.modal-image {
  width: 100%;
  min-height: 400rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  cursor: pointer;
  transition: transform 0.3s ease;

  &:active {
    transform: scale(0.98);
  }
}

.modal-tip {
  text-align: center;
  font-size: 24rpx;
  color: #999;
  margin-top: 16rpx;
  padding-bottom: 16rpx;
}
</style>
