# 项目架构说明

## 总体架构

```
┌─────────────────────────────────────────────────────────────────┐
│                        用户 / 访客                               │
└──────────┬──────────────────────────┬───────────────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────────┐   ┌──────────────────────┐
│   前台主题 (Casper)   │   │   Ghost Admin 后台   │
│  runtime/content/     │   │  管理文章/会员/设置   │
│  themes/              │   └──────────┬───────────┘
└──────────┬───────────┘              │
           │                          │
           └─────────────┬────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Ghost Core 核心服务  │
              │  runtime/versions/    │
              │  6.62.0/core/         │
              └──────────┬───────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
  ┌────────────┐  ┌────────────┐  ┌────────────┐
  │ Content API│  │  Admin API │  │ Members API│
  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  SQLite 数据库        │
              │  content/data/       │
              │  ghost-local.db      │
              └──────────────────────┘
```

## 目录结构说明

### 仓库根目录

| 目录/文件 | 说明 | 修改权限 |
|----------|------|---------|
| `docs/` | 实验文档（基线、架构、测试等） | ✅ 可修改 |
| `theme/` | 自定义主题源码（待创建） | ✅ 可修改 |
| `tests/` | 测试用例和脚本 | ✅ 可修改 |
| `runtime/` | Ghost 运行目录 | ⚠️ 谨慎修改 |
| `.gitignore` | Git 忽略规则 | ✅ 可修改 |
| `README.md` | 项目说明文档 | ✅ 可修改 |

### runtime/ 运行目录（Ghost 安装目录）

| 目录/文件 | 说明 | 修改权限 |
|----------|------|---------|
| `content/themes/` | 主题目录（Casper、Source） | ✅ 可安装新主题 |
| `content/data/ghost-local.db` | SQLite 数据库文件 | ❌ 禁止直接修改 |
| `content/images/` | 上传的图片文件 | ❌ 通过后台管理 |
| `content/logs/` | 运行日志 | ❌ 仅查看 |
| `content/public/` | 公共静态资源 | ⚠️ 谨慎修改 |
| `versions/6.62.0/` | Ghost 核心代码 | ❌ 禁止修改 |
| `config.development.json` | 开发环境配置 | ⚠️ 谨慎修改 |
| `.ghost-cli` | Ghost CLI 元数据 | ❌ 禁止修改 |

### Ghost 核心目录结构（versions/6.62.0/）

| 目录 | 说明 |
|------|------|
| `core/server/` | Ghost 服务端核心（Express、API、数据模型） |
| `core/shared/` | 共享工具模块 |
| `core/cli/` | CLI 命令工具 |
| `node_modules/` | 依赖包 |
| `components/` | Ghost 组件包（卡片、编辑器等） |

## 请求流程

```
用户请求
    │
    ▼
Express Web Server (core/server/ghost-server.js)
    │
    ├── 静态资源 → content/public/
    │
    ├── /ghost/ → Ghost Admin 管理后台
    │
    ├── /ghost/api/ → Admin API（需认证）
    │
    ├── /ghost/api/content/ → Content API（公开）
    │
    └── 前台页面 → 主题模板渲染
                    │
                    ├── 从数据库获取文章/标签/会员数据
                    ├── 使用 Handlebars 模板引擎渲染
                    └── 返回 HTML 页面
```

## 修改边界

### ✅ 允许修改的范围

1. **自定义主题** - `theme/` 目录下的主题源码
2. **Content API 扩展** - 通过主题调用 Content API
3. **文档和测试** - `docs/`、`tests/` 目录
4. **Git 配置** - `.gitignore`、README 等

### ❌ 禁止修改的范围

1. **Ghost 核心代码** - `runtime/versions/6.62.0/core/`
2. **数据库文件** - `runtime/content/data/ghost-local.db`
3. **配置文件中的敏感信息** - 密钥、密码等
4. **node_modules** - 依赖包目录

## 数据存储

| 数据类型 | 存储位置 | 说明 |
|---------|---------|------|
| 文章、页面、标签 | SQLite 数据库 | `posts`、`tags` 表 |
| 会员、评论 | SQLite 数据库 | `members`、`comments` 表 |
| 管理员用户 | SQLite 数据库 | `users` 表 |
| 上传图片 | 文件系统 | `content/images/YYYY/MM/` |
| 主题文件 | 文件系统 | `content/themes/<theme-name>/` |
| 配置设置 | SQLite 数据库 | `settings` 表 |

## API 接口

| API | 路径 | 认证 | 用途 |
|-----|------|------|------|
| Content API | `/ghost/api/content/` | Content API Key | 前台获取公开内容 |
| Admin API | `/ghost/api/admin/` | Staff 用户/Admin API Key | 后台管理操作 |
| Members API | `/ghost/api/members/` | 会员 Session | 会员登录、评论等 |

## 技术栈

- **后端**: Node.js + Express
- **数据库**: SQLite3（本地开发）
- **模板引擎**: Handlebars (主题)
- **前端**: 原生 JS + CSS（Casper 主题）
- **进程管理**: Ghost CLI (local 模式)
- **包管理器**: pnpm（Ghost 核心）
