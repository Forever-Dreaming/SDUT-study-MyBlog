# 部署文档

本文档详细说明 SDUT Study Blog 的本地开发与生产环境部署方法。

## 环境要求

| 软件 | 最低版本 | 推荐版本 | 说明 |
|------|---------|---------|------|
| Node.js | >= 22.12.0 | 22.x LTS | Ghost 6.x 要求 Node 22+ |
| Ghost CLI | 最新版 | 最新版 | 用于安装、启动、管理 Ghost |
| npm / pnpm | 随 Node 安装 | pnpm 9+ | 包管理器 |
| 操作系统 | - | Windows 10+ / macOS 12+ / Ubuntu 22.04+ | 全平台支持 |
| 数据库 | SQLite（开发） | MySQL 8.0（生产） | 生产环境推荐 MySQL |

> **注意**：Ghost 6.62.0 仅支持 Node.js 22.x 版本，请勿使用更高或更低的主版本。

### 验证环境

```bash
# 检查 Node.js 版本
node --version

# 检查 npm 版本
npm --version

# 检查 Ghost CLI（如已安装）
ghost --version
```

## 本地开发部署步骤

### 步骤 1：安装 Ghost-CLI

```bash
# 全局安装 Ghost CLI
npm install -g ghost-cli@latest

# 验证安装
ghost --version
```

### 步骤 2：克隆项目

```bash
git clone https://github.com/your-username/sdut-study-myblog.git
cd sdut-study-myblog
```

### 步骤 3：安装 Ghost

项目使用 `runtime/` 目录作为 Ghost 安装目录，采用 local 模式运行。

```bash
cd runtime

# 安装 Ghost（local 模式，使用 SQLite 数据库）
ghost install local
```

安装完成后，Ghost 会自动启动，默认地址为 `http://localhost:2368`。

### 步骤 4：安装自定义主题

**方式一：复制主题目录（推荐开发使用）**

```bash
# 在项目根目录执行
cp -r theme/oss-blog-theme runtime/content/themes/sdut-blog

# 重启 Ghost 使主题生效
cd runtime && ghost restart
```

**方式二：打包为 ZIP 后上传**

```bash
cd theme/oss-blog-theme
npm run zip
# 生成的 sdut-blog.zip 在项目根目录的 exports/ 下
```

然后在 Ghost 后台上传：设置 → 设计 → 更换主题 → 上传主题。

### 步骤 5：激活主题

1. 访问 `http://localhost:2368/ghost/` 进入管理后台
2. 首次访问需设置管理员账号和密码
3. 进入 **设置 → 设计**
4. 找到 `sdut-blog` 主题，点击 **激活**
5. 在"品牌"设置中可配置主题色、标签导航等自定义选项

### 步骤 6：启动与停止

```bash
cd runtime

# 启动 Ghost
ghost start

# 停止 Ghost
ghost stop

# 重启 Ghost
ghost restart

# 查看运行状态
ghost status

# 查看日志
ghost log
```

## 主题安装方法

### 方法一：上传 ZIP 包（推荐生产环境）

1. **打包主题**

```bash
cd theme/oss-blog-theme
npm run zip
```

2. **上传并激活**
   - 进入 Ghost 后台 → 设置 → 设计 → 更换主题
   - 点击"上传主题"按钮
   - 选择生成的 `sdut-blog.zip` 文件
   - 上传完成后点击"激活"

3. **验证**
   - 访问前台页面，确认主题已生效
   - 检查自定义功能（主题色切换、标签导航、目录等）是否正常

### 方法二：复制目录（推荐开发环境）

```bash
# 将主题目录复制到 Ghost 主题目录
cp -r theme/oss-blog-theme runtime/content/themes/sdut-blog

# 重启 Ghost
cd runtime && ghost restart
```

### 主题更新

```bash
# 重新复制主题文件
cp -r theme/oss-blog-theme/* runtime/content/themes/sdut-blog/

# 重启 Ghost
cd runtime && ghost restart
```

> **提示**：开发过程中可使用 `ghost restart` 快速重启，部分静态资源更改可能需要清除浏览器缓存。

## 邮件配置

Ghost 需要配置邮件服务以发送会员通知、密码重置、评论通知等邮件。以下以 QQ 邮箱 SMTP 为例。

### QQ 邮箱 SMTP 配置

编辑 `runtime/config.development.json`（开发环境）或 `runtime/config.production.json`（生产环境）：

