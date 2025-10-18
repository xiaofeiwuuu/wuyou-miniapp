<template>
  <view class="page-container">
    <!-- 轮播图 -->
    <view v-if="swiperList.length > 0" class="swiper-section">
      <swiper
        class="swiper-banner"
        :indicator-dots="true"
        :autoplay="true"
        :interval="3000"
        :duration="500"
        indicator-color="rgba(0,0,0,0.3)"
        indicator-active-color="#ff69b4"
      >
        <swiper-item v-for="(item, index) in swiperList" :key="index">
          <image :src="item.showimg" class="swiper-image" mode="aspectFill" />
        </swiper-item>
      </swiper>
    </view>

    <!-- 跑马灯通知 -->
    <view v-if="noticeText" class="notice-bar ios-card">
      <view class="notice-icon">📢</view>
      <view class="notice-content">
        <view class="notice-text" :animation="animationData">{{ noticeText }}</view>
      </view>
    </view>

    <!-- 输入卡片 -->
    <view class="input-card ios-card">
      <view class="card-title">粘贴链接或口令</view>
      <view class="input-wrapper">
        <textarea
          v-model="inputText"
          class="input-area"
          placeholder="支持微信公众号、抖音、快手、小红书等平台..."
          placeholder-class="text-tertiary"
          :maxlength="-1"
          :auto-height="true"
        />
        <view v-if="inputText" class="clear-btn" @tap="handleClear">✕</view>
      </view>

      <view class="btn-group">
        <view class="btn-paste" @tap="handlePaste">粘贴</view>
        <view class="btn-parse" @tap="handleParse">开始解析</view>
      </view>
    </view>

    <!-- 使用说明 -->
    <view class="tips-card ios-card">
      <view class="tips-title">使用说明</view>
      <view class="tips-item">1. 复制视频链接或分享口令</view>
      <view class="tips-item">2. 粘贴到上方输入框</view>
      <view class="tips-item">3. 点击解析按钮获取无水印内容</view>
    </view>
  </view>
</template>

<script>
import { getLunList, delWatermark } from '@/api'
import { extractUrl, getClipboardText, showToast } from '@/utils'
import { wxLogin } from '@/utils/auth'
import { useUserStore } from '@/stores'

