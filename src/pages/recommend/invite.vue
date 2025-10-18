<template>
  <view class="page-container">
    <!-- 邀请列表 -->
    <view class="invite-list">
      <view class="list-title">邀请记录</view>

      <view v-if="inviteList.length > 0" class="list-content">
        <view v-for="(item, index) in inviteList" :key="index" class="invite-item ios-card">
          <view class="item-info">
            <text class="item-name">用户{{ item.userId || index + 1 }}</text>
            <text class="item-time">{{ formatTime(item.createTime) }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty">
        <text>暂无邀请记录</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getInviteList } from '@/api'
import { useUserStore } from '@/stores'
import { formatTime } from '@/utils'

export default {
  data() {
    return {
      inviteList: []
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    }
  },

  onLoad() {
    this.fetchInviteList()
  },

  methods: {
    // 获取邀请列表
    async fetchInviteList() {
      try {
        const res = await getInviteList(this.userStore.userId)
        if (res && res.rows) {
          this.inviteList = res.rows
        }
      } catch (error) {
        console.error('获取邀请列表失败:', error)
      }
    },

    formatTime(time) {
      return formatTime(time, 'YYYY-MM-DD')
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

.invite-list {
  .list-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16rpx;
  }

  .list-content {
    .invite-item {
      background-color: $bg-primary;
      border-radius: $card-radius;
      padding: 24rpx 32rpx;
      margin-bottom: 16rpx;
      box-shadow: $card-shadow;
      transition: all 0.3s ease;

      &:active {
        opacity: 0.7;
        transform: scale(0.98);
      }

      .item-info {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .item-name {
          font-size: 28rpx;
          font-weight: 500;
          color: $text-primary;
        }

        .item-time {
          font-size: 24rpx;
          color: $text-secondary;
        }
      }
    }
  }

  .empty {
    padding: 120rpx 0;
    text-align: center;
    font-size: 28rpx;
    color: $text-tertiary;
  }
}
</style>