```json
{
  "mail": {
    "transport": "SMTP",
    "options": {
      "service": "QQ",
      "host": "smtp.qq.com",
      "port": 465,
      "secure": true,
      "auth": {
        "user": "your_email@qq.com",
        "pass": "your_smtp_auth_code"
      }
    },
    "from": "your_email@qq.com"
  }
}
```

### 配置说明

| 配置项 | 值 | 说明 |
|--------|-----|------|
| host | `smtp.qq.com` | QQ 邮箱 SMTP 服务器地址 |
| port | `465` | SSL 端口（使用 587 为 TLS 端口） |
| secure | `true` | 使用 SSL 加密 |
| user | `your_email@qq.com` | 你的 QQ 邮箱地址 |
| pass | `your_smtp_auth_code` | QQ 邮箱授权码（非登录密码） |
| from | `your_email@qq.com` | 发件人地址 |

### 获取 QQ 邮箱授权码

1. 登录 QQ 邮箱网页版
2. 进入 **设置 → 账户**
3. 找到 **POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV 服务**
4. 开启 **IMAP/SMTP 服务**
5. 点击 **生成授权码**，按提示发送短信验证
6. 复制生成的 16 位授权码填入 `pass` 字段

### 其他邮箱服务商参考

| 邮箱 | SMTP 服务器 | 端口（SSL） |
|------|------------|------------|
| 163 邮箱 | smtp.163.com | 465 |
| Gmail | smtp.gmail.com | 465 |
| Outlook | smtp.office365.com | 587 |

> 配置完成后需重启 Ghost 使配置生效。

## 生产环境部署建议

### 使用 MySQL 数据库

生产环境推荐使用 MySQL 以获得更好的性能和稳定性。

```bash
# 安装时指定 MySQL
ghost install --db=mysql --dbhost=localhost --dbname=ghost_prod --dbuser=ghost_user --dbpass=your_password
```

或编辑 `config.production.json`：

```json
{
  "database": {
    "client": "mysql",
    "connection": {
      "host": "localhost",
      "port": 3306,
      "user": "ghost_user",
      "password": "your_database_password",
      "database": "ghost_prod",
      "charset": "utf8mb4"
    }
  }
}
```

### Nginx 反向代理

生产环境建议使用 Nginx 作为反向代理，提供静态资源加速与 SSL 终止。

