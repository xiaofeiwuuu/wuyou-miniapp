<template>
  <view class="container">
    <view class="help-content">
      <!-- 支持平台 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">📱</view>
          <text class="title-text">支持哪些平台？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          目前支持：微信公众号、抖音、快手、小红书、微博、B站、微视、火山、头条、梨视频、美拍、陌陌、皮皮搞笑、皮皮虾、全民搞笑、刷宝、小咖秀、最右、秒拍等主流平台。
        </view>
      </view>

      <!-- 如何去水印 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">✨</view>
          <text class="title-text">如何去水印？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          <view class="step">
            <text class="step-num">1.</text>
            <text class="step-text">打开需要去水印的APP，找到分享按钮点击分享，选择"复制链接"。</text>
          </view>
          <view class="step">
            <text class="step-num">2.</text>
            <text class="step-text">打开本程序会自动获取到复制的链接，点击粘贴，然后点击解析就可以获取无水印内容了。</text>
          </view>
        </view>
      </view>

      <!-- 为什么还有水印 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">❓</view>
          <text class="title-text">为什么解析后还有水印？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          请检查APP中原作者上传的视频本身是否有水印，如果视频本身有水印（如相机自带、后期添加等）暂时无法去除，抱歉！
        </view>
      </view>

      <!-- 无法下载 -->
      <!-- <view class="help-item">
        <view class="help-title">
          <view class="title-icon">⬇️</view>
          <text class="title-text">为什么无法下载？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          <view class="desc-block">
            如果视频大于10M，小程序可能无法直接下载，可以通过以下方式：
          </view>
          <view class="tip">
            <text class="tip-label">iOS用户：</text>
            <text class="tip-text">建议使用 [Documents] 或 [捷径] 下载视频（App Store下载）</text>
          </view>
          <view class="tip">
            <text class="tip-label">安卓用户：</text>
            <text class="tip-text">建议使用QQ浏览器或其他浏览器下载</text>
          </view>
        </view>
      </view> -->

      <!-- 是否扣次数 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">💰</view>
          <text class="title-text">解析失败会扣次数吗？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          <view class="desc-block">不会的，请放心使用。</view>
          <view class="desc-block">
            如果由于系统异常导致的错误扣次数，您可联系客服为您补偿解析次数。
          </view>
        </view>
      </view>

      <!-- 次数获取 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">🎁</view>
          <text class="title-text">如何获得更多次数？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          <view class="gain-item">
            <text class="gain-icon">📅</text>
            <text class="gain-text">每日签到可获得 {{ sysConfig.qdNumber }} 次</text>
          </view>
          <view class="gain-item">
            <text class="gain-icon">👥</text>
            <text class="gain-text">邀请好友可获得 {{ sysConfig.yqNumber }} 次</text>
          </view>
          <view class="gain-item">
            <text class="gain-icon">📺</text>
            <text class="gain-text">观看广告可获得 1 次</text>
          </view>
          <view class="gain-item">
            <text class="gain-icon">🎁</text>
            <text class="gain-text">卡密充值可获得对应次数</text>
          </view>
          <view class="gain-item">
            <text class="gain-icon">👑</text>
            <text class="gain-text">开通VIP会员享受无限次数</text>
          </view>
        </view>
      </view>

      <!-- 联系客服 -->
      <view class="help-item">
        <view class="help-title">
          <view class="title-icon">💬</view>
          <text class="title-text">遇到问题怎么办？</text>
        </view>
        <view class="divider"></view>
        <view class="help-desc">
          <view class="desc-block">如有任何疑问，请点击下方按钮联系客服，我们将第一时间为您解决。</view>
          <button class="contact-btn" open-type="contact">联系客服</button>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/stores'

export default {
  computed: {
    userStore() {
      return useUserStore()
    },
    sysConfig() {
      return this.userStore.sysConfig
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

.container {
  min-height: 100vh;
  background: $bg-gradient;
  padding: 32rpx;
}

.help-content {
  padding-bottom: 32rpx;
}

.help-item {
  background: $bg-primary;
  border-radius: $card-radius;
  padding: 32rpx;
  margin-bottom: 24rpx;
  box-shadow: $card-shadow;
}

.help-title {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;

  .title-icon {
    font-size: 40rpx;
    margin-right: 12rpx;
  }

  .title-text {
    font-size: 32rpx;
    font-weight: 600;
    color: $text-primary;
  }
}

.divider {
  height: 2rpx;
  background: linear-gradient(90deg, $primary 0%, transparent 100%);
  margin-bottom: 24rpx;
  opacity: 0.3;
}

.help-desc {
  font-size: 28rpx;
  line-height: 1.8;
  color: $text-secondary;
}

// 步骤样式
.step {
  display: flex;
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .step-num {
    color: $primary;
    font-weight: 600;
    margin-right: 8rpx;
    flex-shrink: 0;
  }

  .step-text {
    flex: 1;
  }
}

// 描述块
.desc-block {
  margin-bottom: 16rpx;

  &:last-child {
    margin-bottom: 0;
  }
}

// 提示样式
.tip {
  display: flex;
  align-items: flex-start;
  padding: 16rpx;
  background: $bg-tertiary;
  border-radius: $radius-sm;
  margin-bottom: 12rpx;

  &:last-child {
    margin-bottom: 0;
  }

  .tip-label {
    color: $primary;
    font-weight: 600;
    margin-right: 8rpx;
    flex-shrink: 0;
  }

  .tip-text {
    flex: 1;
    color: $text-secondary;
  }
}

// 获取次数样式
.gain-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  background: linear-gradient(135deg, #fff5f7 0%, #fffafc 100%);
  border-radius: $radius-sm;
  margin-bottom: 12rpx;
  border-left: 4rpx solid $primary;

  &:last-child {
    margin-bottom: 0;
  }

  .gain-icon {
    font-size: 32rpx;
    margin-right: 12rpx;
  }

  .gain-text {
    flex: 1;
    font-size: 28rpx;
    color: $text-primary;
    font-weight: 500;
  }
}

// 联系客服按钮
.contact-btn {
  width: 100%;
  height: 88rpx;
  background: linear-gradient(135deg, $primary, $primary-dark);
  color: $text-inverse;
  font-size: 28rpx;
  font-weight: 500;
  border-radius: $button-radius;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24rpx;
  box-shadow: $shadow-primary;
  border: none;
  line-height: 88rpx;

  &::after {
    border: none;
  }

  &:active {
    opacity: 0.8;
    transform: scale(0.98);
  }
}
</style>
