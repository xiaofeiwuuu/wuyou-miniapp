<template>
  <view class="page-container">
    <!-- 用户信息卡片 -->
    <view class="user-card ios-card">
      <view class="user-header">
        <!-- 头像 -->
        <view class="avatar">
          <image :src="avatarUrl" class="avatar-image" mode="aspectFill" />
        </view>

        <view class="user-info">
          <view class="user-name-row">
            <text class="username">{{ userName }}</text>

            <view v-if="isVip" class="vip-badge">
              <text class="vip-text">VIP</text>
            </view>
            <view class="normal-badge" v-else>
              <text class="normal-text">普通用户</text>
            </view>
          </view>
          <text class="user-id">UID: {{ userId }}</text>
        </view>
      </view>

      <!-- 用户状态信息 -->
      <view class="user-status">
        <view v-if="isVip" class="status-item">
          <text class="status-label">会员有效期</text>
          <text class="status-value">{{ formatExpireTime }}</text>
        </view>
        <view v-else class="status-item">
          <text class="status-label">剩余解析次数</text>
          <text class="status-value status-number">{{ syNumber }}</text>
        </view>
      </view>
    </view>

    <!-- 功能列表 -->
    <view class="menu-list">
      <view class="menu-item ios-card" @tap="goToRedeem">
        <view class="menu-content">
          <text class="menu-icon">🎁</text>
          <text class="menu-title">卡密兑换</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <view class="menu-item ios-card" @tap="goToInvite">
        <view class="menu-content">
          <text class="menu-icon">👥</text>
          <text class="menu-title">邀请好友</text>
        </view>
        <text class="arrow">›</text>
      </view>

      <button class="menu-item ios-card menu-button" open-type="contact">
        <view class="menu-content">
          <text class="menu-icon">💬</text>
          <text class="menu-title">联系客服</text>
        </view>
        <text class="arrow">›</text>
      </button>

      <view class="menu-item ios-card" @tap="goToHelp">
        <view class="menu-content">
          <text class="menu-icon">📖</text>
          <text class="menu-title">使用教程</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores'
import { getUserInfo } from '@/api'

export default {
  computed: {
    userStore() {
      return useUserStore()
    },

    // 默认头像 API
    avatarUrl() {
      return 'https://v2.api-m.com/api/head?return=302'
    },

    userName() {
      return this.userStore.userName || '微信用户'
    },

    userId() {
      return this.userStore.userId || '未登录'
    },

    isVip() {
      return this.userStore.isVip === 1
    },

    syNumber() {
      return this.userStore.syNumber || 0
    },

    formatExpireTime() {
      const dqTime = this.userStore.dqTime
      if (!dqTime) return '永久有效'

      // 格式化日期: 2030-09-30T00:00:00.000+08:00 -> 2030-09-30
      try {
        const date = new Date(dqTime)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      } catch (e) {
        return dqTime.split('T')[0] || dqTime
      }
    }
  },

  onShow() {
    // 每次进入页面时刷新用户信息
    this.refreshUserInfo()
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
    // 刷新用户信息
    async refreshUserInfo() {
      if (!this.userStore.userId) {
        console.log('用户未登录,跳过刷新')
        return
      }

      try {
        const res = await getUserInfo(this.userStore.userId)

        if (res && res.code === 200 && res.data) {
          // 更新用户信息到 store
          this.userStore.setUserInfo({
            ...this.userStore.$state,
            ...res.data
          })
          console.log('用户信息刷新成功:', res.data)
        }
      } catch (error) {
        console.error('刷新用户信息失败:', error)
      }
    },

    // 跳转使用教程页面
    goToHelp() {
      uni.navigateTo({
        url: '/pages/common/help'
      })
    },

    // 跳转邀请页面
    goToInvite() {
      uni.navigateTo({
        url: '/pages/recommend/invite'
      })
    },

    // 跳转卡密充值页面
    goToRedeem() {
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

.user-card {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $card-shadow;
}

.user-header {
  display: flex;
  align-items: center;

  .avatar {
    width: 120rpx;
    height: 120rpx;
    border-radius: 60rpx;
    margin-right: 24rpx;
    flex-shrink: 0;
    overflow: hidden;
    box-shadow: 0 4rpx 16rpx rgba(255, 105, 180, 0.3);

    .avatar-image {
      width: 100%;
      height: 100%;
    }
  }

  .user-info {
    flex: 1;

    .user-name-row {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      gap: 12rpx;
    }

    .username {
      font-size: 32rpx;
      font-weight: 600;
      color: $text-primary;
    }

    .vip-badge {
      background: linear-gradient(135deg, $accent, darken($accent, 10%));
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      box-shadow: 0 2rpx 8rpx rgba(255, 215, 0, 0.3);

      .vip-text {
        font-size: 20rpx;
        font-weight: 600;
        color: $text-inverse;
      }
    }

    .normal-badge {
      background: linear-gradient(135deg, $primary, $primary-dark);
      padding: 4rpx 12rpx;
      border-radius: 8rpx;
      display: flex;
      align-items: center;
      box-shadow: $shadow-primary;

      .normal-text {
        font-size: 20rpx;
        font-weight: 500;
        color: $text-inverse;
      }
    }

    .user-id {
      font-size: 24rpx;
      color: $text-secondary;
    }
  }
}

/* 用户状态信息 */
.user-status {
  margin-top: 24rpx;
  padding-top: 24rpx;
  border-top: 1rpx solid $border-light;

  .status-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .status-label {
      font-size: 26rpx;
      color: $text-secondary;
    }

    .status-value {
      font-size: 28rpx;
      font-weight: 600;
      color: $text-primary;
    }

    .status-number {
      color: $primary;
      font-size: 36rpx;
      font-weight: 700;
    }
  }
}

.menu-list {
  .menu-item {
    background-color: $bg-primary;
    border-radius: $card-radius;
    padding: 32rpx;
    margin-bottom: 16rpx;
    box-shadow: $card-shadow;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.7;
      transform: scale(0.98);
    }

    .menu-content {
      display: flex;
      align-items: center;

      .menu-icon {
        font-size: 40rpx;
        margin-right: 16rpx;
      }

      .menu-title {
        font-size: 28rpx;
        color: $text-primary;
      }
    }

    .arrow {
      font-size: 48rpx;
      color: $primary;
    }
  }

  /* 按钮样式重置 */
  .menu-button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 32rpx;
    margin: 0 0 16rpx 0;
    line-height: inherit;
    text-align: left;
    background-color: $bg-primary;
    border-radius: $card-radius;
    box-shadow: $card-shadow;
    border: none;
    transition: all 0.3s ease;

    &::after {
      border: none;
    }

    &:active {
      opacity: 0.7;
      transform: scale(0.98);
    }
  }
}
</style>
