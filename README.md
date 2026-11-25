# blog-hugo

基于 **Hugo Extended** 构建的个人技术博客仓库，使用自研主题 [`qyml-hugo-theme`](themes/qyml-hugo-theme/README.md)（现代极简卡片风 / Clean Editorial Card UI）。整个站点保持**纯 Hugo 单二进制构建**，无需前端打包工具或浏览器运行时转换依赖。

## 目录结构

```text
.
├── content/posts/             # Markdown 文章目录
├── static/
│   ├── diagrams/              # Excalidraw 内嵌场景的 .excalidraw.svg 图表
│   └── images/                # 头像、首页横幅等静态图片
├── themes/qyml-hugo-theme/    # 主题子模块（通过 go.mod 的 replace 映射到当前仓库）
├── scripts/deploy.sh          # 一键编译并同步到服务器的部署脚本
├── go.mod                     # Hugo Module 定义与本地主题映射
├── hugo.toml                  # 站点配置（基本信息、Artalk 评论、社交账号等）
├── DIAGRAMS.md                # Excalidraw 单文件图表绘制与引用说明
└── ARTALK.md                  # Artalk 评论环境隔离与调试说明
```

## 环境准备

本机开发与发布只需要以下基础工具：

- **Hugo Extended**（当前基于 `v0.161+`）
- **Git**（含 submodule 操作）
- **rsync** 与配置好的 SSH 主机别名 `ucloud`（需支持免密执行 `sudo rsync` 至 `/var/www/blog/`）

## 日常写作与本地预览

### 1. 新建与编辑文章

```bash
# 套用主题预置的 Front Matter 模板新建文章
hugo new content/posts/my-post.md
```

在本地启动开发服务器（`-D` 会同时渲染 `draft = true` 的草稿）：

```bash
hugo server -D
```

本地启动时，Artalk 评论会自动追加 `_dev` 后缀隔离评论区，避免测试数据污染线上环境；如需临时覆盖可见 [ARTALK.md](ARTALK.md)。

### 2. 插入 Excalidraw 手绘图

项目采用 **`.excalidraw.svg` 单文件方案**：利用 Excalidraw 的内嵌场景（Embed scene）格式，同一份文件既是网页可直接加载的矢量图，又保留完整可编辑画布数据。

- 将 `.excalidraw.svg` 放在 `static/diagrams/` 下（推荐用编辑器 Excalidraw 插件编辑并 `Cmd + S` 保存，无需手动导出）。
- 在文章中引用：

```markdown
{{</* excalidraw
  src="diagrams/excalidraw-workflow.excalidraw.svg"
  alt="流程图说明"
  caption="图注（可选）"
*/>}}
```

详细用法见 [DIAGRAMS.md](DIAGRAMS.md)。

### 3. Mermaid 图表与数学公式

- 直接使用 ` ```mermaid ` 代码块即可渲染流程图，支持亮/暗模式自动重绘、工具栏行内缩放、拖拽平移与全屏预览。
- 需要渲染 LaTeX 数学公式时，在文章 Front Matter 中加入 `math = true` 即可按需加载 KaTeX。

## 编译与发布流程

### 1. 本地编译检查

```bash
hugo --gc --minify --cleanDestinationDir
```

- `--cleanDestinationDir`：每次构建前清空 `public/`，避免旧指纹静态资源或已删文章残留。
- `--minify`：压缩 HTML / CSS / JS / JSON / XML。
- `--gc`：清理构建缓存产物。

### 2. Git 提交与推送顺序

- **仅修改文章或根配置 `hugo.toml`**：直接在主仓库提交并推送：
  ```bash
  git add content/ hugo.toml static/
  git commit -m "docs: add new post"
  git push origin main
  ```
- **修改了主题 `themes/qyml-hugo-theme/`**：必须**先提交并推送主题子模块，再回到主仓库更新子模块指针并推送**，否则远程仓库主工程会引用到不存在的子模块提交：
  ```bash
  # 1) 主题子模块
  git -C themes/qyml-hugo-theme add -A
  git -C themes/qyml-hugo-theme commit -m "feat/fix/style: ..."
  git -C themes/qyml-hugo-theme push origin main

  # 2) 主仓库更新指针并推送
  git add themes/qyml-hugo-theme
  git commit -m "chore: update theme submodule"
  git push origin main
  ```

### 3. 一键发布到服务器

在仓库根目录执行部署脚本：

```bash
./scripts/deploy.sh
```

脚本会自动校验 `hugo` 与 `rsync`，执行 `hugo --gc --minify --cleanDestinationDir` 生成 `public/`，并通过 `rsync -avz --delete --rsync-path="sudo rsync"` 增量同步至 `ucloud:/var/www/blog/`，同时清理服务器过期文件。

支持通过环境变量临时覆盖默认配置：

- `DEPLOY_HOST`：SSH 主机别名，默认 `ucloud`
- `DEPLOY_PATH`：服务器目标目录，默认 `/var/www/blog`
- `HUGO_FLAGS`：Hugo 构建参数，默认 `--gc --minify --cleanDestinationDir`

## 核心配置速查（`hugo.toml`）

- `[outputs]`：需保留 `['HTML', 'RSS', 'JSON']` 以生成全站搜索索引 `index.json`。
- `[params]`：配置作者名、简介、头像（`avatar`）、首页横幅（`homeBanner` / `homeCoverTitle`）与社交账号 `[params.social]`。
- `[params.artalk]`：通过 `enabled = true/false` 控制是否启用文章底部评论（主题默认关闭，当前站点配置为开启）。
- `[params.mermaid]`：可选配置 `theme` / `darkTheme` 覆盖主题内置 Mermaid 配色。
