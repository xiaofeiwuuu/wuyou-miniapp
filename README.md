# 无忧去水印小程序

> 基于 Uniapp + Vue 3 + Pinia 开发的 iOS 风格极简去水印小程序

## ✨ 项目特色

- 🎨 **iOS 极简设计** - 纯白配色、柔和圆角、优雅交互
- ⚡ **现代化技术栈** - Vue 3 Composition API + Pinia + uview-plus
- 🔧 **双后端支持** - 灵活切换 Java/Node 后端
- 📱 **完整功能** - 视频去水印、签到、广告、推荐、邀请
- 💎 **高质量代码** - 规范注释、模块化设计、易于维护

## 🚀 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 8
- 微信开发者工具

### 安装依赖

```bash
pnpm install
```

### 配置后端地址

复制环境变量文件并修改为你的后端地址:

```bash
# 修改 .env.development 和 .env.production
VITE_JAVA_BASE_URL=https://your-java-api.com
VITE_NODE_BASE_URL=https://your-node-api.com
VITE_APP_USERNAME=admin
```

### 运行项目

```bash
# 微信小程序
pnpm dev:mp-weixin

# H5
pnpm dev:h5
```

### 生产构建

```bash
pnpm build:mp-weixin
```

## 📁 项目结构

```
wuyou-miniapp/
├── src/
│   ├── api/                # API 接口层
│   │   ├── request.js      # 网络请求封装(双后端)
│   │   ├── home.js         # 首页接口
│   │   ├── user.js         # 用户接口
│   │   ├── task.js         # 任务接口
│   │   └── recommend.js    # 推荐接口
│   ├── stores/             # Pinia 状态管理
│   │   ├── user.js         # 用户状态
│   │   └── config.js       # 配置状态
│   ├── utils/              # 工具函数
│   │   ├── storage.js      # 本地存储
│   │   ├── auth.js         # 认证相关
│   │   └── index.js        # 通用工具
│   ├── styles/             # 全局样式
│   │   ├── variables.scss  # iOS 设计变量
│   │   ├── mixins.scss     # SCSS 混入
│   │   └── common.scss     # 通用样式
│   ├── mixins/             # Vue 混入
│   │   └── share.js        # 分享配置
│   └── pages/              # 页面
│       ├── index/          # 首页(去水印)
│       ├── task/           # 任务页
│       ├── recommend/      # 推荐页
│       ├── mine/           # 我的
│       └── common/         # 公共页面
├── .env.development        # 开发环境变量
├── .env.production         # 生产环境变量
└── package.json
```

## 🎯 核心功能

### 1. 视频去水印

- 支持链接输入和粘贴
- 视频解析和下载
- 图片/视频预览

### 2. 用户系统

- 微信自动登录
- 用户信息管理
- 状态持久化

### 3. 任务系统

- 每日签到
- 激励视频广告
- 卡密充值

### 4. 推荐系统

- 小程序推荐
- 邀请好友
- 邀请记录

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Uniapp CLI + Vue 3 |
| 状态管理 | Pinia |
| UI 组件 | uview-plus |
| 网络请求 | luch-request |
| 样式 | SCSS |
| 工具库 | dayjs |
| 包管理 | pnpm |

## 🎨 设计规范

### 颜色

```scss
$primary: #007AFF;          // iOS 蓝
$bg-primary: #FFFFFF;       // 纯白
$bg-secondary: #F2F2F7;     // 浅灰
$text-primary: #000000;     // 主文字
$text-secondary: #8E8E93;   // 次要文字
```

### 圆角

- 卡片: 16rpx
- 按钮: 12rpx
- 小元素: 8rpx

### 间距

- 页面边距: 32rpx
- 元素间距: 16rpx / 24rpx / 32rpx

## 📱 API 接口

### 首页接口

- `getLunList()` - 获取轮播图
- `delWatermark()` - 视频去水印
- `parseCommand()` - 口令解析
- `downloadVideo()` - 视频下载

### 用户接口

- `autoLoginWx()` - 微信自动登录
- `getUserInfo()` - 获取用户信息

### 任务接口

- `signIn()` - 用户签到
- `adAddNumber()` - 广告增加次数
- `keyPay()` - 卡密充值

### 推荐接口

- `getTjList()` - 推荐小程序列表
- `getInviteList()` - 邀请列表

## 🔧 双后端配置

### Java 后端 (默认)

```javascript
import { getLunList } from '@/api'
const res = await getLunList() // 自动使用 Java 后端
```

### Node 后端

```javascript
import { nodeHttp } from '@/api'
const res = await nodeHttp.request({
  url: '/api/xxxxx',
  method: 'GET'
})
```

## 📱 广告集成

### 插屏广告

在首页登录成功后 1 秒显示，广告 ID 通过后端返回

```javascript
sysConfig.cpAd // 插屏广告ID
```

### 激励视频广告

在任务页点击观看，观看完成增加解析次数

```javascript
sysConfig.jlAd // 激励视频广告ID
```

## 🔍 主要工具函数

### 本地存储

```javascript
import { setStorage, getStorage, removeStorage } from '@/utils/storage'
```

### 认证相关

```javascript
import { wxLogin, isLoggedIn, isSignedInToday } from '@/utils/auth'
```

### 通用工具

```javascript
import {
  extractUrl,
  formatTime,
  debounce,
  throttle,
  copyText,
  getClipboardText,
  showToast,
  previewImage
} from '@/utils'
```

## 🎯 开发建议

1. **样式复用** - 使用 SCSS mixins 保持风格统一
2. **错误处理** - 每个 API 调用都应有 try-catch
3. **用户体验** - 处理 Loading、Toast、Empty 状态
4. **代码规范** - 使用 ESLint + Prettier 格式化
5. **模块化** - 保持代码清晰、易维护

## 📖 参考文档

- [Uniapp 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 官方文档](https://cn.vuejs.org/)
- [Pinia 官方文档](https://pinia.vuejs.org/zh/)
- [uview-plus 文档](https://uview-plus.jiangruyi.com/)
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/)

## 🐛 常见问题

### 样式不生效

检查 `uni.scss` 是否正确导入全局样式:

```scss
@import '@/styles/variables.scss';
@import '@/styles/mixins.scss';
@import '@/styles/common.scss';
```

### API 请求失败

1. 检查 `.env` 文件中的后端地址
2. 微信开发者工具启用"不校验合法域名"
3. 检查网络连接

### Pinia 状态丢失

状态会自动持久化到本地存储，确保在 `App.vue` 或页面 `onMounted` 中调用:

```javascript
const userStore = useUserStore()
userStore.restoreUserInfo()
```

## 📄 License

MIT

---

**开发时间**: 2025
**技术栈**: Uniapp + Vue 3 + Pinia
**设计风格**: iOS 极简高级风
