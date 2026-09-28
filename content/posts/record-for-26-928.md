---
title: "提交github的文件时，在.gitignore文件上遇到的问题"
date: 2026-09-28
summary: "在使用gitignore时遇到的一些问题"
tags: ["Git","VS Code"]
categories: ["Git"]
ShowToc: true
TocOpen: false
draft: false
cover:
  image: "/images/covers/c.svg"
  alt: "一次Git上遇到的问题"
  relative: false
  hiddenInSingle: true
images: ["https://blog.funnycode.site/og.png"]   # 分享预览图（SVG 封面不能当缩略图）
---
在使用Git时，我一般会先请教一下网络和AI。这一次也如此。但是我竟然出现了理解错误，导致文件始终无法提交部分。

## 使用Git时必然会用到gitignore，但是终是会出一些问题。
我在使用gitignore时，无意将文件名为docs的文件的忽略名写成了.docs,导致文件无法正常忽略。

#### 虽然是一件非常小的事情，但是我还是想要记录一下。毕竟刚建好站，我还打算测试一下。
