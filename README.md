# 无忧去水印小程序

> 基于 Uniapp + Vue 3 + Pinia 开发的 iOS 风格极简去水印小程序

## 🎯 项目概述

这是一个全新重构的去水印小程序，采用现代化的技术栈和 iOS 设计风格，提供优雅的用户体验。

### 技术栈

- **框架**: Uniapp CLI + Vue 3 (Composition API)
- **状态管理**: Pinia
- **UI组件**: uview-plus (iOS 风格)
- **网络请求**: luch-request (支持双后端)
- **样式**: SCSS (iOS 设计语言)
- **工具库**: dayjs
- **包管理**: pnpm

## 📦 已完成的基础架构

### ✅ 1. 项目初始化
- [x] Uniapp CLI 项目创建
- [x] 依赖安装 (pinia, luch-request, uview-plus, dayjs, sass)
- [x] ESLint + Prettier 配置

### ✅ 2. 环境配置
- [x] 双后端环境变量配置
  - Java后端: `https://java.xiaofeiwuuu.top` (默认)
  - Node后端: `https://node.xiaofeiwuuu.top` (待指定接口)
- [x] 开发/生产环境分离

### ✅ 3. 网络请求层
- [x] luch-request 封装
- [x] 支持双后端切换
- [x] 请求/响应拦截器
- [x] 统一错误处理
- [x] Loading 状态管理

### ✅ 4. API 接口层
所有 API 已封装完成：

**首页相关**
- `getLunList()` - 获取轮播图
- `delWatermark()` - 视频去水印
- `parseCommand()` - 口令解析
- `downloadVideo()` - 视频下载

**用户相关**
- `autoLoginWx()` - 微信自动登录
- `getUserInfo()` - 获取用户信息

**任务相关**
- `signIn()` - 用户签到
- `adAddNumber()` - 广告增加次数
- `keyPay()` - 卡密充值

**推荐相关**
- `getTjList()` - 推荐小程序列表
- `getInviteList()` - 邀请列表

### ✅ 5. 状态管理 (Pinia)

**userStore** - 用户状态
```javascript
{
  userId,
  openId,
  userName,
  signInTime,
  sysConfig: {
    fxTitle,    // 分享标题
    fxUrl,      // 分享图片
    cpAd,       // 插屏广告ID
    jlAd        // 激励视频广告ID
  }
}
```

**configStore** - 配置状态
```javascript
{
  analysisData,      // 解析数据
  interstitialAd,    // 插屏广告实例
  rewardedVideoAd    // 激励视频广告实例
}
```

### ✅ 6. 工具函数库

**storage.js** - 本地存储
- `setStorage()` / `getStorage()` / `removeStorage()` / `clearStorage()`

**auth.js** - 认证相关
- `wxLogin()` - 微信登录
- `getUserData()` - 获取用户数据
- `isLoggedIn()` - 登录状态检查
- `isSignedInToday()` - 今日签到检查

**index.js** - 通用工具
- `extractUrl()` - 提取URL
- `formatTime()` - 时间格式化
- `debounce()` / `throttle()` - 防抖/节流
- `navigateToMiniProgram()` - 跳转小程序
- `copyText()` / `getClipboardText()` - 剪贴板操作
- `showConfirm()` / `showToast()` - 提示框
- `previewImage()` - 图片预览

### ✅ 7. iOS 风格设计系统

**variables.scss** - 设计变量
```scss
// 颜色
$primary: #007AFF;          // iOS 蓝
$bg-primary: #FFFFFF;       // 纯白
$bg-secondary: #F2F2F7;     // 浅灰
$text-primary: #000000;     // 主文字
$text-secondary: #8E8E93;   // 次要文字

// 圆角
$card-radius: 16rpx;
$button-radius: 12rpx;

// 阴影
$card-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);

// 字体
$font-size-lg: 32rpx;
$font-weight-semibold: 600;
```

