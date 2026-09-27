# 指针与烙铁 · 博客

Hugo + PaperMod 的静态博客，托管在 **GitHub Pages**。

- 线上地址：<https://hehehe1234567894.github.io/Blog/>
- 源码仓库：<https://github.com/hehehe1234567894/Blog>（`main` 分支）
- 发布用分支：`gh-pages`（仓库 Settings → Pages 的 Source 指向它）

## 目录结构

```
.
├── hugo.toml                       # 站点配置（标题、菜单、首页信息卡、社交图标…）
├── content/
│   ├── posts/                      # 文章都在这里（Markdown）
│   ├── about.md                    # 关于页
│   ├── archives.md                 # 归档页（layout: archives）
│   └── search.md                   # 搜索页（layout: search）
├── assets/css/extended/custom.css   # 自定义样式（中文字体、行距等）
├── static/                         # 原样输出的文件（favicon 等）
├── themes/PaperMod/                # 主题（已内置在仓库里，不依赖 submodule / CDN）
└── README.md
```

## 写新文章

```bash
hugo new content posts/我的新文章.md
```

写在 `content/posts/` 下的 Markdown，front matter 常用字段：

```yaml
---
title: "标题"
date: 2026-09-27
summary: "列表页显示的一句话摘要"
tags: ["C语言", "单片机"]
categories: ["学习笔记"]
ShowToc: true      # 是否显示文章目录
draft: false       # 草稿改成 true 就不会发布
---
```

## 发布（改完文章后）

在 dsh-home 上跑一条命令即可：

```bash
bash /home/agent/DSH/sites/blog-tools/deploy.sh
```

它会：本地构建 → 源码推到 `main` → 构建产物推到 `gh-pages` → 约 1 分钟后线上生效。

> 为什么要专门写这个脚本：家里这台机器到 `github.com:443` 的 git 流量会被重置
> （`api.github.com` 正常），所以推送统一经过 203 服务器中转。

## 本地预览（可选）

装 Hugo **extended** 版（≥ 0.146）：

```bash
winget install Hugo.Hugo.Extended     # Windows
brew install hugo                     # macOS
```

```bash
hugo server -D          # 打开 http://localhost:1313
hugo --gc --minify      # 只构建，产物在 public/
```

## 想改成「推送即自动构建」（可选）

仓库里现在**没有** `.github/workflows/hugo.yml` —— 因为当前的 GitHub Token 没有
`Workflows` 写权限，推不上去。想改成 push 自动构建：

1. 打开 <https://github.com/hehehe1234567894/Blog/new/main>，
   文件名填 `.github/workflows/hugo.yml`，内容用 dsh-home 上
   `/home/agent/DSH/sites/blog-tools/hugo-workflow.yml` 的内容（让它发给你）；
2. 仓库 Settings → Pages → Source 改成 **GitHub Actions**；
3. 之后往 `main` push 就会自动构建发布，进度看仓库的 **Actions** 标签页。

## 想换自定义域名

1. 在 `static/` 下建 `CNAME` 文件，内容只写域名，例如 `blog.funnycode.site`；
2. DNS 加记录：`CNAME blog → hehehe1234567894.github.io`；
3. 仓库 Settings → Pages → Custom domain 填同一个域名，勾上 Enforce HTTPS。

## 其他说明

- 主题是**内置副本**（`themes/PaperMod/`），不依赖 submodule，构建不需要联网拉主题。
  升级主题：把新版本文件覆盖进 `themes/PaperMod/`。
- 搜索用本地打包的 Fuse.js（`themes/PaperMod/assets/js/fuse.basic.min.js`），
  **不依赖任何 CDN**，境内访问不会因为 jsdelivr 被墙而白屏。
- GitHub Pages 在境内速度一般；嫌慢可以绑自定义域名 + CDN，或把 `public/`
  整个目录丢到自己的服务器上。
- favicon 是脚本生成的（鼠标指针造型）：`/home/agent/DSH/sites/blog-tools/make-favicon.py`。
