# Artalk 评论配置

评论系统使用 [Artalk](https://artalk.js.org/)。站点配置位于 `hugo.toml` 的 `[params.artalk]`。

```toml
[params.artalk]
  server = 'https://artalk.qymlxin.cn'
  site = 'qymlxin_blog'
  localSite = ''
```

## 站点隔离规则

| 启动方式 | 实际 Artalk Site |
| --- | --- |
| `hugo` / CI 构建 | `qymlxin_blog` |
| `hugo server -D` | `qymlxin_blog_dev` |
| 指定本地覆盖参数 | 使用参数值 |

本地服务默认自动追加 `_dev`，避免测试评论写入正式评论区。

## 临时指定本地 Site

通过 `HUGO_PARAMS_ARTALK_LOCALSITE` 在启动时指定临时 Site。该值只在 `hugo server` 生效，不会改变正式构建的 Site。

```bash
HUGO_PARAMS_ARTALK_LOCALSITE=qymlxin_blog_staging hugo server -D
```

例如，若需要本地预览正式评论数据：

```bash
HUGO_PARAMS_ARTALK_LOCALSITE=qymlxin_blog hugo server -D
```

不要在公开演示或测试中使用正式 Site，以免留下测试评论。