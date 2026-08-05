(() => {
    "use strict";

    const STORAGE_KEY = "korean3b:c16:instrument-delivery-chaos";
    const SCHEMA_VERSION = 1;
    const ROUND_COUNT = 5;
    const LEGACY_ROUND_COUNT = 3;
    const RELAY_DELAY = 1100;
    const FINAL_RELAY_DELAY = 1400;
    const LAUNCH_X = 138;
    const DISTANCE_SCALE = 18;
    const MAP_STRETCH = DISTANCE_SCALE / 12;
    const CHECKPOINTS = [.25, .5, .75];
    const ENDLESS_CHUNK_LENGTH = 1650;
    const ENDLESS_LOOKAHEAD = 7200;
    const ENDLESS_GRACE_SECONDS = 5.8;
    const ENDLESS_SURFACES = ["smooth", "soft", "bumpy", "normal", "rough"];
    const ENDLESS_SIGNS = [
        "속도 제한: 웃길 때까지",
        "브레이크가 퇴근했습니다",
        "도파민 급유소 24시간",
        "악기 보험 적용 불가",
        "다음 목표: 다음 은하"
    ];

    const INSTRUMENTS = [
        {
            id: "piano",
            name: "피아노",
            color: "#282d48",
            accent: "#fff6db",
            width: 104,
            height: 63,
            radius: 42,
            quote: "피아노가 자동차만 해요!",
            actionVerb: "치다",
            actionPhrase: "피아노 건반을 치다",
            actionRepeat: "치고 또 치기",
            actionIcon: "치",
            aftershock: "건반을 또 치다",
            strengthName: "건반 치기 충격파",
            strengthDetail: "건반을 칠 때마다 앞 장애물까지 도미노로 와장창!",
            launchMultiplier: 1.02,
            verticalMultiplier: .88,
            gravityMultiplier: 1.03,
            special: "피아노 건반을 세게 치다!",
            specialShort: "치다! 쾅!"
        },
        {
            id: "trumpet",
            name: "트럼펫",
            color: "#ffc83d",
            accent: "#ff7043",
            width: 111,
            height: 45,
            radius: 38,
            quote: "저 문으로 넣을 생각도 못 해요!",
            actionVerb: "불다",
            actionPhrase: "트럼펫을 불다",
            actionRepeat: "불고 또 불기",
            actionIcon: "불",
            aftershock: "한 번 더 불다",
            strengthName: "숨 불기 바람포",
            strengthDetail: "트럼펫을 부는 동안 앞쪽 바람이 계속 밀어 줘요!",
            launchMultiplier: 1.24,
            verticalMultiplier: .72,
            gravityMultiplier: .92,
            special: "트럼펫을 힘껏 불다!",
            specialShort: "불다! 후우우!"
        },
        {
            id: "guitar",
            name: "기타",
            color: "#f28b43",
            accent: "#ffe8ae",
            width: 105,
            height: 52,
            radius: 40,
            quote: "그래도 한 번 더 해 볼 만해요!",
            actionVerb: "튕기다",
            actionPhrase: "기타 줄을 튕기다",
            actionRepeat: "튕기고 또 튕기기",
            actionIcon: "튕",
            aftershock: "줄을 또 튕기다",
            strengthName: "줄 튕기기 새총",
            strengthDetail: "줄을 튕길수록 장애물에서 더 세게 튕겨 나가요!",
            launchMultiplier: 1.07,
            verticalMultiplier: .96,
            gravityMultiplier: .95,
            special: "기타 줄을 크게 튕기다!",
            specialShort: "튕기다! 뿅!"
        },
        {
            id: "drum",
            name: "드럼",
            color: "#ff668c",
            accent: "#fff2c8",
            width: 74,
            height: 69,
            radius: 38,
            quote: "이 밴드는 악기 던지기로 유명해요.",
            actionVerb: "차다",
            actionPhrase: "큰북을 차다",
            actionRepeat: "차고 또 차기",
            actionIcon: "차",
            aftershock: "큰북을 또 차다",
            strengthName: "큰북 차기 연타",
            strengthDetail: "큰북을 차면 땅에 닿을 때마다 발로 다시 뻥!",
            launchMultiplier: 1.05,
            verticalMultiplier: .62,
            gravityMultiplier: 1,
            special: "큰북을 힘껏 차다!",
            specialShort: "차다! 뻥!"
        },
        {
            id: "violin",
            name: "바이올린",
            color: "#a95f32",
            accent: "#ffd166",
            width: 94,
            height: 44,
            radius: 35,
            quote: "바이올린이 사람만 해요!",
            actionVerb: "켜다",
            actionPhrase: "바이올린을 켜다",
            actionRepeat: "켜고 또 켜기",
            actionIcon: "켜",
            aftershock: "활로 한 번 더 켜다",
            strengthName: "활 켜기 비행선",
            strengthDetail: "바이올린을 켜는 동안 긴 음이 공중 길이 돼요!",
            launchMultiplier: 1.06,
            verticalMultiplier: .84,
            gravityMultiplier: .58,
            special: "바이올린을 길게 켜다!",
            specialShort: "켜다! 기이잉!"
        }
    ];

    const INSTRUMENT_MAP = new Map(INSTRUMENTS.map((item) => [item.id, item]));

    const SURFACE_TYPES = Object.freeze({
        normal: { id: "normal", name: "평범하다", color: "#e7ae54", line: "#b9772e" },
        smooth: { id: "smooth", name: "매끄럽다", color: "#85d9e9", line: "#3daabd" },
        soft: { id: "soft", name: "부드럽다", color: "#ff9fc0", line: "#d95c8a" },
        bumpy: { id: "bumpy", name: "울퉁불퉁하다", color: "#9bd270", line: "#5b9c38" },
        rough: { id: "rough", name: "거칠다", color: "#b28c72", line: "#795d4d" },
        finish: { id: "finish", name: "목표 돌파대", color: "#f4bd54", line: "#b9772e" }
    });

    const SHAPES = [
        { id: "triangle", name: "세모", color: "#ff6b57" },
        { id: "square", name: "네모", color: "#6f72dc" },
        { id: "circle", name: "동그라미", color: "#43c8a2" },
        { id: "diamond", name: "마름모", color: "#ffd33f" }
    ];

    const HELPER_TYPES = Object.freeze({
        light: {
            id: "light",
            name: "응원 풍선",
            tier: "가벼운 도움",
            badge: "가벼움",
            color: "#ff8fb3",
            accent: "#67d9b2",
            radius: 34,
            impact: "후우!",
            message: "응원 풍선이 살짝 밀어 줬어요!"
        },
        strong: {
            id: "strong",
            name: "로켓 택배함",
            tier: "강력한 도움",
            badge: "강력",
            color: "#ff9e43",
            accent: "#ffd846",
            radius: 46,
            impact: "특급 로켓!",
            message: "로켓 택배함이 강제로 특급 배송!"
        },
        absurd: {
            id: "absurd",
            name: "UFO 견인 서비스",
            tier: "말도 안 되는 도움",
            badge: "말도 안 됨",
            color: "#855bd8",
            accent: "#56e0d0",
            radius: 68,
            impact: "UFO 무료 견인!!!",
            message: "UFO가 악기 배송을 인수했습니다!!"
        }
    });

    const STAGES = [
        {
            id: "parking",
            name: "끝없는 주차장 탈출",
            shortName: "긴 주차장",
            tagline: "목표 800m! 출구가 왜 이렇게 멀죠? 도움 사물을 정면으로 들이받으세요!",
            goalDistance: 800,
            timeLimit: 19,
            goalLabel: "연습실 전용 주차칸",
            goalJoke: "악기만 주차 가능",
            goalColor: "#ff8fb3",
            skyTop: "#76d9fb",
            skyBottom: "#dff8ff",
            skyline: ["#8ac9ce", "#a7d9d8"],
            gravity: 860,
            gravityPulse: 0,
            gravityCycle: 1,
            wind: 10,
            windGust: 12,
            windCycle: .75,
            bounce: 1.06,
            cruiseSpeed: 2350,
            obstacleGap: 340,
            obstacleJitter: 260,
            obstacleScale: .86,
            airChance: .12,
            finishBoost: 270,
            surfacePattern: ["normal", "smooth", "normal", "soft", "smooth", "normal", "finish"],
            checkpointLines: [
                "25%! 출구인 줄 알았던 표지판이 또 출구를 가리켜요!",
                "절반! 주차권은 없지만 악기는 계속 갑니다!",
                "75%! 연습실 경비원이 먼저 도망갔어요!"
            ],
            landmarks: [[.2, "출구인 줄 알았던 입구"], [.47, "카트 대피소"], [.72, "주차권 분실 센터"]],
            helpers: [["light", 480, 180], ["strong", 1120, 130], ["light", 1950, 215], ["strong", 2850, 145], ["light", 3850, 175], ["absurd", 4950, 190], ["light", 6150, 150], ["strong", 7200, 125], ["light", 8250, 205], ["absurd", 9150, 170]]
        },
        {
            id: "bubble-road",
            name: "거품 폭풍 비눗방울 대로",
            shortName: "거품 폭풍",
            tagline: "목표 950m! 바람이 밀었다가 딴청을 피웁니다. 풍선을 연달아 터뜨리세요!",
            goalDistance: 950,
            timeLimit: 21,
            goalLabel: "거품 세차 공연장",
            goalJoke: "마른 악기 출입 금지",
            goalColor: "#56e0d0",
            skyTop: "#88e7dd",
            skyBottom: "#e6fff8",
            skyline: ["#9bded0", "#b9eadc"],
            gravity: 840,
            gravityPulse: .05,
            gravityCycle: 1.1,
            wind: 32,
            windGust: 34,
            windCycle: 1.3,
            bounce: 1.1,
            cruiseSpeed: 2500,
            obstacleGap: 300,
            obstacleJitter: 230,
            obstacleScale: .9,
            airChance: .28,
            finishBoost: 240,
            surfacePattern: ["smooth", "soft", "smooth", "soft", "smooth", "normal", "finish"],
            checkpointLines: [
                "25%! 비눗방울이 교통 신호를 대신하고 있어요!",
                "절반! 거품 휴게소는 수건을 팔지 않습니다!",
                "75%! 바람 과속 단속반도 날아가 버렸어요!"
            ],
            landmarks: [[.2, "비눗방울 세차장"], [.48, "거품 휴게소"], [.73, "바람 과속 단속"]],
            helpers: [["light", 460, 180], ["light", 920, 135], ["strong", 1650, 130], ["light", 2550, 235], ["strong", 3550, 145], ["absurd", 4850, 185], ["light", 6200, 155], ["strong", 7450, 125], ["light", 8700, 225], ["absurd", 9950, 180], ["strong", 10850, 130]]
        },
        {
            id: "rocket-yard",
            name: "안전모 없는 로켓 공사장",
            shortName: "로켓 공사장",
            tagline: "목표 1100m! 맞바람과 큰 장애물이 있지만 로켓 택배함도 많습니다!",
            goalDistance: 1100,
            timeLimit: 22,
            goalLabel: "로켓 반품 창구",
            goalJoke: "폭발한 상품도 교환 가능",
            goalColor: "#ff9e43",
            skyTop: "#ffbc75",
            skyBottom: "#fff0c2",
            skyline: ["#d9a06d", "#edbd7d"],
            gravity: 950,
            gravityPulse: .04,
            gravityCycle: 1.4,
            wind: -28,
            windGust: 38,
            windCycle: 1.05,
            bounce: .96,
            cruiseSpeed: 2400,
            obstacleGap: 245,
            obstacleJitter: 185,
            obstacleScale: 1.08,
            airChance: .2,
            finishBoost: 270,
            surfacePattern: ["normal", "rough", "normal", "bumpy", "rough", "smooth", "finish"],
            checkpointLines: [
                "25%! 안전모가 악기보다 먼저 날아갔어요!",
                "절반! 공사장 점심시간인데 로켓은 계속 일해요!",
                "75%! 반품 창구 직원이 방패를 들었습니다!"
            ],
            landmarks: [[.19, "안전모 추격 구간"], [.46, "공사장 점심시간"], [.71, "로켓 반품 대기 줄"]],
            helpers: [["strong", 500, 185], ["light", 1150, 245], ["strong", 2200, 145], ["light", 3400, 215], ["strong", 4650, 125], ["absurd", 5950, 180], ["strong", 7450, 135], ["light", 8950, 240], ["strong", 10350, 125], ["absurd", 11700, 180], ["strong", 12750, 135]]
        },
        {
            id: "upside-carnival",
            name: "중력 분실 놀이공원",
            shortName: "놀이공원",
            tagline: "목표 1300m! 중력이 출근과 퇴근을 반복합니다. 공중 장애물을 타고 튀세요!",
            goalDistance: 1300,
            timeLimit: 24,
            goalLabel: "거꾸로 분실물 센터",
            goalJoke: "분실물: 중력 1개",
            goalColor: "#b69aff",
            skyTop: "#b69aff",
            skyBottom: "#ffe3f0",
            skyline: ["#a986d4", "#d5a1cf"],
            gravity: 720,
            gravityPulse: .24,
            gravityCycle: 1.15,
            wind: 54,
            windGust: 45,
            windCycle: .9,
            bounce: 1.34,
            cruiseSpeed: 2750,
            obstacleGap: 230,
            obstacleJitter: 200,
            obstacleScale: .92,
            airChance: .52,
            finishBoost: 250,
            surfacePattern: ["soft", "bumpy", "smooth", "soft", "bumpy", "smooth", "finish"],
            checkpointLines: [
                "25%! 회전목마가 멀미약을 찾고 있어요!",
                "절반! 거꾸로 매표소가 잔돈을 위로 던집니다!",
                "75%! 솜사탕 기상청이 악기 비를 예보했어요!"
            ],
            landmarks: [[.18, "회전목마 멀미센터"], [.45, "거꾸로 매표소"], [.72, "솜사탕 기상청"]],
            helpers: [["strong", 470, 225], ["light", 1050, 265], ["absurd", 1950, 180], ["light", 3350, 155], ["strong", 4750, 125], ["absurd", 6350, 195], ["light", 7900, 255], ["strong", 9450, 130], ["absurd", 11100, 185], ["light", 12900, 250], ["strong", 14500, 125], ["absurd", 15200, 180]]
        },
        {
            id: "alien-venue",
            name: "은하계 외계인 공연장",
            shortName: "외계 공연장",
            tagline: "목표 1550m! 우주 바람과 UFO가 번갈아 난입합니다. 상식은 출발점에 두고 오세요!",
            goalDistance: 1550,
            timeLimit: 26,
            goalLabel: "은하계 메인 무대",
            goalJoke: "관객 98%가 촉수 보유",
            goalColor: "#855bd8",
            skyTop: "#272450",
            skyBottom: "#755fc1",
            skyline: ["#51477d", "#6d5c98"],
            gravity: 620,
            gravityPulse: .18,
            gravityCycle: 1.6,
            wind: 82,
            windGust: 95,
            windCycle: 1.35,
            bounce: 1.14,
            cruiseSpeed: 2950,
            obstacleGap: 215,
            obstacleJitter: 175,
            obstacleScale: 1.05,
            airChance: .38,
            finishBoost: 330,
            surfacePattern: ["smooth", "rough", "soft", "bumpy", "rough", "smooth", "normal", "finish"],
            checkpointLines: [
                "25%! 달 뒷면 편의점은 오늘도 앞문만 열었습니다!",
                "절반! 화성 휴게소가 지구 돈을 모른 척해요!",
                "75%! 외계인 입장 줄이 이미 지구까지 이어졌어요!"
            ],
            landmarks: [[.17, "달 뒷면 편의점"], [.44, "화성 휴게소(휴무)"], [.7, "외계인 입장 대기 줄"]],
            helpers: [["strong", 650, 185], ["light", 1600, 260], ["absurd", 3050, 190], ["strong", 4750, 125], ["light", 6500, 245], ["absurd", 8250, 185], ["strong", 10500, 130], ["light", 11950, 255], ["absurd", 13250, 180], ["strong", 15100, 125], ["light", 16700, 235], ["absurd", 17900, 180]]
        }
    ];

    const COMEDY_LINES = [
        "피아노가 자동차만 해요!",
        "저 문으로 넣을 생각도 못 해요!",
        "그래도 한 번 더 해 볼 만해요!",
        "이 밴드는 악기 던지기로 유명해요."
    ];

    const IMPACT_WORDS = ["쾅!", "뿌웅!", "와장창!", "통!", "얼레?", "데굴!", "배송 완료?", "악기 맞음!"];

    const elements = {
        root: document.getElementById("gameRoot"),
        stage: document.getElementById("stage"),
        canvas: document.getElementById("gameCanvas"),
        menuScreen: document.getElementById("menuScreen"),
        pauseScreen: document.getElementById("pauseScreen"),
        finalScreen: document.getElementById("finalScreen"),
        startGame: document.getElementById("startGame"),
        startGameLabel: document.getElementById("startGameLabel"),
        resumeGame: document.getElementById("resumeGame"),
        quitGame: document.getElementById("quitGame"),
        playAgain: document.getElementById("playAgain"),
        actionDock: document.getElementById("actionDock"),
        actionButton: document.getElementById("actionButton"),
        actionIcon: document.getElementById("actionIcon"),
        actionLabel: document.getElementById("actionLabel"),
        actionHint: document.getElementById("actionHint"),
        endRunButton: document.getElementById("endRunButton"),
        aimPanel: document.getElementById("aimPanel"),
        angleValue: document.getElementById("angleValue"),
        powerFill: document.getElementById("powerFill"),
        powerLabel: document.getElementById("powerLabel"),
        stageName: document.getElementById("stageName"),
        roundValue: document.getElementById("roundValue"),
        distanceValue: document.getElementById("distanceValue"),
        targetDistanceValue: document.getElementById("targetDistanceValue"),
        scoreValue: document.getElementById("scoreValue"),
        bestValue: document.getElementById("bestValue"),
        menuBestScore: document.getElementById("menuBestScore"),
        menuBestDistance: document.getElementById("menuBestDistance"),
        relayStrip: document.getElementById("relayStrip"),
        strengthRibbon: document.getElementById("strengthRibbon"),
        strengthOwner: document.getElementById("strengthOwner"),
        strengthName: document.getElementById("strengthName"),
        strengthDetail: document.getElementById("strengthDetail"),
        relayToast: document.getElementById("relayToast"),
        relayKicker: document.getElementById("relayKicker"),
        relayTitle: document.getElementById("relayTitle"),
        relayDetail: document.getElementById("relayDetail"),
        relayNext: document.getElementById("relayNext"),
        finalScore: document.getElementById("finalScore"),
        finalTitle: document.getElementById("finalTitle"),
        finalDistance: document.getElementById("finalDistance"),
        finalGoals: document.getElementById("finalGoals"),
        finalDestroyed: document.getElementById("finalDestroyed"),
        newRecord: document.getElementById("newRecord"),
        speechBubble: document.getElementById("speechBubble"),
        speechText: document.getElementById("speechText"),
        impactLabel: document.getElementById("impactLabel"),
        pauseButton: document.getElementById("pauseButton"),
        soundToggle: document.getElementById("soundToggle"),
        soundIcon: document.getElementById("soundIcon"),
        effectsToggle: document.getElementById("effectsToggle"),
        resetRecord: document.getElementById("resetRecord"),
        resetDialog: document.getElementById("resetDialog"),
        confirmReset: document.getElementById("confirmReset"),
        saveStatus: document.getElementById("saveStatus"),
        liveRegion: document.getElementById("liveRegion")
    };

    const ctx = elements.canvas.getContext("2d");

    function createDefaultRecord() {
        return {
            schemaVersion: SCHEMA_VERSION,
            bestScore: 0,
            bestDistance: 0,
            plays: 0,
            lastRun: null,
            activeRun: null,
            settings: {
                muted: false,
                reducedEffects: false
            }
        };
    }

    function finiteNumber(value, fallback = 0) {
        return Number.isFinite(value) ? value : fallback;
    }

    function withDirectionParticle(value) {
        const word = String(value || "다음 스테이지");
        const lastCode = word.charCodeAt(word.length - 1);
        if (lastCode < 0xAC00 || lastCode > 0xD7A3) return `${word}로`;
        const finalConsonant = (lastCode - 0xAC00) % 28;
        return `${word}${finalConsonant === 0 || finalConsonant === 8 ? "로" : "으로"}`;
    }

    function validResult(value) {
        return value && typeof value === "object"
            && INSTRUMENT_MAP.has(value.instrumentId)
            && Number.isFinite(value.distance)
            && Number.isFinite(value.score)
            && Number.isFinite(value.destroyed);
    }

    function validActiveRun(value) {
        if (!value || typeof value !== "object") return false;
        if (!Array.isArray(value.order) || ![LEGACY_ROUND_COUNT, ROUND_COUNT].includes(value.order.length)) return false;
        if (!value.order.every((id) => INSTRUMENT_MAP.has(id))) return false;
        if (!Number.isInteger(value.roundIndex) || value.roundIndex < 0 || value.roundIndex >= value.order.length) return false;
        if (!Array.isArray(value.results) || !value.results.every(validResult)) return false;
        return [value.totalScore, value.totalDestroyed, value.maxDistance].every(Number.isFinite);
    }

    function normalizeActiveRun(value) {
        if (!validActiveRun(value)) return null;
        const order = value.order.slice(0, ROUND_COUNT);
        for (const instrument of INSTRUMENTS) {
            if (order.length >= ROUND_COUNT) break;
            if (!order.includes(instrument.id)) order.push(instrument.id);
        }
        return {
            order,
            roundIndex: value.roundIndex,
            totalScore: Math.max(0, Math.round(value.totalScore)),
            totalDestroyed: Math.max(0, Math.round(value.totalDestroyed)),
            maxDistance: Math.max(0, Math.round(value.maxDistance)),
            results: value.results.slice(0, ROUND_COUNT).map((result, index) => {
                const goalDistance = Math.max(1, Math.round(finiteNumber(result.goalDistance, STAGES[index]?.goalDistance || 800)));
                const distance = Math.max(0, Math.round(result.distance));
                return {
                    instrumentId: result.instrumentId,
                    distance,
                    score: Math.max(0, Math.round(result.score)),
                    destroyed: Math.max(0, Math.round(result.destroyed)),
                    helpers: Math.max(0, Math.round(finiteNumber(result.helpers))),
                    goalDistance,
                    reachedGoal: typeof result.reachedGoal === "boolean" ? result.reachedGoal : distance >= goalDistance,
                    endlessDistance: Math.max(0, Math.round(finiteNumber(result.endlessDistance, distance - goalDistance))),
                    endlessCombo: Math.max(0, Math.round(finiteNumber(result.endlessCombo))),
                    endlessHelpers: Math.max(0, Math.round(finiteNumber(result.endlessHelpers))),
                    endlessCrashes: Math.max(0, Math.round(finiteNumber(result.endlessCrashes)))
                };
            }),
            startedAt: typeof value.startedAt === "string" ? value.startedAt : new Date().toISOString()
        };
    }

    function normalizeRecord(value) {
        if (!value || typeof value !== "object" || value.schemaVersion !== SCHEMA_VERSION) return null;
        const settings = value.settings && typeof value.settings === "object" ? value.settings : {};
        return {
            schemaVersion: SCHEMA_VERSION,
            bestScore: Math.max(0, Math.round(finiteNumber(value.bestScore))),
            bestDistance: Math.max(0, Math.round(finiteNumber(value.bestDistance))),
            plays: Math.max(0, Math.round(finiteNumber(value.plays))),
            lastRun: value.lastRun && typeof value.lastRun === "object" ? value.lastRun : null,
            activeRun: normalizeActiveRun(value.activeRun),
            settings: {
                muted: Boolean(settings.muted),
                reducedEffects: Boolean(settings.reducedEffects)
            }
        };
    }

    let protectedStorage = false;
    let storageAvailable = true;

    function setSaveStatus(message, tone = "normal") {
        elements.saveStatus.textContent = message;
        if (tone === "normal") {
            elements.saveStatus.removeAttribute("data-tone");
        } else {
            elements.saveStatus.dataset.tone = tone;
        }
    }

    function loadRecord() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw === null) return createDefaultRecord();
            let parsed;
            try {
                parsed = JSON.parse(raw);
            } catch (_error) {
                protectedStorage = true;
                setSaveStatus("이전 기록을 보존 중", "error");
                return createDefaultRecord();
            }
            const normalized = normalizeRecord(parsed);
            if (!normalized) {
                protectedStorage = true;
                setSaveStatus("낯선 기록을 보존 중", "error");
                return createDefaultRecord();
            }
            return normalized;
        } catch (_error) {
            storageAvailable = false;
            setSaveStatus("저장 없이도 게임 가능", "error");
            return createDefaultRecord();
        }
    }

    let record = loadRecord();

    function saveRecord(message = "기록 저장됨") {
        if (protectedStorage) {
            setSaveStatus("이전 기록을 보존 중", "error");
            return false;
        }
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
            storageAvailable = true;
            setSaveStatus(message, "success");
            return true;
        } catch (_error) {
            storageAvailable = false;
            setSaveStatus("저장 실패 · 게임은 계속", "error");
            return false;
        }
    }

    const runtime = {
        state: "menu",
        previousState: "aiming",
        width: 900,
        height: 500,
        groundY: 390,
        angle: 42,
        angleDirection: 1,
        power: .25,
        powerDirection: 1,
        cameraX: 0,
        session: null,
        stageInfo: STAGES[0],
        instrument: INSTRUMENTS[0],
        projectile: null,
        obstacles: [],
        helpers: [],
        surfaces: [],
        helperHits: { light: 0, strong: 0, absurd: 0 },
        particles: [],
        specialAvailable: false,
        aftershockCharges: 0,
        lastNudgeAt: 0,
        flightSeconds: 0,
        stillSeconds: 0,
        currentDistance: 0,
        currentScore: 0,
        currentDestroyed: 0,
        checkpointIndex: 0,
        goalBoostUsed: false,
        goalReached: false,
        goalReachedAt: -1,
        endlessCombo: 0,
        endlessHelpers: 0,
        endlessCrashes: 0,
        endlessChunkIndex: 0,
        endlessGeneratedUntil: 0,
        lastAccelerationAt: 0,
        breakthroughFlash: 0,
        lastImpactAt: 0,
        bubbleTimer: 0,
        impactTimer: 0,
        actionImpactLockUntil: 0,
        actionSpeechLockUntil: 0,
        suppressNextActionClick: false,
        suppressClickTimer: 0,
        actionPointerStartState: null,
        specialUsedAt: -1,
        transitionTimer: 0,
        audioContext: null,
        lastFrame: performance.now(),
        worldSeed: 1
    };

    function shuffledInstrumentIds() {
        const ids = INSTRUMENTS.map((item) => item.id);
        for (let i = ids.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [ids[i], ids[j]] = [ids[j], ids[i]];
        }
        return ids.slice(0, ROUND_COUNT);
    }

    function createSession(order = shuffledInstrumentIds()) {
        const cleanOrder = order
            .filter((id, index, source) => INSTRUMENT_MAP.has(id) && source.indexOf(id) === index)
            .slice(0, ROUND_COUNT);
        while (cleanOrder.length < ROUND_COUNT) {
            const next = INSTRUMENTS.find((item) => !cleanOrder.includes(item.id));
            cleanOrder.push(next.id);
        }
        return {
            order: cleanOrder,
            roundIndex: 0,
            totalScore: 0,
            totalDestroyed: 0,
            maxDistance: 0,
            results: [],
            startedAt: new Date().toISOString()
        };
    }

    function cloneSession(session) {
        return JSON.parse(JSON.stringify(session));
    }

    function announce(message) {
        elements.liveRegion.textContent = "";
        window.setTimeout(() => {
            elements.liveRegion.textContent = message;
        }, 30);
    }

    function updateRecordDisplay() {
        elements.bestValue.textContent = String(record.bestScore);
        elements.menuBestScore.textContent = String(record.bestScore);
        elements.menuBestDistance.textContent = String(record.bestDistance);
        elements.startGameLabel.textContent = record.activeRun ? "배달 이어하기" : "던지기 시작";
    }

    function applySettings() {
        document.body.dataset.reducedEffects = String(record.settings.reducedEffects);
        elements.effectsToggle.setAttribute("aria-pressed", String(record.settings.reducedEffects));
        elements.effectsToggle.textContent = record.settings.reducedEffects ? "효과 원래대로" : "효과 줄이기";
        elements.soundToggle.setAttribute("aria-pressed", String(record.settings.muted));
        elements.soundToggle.setAttribute("aria-label", record.settings.muted ? "소리 켜기" : "소리 끄기");
        elements.soundIcon.textContent = record.settings.muted ? "×" : "♫";
    }

    function setScreenVisibility(state) {
        elements.menuScreen.hidden = state !== "menu";
        elements.pauseScreen.hidden = state !== "paused";
        elements.finalScreen.hidden = state !== "final";
        elements.relayToast.hidden = state !== "transition";
        elements.relayStrip.hidden = state === "menu" || state === "final";
        elements.strengthRibbon.hidden = !["aiming", "charging", "flying"].includes(state);
        const playing = state === "aiming" || state === "charging" || state === "flying" || state === "transition";
        elements.actionDock.hidden = !playing;
        elements.aimPanel.hidden = !(state === "aiming" || state === "charging");
        elements.pauseButton.hidden = !(state === "aiming" || state === "charging" || state === "flying");
    }

    function setState(state) {
        runtime.state = state;
        elements.root.dataset.gameState = state;
        setScreenVisibility(state);
        updateActionButton();
        updateStrengthRibbon();
    }

    function updateStrengthRibbon() {
        const instrument = runtime.instrument || INSTRUMENTS[0];
        const combo = runtime.projectile?.guitarCombo || 0;
        elements.strengthRibbon.style.setProperty("--strength-color", instrument.color);
        elements.strengthOwner.textContent = runtime.goalReached
            ? `${instrument.name} 동작 · ${instrument.actionVerb} · 무한 가속`
            : `${instrument.name} 동작 · ${instrument.actionVerb}`;
        if (runtime.goalReached) {
            elements.strengthName.textContent = `${instrument.strengthName} · 연쇄 × ${runtime.endlessCombo}`;
            elements.strengthDetail.textContent = `목표보다 ${Math.max(0, runtime.currentDistance - runtime.stageInfo.goalDistance)}m 더! 도움과 장애물을 이어 맞혀 가속을 유지하세요.`;
        } else {
            elements.strengthName.textContent = instrument.id === "guitar" && combo > 0
                ? `${instrument.strengthName} × ${combo}`
                : instrument.strengthName;
            elements.strengthDetail.textContent = instrument.id === "guitar" && combo > 0
                ? `줄을 ${combo}번 튕겼어요! 다음 충돌에서 더 세게 튕겨요.`
                : instrument.strengthDetail;
        }
    }

    function updateHud() {
        const round = runtime.session ? runtime.session.roundIndex + 1 : 0;
        const baseScore = runtime.session ? runtime.session.totalScore : 0;
        elements.stageName.textContent = runtime.session ? runtime.stageInfo.shortName : "스테이지";
        elements.stageName.parentElement.title = runtime.session
            ? `스테이지 ${round}: ${runtime.stageInfo.name}`
            : "총 5개 스테이지";
        elements.roundValue.textContent = String(round);
        elements.distanceValue.textContent = String(runtime.currentDistance);
        elements.targetDistanceValue.textContent = runtime.goalReached ? "∞" : String(runtime.stageInfo.goalDistance || 800);
        elements.scoreValue.textContent = String(baseScore + runtime.currentScore);
        elements.bestValue.textContent = String(record.bestScore);
    }

    function updateRelayStrip() {
        if (!runtime.session) {
            elements.relayStrip.replaceChildren();
            return;
        }
        const fragment = document.createDocumentFragment();
        runtime.session.order.forEach((id, index) => {
            const instrument = INSTRUMENT_MAP.get(id);
            const stageInfo = STAGES[index] || STAGES[0];
            const dot = document.createElement("span");
            dot.textContent = instrument?.name.slice(0, 1) || "?";
            dot.title = `스테이지 ${index + 1}: ${stageInfo.name} · ${instrument?.name || "악기"}`;
            if (runtime.session.results[index]) dot.dataset.status = "done";
            else if (index === runtime.session.roundIndex) dot.dataset.status = "current";
            fragment.append(dot);
        });
        elements.relayStrip.replaceChildren(fragment);
    }

    function updateAimDisplay() {
        const percent = Math.round(runtime.power * 100);
        elements.angleValue.textContent = `${Math.round(runtime.angle)}°`;
        elements.powerFill.style.width = `${percent}%`;
        elements.powerLabel.textContent = `힘 ${percent}%`;
    }

    function updateActionButton() {
        elements.endRunButton.hidden = !(runtime.state === "flying" && runtime.goalReached);
        elements.actionButton.classList.remove("is-charging", "is-special", "is-aftershock", "is-next");
        elements.actionButton.removeAttribute("title");
        elements.actionButton.disabled = false;
        if (runtime.state === "aiming") {
            elements.actionIcon.textContent = "●";
            elements.actionLabel.textContent = "꾹 눌러 힘 모으기";
            elements.actionHint.innerHTML = "누르고 있다가 놓기 · <kbd>SPACE</kbd>";
        } else if (runtime.state === "charging") {
            elements.actionButton.classList.add("is-charging");
            elements.actionIcon.textContent = "↗";
            elements.actionLabel.textContent = "놓으면 발사!";
            elements.actionHint.textContent = "힘이 오르락내리락합니다";
        } else if (runtime.state === "flying" && runtime.specialAvailable) {
            elements.actionButton.classList.add("is-special");
            elements.actionIcon.textContent = runtime.instrument.actionIcon;
            elements.actionLabel.textContent = runtime.instrument.special;
            elements.actionHint.innerHTML = `${runtime.instrument.actionPhrase} · <kbd>SPACE</kbd>`;
        } else if (runtime.state === "flying" && runtime.aftershockCharges > 0) {
            elements.actionButton.classList.add("is-aftershock");
            elements.actionIcon.textContent = runtime.instrument.actionIcon;
            elements.actionLabel.textContent = `${runtime.instrument.aftershock}! (${runtime.aftershockCharges})`;
            elements.actionHint.innerHTML = `${runtime.instrument.actionRepeat} · <kbd>SPACE</kbd>`;
        } else if (runtime.state === "flying") {
            elements.actionIcon.textContent = "…";
            elements.actionLabel.textContent = runtime.goalReached ? "다음 가속 폭발을 들이받기" : `${runtime.instrument.actionVerb} 충전 기다리는 중`;
            elements.actionHint.textContent = runtime.goalReached ? `무한 연쇄 × ${runtime.endlessCombo} · 도움과 장애물을 놓치지 마세요` : "장애물에 부딪히면 동작 한 번 더";
            elements.actionButton.disabled = true;
        } else if (runtime.state === "transition") {
            const isLast = runtime.session?.roundIndex >= ROUND_COUNT - 1;
            const nextId = runtime.session?.order[(runtime.session?.roundIndex || 0) + 1];
            const nextName = INSTRUMENT_MAP.get(nextId)?.name || "다음 악기";
            const nextStage = STAGES[(runtime.session?.roundIndex || 0) + 1];
            elements.actionButton.classList.add("is-next");
            elements.actionIcon.textContent = "↪";
            elements.actionLabel.textContent = isLast ? "사고 보고서 바로 보기" : `${withDirectionParticle(nextStage?.shortName)} 바로`;
            elements.actionButton.title = isLast ? "5스테이지 결과 보기" : `${nextStage?.name || "다음 스테이지"} · ${nextName}`;
            elements.actionHint.textContent = "누르지 않아도 잠시 후 자동으로 이어집니다";
        }
    }

    function showSpeech(message, duration = 2300, priority = false) {
        const now = performance.now();
        if (!priority && now < runtime.actionSpeechLockUntil) return;
        if (priority) runtime.actionSpeechLockUntil = now + 900;
        window.clearTimeout(runtime.bubbleTimer);
        elements.speechText.textContent = message;
        elements.speechBubble.hidden = false;
        runtime.bubbleTimer = window.setTimeout(() => {
            elements.speechBubble.hidden = true;
        }, duration);
    }

    function showImpact(word, x = 50, y = 50, priority = false) {
        if (record.settings.reducedEffects) return;
        const now = performance.now();
        if (!priority && now < runtime.actionImpactLockUntil) return;
        if (priority) runtime.actionImpactLockUntil = now + 720;
        elements.impactLabel.textContent = word;
        elements.impactLabel.style.left = `${Math.max(15, Math.min(85, x))}%`;
        elements.impactLabel.style.top = `${Math.max(18, Math.min(80, y))}%`;
        elements.impactLabel.classList.remove("is-showing");
        void elements.impactLabel.offsetWidth;
        elements.impactLabel.classList.add("is-showing");
        window.clearTimeout(runtime.impactTimer);
        runtime.impactTimer = window.setTimeout(() => {
            elements.impactLabel.classList.remove("is-showing");
        }, 680);
    }

    function ensureAudio() {
        if (record.settings.muted) return null;
        if (!runtime.audioContext) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) return null;
            runtime.audioContext = new AudioContextClass();
        }
        if (runtime.audioContext.state === "suspended") runtime.audioContext.resume();
        return runtime.audioContext;
    }

    function playSound(kind) {
        const audio = ensureAudio();
        if (!audio) return;
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        const now = audio.currentTime;
        const settings = {
            launch: [150, 460, .17, "sawtooth"],
            impact: [105, 58, .11, "square"],
            special: [360, 860, .22, "triangle"],
            result: [440, 660, .28, "sine"],
            button: [280, 330, .08, "sine"]
        }[kind] || [220, 260, .08, "sine"];
        oscillator.type = settings[3];
        oscillator.frequency.setValueAtTime(settings[0], now);
        oscillator.frequency.exponentialRampToValueAtTime(Math.max(40, settings[1]), now + settings[2]);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.095, now + .015);
        gain.gain.exponentialRampToValueAtTime(.0001, now + settings[2]);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(now);
        oscillator.stop(now + settings[2] + .02);
    }

    function playInstrumentActionSound(instrumentId, isEcho = false) {
        const audio = ensureAudio();
        if (!audio) return;
        const now = audio.currentTime;
        const volumeScale = isEcho ? .58 : 1;
        const tone = (frequency, endFrequency, duration, type = "sine", delay = 0, volume = .075) => {
            const oscillator = audio.createOscillator();
            const gain = audio.createGain();
            const startsAt = now + delay;
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(Math.max(35, frequency), startsAt);
            oscillator.frequency.exponentialRampToValueAtTime(Math.max(35, endFrequency), startsAt + duration);
            gain.gain.setValueAtTime(.0001, startsAt);
            gain.gain.exponentialRampToValueAtTime(volume * volumeScale, startsAt + .012);
            gain.gain.exponentialRampToValueAtTime(.0001, startsAt + duration);
            oscillator.connect(gain).connect(audio.destination);
            oscillator.start(startsAt);
            oscillator.stop(startsAt + duration + .03);
        };

        if (instrumentId === "piano") {
            [196, 247, 294, 392].forEach((frequency, index) => {
                tone(frequency, frequency * .72, .34, "triangle", index * .035, .055);
            });
        } else if (instrumentId === "trumpet") {
            tone(245, 610, .72, "sawtooth", 0, .067);
            tone(368, 760, .68, "square", .035, .025);
        } else if (instrumentId === "guitar") {
            tone(430, 82, .46, "triangle", 0, .09);
            tone(640, 118, .34, "sine", .025, .045);
        } else if (instrumentId === "drum") {
            tone(118, 38, .3, "sine", 0, .12);
            tone(74, 42, .18, "square", 0, .035);
        } else if (instrumentId === "violin") {
            tone(392, 523, .9, "sine", 0, .06);
            tone(587, 698, .86, "triangle", .04, .032);
        }
    }

    function mulberry32(seed) {
        return function random() {
            let value = seed += 0x6D2B79F5;
            value = Math.imul(value ^ value >>> 15, value | 1);
            value ^= value + Math.imul(value ^ value >>> 7, value | 61);
            return ((value ^ value >>> 14) >>> 0) / 4294967296;
        };
    }

    function getStageWorldEnd(stageInfo = runtime.stageInfo) {
        return LAUNCH_X + (stageInfo?.goalDistance || 800) * DISTANCE_SCALE;
    }

    function createSurfaceSegments(stageInfo = runtime.stageInfo) {
        const pattern = stageInfo?.surfacePattern?.length ? stageInfo.surfacePattern : ["normal", "finish"];
        const worldEnd = getStageWorldEnd(stageInfo);
        const segmentLength = (worldEnd + 500) / pattern.length;
        return pattern.map((surfaceId, index) => ({
            ...(SURFACE_TYPES[surfaceId] || SURFACE_TYPES.normal),
            from: index * segmentLength,
            to: index === pattern.length - 1 ? worldEnd + 500 : (index + 1) * segmentLength
        }));
    }

    function surfaceAt(x) {
        const surfaces = runtime.surfaces.length ? runtime.surfaces : [
            { ...SURFACE_TYPES.normal, from: 0, to: getStageWorldEnd() + 500 }
        ];
        const surface = surfaces.find((item) => x >= item.from && x < item.to);
        if (surface) return surface;
        const worldEnd = getStageWorldEnd();
        if (x >= worldEnd) {
            const stageOffset = runtime.session?.roundIndex || 0;
            const segmentIndex = Math.max(0, Math.floor((x - worldEnd) / ENDLESS_CHUNK_LENGTH));
            return SURFACE_TYPES[ENDLESS_SURFACES[(segmentIndex + stageOffset) % ENDLESS_SURFACES.length]];
        }
        return surfaces[surfaces.length - 1];
    }

    function groundAt(x) {
        const surface = surfaceAt(x);
        if (surface.id === "bumpy") {
            return runtime.groundY + Math.sin(x * .027) * 12 + Math.sin(x * .061) * 5;
        }
        if (surface.id === "rough") {
            return runtime.groundY + Math.sin(x * .11) * 3;
        }
        return runtime.groundY;
    }

    function createObstacles(seed, stageInfo = runtime.stageInfo) {
        const random = mulberry32(seed);
        const obstacles = [];
        const worldEnd = getStageWorldEnd(stageInfo);
        const spacingScale = Math.sqrt(MAP_STRETCH);
        let x = 420;
        while (x < worldEnd - 300) {
            const shape = SHAPES[Math.floor(random() * SHAPES.length)];
            const radius = (25 + random() * 25) * (stageInfo.obstacleScale || 1);
            x += (stageInfo.obstacleGap + random() * stageInfo.obstacleJitter) * spacingScale;
            if (x >= worldEnd - 220) break;
            obstacles.push({
                id: `${shape.id}-${Math.round(x)}`,
                shape: shape.id,
                name: shape.name,
                color: shape.color,
                x,
                y: groundAt(x) - radius - (random() < (stageInfo.airChance || .22) ? 70 + random() * 85 : 0),
                radius,
                rotation: random() * Math.PI,
                destroyed: false,
                wobble: random() * Math.PI * 2
            });
        }
        return obstacles;
    }

    function createHelpers(seed, stageInfo = runtime.stageInfo) {
        const random = mulberry32(seed);
        return stageInfo.helpers.map(([typeId, baseX, height], index) => {
            const type = HELPER_TYPES[typeId];
            const x = LAUNCH_X + (baseX - LAUNCH_X) * MAP_STRETCH + (random() - .5) * 24;
            return {
                id: `${stageInfo.id}-${type.id}-${index}`,
                type: type.id,
                name: type.name,
                tier: type.tier,
                badge: type.badge,
                color: type.color,
                accent: type.accent,
                radius: type.radius,
                impact: type.impact,
                message: type.message,
                x,
                height,
                yJitter: (random() - .5) * 12,
                y: groundAt(x) - height,
                bob: random() * Math.PI * 2,
                used: false
            };
        }).map((helper) => ({ ...helper, y: helper.y + helper.yJitter }));
    }

    function createEndlessHelper(typeId, x, height, index) {
        const type = HELPER_TYPES[typeId];
        return {
            id: `${runtime.stageInfo.id}-endless-helper-${index}-${typeId}`,
            type: type.id,
            name: type.name,
            tier: type.tier,
            badge: type.badge,
            color: type.color,
            accent: type.accent,
            radius: type.radius,
            impact: type.impact,
            message: type.message,
            x,
            height,
            yJitter: 0,
            y: groundAt(x) - height,
            bob: index * 1.73,
            used: false,
            endless: true
        };
    }

    function ensureEndlessCourse(projectileX) {
        if (!runtime.goalReached) return;
        const worldEnd = getStageWorldEnd();
        if (runtime.endlessGeneratedUntil < worldEnd) runtime.endlessGeneratedUntil = worldEnd + 180;
        const targetX = projectileX + Math.max(ENDLESS_LOOKAHEAD, runtime.width * 10);
        const patterns = [
            ["light", "strong"],
            ["strong", "light"],
            ["light", "absurd"],
            ["strong", "strong"],
            ["absurd", "light"]
        ];

        while (runtime.endlessGeneratedUntil < targetX) {
            const chunkIndex = runtime.endlessChunkIndex;
            const random = mulberry32(runtime.worldSeed + 19001 + chunkIndex * 104729);
            const chunkStart = runtime.endlessGeneratedUntil;
            const chunkLength = ENDLESS_CHUNK_LENGTH + (random() - .5) * 220;
            const pattern = patterns[(chunkIndex + (runtime.session?.roundIndex || 0)) % patterns.length];
            const helperPositions = [.23, .68];

            helperPositions.forEach((ratio, helperIndex) => {
                const typeId = pattern[helperIndex];
                const x = chunkStart + chunkLength * ratio;
                const lane = (chunkIndex * 2 + helperIndex + (runtime.session?.roundIndex || 0)) % 4;
                const height = [108, 150, 205, 132][lane] + (random() - .5) * 20;
                runtime.helpers.push(createEndlessHelper(typeId, x, height, chunkIndex * 2 + helperIndex));
            });

            [.43, .86].forEach((ratio, obstacleIndex) => {
                const shape = SHAPES[Math.floor(random() * SHAPES.length)];
                const radius = (27 + random() * 25) * (runtime.stageInfo.obstacleScale || 1);
                const x = chunkStart + chunkLength * ratio;
                const airborne = random() < Math.max(.2, runtime.stageInfo.airChance || .2);
                runtime.obstacles.push({
                    id: `${runtime.stageInfo.id}-endless-obstacle-${chunkIndex}-${obstacleIndex}`,
                    shape: shape.id,
                    name: shape.name,
                    color: shape.color,
                    x,
                    y: groundAt(x) - radius - (airborne ? 65 + random() * 100 : 0),
                    radius,
                    rotation: random() * Math.PI,
                    destroyed: false,
                    wobble: random() * Math.PI * 2,
                    endless: true
                });
            });

            runtime.endlessChunkIndex += 1;
            runtime.endlessGeneratedUntil = chunkStart + chunkLength;
        }

        const cleanupX = projectileX - 2600;
        runtime.helpers = runtime.helpers.filter((helper) => !helper.endless || helper.x > cleanupX);
        runtime.obstacles = runtime.obstacles.filter((obstacle) => !obstacle.endless || obstacle.x > cleanupX);
    }

    function registerEndlessAcceleration(projectile, power = 1) {
        if (!runtime.goalReached || !projectile) return 0;
        runtime.endlessCombo = Math.min(999, runtime.endlessCombo + 1);
        runtime.lastAccelerationAt = runtime.flightSeconds;
        const comboBoost = Math.min(760, 90 + runtime.endlessCombo * 34) * power;
        projectile.vx += comboBoost;
        projectile.vy = Math.min(projectile.vy - 26 * power, -90);
        runtime.currentScore += Math.round(110 + runtime.endlessCombo * 42 * power);
        if (runtime.endlessCombo % 3 === 0) {
            runtime.aftershockCharges = Math.min(3, runtime.aftershockCharges + 1);
        }
        updateStrengthRibbon();
        updateActionButton();
        return runtime.endlessCombo;
    }

    function enterEndlessMode(projectile) {
        if (runtime.goalReached || !projectile) return false;
        runtime.goalReached = true;
        runtime.goalReachedAt = runtime.flightSeconds;
        runtime.lastAccelerationAt = runtime.flightSeconds;
        runtime.endlessCombo = 0;
        runtime.endlessHelpers = 0;
        runtime.endlessCrashes = 0;
        runtime.endlessChunkIndex = 0;
        runtime.endlessGeneratedUntil = getStageWorldEnd() + 180;
        runtime.breakthroughFlash = 1.6;
        runtime.currentScore += 1600 + (runtime.session?.roundIndex || 0) * 400;
        runtime.aftershockCharges = 3;
        projectile.vx += 1350 + (runtime.session?.roundIndex || 0) * 120;
        projectile.vy = Math.min(projectile.vy - 260, -460);
        projectile.absurdTimer = Math.max(projectile.absurdTimer, 2.8);
        projectile.specialFlash = Math.max(projectile.specialFlash, 1.45);
        projectile.actionPulse = Math.max(projectile.actionPulse, 1.35);
        ensureEndlessCourse(projectile.x);
        ["#ffd846", "#ff7043", "#56e0d0", "#ff8fb3"].forEach((color) => {
            spawnParticles(projectile.x, projectile.y, color, 18, 520);
        });
        showImpact("목표 박살!!! ∞", 50, 29, true);
        showSpeech(`${runtime.stageInfo.goalLabel} 돌파! 무한 가속 시작! 원할 때 '다음 스테이지'로 기록을 확정하세요!`, 4200, true);
        playSound("special");
        updateHud();
        updateStrengthRibbon();
        updateActionButton();
        announce(`${runtime.stageInfo.goalDistance}미터 목표 돌파. 무한 가속 모드 개방! 도움 사물과 장애물을 연달아 맞히면 계속 날아갑니다. 원할 때 이 기록으로 다음 스테이지 버튼을 누르세요.`);
        return true;
    }

    function saveActiveSession(message = "진행 자동 저장") {
        if (!runtime.session) return;
        record.activeRun = cloneSession(runtime.session);
        saveRecord(message);
    }

    function startSession(customOrder = null) {
        playSound("button");
        if (customOrder) {
            runtime.session = createSession(customOrder);
        } else if (record.activeRun) {
            runtime.session = cloneSession(record.activeRun);
            if (runtime.session.results.length > runtime.session.roundIndex) {
                if (runtime.session.roundIndex >= ROUND_COUNT - 1) {
                    finishSession();
                    return;
                }
                runtime.session.roundIndex += 1;
            }
        } else {
            runtime.session = createSession();
        }
        record.activeRun = cloneSession(runtime.session);
        saveRecord("배달 진행 저장됨");
        startRound();
    }

    function startRound() {
        const session = runtime.session;
        if (!session) return;
        window.clearTimeout(runtime.transitionTimer);
        runtime.transitionTimer = 0;
        runtime.stageInfo = STAGES[session.roundIndex] || STAGES[0];
        runtime.instrument = INSTRUMENT_MAP.get(session.order[session.roundIndex]) || INSTRUMENTS[0];
        runtime.surfaces = createSurfaceSegments(runtime.stageInfo);
        runtime.angle = 34 + Math.random() * 18;
        runtime.angleDirection = Math.random() > .5 ? 1 : -1;
        runtime.power = .25;
        runtime.powerDirection = 1;
        runtime.cameraX = 0;
        runtime.projectile = null;
        runtime.specialAvailable = false;
        runtime.aftershockCharges = 0;
        runtime.lastNudgeAt = 0;
        runtime.flightSeconds = 0;
        runtime.stillSeconds = 0;
        runtime.currentDistance = 0;
        runtime.currentScore = 0;
        runtime.currentDestroyed = 0;
        runtime.checkpointIndex = 0;
        runtime.goalBoostUsed = false;
        runtime.goalReached = false;
        runtime.goalReachedAt = -1;
        runtime.endlessCombo = 0;
        runtime.endlessHelpers = 0;
        runtime.endlessCrashes = 0;
        runtime.endlessChunkIndex = 0;
        runtime.endlessGeneratedUntil = 0;
        runtime.lastAccelerationAt = 0;
        runtime.breakthroughFlash = 0;
        runtime.helperHits = { light: 0, strong: 0, absurd: 0 };
        runtime.specialUsedAt = -1;
        runtime.actionImpactLockUntil = 0;
        runtime.actionSpeechLockUntil = 0;
        runtime.worldSeed = Date.now() % 2147483647 + session.roundIndex * 997;
        runtime.helpers = createHelpers(runtime.worldSeed + 77, runtime.stageInfo);
        runtime.obstacles = createObstacles(runtime.worldSeed, runtime.stageInfo).filter((obstacle) => (
            !runtime.helpers.some((helper) => Math.abs(obstacle.x - helper.x) < obstacle.radius + helper.radius + 72)
        ));
        runtime.particles = [];
        updateHud();
        updateRelayStrip();
        updateAimDisplay();
        setState("aiming");
        showSpeech(`스테이지 ${session.roundIndex + 1} · ${runtime.stageInfo.name}! ${runtime.stageInfo.tagline}`, 3600);
        const objectMarker = ["piano", "guitar"].includes(runtime.instrument.id) ? "를" : "을";
        announce(`스테이지 ${session.roundIndex + 1}, ${runtime.stageInfo.name}. ${runtime.instrument.name}${objectMarker} 버튼으로 힘 모아 던져 주세요.`);
        window.setTimeout(() => elements.actionButton.focus({ preventScroll: true }), 20);
    }

    function beginCharge() {
        if (runtime.state !== "aiming") return;
        ensureAudio();
        runtime.power = Math.max(.25, runtime.power);
        runtime.powerDirection = 1;
        setState("charging");
        updateAimDisplay();
    }

    function launch() {
        if (runtime.state !== "charging" && runtime.state !== "aiming") return;
        const radians = runtime.angle * Math.PI / 180;
        const speed = (500 + runtime.power * 660) * runtime.instrument.launchMultiplier;
        const startX = LAUNCH_X;
        const startY = groundAt(startX) - runtime.instrument.radius - 8;
        runtime.projectile = {
            x: startX,
            y: startY,
            vx: Math.cos(radians) * speed,
            vy: -Math.sin(radians) * speed * runtime.instrument.verticalMultiplier,
            rotation: -radians * .25,
            angularVelocity: 2.2 + runtime.power * 4,
            radius: runtime.instrument.radius,
            maxX: startX,
            specialTimer: 0,
            drumTimer: 0,
            pianoSmashTimer: 0,
            guitarTimer: 0,
            guitarCombo: 0,
            rocketTimer: 0,
            absurdTimer: 0,
            trailTimer: 0,
            passiveTrailTimer: 0,
            specialFlash: 0,
            actionPulse: 0,
            actionCount: 0,
            lastGroundKickAt: -1000
        };
        runtime.specialAvailable = true;
        runtime.aftershockCharges = 0;
        runtime.specialUsedAt = -1;
        runtime.flightSeconds = 0;
        runtime.stillSeconds = 0;
        setState("flying");
        playSound("launch");
        showImpact("슈우웅!", 34, 48);
        showSpeech(`${runtime.instrument.actionPhrase} 특수기 준비! 지금 누르면 ${runtime.instrument.special}`, 2800);
        announce(`${runtime.instrument.name} 발사. ${runtime.instrument.actionPhrase} 동작 준비! 비행 중 버튼을 한 번 더 누르면 특수 기술이 나갑니다.`);
    }

    function quickLaunch(power = .68, angle = runtime.angle) {
        if (runtime.state === "menu") startSession();
        if (runtime.state !== "aiming" && runtime.state !== "charging") return false;
        runtime.power = Math.max(.25, Math.min(1, Number(power) || .68));
        runtime.angle = Math.max(18, Math.min(68, Number(angle) || runtime.angle));
        updateAimDisplay();
        launch();
        return true;
    }

    function useSpecial() {
        if (runtime.state !== "flying" || !runtime.specialAvailable || !runtime.projectile) return false;
        const projectile = runtime.projectile;
        runtime.specialAvailable = false;
        runtime.aftershockCharges = Math.max(runtime.aftershockCharges, 2);
        runtime.specialUsedAt = runtime.flightSeconds;
        runtime.lastAccelerationAt = runtime.flightSeconds;
        runtime.stillSeconds = 0;
        runtime.currentScore += 240;
        projectile.actionCount += 1;
        switch (runtime.instrument.id) {
            case "piano":
                projectile.vy = Math.max(-430, Math.min(projectile.vy * .4 - 170, -300));
                projectile.vx = Math.max(560, projectile.vx + 420);
                projectile.angularVelocity *= -1.35;
                projectile.pianoSmashTimer = 3.6;
                projectile.actionPulse = 1.35;
                demolishPianoArea(projectile, 560, 3);
                break;
            case "trumpet":
                projectile.vx = Math.max(1450, projectile.vx + 1080);
                projectile.vy = Math.max(-220, Math.min(projectile.vy * .28 - 40, -90));
                projectile.angularVelocity *= .18;
                projectile.rocketTimer = Math.max(projectile.rocketTimer, 2.6);
                projectile.actionPulse = 2.6;
                break;
            case "guitar":
                projectile.guitarCombo = Math.max(projectile.guitarCombo, 3);
                projectile.vx = Math.max(900, projectile.vx + 760);
                projectile.vy = Math.max(-340, Math.min(projectile.vy * .3 - 120, -230));
                projectile.angularVelocity -= 9;
                projectile.guitarTimer = 3.2;
                projectile.actionPulse = 1.45;
                break;
            case "drum":
                projectile.vx = Math.max(1250, projectile.vx + 900);
                projectile.vy = Math.min(projectile.vy - 150, -290);
                projectile.angularVelocity = 18;
                projectile.drumTimer = 5.5;
                projectile.actionPulse = .95;
                projectile.lastGroundKickAt = performance.now();
                runtime.aftershockCharges = 3;
                break;
            case "violin":
                projectile.vy = Math.max(-300, Math.min(projectile.vy * .38 - 70, -170));
                projectile.vx = Math.max(720, projectile.vx + 520);
                projectile.specialTimer = 4.6;
                projectile.angularVelocity = .6;
                projectile.actionPulse = 4.6;
                runtime.aftershockCharges = 3;
                break;
            default:
                break;
        }
        projectile.specialFlash = 1.15;
        spawnParticles(projectile.x, projectile.y, runtime.instrument.color, 18, 280);
        showImpact(runtime.instrument.specialShort, 80, 32, true);
        showSpeech(`${runtime.instrument.specialShort} ${runtime.instrument.strengthDetail}`, 2300, true);
        playInstrumentActionSound(runtime.instrument.id);
        updateStrengthRibbon();
        updateActionButton();
        announce(`${runtime.instrument.actionPhrase}. ${runtime.instrument.specialShort} 특수 기술 사용!`);
        return true;
    }

    function useAftershock() {
        if (runtime.state !== "flying" || runtime.specialAvailable || runtime.aftershockCharges <= 0 || !runtime.projectile) {
            return false;
        }
        const now = performance.now();
        if (now - runtime.lastNudgeAt < 220) return false;
        runtime.lastNudgeAt = now;
        runtime.aftershockCharges -= 1;
        runtime.lastAccelerationAt = runtime.flightSeconds;
        runtime.stillSeconds = 0;
        runtime.currentScore += 45;
        const projectile = runtime.projectile;
        projectile.actionCount += 1;
        let impactWord = "툭!";
        if (runtime.instrument.id === "piano") {
            projectile.vx = Math.max(480, projectile.vx + 230);
            projectile.vy = Math.min(projectile.vy - 150, -185);
            projectile.pianoSmashTimer = Math.max(projectile.pianoSmashTimer, .9);
            projectile.actionPulse = Math.max(projectile.actionPulse, .72);
            demolishPianoArea(projectile, 330, 1);
            impactWord = "치다! 쾅!";
        } else if (runtime.instrument.id === "trumpet") {
            projectile.vx = Math.max(620, projectile.vx + 340);
            projectile.vy = Math.min(projectile.vy - 70, -120);
            projectile.rocketTimer = Math.max(projectile.rocketTimer, .55);
            projectile.actionPulse = Math.max(projectile.actionPulse, .55);
            impactWord = "불다! 후우!";
        } else if (runtime.instrument.id === "guitar") {
            projectile.vx = Math.max(500, projectile.vx + 220);
            projectile.vy = Math.min(projectile.vy - 135, -170);
            projectile.guitarTimer = Math.max(projectile.guitarTimer, .85);
            projectile.actionPulse = Math.max(projectile.actionPulse, .75);
            raiseGuitarCombo(projectile);
            impactWord = `튕기다! ×${projectile.guitarCombo}`;
        } else if (runtime.instrument.id === "drum") {
            projectile.vx = Math.max(560, projectile.vx + 285);
            projectile.vy = Math.min(projectile.vy - 150, -210);
            projectile.drumTimer = Math.max(projectile.drumTimer, 1.4);
            projectile.actionPulse = Math.max(projectile.actionPulse, .75);
            impactWord = "차다! 뻥!";
        } else {
            projectile.vx = Math.max(470, projectile.vx + 190);
            projectile.vy = Math.min(projectile.vy - 225, -245);
            projectile.specialTimer = Math.max(projectile.specialTimer, 1.05);
            projectile.actionPulse = Math.max(projectile.actionPulse, 1.05);
            impactWord = "켜다! 기잉!";
        }
        projectile.angularVelocity += (Math.random() > .5 ? 1 : -1) * 3.5;
        projectile.specialFlash = Math.max(projectile.specialFlash, .48);
        spawnParticles(projectile.x, projectile.y, runtime.instrument.accent, 9, 175);
        showImpact(impactWord, 78, 35, true);
        playInstrumentActionSound(runtime.instrument.id, true);
        updateStrengthRibbon();
        updateActionButton();
        announce(`${runtime.instrument.actionPhrase}, 추가 동작! ${runtime.aftershockCharges}번 남았습니다.`);
        return true;
    }

    function activateFlightAction() {
        if (runtime.specialAvailable) return useSpecial();
        return useAftershock();
    }

    function spawnParticles(x, y, color, count = 8, speed = 180) {
        if (record.settings.reducedEffects) return;
        for (let i = 0; i < count; i += 1) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = speed * (.35 + Math.random() * .75);
            runtime.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 60,
                life: .45 + Math.random() * .5,
                maxLife: 1,
                size: 3 + Math.random() * 7,
                color,
                shape: Math.random() > .5 ? "circle" : "square"
            });
        }
        if (runtime.particles.length > 110) runtime.particles.splice(0, runtime.particles.length - 110);
    }

    function clearPathForUfo(projectile) {
        let abducted = 0;
        for (const obstacle of runtime.obstacles) {
            if (obstacle.destroyed || obstacle.x < projectile.x - 80 || obstacle.x > projectile.x + 980) continue;
            obstacle.destroyed = true;
            runtime.currentDestroyed += 1;
            runtime.currentScore += 70;
            abducted += 1;
            spawnParticles(obstacle.x, obstacle.y, obstacle.color, 8, 260);
            if (abducted >= 6) break;
        }
        return abducted;
    }

    function demolishPianoArea(projectile, reach = 390, limit = 2, centerX = projectile.x) {
        if (runtime.instrument.id !== "piano") return 0;
        let demolished = 0;
        for (const obstacle of runtime.obstacles) {
            if (obstacle.destroyed || Math.abs(obstacle.x - centerX) > reach || Math.abs(obstacle.y - projectile.y) > 250) continue;
            obstacle.destroyed = true;
            runtime.currentDestroyed += 1;
            runtime.currentScore += 165;
            demolished += 1;
            spawnParticles(obstacle.x, obstacle.y, obstacle.color, 12, 300);
            if (demolished >= limit) break;
        }
        if (demolished > 0) {
            runtime.aftershockCharges = Math.min(3, runtime.aftershockCharges + 1);
            showImpact(`치다! 연쇄 ×${demolished}`, 59, 43);
            updateActionButton();
        }
        return demolished;
    }

    function raiseGuitarCombo(projectile) {
        if (runtime.instrument.id !== "guitar") return 0;
        projectile.guitarCombo = Math.min(6, (projectile.guitarCombo || 0) + 1);
        projectile.vx += 75 + projectile.guitarCombo * 28;
        projectile.vy = Math.min(projectile.vy - 38, -105);
        runtime.currentScore += 55 + projectile.guitarCombo * 42;
        updateStrengthRibbon();
        return projectile.guitarCombo;
    }

    function applyInstrumentHelperSynergy(projectile) {
        if (runtime.instrument.id === "piano") {
            projectile.pianoSmashTimer = Math.max(projectile.pianoSmashTimer, 1.8);
            projectile.actionPulse = Math.max(projectile.actionPulse, .7);
        } else if (runtime.instrument.id === "trumpet") {
            projectile.vx *= 1.12;
            projectile.rocketTimer = Math.max(projectile.rocketTimer, .45);
            projectile.actionPulse = Math.max(projectile.actionPulse, .45);
        } else if (runtime.instrument.id === "guitar") {
            projectile.guitarTimer = Math.max(projectile.guitarTimer, .65);
            projectile.actionPulse = Math.max(projectile.actionPulse, .65);
            raiseGuitarCombo(projectile);
        } else if (runtime.instrument.id === "drum") {
            projectile.vx += 140;
            projectile.drumTimer = Math.max(projectile.drumTimer, 1.7);
            projectile.actionPulse = Math.max(projectile.actionPulse, .7);
        } else if (runtime.instrument.id === "violin") {
            projectile.vy = Math.min(projectile.vy - 90, -210);
            projectile.specialTimer = Math.max(projectile.specialTimer, 1.15);
            projectile.actionPulse = Math.max(projectile.actionPulse, 1.15);
        }
    }

    function applyHelperEffect(helper, projectile = runtime.projectile) {
        if (!helper || !projectile || !HELPER_TYPES[helper.type]) return false;
        const type = HELPER_TYPES[helper.type];
        runtime.helperHits[type.id] += 1;
        runtime.lastAccelerationAt = runtime.flightSeconds;
        runtime.stillSeconds = 0;
        let helperMessage = helper.message;

        if (type.id === "light") {
            projectile.vx = Math.max(520, projectile.vx + 260);
            projectile.vy = Math.min(projectile.vy - 105, -185);
            projectile.angularVelocity += 2.5;
            runtime.aftershockCharges = Math.min(3, runtime.aftershockCharges + 1);
            runtime.currentScore += 80;
        } else if (type.id === "strong") {
            projectile.vx = Math.max(1080, projectile.vx + 780);
            projectile.vy = Math.min(projectile.vy - 220, -340);
            projectile.angularVelocity += 7;
            projectile.rocketTimer = Math.max(projectile.rocketTimer, .9);
            runtime.aftershockCharges = Math.min(3, runtime.aftershockCharges + 2);
            runtime.currentScore += 280;
        } else {
            projectile.vx = Math.max(1850, projectile.vx + 1550);
            projectile.vy = Math.min(projectile.vy - 300, -520);
            projectile.angularVelocity = 18;
            projectile.rocketTimer = 0;
            projectile.absurdTimer = Math.max(projectile.absurdTimer, 2.9);
            runtime.aftershockCharges = 3;
            runtime.currentScore += 1200;
            const abducted = clearPathForUfo(projectile);
            if (abducted > 0) helperMessage = `${type.message} 앞의 장애물 ${abducted}개도 납치!`;
        }

        applyInstrumentHelperSynergy(projectile);
        const endlessCombo = helper.endless ? registerEndlessAcceleration(projectile, type.id === "absurd" ? 1.35 : (type.id === "strong" ? 1.1 : .85)) : 0;
        if (endlessCombo > 0) {
            runtime.endlessHelpers += 1;
            helperMessage = `무한 가속 연쇄 ×${endlessCombo}! ${helperMessage}`;
        }
        projectile.specialFlash = Math.max(projectile.specialFlash, type.id === "absurd" ? 1.15 : .7);
        spawnParticles(projectile.x, projectile.y, type.color, type.id === "absurd" ? 30 : (type.id === "strong" ? 20 : 13), type.id === "absurd" ? 430 : 270);
        showImpact(endlessCombo > 0 ? `가속 폭발 ×${endlessCombo}!!` : type.impact, (helper.x - runtime.cameraX) / runtime.width * 100, helper.y / runtime.height * 100);
        showSpeech(helperMessage, endlessCombo > 0 ? 2100 : (type.id === "absurd" ? 2500 : 1800));
        playSound(type.id === "light" ? "button" : "special");
        updateActionButton();
        announce(`${type.tier}, ${type.name} 발동! ${helperMessage}`);
        return true;
    }

    function handleHelperCollisions(projectile) {
        for (const helper of runtime.helpers) {
            if (helper.used) continue;
            const dx = projectile.x - helper.x;
            const dy = projectile.y - helper.y;
            const pickupAura = helper.type === "absurd" ? 30 : (helper.type === "strong" ? 26 : 30);
            const minimum = projectile.radius * .72 + helper.radius + pickupAura;
            if (dx * dx + dy * dy > minimum * minimum) continue;
            helper.used = true;
            applyHelperEffect(helper, projectile);
        }
    }

    function triggerHelper(typeId) {
        if (runtime.state !== "flying" || !runtime.projectile || !HELPER_TYPES[typeId]) return false;
        const helper = runtime.helpers.find((item) => item.type === typeId && !item.used && (!runtime.goalReached || item.endless))
            || runtime.helpers.find((item) => item.type === typeId && !item.used);
        if (!helper) return false;
        helper.used = true;
        return applyHelperEffect(helper, runtime.projectile);
    }

    function triggerObstacle(clusterSize = 1) {
        if (runtime.state !== "flying" || !runtime.projectile) return false;
        const obstacle = runtime.obstacles.find((item) => !item.destroyed);
        if (!obstacle) return false;
        const extraCount = Math.max(0, Math.min(4, Math.round(Number(clusterSize) || 1) - 1));
        for (let index = 1; index <= extraCount; index += 1) {
            runtime.obstacles.push({
                ...obstacle,
                id: `strength-test-${index}-${Math.round(obstacle.x)}`,
                x: obstacle.x + index * 105,
                y: obstacle.y + (index % 2 ? 12 : -12),
                destroyed: false
            });
        }
        runtime.projectile.x = obstacle.x;
        runtime.projectile.y = obstacle.y;
        runtime.projectile.maxX = Math.max(runtime.projectile.maxX, obstacle.x);
        handleObstacleCollisions(runtime.projectile);
        return obstacle.destroyed;
    }

    function advanceFlight(seconds = 1) {
        if (runtime.state !== "flying" || !runtime.projectile) return false;
        const step = 1 / 60;
        const steps = Math.min(1800, Math.max(1, Math.round((Number(seconds) || 1) / step)));
        for (let index = 0; index < steps && runtime.state === "flying"; index += 1) {
            updateFlight(step);
            updateParticles(step);
        }
        return true;
    }

    function handleObstacleCollisions(projectile) {
        for (const obstacle of runtime.obstacles) {
            if (obstacle.destroyed) continue;
            const dx = projectile.x - obstacle.x;
            const dy = projectile.y - obstacle.y;
            const minimum = projectile.radius * .72 + obstacle.radius;
            if (dx * dx + dy * dy > minimum * minimum) continue;
            const distance = Math.max(1, Math.hypot(dx, dy));
            const nx = dx / distance;
            const ny = dy / distance;
            const dot = projectile.vx * nx + projectile.vy * ny;
            const speed = Math.hypot(projectile.vx, projectile.vy);
            const incomingVx = projectile.vx;
            const incomingVy = projectile.vy;
            obstacle.destroyed = true;
            runtime.currentDestroyed += 1;
            const scoreMultiplier = runtime.instrument.id === "piano"
                ? 1.55
                : (runtime.instrument.id === "drum" ? 1.28 : (runtime.instrument.id === "trumpet" ? 1.18 : 1));
            runtime.currentScore += Math.round((90 + speed / 22) * scoreMultiplier);
            if (!runtime.specialAvailable && runtime.aftershockCharges < 3) {
                runtime.aftershockCharges += 1;
                updateActionButton();
            }
            projectile.x = obstacle.x + nx * minimum;
            projectile.y = obstacle.y + ny * minimum;
            if (dot < 0) {
                projectile.vx -= 1.38 * dot * nx;
                projectile.vy -= 1.38 * dot * ny;
            }
            projectile.vx *= .83;
            projectile.vy *= .83;
            let strengthWord = "";
            if (runtime.instrument.id === "piano") {
                projectile.vx = Math.max(projectile.vx, incomingVx * .96);
                projectile.vy = Math.min(projectile.vy, incomingVy * .7);
                const chain = demolishPianoArea(
                    projectile,
                    projectile.pianoSmashTimer > 0 ? 560 : 390,
                    projectile.pianoSmashTimer > 0 ? 4 : 2,
                    obstacle.x
                );
                projectile.actionPulse = Math.max(projectile.actionPulse, .5);
                strengthWord = `치다! 연쇄 ×${chain + 1}`;
            } else if (runtime.instrument.id === "trumpet") {
                projectile.vx = Math.max(projectile.vx, incomingVx * .9);
                strengthWord = "불어서 관통!";
            } else if (runtime.instrument.id === "guitar") {
                const combo = raiseGuitarCombo(projectile);
                const elasticBoost = projectile.guitarTimer > 0 ? 1.08 : .9;
                projectile.vx = Math.max(projectile.vx, incomingVx * elasticBoost + (projectile.guitarTimer > 0 ? 120 : 0));
                projectile.vy = Math.min(projectile.vy, projectile.guitarTimer > 0 ? -240 : -125);
                projectile.actionPulse = Math.max(projectile.actionPulse, .62);
                strengthWord = `튕기다! ×${combo}`;
            } else if (runtime.instrument.id === "drum") {
                projectile.vx = Math.max(projectile.vx, incomingVx * .95);
                projectile.vy = Math.min(projectile.vy, -85);
                strengthWord = projectile.drumTimer > 0 ? "차서 관통!" : "데굴데굴 관통!";
            } else if (runtime.instrument.id === "violin") {
                projectile.vx = Math.max(projectile.vx, incomingVx * .87);
                projectile.vy = Math.min(projectile.vy, -125);
                strengthWord = projectile.specialTimer > 0 ? "켜면서 활강!" : "긴 음표 활강!";
            }
            if (obstacle.endless) {
                const endlessCombo = registerEndlessAcceleration(projectile, .5);
                runtime.endlessCrashes += 1;
                strengthWord = `폭발 가속 ×${endlessCombo}!`;
                if (endlessCombo > 0 && endlessCombo % 5 === 0) {
                    showSpeech(`연속 폭발 ${endlessCombo}번! 악기 보험사가 전화를 끊었습니다!`, 1900);
                }
            }
            projectile.angularVelocity += (Math.random() - .5) * 8;
            spawnParticles(obstacle.x, obstacle.y, obstacle.color, 13, 230);
            const word = strengthWord || (obstacle.shape === "triangle" ? "뾰족!" : IMPACT_WORDS[Math.floor(Math.random() * IMPACT_WORDS.length)]);
            showImpact(word, (obstacle.x - runtime.cameraX) / runtime.width * 100, obstacle.y / runtime.height * 100);
            playSound("impact");
            if (runtime.currentDestroyed === 2 || runtime.currentDestroyed === 5) {
                showSpeech(COMEDY_LINES[runtime.currentDestroyed % COMEDY_LINES.length], 1700);
            }
        }
    }

    function handleGroundCollision(projectile) {
        const ground = groundAt(projectile.x);
        const bottom = projectile.y + projectile.radius;
        if (bottom < ground) return false;
        const surface = surfaceAt(projectile.x);
        const impactSpeed = projectile.vy;
        projectile.y = ground - projectile.radius;
        if (projectile.vy > 0) {
            let restitution = .39;
            let friction = .92;
            if (surface.id === "smooth") {
                restitution = .25;
                friction = .992;
            } else if (surface.id === "soft") {
                restitution = .78;
                friction = .965;
            } else if (surface.id === "bumpy") {
                restitution = .55 + Math.random() * .26;
                friction = .91;
                projectile.vx += (Math.random() - .42) * 150;
            } else if (surface.id === "rough") {
                restitution = .13;
                friction = .69;
            }
            if (projectile.drumTimer > 0) {
                restitution = Math.max(restitution, .35);
                friction = .997;
            }
            if (runtime.instrument.id === "piano" && projectile.pianoSmashTimer > 0) {
                restitution = Math.max(restitution, .72);
                friction = Math.max(friction, .97);
                demolishPianoArea(projectile, 430, 3, projectile.x);
            } else if (runtime.instrument.id === "drum") {
                restitution = Math.max(restitution, projectile.drumTimer > 0 ? .72 : .5);
                friction = Math.max(friction, .9985);
            } else if (runtime.instrument.id === "violin") {
                restitution = Math.max(restitution, .58);
            }
            restitution = Math.min(.92, restitution * runtime.stageInfo.bounce);
            projectile.vy = -Math.abs(projectile.vy) * restitution;
            projectile.vx *= friction;
            projectile.angularVelocity *= surface.id === "smooth" ? .98 : .88;
            if (runtime.instrument.id === "drum" && projectile.drumTimer > 0
                && performance.now() - projectile.lastGroundKickAt > 230) {
                projectile.lastGroundKickAt = performance.now();
                projectile.actionCount += 1;
                projectile.actionPulse = .85;
                projectile.vx += 210;
                projectile.vy = -Math.max(245, Math.min(390, Math.abs(impactSpeed) * .72 + 145));
                showImpact("차다! 뻥!", 47, 67, true);
                playInstrumentActionSound("drum", true);
            }
            if (impactSpeed > 250 && performance.now() - runtime.lastImpactAt > 280) {
                runtime.lastImpactAt = performance.now();
                const impactMultiplier = runtime.instrument.id === "piano" ? 1.8 : (runtime.instrument.id === "drum" ? 1.45 : 1);
                const bonus = Math.min(220, Math.round(impactSpeed / 7 * impactMultiplier));
                runtime.currentScore += bonus;
                spawnParticles(projectile.x, ground - 5, surface.color, 8, 150);
                const groundWord = runtime.instrument.id === "piano"
                    ? "건반을 치다!"
                    : (runtime.instrument.id === "drum" ? "큰북을 차다!" : IMPACT_WORDS[Math.floor(Math.random() * IMPACT_WORDS.length)]);
                showImpact(groundWord, 50, 68);
                playSound("impact");
            }
            if (Math.abs(projectile.vy) < 36) projectile.vy = 0;
        }
        return true;
    }

    function updateParticles(dt) {
        for (const particle of runtime.particles) {
            particle.vy += 520 * dt;
            particle.x += particle.vx * dt;
            particle.y += particle.vy * dt;
            particle.life -= dt;
        }
        runtime.particles = runtime.particles.filter((particle) => particle.life > 0);
    }

    function updateStageCheckpoints(projectile) {
        const worldEnd = getStageWorldEnd();
        const progress = Math.max(0, Math.min(1, (projectile.maxX - LAUNCH_X) / (worldEnd - LAUNCH_X)));
        let latestCheckpoint = -1;
        while (runtime.checkpointIndex < CHECKPOINTS.length
            && progress >= CHECKPOINTS[runtime.checkpointIndex]) {
            latestCheckpoint = runtime.checkpointIndex;
            runtime.currentScore += 180 * (runtime.checkpointIndex + 1);
            runtime.checkpointIndex += 1;
        }
        if (latestCheckpoint < 0) return;

        const percent = Math.round(CHECKPOINTS[latestCheckpoint] * 100);
        const line = runtime.stageInfo.checkpointLines?.[latestCheckpoint] || `${percent}% 지점 통과!`;
        if (latestCheckpoint === CHECKPOINTS.length - 1 && !runtime.goalBoostUsed) {
            runtime.goalBoostUsed = true;
            projectile.vx += runtime.stageInfo.finishBoost || 240;
            projectile.vy = Math.max(-230, Math.min(projectile.vy - 80, -120));
            runtime.aftershockCharges = Math.min(3, runtime.aftershockCharges + 1);
            updateActionButton();
        }
        showImpact(`${percent}%!`, 82, 25);
        showSpeech(line, 1900);
        announce(`${runtime.stageInfo.name} ${percent}% 지점. ${line}`);
    }

    function updateFlight(dt) {
        const projectile = runtime.projectile;
        if (!projectile) return;
        runtime.flightSeconds += dt;
        if (projectile.specialTimer > 0) projectile.specialTimer = Math.max(0, projectile.specialTimer - dt);
        if (projectile.drumTimer > 0) projectile.drumTimer = Math.max(0, projectile.drumTimer - dt);
        if (projectile.pianoSmashTimer > 0) projectile.pianoSmashTimer = Math.max(0, projectile.pianoSmashTimer - dt);
        if (projectile.guitarTimer > 0) projectile.guitarTimer = Math.max(0, projectile.guitarTimer - dt);
        if (projectile.rocketTimer > 0) projectile.rocketTimer = Math.max(0, projectile.rocketTimer - dt);
        if (projectile.absurdTimer > 0) projectile.absurdTimer = Math.max(0, projectile.absurdTimer - dt);
        projectile.trailTimer = Math.max(0, projectile.trailTimer - dt);
        projectile.passiveTrailTimer = Math.max(0, projectile.passiveTrailTimer - dt);
        if (projectile.actionPulse > 0) projectile.actionPulse = Math.max(0, projectile.actionPulse - dt);
        if (projectile.specialFlash > 0) projectile.specialFlash = Math.max(0, projectile.specialFlash - dt);
        if (runtime.breakthroughFlash > 0) runtime.breakthroughFlash = Math.max(0, runtime.breakthroughFlash - dt);
        const gravityWave = 1 + Math.sin(runtime.flightSeconds * (runtime.stageInfo.gravityCycle || 1))
            * (runtime.stageInfo.gravityPulse || 0);
        const stageGravity = runtime.stageInfo.gravity * gravityWave;
        const gravity = projectile.absurdTimer > 0
            ? 45
            : (projectile.rocketTimer > 0
                ? stageGravity * .28
                : (projectile.specialTimer > 0 ? 45 : stageGravity * runtime.instrument.gravityMultiplier));
        const stageWind = runtime.stageInfo.wind
            + Math.sin(runtime.flightSeconds * (runtime.stageInfo.windCycle || 1)) * (runtime.stageInfo.windGust || 0);
        projectile.vy += gravity * dt;
        projectile.vx += stageWind * dt;
        if (projectile.specialTimer > 0) projectile.vx += 35 * dt;
        if (projectile.rocketTimer > 0) projectile.vx += 85 * dt;
        if (projectile.absurdTimer > 0) projectile.vx += 145 * dt;
        if (runtime.instrument.id === "trumpet") projectile.vx += 78 * dt;
        else if (runtime.instrument.id === "violin") projectile.vx += 30 * dt;
        else if (runtime.instrument.id === "guitar" && projectile.guitarCombo > 0) projectile.vx += projectile.guitarCombo * 12 * dt;
        const cruiseSpeed = runtime.stageInfo.cruiseSpeed || 2500;
        if (projectile.vx > cruiseSpeed) {
            const speedSettling = projectile.absurdTimer > 0 ? .8 : (projectile.rocketTimer > 0 ? 1.2 : 2.1);
            projectile.vx -= (projectile.vx - cruiseSpeed) * Math.min(.18, dt * speedSettling);
        }
        projectile.x += projectile.vx * dt;
        projectile.y += projectile.vy * dt;
        const topBoundary = projectile.radius + 16;
        if (projectile.y < topBoundary) {
            projectile.y = topBoundary;
            if (projectile.vy < 0) projectile.vy = Math.min(125, Math.abs(projectile.vy) * .22);
            projectile.actionPulse = Math.max(projectile.actionPulse, .28);
        }
        projectile.rotation += projectile.angularVelocity * dt;
        if (runtime.instrument.id === "trumpet" && projectile.rocketTimer > 0) {
            projectile.angularVelocity *= Math.pow(.08, dt);
            projectile.rotation += (0 - projectile.rotation) * Math.min(1, dt * 6.5);
        } else if (runtime.instrument.id === "violin" && projectile.specialTimer > 0) {
            projectile.angularVelocity *= Math.pow(.35, dt);
            projectile.rotation += (-.08 - projectile.rotation) * Math.min(1, dt * 5.2);
            projectile.vy += Math.sin(runtime.flightSeconds * 7) * 10 * dt;
        }
        projectile.maxX = Math.max(projectile.maxX, projectile.x);
        updateStageCheckpoints(projectile);
        if (!runtime.goalReached && projectile.maxX >= getStageWorldEnd()) enterEndlessMode(projectile);
        if (runtime.goalReached) ensureEndlessCourse(projectile.x);
        if ((projectile.rocketTimer > 0 || projectile.absurdTimer > 0) && projectile.trailTimer <= 0) {
            const trailColor = projectile.absurdTimer > 0
                ? ["#ff8fb3", "#ffd846", "#67d9b2", "#9ee8ff"][Math.floor(Math.random() * 4)]
                : "#ff9e43";
            spawnParticles(projectile.x - projectile.radius, projectile.y, trailColor, projectile.absurdTimer > 0 ? 5 : 3, 120);
            projectile.trailTimer = record.settings.reducedEffects ? .18 : .075;
        }
        const passiveTrail = runtime.instrument.id === "trumpet"
            || runtime.instrument.id === "violin"
            || projectile.drumTimer > 0
            || projectile.guitarCombo > 0
            || projectile.pianoSmashTimer > 0;
        if (passiveTrail && projectile.passiveTrailTimer <= 0) {
            spawnParticles(projectile.x - projectile.radius * .7, projectile.y, runtime.instrument.accent, 2, 85);
            projectile.passiveTrailTimer = record.settings.reducedEffects ? .28 : .14;
        }
        handleHelperCollisions(projectile);
        handleObstacleCollisions(projectile);
        const grounded = handleGroundCollision(projectile);

        if (grounded && Math.abs(projectile.vy) < 28) {
            let drag = projectile.drumTimer > 0 ? .9997 : (surfaceAt(projectile.x).id === "smooth" ? .996 : .973);
            if (runtime.instrument.id === "drum" && (!runtime.goalReached || projectile.drumTimer > 0)) {
                drag = projectile.drumTimer > 0 ? .99985 : .9988;
                projectile.vx = Math.max(projectile.vx + (projectile.drumTimer > 0 ? 260 : 58) * dt, projectile.drumTimer > 0 ? 760 : 210);
            }
            projectile.vx *= Math.pow(drag, dt * 60);
        }

        if (projectile.y > runtime.height + 250) {
            projectile.y = runtime.groundY - projectile.radius;
            projectile.vy = -180;
            projectile.vx *= .7;
        }

        runtime.currentDistance = Math.max(0, Math.round((projectile.maxX - LAUNCH_X) / DISTANCE_SCALE));
        const targetCamera = Math.max(0, projectile.x - runtime.width * .34);
        const actionInProgress = projectile.actionPulse > 0
            || projectile.pianoSmashTimer > 0
            || projectile.rocketTimer > 0
            || projectile.guitarTimer > 0
            || projectile.drumTimer > 0
            || projectile.specialTimer > 0
            || projectile.absurdTimer > 0;
        runtime.cameraX += (targetCamera - runtime.cameraX) * Math.min(1, dt * (actionInProgress ? 14 : 4.8));
        updateHud();

        const speed = Math.hypot(projectile.vx, projectile.vy);
        if (grounded && speed < 38) runtime.stillSeconds += dt;
        else runtime.stillSeconds = 0;

        const specialWindowOpen = runtime.specialAvailable && runtime.flightSeconds < 3.2;
        const specialRecovery = runtime.specialUsedAt >= 0 && runtime.flightSeconds - runtime.specialUsedAt < .9;
        const preGoalTimeout = !runtime.goalReached && runtime.flightSeconds >= runtime.stageInfo.timeLimit;
        const endlessChainExpired = runtime.goalReached
            && runtime.flightSeconds - runtime.lastAccelerationAt >= ENDLESS_GRACE_SECONDS;
        const flightFinished = preGoalTimeout
            || endlessChainExpired
            || runtime.stillSeconds >= 1.05
            || projectile.x < -150;
        if (!specialWindowOpen && !specialRecovery && flightFinished) {
            finishFlight();
        }
    }

    function titleForDistance(distance) {
        if (distance < 400) return "주차장 안에서만 유명한 밴드";
        if (distance < 800) return "동네 장거리 악기 택배";
        if (distance < 1500) return "고속도로가 긴장한 밴드";
        if (distance < 2500) return "기상청이 추적하는 악기";
        if (distance < 4000) return "은하계 악기 투척 국가대표";
        return "다음 은하까지 당일 배송한 밴드";
    }

    function finishFlight(forcedDistance) {
        if (runtime.state !== "flying" || !runtime.session) return false;
        if (Number.isFinite(forcedDistance) && runtime.projectile) {
            runtime.projectile.maxX = LAUNCH_X + Math.max(0, forcedDistance) * DISTANCE_SCALE;
            runtime.currentDistance = Math.max(0, Math.round(forcedDistance));
        }
        const goalDistance = runtime.stageInfo.goalDistance || 800;
        const reachedGoal = runtime.goalReached || Boolean(runtime.projectile?.maxX >= getStageWorldEnd() - 1);
        const endlessDistance = reachedGoal ? Math.max(0, runtime.currentDistance - goalDistance) : 0;
        const airtimeMultiplier = runtime.instrument.id === "violin" ? 2.5 : (runtime.instrument.id === "guitar" ? 1.25 : 1);
        const distanceMultiplier = runtime.instrument.id === "trumpet" ? 12 : (runtime.instrument.id === "drum" ? 11 : 10);
        const airtimeBonus = Math.round(runtime.flightSeconds * 24 * airtimeMultiplier);
        const goalBonus = reachedGoal ? 1400 + runtime.session.roundIndex * 350 : 0;
        const roundScore = Math.max(0, Math.round(runtime.currentScore + runtime.currentDistance * distanceMultiplier + airtimeBonus + goalBonus));
        const helperCount = Object.values(runtime.helperHits).reduce((sum, count) => sum + count, 0);
        const result = {
            instrumentId: runtime.instrument.id,
            distance: runtime.currentDistance,
            score: roundScore,
            destroyed: runtime.currentDestroyed,
            helpers: helperCount,
            goalDistance,
            reachedGoal,
            endlessDistance,
            endlessCombo: runtime.endlessCombo,
            endlessHelpers: runtime.endlessHelpers,
            endlessCrashes: runtime.endlessCrashes
        };
        const index = runtime.session.roundIndex;
        runtime.session.results[index] = result;
        runtime.session.totalScore = runtime.session.results.reduce((sum, item) => sum + item.score, 0);
        runtime.session.totalDestroyed = runtime.session.results.reduce((sum, item) => sum + item.destroyed, 0);
        runtime.session.maxDistance = runtime.session.results.reduce((max, item) => Math.max(max, item.distance), 0);
        record.activeRun = cloneSession(runtime.session);
        saveRecord("이번 배달 저장됨");

        const isLast = index >= ROUND_COUNT - 1;
        const nextInstrument = INSTRUMENT_MAP.get(runtime.session.order[index + 1]);
        const nextStage = STAGES[index + 1];
        const remaining = Math.max(0, goalDistance - result.distance);
        elements.relayKicker.textContent = reachedGoal
            ? `스테이지 ${index + 1} 목표 박살 · 무한 +${endlessDistance}m!`
            : `스테이지 ${index + 1} · ${remaining}m 앞에서 털썩!`;
        elements.relayTitle.textContent = `${runtime.instrument.name} ${result.distance}m · 목표 ${goalDistance}m ${reachedGoal ? "돌파" : "도전"}`;
        elements.relayDetail.textContent = `${reachedGoal ? `무한 연쇄 ×${result.endlessCombo}` : "다음엔 돌파 가능!"} · 도움 ${result.helpers}회 · ${result.destroyed}개 파괴 · +${result.score}점`;
        elements.relayNext.textContent = isLast
            ? "5스테이지 사고 보고서 정리 중…"
            : `다음: ${nextStage?.name || "새 스테이지"} · ${nextInstrument?.name || "새 악기"}`;
        updateRelayStrip();
        setState("transition");
        playSound("result");
        announce(`스테이지 ${index + 1}, ${runtime.instrument.name} ${result.distance}미터. ${reachedGoal ? `${runtime.stageInfo.goalLabel} 목표를 돌파하고 무한 구간에서 ${endlessDistance}미터 더 비행했습니다.` : `목표까지 ${remaining}미터 남았습니다.`} ${isLast ? "5스테이지 사고 보고서로 이어집니다." : `${withDirectionParticle(nextStage?.name)} 바로 이어집니다.`}`);
        window.clearTimeout(runtime.transitionTimer);
        runtime.transitionTimer = window.setTimeout(nextRound, isLast ? FINAL_RELAY_DELAY : RELAY_DELAY);
        window.setTimeout(() => elements.actionButton.focus({ preventScroll: true }), 30);
        return true;
    }

    function nextRound() {
        if (!runtime.session) return;
        if (runtime.state !== "transition") return;
        window.clearTimeout(runtime.transitionTimer);
        runtime.transitionTimer = 0;
        playSound("button");
        if (runtime.session.roundIndex >= ROUND_COUNT - 1) {
            finishSession();
            return;
        }
        runtime.session.roundIndex += 1;
        saveActiveSession("다음 배달 저장됨");
        startRound();
    }

    function finishSession() {
        if (!runtime.session) return;
        const session = runtime.session;
        const previousBest = record.bestScore;
        const previousDistance = record.bestDistance;
        const isNewRecord = session.totalScore > previousBest || session.maxDistance > previousDistance;
        record.bestScore = Math.max(previousBest, session.totalScore);
        record.bestDistance = Math.max(previousDistance, session.maxDistance);
        record.plays += 1;
        record.lastRun = {
            score: session.totalScore,
            maxDistance: session.maxDistance,
            destroyed: session.totalDestroyed,
            finishedAt: new Date().toISOString()
        };
        record.activeRun = null;
        saveRecord("오늘의 사고 기록 저장됨");
        elements.finalScore.textContent = String(session.totalScore);
        elements.finalGoals.textContent = String(session.results.filter((result) => result?.reachedGoal).length);
        elements.finalDistance.textContent = String(session.maxDistance);
        elements.finalDestroyed.textContent = String(session.totalDestroyed);
        elements.finalTitle.textContent = titleForDistance(session.maxDistance);
        elements.newRecord.hidden = !isNewRecord;
        updateRecordDisplay();
        updateHud();
        updateRelayStrip();
        setState("final");
        playSound("result");
        announce(`다섯 악기와 다섯 스테이지 배달 완료. 총 ${session.totalScore}점입니다.`);
        window.setTimeout(() => elements.playAgain.focus({ preventScroll: true }), 30);
    }

    function pauseGame() {
        if (!["aiming", "charging", "flying"].includes(runtime.state)) return;
        runtime.previousState = runtime.state === "charging" ? "aiming" : runtime.state;
        setState("paused");
        announce("배송을 잠시 멈췄습니다.");
        window.setTimeout(() => elements.resumeGame.focus({ preventScroll: true }), 30);
    }

    function resumeGame() {
        if (runtime.state !== "paused") return;
        setState(runtime.previousState || "aiming");
        runtime.lastFrame = performance.now();
        announce("배송을 다시 시작합니다.");
        window.setTimeout(() => elements.actionButton.focus({ preventScroll: true }), 30);
    }

    function quitGame() {
        window.clearTimeout(runtime.transitionTimer);
        runtime.transitionTimer = 0;
        record.activeRun = null;
        saveRecord("진행 중인 배달을 정리함");
        runtime.session = null;
        runtime.projectile = null;
        runtime.currentDistance = 0;
        runtime.currentScore = 0;
        updateRecordDisplay();
        setState("menu");
        announce("배송을 마치고 시작 화면으로 돌아왔습니다.");
        window.setTimeout(() => elements.startGame.focus({ preventScroll: true }), 30);
    }

    function resetOnlyThisGame() {
        window.clearTimeout(runtime.transitionTimer);
        runtime.transitionTimer = 0;
        try {
            localStorage.removeItem(STORAGE_KEY);
            protectedStorage = false;
            storageAvailable = true;
        } catch (_error) {
            storageAvailable = false;
        }
        record = createDefaultRecord();
        runtime.session = null;
        runtime.projectile = null;
        applySettings();
        updateRecordDisplay();
        updateHud();
        if (storageAvailable) saveRecord("이 게임 기록만 초기화됨");
        else setSaveStatus("초기화했지만 저장 불가", "error");
        setState("menu");
        announce("생각도 못 한 악기 배달의 기록만 초기화했습니다.");
    }

    function resizeCanvas() {
        const rect = elements.stage.getBoundingClientRect();
        const width = Math.max(1, rect.width);
        const height = Math.max(1, rect.height);
        const dpr = Math.min(2, window.devicePixelRatio || 1);
        if (elements.canvas.width !== Math.round(width * dpr) || elements.canvas.height !== Math.round(height * dpr)) {
            elements.canvas.width = Math.round(width * dpr);
            elements.canvas.height = Math.round(height * dpr);
        }
        runtime.width = width;
        runtime.height = height;
        runtime.groundY = Math.max(170, height * .76);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (const helper of runtime.helpers) {
            helper.y = groundAt(helper.x) - helper.height + helper.yJitter;
        }
        if (runtime.projectile && runtime.state !== "flying") {
            runtime.projectile.y = groundAt(runtime.projectile.x) - runtime.projectile.radius;
        }
    }

    function roundedRect(context, x, y, width, height, radius) {
        const r = Math.min(radius, Math.abs(width) / 2, Math.abs(height) / 2);
        context.beginPath();
        context.roundRect(x, y, width, height, r);
    }

    function drawCloud(x, y, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = "rgba(255,255,255,.82)";
        ctx.strokeStyle = "rgba(23,33,59,.2)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 10, 22, Math.PI, Math.PI * 2);
        ctx.arc(22, 1, 28, Math.PI, Math.PI * 2);
        ctx.arc(51, 12, 19, Math.PI, Math.PI * 2);
        ctx.lineTo(51, 24);
        ctx.lineTo(0, 24);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    function drawBackground(time) {
        const width = runtime.width;
        const height = runtime.height;
        const stageInfo = runtime.stageInfo || STAGES[0];
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, stageInfo.skyTop);
        gradient.addColorStop(.68, stageInfo.skyBottom);
        gradient.addColorStop(.69, stageInfo.id === "alien-venue" ? "#594c83" : "#ffe7a0");
        gradient.addColorStop(1, "#f1bf61");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        if (stageInfo.id !== "alien-venue") {
            const cloudShift = (runtime.cameraX * .09) % (width + 280);
            drawCloud(100 - cloudShift, 64, .8);
            drawCloud(410 - cloudShift, 102, 1.15);
            drawCloud(760 - cloudShift, 48, .7);
            drawCloud(1080 - cloudShift, 85, 1);
        }

        if (stageInfo.id === "bubble-road") {
            ctx.save();
            ctx.strokeStyle = "rgba(255,255,255,.65)";
            ctx.lineWidth = 3;
            for (let i = 0; i < 10; i += 1) {
                const bx = (i * 137 - runtime.cameraX * .05 + time * .018) % (width + 90) - 45;
                const by = 35 + (i * 61) % Math.max(90, runtime.groundY - 90);
                ctx.beginPath();
                ctx.arc(bx, by, 10 + i % 4 * 5, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.restore();
        } else if (stageInfo.id === "rocket-yard") {
            ctx.save();
            ctx.fillStyle = "rgba(23,33,59,.18)";
            for (let x = -40 - (runtime.cameraX * .08 % 90); x < width + 80; x += 90) {
                ctx.save();
                ctx.translate(x, 46);
                ctx.rotate(-.45);
                ctx.fillRect(-4, -30, 8, 60);
                ctx.restore();
            }
            ctx.restore();
        } else if (stageInfo.id === "upside-carnival") {
            ctx.save();
            ctx.strokeStyle = "rgba(23,33,59,.55)";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 38);
            ctx.quadraticCurveTo(width / 2, 94, width, 38);
            ctx.stroke();
            const pennants = ["#ff8fb3", "#ffd846", "#67d9b2", "#ff7043"];
            for (let i = 0; i < 12; i += 1) {
                const px = i * width / 11;
                const py = 38 + Math.sin(i / 11 * Math.PI) * 42;
                ctx.fillStyle = pennants[i % pennants.length];
                ctx.beginPath();
                ctx.moveTo(px - 9, py);
                ctx.lineTo(px + 9, py);
                ctx.lineTo(px, py + 22);
                ctx.closePath();
                ctx.fill();
            }
            ctx.restore();
        } else if (stageInfo.id === "alien-venue") {
            ctx.save();
            ctx.fillStyle = "rgba(255,255,255,.82)";
            for (let i = 0; i < 28; i += 1) {
                const sx = (i * 79 - runtime.cameraX * .035) % (width + 30);
                const sy = 18 + (i * 43) % Math.max(80, runtime.groundY - 85);
                ctx.beginPath();
                ctx.arc(sx, sy, 1 + i % 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = "rgba(255,216,70,.78)";
            ctx.beginPath();
            ctx.arc(width * .78, 70, 30, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "rgba(255,255,255,.5)";
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.ellipse(width * .78, 70, 48, 12, -.25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        const skylineShift = (runtime.cameraX * .22) % 620;
        for (let i = -1; i < Math.ceil(width / 110) + 2; i += 1) {
            const x = i * 110 - skylineShift;
            const buildingHeight = 55 + ((i + 14) % 4) * 19;
            ctx.fillStyle = stageInfo.skyline[Math.abs(i) % stageInfo.skyline.length];
            ctx.strokeStyle = "rgba(23,33,59,.32)";
            ctx.lineWidth = 2;
            ctx.fillRect(x, runtime.groundY - buildingHeight, 82, buildingHeight);
            ctx.strokeRect(x, runtime.groundY - buildingHeight, 82, buildingHeight);
            ctx.fillStyle = "rgba(255,245,173,.8)";
            for (let row = 0; row < 2; row += 1) {
                for (let col = 0; col < 3; col += 1) {
                    ctx.fillRect(x + 10 + col * 23, runtime.groundY - buildingHeight + 13 + row * 24, 10, 9);
                }
            }
        }

        ctx.globalAlpha = .16;
        ctx.fillStyle = "#fff";
        for (let i = 0; i < 18; i += 1) {
            const px = (i * 83 + time * .012) % (width + 20) - 10;
            const py = 22 + (i * 47) % Math.max(80, runtime.groundY - 60);
            ctx.beginPath();
            ctx.arc(px, py, 2 + i % 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }

    function drawGround() {
        const start = Math.max(0, runtime.cameraX - 40);
        const end = runtime.cameraX + runtime.width + 50;
        const step = 14;
        ctx.beginPath();
        ctx.moveTo(start - runtime.cameraX, runtime.height + 10);
        for (let x = start; x <= end; x += step) {
            ctx.lineTo(x - runtime.cameraX, groundAt(x));
        }
        ctx.lineTo(end - runtime.cameraX, runtime.height + 10);
        ctx.closePath();
        ctx.fillStyle = surfaceAt(start + runtime.width / 2).color;
        ctx.fill();

        for (const surface of runtime.surfaces) {
            if (surface.to < start || surface.from > end) continue;
            const from = Math.max(start, surface.from);
            const to = Math.min(end, surface.to);
            ctx.beginPath();
            ctx.moveTo(from - runtime.cameraX, runtime.height + 10);
            for (let x = from; x <= to + step; x += step) {
                ctx.lineTo(Math.min(x, to) - runtime.cameraX, groundAt(Math.min(x, to)));
            }
            ctx.lineTo(to - runtime.cameraX, runtime.height + 10);
            ctx.closePath();
            ctx.fillStyle = surface.color;
            ctx.fill();
            ctx.strokeStyle = surface.line;
            ctx.lineWidth = 4;
            ctx.beginPath();
            for (let x = from; x <= to; x += step) {
                const sx = x - runtime.cameraX;
                const gy = groundAt(x);
                if (x === from) ctx.moveTo(sx, gy);
                else ctx.lineTo(sx, gy);
            }
            ctx.stroke();

            if (surface.id === "smooth") {
                ctx.strokeStyle = "rgba(255,255,255,.72)";
                ctx.lineWidth = 3;
                for (let x = Math.ceil(from / 90) * 90; x < to; x += 90) {
                    ctx.beginPath();
                    ctx.moveTo(x - runtime.cameraX, groundAt(x) + 22);
                    ctx.lineTo(x + 48 - runtime.cameraX, groundAt(x) + 12);
                    ctx.stroke();
                }
            } else if (surface.id === "soft") {
                ctx.fillStyle = "rgba(255,255,255,.5)";
                for (let x = Math.ceil(from / 80) * 80; x < to; x += 80) {
                    ctx.beginPath();
                    ctx.arc(x - runtime.cameraX, groundAt(x) + 20, 9, 0, Math.PI * 2);
                    ctx.fill();
                }
            } else if (surface.id === "rough") {
                ctx.strokeStyle = "rgba(72,45,34,.35)";
                ctx.lineWidth = 2;
                for (let x = Math.ceil(from / 32) * 32; x < to; x += 32) {
                    ctx.beginPath();
                    ctx.moveTo(x - runtime.cameraX, groundAt(x) + 9);
                    ctx.lineTo(x + 12 - runtime.cameraX, groundAt(x) + 25);
                    ctx.stroke();
                }
            }
        }

        ctx.font = "900 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        for (const surface of runtime.surfaces) {
            const center = (surface.from + surface.to) / 2;
            const sx = center - runtime.cameraX;
            if (sx < -100 || sx > runtime.width + 100) continue;
            const textWidth = ctx.measureText(surface.name).width + 20;
            ctx.fillStyle = "rgba(255,250,240,.92)";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 2;
            roundedRect(ctx, sx - textWidth / 2, groundAt(center) + 16, textWidth, 28, 12);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#17213b";
            ctx.fillText(surface.name, sx, groundAt(center) + 30);
        }
    }

    function drawShape(obstacle) {
        const x = obstacle.x - runtime.cameraX;
        if (x < -obstacle.radius * 2 || x > runtime.width + obstacle.radius * 2) return;
        if (obstacle.destroyed) return;
        ctx.save();
        ctx.translate(x, obstacle.y);
        ctx.rotate(obstacle.rotation + Math.sin(performance.now() * .002 + obstacle.wobble) * .025);
        ctx.fillStyle = obstacle.color;
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (obstacle.shape === "triangle") {
            ctx.moveTo(0, -obstacle.radius);
            ctx.lineTo(obstacle.radius, obstacle.radius);
            ctx.lineTo(-obstacle.radius, obstacle.radius);
        } else if (obstacle.shape === "square") {
            ctx.rect(-obstacle.radius * .82, -obstacle.radius * .82, obstacle.radius * 1.64, obstacle.radius * 1.64);
        } else if (obstacle.shape === "circle") {
            ctx.arc(0, 0, obstacle.radius, 0, Math.PI * 2);
        } else {
            ctx.moveTo(0, -obstacle.radius);
            ctx.lineTo(obstacle.radius, 0);
            ctx.lineTo(0, obstacle.radius);
            ctx.lineTo(-obstacle.radius, 0);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.beginPath();
        ctx.arc(-obstacle.radius * .24, -obstacle.radius * .25, Math.max(3, obstacle.radius * .12), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (obstacle.shape === "triangle") {
            ctx.save();
            ctx.font = "900 11px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.fillStyle = "#17213b";
            ctx.fillText("뾰족!", x, obstacle.y + obstacle.radius + 16);
            ctx.restore();
        }
    }

    function drawHelper(helper, time) {
        if (helper.used) return;
        const x = helper.x - runtime.cameraX;
        if (x < -helper.radius * 2.4 || x > runtime.width + helper.radius * 2.4) return;
        const y = helper.y + (record.settings.reducedEffects ? 0 : Math.sin(time * .004 + helper.bob) * 6);
        const scale = helper.radius / HELPER_TYPES[helper.type].radius;
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;

        if (helper.type === "light") {
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(0, 25);
            ctx.quadraticCurveTo(-12, 49, 4, 67);
            ctx.stroke();
            ctx.lineWidth = 4;
            ctx.fillStyle = helper.color;
            ctx.beginPath();
            ctx.ellipse(0, -3, 25, 30, -.08, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "rgba(255,255,255,.72)";
            ctx.beginPath();
            ctx.ellipse(-8, -13, 6, 9, -.45, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = "#17213b";
            ctx.beginPath();
            ctx.arc(-7, 1, 2.4, 0, Math.PI * 2);
            ctx.arc(7, 1, 2.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 8, 7, .08, Math.PI - .08);
            ctx.stroke();
        } else if (helper.type === "strong") {
            ctx.fillStyle = "#ff7043";
            ctx.beginPath();
            ctx.moveTo(-29, 18);
            ctx.lineTo(-43, 34);
            ctx.lineTo(-18, 29);
            ctx.moveTo(29, 18);
            ctx.lineTo(43, 34);
            ctx.lineTo(18, 29);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = helper.color;
            roundedRect(ctx, -32, -28, 64, 56, 9);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = helper.accent;
            roundedRect(ctx, -28, -6, 56, 14, 4);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#fff";
            ctx.font = "1000 12px system-ui, sans-serif";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText("급행", 0, 1);
            ctx.fillStyle = "#ffd846";
            ctx.beginPath();
            ctx.moveTo(-18, 29);
            ctx.lineTo(-7, 51);
            ctx.lineTo(0, 31);
            ctx.lineTo(8, 54);
            ctx.lineTo(19, 29);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else {
            const beam = ctx.createLinearGradient(0, 15, 0, 86);
            beam.addColorStop(0, "rgba(86,224,208,.7)");
            beam.addColorStop(1, "rgba(255,216,70,0)");
            ctx.fillStyle = beam;
            ctx.beginPath();
            ctx.moveTo(-31, 9);
            ctx.lineTo(-55, 82);
            ctx.lineTo(55, 82);
            ctx.lineTo(31, 9);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = helper.accent;
            ctx.beginPath();
            ctx.ellipse(0, -8, 29, 24, 0, Math.PI, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = helper.color;
            ctx.beginPath();
            ctx.ellipse(0, 4, 55, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#ffd846";
            for (const lightX of [-31, -10, 12, 33]) {
                ctx.beginPath();
                ctx.arc(lightX, 7, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            ctx.fillStyle = "#17213b";
            ctx.beginPath();
            ctx.ellipse(-8, -10, 3, 6, 0, 0, Math.PI * 2);
            ctx.ellipse(8, -10, 3, 6, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.font = `1000 ${helper.type === "absurd" ? 12 : 11}px system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const labelWidth = ctx.measureText(helper.badge).width + 18;
        const labelY = -helper.radius - 24;
        ctx.fillStyle = "rgba(255,250,240,.95)";
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 2.5;
        roundedRect(ctx, -labelWidth / 2, labelY - 12, labelWidth, 24, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#17213b";
        ctx.fillText(helper.badge, 0, labelY);
        ctx.restore();
    }

    function drawLandmarks() {
        const worldEnd = getStageWorldEnd();
        const landmarks = runtime.stageInfo.landmarks || [];
        for (const [progress, label] of landmarks) {
            const worldX = LAUNCH_X + (worldEnd - LAUNCH_X) * progress;
            const x = worldX - runtime.cameraX;
            if (x < -170 || x > runtime.width + 170) continue;
            const ground = groundAt(worldX);
            const percent = Math.round(progress * 100);
            ctx.save();
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            ctx.fillStyle = "#fff6db";
            ctx.fillRect(x - 4, ground - 92, 8, 92);
            ctx.strokeRect(x - 4, ground - 92, 8, 92);
            ctx.fillStyle = runtime.stageInfo.goalColor;
            roundedRect(ctx, x - 92, ground - 137, 184, 55, 10);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#17213b";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "1000 12px system-ui, sans-serif";
            ctx.fillText(`${percent}% 구간`, x, ground - 121);
            ctx.font = "900 13px system-ui, sans-serif";
            ctx.fillText(label, x, ground - 101);
            ctx.restore();
        }
    }

    function drawEndlessMarkers() {
        const worldEnd = getStageWorldEnd();
        if (runtime.cameraX + runtime.width < worldEnd - 100) return;
        const firstIndex = Math.max(0, Math.floor((runtime.cameraX - worldEnd) / ENDLESS_CHUNK_LENGTH) - 1);
        const lastIndex = firstIndex + Math.ceil(runtime.width / ENDLESS_CHUNK_LENGTH) + 3;
        for (let index = firstIndex; index <= lastIndex; index += 1) {
            const worldX = worldEnd + 540 + index * ENDLESS_CHUNK_LENGTH;
            const x = worldX - runtime.cameraX;
            if (x < -150 || x > runtime.width + 150) continue;
            const ground = groundAt(worldX);
            const label = ENDLESS_SIGNS[(index + (runtime.session?.roundIndex || 0)) % ENDLESS_SIGNS.length];
            ctx.save();
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            ctx.fillStyle = index % 2 ? "#56e0d0" : "#ffd846";
            ctx.fillRect(x - 4, ground - 102, 8, 102);
            ctx.strokeRect(x - 4, ground - 102, 8, 102);
            roundedRect(ctx, x - 108, ground - 151, 216, 58, 12);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#17213b";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "1000 12px system-ui, sans-serif";
            ctx.fillText(`∞ 무한 가속 ${index + 1}구역`, x, ground - 134);
            ctx.font = "900 13px system-ui, sans-serif";
            ctx.fillText(label, x, ground - 112);
            ctx.restore();
        }
    }

    function drawBreakthroughOverlay() {
        if (runtime.breakthroughFlash <= 0) return;
        const progress = runtime.breakthroughFlash / 1.6;
        const burst = 1 - progress;
        ctx.save();
        ctx.globalAlpha = Math.min(.62, progress * .8);
        ctx.fillStyle = burst < .38 ? "#fff6a8" : "#ff8fb3";
        ctx.fillRect(0, 0, runtime.width, runtime.height);
        ctx.globalAlpha = Math.min(1, progress * 1.7);
        ctx.translate(runtime.width / 2, runtime.height * .34);
        ctx.scale(1 + burst * .28, 1 + burst * .28);
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 8;
        ctx.fillStyle = "#fff6db";
        ctx.font = `1000 ${Math.max(30, Math.min(62, runtime.width * .1))}px system-ui, sans-serif`;
        ctx.strokeText("목표 박살!!!", 0, -18);
        ctx.fillText("목표 박살!!!", 0, -18);
        ctx.fillStyle = "#ff7043";
        ctx.font = `1000 ${Math.max(22, Math.min(40, runtime.width * .068))}px system-ui, sans-serif`;
        ctx.strokeText("∞ 무한 가속 개방", 0, 39);
        ctx.fillText("∞ 무한 가속 개방", 0, 39);
        ctx.restore();
    }

    function drawStageGate() {
        if (!runtime.session) return;
        const worldX = 310;
        const x = worldX - runtime.cameraX;
        if (x < -180 || x > runtime.width + 180) return;
        const ground = groundAt(worldX);
        ctx.save();
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;
        ctx.fillStyle = "#fff4d8";
        ctx.fillRect(x - 102, ground - 150, 10, 150);
        ctx.fillRect(x + 92, ground - 150, 10, 150);
        ctx.strokeRect(x - 102, ground - 150, 10, 150);
        ctx.strokeRect(x + 92, ground - 150, 10, 150);
        ctx.fillStyle = HELPER_TYPES[["light", "light", "strong", "strong", "absurd"][runtime.session.roundIndex]].color;
        roundedRect(ctx, x - 112, ground - 181, 224, 74, 13);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#17213b";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "1000 13px system-ui, sans-serif";
        ctx.fillText(`STAGE ${runtime.session.roundIndex + 1} / ${ROUND_COUNT}`, x, ground - 162);
        ctx.font = "1000 21px system-ui, sans-serif";
        ctx.fillText(runtime.stageInfo.name, x, ground - 135);
        ctx.restore();
    }

    function drawLauncher() {
        const x = 105 - runtime.cameraX;
        if (x < -180) return;
        const ground = groundAt(105);
        ctx.save();
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;
        ctx.fillStyle = "#ff7043";
        roundedRect(ctx, x - 44, ground - 38, 100, 31, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#26304d";
        ctx.beginPath();
        ctx.arc(x - 20, ground - 4, 14, 0, Math.PI * 2);
        ctx.arc(x + 36, ground - 4, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(x - 20, ground - 4, 5, 0, Math.PI * 2);
        ctx.arc(x + 36, ground - 4, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#ffe0bd";
        ctx.beginPath();
        ctx.arc(x - 62, ground - 71, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#855bd8";
        roundedRect(ctx, x - 76, ground - 60, 29, 43, 8);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = "#17213b";
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x - 70, ground - 17);
        ctx.lineTo(x - 76, ground - 1);
        ctx.moveTo(x - 52, ground - 17);
        ctx.lineTo(x - 46, ground - 1);
        ctx.moveTo(x - 49, ground - 53);
        ctx.lineTo(x - 29, ground - 66);
        ctx.stroke();
        ctx.restore();
    }

    function drawVenue() {
        const worldEnd = getStageWorldEnd();
        const x = worldEnd - runtime.cameraX;
        if (x < -260 || x > runtime.width + 300) return;
        const ground = groundAt(worldEnd);
        ctx.save();
        const beacon = ctx.createLinearGradient(x, ground - 310, x, ground);
        beacon.addColorStop(0, "rgba(255,246,219,0)");
        beacon.addColorStop(1, "rgba(255,216,70,.38)");
        ctx.fillStyle = beacon;
        ctx.beginPath();
        ctx.moveTo(x - 48, ground - 285);
        ctx.lineTo(x + 48, ground - 285);
        ctx.lineTo(x + 126, ground);
        ctx.lineTo(x - 126, ground);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 5;
        ctx.fillStyle = runtime.stageInfo.goalColor;
        roundedRect(ctx, x - 142, ground - 218, 284, 218, 12);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#fff6db";
        roundedRect(ctx, x - 86, ground - 128, 172, 128, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#ffd846";
        roundedRect(ctx, x - 116, ground - 197, 232, 48, 9);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#17213b";
        ctx.font = "1000 13px system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(`목표 ${runtime.stageInfo.goalDistance}m · 돌파하면 ∞`, x, ground - 181);
        ctx.font = "1000 17px system-ui, sans-serif";
        ctx.fillText(runtime.goalReached ? "무한 모드 입구 박살!" : runtime.stageInfo.goalLabel, x, ground - 88);
        ctx.font = "900 12px system-ui, sans-serif";
        ctx.fillText(runtime.stageInfo.goalJoke, x, ground - 60);
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, ground - 218);
        ctx.lineTo(x, ground - 275);
        ctx.stroke();
        ctx.fillStyle = "#ff7043";
        ctx.beginPath();
        ctx.moveTo(x + 2, ground - 272);
        ctx.lineTo(x + 70, ground - 251);
        ctx.lineTo(x + 2, ground - 231);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        if (runtime.goalReached) {
            ctx.strokeStyle = "#fff6db";
            ctx.lineWidth = 6;
            ctx.beginPath();
            ctx.moveTo(x - 62, ground - 126);
            ctx.lineTo(x - 18, ground - 81);
            ctx.lineTo(x - 42, ground - 45);
            ctx.moveTo(x + 66, ground - 128);
            ctx.lineTo(x + 19, ground - 78);
            ctx.lineTo(x + 47, ground - 34);
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawTrajectory() {
        if (runtime.state !== "aiming" && runtime.state !== "charging") return;
        const radians = runtime.angle * Math.PI / 180;
        const speed = (500 + runtime.power * 660) * runtime.instrument.launchMultiplier;
        const x0 = LAUNCH_X;
        const y0 = groundAt(x0) - runtime.instrument.radius - 8;
        ctx.save();
        for (let i = 1; i <= 14; i += 1) {
            const t = i * .075;
            const x = x0 + Math.cos(radians) * speed * t + .5 * runtime.stageInfo.wind * t * t - runtime.cameraX;
            const y = y0 - Math.sin(radians) * speed * runtime.instrument.verticalMultiplier * t
                + .5 * runtime.stageInfo.gravity * runtime.instrument.gravityMultiplier * t * t;
            if (y > runtime.height || x > runtime.width + 10) break;
            ctx.globalAlpha = 1 - i / 17;
            ctx.fillStyle = i % 2 ? "#fff" : "#ff7043";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(2.5, 6 - i * .2), 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
        ctx.restore();
    }

    function drawInstrument(item, x, y, rotation, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        ctx.scale(scale, scale);
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 4;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        if (item.id === "piano") {
            ctx.fillStyle = item.color;
            roundedRect(ctx, -50, -28, 100, 55, 9);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = item.accent;
            roundedRect(ctx, -44, 2, 88, 20, 3);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 2;
            for (let i = -33; i <= 33; i += 11) {
                ctx.beginPath();
                ctx.moveTo(i, 2);
                ctx.lineTo(i, 22);
                ctx.stroke();
            }
            ctx.fillStyle = "#17213b";
            for (let i = -28; i <= 27; i += 22) ctx.fillRect(i, 2, 6, 12);
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(-34, 27);
            ctx.lineTo(-39, 39);
            ctx.moveTo(34, 27);
            ctx.lineTo(39, 39);
            ctx.stroke();
        } else if (item.id === "trumpet") {
            ctx.strokeStyle = item.color;
            ctx.lineWidth = 11;
            ctx.beginPath();
            ctx.moveTo(-40, 2);
            ctx.lineTo(29, 2);
            ctx.stroke();
            ctx.fillStyle = item.color;
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(23, -17);
            ctx.lineTo(52, -27);
            ctx.lineTo(52, 29);
            ctx.lineTo(23, 17);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(-43, 2, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            for (let x = -18; x <= 12; x += 15) {
                ctx.beginPath();
                ctx.moveTo(x, -4);
                ctx.lineTo(x, -19);
                ctx.stroke();
            }
        } else if (item.id === "guitar") {
            ctx.fillStyle = item.color;
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(-23, 0, 27, 24, 0, 0, Math.PI * 2);
            ctx.ellipse(4, 0, 21, 19, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#17213b";
            ctx.beginPath();
            ctx.arc(-11, 0, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = item.accent;
            ctx.strokeStyle = "#17213b";
            roundedRect(ctx, 12, -7, 66, 14, 4);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = item.color;
            roundedRect(ctx, 70, -13, 18, 26, 5);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "rgba(255,255,255,.85)";
            ctx.lineWidth = 1;
            for (let i = -3; i <= 3; i += 3) {
                ctx.beginPath();
                ctx.moveTo(-5, i);
                ctx.lineTo(82, i);
                ctx.stroke();
            }
        } else if (item.id === "drum") {
            ctx.fillStyle = item.color;
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.arc(0, 0, 34, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = item.accent;
            ctx.beginPath();
            ctx.ellipse(0, -23, 28, 10, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#fff3d0";
            ctx.lineWidth = 3;
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
                ctx.beginPath();
                ctx.moveTo(Math.cos(a) * 29, Math.sin(a) * 29);
                ctx.lineTo(Math.cos(a + Math.PI / 2) * 29, Math.sin(a + Math.PI / 2) * 29);
                ctx.stroke();
            }
        } else {
            ctx.fillStyle = item.color;
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(-20, -8, 18, 15, -.15, 0, Math.PI * 2);
            ctx.ellipse(-20, 12, 20, 16, .15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#17213b";
            ctx.beginPath();
            ctx.arc(-20, 2, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = item.accent;
            roundedRect(ctx, -4, -5, 72, 10, 4);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = item.color;
            roundedRect(ctx, 60, -11, 18, 22, 5);
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#f9e0b0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-38, -6);
            ctx.lineTo(72, -6);
            ctx.stroke();
        }

        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#17213b";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-7, -13, 5, 0, Math.PI * 2);
        ctx.arc(8, -13, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "#17213b";
        ctx.beginPath();
        ctx.arc(-6, -12, 2, 0, Math.PI * 2);
        ctx.arc(9, -12, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    function drawParticles() {
        for (const particle of runtime.particles) {
            const x = particle.x - runtime.cameraX;
            if (x < -20 || x > runtime.width + 20) continue;
            ctx.globalAlpha = Math.min(1, particle.life / .28);
            ctx.fillStyle = particle.color;
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 1;
            if (particle.shape === "circle") {
                ctx.beginPath();
                ctx.arc(x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
            }
        }
        ctx.globalAlpha = 1;
    }

    function drawInstrumentStrengthEffect(projectile, time) {
        const x = projectile.x - runtime.cameraX;
        const y = projectile.y;
        const motion = record.settings.reducedEffects ? 0 : 1;
        const pulse = Math.sin(time * .012) * 4 * motion;
        ctx.save();
        ctx.translate(x, y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (runtime.instrument.id === "piano") {
            const striking = projectile.pianoSmashTimer > 0;
            const handDrop = striking ? Math.max(0, 18 - projectile.actionPulse * 16) : -7;
            ctx.globalAlpha = striking ? .94 : .34;
            ctx.fillStyle = "#ffd3a6";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 3;
            roundedRect(ctx, -22, -projectile.radius - 47 + handDrop, 44, 31, 14);
            ctx.fill();
            ctx.stroke();
            for (let finger = -15; finger <= 15; finger += 10) {
                roundedRect(ctx, finger - 4, -projectile.radius - 20 + handDrop, 8, 22, 4);
                ctx.fill();
                ctx.stroke();
            }
            ctx.strokeStyle = striking ? "#ff7043" : "#fff6db";
            ctx.lineWidth = striking ? 6 : 3;
            for (let ring = 0; ring < (striking ? 4 : 2); ring += 1) {
                ctx.globalAlpha = (striking ? .78 : .28) - ring * .13;
                ctx.beginPath();
                ctx.ellipse(projectile.radius + 25 + ring * 27 + pulse, 7, 13 + ring * 7, 36 + ring * 6, 0, -1.05, 1.05);
                ctx.stroke();
            }
        } else if (runtime.instrument.id === "trumpet") {
            const blowing = projectile.rocketTimer > 0;
            ctx.strokeStyle = blowing ? "#9ee8ff" : "#fff6db";
            ctx.fillStyle = "rgba(158,232,255,.82)";
            ctx.lineWidth = blowing ? 6 : 3;
            for (let ring = 0; ring < (blowing ? 4 : 2); ring += 1) {
                const travel = blowing ? ((time * .16 + ring * 29) % 118) * motion : ring * 25;
                ctx.globalAlpha = blowing ? .86 - ring * .13 : .3;
                ctx.beginPath();
                ctx.ellipse(projectile.radius + 26 + travel, 1, 13 + ring * 4, 23 + ring * 7, 0, -.95, .95);
                ctx.stroke();
            }
            ctx.globalAlpha = blowing ? .72 : .24;
            for (let puff = 0; puff < 3; puff += 1) {
                ctx.beginPath();
                ctx.arc(projectile.radius + 48 + puff * 24 + pulse, -20 + puff * 18, 7 + puff * 2, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (runtime.instrument.id === "guitar") {
            const combo = Math.max(1, projectile.guitarCombo || 0);
            const plucking = projectile.guitarTimer > 0;
            const vibration = (plucking ? 12 : 4) * Math.sin(time * .035) * motion;
            ctx.globalAlpha = plucking ? .92 : .35;
            ctx.strokeStyle = plucking ? "#ffd846" : "#fff6db";
            ctx.lineWidth = plucking ? 4 : 2;
            for (let string = -1; string <= 1; string += 1) {
                ctx.beginPath();
                ctx.moveTo(-projectile.radius - 42, string * 8);
                ctx.quadraticCurveTo(0, string * 8 + vibration * (string || 1), projectile.radius + 62, string * 8);
                ctx.stroke();
            }
            ctx.fillStyle = "#fff6db";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 3;
            ctx.font = `1000 ${18 + combo}px system-ui, sans-serif`;
            ctx.textAlign = "center";
            ctx.strokeText("♪", -projectile.radius - 18, -27 - pulse);
            ctx.fillText("♪", -projectile.radius - 18, -27 - pulse);
            ctx.strokeText("♫", projectile.radius + 25, 25 + pulse);
            ctx.fillText("♫", projectile.radius + 25, 25 + pulse);
        } else if (runtime.instrument.id === "drum") {
            const kicking = projectile.drumTimer > 0;
            const kickReach = kicking ? 22 + Math.max(0, projectile.actionPulse) * 26 : 0;
            ctx.globalAlpha = kicking ? .96 : .3;
            ctx.fillStyle = "#6f72dc";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 4;
            roundedRect(ctx, -projectile.radius - 75 + kickReach, -17, 45, 23, 8);
            ctx.fill();
            ctx.stroke();
            ctx.fillStyle = "#fff6db";
            ctx.beginPath();
            ctx.moveTo(-projectile.radius - 42 + kickReach, -4);
            ctx.lineTo(-projectile.radius - 18 + kickReach, 5);
            ctx.lineTo(-projectile.radius - 21 + kickReach, 18);
            ctx.lineTo(-projectile.radius - 57 + kickReach, 12);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            ctx.strokeStyle = "#fff2c8";
            ctx.lineWidth = kicking ? 7 : 3;
            for (let i = 0; i < 3; i += 1) {
                ctx.beginPath();
                ctx.arc(0, 0, projectile.radius + 10 + i * 12 + pulse, Math.PI * .7, Math.PI * 1.3);
                ctx.stroke();
            }
        } else if (runtime.instrument.id === "violin") {
            const bowing = projectile.specialTimer > 0;
            const sweep = Math.sin(time * .009) * 18 * motion;
            ctx.globalAlpha = bowing ? .82 : .3;
            ctx.strokeStyle = bowing ? "#ffd166" : "#fff6db";
            ctx.lineWidth = bowing ? 5 : 3;
            for (let staff = -1; staff <= 1; staff += 1) {
                ctx.beginPath();
                ctx.moveTo(-projectile.radius - 105, staff * 15 + pulse);
                ctx.quadraticCurveTo(0, staff * 15 - pulse, projectile.radius + 112, staff * 15 + pulse);
                ctx.stroke();
            }
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 7;
            ctx.beginPath();
            ctx.moveTo(-38 + sweep, 38);
            ctx.lineTo(42 + sweep, -39);
            ctx.stroke();
            ctx.strokeStyle = "#f9e0b0";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(-42 + sweep, 34);
            ctx.lineTo(38 + sweep, -43);
            ctx.stroke();
            ctx.fillStyle = "#fff6db";
            ctx.strokeStyle = "#17213b";
            ctx.lineWidth = 2;
            ctx.font = "1000 24px system-ui, sans-serif";
            ctx.strokeText("♪", projectile.radius + 58, -22 - pulse);
            ctx.fillText("♪", projectile.radius + 58, -22 - pulse);
        }
        ctx.restore();
    }

    function drawScene(time) {
        ctx.clearRect(0, 0, runtime.width, runtime.height);
        drawBackground(time);
        drawGround();
        drawLandmarks();
        drawEndlessMarkers();
        drawVenue();
        drawStageGate();
        drawLauncher();
        for (const obstacle of runtime.obstacles) drawShape(obstacle);
        for (const helper of runtime.helpers) drawHelper(helper, time);
        drawTrajectory();

        if (runtime.projectile) {
            drawInstrumentStrengthEffect(runtime.projectile, time);
            if (runtime.projectile.specialFlash > 0) {
                const flashProgress = runtime.projectile.specialFlash / 1.15;
                const pulse = record.settings.reducedEffects ? 1 : 1 + Math.sin(performance.now() * .028) * .12;
                ctx.save();
                ctx.globalAlpha = Math.min(.65, flashProgress);
                ctx.fillStyle = "#fff4a6";
                ctx.strokeStyle = "#ff7043";
                ctx.lineWidth = 5;
                ctx.beginPath();
                ctx.arc(
                    runtime.projectile.x - runtime.cameraX,
                    runtime.projectile.y,
                    (runtime.projectile.radius + 21) * pulse,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.stroke();
                ctx.restore();
            }
            drawInstrument(
                runtime.instrument,
                runtime.projectile.x - runtime.cameraX,
                runtime.projectile.y,
                runtime.projectile.rotation,
                runtime.width < 430 ? .82 : 1
            );
        } else if (["aiming", "charging"].includes(runtime.state)) {
            const radians = runtime.angle * Math.PI / 180;
            drawInstrument(
                runtime.instrument,
                LAUNCH_X - runtime.cameraX,
                groundAt(LAUNCH_X) - runtime.instrument.radius - 8,
                -radians * .18,
                runtime.width < 430 ? .82 : 1
            );
        }
        drawParticles();
        drawBreakthroughOverlay();
    }

    function update(dt) {
        if (runtime.state === "aiming") {
            runtime.angle += runtime.angleDirection * 32 * dt;
            if (runtime.angle >= 68) {
                runtime.angle = 68;
                runtime.angleDirection = -1;
            } else if (runtime.angle <= 18) {
                runtime.angle = 18;
                runtime.angleDirection = 1;
            }
            updateAimDisplay();
        } else if (runtime.state === "charging") {
            runtime.power += runtime.powerDirection * .72 * dt;
            if (runtime.power >= 1) {
                runtime.power = 1;
                runtime.powerDirection = -1;
            } else if (runtime.power <= .25) {
                runtime.power = .25;
                runtime.powerDirection = 1;
            }
            updateAimDisplay();
        } else if (runtime.state === "flying") {
            updateFlight(dt);
        }
        updateParticles(dt);
    }

    function frame(now) {
        const dt = Math.min(.033, Math.max(0, (now - runtime.lastFrame) / 1000));
        runtime.lastFrame = now;
        if (runtime.state !== "paused") update(dt);
        drawScene(now);
        requestAnimationFrame(frame);
    }

    function onActionPointerDown(event) {
        if (runtime.suppressNextActionClick) {
            runtime.suppressNextActionClick = false;
            window.clearTimeout(runtime.suppressClickTimer);
        }
        runtime.actionPointerStartState = runtime.state;
        if (runtime.state === "aiming" && event.pointerId !== undefined && elements.actionButton.setPointerCapture) {
            try {
                elements.actionButton.setPointerCapture(event.pointerId);
            } catch (_error) {
                // The pointer can already be released on some assistive browsers.
            }
        }
        if (runtime.state === "aiming") {
            beginCharge();
            event.preventDefault();
        }
    }

    function onActionPointerUp(event) {
        const startState = runtime.actionPointerStartState;
        runtime.actionPointerStartState = null;
        const changedWhilePressed = startState && startState !== runtime.state
            && !(startState === "aiming" && runtime.state === "charging");
        if (changedWhilePressed) {
            runtime.suppressNextActionClick = true;
            window.clearTimeout(runtime.suppressClickTimer);
            runtime.suppressClickTimer = window.setTimeout(() => {
                runtime.suppressNextActionClick = false;
            }, 3000);
            event.preventDefault();
            return;
        }
        const wasCharging = startState === "aiming" && runtime.state === "charging";
        const wasTransition = startState === "transition" && runtime.state === "transition";
        if (wasCharging) launch();
        else if (wasTransition) nextRound();
        else return;
        runtime.suppressNextActionClick = true;
        window.clearTimeout(runtime.suppressClickTimer);
        runtime.suppressClickTimer = window.setTimeout(() => {
            runtime.suppressNextActionClick = false;
        }, 3000);
        event.preventDefault();
    }

    function onActionClick() {
        if (runtime.suppressNextActionClick) {
            runtime.suppressNextActionClick = false;
            return;
        }
        if (runtime.state === "flying") activateFlightAction();
        else if (runtime.state === "aiming") quickLaunch(.62, runtime.angle);
        else if (runtime.state === "transition") nextRound();
    }

    elements.startGame.addEventListener("click", () => startSession());
    elements.playAgain.addEventListener("click", () => startSession(shuffledInstrumentIds()));
    elements.pauseButton.addEventListener("click", pauseGame);
    elements.resumeGame.addEventListener("click", resumeGame);
    elements.quitGame.addEventListener("click", quitGame);
    elements.actionButton.addEventListener("pointerdown", onActionPointerDown);
    elements.actionButton.addEventListener("pointerup", onActionPointerUp);
    elements.actionButton.addEventListener("pointercancel", onActionPointerUp);
    elements.actionButton.addEventListener("click", onActionClick);
    elements.endRunButton.addEventListener("click", () => {
        if (runtime.state === "flying" && runtime.goalReached) finishFlight();
    });

    elements.soundToggle.addEventListener("click", () => {
        record.settings.muted = !record.settings.muted;
        applySettings();
        saveRecord(record.settings.muted ? "소리 끔" : "소리 켬");
        if (!record.settings.muted) playSound("button");
    });

    elements.effectsToggle.addEventListener("click", () => {
        record.settings.reducedEffects = !record.settings.reducedEffects;
        applySettings();
        saveRecord(record.settings.reducedEffects ? "화면 효과 줄임" : "화면 효과 복원");
    });

    elements.resetRecord.addEventListener("click", () => {
        if (typeof elements.resetDialog.showModal === "function") elements.resetDialog.showModal();
        else if (window.confirm("이 게임의 배송 기록만 지울까요?")) resetOnlyThisGame();
    });

    elements.confirmReset.addEventListener("click", resetOnlyThisGame);

    document.addEventListener("keydown", (event) => {
        const activeElement = document.activeElement;
        const activeTag = activeElement?.tagName;
        const isTextEntry = activeElement?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(activeTag);
        const isOtherControl = activeElement !== elements.actionButton && ["BUTTON", "A"].includes(activeTag);
        if (event.code === "Space" && !isTextEntry && !isOtherControl) {
            if (!event.repeat && runtime.state === "aiming") beginCharge();
            else if (!event.repeat && runtime.state === "flying") activateFlightAction();
            else if (!event.repeat && runtime.state === "transition") nextRound();
            event.preventDefault();
        }
        if (event.code === "Escape" && ["aiming", "charging", "flying"].includes(runtime.state)) {
            pauseGame();
            event.preventDefault();
        }
    });

    document.addEventListener("keyup", (event) => {
        if (event.code === "Space" && runtime.state === "charging") {
            launch();
            event.preventDefault();
        }
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) pauseGame();
    });

    window.addEventListener("resize", resizeCanvas);
    if (window.ResizeObserver) new ResizeObserver(resizeCanvas).observe(elements.stage);

    window.C16InstrumentDelivery = Object.freeze({
        storageKey: STORAGE_KEY,
        getState() {
            return {
                state: runtime.state,
                instrumentId: runtime.instrument.id,
                actionVerb: runtime.instrument.actionVerb,
                actionPhrase: runtime.instrument.actionPhrase,
                specialLabel: runtime.instrument.special,
                strengthName: runtime.instrument.strengthName,
                strengthDetail: runtime.instrument.strengthDetail,
                launchMultiplier: runtime.instrument.launchMultiplier,
                verticalMultiplier: runtime.instrument.verticalMultiplier,
                gravityMultiplier: runtime.instrument.gravityMultiplier,
                roundIndex: runtime.session?.roundIndex ?? -1,
                stageIndex: runtime.session?.roundIndex ?? -1,
                stageName: runtime.stageInfo.name,
                totalStages: STAGES.length,
                stageGravity: runtime.stageInfo.gravity,
                stageWind: runtime.stageInfo.wind,
                goalDistance: runtime.stageInfo.goalDistance,
                goalLabel: runtime.stageInfo.goalLabel,
                worldEnd: getStageWorldEnd(),
                timeLimit: runtime.stageInfo.timeLimit,
                checkpointIndex: runtime.checkpointIndex,
                surfacePattern: runtime.surfaces.map((surface) => surface.id),
                flightSeconds: runtime.flightSeconds,
                goalReached: runtime.goalReached,
                endlessDistance: Math.max(0, runtime.currentDistance - (runtime.stageInfo.goalDistance || 800)),
                endlessCombo: runtime.endlessCombo,
                endlessHelpers: runtime.endlessHelpers,
                endlessCrashes: runtime.endlessCrashes,
                endlessChunkIndex: runtime.endlessChunkIndex,
                endlessGeneratedUntil: runtime.endlessGeneratedUntil,
                accelerationGraceRemaining: runtime.goalReached
                    ? Math.max(0, ENDLESS_GRACE_SECONDS - (runtime.flightSeconds - runtime.lastAccelerationAt))
                    : 0,
                goalProgress: runtime.projectile
                    ? Math.max(0, Math.min(1, (runtime.projectile.maxX - LAUNCH_X) / (getStageWorldEnd() - LAUNCH_X)))
                    : 0,
                goalRemaining: Math.max(0, (runtime.stageInfo.goalDistance || 800) - runtime.currentDistance),
                currentResult: runtime.session?.results[runtime.session?.roundIndex]
                    ? { ...runtime.session.results[runtime.session.roundIndex] }
                    : null,
                obstacleCount: runtime.obstacles.filter((obstacle) => !obstacle.destroyed).length,
                score: (runtime.session?.totalScore || 0) + runtime.currentScore,
                distance: runtime.currentDistance,
                power: runtime.power,
                specialAvailable: runtime.specialAvailable,
                aftershockCharges: runtime.aftershockCharges,
                currentDestroyed: runtime.currentDestroyed,
                guitarCombo: runtime.projectile?.guitarCombo || 0,
                actionCount: runtime.projectile?.actionCount || 0,
                actionPulse: runtime.projectile?.actionPulse || 0,
                pianoSmashActive: Boolean(runtime.projectile?.pianoSmashTimer > 0),
                drumActive: Boolean(runtime.projectile?.drumTimer > 0),
                kickActive: Boolean(runtime.instrument.id === "drum" && runtime.projectile?.drumTimer > 0),
                pluckActive: Boolean(runtime.instrument.id === "guitar" && runtime.projectile?.guitarTimer > 0),
                glideActive: Boolean(runtime.projectile?.specialTimer > 0),
                bowActive: Boolean(runtime.instrument.id === "violin" && runtime.projectile?.specialTimer > 0),
                blowActive: Boolean(runtime.instrument.id === "trumpet" && runtime.projectile?.rocketTimer > 0),
                helperHits: { ...runtime.helperHits },
                helpersRemaining: runtime.helpers.filter((helper) => !helper.used).map((helper) => helper.type),
                projectileSpeed: runtime.projectile ? Math.round(Math.hypot(runtime.projectile.vx, runtime.projectile.vy)) : 0,
                projectileVx: runtime.projectile ? Math.round(runtime.projectile.vx) : 0,
                projectileVy: runtime.projectile ? Math.round(runtime.projectile.vy) : 0,
                rocketActive: Boolean(runtime.projectile?.rocketTimer > 0),
                absurdActive: Boolean(runtime.projectile?.absurdTimer > 0),
                storageAvailable,
                protectedStorage
            };
        },
        start: () => startSession(),
        startWithOrder: (order) => startSession(Array.isArray(order) ? order : null),
        quickLaunch,
        useSpecial,
        useAftershock,
        triggerHelper,
        triggerObstacle,
        advanceFlight,
        finishFlight,
        reset: resetOnlyThisGame
    });

    applySettings();
    runtime.surfaces = createSurfaceSegments(runtime.stageInfo);
    updateRecordDisplay();
    updateHud();
    resizeCanvas();
    setState("menu");
    runtime.helpers = createHelpers(1693, runtime.stageInfo);
    runtime.obstacles = createObstacles(1616, runtime.stageInfo).filter((obstacle) => (
        !runtime.helpers.some((helper) => Math.abs(obstacle.x - helper.x) < obstacle.radius + helper.radius + 72)
    ));
    requestAnimationFrame(frame);
})();
