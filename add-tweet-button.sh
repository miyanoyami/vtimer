#!/bin/bash

# ツイートボタンのHTMLコード
TWEET_BUTTON='
            <!-- ツイートボタン -->
            <div class="mt-4 text-center">
                <button id="tweet-btn"
                        class="group inline-flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] hover:bg-[#1a8cd8]
                               text-white font-semibold text-sm rounded-full shadow-md
                               transform transition-all duration-200 hover:scale-105 active:scale-95">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    作業を始める
                </button>
            </div>'

# すべてのタイマーHTMLファイルを処理
find timers -name "*.html" -type f | while read file; do
    # すでにツイートボタンがある場合はスキップ
    if grep -q 'id="tweet-btn"' "$file"; then
        echo "Skipping $file (already has tweet button)"
        continue
    fi

    # スマートフォン向け注意書きの直前にツイートボタンを挿入
    if grep -q 'id="mobile-notice"' "$file"; then
        # macOSのsedではバックアップファイルを作成する必要がある
        sed -i.bak '/<!-- スマートフォン向け注意書き -->/i\
'"$TWEET_BUTTON"'
' "$file"
        # バックアップファイルを削除
        rm "${file}.bak"
        echo "Added tweet button to $file"
    else
        echo "Warning: Could not find insertion point in $file"
    fi
done

echo "Done!"
