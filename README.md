# MIEW

我的博客：<https://blog.funnycode.site/>

Hugo + PaperMod，托管在 GitHub Pages。往 `main` 分支提交就自动构建发布（GitHub Actions），
评论用 Giscus（基于 GitHub Discussions）。

## 写文章

在 `content/posts/` 里新建一个 `.md` 文件：

```markdown
---
title: "标题"
date: 2026-09-27
summary: "列表页显示的一句话"
tags: ["C语言"]
draft: false
---

正文用 Markdown 写。
```

## 目录

- `content/` —— 文章与页面（关于、归档、搜索）
- `hugo.toml` —— 站点配置
- `themes/PaperMod/` —— 主题（内置副本，不依赖 submodule）
- `layouts/` —— 主题覆盖（评论区模板在这个目录）
- `static/` —— favicon、CNAME 等原样输出的文件

> `gh-pages` 分支是自动生成的，别直接改。
