# NOTICE

本项目基于以下开源项目进行二次开发，在此对原作者表示感谢。

## 上游项目

### Ghost
- 项目名称: Ghost
- 版本: 6.62.0
- 仓库: https://github.com/TryGhost/Ghost
- 许可证: MIT License
- 用途: 博客系统核心平台

### Casper Theme
- 项目名称: Casper (Ghost 官方默认主题)
- 仓库: https://github.com/TryGhost/Casper
- 许可证: MIT License
- 用途: 自定义主题 sdut-blog 的开发基础

## 第三方资源

### 字体
- 项目使用系统默认字体，未嵌入第三方字体

### 图标
- 使用 SVG 内联图标，来源于主题自身定义

## 本项目修改说明

本项目在 Ghost + Casper 主题的基础上进行了以下二次开发：

1. 自定义主题 sdut-blog
   - 4 种主题色切换配置
   - 标签导航栏
   - 文章目录（TOC）
   - 阅读进度条
   - 搜索历史记录
   - 返回顶部按钮
   - 响应式优化
   - 文章卡片样式重设计

2. 自主功能：搜索增强
   - 最近搜索历史记录（localStorage）
   - 多版本搜索组件兼容

以上修改均位于主题层（content/themes/sdut-blog/），未修改 Ghost 核心代码。

## 许可证

本项目整体采用 MIT License，与上游项目保持兼容。

完整许可证文本请参见 [LICENSE](LICENSE) 文件。
