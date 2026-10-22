# Excalidraw 图表

博客使用 Excalidraw 的 `.excalidraw` 文件作为源文件，在构建前自动生成亮色和暗色 SVG。网站运行时只加载 SVG，不加载 Excalidraw 编辑器。

## 文件位置

将源文件放在：

```text
static/diagrams/source/
```

例如：

```text
static/diagrams/source/excalidraw-workflow.excalidraw
```

生成文件会写入：

```text
static/diagrams/generated/excalidraw-workflow.svg
static/diagrams/generated/excalidraw-workflow.dark.svg
```

`static/diagrams/generated/` 已加入 `.gitignore`，这些文件会在构建和部署前自动重新生成；`.excalidraw` 源文件需要提交到 Git。

## 首次安装

项目需要 Node.js 22 或更高版本，以及 Playwright 使用的 Chromium：

```bash
npm install
npm run diagrams:setup
```

`npm run diagrams:setup` 只需要在本机或部署机器首次安装时执行一次。

## 生成图表

扫描全部源文件并重新生成亮色、暗色 SVG：

```bash
npm run diagrams
```

完整构建会自动执行同样的步骤：

```bash
npm run build
```

部署脚本也会先执行 `npm run diagrams`，所以不需要手动把生成的 SVG 上传到服务器。

## 在文章中引用

```markdown
{{< excalidraw
  src="diagrams/generated/excalidraw-workflow.svg"
  dark="diagrams/generated/excalidraw-workflow.dark.svg"
  alt="文章写作与 Hugo 构建流程图"
  caption="源文件保留在 static/diagrams/source/，发布时只加载 SVG。"
>}}
```

参数说明：

- `src`：亮色 SVG 路径，必填。
- `dark`：暗色 SVG 路径，可选；省略时始终使用亮色版本。
- `alt`：图片替代文本，建议填写具体内容。
- `caption`：图片下方说明，可选。

主题会根据当前的亮色/暗色设置自动显示对应的 SVG。浏览器不会进行 Excalidraw 转换，也不会请求 Chromium。

## 完整示例

仓库中包含一个可以直接使用的示例：

```text
static/diagrams/source/excalidraw-workflow.excalidraw
content/posts/excalidraw-example.md
```

本地预览草稿文章：

```bash
npm run diagrams
hugo server -D
```

打开：

```text
http://localhost:1313/posts/excalidraw-example/
```

这个示例展示了三个步骤：编辑 `.excalidraw` 源文件、构建阶段导出 SVG、Hugo 发布静态页面。

## 修改图表后的流程

1. 在 Excalidraw 中打开并修改 `static/diagrams/source/` 下的源文件。
2. 保存 `.excalidraw` 文件。
3. 执行 `npm run diagrams` 检查导出结果。
4. 在文章中引用生成后的亮色和暗色路径。
5. 提交 `.excalidraw` 源文件和文章；生成的 SVG 不需要提交。

## 常见问题

### 找不到 Chromium

执行：

```bash
npm run diagrams:setup
```

如果 Chromium 安装在自定义路径，可以设置：

```bash
EXCALIDRAW_CHROMIUM_PATH=/path/to/Chromium npm run diagrams
```

### 为什么使用 `@excalidraw/utils`

`@excalidraw/excalidraw` 是完整的 React 编辑器。当前需求只是构建阶段导出 SVG，因此使用官方的 `@excalidraw/utils` 导出层更轻量，也不需要把编辑器加载到网站前端。
