+++
date = '2026-10-22'
draft = true
title = 'Excalidraw 图表构建示例'
tags = ['Hugo', 'Excalidraw', '建站']
categories = ['建站']
summary = '示范如何保留 .excalidraw 源文件，并在 Hugo 构建前自动生成亮色和暗色 SVG。'
+++

这是一篇用于预览的草稿，展示博客中的 Excalidraw 图表发布流程。

<!--more-->

## 源文件到 SVG

文章引用的是构建阶段生成的 SVG，浏览器不会加载 Excalidraw 编辑器，也不会在运行时进行转换。

{{< excalidraw
  src="diagrams/generated/excalidraw-workflow.svg"
  dark="diagrams/generated/excalidraw-workflow.dark.svg"
  alt="编辑 Excalidraw 源文件、构建导出 SVG、浏览器显示 SVG 的流程图"
  caption=".excalidraw 是可继续编辑的源文件，网站发布的是亮色和暗色 SVG。"
>}}

## 本地预览

```bash
npm run diagrams
hugo server -D
```

打开 `/posts/excalidraw-example/` 即可查看这篇草稿。切换页面主题时，图表会自动切换到对应的 SVG 文件。
