# Bug 修复记录

## 已修复问题

### Bug #1: 首页文章计数为空
- **现象**: 首页标题下方显示"共 篇"，数字缺失
- **原因**: 错误使用了 @site.posts 变量，该变量在 Ghost 6.x 中已弃用
- **修复**: 使用 {{pagination.total}} 正确获取文章总数
- **文件**: index.hbs 第 36 行
- **修复 Commit**: ix(theme): fix pagination count and page context issues

### Bug #2: 标签页标题与计数为空
- **现象**: 标签页只显示 "#" 和 "共 篇文章"，标签名和文章数缺失
- **原因**: 缺少 {{#tag}} 上下文包裹，标签数据无法正确注入
- **修复**: 用 {{#tag}}...{{/tag}} 包裹标签标题和描述区域
- **文件**: 	ag.hbs
- **修复 Commit**: 同上

### Bug #3: 作者页标题与计数为空
- **现象**: 作者页头像和名称不显示，文章数为空
- **原因**: 缺少 {{#author}} 上下文包裹
- **修复**: 用 {{#author}}...{{/author}} 包裹作者信息区域
- **文件**: uthor.hbs
- **修复 Commit**: 同上

### Bug #4: JS 功能整体失效
- **现象**: 返回顶部按钮不显示、目录不生成、搜索历史不工作
- **原因**: 某个 init 函数执行报错导致后续所有初始化函数都中断
- **修复**: 封装 safeInit() 工具函数，每个功能用 try-catch 独立包裹
- **文件**: ssets/js/custom.js
- **修复 Commit**: ix(theme): improve JS fault tolerance and selector compatibility

### Bug #5: 文章目录不显示
- **现象**: 目录区域显示"本文暂无目录"，即使文章有标题
- **原因**: 选择器 .gh-content 在某些内容结构下不匹配
- **修复**: 增加多选择器降级方案，依次尝试 .gh-content、.post-content、rticle
- **文件**: ssets/js/custom.js - indContentElement()
- **修复 Commit**: 同上

### Bug #6: QQ 邮箱发送失败
- **现象**: 会员注册时提示"发送邮箱失败"，控制台报 501 错误
- **原因**: QQ 邮箱要求发件人地址必须与 SMTP 认证用户一致，默认配置缺失 from 字段
- **修复**: 在 config.development.json 的 mail 配置中添加 "from": "邮箱地址"
- **文件**: untime/config.development.json（不提交，配置示例见部署文档）

## 已知问题

### CDN 资源加载
- **现象**: 搜索弹窗、评论、会员登录等 Ghost 官方组件不工作
- **原因**: jsdelivr CDN 在国内访问不稳定，sodo-search 等组件加载失败
- **影响**: Ghost 原生搜索/评论/会员弹窗功能受限，主题自有功能不受影响
- **方案**: 生产环境可考虑替换为国内 CDN 或自托管相关资源