**mixins.scss** - SCSS 混入
- `ios-card()` - iOS 卡片样式
- `ios-button()` - iOS 按钮样式
- `text-ellipsis()` - 文本溢出
- `flex-center()` / `flex-between()` - Flex 布局
- `touchable()` - 触控反馈

**common.scss** - 通用样式
- 页面基础样式
- iOS 风格卡片/按钮/输入框
- 文字/间距/布局工具类

### ✅ 8. 页面路由配置

**pages.json** - 已配置所有页面
```
pages/
├── index/index              # 首页（去水印）
├── task/index               # 任务页
├── task/keypay              # 卡密充值
├── recommend/index          # 推荐页
├── recommend/invite         # 邀请列表
├── mine/index               # 我的
├── common/image             # 图片预览
└── common/video             # 视频播放
```

**TabBar** - iOS 风格
- 颜色: 未选中 `#8E8E93` / 选中 `#007AFF`
- 背景: 纯白 `#FFFFFF`
- 4个Tab: 去水印 / 任务 / 推荐 / 我的

### ✅ 9. 混入 (Mixins)
- **share.js** - 统一分享配置（支持分享给朋友和朋友圈）

## 📁 项目结构

```
wuyou-miniapp/
├── src/
│   ├── api/                    # API 接口层 ✅
│   │   ├── request.js          # 请求封装（双后端）
│   │   ├── home.js             # 首页接口
│   │   ├── user.js             # 用户接口
│   │   ├── task.js             # 任务接口
│   │   ├── recommend.js        # 推荐接口
│   │   └── index.js            # 统一导出
│   ├── stores/                 # Pinia 状态 ✅
│   │   ├── user.js             # 用户状态
│   │   ├── config.js           # 配置状态
│   │   └── index.js            # Store 入口
│   ├── utils/                  # 工具函数 ✅
│   │   ├── storage.js          # 本地存储
│   │   ├── auth.js             # 认证相关
│   │   └── index.js            # 通用工具
│   ├── styles/                 # 全局样式 ✅
│   │   ├── variables.scss      # iOS 设计变量
│   │   ├── mixins.scss         # SCSS 混入
│   │   └── common.scss         # 通用样式
│   ├── mixins/                 # Vue混入 ✅
│   │   └── share.js            # 分享配置
│   ├── components/             # 全局组件 ⏳
│   │   ├── WyCard/             # iOS 风格卡片
│   │   ├── WyButton/           # iOS 风格按钮
│   │   └── WyEmpty/            # 空状态
│   ├── pages/                  # 页面 ⏳
│   │   ├── index/              # 首页
│   │   ├── task/               # 任务页
│   │   ├── recommend/          # 推荐页
│   │   ├── mine/               # 我的
│   │   └── common/             # 公共页面
│   ├── App.vue                 # 应用入口
│   ├── main.js                 # 主入口 ✅
│   ├── manifest.json           # 应用配置
│   ├── pages.json              # 页面路由 ✅
│   └── uni.scss                # uni样式变量 ✅
├── .env.development            # 开发环境 ✅
├── .env.production             # 生产环境 ✅
├── package.json                # 依赖配置 ✅
├── vite.config.js              # Vite 配置
└── README.md                   # 项目文档

✅ = 已完成
⏳ = 待开发
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发运行

```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5
```

### 生产构建

```bash
# 微信小程序
pnpm build:mp-weixin
```

## 📝 下一步开发计划

### 1. 创建通用组件 (优先级：高)

**WyCard 组件** - iOS 风格卡片
```vue
<template>
  <view class="wy-card" :style="cardStyle">
    <slot></slot>
  </view>
</template>
```

**WyButton 组件** - iOS 风格按钮
```vue
<template>
  <view class="wy-button" :class="buttonClass" @tap="handleClick">
    <slot></slot>
  </view>
