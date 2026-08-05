/* C16 Chaos Orchestra classical library runtime */
(() => {
    'use strict';

    const STORAGE_KEY = 'korean3b:c16:chaos-orchestra';
    const SCHEMA_VERSION = 1;
    const GAME_DURATION = 60_000;
    const TARGET_NOTE_TRAVEL = 2_400;
    const COUNTDOWN_STEP = 680;
    const COUNTDOWN_LABELS = ['3', '2', '1', 'GO!'];
    const MISS_WINDOW = 220;
    const REDUCED_MOTION_QUERY = window.matchMedia('(prefers-reduced-motion: reduce)');

    const LANES = [
        { instrument: '기타', action: '튕기다', key: 'D', color: '#ff6b79', frequency: 329.63 },
        { instrument: '피아노', action: '누르다', key: 'F', color: '#ffd84d', frequency: 523.25 },
        { instrument: '바이올린', action: '켜다', key: 'J', color: '#58e4ff', frequency: 659.25 },
        { instrument: '드럼', action: '치다', key: 'K', color: '#a77cff', frequency: 130.81 }
    ];

    // Public-domain Ode to Joy soprano theme, G major, 4/4, quarter note = 100.
    // Durations are expressed as eighth-note steps and follow the Mutopia score.
    const ODE_THEME_A = Object.freeze([
        [71, 2], [71, 2], [72, 2], [74, 2],
        [74, 2], [72, 2], [71, 2], [69, 2],
        [67, 2], [67, 2], [69, 2], [71, 2],
        [71, 3], [69, 1], [69, 4],
        [71, 2], [71, 2], [72, 2], [74, 2],
        [74, 2], [72, 2], [71, 2], [69, 2],
        [67, 2], [67, 2], [69, 2], [71, 2],
        [69, 3], [67, 1], [67, 4]
    ]);
    const ODE_THEME_B = Object.freeze([
        [69, 2], [69, 2], [71, 2], [67, 2],
        [69, 2], [71, 1], [72, 1], [71, 2], [67, 2],
        [69, 2], [71, 1], [72, 1], [71, 2], [69, 2],
        [67, 2], [69, 2], [74, 4],
        [71, 2], [71, 2], [72, 2], [74, 2],
        [74, 2], [72, 2], [71, 2], [69, 2],
        [67, 2], [67, 2], [69, 2], [71, 2],
        [69, 3], [67, 1], [67, 4]
    ]);
    const ODE_ARRANGEMENT = Object.freeze([...ODE_THEME_A, ...ODE_THEME_B, ...ODE_THEME_A]);
    const ODE_CHORDS = Object.freeze([
        { notes: [55, 59, 62], bass: 43 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 },
        { notes: [48, 52, 55], bass: 48 },
        { notes: [50, 54, 57], bass: 50 },
        { notes: [55, 59, 62], bass: 43 }
    ]);

    // The following motifs preserve the recognizable opening pitches and rhythms of
    // their public-domain scores. Each one is repeated as a compact 60-second game cut.
    const FUR_ELISE_THEME = Object.freeze([
        [76, 1], [75, 1], [76, 1], [75, 1], [76, 1], [71, 1], [74, 1], [72, 1], [69, 3],
        [60, 1], [64, 1], [69, 1], [71, 3], [64, 1], [68, 1], [71, 1], [72, 3], [64, 1],
        [76, 1], [75, 1], [76, 1], [75, 1], [76, 1], [71, 1], [74, 1], [72, 1], [69, 3],
        [60, 1], [64, 1], [69, 1], [71, 3], [64, 1], [72, 1], [71, 1], [69, 4]
    ]);
    const EINE_KLEINE_THEME = Object.freeze([
        [79, 3], [74, 1], [79, 3], [74, 1], [79, 1], [74, 1], [79, 1], [83, 1], [86, 4],
        [84, 3], [81, 1], [84, 3], [81, 1], [84, 1], [81, 1], [78, 1], [81, 1], [74, 4]
    ]);
    const TURKISH_MARCH_THEME = Object.freeze([
        [71, 1], [69, 1], [68, 1], [69, 1], [72, 4],
        [74, 1], [72, 1], [71, 1], [72, 1], [76, 4],
        [77, 1], [76, 1], [75, 1], [76, 1],
        [83, 1], [81, 1], [80, 1], [81, 1],
        [83, 1], [81, 1], [80, 1], [81, 1], [84, 4]
    ]);
    const BACH_PRELUDE_THEME = Object.freeze([
        ...[60, 64, 67, 72, 76, 67, 72, 76, 60, 64, 67, 72, 76, 67, 72, 76].map((note) => [note, 1]),
        ...[60, 62, 69, 74, 77, 69, 74, 77, 60, 62, 69, 74, 77, 69, 74, 77].map((note) => [note, 1]),
        ...[59, 62, 67, 74, 77, 67, 74, 77, 59, 62, 67, 74, 77, 67, 74, 77].map((note) => [note, 1]),
        ...[60, 64, 67, 72, 76, 67, 72, 76, 60, 64, 67, 72, 76, 67, 72, 76].map((note) => [note, 1])
    ]);
    const FIFTH_SYMPHONY_THEME = Object.freeze([
        [null, 1], [67, 1], [67, 1], [67, 1], [63, 5],
        [65, 1], [65, 1], [65, 1], [62, 9],
        [67, 1], [67, 1], [67, 1], [63, 5],
        [75, 1], [75, 1], [75, 1], [72, 5]
    ]);

    function arrangementDuration(arrangement) {
        return arrangement.reduce((total, [, duration]) => total + duration, 0);
    }

    function fitArrangement(motif, targetSteps) {
        const arrangement = [];
        let cursor = 0;
        while (cursor < targetSteps) {
            for (const [note, duration] of motif) {
                if (cursor >= targetSteps) break;
                const clippedDuration = Math.min(duration, targetSteps - cursor);
                arrangement.push(Object.freeze([note, clippedDuration]));
                cursor += clippedDuration;
            }
        }
        return Object.freeze(arrangement);
    }

    function buildStepEvents(arrangement, stepCount, chartEvery = 1) {
        const stepEvents = Array.from({ length: stepCount }, () => null);
        let cursor = 0;
        let noteIndex = 0;
        for (const [note, duration] of arrangement) {
            if (cursor >= stepCount) break;
            if (note !== null) {
                stepEvents[cursor] = Object.freeze({
                    note,
                    duration,
                    playable: noteIndex % chartEvery === 0
                });
                noteIndex += 1;
            }
            cursor += duration;
        }
        return Object.freeze(stepEvents);
    }

    function createSong(config) {
        const stepMs = 60_000 / (config.bpm * config.stepsPerBeat);
        const introSteps = Math.max(4, Math.round(TARGET_NOTE_TRAVEL / stepMs));
        const arrangementSteps = Math.max(1, Math.floor(GAME_DURATION / stepMs) - introSteps);
        const arrangement = config.loop === false
            ? Object.freeze([...config.motif])
            : fitArrangement(config.motif, arrangementSteps);
        const stepEvents = buildStepEvents(arrangement, arrangementSteps, config.chartEvery ?? 1);
        return Object.freeze({
            ...config,
            duration: GAME_DURATION,
            stepMs,
            introSteps,
            arrangementSteps,
            arrangement,
            stepEvents,
            chartNotes: stepEvents.filter((event) => event?.playable).length
        });
    }

    const SONG_LIBRARY = Object.freeze([
        createSong({
            id: 'ode-to-joy',
            title: '환희의 송가',
            composer: 'L. v. 베토벤',
            composerLabel: '베토벤',
            work: '교향곡 9번 4악장 주제',
            bpm: 100,
            stepsPerBeat: 2,
            barSteps: 8,
            motif: ODE_ARRANGEMENT,
            loop: false,
            chartEvery: 1,
            pitchLanes: Object.freeze({ 67: 0, 69: 1, 71: 2, 72: 3, 74: 3 }),
            chords: ODE_CHORDS,
            voice: 'orchestra',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=528'
        }),
        createSong({
            id: 'fur-elise',
            title: '엘리제를 위하여',
            composer: 'L. v. 베토벤',
            composerLabel: '베토벤',
            work: '바가텔 WoO 59 주제',
            bpm: 92,
            stepsPerBeat: 4,
            barSteps: 12,
            motif: FUR_ELISE_THEME,
            chartEvery: 2,
            chords: Object.freeze([
                { notes: [57, 60, 64], bass: 45 },
                { notes: [52, 56, 59], bass: 40 },
                { notes: [57, 60, 64], bass: 45 },
                { notes: [52, 57, 60], bass: 40 }
            ]),
            voice: 'piano',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=931'
        }),
        createSong({
            id: 'eine-kleine',
            title: '아이네 클라이네 나흐트무지크',
            composer: 'W. A. 모차르트',
            composerLabel: '모차르트',
            work: '현악 세레나데 K. 525 1악장 주제',
            bpm: 132,
            stepsPerBeat: 2,
            barSteps: 8,
            motif: EINE_KLEINE_THEME,
            chartEvery: 1,
            chords: Object.freeze([
                { notes: [55, 59, 62], bass: 43 },
                { notes: [50, 54, 57], bass: 38 },
                { notes: [48, 52, 55], bass: 36 },
                { notes: [50, 54, 57], bass: 38 }
            ]),
            voice: 'strings',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=900'
        }),
        createSong({
            id: 'turkish-march',
            title: '터키 행진곡',
            composer: 'W. A. 모차르트',
            composerLabel: '모차르트',
            work: '피아노 소나타 K. 331 3악장 주제',
            bpm: 116,
            stepsPerBeat: 4,
            barSteps: 16,
            motif: TURKISH_MARCH_THEME,
            chartEvery: 2,
            chords: Object.freeze([
                { notes: [57, 60, 64], bass: 45 },
                { notes: [52, 56, 59], bass: 40 },
                { notes: [57, 60, 64], bass: 45 },
                { notes: [52, 56, 64], bass: 40 }
            ]),
            voice: 'bright',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=108'
        }),
        createSong({
            id: 'bach-prelude',
            title: '프렐류드 C장조',
            composer: 'J. S. 바흐',
            composerLabel: '바흐',
            work: '평균율 클라비어곡집 1권 BWV 846',
            bpm: 90,
            stepsPerBeat: 4,
            barSteps: 8,
            motif: BACH_PRELUDE_THEME,
            chartEvery: 2,
            chords: Object.freeze([
                { notes: [48, 52, 55], bass: 36 },
                { notes: [48, 50, 57], bass: 36 },
                { notes: [47, 50, 55], bass: 35 },
                { notes: [48, 52, 55], bass: 36 }
            ]),
            voice: 'baroque',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=2206'
        }),
        createSong({
            id: 'symphony-five',
            title: '운명 교향곡',
            composer: 'L. v. 베토벤',
            composerLabel: '베토벤',
            work: '교향곡 5번 1악장 주제',
            bpm: 108,
            stepsPerBeat: 2,
            barSteps: 8,
            motif: FIFTH_SYMPHONY_THEME,
            chartEvery: 1,
            chords: Object.freeze([
                { notes: [48, 51, 55], bass: 36 },
                { notes: [41, 44, 48], bass: 29 },
                { notes: [43, 47, 50], bass: 31 },
                { notes: [48, 51, 55], bass: 36 }
            ]),
            voice: 'dramatic',
            sourceUrl: 'https://www.mutopiaproject.org/cgibin/piece-info.cgi?id=941'
        })
    ]);
    const SONGS_BY_ID = new Map(SONG_LIBRARY.map((song) => [song.id, song]));
    const DEFAULT_SONG_ID = SONG_LIBRARY[0].id;
    let SONG = SONG_LIBRARY[0];
    let noteTravelTime = SONG.introSteps * SONG.stepMs;

    function noteFrequency(midiNote) {
        return 440 * (2 ** ((midiNote - 69) / 12));
    }

    const NOTE_STYLES = [
        { shape: 'triangle', name: '세모', texture: '뾰족하다' },
        { shape: 'square', name: '네모', texture: '딱딱하다' },
        { shape: 'circle', name: '동그라미', texture: '둥글다' },
        { shape: 'diamond', name: '마름모', texture: '매끄럽다' },
        { shape: 'flat', name: '네모', texture: '평평하다' },
        { shape: 'blob', name: '동그라미', texture: '부드럽다' },
        { shape: 'rough-triangle', name: '세모', texture: '거칠다' },
        { shape: 'bumpy-diamond', name: '마름모', texture: '울퉁불퉁하다' }
    ];

    const MOODS = [
        { combo: 0, label: '마음이 편안해지다' },
        { combo: 7, label: '마음에 여유가 생기다' },
        { combo: 14, label: '신이 나다' },
        { combo: 24, label: '힘이 나다' },
        { combo: 36, label: '가슴이 뛰다' },
        { combo: 50, label: '마음이 설레다' }
    ];

    const POWERS = [
        { id: 'giant', name: '사람 키만 하다', effect: '노트 거대화 · 점수 ×2', duration: 5_000 },
        { id: 'auto', name: '놓칠 생각도 못 하다', effect: '카오스 자동 연주', duration: 4_300 },
        { id: 'worth', name: '해 볼 만하다', effect: '모든 판정 점수 ×3', duration: 5_000 },
        { id: 'famous', name: '스타로 유명하다', effect: '골든 스포트라이트 ×4', duration: 4_700 }
    ];

    const DEFAULT_RECORD = Object.freeze({
        schemaVersion: SCHEMA_VERSION,
        bestScore: 0,
        bestCombo: 0,
        plays: 0,
        lastResult: null,
        settings: {
            muted: false,
            reducedEffects: false
        }
    });

    const els = {
        root: document.getElementById('gameRoot'),
        stage: document.getElementById('stage'),
        canvas: document.getElementById('gameCanvas'),
        menuScreen: document.getElementById('menuScreen'),
        countdownScreen: document.getElementById('countdownScreen'),
        countdownLabel: document.getElementById('countdownLabel'),
        pauseScreen: document.getElementById('pauseScreen'),
        resultScreen: document.getElementById('resultScreen'),
        startGame: document.getElementById('startGame'),
        resumeGame: document.getElementById('resumeGame'),
        quitGame: document.getElementById('quitGame'),
        playAgain: document.getElementById('playAgain'),
        pauseButton: document.getElementById('pauseButton'),
        soundToggle: document.getElementById('soundToggle'),
        soundIcon: document.getElementById('soundIcon'),
        effectsToggle: document.getElementById('effectsToggle'),
        resetRecord: document.getElementById('resetRecord'),
        resetDialog: document.getElementById('resetDialog'),
        confirmReset: document.getElementById('confirmReset'),
        timeValue: document.getElementById('timeValue'),
        scoreValue: document.getElementById('scoreValue'),
        comboValue: document.getElementById('comboValue'),
        moodBadge: document.getElementById('moodBadge'),
        moodValue: document.getElementById('moodValue'),
        menuBestScore: document.getElementById('menuBestScore'),
        menuBestCombo: document.getElementById('menuBestCombo'),
        finalScore: document.getElementById('finalScore'),
        resultTitle: document.getElementById('resultTitle'),
        resultPerfect: document.getElementById('resultPerfect'),
        resultCombo: document.getElementById('resultCombo'),
        resultSong: document.getElementById('resultSong'),
        newRecord: document.getElementById('newRecord'),
        powerBanner: document.getElementById('powerBanner'),
        powerName: document.getElementById('powerName'),
        powerEffect: document.getElementById('powerEffect'),
        judgement: document.getElementById('judgement'),
        hitFlash: document.getElementById('hitFlash'),
        songSelect: document.getElementById('songSelect'),
        menuSongTitle: document.getElementById('menuSongTitle'),
        menuSongWork: document.getElementById('menuSongWork'),
        menuTempo: document.getElementById('menuTempo'),
        trackRibbon: document.getElementById('trackRibbon'),
        trackTitle: document.getElementById('trackTitle'),
        trackTempo: document.getElementById('trackTempo'),
        trackProgress: document.getElementById('trackProgress'),
        trackCreditTitle: document.getElementById('trackCreditTitle'),
        scoreSource: document.getElementById('scoreSource'),
        liveRegion: document.getElementById('liveRegion'),
        saveStatus: document.getElementById('saveStatus'),
        laneButtons: Array.from(document.querySelectorAll('.lane-button')),
        performers: Array.from(document.querySelectorAll('[data-performer-lane]'))
    };

    const ctx = els.canvas.getContext('2d', { alpha: false });
    let record = cloneDefaultRecord();
    let storageHealthy = true;
    let storageHadRecord = false;
    let manualReducedEffects = false;
    let gameState = 'menu';
    let rafId = 0;
    let previousFrame = performance.now();
    let countdownStartedAt = 0;
    let countdownIndex = -1;
    let runStartedAt = 0;
    let pausedAt = 0;
    let pausedTotal = 0;
    let elapsed = 0;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let perfectCount = 0;
    let greatCount = 0;
    let goodCount = 0;
    let missCount = 0;
    let crowd = 62;
    let notes = [];
    let particles = [];
    let ripples = [];
    let lanePulse = [0, 0, 0, 0];
    let nextTargetTime = noteTravelTime;
    let sequenceStep = 0;
    let noteId = 0;
    let nextBeatTime = 0;
    let beatIndex = 0;
    let activePower = null;
    let powerEndsAt = 0;
    let powerBannerEndsAt = 0;
    let powerCursor = 0;
    let lastPowerCombo = 0;
    let lastMood = '';
    let lastAnnouncedSecond = 60;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let canvasDpr = 1;
    let hitLineY = 0;
    let resizeNeeded = true;
    let backgroundStars = createStars(70);
    let backgroundBeatGlow = 0;
    const performerTimers = [0, 0, 0, 0];

    class AudioEngine {
        constructor() {
            this.context = null;
            this.master = null;
            this.compressor = null;
            this.noiseBuffer = null;
            this.muted = false;
            this.paused = false;
        }

        async ensure() {
            if (!this.context) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (!AudioContextClass) return false;
                this.context = new AudioContextClass();
                this.master = this.context.createGain();
                this.compressor = this.context.createDynamicsCompressor();
                this.compressor.threshold.value = -16;
                this.compressor.knee.value = 16;
                this.compressor.ratio.value = 5;
                this.compressor.attack.value = 0.004;
                this.compressor.release.value = 0.18;
                this.master.gain.value = this.muted || this.paused ? 0 : 0.68;
                this.master.connect(this.compressor);
                this.compressor.connect(this.context.destination);
                this.noiseBuffer = this.createNoiseBuffer();
            }
            if (this.context.state === 'suspended') {
                try {
                    await this.context.resume();
                } catch (_error) {
                    return false;
                }
            }
            return true;
        }

        setMuted(value) {
            this.muted = Boolean(value);
            this.updateMasterGain();
        }

        setPaused(value) {
            this.paused = Boolean(value);
            this.updateMasterGain();
        }

        updateMasterGain() {
            if (!this.master || !this.context) return;
            const now = this.context.currentTime;
            this.master.gain.cancelScheduledValues(now);
            this.master.gain.setTargetAtTime(this.muted || this.paused ? 0 : 0.68, now, 0.02);
        }

        createNoiseBuffer() {
            const length = Math.max(1, Math.floor(this.context.sampleRate * 0.35));
            const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
            const channel = buffer.getChannelData(0);
            for (let index = 0; index < length; index += 1) {
                channel[index] = Math.random() * 2 - 1;
            }
            return buffer;
        }

        tone(frequency, duration, type = 'sine', volume = 0.12, delay = 0, endFrequency = null) {
            if (!this.context || !this.master || this.muted) return;
            const start = this.context.currentTime + delay;
            const oscillator = this.context.createOscillator();
            const gain = this.context.createGain();
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(Math.max(30, frequency), start);
            if (endFrequency) {
                oscillator.frequency.exponentialRampToValueAtTime(Math.max(30, endFrequency), start + duration);
            }
            gain.gain.setValueAtTime(0.0001, start);
            gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, volume), start + 0.008);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            oscillator.connect(gain);
            gain.connect(this.master);
            oscillator.start(start);
            oscillator.stop(start + duration + 0.02);
        }

        noise(duration = 0.08, volume = 0.08, delay = 0, highpass = 1_000) {
            if (!this.context || !this.master || !this.noiseBuffer || this.muted) return;
            const start = this.context.currentTime + delay;
            const source = this.context.createBufferSource();
            const filter = this.context.createBiquadFilter();
            const gain = this.context.createGain();
            source.buffer = this.noiseBuffer;
            filter.type = 'highpass';
            filter.frequency.value = highpass;
            gain.gain.setValueAtTime(Math.max(0.0002, volume), start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
            source.connect(filter);
            filter.connect(gain);
            gain.connect(this.master);
            source.start(start);
            source.stop(start + duration + 0.02);
        }

        playCountdown(index) {
            const isGo = index === COUNTDOWN_LABELS.length - 1;
            this.tone(isGo ? 660 : 330 + index * 55, isGo ? 0.25 : 0.12, 'square', isGo ? 0.16 : 0.1);
            if (isGo) this.tone(990, 0.3, 'sine', 0.1, 0.04);
        }

        playSongStep(index) {
            if (index < SONG.introSteps) {
                if (index === 0) {
                    SONG.chords[0].notes.forEach((note, chordTone) => {
                        this.tone(noteFrequency(note), Math.min(2.28, noteTravelTime / 1_000), chordTone === 1 ? 'triangle' : 'sine', 0.017, chordTone * 0.012);
                    });
                }
                const pulseEvery = Math.max(1, Math.floor(SONG.introSteps / 4));
                if (index % pulseEvery === 0) {
                    const pulseIndex = Math.min(3, Math.floor(index / pulseEvery));
                    const countFrequency = [392.0, 440.0, 493.88, 587.33][pulseIndex];
                    this.tone(countFrequency, 0.11, 'triangle', 0.038);
                    this.noise(0.025, 0.012, 0, 4_700);
                }
                return;
            }

            const arrangementStep = index - SONG.introSteps;
            const stepInBar = arrangementStep % SONG.barSteps;
            const barIndex = Math.floor(arrangementStep / SONG.barSteps);
            const chord = SONG.chords[barIndex % SONG.chords.length];

            if (stepInBar === 0) {
                const chordDuration = Math.min(2.28, SONG.barSteps * (SONG.stepMs / 1_000) * 0.78);
                chord.notes.forEach((note, chordTone) => {
                    this.tone(noteFrequency(note), chordDuration, chordTone === 1 ? 'triangle' : 'sine', 0.018, chordTone * 0.012);
                });
            }
            if (stepInBar % SONG.stepsPerBeat === 0) {
                const root = noteFrequency(chord.bass);
                const bass = stepInBar === SONG.barSteps - SONG.stepsPerBeat ? root * 1.5 : root;
                this.tone(bass, 0.38, 'triangle', 0.046, 0, bass * 0.9);
                this.noise(0.028, 0.012, 0, 4_600);
            }
            if (stepInBar === 0) {
                this.tone(112, 0.17, 'sine', 0.06, 0, 44);
            } else if (stepInBar === Math.floor(SONG.barSteps / 2)) {
                this.noise(0.085, 0.035, 0, 900);
                this.tone(168, 0.075, 'triangle', 0.022, 0, 92);
            } else if (stepInBar % SONG.stepsPerBeat === Math.max(1, Math.floor(SONG.stepsPerBeat / 2))) {
                this.noise(0.024, 0.007, 0, 5_200);
            }

            const melodyEvent = SONG.stepEvents[arrangementStep];
            if (melodyEvent) {
                const frequency = noteFrequency(melodyEvent.note);
                const duration = Math.max(0.11, melodyEvent.duration * (SONG.stepMs / 1_000) * 0.88);
                const voices = {
                    piano: ['triangle', 'sine', 0.064, 0.024],
                    strings: ['sawtooth', 'triangle', 0.04, 0.036],
                    bright: ['triangle', 'square', 0.055, 0.016],
                    baroque: ['triangle', 'square', 0.052, 0.014],
                    dramatic: ['sawtooth', 'triangle', 0.05, 0.035],
                    orchestra: ['triangle', 'sawtooth', 0.058, 0.024]
                };
                const [primaryType, colorType, primaryGain, colorGain] = voices[SONG.voice] ?? voices.orchestra;
                this.tone(frequency, duration, primaryType, primaryGain);
                this.tone(frequency, duration * 0.92, colorType, colorGain, 0.008, frequency * 1.008);
                this.tone(frequency * 0.5, Math.min(0.42, duration), 'sine', 0.018, 0.012);
            }
        }

        playLane(laneIndex, rating) {
            const lane = LANES[laneIndex];
            const ratingGain = rating === 'PERFECT' ? 1 : rating === 'GREAT' ? 0.82 : 0.68;
            if (laneIndex === 0) {
                this.tone(lane.frequency, 0.19, 'triangle', 0.105 * ratingGain, 0, lane.frequency * 0.72);
                this.tone(lane.frequency * 2, 0.1, 'sine', 0.042 * ratingGain, 0.01);
            } else if (laneIndex === 1) {
                this.tone(lane.frequency, 0.3, 'sine', 0.11 * ratingGain);
                this.tone(lane.frequency * 2, 0.2, 'triangle', 0.05 * ratingGain, 0.012);
            } else if (laneIndex === 2) {
                this.tone(lane.frequency, 0.36, 'sawtooth', 0.052 * ratingGain, 0, lane.frequency * 1.015);
                this.tone(lane.frequency * 0.5, 0.32, 'triangle', 0.055 * ratingGain, 0.01);
            } else {
                this.tone(150, 0.13, 'sine', 0.11 * ratingGain, 0, 58);
                this.noise(0.12, 0.075 * ratingGain, 0, 500);
            }
        }

        playMiss() {
            this.tone(150, 0.14, 'sawtooth', 0.04, 0, 72);
        }

        playPower() {
            [261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
                this.tone(frequency, 0.42, index % 2 ? 'triangle' : 'sine', 0.075, index * 0.045);
            });
        }

        playFinish() {
            [392, 493.88, 587.33, 783.99].forEach((frequency, index) => {
                this.tone(frequency, 0.5, 'triangle', 0.085, index * 0.11);
            });
            this.noise(0.18, 0.06, 0.34, 1_800);
        }
    }

    const audio = new AudioEngine();

    function cloneDefaultRecord() {
        return {
            schemaVersion: SCHEMA_VERSION,
            bestScore: 0,
            bestCombo: 0,
            plays: 0,
            lastResult: null,
            settings: {
                muted: false,
                reducedEffects: false
            }
        };
    }

    function isSafeCount(value) {
        return Number.isSafeInteger(value) && value >= 0;
    }

    function validateRecord(value) {
        if (!value || typeof value !== 'object' || value.schemaVersion !== SCHEMA_VERSION) return false;
        if (!isSafeCount(value.bestScore) || !isSafeCount(value.bestCombo) || !isSafeCount(value.plays)) return false;
        if (!value.settings || typeof value.settings !== 'object') return false;
        if (typeof value.settings.muted !== 'boolean' || typeof value.settings.reducedEffects !== 'boolean') return false;
        if (Object.prototype.hasOwnProperty.call(value.settings, 'selectedSong')
            && !SONGS_BY_ID.has(value.settings.selectedSong)) return false;
        if (value.lastResult !== null) {
            if (!value.lastResult || typeof value.lastResult !== 'object') return false;
            if (!isSafeCount(value.lastResult.score) || !isSafeCount(value.lastResult.combo)) return false;
        }
        return true;
    }

    function loadRecord() {
        let raw = null;
        try {
            raw = window.localStorage.getItem(STORAGE_KEY);
        } catch (_error) {
            storageHealthy = false;
            setSaveStatus('저장 공간을 사용할 수 없음', true);
            return cloneDefaultRecord();
        }
        if (raw === null) {
            storageHadRecord = false;
            return cloneDefaultRecord();
        }
        storageHadRecord = true;
        try {
            const parsed = JSON.parse(raw);
            if (!validateRecord(parsed)) {
                storageHealthy = false;
                setSaveStatus('기존 기록을 읽지 못함 · 초기화 가능', true);
                return cloneDefaultRecord();
            }
            return parsed;
        } catch (_error) {
            storageHealthy = false;
            setSaveStatus('기존 기록을 읽지 못함 · 초기화 가능', true);
            return cloneDefaultRecord();
        }
    }

    function saveRecord() {
        if (!storageHealthy) return false;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
            storageHadRecord = true;
            setSaveStatus('기록 자동 저장', false);
            return true;
        } catch (_error) {
            storageHealthy = false;
            setSaveStatus('저장 실패 · 현재 화면에서는 계속 가능', true);
            return false;
        }
    }

    function clearRecord() {
        try {
            window.localStorage.removeItem(STORAGE_KEY);
            record = cloneDefaultRecord();
            storageHealthy = true;
            storageHadRecord = false;
            manualReducedEffects = false;
            audio.setMuted(false);
            applySongSelection(DEFAULT_SONG_ID, { reset: true });
            applyPreferences();
            renderBest();
            setSaveStatus('이 게임의 기록을 초기화함', false);
            announce('카오스 오케스트라 기록을 초기화했습니다.');
        } catch (_error) {
            storageHealthy = false;
            setSaveStatus('기록을 지우지 못함', true);
        }
    }

    function setSaveStatus(message, isError) {
        if (!els.saveStatus) return;
        els.saveStatus.textContent = message;
        els.saveStatus.classList.toggle('is-error', Boolean(isError));
    }

    function applyPreferences() {
        manualReducedEffects = Boolean(record.settings.reducedEffects);
        audio.setMuted(Boolean(record.settings.muted));
        const reduced = manualReducedEffects || REDUCED_MOTION_QUERY.matches;
        document.body.classList.toggle('effects-reduced', reduced);
        els.effectsToggle.setAttribute('aria-pressed', String(manualReducedEffects));
        els.effectsToggle.textContent = manualReducedEffects ? '효과 기본으로' : '효과 줄이기';
        els.soundToggle.setAttribute('aria-pressed', String(record.settings.muted));
        els.soundToggle.setAttribute('aria-label', record.settings.muted ? '소리 켜기' : '소리 끄기');
        els.soundIcon.textContent = record.settings.muted ? '×' : '♫';
    }

    function renderBest() {
        els.menuBestScore.textContent = record.bestScore.toLocaleString('ko-KR');
        els.menuBestCombo.textContent = record.bestCombo.toLocaleString('ko-KR');
    }

    function renderSong() {
        const menuTitle = `${SONG.composerLabel}의 「${SONG.title}」`;
        els.songSelect.value = SONG.id;
        els.menuSongTitle.textContent = menuTitle;
        els.menuSongWork.textContent = SONG.work;
        els.menuTempo.textContent = String(SONG.bpm);
        els.trackTitle.textContent = `${SONG.composerLabel} · ${SONG.title}`;
        els.trackTempo.textContent = `♩=${SONG.bpm}`;
        els.trackRibbon.setAttribute('aria-label', `현재 곡: ${SONG.composerLabel} ${SONG.title}, 분당 ${SONG.bpm}박`);
        els.trackProgress.max = GAME_DURATION;
        els.trackCreditTitle.textContent = `♪ ${SONG.composerLabel} 「${SONG.title}」 ·`;
        els.scoreSource.href = SONG.sourceUrl;
        els.scoreSource.setAttribute('aria-label', `${SONG.title} 퍼블릭 도메인 악보 출처 열기`);
        els.resultSong.textContent = `${SONG.composerLabel} · ${SONG.title}`;
    }

    function applySongSelection(songId, options = {}) {
        const { persist = false, reset = false, announceChange = false } = options;
        const nextSong = SONGS_BY_ID.get(songId);
        if (!nextSong || ['countdown', 'running', 'paused'].includes(gameState)) return false;
        SONG = nextSong;
        noteTravelTime = SONG.introSteps * SONG.stepMs;
        renderSong();
        if (reset) resetRun();
        if (persist) {
            record.settings.selectedSong = SONG.id;
            saveRecord();
        }
        if (announceChange) announce(`${SONG.composerLabel}의 ${SONG.title}을 선택했습니다.`);
        return true;
    }

    function announce(message) {
        els.liveRegion.textContent = '';
        window.setTimeout(() => {
            els.liveRegion.textContent = message;
        }, 20);
    }

    function setGameState(nextState) {
        gameState = nextState;
        els.root.dataset.gameState = nextState;
        els.menuScreen.hidden = nextState !== 'menu';
        els.countdownScreen.hidden = nextState !== 'countdown';
        els.pauseScreen.hidden = nextState !== 'paused';
        els.resultScreen.hidden = nextState !== 'result';
        els.pauseButton.hidden = nextState !== 'running';
        els.canvas.setAttribute('aria-label', canvasLabelForState(nextState));
    }

    function canvasLabelForState(state) {
        if (state === 'running') return `리듬 게임 진행 중. 점수 ${score}, 콤보 ${combo}, 남은 시간 ${Math.ceil((GAME_DURATION - elapsed) / 1000)}초`;
        if (state === 'paused') return '리듬 게임이 일시정지되었습니다.';
        if (state === 'result') return `게임 종료. 최종 점수 ${score}, 최고 콤보 ${maxCombo}`;
        return '기타, 피아노, 바이올린, 드럼의 네 레인으로 노트가 내려오는 리듬 게임 화면';
    }

    function resetRun() {
        elapsed = 0;
        score = 0;
        combo = 0;
        maxCombo = 0;
        perfectCount = 0;
        greatCount = 0;
        goodCount = 0;
        missCount = 0;
        crowd = 62;
        notes = [];
        particles = [];
        ripples = [];
        lanePulse = [0, 0, 0, 0];
        nextTargetTime = noteTravelTime;
        sequenceStep = 0;
        noteId = 0;
        nextBeatTime = 0;
        beatIndex = 0;
        activePower = null;
        powerEndsAt = 0;
        powerBannerEndsAt = 0;
        powerCursor = 0;
        lastPowerCombo = 0;
        lastMood = '';
        lastAnnouncedSecond = 60;
        backgroundBeatGlow = 0;
        els.trackProgress.value = 0;
        els.trackRibbon.classList.remove('is-beat');
        els.performers.forEach((performer, laneIndex) => {
            window.clearTimeout(performerTimers[laneIndex]);
            performer.classList.remove('is-playing', 'is-perfect');
        });
        els.powerBanner.hidden = true;
        renderHud();
    }

    async function startCountdown() {
        if (!['menu', 'result'].includes(gameState)) return;
        await audio.ensure();
        audio.setPaused(false);
        resetRun();
        countdownStartedAt = performance.now();
        countdownIndex = -1;
        setGameState('countdown');
        updateCountdown(countdownStartedAt);
        announce('3초 뒤 연주를 시작합니다.');
    }

    function updateCountdown(now) {
        const index = Math.floor((now - countdownStartedAt) / COUNTDOWN_STEP);
        if (index >= COUNTDOWN_LABELS.length) {
            beginRun(now);
            return;
        }
        if (index !== countdownIndex) {
            countdownIndex = index;
            els.countdownLabel.textContent = COUNTDOWN_LABELS[index];
            els.countdownLabel.style.animation = 'none';
            void els.countdownLabel.offsetWidth;
            els.countdownLabel.style.animation = '';
            audio.playCountdown(index);
            backgroundBeatGlow = 1;
        }
    }

    function beginRun(now) {
        runStartedAt = now;
        pausedTotal = 0;
        pausedAt = 0;
        setGameState('running');
        scheduleNotes(0);
        announce(`${SONG.title} 연주 시작. D, F, J, K 또는 화면의 네 버튼을 누르세요.`);
    }

    function pauseGame() {
        if (gameState !== 'running') return;
        pausedAt = performance.now();
        audio.setPaused(true);
        setGameState('paused');
        announce('게임을 일시정지했습니다.');
        window.setTimeout(() => els.resumeGame.focus(), 30);
    }

    async function resumeGame() {
        if (gameState !== 'paused') return;
        await audio.ensure();
        const now = performance.now();
        pausedTotal += now - pausedAt;
        pausedAt = 0;
        audio.setPaused(false);
        setGameState('running');
        announce('게임을 다시 시작합니다.');
    }

    function returnToMenu() {
        activePower = null;
        audio.setPaused(false);
        els.powerBanner.hidden = true;
        setGameState('menu');
        resetRun();
        window.setTimeout(() => els.startGame.focus(), 30);
    }

    function finishRun(forced = false) {
        if (!['running', 'countdown'].includes(gameState)) return;
        if (gameState === 'countdown' && forced) {
            elapsed = GAME_DURATION;
        }
        const priorBest = record.bestScore;
        const isNewRecord = score > priorBest;
        record.bestScore = Math.max(record.bestScore, score);
        record.bestCombo = Math.max(record.bestCombo, maxCombo);
        record.plays += 1;
        record.lastResult = {
            score,
            combo: maxCombo,
            perfect: perfectCount,
            playedAt: new Date().toISOString()
        };
        saveRecord();
        renderBest();

        const rank = getRank(score);
        els.finalScore.textContent = score.toLocaleString('ko-KR');
        els.resultTitle.textContent = rank;
        els.resultPerfect.textContent = perfectCount.toLocaleString('ko-KR');
        els.resultCombo.textContent = maxCombo.toLocaleString('ko-KR');
        els.newRecord.hidden = !isNewRecord || score === 0;
        audio.setPaused(false);
        setGameState('result');
        createConfetti();
        audio.playFinish();
        announce(`게임 종료. 최종 점수 ${score}점, 최고 콤보 ${maxCombo}. ${rank}.`);
        window.setTimeout(() => els.playAgain.focus(), 80);
    }

    function getRank(value) {
        if (value >= 24_000) return '전설로 유명한 오케스트라';
        if (value >= 15_000) return '사람 키만 한 슈퍼스타';
        if (value >= 8_000) return '몇 번이고 해 볼 만한 밴드';
        if (value >= 3_500) return '마음이 설레는 신인';
        return '생각도 못 한 데뷔';
    }

    function stepDurationAt() {
        return SONG.stepMs;
    }

    function scheduleNotes(currentTime) {
        const scheduleUntil = currentTime + noteTravelTime + 180;
        while (nextTargetTime <= Math.min(scheduleUntil, GAME_DURATION + MISS_WINDOW)) {
            createPatternNotes(nextTargetTime, sequenceStep);
            nextTargetTime += stepDurationAt(nextTargetTime);
            sequenceStep += 1;
        }
    }

    function createPatternNotes(targetTime, step) {
        const melodyEvent = SONG.stepEvents[step];
        if (!melodyEvent?.playable) return;
        const laneIndex = SONG.pitchLanes?.[melodyEvent.note]
            ?? Math.abs((melodyEvent.note - 60 + Math.floor(step / SONG.barSteps)) % LANES.length);
        const styleIndex = (step + laneIndex * 2 + Math.floor(targetTime / 9_600)) % NOTE_STYLES.length;
        notes.push({
            id: noteId += 1,
            lane: laneIndex,
            targetTime,
            style: NOTE_STYLES[styleIndex],
            melodyNote: melodyEvent.note,
            rotation: ((step * 0.17 + laneIndex * 0.45) % 1 - 0.5) * 0.24,
            seed: (step * 19 + laneIndex * 31) % 97,
            hit: false,
            missed: false,
            gold: activePower?.id === 'famous' || step % 32 === 0
        });
    }

    function updateRunning(now, deltaMs) {
        elapsed = Math.max(0, now - runStartedAt - pausedTotal);
        scheduleNotes(elapsed);

        while (nextBeatTime <= elapsed && nextBeatTime < GAME_DURATION) {
            audio.playSongStep(beatIndex);
            backgroundBeatGlow = beatIndex % 2 === 0 ? 0.78 : 0.34;
            if (beatIndex % SONG.stepsPerBeat === 0) {
                els.trackRibbon.classList.remove('is-beat');
                void els.trackRibbon.offsetWidth;
                els.trackRibbon.classList.add('is-beat');
            }
            nextBeatTime += SONG.stepMs;
            beatIndex += 1;
        }

        if (activePower && elapsed >= powerEndsAt) {
            activePower = null;
        }
        if (!els.powerBanner.hidden && elapsed >= powerBannerEndsAt) {
            els.powerBanner.hidden = true;
        }

        if (activePower?.id === 'auto') {
            const autoNotes = notes.filter((note) => !note.hit && !note.missed && Math.abs(note.targetTime - elapsed) <= 34);
            autoNotes.forEach((note) => hitNote(note, Math.abs(note.targetTime - elapsed), true));
        }

        for (const note of notes) {
            if (!note.hit && !note.missed && elapsed - note.targetTime > MISS_WINDOW) {
                missNote(note);
            }
        }
        notes = notes.filter((note) => {
            if (!note.hit && !note.missed) return true;
            return elapsed - note.targetTime < 520;
        });

        updateEffects(deltaMs);
        renderHud();
        const remainingSeconds = Math.max(0, Math.ceil((GAME_DURATION - elapsed) / 1_000));
        if (remainingSeconds !== lastAnnouncedSecond && [30, 10, 5].includes(remainingSeconds)) {
            lastAnnouncedSecond = remainingSeconds;
            announce(`${remainingSeconds}초 남았습니다.`);
        }

        if (elapsed >= GAME_DURATION) {
            elapsed = GAME_DURATION;
            renderHud();
            finishRun();
        }
    }

    function attemptHit(laneIndex, automated = false) {
        if (gameState !== 'running') return false;
        const hitWindow = activePower?.id === 'giant' ? 310 : MISS_WINDOW;
        let closest = null;
        let closestDistance = Infinity;
        for (const note of notes) {
            if (note.lane !== laneIndex || note.hit || note.missed) continue;
            const distance = Math.abs(note.targetTime - elapsed);
            if (distance < closestDistance) {
                closest = note;
                closestDistance = distance;
            }
        }

        pulseLane(laneIndex);
        if (closest && closestDistance <= hitWindow) {
            hitNote(closest, closestDistance, automated);
            return true;
        }
        if (!automated) ghostTap(laneIndex);
        return false;
    }

    function hitNote(note, distance, automated) {
        if (note.hit || note.missed) return;
        note.hit = true;
        let rating = 'GOOD';
        let base = 58;
        if (distance <= 72) {
            rating = 'PERFECT';
            base = 132;
            perfectCount += 1;
        } else if (distance <= 145) {
            rating = 'GREAT';
            base = 94;
            greatCount += 1;
        } else {
            goodCount += 1;
        }

        if (automated) pulseLane(note.lane);
        animatePerformer(note.lane, rating);

        combo += 1;
        maxCombo = Math.max(maxCombo, combo);
        crowd = Math.min(100, crowd + (rating === 'PERFECT' ? 2.7 : 1.8));
        const comboMultiplier = 1 + Math.min(combo, 60) / 24;
        let powerMultiplier = 1;
        if (activePower?.id === 'giant') powerMultiplier = 2;
        if (activePower?.id === 'auto') powerMultiplier = 1.35;
        if (activePower?.id === 'worth') powerMultiplier = 3;
        if (activePower?.id === 'famous') powerMultiplier = 4;
        const crowdMultiplier = crowd >= 90 ? 1.35 : 1;
        score += Math.round(base * comboMultiplier * powerMultiplier * crowdMultiplier);

        createHitBurst(note, rating);
        audio.playLane(note.lane, rating);
        if (!automated) showJudgement(rating);
        else if (combo % 4 === 0) showJudgement('AUTO');

        const powerMilestone = Math.floor(combo / 16);
        if (powerMilestone > 0 && powerMilestone > lastPowerCombo) {
            lastPowerCombo = powerMilestone;
            activatePower();
        }
        updateMood();
    }

    function missNote(note) {
        note.missed = true;
        combo = 0;
        lastPowerCombo = 0;
        missCount += 1;
        crowd = Math.max(0, crowd - 6.5);
        if (missCount < 4 || missCount % 4 === 0) showJudgement('MISS');
        audio.playMiss();
        updateMood();
    }

    function ghostTap(laneIndex) {
        combo = 0;
        lastPowerCombo = 0;
        crowd = Math.max(0, crowd - 1.4);
        animatePerformer(laneIndex, 'GHOST');
        createGhostRipple(laneIndex);
        updateMood();
    }

    function activatePower() {
        activePower = POWERS[powerCursor % POWERS.length];
        powerCursor += 1;
        powerEndsAt = elapsed + activePower.duration;
        powerBannerEndsAt = elapsed + 2_300;
        els.powerName.textContent = activePower.name;
        els.powerEffect.textContent = activePower.effect;
        els.powerBanner.hidden = false;
        els.powerBanner.style.animation = 'none';
        void els.powerBanner.offsetWidth;
        els.powerBanner.style.animation = '';
        audio.playPower();
        createPowerBurst();
        announce(`피버. ${activePower.name}. ${activePower.effect}.`);
    }

    function updateMood() {
        let mood = MOODS[0];
        for (const candidate of MOODS) {
            if (combo >= candidate.combo) mood = candidate;
        }
        if (mood.label !== lastMood) {
            lastMood = mood.label;
            els.moodValue.textContent = mood.label;
        }
        els.moodBadge.classList.toggle('is-hot', combo >= 24);
    }

    function renderHud() {
        const remaining = Math.max(0, GAME_DURATION - elapsed);
        els.timeValue.textContent = (remaining / 1_000).toFixed(1);
        els.scoreValue.textContent = score.toLocaleString('ko-KR');
        els.comboValue.textContent = combo.toLocaleString('ko-KR');
        els.trackProgress.value = Math.min(GAME_DURATION, Math.max(0, elapsed));
        updateMood();
    }

    function showJudgement(rating) {
        els.judgement.textContent = rating;
        els.judgement.dataset.rating = rating;
        els.judgement.classList.remove('is-active');
        void els.judgement.offsetWidth;
        els.judgement.classList.add('is-active');
    }

    function pulseLane(laneIndex) {
        lanePulse[laneIndex] = 1;
        const button = els.laneButtons[laneIndex];
        button.classList.add('is-pressed');
        window.setTimeout(() => button.classList.remove('is-pressed'), 95);
    }

    function animatePerformer(laneIndex, rating) {
        const performer = els.performers[laneIndex];
        if (!performer) return;
        window.clearTimeout(performerTimers[laneIndex]);
        performer.classList.remove('is-playing', 'is-perfect');
        const verb = performer.querySelector('.performer__verb');
        if (verb) {
            const direction = (beatIndex + laneIndex) % 2 === 0 ? -1 : 1;
            verb.style.setProperty('--verb-tilt', `${direction * (4 + ((beatIndex + laneIndex) % 5))}deg`);
        }
        void performer.offsetWidth;
        performer.classList.add('is-playing');
        performer.classList.toggle('is-perfect', rating === 'PERFECT');
        performerTimers[laneIndex] = window.setTimeout(() => {
            performer.classList.remove('is-playing', 'is-perfect');
        }, document.body.classList.contains('effects-reduced') ? 120 : 590);
    }

    function createHitBurst(note, rating) {
        const position = notePosition(note);
        const amount = document.body.classList.contains('effects-reduced') ? 4 : rating === 'PERFECT' ? 24 : 15;
        for (let index = 0; index < amount; index += 1) {
            const angle = (Math.PI * 2 * index) / amount + Math.random() * 0.3;
            const speed = 85 + Math.random() * 210;
            particles.push({
                x: position.x,
                y: hitLineY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 30,
                size: 2 + Math.random() * 5,
                color: note.gold ? '#fff3a1' : LANES[note.lane].color,
                life: 0.48 + Math.random() * 0.4,
                maxLife: 0.85,
                shape: index % 3
            });
        }
        ripples.push({
            x: position.x,
            y: hitLineY,
            radius: 18,
            life: 0.38,
            maxLife: 0.38,
            color: LANES[note.lane].color
        });
        if (rating === 'PERFECT') {
            els.hitFlash.classList.remove('is-active');
            void els.hitFlash.offsetWidth;
            els.hitFlash.classList.add('is-active');
        }
    }

    function createGhostRipple(laneIndex) {
        const layout = getLaneLayout();
        ripples.push({
            x: layout.left + layout.laneWidth * (laneIndex + 0.5),
            y: hitLineY,
            radius: 12,
            life: 0.22,
            maxLife: 0.22,
            color: '#ff6c7e'
        });
    }

    function createPowerBurst() {
        const amount = document.body.classList.contains('effects-reduced') ? 8 : 54;
        for (let index = 0; index < amount; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 90 + Math.random() * 320;
            particles.push({
                x: canvasWidth / 2,
                y: canvasHeight * 0.45,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 3 + Math.random() * 6,
                color: LANES[index % LANES.length].color,
                life: 0.8 + Math.random() * 0.7,
                maxLife: 1.5,
                shape: index % 3
            });
        }
    }

    function createConfetti() {
        const amount = document.body.classList.contains('effects-reduced') ? 14 : 110;
        for (let index = 0; index < amount; index += 1) {
            particles.push({
                x: Math.random() * canvasWidth,
                y: -20 - Math.random() * canvasHeight * 0.25,
                vx: -50 + Math.random() * 100,
                vy: 90 + Math.random() * 190,
                size: 3 + Math.random() * 7,
                color: LANES[index % LANES.length].color,
                life: 1.6 + Math.random() * 1.6,
                maxLife: 3.2,
                shape: index % 3,
                gravity: 65
            });
        }
    }

    function updateEffects(deltaMs) {
        const delta = Math.min(0.05, deltaMs / 1_000);
        backgroundBeatGlow = Math.max(0, backgroundBeatGlow - delta * 2.4);
        lanePulse = lanePulse.map((value) => Math.max(0, value - delta * 4.8));
        for (const particle of particles) {
            particle.life -= delta;
            particle.x += particle.vx * delta;
            particle.y += particle.vy * delta;
            particle.vy += (particle.gravity ?? 220) * delta;
            particle.vx *= 1 - delta * 0.9;
        }
        particles = particles.filter((particle) => particle.life > 0);
        for (const ripple of ripples) {
            ripple.life -= delta;
            ripple.radius += 170 * delta;
        }
        ripples = ripples.filter((ripple) => ripple.life > 0);
    }

    function createStars(amount) {
        const stars = [];
        let seed = 16_031;
        const random = () => {
            seed = (seed * 48271) % 2147483647;
            return seed / 2147483647;
        };
        for (let index = 0; index < amount; index += 1) {
            stars.push({
                x: random(),
                y: random() * 0.72,
                size: 0.5 + random() * 1.8,
                phase: random() * Math.PI * 2
            });
        }
        return stars;
    }

    function resizeCanvas() {
        const rect = els.canvas.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (!resizeNeeded && width === canvasWidth && height === canvasHeight && dpr === canvasDpr) return;
        resizeNeeded = false;
        canvasWidth = width;
        canvasHeight = height;
        canvasDpr = dpr;
        els.canvas.width = Math.round(width * dpr);
        els.canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        hitLineY = Math.max(150, height - Math.min(88, height * 0.16));
    }

    function getLaneLayout() {
        let sideInset = 0;
        if (canvasWidth >= 881) {
            sideInset = Math.min(214, canvasWidth * 0.2);
        } else if (canvasWidth >= 661) {
            sideInset = Math.min(124, canvasWidth * 0.17);
        }
        const width = Math.max(1, canvasWidth - sideInset * 2);
        return {
            left: sideInset,
            right: sideInset + width,
            width,
            laneWidth: width / LANES.length
        };
    }

    function notePosition(note) {
        const layout = getLaneLayout();
        const progress = (elapsed - (note.targetTime - noteTravelTime)) / noteTravelTime;
        const eased = Math.pow(Math.max(-0.08, progress), 1.08);
        const y = -58 + eased * (hitLineY + 58);
        return {
            x: layout.left + layout.laneWidth * (note.lane + 0.5),
            y,
            progress,
            laneWidth: layout.laneWidth
        };
    }

    function drawFrame(now) {
        resizeCanvas();
        if (!canvasWidth || !canvasHeight) return;
        drawBackground(now);
        drawLanes(now);
        drawNotes(now);
        drawRipples();
        drawParticles();
        drawCrowdMeter();
    }

    function drawBackground(now) {
        const gradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
        gradient.addColorStop(0, '#090a26');
        gradient.addColorStop(0.55, activePower?.id === 'famous' ? '#281d35' : '#10113b');
        gradient.addColorStop(1, '#050612');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        const reduced = document.body.classList.contains('effects-reduced');
        for (const star of backgroundStars) {
            const twinkle = reduced ? 0.58 : 0.38 + Math.sin(now * 0.002 + star.phase) * 0.22;
            ctx.globalAlpha = Math.max(0.12, twinkle);
            ctx.fillStyle = '#d9e5ff';
            ctx.beginPath();
            ctx.arc(star.x * canvasWidth, star.y * canvasHeight, star.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;

        const glowStrength = 0.08 + backgroundBeatGlow * 0.18;
        const stageGlow = ctx.createRadialGradient(canvasWidth / 2, canvasHeight * 0.36, 10, canvasWidth / 2, canvasHeight * 0.42, canvasWidth * 0.65);
        stageGlow.addColorStop(0, `rgba(154, 118, 255, ${glowStrength + 0.05})`);
        stageGlow.addColorStop(0.55, `rgba(255, 79, 167, ${glowStrength * 0.48})`);
        stageGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = stageGlow;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        drawLightBeams(now);
        drawHorizonGrid(now);
    }

    function drawLightBeams(now) {
        const reduced = document.body.classList.contains('effects-reduced');
        const layout = getLaneLayout();
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        for (let index = 0; index < 4; index += 1) {
            const sway = reduced ? 0 : Math.sin(now * 0.00045 + index * 1.7) * layout.width * 0.05;
            const center = layout.left + layout.laneWidth * (index + 0.5) + sway;
            const gradient = ctx.createLinearGradient(center, 0, center, canvasHeight);
            gradient.addColorStop(0, hexToRgba(LANES[index].color, 0.14 + backgroundBeatGlow * 0.07));
            gradient.addColorStop(1, hexToRgba(LANES[index].color, 0));
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(center - 10, 0);
            ctx.lineTo(center + 10, 0);
            ctx.lineTo(center + canvasWidth * 0.18, canvasHeight);
            ctx.lineTo(center - canvasWidth * 0.18, canvasHeight);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }

    function drawHorizonGrid(now) {
        const horizon = canvasHeight * 0.42;
        ctx.save();
        ctx.strokeStyle = 'rgba(109, 113, 192, 0.12)';
        ctx.lineWidth = 1;
        const offset = document.body.classList.contains('effects-reduced') ? 0 : (now * 0.025) % 34;
        for (let index = 0; index < 9; index += 1) {
            const normalized = (index * 34 + offset) / Math.max(1, canvasHeight - horizon);
            const y = horizon + Math.pow(normalized, 1.6) * (canvasHeight - horizon);
            if (y <= canvasHeight) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvasWidth, y);
                ctx.stroke();
            }
        }
        for (let index = -5; index <= 5; index += 1) {
            ctx.beginPath();
            ctx.moveTo(canvasWidth / 2 + index * 18, horizon);
            ctx.lineTo(canvasWidth / 2 + index * canvasWidth * 0.24, canvasHeight);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawLanes(now) {
        const layout = getLaneLayout();
        const laneWidth = layout.laneWidth;
        const runningVisual = ['running', 'countdown', 'paused'].includes(gameState);
        ctx.fillStyle = 'rgba(3, 4, 18, 0.3)';
        ctx.fillRect(layout.left, 0, layout.width, canvasHeight);
        ctx.strokeStyle = 'rgba(255,255,255,0.16)';
        ctx.lineWidth = 1;
        ctx.strokeRect(layout.left + 0.5, 0, Math.max(0, layout.width - 1), canvasHeight);
        for (let laneIndex = 0; laneIndex < LANES.length; laneIndex += 1) {
            const x = layout.left + laneWidth * laneIndex;
            const pulse = lanePulse[laneIndex];
            ctx.fillStyle = hexToRgba(LANES[laneIndex].color, 0.025 + pulse * 0.13);
            ctx.fillRect(x, 0, laneWidth, canvasHeight);
            if (laneIndex > 0) {
                ctx.strokeStyle = 'rgba(255,255,255,0.09)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvasHeight);
                ctx.stroke();
            }
            if (runningVisual) {
                ctx.save();
                ctx.globalAlpha = 0.58 + pulse * 0.42;
                ctx.fillStyle = LANES[laneIndex].color;
                ctx.font = `900 ${Math.max(10, Math.min(14, laneWidth * 0.12))}px sans-serif`;
                ctx.textAlign = 'center';
                const labelY = canvasWidth <= 660 ? 96 : canvasHeight < 330 ? 47 : 66;
                ctx.fillText(`${LANES[laneIndex].key} · ${LANES[laneIndex].instrument}`, x + laneWidth / 2, labelY);
                ctx.restore();
            }
        }

        const lineGradient = ctx.createLinearGradient(0, hitLineY, canvasWidth, hitLineY);
        LANES.forEach((lane, index) => lineGradient.addColorStop(index / 3, lane.color));
        ctx.save();
        ctx.shadowBlur = 15 + backgroundBeatGlow * 12;
        ctx.shadowColor = '#ffffff';
        ctx.strokeStyle = lineGradient;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(layout.left, hitLineY);
        ctx.lineTo(layout.right, hitLineY);
        ctx.stroke();
        ctx.restore();

        const beatPulse = 1 + backgroundBeatGlow * 0.14;
        for (let laneIndex = 0; laneIndex < LANES.length; laneIndex += 1) {
            const centerX = layout.left + laneWidth * (laneIndex + 0.5);
            const radius = Math.min(32, laneWidth * 0.27) * beatPulse;
            ctx.save();
            ctx.strokeStyle = hexToRgba(LANES[laneIndex].color, 0.5 + lanePulse[laneIndex] * 0.4);
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(centerX, hitLineY, radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawNotes(now) {
        if (!['running', 'paused'].includes(gameState)) return;
        for (const note of notes) {
            if (note.hit || note.missed) continue;
            const position = notePosition(note);
            if (position.y < -90 || position.y > canvasHeight + 90) continue;
            const giantScale = activePower?.id === 'giant' ? 1.32 : 1;
            const baseRadius = Math.min(36, position.laneWidth * 0.32) * giantScale;
            const wobble = document.body.classList.contains('effects-reduced') ? 0 : Math.sin(now * 0.006 + note.seed) * 0.035;
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(note.rotation + wobble);
            const color = note.gold || activePower?.id === 'famous' ? '#ffe986' : LANES[note.lane].color;
            drawNoteGlow(color, baseRadius);
            drawNoteShape(note.style.shape, baseRadius, color, note.seed);
            drawNoteText(note, baseRadius);
            ctx.restore();
        }
    }

    function drawNoteGlow(color, radius) {
        ctx.save();
        ctx.globalAlpha = 0.35;
        ctx.shadowBlur = radius * 1.25;
        ctx.shadowColor = color;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawNoteShape(shape, radius, color, seed) {
        ctx.save();
        ctx.fillStyle = hexToRgba(color, 0.9);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(1.5, radius * 0.075);
        ctx.lineJoin = 'round';
        ctx.beginPath();

        if (shape === 'triangle' || shape === 'rough-triangle') {
            const rough = shape === 'rough-triangle' ? radius * 0.09 : 0;
            ctx.moveTo(0, -radius);
            ctx.lineTo(radius * 0.9 + rough * Math.sin(seed), radius * 0.72);
            ctx.lineTo(-radius * 0.9 + rough * Math.cos(seed), radius * 0.72);
            ctx.closePath();
        } else if (shape === 'square') {
            ctx.roundRect(-radius * 0.78, -radius * 0.78, radius * 1.56, radius * 1.56, radius * 0.13);
        } else if (shape === 'flat') {
            ctx.roundRect(-radius, -radius * 0.5, radius * 2, radius, radius * 0.15);
        } else if (shape === 'diamond') {
            ctx.moveTo(0, -radius);
            ctx.lineTo(radius * 0.84, 0);
            ctx.lineTo(0, radius);
            ctx.lineTo(-radius * 0.84, 0);
            ctx.closePath();
        } else if (shape === 'bumpy-diamond') {
            const points = 12;
            for (let index = 0; index < points; index += 1) {
                const angle = -Math.PI / 2 + (Math.PI * 2 * index) / points;
                const bump = index % 2 === 0 ? 1 : 0.78;
                const diamondBias = 0.82 + 0.18 * Math.abs(Math.cos(angle * 2));
                const x = Math.cos(angle) * radius * bump * diamondBias;
                const y = Math.sin(angle) * radius * bump;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else if (shape === 'blob') {
            const points = 14;
            for (let index = 0; index < points; index += 1) {
                const angle = (Math.PI * 2 * index) / points;
                const wobble = 0.9 + Math.sin(index * 2.7 + seed) * 0.08;
                const x = Math.cos(angle) * radius * wobble;
                const y = Math.sin(angle) * radius * wobble;
                if (index === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
        } else {
            ctx.arc(0, 0, radius * 0.9, 0, Math.PI * 2);
        }

        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = 0.32;
        ctx.strokeStyle = '#15162f';
        ctx.lineWidth = Math.max(1, radius * 0.045);
        if (shape.includes('rough') || shape.includes('bumpy')) {
            for (let offset = -0.48; offset <= 0.48; offset += 0.24) {
                ctx.beginPath();
                ctx.moveTo(-radius * 0.55, offset * radius);
                ctx.lineTo(radius * 0.55, (offset + 0.18) * radius);
                ctx.stroke();
            }
        } else {
            ctx.beginPath();
            ctx.arc(-radius * 0.22, -radius * 0.24, radius * 0.18, Math.PI, Math.PI * 1.75);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawNoteText(note, radius) {
        const smallCanvas = canvasWidth < 420;
        const fontSize = Math.max(9, Math.min(12.5, radius * 0.34));
        ctx.save();
        ctx.rotate(-note.rotation);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#111225';
        ctx.font = `1000 ${fontSize}px sans-serif`;
        ctx.fillText(note.style.name, 0, -1);
        if (!smallCanvas || radius > 35) {
            ctx.fillStyle = 'rgba(17,18,37,0.76)';
            ctx.font = `800 ${Math.max(7, fontSize * 0.58)}px sans-serif`;
            ctx.fillText(note.style.texture, 0, fontSize * 0.95);
        }
        ctx.restore();
    }

    function drawRipples() {
        for (const ripple of ripples) {
            const alpha = Math.max(0, ripple.life / ripple.maxLife);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = ripple.color;
            ctx.lineWidth = 2 + alpha * 3;
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }
    }

    function drawParticles() {
        for (const particle of particles) {
            const alpha = Math.max(0, Math.min(1, particle.life / Math.max(0.001, particle.maxLife)));
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = particle.color;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.x * 0.02 + particle.y * 0.01);
            if (particle.shape === 0) {
                ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            } else if (particle.shape === 1) {
                ctx.beginPath();
                ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(0, -particle.size);
                ctx.lineTo(particle.size * 0.8, particle.size * 0.6);
                ctx.lineTo(-particle.size * 0.8, particle.size * 0.6);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        }
    }

    function drawCrowdMeter() {
        if (!['running', 'paused'].includes(gameState)) return;
        const layout = getLaneLayout();
        const width = Math.min(layout.width * 0.52, 300);
        const height = 7;
        const x = layout.left + (layout.width - width) / 2;
        const y = canvasHeight - 20;
        ctx.save();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, height / 2);
        ctx.fill();
        const meterGradient = ctx.createLinearGradient(x, y, x + width, y);
        meterGradient.addColorStop(0, '#9a76ff');
        meterGradient.addColorStop(0.55, '#48e7ff');
        meterGradient.addColorStop(1, '#ffd84d');
        ctx.fillStyle = meterGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, width * (crowd / 100), height, height / 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,0.72)';
        ctx.font = '800 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(crowd >= 90 ? '관객 텐션 MAX · 점수 ×1.35' : '관객 텐션', layout.left + layout.width / 2, y - 5);
        ctx.restore();
    }

    function hexToRgba(hex, alpha) {
        const clean = hex.replace('#', '');
        const value = Number.parseInt(clean, 16);
        const red = (value >> 16) & 255;
        const green = (value >> 8) & 255;
        const blue = value & 255;
        return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`;
    }

    function frame(now) {
        const deltaMs = Math.min(50, Math.max(0, now - previousFrame));
        previousFrame = now;
        if (gameState === 'countdown') updateCountdown(now);
        if (gameState === 'running') updateRunning(now, deltaMs);
        if (gameState !== 'running') updateEffects(deltaMs);
        drawFrame(now);
        rafId = window.requestAnimationFrame(frame);
    }

    function handleLaneButtonPointer(event) {
        event.preventDefault();
        const button = event.currentTarget;
        const laneIndex = Number(button.dataset.lane);
        button.dataset.pointerHandled = 'true';
        attemptHit(laneIndex);
        if (typeof button.setPointerCapture === 'function' && event.pointerId !== undefined) {
            try {
                button.setPointerCapture(event.pointerId);
            } catch (_error) {
                // Pointer capture is optional for a single tap.
            }
        }
    }

    function clearPointerMarker(event) {
        const button = event.currentTarget;
        window.setTimeout(() => {
            delete button.dataset.pointerHandled;
        }, 0);
    }

    function handleLaneButtonClick(event) {
        const button = event.currentTarget;
        if (button.dataset.pointerHandled === 'true') {
            delete button.dataset.pointerHandled;
            return;
        }
        attemptHit(Number(button.dataset.lane));
    }

    function handleKeydown(event) {
        if (event.repeat) return;
        const keyMap = {
            KeyD: 0,
            Digit1: 0,
            KeyF: 1,
            Digit2: 1,
            KeyJ: 2,
            Digit3: 2,
            KeyK: 3,
            Digit4: 3
        };
        if (Object.prototype.hasOwnProperty.call(keyMap, event.code)) {
            if (gameState === 'running') {
                event.preventDefault();
                attemptHit(keyMap[event.code]);
            }
            return;
        }
        if (event.code === 'Escape' || event.code === 'KeyP') {
            if (gameState === 'running') {
                event.preventDefault();
                pauseGame();
            } else if (gameState === 'paused') {
                event.preventDefault();
                resumeGame();
            }
        }
    }

    function bindEvents() {
        els.startGame.addEventListener('click', startCountdown);
        els.playAgain.addEventListener('click', startCountdown);
        els.resumeGame.addEventListener('click', resumeGame);
        els.quitGame.addEventListener('click', returnToMenu);
        els.pauseButton.addEventListener('click', pauseGame);
        els.songSelect.addEventListener('change', (event) => {
            const changed = applySongSelection(event.currentTarget.value, {
                persist: true,
                reset: true,
                announceChange: true
            });
            if (!changed) event.currentTarget.value = SONG.id;
        });

        els.soundToggle.addEventListener('click', async () => {
            record.settings.muted = !record.settings.muted;
            if (!record.settings.muted) await audio.ensure();
            audio.setMuted(record.settings.muted);
            applyPreferences();
            saveRecord();
        });

        els.effectsToggle.addEventListener('click', () => {
            record.settings.reducedEffects = !record.settings.reducedEffects;
            applyPreferences();
            saveRecord();
        });

        els.resetRecord.addEventListener('click', () => {
            if (typeof els.resetDialog.showModal === 'function') {
                els.resetDialog.showModal();
            } else if (window.confirm('이 게임의 최고 점수와 설정을 초기화할까요?')) {
                clearRecord();
            }
        });
        els.confirmReset.addEventListener('click', clearRecord);

        els.laneButtons.forEach((button) => {
            button.addEventListener('pointerdown', handleLaneButtonPointer);
            button.addEventListener('pointerup', clearPointerMarker);
            button.addEventListener('pointercancel', clearPointerMarker);
            button.addEventListener('click', handleLaneButtonClick);
        });

        document.addEventListener('keydown', handleKeydown);
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && gameState === 'running') pauseGame();
        });
        window.addEventListener('resize', () => {
            resizeNeeded = true;
        }, { passive: true });
        REDUCED_MOTION_QUERY.addEventListener?.('change', applyPreferences);
    }

    function init() {
        record = loadRecord();
        setGameState('menu');
        applySongSelection(record.settings.selectedSong ?? DEFAULT_SONG_ID);
        applyPreferences();
        renderBest();
        resetRun();
        bindEvents();
        resizeNeeded = true;
        previousFrame = performance.now();
        rafId = window.requestAnimationFrame(frame);
    }

    window.C16ChaosOrchestra = Object.freeze({
        storageKey: STORAGE_KEY,
        getState: () => ({
            gameState,
            elapsed,
            score,
            combo,
            maxCombo,
            notes: notes.filter((note) => !note.hit && !note.missed).length,
            activePower: activePower?.id ?? null,
            song: {
                id: SONG.id,
                title: SONG.title,
                composer: SONG.composer,
                work: SONG.work,
                bpm: SONG.bpm,
                stepsPerBeat: SONG.stepsPerBeat,
                step: beatIndex,
                chartSteps: SONG.stepEvents.length,
                arrangementSteps: arrangementDuration(SONG.arrangement),
                chartNotes: SONG.chartNotes,
                sourceUrl: SONG.sourceUrl
            },
            librarySize: SONG_LIBRARY.length,
            storageHealthy,
            storageHadRecord,
            animationFrame: rafId
        }),
        hitLane: (laneIndex) => attemptHit(Number(laneIndex)),
        selectSong: (songId) => applySongSelection(String(songId), { reset: true }),
        pause: pauseGame,
        resume: resumeGame,
        finishNow: () => finishRun(true)
    });

    init();
})();
