#!/usr/bin/env bash
set -euo pipefail

# 一键部署 Hugo 博客到服务器
# 用法: ./scripts/deploy.sh
# 可选环境变量:
#   DEPLOY_HOST   SSH 别名，默认 ucloud
#   DEPLOY_PATH   服务器目录，默认 /var/www/blog
#   HUGO_FLAGS    hugo 构建参数，默认 --minify

# 解析项目根目录（必须在脚本内执行，不能复制到终端里单独跑）
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
DEPLOY_HOST="${DEPLOY_HOST:-ucloud}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/blog}"
HUGO_FLAGS="${HUGO_FLAGS:---minify}"

cd "$ROOT_DIR"

if ! command -v hugo >/dev/null 2>&1; then
  echo "错误: 未找到 hugo，请先安装 Hugo Extended" >&2
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "错误: 未找到 rsync" >&2
  exit 1
fi

echo "==> 构建站点 (hugo ${HUGO_FLAGS})"
hugo ${HUGO_FLAGS}

if [[ ! -d public ]]; then
  echo "错误: 构建后未找到 public/ 目录" >&2
  exit 1
fi

echo "==> 上传到 ${DEPLOY_HOST}:${DEPLOY_PATH}/"
rsync -avz --delete \
  --rsync-path="sudo rsync" \
  public/ \
  "${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo "==> 部署完成: http://qymlxin.cn"
