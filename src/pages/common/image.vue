<template>
  <view class="container">
    <view v-if="imageList.length > 0" class="content">
      <!-- 瀑布流两列 -->
      <view class="waterfall">
        <view class="waterfall-column">
          <view
            v-for="(img, index) in leftColumnImages"
            :key="'left-' + index"
            class="image-wrapper"
            @tap="previewImage(img.originalIndex)"
          >
            <image :src="img.src" class="image-item" mode="widthFix" />
          </view>
        </view>
        <view class="waterfall-column">
          <view
            v-for="(img, index) in rightColumnImages"
            :key="'right-' + index"
            class="image-wrapper"
            @tap="previewImage(img.originalIndex)"
          >
            <image :src="img.src" class="image-item" mode="widthFix" />
          </view>
        </view>
      </view>

      <!-- 下载全部按钮 -->
      <view class="download-btn" @tap="downloadAllImages">
        <text class="download-icon">📥</text>
        <text class="download-text">{{ downloading ? '下载中...' : '下载全部图片' }}</text>
      </view>
    </view>

    <view v-else class="empty">
      <view class="empty-icon">🖼️</view>
      <text class="empty-text">暂无图片数据</text>
      <view class="back-btn" @tap="goBack">返回首页</view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores'

export default {
  data() {
    return {
      imageList: [],
      leftColumnImages: [],
      rightColumnImages: [],
      downloading: false
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    }
  },

  onLoad() {
    const analysisData = uni.getStorageSync('analysisData')
    if (analysisData && analysisData.pics) {
      this.imageList = analysisData.pics
      this.distributeImages()
    }

    // 显示插屏广告 - 非会员才展示
    this.showInterstitialAdIfNeeded()
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
    // 分配图片到两列(简单的奇偶分配)
    distributeImages() {
      this.leftColumnImages = []
      this.rightColumnImages = []

      this.imageList.forEach((img, index) => {
        const imageObj = {
          src: img,
          originalIndex: index
        }

        if (index % 2 === 0) {
          this.leftColumnImages.push(imageObj)
        } else {
          this.rightColumnImages.push(imageObj)
        }
      })
    },

    previewImage(index) {
      uni.previewImage({
        urls: this.imageList,
        current: index
      })
    },

    goBack() {
      uni.navigateBack({
        fail: () => {
          uni.switchTab({ url: '/pages/index/index' })
        }
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
    },

    // 下载全部图片
    async downloadAllImages() {
      if (this.downloading || this.imageList.length === 0) {
        return
      }

      this.downloading = true
      let successCount = 0
      let failCount = 0

      uni.showLoading({ title: '准备下载...' })

      try {
        for (let i = 0; i < this.imageList.length; i++) {
          try {
            uni.showLoading({ title: `下载中 ${i + 1}/${this.imageList.length}` })
            await this.downloadSingleImage(this.imageList[i])
            successCount++
          } catch (error) {
            console.error(`下载第 ${i + 1} 张图片失败:`, error)
            failCount++
          }
        }

        uni.hideLoading()

        if (failCount === 0) {
          uni.showToast({
            title: `全部保存成功(${successCount}张)`,
            icon: 'success',
            duration: 2000
          })
        } else {
          uni.showModal({
            title: '下载完成',
            content: `成功 ${successCount} 张，失败 ${failCount} 张`,
            showCancel: false
          })
        }
      } catch (error) {
        uni.hideLoading()
        console.error('下载失败:', error)
      } finally {
        this.downloading = false
      }
    },

    // 下载单张图片
    downloadSingleImage(imageUrl) {
      return new Promise((resolve, reject) => {
        uni.downloadFile({
          url: imageUrl,
          success: (res) => {
            if (res.statusCode === 200) {
              uni.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: () => {
                  resolve()
                },
                fail: (err) => {
                  console.error('保存图片失败:', err)
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
                  }
                  reject(err)
                }
              })
            } else {
              reject(new Error(`下载失败,状态码: ${res.statusCode}`))
            }
          },
          fail: (err) => {
            reject(err)
          }
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  min-height: 100vh;
  background: $bg-gradient;
  padding: 32rpx;
}

.content {
  padding-bottom: 32rpx;
}

// 瀑布流布局
.waterfall {
  display: flex;
  gap: 16rpx;

  .waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }
}

.image-wrapper {
  background: $bg-primary;
  border-radius: $card-radius;
  overflow: hidden;
  box-shadow: $card-shadow;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.98);
    opacity: 0.9;
  }

  .image-item {
    width: 100%;
    display: block;
  }
}

// 空状态
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;

  .empty-icon {
    font-size: 120rpx;
    margin-bottom: 32rpx;
    opacity: 0.6;
  }

  .empty-text {
    color: $text-secondary;
    font-size: 28rpx;
    margin-bottom: 48rpx;
  }

  .back-btn {
    padding: 24rpx 48rpx;
    background: linear-gradient(135deg, $primary, $primary-dark);
    color: $text-inverse;
    font-size: 28rpx;
    border-radius: 48rpx;
    box-shadow: $shadow-primary;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.8;
      transform: scale(0.95);
    }
  }
}

// 下载按钮
.download-btn {
  position: fixed;
  bottom: 48rpx;
  left: 50%;
  transform: translateX(-50%);
  padding: 28rpx 64rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: $text-inverse;
  font-size: 30rpx;
  font-weight: 600;
  border-radius: 56rpx;
  box-shadow: 0 8rpx 24rpx rgba(255, 20, 147, 0.4);
  display: flex;
  align-items: center;
  gap: 16rpx;
  transition: all 0.3s ease;
  z-index: 100;

  .download-icon {
    font-size: 32rpx;
  }

  .download-text {
    font-size: 28rpx;
  }

  &:active {
    opacity: 0.8;
    transform: translateX(-50%) scale(0.95);
  }
}
</style>
