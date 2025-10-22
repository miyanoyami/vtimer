// DOM要素の取得と型アサーション
const minutesEl = document.getElementById('minutes') as HTMLSpanElement;
const secondsEl = document.getElementById('seconds') as HTMLSpanElement;
const startPauseBtn = document.getElementById('start-pause-btn') as HTMLButtonElement;
const resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const statusTextEl = document.getElementById('status-text') as HTMLParagraphElement;
const cycleTextEl = document.getElementById('cycle-text') as HTMLParagraphElement;
const totalTimeTextEl = document.getElementById('total-time-text') as HTMLParagraphElement;
const progressCircleEl = document.getElementById('progress-circle') as unknown as SVGCircleElement;
const phaseIndicatorEl = document.getElementById('phase-indicator') as HTMLElement;
const playIconEl = document.getElementById('play-icon') as unknown as SVGPathElement;
const pauseIconEl = document.getElementById('pause-icon') as unknown as SVGElement;
const mobileNoticeEl = document.getElementById('mobile-notice') as HTMLElement;

// シーケンスの型を定義
interface SequencePhase {
    type: '集中' | '休憩' | '長休憩' | '終了';
    duration: number; // 秒単位
    voice: string;
}

// デバッグモード設定（URLクエリパラメータで制御）
// 使用例: ?debug=1（高速）, ?debug=2（1分単位）, パラメータなし（本番）
const urlParams = new URLSearchParams(window.location.search);
const debugParam = urlParams.get('debug');
const DEBUG_LEVEL = debugParam ? parseInt(debugParam) : 0;

if (DEBUG_LEVEL === 1) {
    console.log('%c デバッグモード（高速）', 'color: #ff6b6b; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 15秒 | 短休憩: 5秒 | 長休憩: 10秒');
} else if (DEBUG_LEVEL === 2) {
    console.log('%c デバッグモード（1分単位）', 'color: #ffa94d; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 1分 | 短休憩: 15秒 | 長休憩: 30秒');
} else {
    console.log('%c 本番モード', 'color: #51cf66; font-weight: bold; font-size: 14px;');
    console.log('作業時間: 25分 | 短休憩: 5分 | 長休憩: 15分');
}

// VTuber IDをHTMLから取得
const vtuberId = document.body.dataset.vtuberId;

if (!vtuberId) {
    console.error("VTuber IDが設定されていません。bodyタグに data-vtuber-id を設定してください。");
}

// VTuber IDとテーマのマッピング
const vtuberThemes: Record<string, string> = {
    'yaoaoi': 'forest',        // Ocean Blue (デフォルト)
    'niwawamizuku': 'ocean',         // Sakura Pink
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
    'shirafujiyui': 'ocean',
    'aozorajion': 'violet',
    'nagazonotanocy': 'ocean',
    'tsukimidaihuku': 'forest',
    'nekomoriayana': 'violet',
};

// テーマ適用関数
function applyTheme(vtuberId: string): void {
    const theme = vtuberThemes[vtuberId] || 'default';
    
    if (theme === 'default') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', theme);
    }
    
    console.log(`テーマ '${theme}' を VTuber ID '${vtuberId}' に適用しました`);
}

// 初期化時にテーマを適用
if (vtuberId) {
    applyTheme(vtuberId);
}

// 時間定義（本番用）
const WORK_TIME = 25 * 60;      // 25分
const SHORT_BREAK = 5 * 60;      // 5分
const LONG_BREAK = 15 * 60;      // 15分

// デバッグ用時間（レベル1: 高速）
const DEBUG1_WORK_TIME = 12;      // 15秒
const DEBUG1_SHORT_BREAK = 6;     // 5秒
const DEBUG1_LONG_BREAK = 10;     // 10秒

// デバッグ用時間（レベル2: 1分単位）
const DEBUG2_WORK_TIME = 30;      // 1分
const DEBUG2_SHORT_BREAK = 15;    // 15秒
const DEBUG2_LONG_BREAK = 20;     // 30秒

// デバッグレベルに応じた時間を返す関数
function getTime(prodTime: number, debug1Time: number, debug2Time: number): number {
    if (DEBUG_LEVEL === 1) return debug1Time;
    if (DEBUG_LEVEL === 2) return debug2Time;
    return prodTime;
}

