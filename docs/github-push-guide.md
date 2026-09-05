# 推送到 GitHub 操作指南

## 前置条件
- 已注册 GitHub 账号
- 已创建空仓库：https://github.com/Forever-Dreaming/SDUT-study-MyBlog
- 本地已安装 Git

## 推送步骤

### 第一步：关联远程仓库

```powershell
# 进入项目目录
cd E:\kkkkkkkkkkkkkkkkkkkkKKKKKKKKKKKK\VSblock\class2026\sdut-study-myblog

# 关联远程仓库（如果还没关联的话）
git remote add origin https://github.com/Forever-Dreaming/SDUT-study-MyBlog.git

# 验证远程仓库
git remote -v
```

> 如果之前已经关联过，跳过这一步。

### 第二步：推送所有分支和标签

```powershell
# 推送 main 分支
git push -u origin main

# 推送 feature/theme 分支
git push origin feature/theme

# 推送 feature/blog-enhancement 分支
git push origin feature/blog-enhancement

# 推送标签
git push origin v1.0-lab
```

### 第三步：在 GitHub 上创建 PR（Pull Request）

1. 打开你的仓库：https://github.com/Forever-Dreaming/SDUT-study-MyBlog
2. 点击 **Pull requests** 标签
3. 点击 **New pull request**
4. base 选 `main`，compare 选 `feature/theme`
5. 点击 **Create pull request**
6. 标题填：`feat(theme): 自定义主题 sdut-blog 开发`
7. 描述内容参考 `docs/github-templates/pr-theme.md`
8. 点击 **Create pull request**

再创建第二个 PR：
- base: `main`
- compare: `feature/blog-enhancement`
- 标题：`feat(search): 搜索历史记录增强`

### 第四步：自我 Code Review（在 PR 里）

1. 进入刚才创建的 PR
2. 点击 **Files changed** 查看代码变更
3. 在 PR 评论区写下 Review 意见，参考检查清单
4. 然后点击 **Merge pull request** 合并

> 注意：因为我们本地已经把分支合并到 main 了，GitHub 上可能显示"Already merged"。没关系，创建 PR 的记录本身就是证据。

### 第五步：创建 Issue

1. 点击 **Issues** 标签
2. 点击 **New issue**
3. 创建以下 3 个 Issue：

**Issue 1：主题改造**
- 标题：`feat(theme): 自定义主题 sdut-blog 开发`
- 内容参考：`docs/github-templates/issue-theme.md`

**Issue 2：搜索增强**
- 标题：`feat(search): 搜索历史记录增强`
- 内容参考：`docs/github-templates/issue-search.md`

**Issue 3：数据备份**
- 标题：`chore: 数据备份与恢复验证`
- 内容参考：`docs/github-templates/issue-backup.md`

4. 在每个 Issue 的右侧，添加 Label（如 `enhancement`、`documentation`）
5. 把 PR 关联到对应的 Issue（在 PR 描述中写 "Closes #3"）

### 第六步：验证

```powershell
# 查看远程分支
git branch -r

# 查看标签
git ls-remote --tags origin
```

确认所有分支和标签都推上去了就完成了！

## 常见问题

### 推送时提示用户名密码
现在 GitHub 不支持密码登录了，需要用 Personal Access Token：
1. GitHub 右上角头像 → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token → 勾选 repo 权限 → 生成
3. 推送时密码填生成的 token

### 提示 "remote origin already exists"
说明已经关联过了，直接推送就行。

### 提示 "failed to push some refs"
可能是远程仓库有内容（比如 README），先拉取再推送：
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```
