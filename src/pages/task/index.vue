<template>
  <view class="page-container">
    <!-- 页面标题 -->
    <view class="page-header">
      <view class="page-title">每日任务</view>
      <view class="page-subtitle">完成任务获得额外奖励</view>
    </view>

    <!-- VIP 会员卡片 -->
    <view class="task-card ios-card vip-card">
      <view class="task-icon">👑</view>
      <view class="task-info">
        <view class="task-title">会员特权</view>
        <view class="task-desc">不限次数,免广告,尊贵的VIP标识</view>
      </view>
      <view class="task-action">
        <view class="action-btn vip-btn" @tap="goToRecharge">去开通</view>
      </view>
    </view>

    <!-- 邀请新用户 -->
    <view class="task-card ios-card">
      <view class="task-icon hot-tag">🔥</view>
      <view class="task-info">
        <view class="task-title">邀请新用户</view>
        <view class="task-desc">邀请一人奖励 {{ sysConfig.yqNumber }} 次</view>
      </view>
      <view class="task-action">
        <button class="action-btn" open-type="share">去邀请</button>
      </view>
    </view>

    <!-- 每日签到 -->
    <view class="task-card ios-card">
      <view class="task-icon daily-tag">📅</view>
      <view class="task-info">
        <view class="task-title">每日签到</view>
        <view class="task-desc">每日签到奖励 {{ sysConfig.qdNumber }} 次</view>
      </view>
      <view class="task-action">
        <view
          class="action-btn"
          :class="isSignedToday ? 'disabled-btn' : ''"
          @tap="handleSign"
        >
          {{ isSignedToday ? '已签到' : '去签到' }}
        </view>
      </view>
    </view>

    <!-- 看广告获取次数 -->
    <view class="task-card ios-card">
      <view class="task-icon ad-tag">📺</view>
      <view class="task-info">
        <view class="task-title">看广告获取次数</view>
        <view class="task-desc">每看一个广告奖励 1 次</view>
      </view>
      <view class="task-action">
        <view class="action-btn" @tap="handleWatchAd">看广告</view>
      </view>
    </view>

    <!-- 新人福利 -->
    <view class="task-card ios-card">
      <view class="task-icon gift-tag">🎁</view>
      <view class="task-info">
        <view class="task-title">新人福利</view>
        <view class="task-desc">首次登录赠送 {{ sysConfig.initialNumber }} 次</view>
      </view>
      <view class="task-action">
        <view class="action-btn disabled-btn">已完成</view>
      </view>
    </view>

    <!-- 自定义广告 -->
    <view v-if="sysConfig.spAd" class="ad-container">
      <ad-custom :unit-id="sysConfig.spAd" ad-intervals="30" />
    </view>
  </view>
</template>

<script>
import { signIn, adAddNumber } from '@/api'
import { useUserStore } from '@/stores'
import { showToast } from '@/utils'

