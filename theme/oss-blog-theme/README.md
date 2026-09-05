# sdut-blog - 自定义 Ghost 主题

山东理工大学《开源软件与新技术》课程实验 - 基于 Casper 主题的二次开发。

## 主题特性

- 🎨 **4 种主题色**：科技蓝、活力橙、森林绿、优雅紫
- 🏷️ **标签导航栏**：首页快捷切换标签
- 📑 **文章目录**：自动生成文章目录导航
- 📊 **阅读进度条**：实时显示阅读进度
- 🔍 **搜索历史**：记录最近搜索内容
- ⬆️ **返回顶部**：一键返回顶部
- 📱 **响应式设计**：适配桌面和移动端
- 💬 **评论支持**：原生 Ghost 评论集成

## 基于 Casper 主题

本主题基于 Ghost 默认主题 Casper 进行二次开发，保留了 Casper 的核心功能和设计风格，并添加了上述自定义特性。

- 上游主题：[Casper](https://github.com/TryGhost/Casper)
- 上游许可证：MIT

## 安装方法

### 方法一：后台上传（推荐）

1. 进入 Ghost 管理后台 → Settings → Design
2. 点击 "Change theme"
3. 点击 "Upload theme"
4. 上传 `sdut-blog.zip` 文件
5. 点击 "Activate" 激活主题

### 方法二：手动安装

1. 将 `theme/oss-blog-theme/` 目录复制到 Ghost 的 `content/themes/` 目录下
2. 重命名目录为 `sdut-blog`
3. 进入 Ghost 管理后台 → Settings → Design
4. 找到 sdut-blog 主题并激活

## 主题设置

进入 Ghost 管理后台 → Settings → Design → "sdut-blog"，可以自定义以下选项：

- **显示标签导航**：在导航栏下方显示热门标签
- **显示文章目录**：在文章页右侧显示目录导航
- **显示阅读进度条**：页面顶部显示阅读进度
- **主题色**：科技蓝 / 活力橙 / 森林绿 / 优雅紫

## 目录结构

```
theme/oss-blog-theme/
├── package.json          # 主题配置
├── default.hbs           # 主布局模板
├── index.hbs             # 首页模板
├── post.hbs              # 文章详情模板
├── page.hbs              # 独立页面模板
├── tag.hbs               # 标签页模板
├── author.hbs            # 作者页模板
├── error.hbs             # 错误页模板
├── error-404.hbs         # 404 页面模板
├── partials/
│   ├── post-card.hbs     # 文章卡片组件
│   ├── lightbox.hbs      # 图片灯箱
│   └── icons/            # 图标集合
└── assets/
    ├── built/            # Casper 构建产物
    ├── css/
    │   └── custom.css    # 自定义样式
    └── js/
        └── custom.js     # 自定义脚本
```

## 二次开发说明

### 修改的文件

| 文件 | 修改内容 |
|------|---------|
| `default.hbs` | 添加标签导航、阅读进度条、自定义页脚 |
| `index.hbs` | 添加 Feed 标题和文章计数 |
| `post.hbs` | 添加目录、文章标签、自定义评论区 |
| `post-card.hbs` | 重新设计卡片样式 |
| `tag.hbs` | 标签页样式优化 |
| `author.hbs` | 作者页样式优化 |
| `error-404.hbs` | 自定义 404 页面 |
| `assets/css/custom.css` | 全部自定义样式 |
| `assets/js/custom.js` | 全部自定义脚本 |

### 新增功能实现位置

| 功能 | 实现位置 |
|------|---------|
| 标签导航 | `default.hbs` + `custom.css` |
| 阅读进度条 | `default.hbs` + `custom.js` |
| 文章目录 | `post.hbs` + `custom.js` |
| 搜索历史 | `custom.js` |
| 返回顶部 | `custom.js` |
| 主题色切换 | `package.json` + `custom.css` |

## 开发命令

```bash
# 测试主题兼容性
npx gscan .

# 打包主题（Windows PowerShell）
Compress-Archive -Path * -DestinationPath ../sdut-blog.zip
```

## 许可证

MIT License（与上游 Casper 主题一致）
