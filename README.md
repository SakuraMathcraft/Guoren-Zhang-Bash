# 2026 跨年 & 生日庆典网页

本项目支持 **Vercel** 和 **GitHub Pages** 双重部署，确保在全球不同网络环境下都能快速访问。

## 🌐 访问地址 (双线部署)

- **线路 A (GitHub Pages - 国内推荐)**: `https://SakuraMathcraft.github.io/Guoren-Zhang-Bash/`
- **线路 B (Vercel - 国际线路)**: `https://guoren-zhang-bash.vercel.app/`

## 🚀 如何启用 GitHub Pages (如果你还没设置)

1. 进入 GitHub 仓库 **Settings** -> **Pages**。
2. 在 **Build and deployment > Source** 中，选择 **GitHub Actions**。
3. 以后每次推送代码到 `main` 分支，GitHub 和 Vercel 都会同步自动更新。

## 🛠 技术说明

- **相对路径支持**: 配置文件 `vite.config.ts` 已设置 `base: './'`，这使得同一个构建包既可以运行在 Vercel 的根路径下，也可以运行在 GitHub Pages 的子路径下。
- **资源镜像**: `index.html` 已将 Google Fonts 替换为 `fonts.loli.net` 镜像，提升了在中国大陆的首屏加载速度。

## 📱 使用建议
- **互动体验**: 倒计时结束后，请授权麦克风权限。对着手机底部麦克风**用力吹气**即可吹灭蜡烛。
- **音乐切换**: 吹灭蜡烛后，右下角的黑胶唱片机会自动开启，点击它可以更换背景音乐。

---
*Wish you a happy 21st birthday and a fantastic 2026!*