// タイマーシーケンス (全16フェーズ)
const sequence: SequencePhase[] = [
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
let timerId: number | null = null;
let isRunning: boolean = false;
let sequenceIndex: number = 0;
let timeInSeconds: number = sequence[sequenceIndex].duration;
let totalTimeInSeconds: number = sequence[sequenceIndex].duration;
let totalWorkTimeInSeconds: number = 0; // 総作業時間（集中時間のみカウント）
let phaseStartTime: number = 0; // フェーズ開始時刻（実時間）
let pausedRemaining: number = 0; // 一時停止時の残り時間
let currentPhaseWorkTime: number = 0; // 現在のフェーズで経過した作業時間

// Wake Lock 関連の変数
let wakeLock: WakeLockSentinel | null = null;

// Wake Lock を取得する関数
async function requestWakeLock(): Promise<void> {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock が有効になりました');

            // Wake Lock が解放された場合のイベントリスナー
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock が解放されました');
            });
        } else {
            console.warn('このブラウザは Wake Lock API をサポートしていません');
        }
    } catch (err) {
        console.error('Wake Lock の取得に失敗:', err);
    }
}

// Wake Lock を解放する関数
async function releaseWakeLock(): Promise<void> {
    if (wakeLock !== null) {
        try {
            await wakeLock.release();
            wakeLock = null;
            console.log('Wake Lock を解放しました');
        } catch (err) {
            console.error('Wake Lock の解放に失敗:', err);
        }
    }
}

