# 2026 跨年 & 生日庆典网页 - GitHub Pages 上线指南

本项目已配置 **GitHub Actions** 自动化部署。

## 🌐 解决大陆无法访问/访问慢的问题

Vercel 的 `.app` 域名在中国大陆访问不稳定。建议使用以下方案：

1. **部署到 GitHub Pages (推荐)**：
   - GitHub Pages 的 `.github.io` 域名通常比 Vercel 更容易访问。
   - 按照下方的 **GitHub Pages 上线步骤** 操作即可。
2. **使用自定义域名**：
   - 如果你有自己的域名（如 `.com` 或 `.cn`），在 Vercel 或 GitHub 的设置中绑定该域名，这是最稳妥的方案。
3. **国内托管**：
   - 也可以将代码上传至 [Gitee](https://gitee.com/) 并开启 Gitee Pages。

## 🚀 GitHub Pages 上线步骤

1. **上传代码**：将所有文件推送（Push）到你的 GitHub 仓库 `main` 分支。
2. **开启权限**：
   - 进入 GitHub 仓库页面的 **Settings**（设置）。
   - 点击左侧菜单的 **Pages**。
   - 在 **Build and deployment** > **Source** 下，下拉选择 **GitHub Actions**。
3. **查看进度**：
   - 点击仓库顶部的 **Actions** 标签，你会看到一个正在运行的任务。
   - 等待任务变绿（完成）后，刷新 Pages 页面即可看到你的专属链接（通常是 `https://你的用户名.github.io/仓库名/`）。

## 🛠 开发技术栈
- React 19 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Framer Motion / Lottie (动画)

## 📱 访问提示
- 建议使用手机浏览器开启“添加到主屏幕”，体验更佳。
- 互动说明：倒计时结束后，开启麦克风权限并吹气。