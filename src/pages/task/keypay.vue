<template>
  <view class="page-container">
    <view class="card ios-card">
      <view class="card-title">卡密充值</view>

      <input
        v-model="cardKey"
        class="input-field"
        type="text"
        placeholder="请输入卡密"
        placeholder-class="placeholder"
      />

      <view class="submit-btn" @tap="handleSubmit">确认充值</view>
    </view>

    <view class="tips ios-card">
      <view class="tips-title">使用说明</view>
      <text class="tips-text">1. 输入获得的卡密\n2. 点击确认充值按钮\n3. 充值成功后可获得对应次数</text>
    </view>

    <!-- 自定义广告 -->
    <view v-if="userStore.sysConfig.spAd" class="ad-container">
      <ad-custom :unit-id="userStore.sysConfig.spAd" ad-intervals="30" />
    </view>
  </view>
</template>

<script>
import { keyPay } from '@/api'
import { useUserStore } from '@/stores'
import { showToast } from '@/utils'

export default {
  data() {
    return {
      cardKey: ''
    }
  },

  computed: {
    userStore() {
      return useUserStore()
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
    async handleSubmit() {
      if (!this.cardKey) {
        showToast('请输入卡密')
        return
      }

      try {
        const res = await keyPay({
          userId: this.userStore.userId,
          key: this.cardKey
        })

        console.log('卡密充值返回:', res)

        // 判断返回结果
        if (res && res.code === 200) {
          if (res.data === 1) {
            // 充值成功
            showToast('充值成功！', 'success')
            this.cardKey = ''

            setTimeout(() => {
              uni.navigateBack()
            }, 1500)
          } else if (res.data === 2) {
            showToast('该卡密已被使用')
          } else if (res.data === 3) {
            showToast('卡密不存在')
          } else {
            showToast(res.msg || '充值失败')
          }
        } else {
          showToast(res?.msg || '充值失败')
        }
      } catch (error) {
        console.error('充值失败:', error)
        showToast('充值失败,请稍后再试')
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

.card {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $card-shadow;

  .card-title {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 24rpx;
  }

  .input-field {
    width: 100%;
    height: 88rpx;
    background-color: $bg-secondary;
    border-radius: $button-radius;
    padding: 0 24rpx;
    font-size: 28rpx;
    color: $text-primary;
    margin-bottom: 24rpx;
    box-sizing: border-box;
  }

  .placeholder {
    color: $text-tertiary;
  }

  .submit-btn {
    height: 88rpx;
    border-radius: $button-radius;
    background: linear-gradient(135deg, $primary, $primary-dark);
    color: $text-inverse;
    font-size: 28rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: $shadow-primary;
    transition: all 0.3s ease;

    &:active {
      opacity: 0.7;
      transform: scale(0.98);
    }
  }
}

.tips {
  background-color: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  box-shadow: $card-shadow;

  .tips-title {
    font-size: 28rpx;
    font-weight: 600;
    color: $text-primary;
    margin-bottom: 16rpx;
  }

  .tips-text {
    font-size: 26rpx;
    color: $text-secondary;
    line-height: 1.8;
  }
}

/* 广告容器 */
.ad-container {
  margin-top: 24rpx;
  border-radius: $card-radius;
  overflow: hidden;
  background: $bg-primary;
  box-shadow: $card-shadow;
}
</style>
