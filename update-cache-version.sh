#!/bin/bash

# キャッシュバージョンを更新するスクリプト
# デプロイ前に実行してください

set -e

CACHE_VERSION=$(date +%s)

echo "キャッシュバージョンを更新しています: ${CACHE_VERSION}"

# 全てのVTuberのHTMLファイルを更新
for file in timers/*/*.html; do
    if [ -f "$file" ]; then
        # 既存のバージョンパラメータを新しいバージョンに置き換え
        sed -i '' "s|themes\.css?v=[0-9]*|themes.css?v=${CACHE_VERSION}|g" "$file"
        sed -i '' "s|style\.css?v=[0-9]*|style.css?v=${CACHE_VERSION}|g" "$file"
        sed -i '' "s|script\.js?v=[0-9]*|script.js?v=${CACHE_VERSION}|g" "$file"
        echo "  ✓ $(basename $(dirname $file))/$(basename $file)"
    fi
done

echo ""
echo "完了しました！"
echo "キャッシュバージョン: ${CACHE_VERSION}"