</template>
```

### 2. 完善页面开发 (优先级：高)

#### 首页 (pages/index/index.vue)
- [x] 轮播图展示
- [x] 输入框（支持粘贴）
- [x] 解析按钮
- [x] 微信自动登录
- [x] 插屏广告集成
- [ ] UI 细节优化

#### 任务页 (pages/task/index.vue)
- [ ] 签到卡片
- [ ] 签到状态判断
- [ ] 激励视频广告
- [ ] 卡密充值入口

#### 推荐页 (pages/recommend/index.vue)
- [ ] 小程序列表展示
- [ ] 跳转小程序功能
- [ ] 邀请入口

#### 我的页 (pages/mine/index.vue)
- [ ] 用户信息展示
- [ ] 功能入口

### 3. 通用页面 (优先级：中)

**图片预览** (pages/common/image.vue)
- [ ] 图片列表展示
- [ ] 图片预览
- [ ] 图片保存

**视频播放** (pages/common/video.vue)
- [ ] 视频播放
- [ ] 视频下载

### 4. 功能完善 (优先级：中)
- [ ] 错误边界处理
- [ ] 加载状态优化
- [ ] 空状态处理
- [ ] 网络异常处理

### 5. 测试和优化 (优先级：低)
- [ ] 微信开发者工具测试
- [ ] 真机测试
- [ ] 性能优化
- [ ] 用户体验优化

## 🎨 设计规范

### iOS 风格指南

1. **颜色**
   - 主色：iOS 蓝 #007AFF
   - 背景：纯白 + 浅灰
   - 文字：黑色层级

2. **圆角**
   - 卡片：16rpx
   - 按钮：12rpx
   - 小元素：8rpx

3. **间距**
   - 页面边距：32rpx
   - 元素间距：16rpx / 24rpx / 32rpx

4. **阴影**
   - 柔和阴影：`0 4rpx 16rpx rgba(0, 0, 0, 0.08)`

5. **字体**
   - 标题：32rpx / 600
   - 正文：28rpx / 400
   - 辅助：26rpx / 400

6. **交互**
   - 触控反馈：opacity 0.6
   - 动画：0.25s 缓动

## 🔧 配置说明

### 环境变量

**.env.development** (开发环境)
```env
VITE_JAVA_BASE_URL=https://java.xiaofeiwuuu.top
VITE_NODE_BASE_URL=https://node.xiaofeiwuuu.top
VITE_APP_USERNAME=admin
```

### 双后端使用

**默认使用 Java 后端:**
```javascript
import { getLunList } from '@/api'
const res = await getLunList() // 自动使用 Java 后端
```

**使用 Node 后端:**
```javascript
import { nodeHttp } from '@/api'
const res = await nodeHttp.request({
  url: '/api/xxxxx',
  method: 'GET'
})
```

### 需要指定的 Node 后端接口

请在后续开发中明确哪些接口需要调用 Node 后端，当前所有接口默认使用 Java 后端。

## 📱 广告集成

### 插屏广告（首页）
- 登录成功后 1 秒显示
- 广告ID来自 `sysConfig.cpAd`

### 激励视频广告（任务页）
- 用户主动点击观看
- 观看完成后调用 `adAddNumber` 增加次数
- 广告ID来自 `sysConfig.jlAd`

## 🤝 开发建议

1. **组件优先**：先开发通用组件（WyCard、WyButton），后开发页面
2. **样式复用**：使用 mixins 和工具类，保持风格统一
3. **错误处理**：每个 API 调用都要有 try-catch
4. **用户体验**：Loading、Toast、Empty 状态都要处理
5. **代码规范**：使用 ESLint 和 Prettier 格式化代码

## 📖 参考文档

- [Uniapp 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [uview-plus 文档](https://uview-plus.jiangruyi.com/)
- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)

## 📄 License

MIT

---

**开发者**: Claude AI
**创建时间**: 2025-10-07
**项目状态**: 基础架构完成，待页面开发
