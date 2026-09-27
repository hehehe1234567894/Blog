# 博客

Hugo + PaperMod 的静态博客，托管在 GitHub Pages。

- 线上地址：<https://hehehe1234567894.github.io/Blog/>
- 仓库：<https://github.com/hehehe1234567894/Blog>（源码在 `main`，发布的产物在 `gh-pages`）

## 写文章

新文章放进 `content/posts/`，Markdown 格式，开头写 front matter：

```yaml
---
title: "标题"
date: 2026-09-27
summary: "列表页显示的一句话"
tags: ["C语言"]
draft: false        # true = 草稿，不发布
---
```

## 发布

在 dsh-home 上跑一条命令（自动构建并推送，约 1 分钟生效）：

```bash
bash /home/agent/DSH/sites/blog-tools/deploy.sh
```

## 评论

用 Giscus（基于 GitHub Discussions），配置在 `hugo.toml` 的 `[params.giscus]`。

## 其他

本地预览、换自定义域名、升级主题这些细节，随时问 dsh-home。