// LocalStorage キー
const STORAGE_KEYS = {
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
function saveState(): void {
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
function loadState(): boolean {
    const savedVtuberId = localStorage.getItem(STORAGE_KEYS.VTUBER_ID);
    const savedIsRunning = localStorage.getItem(STORAGE_KEYS.IS_RUNNING);
    const savedLastAccessTime = localStorage.getItem(STORAGE_KEYS.LAST_ACCESS_TIME);

    // VTuber IDが変わった場合はリセット
    if (savedVtuberId !== vtuberId) {
        clearState();
        return false;
    }

    // 6時間以上経過している場合はリセット
    if (savedLastAccessTime) {
        const lastAccess = parseInt(savedLastAccessTime);
        const now = Date.now();
        const sixHours = 6 * 60 * 60 * 1000;
        if (now - lastAccess > sixHours) {
            clearState();
            return false;
        }
    }

    if (savedIsRunning === null) return false;

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
function clearState(): void {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

// 音声設定
const audioSettings = {
    volume: 1.0, // 基本音量 (0.0 - 1.0)
    globalBoost: 1.0, // グローバル音量ブースト（1.0が最大、それ以上は効果なし）
    fadeInDuration: 200, // フェードイン時間 (ms)
};

// 音声再利用のための Audio オブジェクト
let audioPlayer: HTMLAudioElement | null = null;
let audioUnlocked = false;

// 音声コンテキストのアンロック（スマートフォン対応）
function unlockAudio(): void {
    if (audioUnlocked) return;

    if (!audioPlayer) {
        audioPlayer = new Audio();
    }

    // data URI で無音の音声を作成してアンロック
    audioPlayer.src = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
    audioPlayer.volume = 0.01; // 音量を最小に

    const silentPromise = audioPlayer.play();
    if (silentPromise !== undefined) {
        silentPromise.then(() => {
            audioPlayer!.pause();
            audioPlayer!.currentTime = 0;
            audioPlayer!.volume = 1.0; // 音量を元に戻す
            audioUnlocked = true;
            console.log('音声コンテキストをアンロックしました');
        }).catch(() => {
            // エラーでも問題ない（後続の再生で自動的にアンロックされる）
            audioUnlocked = true;
        });
    }
}

// 音声再生関数（音量調整機能付き）
function playVoice(filename: string): void {
    if (!vtuberId) return; // IDがなければ何もしない

    const audioPath = `${filename}`;

    // Audio オブジェクトを再利用
    if (!audioPlayer) {
        audioPlayer = new Audio();
    }

    // ファイル別の音量微調整
    const volumeAdjustments: Record<string, number> = {
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
    const adjustment = volumeAdjustments[filename] || 1.0;
    audioPlayer.volume = Math.min(1.0, audioSettings.volume * adjustment * audioSettings.globalBoost);

    // 音源を設定して再生
    audioPlayer.src = audioPath;
    audioPlayer.load();

    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            console.error("音声の再生に失敗:", error, "Path:", audioPath);
        });
    }

    console.log(`音声再生: ${filename} (音量: ${(audioPlayer.volume * 100).toFixed(0)}%)`);
}


// 音量設定変更関数（将来的な拡張用）
function setGlobalVolume(volume: number): void {
    audioSettings.volume = Math.max(0, Math.min(1, volume));
    console.log(`音量を${(audioSettings.volume * 100).toFixed(0)}%に設定しました`);
}

// UI更新関数
function updateDisplay(): void {
    const minutes: number = Math.floor(timeInSeconds / 60);
    const seconds: number = timeInSeconds % 60;
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');

    // 総作業時間の表示更新（累積時間 + 現在のフェーズの経過時間）
    const displayWorkTime = totalWorkTimeInSeconds + currentPhaseWorkTime;
    const totalHours = Math.floor(displayWorkTime / 3600);
    const totalMinutes = Math.floor((displayWorkTime % 3600) / 60);
    if (totalTimeTextEl) {
        totalTimeTextEl.textContent = `総作業時間: ${totalHours}:${String(totalMinutes).padStart(2, '0')}`;
    }

    const currentPhase = sequence[sequenceIndex];
    if (currentPhase) {
        // フェーズインジケーターの更新
        if (phaseIndicatorEl) {
            phaseIndicatorEl.textContent = `${currentPhase.type}`;
        }

        // 円形プログレスバーの更新
        updateProgressCircle();

        // アニメーション効果の適用
        updateAnimations(currentPhase.type);


        // サイクル/セット数の表示ロジックを修正
        if (currentPhase.type === '終了') {
            // 終了フェーズは最終セット・サイクルを表示
            cycleTextEl.textContent = `セット: 4/4 | サイクル: 2/2`;
        } else if (sequenceIndex <= 7) { // 1st Cycle
            const set = Math.floor(sequenceIndex / 2) + 1;
            cycleTextEl.textContent = `セット: ${set}/4 | サイクル: 1/2`;
        } else if (sequenceIndex > 7) { // 2nd Cycle (長休憩後)
            const set = Math.floor((sequenceIndex - 8) / 2) + 1;
            cycleTextEl.textContent = `セット: ${set}/4 | サイクル: 2/2`;
        }
    } else {
        cycleTextEl.textContent = '';
        if (phaseIndicatorEl) {
            phaseIndicatorEl.textContent = '完了';
        }
        // 完了時の祝福アニメーション
        const timerContainer = document.querySelector('.bg-white\\/10');
        if (timerContainer) {
            timerContainer.classList.add('celebration-animation');
            setTimeout(() => {
                timerContainer.classList.remove('celebration-animation');
            }, 600);
        }
    }
}

// 円形プログレスバー更新関数
function updateProgressCircle(): void {
    if (!progressCircleEl) return;
    
    const progress = (totalTimeInSeconds - timeInSeconds) / totalTimeInSeconds;
    const circumference = 283; // 2 * π * 45 (半径45の円周)
    const offset = circumference - (progress * circumference);
    
    progressCircleEl.style.strokeDashoffset = offset.toString();
    
    // プログレス円にパルスアニメーションを追加
    if (isRunning) {
        progressCircleEl.classList.add('progress-pulse');
    } else {
        progressCircleEl.classList.remove('progress-pulse');
    }
}

// アニメーション管理関数
function updateAnimations(phaseType: '集中' | '休憩' | '長休憩' | '終了'): void {
    const timerContainer = document.querySelector('.bg-white\\/10');
    if (!timerContainer) return;
    
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
function nextSequence(): void {
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
    const nextPhase = sequence[sequenceIndex];
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
function countdown(): void {
    if (!isRunning) return;

    const now = Date.now();
    const elapsed = Math.floor((now - phaseStartTime) / 1000);
    const remaining = totalTimeInSeconds - elapsed;

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
    } else {
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
function updateButtonIcon(): void {
    if (isRunning) {
        playIconEl.style.display = 'none';
        pauseIconEl.style.display = 'block';
    } else {
        playIconEl.style.display = 'block';
        pauseIconEl.style.display = 'none';
    }
}

// 開始・一時停止ボタンの処理
startPauseBtn.addEventListener('click', (): void => {
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
        } else {
            // 一時停止から再開の場合：経過時間を考慮して開始時刻を調整
            const elapsed = totalTimeInSeconds - timeInSeconds;
            phaseStartTime = Date.now() - (elapsed * 1000);
        }
        countdown(); // setTimeoutを使うので直接呼び出し
        saveState();

        // Wake Lock を取得
        requestWakeLock();
    } else {
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
resetBtn.addEventListener('click', (): void => {
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
function initialize(): void {
    // デバッグモードの場合は常にlocalStorageをクリア
    if (DEBUG_LEVEL > 0) {
        clearState();
        console.log('デバッグモード: localStorage をクリアしました');
    }

    // LocalStorageから状態を復元
    const restored = loadState();

    if (restored) {
        // ページ遷移から戻ってきた場合
        // 実行中だった場合でも一時停止状態にする
        if (isRunning) {
            const now = Date.now();
            const elapsed = Math.floor((now - phaseStartTime) / 1000);
            const remaining = totalTimeInSeconds - elapsed;

            if (remaining > 0) {
                timeInSeconds = remaining;
                pausedRemaining = remaining;
            } else {
                // 時間切れの場合は0にリセット
                timeInSeconds = 0;
                pausedRemaining = 0;
            }

            // 一時停止状態にする
            isRunning = false;
            saveState();
        } else {
            // 元々一時停止中だった場合
            timeInSeconds = pausedRemaining;
        }
    }

    updateDisplay();
    updateButtonIcon();
}

// ページアンロード時の処理（リロード、閉じる、遷移時）
window.addEventListener('beforeunload', (): void => {
    if (isRunning) {
        // 実行中の場合、現在の残り時間を計算して一時停止状態で保存
        const now = Date.now();
        const elapsed = Math.floor((now - phaseStartTime) / 1000);
        const remaining = totalTimeInSeconds - elapsed;

        if (remaining > 0) {
            pausedRemaining = remaining;
        } else {
            pausedRemaining = 0;
        }

        isRunning = false;
        saveState();
    }

    // Wake Lock を解放
    releaseWakeLock();
});

// スマートフォン検出関数
function isMobileDevice(): boolean {
    // ユーザーエージェントによる判定
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;

    // タッチデバイスかつ画面幅が狭い場合もモバイルと判定
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isNarrowScreen = window.innerWidth <= 768;

    return mobileRegex.test(userAgent) || (isTouchDevice && isNarrowScreen);
}

// モバイル注意書きの表示
function showMobileNotice(): void {
    if (mobileNoticeEl && isMobileDevice()) {
        mobileNoticeEl.classList.remove('hidden');
        console.log('スマートフォンを検出しました。注意書きを表示します。');
    }
}

// 2連続クリックでデバッグモード切り替え（隠しコマンド）
let clickCount = 0;
let clickTimer: number | null = null;
let lastClickTime = 0;

phaseIndicatorEl.addEventListener('click', (): void => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTime;
    lastClickTime = now;

    // ダブルクリック判定（500ms以内）
    if (timeSinceLastClick < 500) {
        clickCount++;
    } else {
        clickCount = 1;
    }

    if (clickTimer) {
        clearTimeout(clickTimer);
    }

    if (clickCount >= 2) {
        // 2回クリックされたらデバッグモードを切り替え
        const currentUrl = new URL(window.location.href);
        const currentDebug = currentUrl.searchParams.get('debug');

        if (!currentDebug || currentDebug === '0') {
            // デバッグモード1に切り替え
            currentUrl.searchParams.set('debug', '1');
        } else if (currentDebug === '1') {
            // デバッグモード2に切り替え
            currentUrl.searchParams.set('debug', '2');
        } else {
            // 通常モードに戻す
            currentUrl.searchParams.delete('debug');
        }

        // ページをリロード
        window.location.href = currentUrl.toString();
        return;
    }

    // 500ms以内に次のクリックがなければカウントをリセット
    clickTimer = window.setTimeout(() => {
        clickCount = 0;
    }, 500);
});

// ページロード時に初期化
initialize();
showMobileNotice();
