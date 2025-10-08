# 開発者ガイド

## 概要

VTimerは、25分間の集中作業と短い休憩を繰り返す時間管理手法を実装したWebアプリケーションです。TypeScriptとWeb標準技術を使用して構築されています。

## アーキテクチャ

### 全体構成

```
Browser Environment
├── HTML Pages (index.html, timers/*.html)
├── TypeScript Logic (src/script.ts)
├── CSS Styling (assets/style.css)
└── Media Assets (voices/, assets/images/)
```

### コンポーネント構成

1. **Timer Core** (`src/script.ts`)
   - シーケンス管理
   - タイマー機能
   - UI更新
   - 音声制御

2. **UI Layer** (HTML/CSS)
   - キャラクター選択画面
   - タイマー表示画面
   - コントロールボタン

3. **Asset Management**
   - 音声ファイル管理
   - 画像リソース管理

## 開発環境セットアップ

### 前提条件

- Node.js 18+ 
- TypeScript 5.0+
- モダンブラウザ（Chrome, Firefox, Safari, Edge）

### インストール

```bash
# リポジトリのクローン
git clone https://github.com/miyanoyami/vtimer.git
cd vtimer

# 依存関係のインストール
npm install

# TypeScriptコンパイル
npm run build
```

### 開発フロー

1. **コード編集**: `src/script.ts` を編集
2. **コンパイル**: `npm run build` を実行
3. **テスト**: ブラウザで `index.html` を開いて動作確認
4. **デバッグ**: ブラウザの開発者ツールでコンソールログを確認

## コードベース解説

### タイマーシーケンス

```typescript
interface SequencePhase {
    type: '作業' | '休憩' | '長休憩';
    duration: number; // 分単位
    voice: string;     // 音声ファイル名
}
```

17フェーズの完全なシーケンス：
- 1stサイクル: 作業25分→休憩5分 × 4セット
- 長休憩: 10分
- 2ndサイクル: 作業25分→休憩5分 × 4セット

### 状態管理

```typescript
let timerId: number | null = null;     // setIntervalのID
let isRunning: boolean = false;        // 実行状態
let sequenceIndex: number = 0;         // 現在のシーケンス位置
let timeInSeconds: number = ...;       // 残り時間（秒）
```

### 主要関数

- `updateDisplay()`: UI更新（時間表示、ステータス表示）
- `countdown()`: 1秒ごとのカウントダウン処理
- `nextSequence()`: 次のフェーズへの遷移
- `playVoice()`: 音声再生

## 新しいVTuberキャラクターの追加

### 1. HTMLファイルの作成

```html
<!-- timers/[character-id].html -->
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>[Character Name] - 学習タイマー</title>
    <link rel="stylesheet" href="../assets/style.css">
</head>
<body data-vtuber-id="[character-id]">
    <!-- タイマーUI -->
    <script src="../dist/script.js"></script>
</body>
</html>
```

### 2. 音声ファイルの配置

```
voices/
└── [character-id]/
    ├── work_start_1.mp3
    ├── break_start_1.mp3
    ├── work_start_2.mp3
    └── ... (全17ファイル)
```

### 3. 画像ファイルの配置

```
assets/images/
└── [character-id]_icon.png
```

### 4. index.htmlの更新

キャラクター選択画面に新しいキャラクターのリンクを追加。

## テスト

### 手動テスト項目

- [ ] キャラクター選択が正常に動作する
- [ ] タイマーの開始・一時停止・リセットが正常に動作する
- [ ] 音声が適切なタイミングで再生される
- [ ] フェーズ遷移が正確に動作する
- [ ] UI表示が正しく更新される
- [ ] 全シーケンス完了まで動作する

### ブラウザ互換性テスト

- Chrome (最新版)
- Firefox (最新版)  
- Safari (最新版)
- Edge (最新版)

## パフォーマンス考慮事項

- **タイマー精度**: `setInterval`の1秒間隔は概算のため、長時間使用時の累積誤差に注意
- **音声ファイル**: ファイルサイズを適切に圧縮してロード時間を短縮
- **メモリリーク**: `clearInterval`の適切な呼び出しでタイマーのクリーンアップを確保

## トラブルシューティング

### よくある問題

1. **音声が再生されない**
   - ファイルパスの確認
   - ブラウザの自動再生ポリシーの確認
   - 音声ファイル形式の確認

2. **TypeScriptコンパイルエラー**
   - `tsconfig.json`の設定確認
   - 型定義の確認

3. **タイマーが正常に動作しない**
   - DOM要素の存在確認
   - JavaScriptエラーのコンソール確認

## 今後の改善案

- PWA対応でオフライン利用を可能にする
- より正確なタイマー実装（Web Workers使用）
- 設定画面でタイマー時間のカスタマイズ
- 統計機能（完了セット数の記録など）
- より豊富な音声バリエーション