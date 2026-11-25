# Excalidraw 图表

博客采用 **`.excalidraw.svg` 单文件方案**：利用 Excalidraw 的 **Embed scene（内嵌场景数据）** 能力，一个 `.excalidraw.svg` 文件**既是浏览器可直接加载的矢量图，又内嵌了完整的可编辑源码**。

无需 Node.js、Playwright 或构建前转换脚本，Hugo 单二进制即可直接编译发布。

## 文件位置

将图表文件放在：

```text
static/diagrams/
```

例如：

```text
static/diagrams/excalidraw-workflow.excalidraw.svg
```

所有 `.excalidraw.svg` 直接提交到 Git。

## 日常绘制与修改

有两种方式，任选其一：

1. **VS Code / Antigravity Excalidraw 插件（推荐，免手动导出）**
   - 在 `static/diagrams/` 下新建或打开 `xxx.excalidraw.svg`；
   - 在画布中绘制完成后按 `Cmd + S` 保存，插件会自动同步写入渲染后的 SVG 与可编辑场景数据；
   - 后续需要修改时，直接再次双击该 `.excalidraw.svg` 编辑保存即可。
2. **网页版 `excalidraw.com`**
   - 画完后点击导出 SVG（**Export image → SVG**），并确保勾选 **Embed scene**；
   - 将文件保存为 `static/diagrams/xxx.excalidraw.svg`；
   - 下次需要修改时，直接将该文件拖入 `excalidraw.com` 即可还原编辑。

## 在文章中引用

最简写法（推荐，暗夜模式由主题 CSS 自动适配）：

```markdown
{{</* excalidraw
  src="diagrams/excalidraw-workflow.excalidraw.svg"
  alt="编辑 .excalidraw.svg、Hugo 直接静态构建、亮暗自动适配显示的流程图"
  caption=".excalidraw.svg 内嵌可编辑场景数据，亮暗主题由 CSS 自动适配。"
*/>}}
```

参数说明：

- `src`：SVG 路径（相对于 `static/`），必填。
- `alt`：图片替代文本，建议填写具体内容。
- `caption`：图片下方说明，可选。
- `invert`：可选，默认启用自动暗夜反色；若图表为纯照片或不想在暗色下反色，可设置 `invert="false"`。
- `dark`：可选，独立暗色版 SVG 路径。当某张图对暗夜配色有精细要求时，可单独传入 `dark="diagrams/xxx.dark.svg"`，此时会自动切换双图，不再应用 CSS 反色滤镜。

## 完整示例

仓库中包含一篇草稿示例与对应的图表文件：

- 图表文件：`static/diagrams/excalidraw-workflow.excalidraw.svg`
- 示例文章：`content/posts/excalidraw-example.md`

本地预览草稿：

```bash
hugo server -D
```

浏览器打开：

```text
http://localhost:1313/posts/excalidraw-example/
```
