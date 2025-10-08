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
// デバッグモード設定（true: 5秒単位、false: 本番時間）
var DEBUG_MODE = false;
// VTuber IDをHTMLから取得
var vtuberId = document.body.dataset.vtuberId;
if (!vtuberId) {
    console.error("VTuber IDが設定されていません。bodyタグに data-vtuber-id を設定してください。");
}
// VTuber IDとテーマのマッピング
var vtuberThemes = {
    'yaoaoi': 'forest', // Ocean Blue (デフォルト)
    'niwawamizuku': 'ocean', // Sakura Pink
    'sakura': 'sakura', // Sakura Pink
    'forest': 'forest', // Forest Green
    'sunset': 'sunset', // Sunset Orange
    'violet': 'violet' // Violet Night
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
// デバッグ用時間（5秒単位）
var DEBUG_WORK_TIME = 25; // 25秒
var DEBUG_SHORT_BREAK = 5; // 5秒
var DEBUG_LONG_BREAK = 15; // 15秒
// デバッグモードに応じた時間を返す関数
function getTime(prodTime, debugTime) {
    return DEBUG_MODE ? debugTime : prodTime;
}
// タイマーシーケンス (全16フェーズ)
var sequence = [
    // 1st Cycle - Set 1
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'start.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break1.mp3' },
    // 1st Cycle - Set 2
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume1.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break2.mp3' },
    // 1st Cycle - Set 3
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume2.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break3.mp3' },
    // 1st Cycle - Set 4
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume3.mp3' },
    { type: '長休憩', duration: getTime(LONG_BREAK, DEBUG_LONG_BREAK), voice: 'long_break1.mp3' },
    // 2nd Cycle - Set 1
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume1.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break1.mp3' },
    // 2nd Cycle - Set 2
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume2.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break2.mp3' },
    // 2nd Cycle - Set 3
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume3.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'break3.mp3' },
    // 2nd Cycle - Set 4
    { type: '集中', duration: getTime(WORK_TIME, DEBUG_WORK_TIME), voice: 'resume3.mp3' },
    { type: '休憩', duration: getTime(SHORT_BREAK, DEBUG_SHORT_BREAK), voice: 'complete.mp3' },
];
// 状態管理変数に型を付与
var timerId = null;
var isRunning = false;
var sequenceIndex = 0;
var timeInSeconds = sequence[sequenceIndex].duration;
var totalTimeInSeconds = sequence[sequenceIndex].duration;
var totalWorkTimeInSeconds = 0; // 総作業時間（集中時間のみカウント）
// 音声設定
var audioSettings = {
    volume: 1.0, // 基本音量 (0.0 - 1.0)
    globalBoost: 1.0, // グローバル音量ブースト（1.0が最大、それ以上は効果なし）
    fadeInDuration: 200, // フェードイン時間 (ms)
};
// 音声再生関数（音量調整機能付き）
function playVoice(filename) {
    if (!vtuberId)
        return; // IDがなければ何もしない
    var audioPath = "../voices/".concat(vtuberId, "/").concat(filename);
    var audio = new Audio(audioPath);
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
    audio.volume = Math.min(1.0, audioSettings.volume * adjustment * audioSettings.globalBoost);
    // 再生開始
    audio.play().catch(function (error) {
        console.error("音声の再生に失敗:", error, "Path:", audioPath);
    });
    console.log("\u97F3\u58F0\u518D\u751F: ".concat(filename, " (\u97F3\u91CF: ").concat((audio.volume * 100).toFixed(0), "%)"));
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
    // 総作業時間の表示更新
    var totalHours = Math.floor(totalWorkTimeInSeconds / 3600);
    var totalMinutes = Math.floor((totalWorkTimeInSeconds % 3600) / 60);
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
        if (sequenceIndex <= 7) { // 1st Cycle
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
        if (timerId)
            clearInterval(timerId);
        isRunning = false;
        updateButtonIcon();
        return;
    }
    var nextPhase = sequence[sequenceIndex];
    timeInSeconds = nextPhase.duration;
    totalTimeInSeconds = nextPhase.duration;
    playVoice(nextPhase.voice);
    updateDisplay();
}
// カウントダウン関数
function countdown() {
    if (timeInSeconds > 0) {
        timeInSeconds--;
        // 集中時間の場合のみ総作業時間をカウント
        if (sequence[sequenceIndex].type === '集中') {
            totalWorkTimeInSeconds++;
        }
        updateDisplay();
    }
    else {
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
    isRunning = !isRunning;
    if (isRunning) {
        // 最初の再生
        if (timeInSeconds === sequence[sequenceIndex].duration) {
            playVoice(sequence[sequenceIndex].voice);
        }
        timerId = window.setInterval(countdown, 1000);
    }
    else {
        if (timerId)
            clearInterval(timerId);
    }
    updateButtonIcon();
});
// リセットボタンの処理
resetBtn.addEventListener('click', function () {
    if (timerId)
        clearInterval(timerId);
    isRunning = false;
    sequenceIndex = 0;
    timeInSeconds = sequence[0].duration;
    totalTimeInSeconds = sequence[0].duration;
    totalWorkTimeInSeconds = 0; // 総作業時間もリセット
    cycleTextEl.textContent = 'セット: 0/4 | サイクル: 0/2';
    if (phaseIndicatorEl) {
        phaseIndicatorEl.textContent = '集中タイム';
    }
    updateButtonIcon();
    updateDisplay();
});
// 初期表示
updateDisplay();
updateButtonIcon();
