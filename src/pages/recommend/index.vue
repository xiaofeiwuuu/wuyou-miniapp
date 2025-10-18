<template>
  <view class="page-container">
    <!-- 推荐小程序列表 -->
    <view class="mini-list">
      <view
        v-for="(item, index) in validMiniList"
        :key="index"
        class="mini-item ios-card"
        @tap="navigateToMini(item)"
      >
        <image
          v-if="item.appImg"
          :src="getImageUrl(item.appImg)"
          class="mini-image"
          mode="aspectFill"
        />
        <view class="mini-info">
          <text class="mini-title">{{ item.appTitle }}</text>
          <text class="mini-desc">{{ item.appMs }}</text>
        </view>
        <text class="arrow">›</text>
      </view>
    </view>

    <!-- 空状态 -->
    <view v-if="validMiniList.length === 0 && !isLoading" class="empty-state">
      <text class="empty-text">暂无推荐内容</text>
    </view>

    <!-- 自定义广告 -->
    <view v-if="userStore.sysConfig.spAd" class="ad-container">
      <ad-custom :unit-id="userStore.sysConfig.spAd" ad-intervals="30" />
    </view>
  </view>
</template>

<script>
import { getTjList } from '@/api'
import { useUserStore } from '@/stores'
import { navigateToMiniProgram } from '@/utils'

export default {
  data() {
    return {
      miniProgramList: [],
      isLoading: false
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    },

    // 过滤出有效的小程序列表
    validMiniList() {
      return this.miniProgramList.filter((item) => {
        // 必须同时有 appId 和 appUrl 才显示
        return item.appId && item.appUrl && item.appTitle
      })
    }
  },

  onLoad() {
    this.fetchMiniList()
  },

  onShareAppMessage() {
    const { sysConfig, userId } = this.userStore
    return {
      title: sysConfig.fxTitle || '无忧去水印',
      imageUrl: sysConfig.fxUrl || '',
      path: `/pages/index/index?userid=${userId}`
    }
  },

  methods: {
    // 获取推荐列表
    async fetchMiniList() {
      this.isLoading = true
      try {
        const res = await getTjList(this.userStore.userName)
        if (res && res.rows) {
          this.miniProgramList = res.rows
        }
      } catch (error) {
        console.error('获取推荐列表失败:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 获取完整图片地址
    getImageUrl(imgPath) {
      if (!imgPath) return ''
      // 如果已经是完整URL,直接返回
      if (imgPath.startsWith('http')) {
        return imgPath
      }
      // 否则拼接后端域名
      const baseUrl = import.meta.env.VITE_JAVA_BASE_URL
      return `${baseUrl}${imgPath}`
    },

    // 跳转小程序
    navigateToMini(item) {
      if (item.appId && item.appUrl) {
        navigateToMiniProgram(item.appId, item.appUrl)
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

.mini-list {
  margin-bottom: 24rpx;
}

.mini-item {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 24rpx;
  margin-bottom: 16rpx;
  box-shadow: $card-shadow;
  display: flex;
  align-items: center;
  gap: 24rpx;
  transition: all 0.3s ease;

  &:active {
    opacity: 0.7;
    transform: scale(0.98);
  }

  .mini-image {
    width: 160rpx;
    height: 120rpx;
    border-radius: $radius-sm;
    flex-shrink: 0;
    background-color: $bg-tertiary;
  }

  .mini-info {
    flex: 1;
    min-width: 0;

    .mini-title {
      display: block;
      font-size: 30rpx;
      font-weight: 600;
      color: $text-primary;
      margin-bottom: 12rpx;
    }

    .mini-desc {
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 24rpx;
      color: $text-secondary;
      line-height: 1.5;
    }
  }

  .arrow {
    font-size: 48rpx;
    color: $primary;
    flex-shrink: 0;
  }
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;

  .empty-text {
    font-size: 28rpx;
    color: $text-tertiary;
  }
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
