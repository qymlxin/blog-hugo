+++
date = '2026-10-22'
draft = true
title = 'Excalidraw 图表构建示例'
tags = ['Hugo', 'Excalidraw', '建站']
categories = ['建站']
summary = '示范如何直接保存内嵌场景数据的 .excalidraw.svg 文件，零构建依赖完成 Hugo 发布与亮暗主题适配。'
+++

这是一篇用于预览的草稿，展示博客中零依赖的 Excalidraw 图表工作流。

<!--more-->

## 一份 `.excalidraw.svg` 兼顾展示与再编辑

借助 Excalidraw 的内嵌场景（Embed scene）格式，`.excalidraw.svg` **本身既是可直接发布的 SVG 图片，也内嵌了完整的可编辑场景数据**。整个博客无需 Node、Playwright 或后台转换脚本，Hugo 直接静态构建即可。

{{< excalidraw
  src="diagrams/excalidraw-workflow.excalidraw.svg"
  alt="编辑 .excalidraw.svg、Hugo 直接静态构建、亮暗自动适配显示的流程图"
  caption=".excalidraw.svg 内嵌可编辑场景数据，亮暗主题由 CSS 自动适配。"
>}}

## 本地预览

```bash
hugo server -D
```

打开 `/posts/excalidraw-example/` 即可查看这篇草稿。切换页面亮暗主题时，图表会自动反色适配；若对配色有精细要求，也可额外传入 `dark="..."` 指定独立暗色 SVG。
