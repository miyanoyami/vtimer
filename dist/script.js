var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// DOM要素の取得と型アサーション
var minutesEl = document.getElementById('minutes');
var secondsEl = document.getElementById('seconds');
var startPauseBtn = document.getElementById('start-pause-btn');
var resetBtn = document.getElementById('reset-btn');
var statusTextEl = document.getElementById('status-text');
var cycleTextEl = document.getElementById('cycle-text');
var totalTimeTextEl = document.getElementById('total-time-text');
var progressCircleEl = document.getElementById('progress-circle');
var phaseIndicatorEl = document.getElementById('phase-indicator');
var playIconEl = document.getElementById('play-icon');
var pauseIconEl = document.getElementById('pause-icon');
var mobileNoticeEl = document.getElementById('mobile-notice');
// デバッグモード設定（URLクエリパラメータで制御）
// 使用例: ?debug=1（高速）, ?debug=2（1分単位）, パラメータなし（本番）
var urlParams = new URLSearchParams(window.location.search);
var debugParam = urlParams.get('debug');
var DEBUG_LEVEL = debugParam ? parseInt(debugParam) : 0;
if (DEBUG_LEVEL === 1) {
    console.log('%c デバッグモード（高速）', 'color: #ff6b6b; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 15秒 | 短休憩: 5秒 | 長休憩: 10秒');
}
else if (DEBUG_LEVEL === 2) {
    console.log('%c デバッグモード（1分単位）', 'color: #ffa94d; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 1分 | 短休憩: 15秒 | 長休憩: 30秒');
}
else {
    console.log('%c 本番モード', 'color: #51cf66; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 25分 | 短休憩: 5分 | 長休憩: 15分');
}
// VTuber IDをHTMLから取得
var vtuberId = document.body.dataset.vtuberId;
if (!vtuberId) {
    console.error("VTuber IDが設定されていません。bodyタグに data-vtuber-id を設定してください。");
}
// VTuber IDとテーマのマッピング
var vtuberThemes = {
    'yaoaoi': 'forest', // Ocean Blue (デフォルト)
    'niwawamizuku': 'ocean', // Sakura Pink
    'suwaponta': 'wood',
    'naokurotama': 'black',
    'yamabukiorca': 'sunset',
    'yagiruchiru': 'ocean',
    'takanose_rin': 'violet',
    'mutunotatami': 'sakura',
    'nekoyan': 'sakura',
    'perkigyampark': 'violet',
    'kaijyukun': 'ocean',
    'miyanoyami': 'white',
    'exceliruka': 'ocean',
    'raymugi': 'sunset',
    'hoshiniichi': 'black',
    'inuhoshihitsuji': 'white',
    'yoinotowahoshi': 'white',
    'kirisakitoca': 'ruby',
    'orenonanase': 'sakura',
    'yumeriALP': 'violet',
    'kirarinsentaikatamugiko': 'forest',
    'momonokikanari': 'sakura',
    'shiromichan': 'white',
};
// テーマ適用関数
function applyTheme(vtuberId) {
    var theme = vtuberThemes[vtuberId] || 'default';
    if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    }
    else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    console.log("\u30C6\u30FC\u30DE '".concat(theme, "' \u3092 VTuber ID '").concat(vtuberId, "' \u306B\u9069\u7528\u3057\u307E\u3057\u305F"));
}
// 初期化時にテーマを適用
if (vtuberId) {
    applyTheme(vtuberId);
}
// 時間定義（本番用）
var WORK_TIME = 25 * 60; // 25分
var SHORT_BREAK = 5 * 60; // 5分
var LONG_BREAK = 15 * 60; // 15分
// デバッグ用時間（レベル1: 高速）
var DEBUG1_WORK_TIME = 12; // 15秒
var DEBUG1_SHORT_BREAK = 6; // 5秒
var DEBUG1_LONG_BREAK = 10; // 10秒
// デバッグ用時間（レベル2: 1分単位）
var DEBUG2_WORK_TIME = 30; // 1分
var DEBUG2_SHORT_BREAK = 15; // 15秒
var DEBUG2_LONG_BREAK = 20; // 30秒
// デバッグレベルに応じた時間を返す関数
function getTime(prodTime, debug1Time, debug2Time) {
    if (DEBUG_LEVEL === 1)
        return debug1Time;
    if (DEBUG_LEVEL === 2)
        return debug2Time;
    return prodTime;
}
// タイマーシーケンス (全16フェーズ)
var sequence = [
    // 1st Cycle - Set 1
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'start.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break1.mp3' },
    // 1st Cycle - Set 2
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume1.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break2.mp3' },
    // 1st Cycle - Set 3
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume2.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break3.mp3' },
    // 1st Cycle - Set 4
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume3.mp3' },
    { type: '長休憩', duration: getTime(LONG_BREAK, DEBUG1_LONG_BREAK, DEBUG2_LONG_BREAK), voice: 'long_break.mp3' },
    // 2nd Cycle - Set 1
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume1.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break1.mp3' },
    // 2nd Cycle - Set 2
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume2.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break2.mp3' },
    // 2nd Cycle - Set 3
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume3.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG1_SHORT_BREAK, DEBUG2_SHORT_BREAK), voice: 'break3.mp3' },
    // 2nd Cycle - Set 4
    { type: '集中', duration: getTime(WORK_TIME, DEBUG1_WORK_TIME, DEBUG2_WORK_TIME), voice: 'resume4.mp3' },
    { type: '終了', duration: 0, voice: 'complete.mp3' },
];
// 状態管理変数に型を付与
var timerId = null;
var isRunning = false;
var sequenceIndex = 0;
var timeInSeconds = sequence[sequenceIndex].duration;
var totalTimeInSeconds = sequence[sequenceIndex].duration;
var totalWorkTimeInSeconds = 0; // 総作業時間（集中時間のみカウント）
var phaseStartTime = 0; // フェーズ開始時刻（実時間）
var pausedRemaining = 0; // 一時停止時の残り時間
var currentPhaseWorkTime = 0; // 現在のフェーズで経過した作業時間
// Wake Lock 関連の変数
var wakeLock = null;
// Wake Lock を取得する関数
function requestWakeLock() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    if (!('wakeLock' in navigator)) return [3 /*break*/, 2];
                    return [4 /*yield*/, navigator.wakeLock.request('screen')];
                case 1:
                    wakeLock = _a.sent();
                    console.log('Wake Lock が有効になりました');
                    // Wake Lock が解放された場合のイベントリスナー
                    wakeLock.addEventListener('release', function () {
                        console.log('Wake Lock が解放されました');
                    });
                    return [3 /*break*/, 3];
                case 2:
                    console.warn('このブラウザは Wake Lock API をサポートしていません');
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.error('Wake Lock の取得に失敗:', err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
// Wake Lock を解放する関数
function releaseWakeLock() {
    return __awaiter(this, void 0, void 0, function () {
        var err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(wakeLock !== null)) return [3 /*break*/, 4];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, wakeLock.release()];
                case 2:
                    _a.sent();
                    wakeLock = null;
                    console.log('Wake Lock を解放しました');
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error('Wake Lock の解放に失敗:', err_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// LocalStorage キー
var STORAGE_KEYS = {
    VTUBER_ID: 'timer_vtuberId',
    IS_RUNNING: 'timer_isRunning',
    SEQUENCE_INDEX: 'timer_sequenceIndex',
    PHASE_START_TIME: 'timer_phaseStartTime',
    TOTAL_DURATION: 'timer_totalDuration',
    TOTAL_WORK_TIME: 'timer_totalWorkTime',
    PAUSED_REMAINING: 'timer_pausedRemaining',
    LAST_ACCESS_TIME: 'timer_lastAccessTime',
};
// LocalStorage に状態を保存
function saveState() {
    localStorage.setItem(STORAGE_KEYS.VTUBER_ID, vtuberId || '');
    localStorage.setItem(STORAGE_KEYS.IS_RUNNING, String(isRunning));
    localStorage.setItem(STORAGE_KEYS.SEQUENCE_INDEX, String(sequenceIndex));
    localStorage.setItem(STORAGE_KEYS.PHASE_START_TIME, String(phaseStartTime));
    localStorage.setItem(STORAGE_KEYS.TOTAL_DURATION, String(totalTimeInSeconds));
    localStorage.setItem(STORAGE_KEYS.TOTAL_WORK_TIME, String(totalWorkTimeInSeconds));
    localStorage.setItem(STORAGE_KEYS.PAUSED_REMAINING, String(pausedRemaining));
    localStorage.setItem(STORAGE_KEYS.LAST_ACCESS_TIME, String(Date.now()));
}
// LocalStorage から状態を復元
function loadState() {
    var savedVtuberId = localStorage.getItem(STORAGE_KEYS.VTUBER_ID);
    var savedIsRunning = localStorage.getItem(STORAGE_KEYS.IS_RUNNING);
    var savedLastAccessTime = localStorage.getItem(STORAGE_KEYS.LAST_ACCESS_TIME);
    // VTuber IDが変わった場合はリセット
    if (savedVtuberId !== vtuberId) {
        clearState();
        return false;
    }
    // 6時間以上経過している場合はリセット
    if (savedLastAccessTime) {
        var lastAccess = parseInt(savedLastAccessTime);
        var now = Date.now();
        var sixHours = 6 * 60 * 60 * 1000;
        if (now - lastAccess > sixHours) {
            clearState();
            return false;
        }
    }
    if (savedIsRunning === null)
        return false;
    isRunning = savedIsRunning === 'true';
    sequenceIndex = parseInt(localStorage.getItem(STORAGE_KEYS.SEQUENCE_INDEX) || '0');
    phaseStartTime = parseInt(localStorage.getItem(STORAGE_KEYS.PHASE_START_TIME) || '0');
    totalTimeInSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_DURATION) || String(sequence[0].duration));
    totalWorkTimeInSeconds = parseInt(localStorage.getItem(STORAGE_KEYS.TOTAL_WORK_TIME) || '0');
    pausedRemaining = parseInt(localStorage.getItem(STORAGE_KEYS.PAUSED_REMAINING) || '0');
    // インデックスの妥当性チェック
    if (sequenceIndex >= sequence.length) {
        clearState();
        return false;
    }
    return true;
}
// LocalStorage の状態をクリア
function clearState() {
    Object.values(STORAGE_KEYS).forEach(function (key) { return localStorage.removeItem(key); });
}
// 音声設定
var audioSettings = {
    volume: 1.0, // 基本音量 (0.0 - 1.0)
    globalBoost: 1.0, // グローバル音量ブースト（1.0が最大、それ以上は効果なし）
    fadeInDuration: 200, // フェードイン時間 (ms)
};
// 音声再利用のための Audio オブジェクト
var audioPlayer = null;
var audioUnlocked = false;
// 音声コンテキストのアンロック（スマートフォン対応）
function unlockAudio() {
    if (audioUnlocked)
        return;
    if (!audioPlayer) {
        audioPlayer = new Audio();
    }
    // data URI で無音の音声を作成してアンロック
    audioPlayer.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    audioPlayer.volume = 0.01; // 音量を最小に
    var silentPromise = audioPlayer.play();
    if (silentPromise !== undefined) {
        silentPromise.then(function () {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            audioPlayer.volume = 1.0; // 音量を元に戻す
            audioUnlocked = true;
            console.log('音声コンテキストをアンロックしました');
        }).catch(function () {
            // エラーでも問題ない（後続の再生で自動的にアンロックされる）
            audioUnlocked = true;
        });
    }
}
// 音声再生関数（音量調整機能付き）
function playVoice(filename) {
    if (!vtuberId)
        return; // IDがなければ何もしない
    var audioPath = "".concat(filename);
    // Audio オブジェクトを再利用
    if (!audioPlayer) {
        audioPlayer = new Audio();
    }
    // ファイル別の音量微調整
    var volumeAdjustments = {
        'start.mp3': 1.0,
        'complete.mp3': 1.0,
        'long_break1.mp3': 1.0,
        'break1.mp3': 1.0,
        'break2.mp3': 1.0,
        'break3.mp3': 1.0,
        'break4.mp3': 1.0,
        'resume1.mp3': 1.0,
        'resume2.mp3': 1.0,
        'resume3.mp3': 1.0,
    };
    // ファイル固有の音量調整を適用（最大1.0に制限）
    var adjustment = volumeAdjustments[filename] || 1.0;
    audioPlayer.volume = Math.min(1.0, audioSettings.volume * adjustment * audioSettings.globalBoost);
    // 音源を設定して再生
    audioPlayer.src = audioPath;
    audioPlayer.load();
    var playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(function (error) {
            console.error("音声の再生に失敗:", error, "Path:", audioPath);
        });
    }
    console.log("\u97F3\u58F0\u518D\u751F: ".concat(filename, " (\u97F3\u91CF: ").concat((audioPlayer.volume * 100).toFixed(0), "%)"));
}
// 音量設定変更関数（将来的な拡張用）
function setGlobalVolume(volume) {
    audioSettings.volume = Math.max(0, Math.min(1, volume));
    console.log("\u97F3\u91CF\u3092".concat((audioSettings.volume * 100).toFixed(0), "%\u306B\u8A2D\u5B9A\u3057\u307E\u3057\u305F"));
}
// UI更新関数
function updateDisplay() {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = timeInSeconds % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
    // 総作業時間の表示更新（累積時間 + 現在のフェーズの経過時間）
    var displayWorkTime = totalWorkTimeInSeconds + currentPhaseWorkTime;
    var totalHours = Math.floor(displayWorkTime / 3600);
    var totalMinutes = Math.floor((displayWorkTime % 3600) / 60);
    if (totalTimeTextEl) {
        totalTimeTextEl.textContent = "\u7DCF\u4F5C\u696D\u6642\u9593: ".concat(totalHours, ":").concat(String(totalMinutes).padStart(2, '0'));
    }
    var currentPhase = sequence[sequenceIndex];
    if (currentPhase) {
        // フェーズインジケーターの更新
        if (phaseIndicatorEl) {
            phaseIndicatorEl.textContent = "".concat(currentPhase.type);
        }
        // 円形プログレスバーの更新
        updateProgressCircle();
        // アニメーション効果の適用
        updateAnimations(currentPhase.type);
        // サイクル/セット数の表示ロジックを修正
        if (currentPhase.type === '終了') {
            // 終了フェーズは最終セット・サイクルを表示
            cycleTextEl.textContent = "\u30BB\u30C3\u30C8: 4/4 | \u30B5\u30A4\u30AF\u30EB: 2/2";
        }
        else if (sequenceIndex <= 7) { // 1st Cycle
            var set = Math.floor(sequenceIndex / 2) + 1;
            cycleTextEl.textContent = "\u30BB\u30C3\u30C8: ".concat(set, "/4 | \u30B5\u30A4\u30AF\u30EB: 1/2");
        }
        else if (sequenceIndex > 7) { // 2nd Cycle (長休憩後)
            var set = Math.floor((sequenceIndex - 8) / 2) + 1;
            cycleTextEl.textContent = "\u30BB\u30C3\u30C8: ".concat(set, "/4 | \u30B5\u30A4\u30AF\u30EB: 2/2");
        }
    }
    else {
        cycleTextEl.textContent = '';
        if (phaseIndicatorEl) {
            phaseIndicatorEl.textContent = '完了';
        }
        // 完了時の祝福アニメーション
        var timerContainer_1 = document.querySelector('.bg-white\\/10');
        if (timerContainer_1) {
            timerContainer_1.classList.add('celebration-animation');
            setTimeout(function () {
                timerContainer_1.classList.remove('celebration-animation');
            }, 600);
        }
    }
}
// 円形プログレスバー更新関数
function updateProgressCircle() {
    if (!progressCircleEl)
        return;
    var progress = (totalTimeInSeconds - timeInSeconds) / totalTimeInSeconds;
    var circumference = 283; // 2 * π * 45 (半径45の円周)
    var offset = circumference - (progress * circumference);
    progressCircleEl.style.strokeDashoffset = offset.toString();
    // プログレス円にパルスアニメーションを追加
    if (isRunning) {
        progressCircleEl.classList.add('progress-pulse');
    }
    else {
        progressCircleEl.classList.remove('progress-pulse');
    }
}
// アニメーション管理関数
function updateAnimations(phaseType) {
    var timerContainer = document.querySelector('.bg-white\\/10');
    if (!timerContainer)
        return;
    // 既存のアニメーションクラスを削除
    timerContainer.classList.remove('working-animation');
    // 集中フェーズのみパルスアニメーションを適用
    if (isRunning && phaseType === '集中') {
        timerContainer.classList.add('working-animation');
    }
    // フェーズインジケーターにフェードインアニメーション
    if (phaseIndicatorEl) {
        phaseIndicatorEl.classList.remove('status-fade-in');
        void phaseIndicatorEl.offsetWidth; // リフローを強制
        phaseIndicatorEl.classList.add('status-fade-in');
    }
}
// 次のシーケンスに進む関数
function nextSequence() {
    sequenceIndex++;
    if (sequenceIndex >= sequence.length) {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        isRunning = false;
        clearState(); // 完了時は状態をクリア
        updateButtonIcon();
        // タイマー完了時に Wake Lock を解放
        releaseWakeLock();
        return;
    }
    var nextPhase = sequence[sequenceIndex];
    timeInSeconds = nextPhase.duration;
    totalTimeInSeconds = nextPhase.duration;
    phaseStartTime = Date.now(); // 新しいフェーズの開始時刻を設定
    playVoice(nextPhase.voice);
    updateDisplay();
    saveState();
    // 終了フェーズの場合はカウントダウンせずに完了処理
    if (nextPhase.type === '終了') {
        if (timerId) {
            clearTimeout(timerId);
            timerId = null;
        }
        isRunning = false;
        clearState();
        updateButtonIcon();
        releaseWakeLock();
        return;
    }
    // 次のカウントダウンをスケジュール
    if (isRunning) {
        timerId = window.setTimeout(countdown, 100);
    }
}
// カウントダウン関数（Date.nowベースの正確な時間管理）
function countdown() {
    if (!isRunning)
        return;
    var now = Date.now();
    var elapsed = Math.floor((now - phaseStartTime) / 1000);
    var remaining = totalTimeInSeconds - elapsed;
    if (remaining > 0) {
        timeInSeconds = remaining;
        // 集中時間の場合のみ総作業時間をカウント
        if (sequence[sequenceIndex].type === '集中') {
            currentPhaseWorkTime = elapsed;
        }
        updateDisplay();
        saveState(); // 状態を保存
        // setTimeout で次の更新をスケジュール（より正確）
        timerId = window.setTimeout(countdown, 100);
    }
    else {
        timeInSeconds = 0;
        // フェーズ完了時に作業時間を加算（経過時間を加算）
        if (sequence[sequenceIndex].type === '集中') {
            totalWorkTimeInSeconds += elapsed; // 修正: totalTimeInSecondsではなくelapsed
            currentPhaseWorkTime = 0;
        }
        updateDisplay();
        nextSequence();
    }
}
// アイコン表示切り替え関数
function updateButtonIcon() {
    if (isRunning) {
        playIconEl.style.display = 'none';
        pauseIconEl.style.display = 'block';
    }
    else {
        playIconEl.style.display = 'block';
        pauseIconEl.style.display = 'none';
    }
}
// 開始・一時停止ボタンの処理
startPauseBtn.addEventListener('click', function () {
    // スマートフォン対応: 最初のクリックで音声をアンロック
    unlockAudio();
    // 完了後または終了フェーズの場合はリセット
    if (sequenceIndex >= sequence.length || (sequenceIndex < sequence.length && sequence[sequenceIndex].type === '終了')) {
        sequenceIndex = 0;
        timeInSeconds = sequence[0].duration;
        totalTimeInSeconds = sequence[0].duration;
        totalWorkTimeInSeconds = 0;
        currentPhaseWorkTime = 0;
        phaseStartTime = 0;
        pausedRemaining = 0;
        clearState();
        updateDisplay();
    }
    isRunning = !isRunning;
    if (isRunning) {
        // 最初の再生
        if (pausedRemaining === 0 && timeInSeconds === sequence[sequenceIndex].duration) {
            playVoice(sequence[sequenceIndex].voice);
            phaseStartTime = Date.now();
        }
        else {
            // 一時停止から再開の場合：経過時間を考慮して開始時刻を調整
            var elapsed = totalTimeInSeconds - timeInSeconds;
            phaseStartTime = Date.now() - (elapsed * 1000);
        }
        countdown(); // setTimeoutを使うので直接呼び出し
        saveState();
        // Wake Lock を取得
        requestWakeLock();
    }
    else {
        if (timerId) {
            clearTimeout(timerId); // setTimeoutに変更
            timerId = null;
        }
        pausedRemaining = timeInSeconds;
        saveState();
        // Wake Lock を解放
        releaseWakeLock();
    }
    updateButtonIcon();
});
// リセットボタンの処理
resetBtn.addEventListener('click', function () {
    if (timerId) {
        clearTimeout(timerId);
        timerId = null;
    }
    isRunning = false;
    sequenceIndex = 0;
    timeInSeconds = sequence[0].duration;
    totalTimeInSeconds = sequence[0].duration;
    totalWorkTimeInSeconds = 0; // 総作業時間もリセット
    currentPhaseWorkTime = 0;
    phaseStartTime = 0;
    pausedRemaining = 0;
    clearState(); // LocalStorageもクリア
    cycleTextEl.textContent = 'セット: 0/4 | サイクル: 0/2';
    if (phaseIndicatorEl) {
        phaseIndicatorEl.textContent = '集中タイム';
    }
    updateButtonIcon();
    updateDisplay();
    // Wake Lock を解放
    releaseWakeLock();
});
// 初期化処理
function initialize() {
    // デバッグモードの場合は常にlocalStorageをクリア
    if (DEBUG_LEVEL > 0) {
        clearState();
        console.log('デバッグモード: localStorage をクリアしました');
    }
    // LocalStorageから状態を復元
    var restored = loadState();
    if (restored) {
        // ページ遷移から戻ってきた場合
        // 実行中だった場合でも一時停止状態にする
        if (isRunning) {
            var now = Date.now();
            var elapsed = Math.floor((now - phaseStartTime) / 1000);
            var remaining = totalTimeInSeconds - elapsed;
            if (remaining > 0) {
                timeInSeconds = remaining;
                pausedRemaining = remaining;
            }
            else {
                // 時間切れの場合は0にリセット
                timeInSeconds = 0;
                pausedRemaining = 0;
            }
            // 一時停止状態にする
            isRunning = false;
            saveState();
        }
        else {
            // 元々一時停止中だった場合
            timeInSeconds = pausedRemaining;
        }
    }
    updateDisplay();
    updateButtonIcon();
}
// ページアンロード時の処理（リロード、閉じる、遷移時）
window.addEventListener('beforeunload', function () {
    if (isRunning) {
        // 実行中の場合、現在の残り時間を計算して一時停止状態で保存
        var now = Date.now();
        var elapsed = Math.floor((now - phaseStartTime) / 1000);
        var remaining = totalTimeInSeconds - elapsed;
        if (remaining > 0) {
            pausedRemaining = remaining;
        }
        else {
            pausedRemaining = 0;
        }
        isRunning = false;
        saveState();
    }
    // Wake Lock を解放
    releaseWakeLock();
});
// スマートフォン検出関数
function isMobileDevice() {
    // ユーザーエージェントによる判定
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    var mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    // タッチデバイスかつ画面幅が狭い場合もモバイルと判定
    var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    var isNarrowScreen = window.innerWidth <= 768;
    return mobileRegex.test(userAgent) || (isTouchDevice && isNarrowScreen);
}
// モバイル注意書きの表示
function showMobileNotice() {
    if (mobileNoticeEl && isMobileDevice()) {
        mobileNoticeEl.classList.remove('hidden');
        console.log('スマートフォンを検出しました。注意書きを表示します。');
    }
}
// 2連続クリックでデバッグモード切り替え（隠しコマンド）
var clickCount = 0;
var clickTimer = null;
var lastClickTime = 0;
phaseIndicatorEl.addEventListener('click', function () {
    var now = Date.now();
    var timeSinceLastClick = now - lastClickTime;
    lastClickTime = now;
    // ダブルクリック判定（500ms以内）
    if (timeSinceLastClick < 500) {
        clickCount++;
    }
    else {
        clickCount = 1;
    }
    if (clickTimer) {
        clearTimeout(clickTimer);
    }
    if (clickCount >= 2) {
        // 2回クリックされたらデバッグモードを切り替え
        var currentUrl = new URL(window.location.href);
        var currentDebug = currentUrl.searchParams.get('debug');
        if (!currentDebug || currentDebug === '0') {
            // デバッグモード1に切り替え
            currentUrl.searchParams.set('debug', '1');
        }
        else if (currentDebug === '1') {
            // デバッグモード2に切り替え
            currentUrl.searchParams.set('debug', '2');
        }
        else {
            // 通常モードに戻す
            currentUrl.searchParams.delete('debug');
        }
        // ページをリロード
        window.location.href = currentUrl.toString();
        return;
    }
    // 500ms以内に次のクリックがなければカウントをリセット
    clickTimer = window.setTimeout(function () {
        clickCount = 0;
    }, 500);
});
// ページロード時に初期化
initialize();
showMobileNotice();