示例配置 `/etc/nginx/conf.d/your-blog.conf`：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:2368;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff2?)$ {
        proxy_pass http://127.0.0.1:2368;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### HTTPS 配置

使用 Let's Encrypt 免费证书（推荐）：

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 自动获取并配置证书
sudo certbot --nginx -d your-domain.com
```

Ghost CLI 也支持自动配置 SSL：

```bash
ghost setup ssl
```

### 进程管理

生产环境使用 `ghost start` 启动，Ghost CLI 会自动使用 systemd 管理进程：

```bash
# 设置为生产模式
ghost setup systemd

# 启动
ghost start

# 查看状态
ghost status
```

### 性能优化建议

1. **启用 CDN**：将静态资源（图片、CSS、JS）托管至 CDN
2. **启用缓存**：配置 Nginx 缓存策略，减少后端请求
3. **数据库优化**：定期优化 MySQL 表，启用查询缓存
4. **图片优化**：上传前压缩图片，使用 WebP 格式
5. **定期备份**：设置自动备份任务

## 数据备份与恢复方法

### 数据备份

**方式一：Ghost 后台导出（推荐）**

1. 进入 Ghost 后台 → 设置 → 实验室
2. 点击"导出内容"
3. 下载 JSON 文件（包含文章、页面、标签、设置等）

**方式二：手动备份数据库**

SQLite 数据库备份：

```bash
# 停止 Ghost
cd runtime && ghost stop

# 复制数据库文件
cp content/data/ghost-local.db content/data/ghost-local.db.backup

# 启动 Ghost
ghost start
```

MySQL 数据库备份：

```bash
mysqldump -u ghost_user -p ghost_prod > ghost_backup.sql
```

**完整备份（包含图片与主题）**：

```bash
# 备份 content 目录（包含图片、主题、数据库）
tar -czf ghost-backup-$(date +%Y%m%d).tar.gz content/
```

### 数据恢复

**恢复 JSON 导出文件**：

1. 进入 Ghost 后台 → 设置 → 实验室
2. 点击"导入内容"
3. 选择之前导出的 JSON 文件
4. 等待导入完成

**恢复 SQLite 数据库**：

```bash
cd runtime
ghost stop
cp content/data/ghost-local.db.backup content/data/ghost-local.db
ghost start
```

**恢复 MySQL 数据库**：

```bash
mysql -u ghost_user -p ghost_prod < ghost_backup.sql
```

### 定时备份脚本示例

```bash
#!/bin/bash
# backup.sh - Ghost 自动备份脚本

BACKUP_DIR="/path/to/backups"
DATE=$(date +%Y%m%d_%H%M%S)
GHOST_DIR="/path/to/ghost"

# 备份数据库
cd $GHOST_DIR
sqlite3 content/data/ghost-local.db ".backup $BACKUP_DIR/ghost-db-$DATE.db"

# 备份图片
tar -czf $BACKUP_DIR/ghost-images-$DATE.tar.gz content/images/

# 保留最近 30 天的备份
find $BACKUP_DIR -name "ghost-*" -mtime +30 -delete
```

添加到 crontab 每日执行：

```bash
0 2 * * * /path/to/backup.sh
```

## 常见问题排查

### 1. Ghost 启动失败

**现象**：`ghost start` 后提示错误或状态显示为 stopped

**排查步骤**：
```bash
# 查看详细错误日志
ghost log -n 100

# 检查端口是否被占用
netstat -ano | findstr :2368   # Windows
lsof -i :2368                  # macOS/Linux

# 检查配置文件语法
ghost config --verbose
```

**常见原因**：
- 端口 2368 被其他程序占用 → 修改 `config.development.json` 中的 `server.port`
- Node.js 版本不兼容 → 确保使用 Node.js 22.x
- 数据库文件损坏 → 从备份恢复或重新安装

### 2. 主题上传失败

**现象**：后台上传主题 ZIP 包时报错

**排查步骤**：
- 检查 ZIP 包结构：根目录应包含 `package.json`、`default.hbs` 等文件，而非嵌套一层目录
- 运行主题检测：`cd theme/oss-blog-theme && gscan .`
- 确认 `package.json` 中的 `name` 字段有效

### 3. 自定义功能不生效

**现象**：主题色切换、搜索历史等功能无反应

**排查步骤**：
- 打开浏览器开发者工具（F12），查看 Console 是否有 JS 报错
- 检查 Network 面板，确认 `custom.js` 和 `custom.css` 正常加载
- 清除浏览器缓存后重试
- 确认已在后台激活正确的主题

### 4. 邮件发送失败

**现象**：会员注册、密码重置收不到邮件

**排查步骤**：
- 检查 `config.development.json` 中的 mail 配置
- 确认 SMTP 服务器地址、端口、授权码正确
- 查看 Ghost 日志中的邮件错误信息
- 测试邮件服务是否可用：使用 telnet 测试 SMTP 连接

```bash
telnet smtp.qq.com 465
```

### 5. 图片上传失败

**现象**：后台上传图片时报错

**排查步骤**：
- 检查 `content/images/` 目录的写入权限
- 确认图片大小未超出限制（默认 10MB）
- 检查磁盘空间是否充足
- 查看 Ghost 日志获取详细错误

### 6. 搜索功能异常

**现象**：搜索无结果或搜索历史不记录

**排查步骤**：
- 确认 Ghost Content API 密钥配置正确
- 检查浏览器是否禁用了 localStorage（搜索历史依赖本地存储）
- 查看 Console 中是否有相关 JS 报错
- 尝试在无痕模式下测试

### 7. 升级 Ghost 后主题报错

**现象**：升级 Ghost 版本后部分功能异常

**排查步骤**：
- 查看 Ghost 升级日志中的破坏性变更
- 运行 `gscan` 检查主题兼容性：`gscan runtime/content/themes/sdut-blog`
- 检查 Handlebars 模板语法是否有弃用警告
- 参考 Ghost 官方升级指南进行适配

### 8. 性能问题

**现象**：页面加载缓慢

**排查步骤**：
- 使用浏览器性能分析工具定位瓶颈
- 检查图片是否过大，启用图片压缩
- 确认是否启用了缓存
- 查看数据库慢查询日志
- 考虑使用 CDN 加速静态资源

---

如遇到本文件未涵盖的问题，请参考 [Ghost 官方文档](https://ghost.org/docs/) 或提交 Issue。
