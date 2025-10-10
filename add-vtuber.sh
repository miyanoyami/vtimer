#!/bin/bash

# 新しいVTuberを追加するスクリプト

set -e

# 使用方法を表示
usage() {
    echo "使用方法: $0 <英名> <表示名> <テーマ>"
    echo ""
    echo "引数:"
    echo "  英名     : ページのパス名（例: yaoaoi）"
    echo "  表示名   : タイトルやリンクに表示する名前（例: 八百アオヰ）"
    echo "  テーマ   : テーマカラー（sakura/ocean/forest/sunset/violet/white/black）"
    echo ""
    echo "例:"
    echo "  $0 example 例太郎 ocean"
    exit 1
}

# 引数チェック
if [ $# -ne 3 ]; then
    usage
fi

SLUG=$1
NAME=$2
THEME=$3

# テーマの妥当性チェック
VALID_THEMES=("sakura" "ocean" "forest" "sunset" "violet" "white" "black")
if [[ ! " ${VALID_THEMES[@]} " =~ " ${THEME} " ]]; then
    echo "エラー: 無効なテーマです。以下から選択してください:"
    echo "  sakura, ocean, forest, sunset, violet, white, black"
    exit 1
fi

# ディレクトリが既に存在するかチェック
if [ -d "timers/${SLUG}" ]; then
    echo "エラー: timers/${SLUG}/ は既に存在します"
    exit 1
fi

echo "新しいVTuberを追加します..."
echo "  英名: ${SLUG}"
echo "  表示名: ${NAME}"
echo "  テーマ: ${THEME}"
echo ""

# VTuber用ディレクトリを作成
mkdir -p "timers/${SLUG}"
echo "✓ timers/${SLUG}/ ディレクトリを作成しました"

# タイマーページを作成
cat > "timers/${SLUG}/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>おしえーる - VTUBER_NAME</title>

    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-D5G5EXH18M"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-D5G5EXH18M');
    </script>

    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        'mono': ['Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
                    },
                    animation: {
                        'pulse-slow': 'pulse 2s infinite',
                        'bounce-gentle': 'bounce 1s ease-in-out infinite',
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="../../assets/themes.css">
    <link rel="stylesheet" href="../../assets/style.css">
</head>
<body data-vtuber-id="VTUBER_SLUG" class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-lg">
        <!-- ヘッダー -->
        <div class="text-center mb-6">
            <div class="mb-3">
                <a href="../../index.html" class="inline-flex items-center text-theme-secondary/40 hover:text-theme-secondary/70 text-xs transition-colors duration-200">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                    </svg>
                    一覧へ戻る
                </a>
            </div>
            <h1 class="text-2xl md:text-3xl font-bold mb-2">
                <span class="text-gradient-primary">
                    VTUBER_NAME
                </span>
            </h1>
        </div>

        <!-- メインタイマーカード -->
        <div class="theme-container backdrop-blur-lg rounded-2xl p-6 md:p-8 shadow-xl border">
            <!-- セット・サイクル表示 -->
            <div class="text-center mb-3">
                <div class="inline-flex flex-col items-center gap-1">
                    <div class="inline-flex items-center theme-container backdrop-blur-sm rounded-full px-3 py-1 border">
                        <p id="cycle-text" class="text-theme-secondary text-xs font-medium">セット: 0/4 | サイクル: 0/2</p>
                    </div>
                    <div class="inline-flex items-center theme-container backdrop-blur-sm rounded-full px-3 py-1 border">
                        <p id="total-time-text" class="text-theme-secondary text-xs font-medium">総作業時間: 0:00</p>
                    </div>
                </div>
            </div>

            <!-- タイマー表示 -->
            <div class="text-center mb-6">
                <div class="relative">
                    <!-- 円形プログレスバー背景 -->
                    <div class="w-48 h-48 sm:w-56 sm:h-56 mx-auto relative">
                        <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <!-- 背景円 -->
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
                            <!-- プログレス円 -->
                            <circle id="progress-circle" cx="50" cy="50" r="45" fill="none"
                                    stroke="url(#gradient)" stroke-width="3" stroke-linecap="round"
                                    stroke-dasharray="283" stroke-dashoffset="283"
                                    class="transition-all duration-1000 ease-in-out progress-circle"/>
                            <!-- グラデーション定義 -->
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stop-color="var(--primary-start)" stop-opacity="1" />
                                    <stop offset="100%" stop-color="var(--primary-end)" stop-opacity="1" />
                                </linearGradient>
                            </defs>
                        </svg>

                        <!-- 中央のタイマー表示 -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="text-center">
                                <div class="text-3xl sm:text-4xl md:text-5xl font-mono font-bold text-theme-primary mb-1">
                                    <span id="minutes">25</span><span class="text-theme-accent">:</span><span id="seconds">00</span>
                                </div>
                                <div class="text-theme-secondary text-xs uppercase tracking-wider font-semibold" id="phase-indicator">
                                    集中タイム
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- コントロールボタン -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button id="start-pause-btn"
                        class="group relative w-16 h-16 gradient-primary hover:scale-110 btn-primary
                               text-white font-bold text-lg rounded-full shadow-lg transform transition-all duration-200
                               active:scale-95 border
                               flex items-center justify-center">
                    <!-- 再生/一時停止アイコン -->
                    <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path id="play-icon" d="M8 5v14l11-7z"/>
                        <g id="pause-icon" style="display: none;">
                            <rect x="6" y="4" width="4" height="16"/>
                            <rect x="14" y="4" width="4" height="16"/>
                        </g>
                    </svg>
                    <div class="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>

                <button id="reset-btn"
                        class="group relative w-12 h-12 gradient-secondary hover:scale-110
                               text-white font-bold text-sm rounded-full shadow-lg transform transition-all duration-200
                               active:scale-95 border
                               flex items-center justify-center">
                    <!-- リセットアイコン -->
                    <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                    <div class="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </button>
            </div>

            <!-- スマートフォン向け注意書き -->
            <div id="mobile-notice" class="mt-6 hidden">
                <div class="theme-container backdrop-blur-sm rounded-lg p-4 border border-yellow-500/30 bg-yellow-500/10">
                    <div class="flex items-start gap-3">
                        <svg class="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                        </svg>
                        <div>
                            <p class="text-yellow-500 text-xs font-semibold mb-1">スマートフォンでご利用の方へ</p>
                            <p class="text-theme-secondary text-xs leading-relaxed">
                                スマホの仕様上、このページを開いていないとタイマーが停止します。タイマー動作中は画面がロックされないので、画面輝度を下げることをおすすめします。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- フッター -->
        <div class="text-center mt-6">
            <p class="text-theme-secondary/70 text-xs">

            </p>
        </div>
    </div>

    <script src="../../dist/script.js"></script>
</body>
</html>
EOF

# プレースホルダーを実際の値に置換
sed -i '' "s/VTUBER_NAME/${NAME}/g" "timers/${SLUG}/index.html"
sed -i '' "s/VTUBER_SLUG/${SLUG}/g" "timers/${SLUG}/index.html"

echo "✓ timers/${SLUG}/index.html を作成しました"

echo ""
echo "========================================="
echo "次の手順を実行してください:"
echo "========================================="
echo ""
echo "1. 画像ファイルを配置:"
echo "   timers/${SLUG}/${SLUG}.jpg"
echo ""
echo "2. 音声ファイルを配置 (timers/${SLUG}/ 内):"
echo "   - start.mp3 (開始時)"
echo "   - break1.mp3, break2.mp3, break3.mp3 (休憩時)"
echo "   - resume1.mp3, resume2.mp3, resume3.mp3, resume4.mp3 (再開時)"
echo "   - long_break.mp3 (長休憩時)"
echo "   - complete.mp3 (完了時)"
echo ""
echo "3. src/script.ts を編集:"
echo "   vtuberThemes オブジェクトに以下を追加:"
echo "   '${SLUG}': '${THEME}',"
echo ""
echo "4. ビルド実行:"
echo "   npm run build"
echo ""
echo "5. index.html にリンクを追加:"
echo "   <!-- ${SLUG} -->"
echo "   <a href=\"timers/${SLUG}/\""
echo "      class=\"group bg-white/70 backdrop-blur-sm rounded-lg p-3 border border-blue-200/50"
echo "             hover:bg-white/90 hover:shadow-md transition-all duration-200 hover:scale-105 flex flex-col items-center\">"
echo "       <div class=\"w-12 h-12 rounded-full overflow-hidden border border-blue-200/70 mb-2\">"
echo "           <img src=\"timers/${SLUG}/${SLUG}.jpg\""
echo "                alt=\"${NAME}\""
echo "                class=\"w-full h-full object-cover\""
echo "                onerror=\"this.parentElement.innerHTML='<div class=&quot;w-full h-full bg-blue-100 flex items-center justify-center&quot;><svg class=&quot;w-6 h-6 text-blue-600&quot; fill=&quot;none&quot; stroke=&quot;currentColor&quot; viewBox=&quot;0 0 24 24&quot;><path stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot; stroke-width=&quot;2&quot; d=&quot;M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z&quot;/></svg></div>'\">"
echo "       </div>"
echo "       <span class=\"text-xs font-medium text-gray-700 text-center leading-tight\">${NAME}</span>"
echo "   </a>"
echo ""
echo "========================================="