export default {
  data() {
    return {
      rewardedVideoAd: null
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },

    sysConfig() {
      return this.userStore.sysConfig
    },

    isSignedToday() {
      return this.userStore.isSignedToday
    }
  },

  onLoad() {
    // 初始化激励视频广告
    this.initRewardedVideoAd()
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
    // 签到
    async handleSign() {
      if (this.isSignedToday) {
        showToast('今日已签到')
        return
      }

      try {
        const res = await signIn({
          userId: this.userStore.userId,
          userName: 'admin'
        })

        // 判断返回状态
        if (res && res.code === 200) {
          this.userStore.updateSignInTime()
          showToast('签到成功！', 'success')
        } else if (res && res.code === 500) {
          // 后端返回今天已签到
          showToast(res.msg || '今日已签到')
          this.userStore.updateSignInTime()
        } else {
          showToast(res?.msg || '签到失败')
        }
      } catch (error) {
        console.error('签到失败:', error)
        showToast('签到失败,请稍后再试')
      }
    },

    // 初始化激励视频广告
    initRewardedVideoAd() {
      // #ifdef MP-WEIXIN
      if (typeof wx !== 'undefined' && wx.createRewardedVideoAd) {
        const adUnitId = this.userStore.sysConfig.jlAd
        if (!adUnitId) return

        this.rewardedVideoAd = wx.createRewardedVideoAd({ adUnitId })

        this.rewardedVideoAd.onLoad(() => {
          console.log('激励视频广告加载成功')
        })

        this.rewardedVideoAd.onError((err) => {
          console.error('激励视频广告加载失败', err)
        })

        this.rewardedVideoAd.onClose((res) => {
          if (res && res.isEnded) {
            // 观看完成，增加次数
            this.addNumberAfterAd()
          }
        })
      }
      // #endif
    },

    // 观看广告
    handleWatchAd() {
      if (!this.rewardedVideoAd) {
        showToast('广告加载中，请稍后')
        return
      }

      this.rewardedVideoAd
        .show()
        .catch(() => {
          // 广告未加载完成，重新加载
          this.rewardedVideoAd
            .load()
            .then(() => this.rewardedVideoAd.show())
            .catch((err) => {
              console.error('广告显示失败', err)
              showToast('广告加载失败')
            })
        })
    },

    // 观看广告后增加次数
    async addNumberAfterAd() {
      try {
        await adAddNumber(this.userStore.userId)
        showToast('次数 +1', 'success')
      } catch (error) {
        console.error('增加次数失败:', error)
      }
    },

    // 跳转到充值页面
    goToRecharge() {
      uni.navigateTo({
        url: '/pages/task/keypay'
      })
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

/* 页面标题 */
.page-header {
  margin-bottom: 32rpx;

  .page-title {
    font-size: 48rpx;
    font-weight: 700;
    color: $text-primary;
    margin-bottom: 8rpx;
  }

  .page-subtitle {
    font-size: 26rpx;
    color: $text-secondary;
  }
}

/* 任务卡片 */
.task-card {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 28rpx 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $card-shadow;
  display: flex;
  align-items: center;
  gap: 24rpx;

  .task-icon {
    font-size: 48rpx;
    flex-shrink: 0;
  }

  .task-info {
    flex: 1;
    min-width: 0;

    .task-title {
      font-size: 30rpx;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 8rpx;
    }

    .task-desc {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }

  .task-action {
    flex-shrink: 0;

    .action-btn {
      padding: 16rpx 32rpx;
      border-radius: 20rpx;
      font-size: 26rpx;
      font-weight: 500;
      color: $text-inverse;
      background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
      text-align: center;
      border: none;
      line-height: 1.4;
      box-shadow: $shadow-primary;
      transition: all 0.3s ease;

      &::after {
        border: none;
      }

      &:active {
        opacity: 0.8;
        transform: scale(0.95);
      }
    }

    .vip-btn {
      background: linear-gradient(135deg, $accent 0%, darken($accent, 10%) 100%);
      box-shadow: 0 4rpx 16rpx rgba(255, 215, 0, 0.3);
    }

    .disabled-btn {
      background: $bg-secondary;
      color: $text-tertiary;
      box-shadow: none;
    }
  }
}

/* VIP 卡片特殊样式 */
.vip-card {
  background: linear-gradient(135deg, #fffaf0 0%, #fff5e1 100%);
  border: 2rpx solid $accent;
  box-shadow: 0 4rpx 20rpx rgba(255, 215, 0, 0.2);
}

/* 标签样式 */
// .hot-tag::before {
//   content: 'HOT';
//   position: absolute;
//   top: -8rpx;
//   right: -8rpx;
//   background: linear-gradient(135deg, $error 0%, darken($error, 10%) 100%);
//   color: $text-inverse;
//   font-size: 20rpx;
//   padding: 4rpx 8rpx;
//   border-radius: 8rpx;
//   box-shadow: 0 2rpx 8rpx rgba(244, 67, 54, 0.3);
// }

.daily-tag,
.ad-tag,
.gift-tag {
  position: relative;
}

.ios-card {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $card-shadow;
}

/* 广告容器 */
.ad-container {
  margin-top: 32rpx;
  border-radius: $card-radius;
  overflow: hidden;
  background: $bg-primary;
  box-shadow: $card-shadow;
}
</style>
