# プロジェクト構造説明

## ディレクトリ構造

```
vtimer/
├── README.md                # プロジェクト概要
├── DEVELOPMENT.md           # 開発者ガイド
├── ARCHITECTURE.md          # このファイル
├── package.json            # NPM設定・依存関係
├── tsconfig.json           # TypeScript設定
├── index.html              # メイン画面（キャラクター選択）
│
├── src/                    # TypeScriptソースコード
│   └── script.ts           # メインのタイマーロジック
│
├── dist/                   # コンパイル済みJavaScript
│   └── script.js           # script.tsのコンパイル結果
│
├── timers/                 # 各キャラクター用タイマーページ
│   ├── vt1.html           # VTuber1用タイマー
│   └── vt2.html           # VTuber2用タイマー（予定）
│
├── assets/                 # 静的リソース
│   ├── style.css          # アプリケーション共通スタイル
│   └── images/            # キャラクター画像
│       ├── vt1_icon.png   # VTuber1アイコン
│       └── vt2_icon.png   # VTuber2アイコン
│
├── voices/                 # 音声ファイル（キャラクター別）
│   ├── vt1/               # VTuber1の音声ファイル
│   │   ├── work_start_1.mp3
│   │   ├── break_start_1.mp3
│   │   └── ...
│   └── vt2/               # VTuber2の音声ファイル（予定）
│       └── ...
└── node_modules/          # NPM依存関係（.gitignoreで除外）
```

## ファイル詳細説明

### 設定ファイル

#### `package.json`
- プロジェクトのメタデータ
- NPM依存関係の定義
- ビルドスクリプトの定義

#### `tsconfig.json`
- TypeScriptコンパイラの設定
- 出力ディレクトリ（dist/）の指定
- コンパイルオプションの設定

### HTMLファイル

#### `index.html`
- アプリケーションのエントリーポイント
- キャラクター選択UI
- 各キャラクター用タイマーページへのナビゲーション

#### `timers/*.html`
- 各キャラクター専用のタイマーページ
- `data-vtuber-id`属性でキャラクターを識別
- 共通のタイマーUIとscript.jsを使用

### TypeScript/JavaScriptファイル

#### `src/script.ts`
- **役割**: メインのアプリケーションロジック
- **機能**:
  - タイマーの状態管理
  - シーケンスの進行制御
  - UI更新処理
  - 音声再生制御
- **依存関係**: なし（Pure TypeScript + DOM API）

#### `dist/script.js`
- `src/script.ts`のコンパイル結果
- ブラウザで実行される実際のJavaScript
- `npm run build`で生成

### スタイルファイル

#### `assets/style.css`
- アプリケーション全体の共通スタイル
- レスポンシブデザイン対応
- タイマーUI、ボタン、レイアウトのスタイル定義

### メディアファイル

#### `assets/images/`
- キャラクターのアイコン画像
- PNG形式推奨（透明背景対応）
- サイズ: 150x150px推奨

#### `voices/[character-id]/`
- キャラクター別の音声ファイル
- MP3形式（Web互換性のため）
- ファイル命名規則:
  - `work_start_[1-8].mp3`: 作業開始音声
  - `break_start_[1-8].mp3`: 休憩開始音声
  - `long_break_start.mp3`: 長休憩開始音声

## データフロー

```
1. ユーザーアクション（ボタンクリック）
   ↓
2. script.ts内のイベントハンドラー
   ↓
3. 状態変数の更新（isRunning, sequenceIndex, timeInSeconds）
   ↓
4. UI更新（updateDisplay関数）
   ↓
5. DOM要素の内容変更（時間表示、ステータステキスト）
```

## シーケンス管理

```
sequenceIndex: 0  → 作業フェーズ1（25分）
sequenceIndex: 1  → 休憩フェーズ1（5分）
sequenceIndex: 2  → 作業フェーズ2（25分）
...
sequenceIndex: 8  → 長休憩（10分）
sequenceIndex: 9  → 作業フェーズ5（25分）
...
sequenceIndex: 16 → 最終休憩フェーズ（5分）
```

## 状態管理

### グローバル変数

| 変数名 | 型 | 役割 |
|--------|----|----|
| `timerId` | `number \| null` | setIntervalのID管理 |
| `isRunning` | `boolean` | タイマー実行状態 |
| `sequenceIndex` | `number` | 現在のシーケンス位置 |
| `timeInSeconds` | `number` | 残り時間（秒単位） |

### 状態遷移

```
[停止] → [実行] → [一時停止] → [実行] → [停止]
  ↑                                      ↓
  ← [リセット] ←←←←←←←←←←←←←←←←←←←←←←←←
```

## 拡張ポイント

### 新キャラクター追加
1. `timers/[new-id].html`の作成
2. `voices/[new-id]/`ディレクトリと音声ファイルの配置
3. `assets/images/[new-id]_icon.png`の配置
4. `index.html`への選択オプション追加

### 機能拡張
- **設定機能**: 時間設定をローカルストレージで保存
- **統計機能**: 完了セット数をトラッキング
- **テーマ機能**: CSS変数でカラーテーマ切り替え
- **PWA対応**: Service Workerでオフライン機能

## セキュリティ考慮事項

- XSS対策: `textContent`を使用（`innerHTML`は使用しない）
- ファイルパス: 相対パスのみ使用、ディレクトリトラバーサル防止
- 音声ファイル: ユーザー入力によるパス操作を防止