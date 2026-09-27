# 博客

Hugo + PaperMod 的静态博客，用 **GitHub Actions 自动构建并发布到 GitHub Pages**。
不用装 Node、不用装数据库，推一次代码就自动上线。

## 目录结构

```
.
├── hugo.toml                    # 站点配置（标题、菜单、首页信息卡、社交图标…）
├── content/
│   ├── posts/                   # 文章都在这里（Markdown）
│   ├── about.md                 # 关于页
│   ├── archives.md              # 归档页（layout: archives）
│   └── search.md                # 搜索页（layout: search）
├── assets/css/extended/custom.css  # 自定义样式（中文字体、行距等）
├── static/                      # 原样输出的文件（favicon 等）
├── themes/PaperMod/             # 主题（已内置在仓库里，CI 不需要联网拉主题）
└── .github/workflows/hugo.yml   # GitHub Actions：构建 + 部署到 Pages
```

## 本地预览（可选）

装 Hugo **extended** 版（≥ 0.146）：

```bash
# Windows
winget install Hugo.Hugo.Extended
# macOS
brew install hugo
```

然后在仓库目录里：

```bash
hugo server -D          # 打开 http://localhost:1313
hugo --gc --minify      # 只构建，产物在 public/
```

## 建仓之后怎么上线（三步）

1. **仓库**：`hehehe1234567894/Blog`（已建好）。
   地址：<https://hehehe1234567894.github.io/Blog/>

2. **推送代码**（把 `<仓库地址>` 换成你的）：

   ```bash
   git remote add origin <仓库地址>
   git branch -M main
   git push -u origin main
   ```

3. **打开 Pages**：仓库 → Settings → Pages → Build and deployment → Source 选 **GitHub Actions**（只需一次）。
   之后每次 `git push` 都会自动重新构建发布，进度在仓库的 **Actions** 标签页里看。

> 站点地址（baseURL）不用操心：部署时工作流会用 Pages 给出的真实地址覆盖 `hugo.toml` 里的 baseURL。
> 想本地也显示成正确地址，就把 `hugo.toml` 第一行的 `baseURL` 改成你的实际地址。

## 写新文章

```bash
hugo new content posts/我的新文章.md
```

写完把 `draft: true` 改成 `false`（或者本地用 `hugo server -D` 预览草稿）再提交。

文章的 front matter 常用字段：

```yaml
---
title: "标题"
date: 2026-09-27
summary: "列表页显示的一句话摘要"
tags: ["C语言", "单片机"]
categories: ["学习笔记"]
ShowToc: true      # 是否显示右侧目录
draft: false
---
```

## 想换自定义域名

1. 在 `static/` 下建一个 `CNAME` 文件，内容只写域名，例如 `blog.funnycode.site`；
2. DNS 里加记录：`CNAME blog → hehehe1234567894.github.io`；
3. 仓库 Settings → Pages → Custom domain 填同一个域名，勾上 Enforce HTTPS。

## 其他说明

- 主题是**内置副本**（`themes/PaperMod/`），不依赖 submodule，CI 不需要额外拉取。
  想升级主题：把新版本文件覆盖进 `themes/PaperMod/` 即可。
- 搜索用的是本地打包的 Fuse.js（`themes/PaperMod/assets/js/`），**不依赖任何 CDN**，
  所以境内访问时不会因为 jsdelivr 被墙而白屏。
- GitHub Pages 在境内访问速度一般，如果嫌慢可以：换自定义域名 + CDN，
  或者把 `public/` 整个目录丢到自己的服务器上。
- favicon 是脚本生成的（鼠标指针造型）：`../blog-tools/make-favicon.py`。