export default {
  data() {
    return {
      swiperList: [],
      inputText: '',
      noticeText: '', // 跑马灯公告内容
      animationData: null, // 跑马灯动画
      inviteUserId: '' // 邀请人ID
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    }
  },

  onLoad(options) {
    // 保存邀请人ID
    this.inviteUserId = options.userid || ''

    // 获取轮播图
    this.fetchSwiper()

    // 自动登录
    if (!this.userStore.isLogin) {
      this.autoLogin(this.inviteUserId)
    } else {
      // 已登录,直接显示公告
      this.updateNotice()
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
    // 获取轮播图
    async fetchSwiper() {
      try {
        const res = await getLunList()
        if (res && res.rows && res.rows.length > 0) {
          // 修复图片路径 - 添加完整域名
          const baseUrl = import.meta.env.VITE_JAVA_BASE_URL
          this.swiperList = res.rows.map(item => ({
            ...item,
            showimg: item.showimg.startsWith('http')
              ? item.showimg
              : `${baseUrl}${item.showimg}`
          }))
        }
      } catch (error) {
        console.error('获取轮播图失败:', error)
        // 设置默认轮播图
        this.swiperList = []
      }
    },

    // 自动登录
    async autoLogin(inviteUserId) {
      try {
        const userInfo = await wxLogin(inviteUserId)
        this.userStore.setUserInfo(userInfo)

        // 更新公告
        this.updateNotice()
      } catch (error) {
        console.error('自动登录失败:', error)
      }
    },

    // 更新公告内容
    updateNotice() {
      const { sysConfig } = this.userStore
      if (sysConfig && sysConfig.gg) {
        this.noticeText = sysConfig.gg
        // 启动跑马灯动画
        this.$nextTick(() => {
          this.startMarquee()
        })
      }
    },

    // 启动跑马灯动画
    startMarquee() {
      const animation = uni.createAnimation({
        duration: 10000, // 动画持续时间
        timingFunction: 'linear'
      })

      // 持续滚动
      const scroll = () => {
        animation.translateX(-300).step()
        this.animationData = animation.export()

        setTimeout(() => {
          animation.translateX(0).step({ duration: 0 })
          this.animationData = animation.export()
          setTimeout(scroll, 50)
        }, 10000)
      }

      scroll()
    },

    // 粘贴
    async handlePaste() {
      try {
        const text = await getClipboardText()
        if (text) {
          this.inputText = text
          showToast('粘贴成功', 'success')
        }
      } catch (error) {
        console.error('粘贴失败:', error)
      }
    },

    // 清空
    handleClear() {
      this.inputText = ''
    },

    // 解析
    async handleParse() {
      if (!this.inputText) {
        showToast('请输入链接或口令')
        return
      }

      const url = extractUrl(this.inputText)
      if (!url) {
        showToast('未找到有效的链接')
        return
      }

      if (!this.userStore.isLogin) {
        showToast('请先登录')
        return
      }

      // 检测是否是微信公众号链接
      const isWechatArticle = url.includes('mp.weixin.qq.com')

      console.log('解析参数:', {
        url,
        isWechatArticle,
        key: 'admin',
        openId: this.userStore.openId
      })

      try {
        // 如果是微信公众号链接,使用新接口
        if (isWechatArticle) {
          await this.parseWechatArticle(url)
        } else {
          // 其他平台使用原接口
          await this.parseOtherPlatform(url)
        }
      } catch (error) {
        console.error('解析失败详情:', error)
        showToast('解析失败,请检查网络或稍后再试')
      }
    },

    // 解析微信公众号文章
    async parseWechatArticle(url) {
      uni.showLoading({ title: '解析中...' })

      try {
        const serverUrl = 'https://node.xiaofeiwuuu.top'
        const response = await uni.request({
          url: `${serverUrl}/analyze/wechat`,
          method: 'POST',
          data: {
            url: url.trim()
          },
          header: {
            'Content-Type': 'application/json'
          }
        })

        uni.hideLoading()

        console.log('微信公众号解析返回:', response)

        if (response.statusCode === 200 && response.data) {
          const result = response.data

          if (result.code === 0 || result.code === 200 || result.success) {
            // 转换数据格式以适配现有页面
            const dataInfo = {
              code: 200,
              title: result.data.title || result.data.description || '无标题',
              img: result.data.image_list?.[0] || '',
              pics: result.data.image_list || [],
              url: result.data.video || '',
              msg: '解析成功'
            }

            // 存储解析数据
            uni.setStorageSync('analysisData', dataInfo)

            // 跳转
            if (dataInfo.pics && dataInfo.pics.length > 0) {
              uni.navigateTo({ url: '/pages/common/image' })
            } else if (dataInfo.url) {
              uni.navigateTo({ url: '/pages/common/video?is=1' })
            } else {
              showToast('未找到可下载的内容')
            }

            // 清空输入
            this.inputText = ''
          } else {
            showToast(result.message || result.msg || '解析失败')
          }
        } else {
          showToast('解析失败,请稍后重试')
        }
      } catch (error) {
        uni.hideLoading()
        console.error('微信公众号解析失败:', error)
        showToast('解析失败,请检查网络')
      }
    },

    // 解析其他平台
    async parseOtherPlatform(url) {
      const res = await delWatermark({
        url,
        key: 'admin',
        openId: this.userStore.openId
      })

      console.log('API返回原始数据:', res)

      if (res && res.msg) {
        const result = JSON.parse(res.msg)
        console.log('解析后的数据:', result)

        if (result.code === 200 && result.data && result.data.data_info) {
          const dataInfo = result.data.data_info

          if (dataInfo.code === 200) {
            // 存储解析数据
            uni.setStorageSync('analysisData', dataInfo)

            // 跳转
            if (dataInfo.pics && dataInfo.pics.length > 0) {
              uni.navigateTo({ url: '/pages/common/image' })
            } else {
              uni.navigateTo({ url: '/pages/common/video?is=1' })
            }

            // 清空
            this.inputText = ''
          } else {
            showToast(dataInfo.msg || '解析失败')
          }
        } else {
          showToast(result.msg || '解析失败')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page-container {
  min-height: 100vh;
  padding: 32rpx;
  background: $bg-gradient;
}

.swiper-section {
  margin-bottom: 24rpx;
}

.swiper-banner {
  width: 100%;
  height: 360rpx;
  border-radius: 16rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.swiper-image {
  width: 100%;
  height: 100%;
}

/* 跑马灯通知 */
.notice-bar {
  display: flex;
  align-items: center;
  padding: 20rpx 24rpx;
  margin-bottom: 24rpx;
  background: linear-gradient(135deg, #fff5f7 0%, #fffafc 100%);
  border: 2rpx solid $primary-light;
  border-radius: $radius-sm;
  overflow: hidden;
  box-shadow: 0 2rpx 12rpx rgba(255, 105, 180, 0.15);

  .notice-icon {
    font-size: 32rpx;
    margin-right: 16rpx;
    flex-shrink: 0;
  }

  .notice-content {
    flex: 1;
    overflow: hidden;
    height: 40rpx;
    line-height: 40rpx;
  }

  .notice-text {
    white-space: nowrap;
    font-size: 26rpx;
    color: $primary-dark;
    font-weight: 500;
  }
}

.input-card {
  margin-bottom: 24rpx;
  background: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  box-shadow: $card-shadow;

  .card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 24rpx;
  }

  .input-wrapper {
    position: relative;
    margin-bottom: 24rpx;
  }

  .input-area {
    width: 100%;
    min-height: 200rpx;
    max-height: 200rpx;
    background-color: $bg-tertiary;
    border-radius: $radius-sm;
    border: 2rpx solid $border-light;
    padding: 24rpx;
    font-size: 28rpx;
    color: $text-primary;
    box-sizing: border-box;
    overflow-y: auto;
  }

  .clear-btn {
    position: absolute;
    bottom: 24rpx;
    right: 24rpx;
    width: 48rpx;
    height: 48rpx;
    background-color: $text-tertiary;
    color: $text-inverse;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    transition: all 0.3s ease;
    z-index: 100;
    &:active {
      background-color: $text-secondary;
      transform: scale(0.9);
    }
  }

  .btn-group {
    display: flex;
    gap: 16rpx;
  }

  .btn-paste,
  .btn-parse {
    height: 88rpx;
    border-radius: $button-radius;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-paste {
    flex: 1;
    background-color: $bg-tertiary;
    color: $text-secondary;
    border: 2rpx solid $border-color;
  }

  .btn-parse {
    flex: 2;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    color: $text-inverse;
    box-shadow: $shadow-primary;
  }

  .btn-paste:active {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .btn-parse:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

.tips-card {
  background: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  box-shadow: $card-shadow;

  .tips-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16rpx;
  }

  .tips-item {
    font-size: 26rpx;
    color: $text-secondary;
    line-height: 2;
    padding-left: 8rpx;
  }
}
</style>
