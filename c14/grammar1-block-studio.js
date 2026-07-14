(() => {
    'use strict';

    const STORAGE_KEY = 'c14-grammar1-block-studio-v2';
    const LEGACY_STORAGE_KEY = 'c14-grammar1-block-studio-v1';
    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)');

    const BLOCK_META = {
        hado: { label: '하도 A/V-아서/어서', className: 'block-hado', family: 'hado' },
        aso: { label: '-아서/어서', className: 'block-aso', family: 'aso' },
        geuraeseo: { label: '그래서', className: 'block-geuraeseo', family: 'geuraeseo' },
        aju: { label: '아주', className: 'block-aju', family: 'degree' },
        neomu: { label: '너무', className: 'block-neomu', family: 'degree' },
        jinjja: { label: '진짜', className: 'block-jinjja', family: 'degree' },
        maeu: { label: '매우', className: 'block-maeu', family: 'degree' },
        jeongmal: { label: '정말', className: 'block-jeongmal', family: 'degree' }
    };

    const KIND_ORDER = ['hado', 'aso', 'geuraeseo', 'aju', 'neomu', 'jinjja', 'maeu', 'jeongmal'];

    const TUTORIAL_QUESTIONS = [
        {
            id: 'film', kind: 'wrap', meaning: 'meaning.hado.strong-degree-result',
            title: 'ㄷ 모양 블록이 들어갈 자리를 찾아요.',
            prefix: '그 영화가', stem: '재미있', tail: '어서', suffix: '제가 두 번 봤어요.',
            answers: ['hado'], trace: ['하도', '재미있', '-어서', '결과'],
            success: '맞아요. 하도와 -어서가 붙어 영화가 재미있는 정도와 두 번 본 결과를 이어요.',
            wrong: '이 빈칸은 앞과 뒤를 함께 감싸는 자리예요. ㄷ 모양 블록을 찾아 보세요.'
        },
        {
            id: 'exhibition', kind: 'inline', meaning: 'meaning.degree-adverb.independent',
            title: '혼자 들어갈 수 있는 정도 부사를 넣어요.',
            prefix: '그 전시가', suffix: '아름다워요.',
            answers: ['aju', 'neomu'], trace: ['한 문장', '정도 부사', '아주 또는 너무'],
            success: (block) => `맞아요. ‘${BLOCK_META[block.kind].label}’는 이렇게 단독 블록으로도 쓸 수 있어요.`,
            wrong: '이 빈칸에는 정도를 더하는 단독 블록이 들어가요. 하도는 이 활동에서 혼자 쓰지 않아요.'
        },
        {
            id: 'tired-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개를 이어요.',
            left: '어제는 너무 피곤했어요.', right: '일찍 잤어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            success: '맞아요. 앞과 뒤가 각각 끝난 문장이므로 그래서로 이어요.',
            wrong: '앞도 ‘피곤했어요.’, 뒤도 ‘잤어요.’로 끝난 문장입니다. 문장 둘 사이에는 그래서 블록이 맞아요.'
        },
        {
            id: 'rain-clause', kind: 'clause', meaning: 'meaning.connector.clause-result',
            title: '앞 절을 바로 뒤 결과에 이어요.',
            left: '비가 많이 와', right: '길이 잠겼어요.',
            answers: ['aso'], trace: ['앞 절', '-아서/어서', '결과'],
            success: '맞아요. ‘비가 많이 와서’는 뒤의 결과 ‘길이 잠겼어요’에 이어지는 절이에요.',
            wrong: '앞부분은 끝난 문장이 아니라 뒤 결과로 이어져요. 끝부분에 붙는 -아서/어서 블록을 골라 보세요.'
        },
        {
            id: 'baby', kind: 'wrap', meaning: 'meaning.hado.repetition-result',
            title: '하도 블록을 다시 끼워 봐요.',
            prefix: '아기가', stem: '울', tail: '어서', suffix: '엄마가 밤새 못 잤어요.',
            answers: ['hado'], trace: ['하도', '울', '-어서', '결과'],
            success: '맞아요. 하도 울어서가 밤새 못 잔 결과까지 강하게 이어 줘요.',
            wrong: '하도는 여기서 혼자 들어가지 않아요. 앞과 뒤가 붙은 ㄷ 모양 블록을 골라 보세요.'
        },
        {
            id: 'boat-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '문장 두 개를 한 번 더 이어요.',
            left: '바람이 많이 불었어요.', right: '배가 늦게 도착했어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            success: '맞아요. 끝난 문장 두 개를 그래서가 다리처럼 이어요.',
            wrong: '앞 문장은 이미 ‘불었어요.’로 끝났어요. 절 끝에 붙는 블록이 아니라 그래서 블록을 넣어 보세요.'
        }
    ];

    const STAGE_1_QUESTIONS = [
        {
            id: 's1-corridor', kind: 'wrap', meaning: 'meaning.hado.strong-degree-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '복도가', stem: '어두워', tail: '서', suffix: '휴대전화 불을 켰어요.',
            answers: ['hado'], trace: ['하도', '어두워', '-서', '결과'],
            full: { before: '복도가 ', target: '하도 어두워서', after: ' 휴대전화 불을 켰어요.' }
        },
        {
            id: 's1-food', kind: 'inline', meaning: 'meaning.degree-adverb.independent',
            title: '혼자 들어갈 수 있는 정도 부사 빈칸',
            prefix: '이 음식은', suffix: '매워요.',
            answers: ['jinjja'], trace: ['한 문장', '정도 부사', '진짜'],
            full: { before: '이 음식은 ', target: '진짜', after: ' 매워요.' }
        },
        {
            id: 's1-cold-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '날씨가 추웠어요.', right: '두꺼운 옷을 입었어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '날씨가 추웠어요. ', target: '그래서', after: ' 두꺼운 옷을 입었어요.' }
        },
        {
            id: 's1-wind-clause', kind: 'clause', meaning: 'meaning.connector.clause-result',
            title: '앞 절을 뒤 결과에 잇는 빈칸',
            left: '바람이 차가워', right: '창문을 닫았어요.',
            answers: ['aso'], trace: ['앞 절', '-아서/어서', '결과'],
            full: { before: '', target: '바람이 차가워서', after: ' 창문을 닫았어요.' }
        },
        {
            id: 's1-movie', kind: 'wrap', meaning: 'meaning.hado.strong-degree-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '영화가', stem: '무서워', tail: '서', suffix: '텔레비전을 껐어요.',
            answers: ['hado'], trace: ['하도', '무서워', '-서', '결과'],
            full: { before: '영화가 ', target: '하도 무서워서', after: ' 텔레비전을 껐어요.' }
        },
        {
            id: 's1-bus-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '버스를 놓쳤어요.', right: '택시를 탔어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '버스를 놓쳤어요. ', target: '그래서', after: ' 택시를 탔어요.' }
        }
    ];

    const STAGE_2_QUESTIONS = [
        {
            id: 's2-reader', kind: 'wrap', meaning: 'meaning.hado.repetition-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '그 사람은 책을', stem: '많이 읽', tail: '어서', suffix: '모르는 게 없어요.',
            answers: ['hado'], trace: ['하도', '많이 읽', '-어서', '결과'],
            full: { before: '그 사람은 책을 ', target: '하도 많이 읽어서', after: ' 모르는 게 없어요.' }
        },
        {
            id: 's2-pollution', kind: 'inline', meaning: 'meaning.degree-adverb.independent',
            title: '혼자 들어갈 수 있는 정도 부사 빈칸',
            prefix: '공해가', suffix: '많아요.',
            answers: ['maeu'], trace: ['한 문장', '정도 부사', '매우'],
            full: { before: '공해가 ', target: '매우', after: ' 많아요.' }
        },
        {
            id: 's2-ramen-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '라면이 뜨거웠어요.', right: '천천히 먹었어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '라면이 뜨거웠어요. ', target: '그래서', after: ' 천천히 먹었어요.' }
        },
        {
            id: 's2-snow-clause', kind: 'clause', meaning: 'meaning.connector.clause-result',
            title: '앞 절을 뒤 결과에 잇는 빈칸',
            left: '눈이 많이 와', right: '길이 미끄러웠어요.',
            answers: ['aso'], trace: ['앞 절', '-아서/어서', '결과'],
            full: { before: '', target: '눈이 많이 와서', after: ' 길이 미끄러웠어요.' }
        },
        {
            id: 's2-friends', kind: 'wrap', meaning: 'meaning.hado.repetition-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '친구들이', stem: '기다려', tail: '서', suffix: '택시를 탔어요.',
            answers: ['hado'], trace: ['하도', '기다려', '-서', '결과'],
            full: { before: '친구들이 ', target: '하도 기다려서', after: ' 택시를 탔어요.' }
        },
        {
            id: 's2-explanation-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '설명이 짧았어요.', right: '내용을 이해하지 못했어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '설명이 짧았어요. ', target: '그래서', after: ' 내용을 이해하지 못했어요.' }
        }
    ];

    const STAGE_3_QUESTIONS = [
        {
            id: 's3-cheonggyecheon', kind: 'wrap', meaning: 'meaning.hado.strong-degree-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '여기가 청계천이라고요?', stem: '많이 변해', tail: '서', suffix: '몰랐어요.',
            answers: ['hado'], trace: ['하도', '많이 변해', '-서', '결과'],
            full: { before: '여기가 청계천이라고요? ', target: '하도 많이 변해서', after: ' 몰랐어요.' }
        },
        {
            id: 's3-memory', kind: 'inline', meaning: 'meaning.degree-adverb.independent',
            title: '혼자 들어갈 수 있는 정도 부사 빈칸',
            prefix: '그때의 기억이', suffix: '생생해요.',
            answers: ['jeongmal'], trace: ['한 문장', '정도 부사', '정말'],
            full: { before: '그때의 기억이 ', target: '정말', after: ' 생생해요.' }
        },
        {
            id: 's3-screen-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '어젯밤에 늦게까지 화면을 봤어요.', right: '눈이 빨개졌어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '어젯밤에 늦게까지 화면을 봤어요. ', target: '그래서', after: ' 눈이 빨개졌어요.' }
        },
        {
            id: 's3-photo-clause', kind: 'clause', meaning: 'meaning.connector.clause-result',
            title: '앞 절을 뒤 결과에 잇는 빈칸',
            left: '옛날 사진을 봐', right: '추억이 생각났어요.',
            answers: ['aso'], trace: ['앞 절', '-아서/어서', '결과'],
            full: { before: '', target: '옛날 사진을 봐서', after: ' 추억이 생각났어요.' }
        },
        {
            id: 's3-fun', kind: 'wrap', meaning: 'meaning.hado.strong-degree-result',
            title: '앞과 뒤를 함께 감싸는 빈칸',
            prefix: '', stem: '재미있', tail: '어서', suffix: '시간 가는 줄 몰랐어요.',
            answers: ['hado'], trace: ['하도', '재미있', '-어서', '결과'],
            full: { before: '', target: '하도 재미있어서', after: ' 시간 가는 줄 몰랐어요.' }
        },
        {
            id: 's3-friend-sentences', kind: 'pair', meaning: 'meaning.connector.complete-sentences',
            title: '완전한 문장 두 개 사이의 빈칸',
            left: '친구의 모습이 많이 달라졌어요.', right: '처음에는 알아보지 못했어요.',
            answers: ['geuraeseo'], trace: ['완전한 문장', '그래서', '완전한 문장'],
            full: { before: '친구의 모습이 많이 달라졌어요. ', target: '그래서', after: ' 처음에는 알아보지 못했어요.' }
        }
    ];

    const STAGES = [
        {
            id: 'tutorial', type: 'tutorial', label: '튜토리얼', title: '블록 모양 익히기',
            inventory: { hado: 2, aso: 1, geuraeseo: 2, aju: 1, neomu: 1 }, questions: TUTORIAL_QUESTIONS
        },
        {
            id: 'stage-1', type: 'practice', label: '스테이지 1', title: '하루의 장면',
            inventory: { hado: 2, aso: 1, geuraeseo: 2, jinjja: 1 }, questions: STAGE_1_QUESTIONS
        },
        {
            id: 'stage-2', type: 'practice', label: '스테이지 2', title: '행동과 결과',
            inventory: { hado: 2, aso: 1, geuraeseo: 2, maeu: 1 }, questions: STAGE_2_QUESTIONS
        },
        {
            id: 'stage-3', type: 'practice', label: '스테이지 3', title: '변화와 기억',
            inventory: { hado: 2, aso: 1, geuraeseo: 2, jeongmal: 1 }, questions: STAGE_3_QUESTIONS
        }
    ];

    STAGES.forEach((stage) => {
        stage.blocks = KIND_ORDER.flatMap((kind) => Array.from(
            { length: stage.inventory[kind] || 0 },
            (_, index) => ({ id: stage.id + '--' + kind + '-' + (index + 1), kind })
        ));
        stage.blockById = new Map(stage.blocks.map((block) => [block.id, block]));
        stage.questionById = new Map(stage.questions.map((question) => [question.id, question]));
    });
    const STAGE_BY_ID = new Map(STAGES.map((stage) => [stage.id, stage]));

    const blockBank = document.querySelector('#blockBank');
    const sentenceGrid = document.querySelector('#sentenceGrid');
    const progressDots = document.querySelector('#progressDots');
    const progressCount = document.querySelector('#progressCount');
    const statusMessage = document.querySelector('#statusMessage');
    const completionCard = document.querySelector('#completionCard');
    const saveStatus = document.querySelector('#saveStatus');
    const soundToggle = document.querySelector('#soundToggle');
    const undoButton = document.querySelector('#undoButton');
    const resetButton = document.querySelector('#resetButton');
    const completionReset = document.querySelector('#completionReset');
    const nextStageButton = document.querySelector('#nextStageButton');
    const effectsLayer = document.querySelector('#effectsLayer');
    const hero = document.querySelector('.hero');
    const heroDemo = document.querySelector('.hero-demo');
    const heroInstruction = document.querySelector('.hero-instruction');
    const stageEyebrow = document.querySelector('#stageEyebrow');
    const stageTitle = document.querySelector('#stageTitle');
    const stageNav = document.querySelector('#stageNav');
    const currentStageLabel = document.querySelector('#currentStageLabel');
    const completionKicker = completionCard.querySelector('.completion-kicker');
    const completionTitle = completionCard.querySelector('#completionTitle');
    const completionMessage = completionTitle.nextElementSibling;

    let state = readState();
    let selectedBlock = null;
    let activeDrag = null;
    let audioContext = null;
    let sessionVersion = 0;
    const looseElements = new Map();
    const movingIds = new Set();

    function emptyProgress() {
        return { completed: {}, loose: {}, order: [] };
    }

    function emptyState(sound = true) {
        return {
            version: 2,
            activeStageId: 'tutorial',
            unlockedThrough: 0,
            sound,
            stages: Object.fromEntries(STAGES.map((stage) => [stage.id, emptyProgress()]))
        };
    }

    function sanitizeStageProgress(stage, savedProgress) {
        const progress = emptyProgress();
        const source = savedProgress && typeof savedProgress === 'object' ? savedProgress : {};
        const used = new Set();
        const savedCompleted = source.completed && typeof source.completed === 'object' ? source.completed : {};

        for (const question of stage.questions) {
            const block = stage.blockById.get(savedCompleted[question.id]);
            if (block && question.answers.includes(block.kind) && !used.has(block.id)) {
                progress.completed[question.id] = block.id;
                used.add(block.id);
            }
        }

        if (source.loose && typeof source.loose === 'object') {
            for (const [blockId, position] of Object.entries(source.loose)) {
                const block = stage.blockById.get(blockId);
                const question = stage.questionById.get(position?.boardId);
                if (!block || !question || used.has(blockId)) continue;
                progress.loose[blockId] = {
                    boardId: question.id,
                    x: clampNumber(position.x, 0, 1, 0.06),
                    y: clampNumber(position.y, 0, 1, 0.55)
                };
                used.add(blockId);
            }
        }

        progress.order = Array.isArray(source.order)
            ? source.order.filter((id, index, array) => progress.completed[id] && array.indexOf(id) === index)
            : Object.keys(progress.completed);
        Object.keys(progress.completed).forEach((id) => {
            if (!progress.order.includes(id)) progress.order.push(id);
        });
        return progress;
    }

    function sanitizeState(saved) {
        const next = emptyState(saved?.sound !== false);
        for (const stage of STAGES) {
            next.stages[stage.id] = sanitizeStageProgress(stage, saved?.stages?.[stage.id]);
        }

        next.unlockedThrough = Math.floor(clampNumber(saved?.unlockedThrough, 0, STAGES.length - 1, 0));
        STAGES.slice(0, -1).forEach((stage, index) => {
            if (Object.keys(next.stages[stage.id].completed).length === stage.questions.length) {
                next.unlockedThrough = Math.max(next.unlockedThrough, index + 1);
            }
        });

        const requestedIndex = STAGES.findIndex((stage) => stage.id === saved?.activeStageId);
        next.activeStageId = requestedIndex >= 0 && requestedIndex <= next.unlockedThrough
            ? STAGES[requestedIndex].id
            : 'tutorial';
        return next;
    }

    function migrateLegacyState(saved) {
        if (!saved || saved.version !== 1 || typeof saved.completed !== 'object') return null;
        const next = emptyState(saved.sound !== false);
        const tutorial = STAGES[0];
        const progress = next.stages.tutorial;
        const used = new Set();
        const legacyBlockKind = {
            'hado-1': 'hado', 'hado-2': 'hado', 'aso-1': 'aso',
            'geuraeseo-1': 'geuraeseo', 'geuraeseo-2': 'geuraeseo',
            'aju-1': 'aju', 'neomu-1': 'neomu'
        };
        const mappedIds = new Map();

        const mapLegacyBlock = (legacyId) => {
            if (mappedIds.has(legacyId)) return mappedIds.get(legacyId);
            const kind = legacyBlockKind[legacyId];
            const block = tutorial.blocks.find((candidate) => candidate.kind === kind && !used.has(candidate.id));
            if (!block) return null;
            used.add(block.id);
            mappedIds.set(legacyId, block.id);
            return block;
        };

        for (const question of tutorial.questions) {
            const legacyId = saved.completed[question.id];
            const block = mapLegacyBlock(legacyId);
            if (block && question.answers.includes(block.kind)) {
                progress.completed[question.id] = block.id;
            }
        }

        if (saved.loose && typeof saved.loose === 'object') {
            for (const [legacyId, position] of Object.entries(saved.loose)) {
                const question = tutorial.questionById.get(position?.boardId);
                const block = mapLegacyBlock(legacyId);
                if (!question || !block || progress.completed[question.id] === block.id) continue;
                progress.loose[block.id] = {
                    boardId: question.id,
                    x: clampNumber(position.x, 0, 1, 0.06),
                    y: clampNumber(position.y, 0, 1, 0.55)
                };
            }
        }

        const legacyOrder = Array.isArray(saved.order) ? saved.order : Object.keys(progress.completed);
        progress.order = legacyOrder.filter((id, index, array) => progress.completed[id] && array.indexOf(id) === index);
        Object.keys(progress.completed).forEach((id) => {
            if (!progress.order.includes(id)) progress.order.push(id);
        });
        if (Object.keys(progress.completed).length === tutorial.questions.length) next.unlockedThrough = 1;
        return next;
    }

    function readState() {
        try {
            const rawV2 = localStorage.getItem(STORAGE_KEY);
            if (rawV2) {
                try {
                    const savedV2 = JSON.parse(rawV2);
                    if (savedV2?.version === 2) return sanitizeState(savedV2);
                } catch (_) { /* try the legacy save */ }
            }

            const rawV1 = localStorage.getItem(LEGACY_STORAGE_KEY);
            const migrated = rawV1 ? migrateLegacyState(JSON.parse(rawV1)) : null;
            if (migrated) {
                try { localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated)); } catch (_) { /* continue in memory */ }
                return migrated;
            }
        } catch (_) {
            return emptyState();
        }
        return emptyState();
    }

    function clampNumber(value, min, max, fallback) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    }

    function persistState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            saveStatus.dataset.state = 'saved';
            saveStatus.lastElementChild.textContent = '자동 저장됨';
        } catch (_) {
            saveStatus.dataset.state = 'unavailable';
            saveStatus.lastElementChild.textContent = '이 기기에서는 저장되지 않음';
        }
    }

    function activeStage() {
        return STAGE_BY_ID.get(state.activeStageId) || STAGES[0];
    }

    function currentProgress() {
        return state.stages[activeStage().id];
    }

    function occupiedIds() {
        const progress = currentProgress();
        const ids = new Set([...Object.values(progress.completed), ...Object.keys(progress.loose), ...movingIds]);
        if (activeDrag?.block) ids.add(activeDrag.block.id);
        return ids;
    }

    function availableBlocks(kind) {
        const occupied = occupiedIds();
        return activeStage().blocks.filter((block) => block.kind === kind && !occupied.has(block.id));
    }

    function allocateBlock(kind) {
        if (selectedBlock?.block.kind === kind && !occupiedIds().has(selectedBlock.block.id)) return selectedBlock.block;
        return availableBlocks(kind)[0] || null;
    }

    function hadoShapeMarkup(variant) {
        return `<svg class="hado-shape hado-shape--${variant}" viewBox="0 0 300 110" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M14 4H286Q296 4 296 14V106H185V43H95V106H4V14Q4 4 14 4Z"></path></svg>`;
    }

    function blockContent(kind, includeCount = 0) {
        const count = includeCount > 1 ? `<span class="block-count" aria-hidden="true">×${includeCount}</span>` : '';
        if (kind === 'hado') {
            return `${count}${hadoShapeMarkup('solid')}<span class="hado-part hado-part--start">하도</span><span class="hado-cavity" aria-hidden="true"></span><span class="hado-part hado-part--end">-아서/어서</span>`;
        }
        return `${count}<span>${BLOCK_META[kind].label}</span>`;
    }

    function makeBankButton(kind) {
        const available = availableBlocks(kind);
        const count = available.length;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `expression-block ${BLOCK_META[kind].className}`;
        button.dataset.blockKind = kind;
        button.innerHTML = blockContent(kind, count);
        button.disabled = count === 0;
        button.setAttribute('aria-label', `${BLOCK_META[kind].label} 블록${count > 1 ? ` ${count}개` : ''}`);
        button.setAttribute('aria-pressed', String(selectedBlock?.block.kind === kind));
        if (selectedBlock?.block.kind === kind) button.classList.add('is-selected');
        if (isCurrentStageComplete() && count) {
            button.classList.add('is-alternative');
            button.setAttribute('aria-label', `${BLOCK_META[kind].label}, 사용할 수 있는 다른 답`);
        }
        bindBankButton(button, kind);
        return button;
    }

    function renderBank() {
        const kinds = KIND_ORDER.filter((kind) => activeStage().inventory[kind]);
        blockBank.replaceChildren(...kinds.map(makeBankButton));
    }

    function bindBankButton(button, kind) {
        button.addEventListener('pointerdown', (event) => {
            const block = allocateBlock(kind);
            if (block) beginDrag(event, button, block, false);
        });
        button.addEventListener('click', () => {
            if (button.dataset.ignoreClick === 'true') return;
            const block = allocateBlock(kind);
            if (block) selectBlock(block, button);
        });
    }

    function makePieceElement(block) {
        const element = document.createElement('button');
        element.type = 'button';
        element.className = `expression-block ${BLOCK_META[block.kind].className}`;
        element.dataset.blockId = block.id;
        element.dataset.blockKind = block.kind;
        element.innerHTML = blockContent(block.kind);
        element.setAttribute('aria-label', `${BLOCK_META[block.kind].label} 이동 블록`);
        return element;
    }

    function selectBlock(block, source = null) {
        const fromLoose = Boolean(source?.classList.contains('loose-piece'));
        selectedBlock = { block, source: fromLoose ? source : null, fromLoose };
        blockBank.querySelectorAll('[data-block-kind]').forEach((button) => {
            const selected = button.dataset.blockKind === block.kind;
            button.classList.toggle('is-selected', selected);
            button.setAttribute('aria-pressed', String(selected));
        });
        setStatus('이 블록을 골랐어요. 빈칸을 누르거나 드래그해서 옮기세요.', '');
    }

    function completedSentenceMarkup(question, block) {
        if (!question.full || !block) return '';
        const family = BLOCK_META[block.kind].family;
        return `${question.full.before}<span class="completed-expression completed-expression--${family} completed-expression--${block.kind}">${question.full.target}</span>${question.full.after}`;
    }

    function questionMarkup(question, index) {
        const stage = activeStage();
        const progress = currentProgress();
        const block = stage.blockById.get(progress.completed[question.id]);
        const complete = Boolean(block);
        const visualState = complete ? 'locked' : 'open';
        const boardHead = stage.type === 'practice'
            ? `<span class="board-number" aria-hidden="true">${index + 1}</span>${complete ? `<h3 class="board-complete-sentence" data-copy-layer="PRIMARY">${completedSentenceMarkup(question, block)}</h3>` : ''}`
            : `<span class="board-number" aria-hidden="true">${index + 1}</span><h3 class="board-title" data-copy-layer="PRIMARY">${question.title}</h3>`;
        return `
            <article class="sentence-board ${complete ? 'is-complete' : ''}"
                data-board-id="${question.id}"
                ${stage.type === 'practice' ? `aria-label="${index + 1}번 문장"` : ''}
                data-semantic-visual
                data-nontext-visual
                data-sv-component="FORM_ASSEMBLER"
                data-meaning-ref="${question.meaning}"
                data-interaction-ref="interaction.place-expression-block"
                data-visual-state="${visualState}"
                data-state-change-channels="position outline connection visibility"
                data-copy-layer="PRIMARY">
                <div class="board-head">
                    ${boardHead}
                </div>
                <div class="sentence-stage" data-board-stage="${question.id}">
                    ${sentenceMarkup(question, block)}
                </div>
                <div class="structure-trace" data-copy-layer="PRIMARY">${question.trace.map((item) => `<span>${item}</span>`).join('')}</div>
            </article>`;
    }

    function socketAttributes(question, complete) {
        const accessibleName = complete ? '' : `aria-label="${question.title} 빈칸"`;
        return `data-socket data-board-id="${question.id}" data-nontext-visual data-copy-layer="PRIMARY" ${accessibleName} ${complete ? 'disabled' : ''}`;
    }

    function sentenceMarkup(question, block) {
        const complete = Boolean(block);
        const locked = complete ? 'is-locked' : '';
        if (question.kind === 'wrap') {
            const inside = complete
                ? `${hadoShapeMarkup('locked')}<span class="locked-left">하도</span><span class="locked-stem">${question.stem}</span><span class="locked-tail">${question.tail}</span>`
                : `${hadoShapeMarkup('guide')}<span class="locked-stem">${question.stem}</span>`;
            return `<div class="sentence-line"><span data-copy-layer="PRIMARY">${question.prefix}</span><button type="button" class="socket socket-hado ${locked}" ${socketAttributes(question, complete)}>${inside}</button><span data-copy-layer="PRIMARY">${question.suffix}</span></div>`;
        }
        if (question.kind === 'inline') {
            const tone = complete ? `block-tone-${block.kind}` : '';
            return `<div class="sentence-line"><span data-copy-layer="PRIMARY">${question.prefix}</span><button type="button" class="socket socket-inline ${locked} ${tone}" ${socketAttributes(question, complete)}>${complete ? BLOCK_META[block.kind].label : '표현 블록'}</button><span data-copy-layer="PRIMARY">${question.suffix}</span></div>`;
        }
        if (question.kind === 'pair') {
            return `<div class="pair-line ${complete ? 'is-linked' : ''}"><div class="sentence-fragment" data-copy-layer="PRIMARY">${question.left}</div><button type="button" class="socket socket-bridge ${locked}" ${socketAttributes(question, complete)}>${complete ? '그래서' : '표현 블록'}</button><div class="sentence-fragment" data-copy-layer="PRIMARY">${question.right}</div></div>`;
        }
        return `<div class="clause-line ${complete ? 'is-linked' : ''}"><div class="sentence-fragment clause-left" data-copy-layer="PRIMARY"><span>${question.left}</span><button type="button" class="socket socket-tail ${locked}" ${socketAttributes(question, complete)}>${complete ? '서' : '-아서/어서'}</button></div><div class="sentence-fragment" data-copy-layer="PRIMARY">${question.right}</div></div>`;
    }

    function renderBoards() {
        sentenceGrid.innerHTML = activeStage().questions.map(questionMarkup).join('');
        bindSockets(sentenceGrid);
    }

    function updateBoard(question) {
        const stage = activeStage();
        const current = sentenceGrid.querySelector(`[data-board-id="${question.id}"]`);
        if (!current) return;
        const template = document.createElement('template');
        template.innerHTML = questionMarkup(question, stage.questions.indexOf(question)).trim();
        const replacement = template.content.firstElementChild;
        current.replaceWith(replacement);
        bindSockets(replacement);
        window.requestAnimationFrame(restoreLoosePieces);
    }

    function bindSockets(root) {
        root.querySelectorAll?.('[data-socket]:not(:disabled)').forEach((socket) => {
            socket.addEventListener('click', () => {
                if (!selectedBlock) {
                    setStatus('먼저 블록을 고른 뒤 빈칸을 누르세요.', '');
                    return;
                }
                const { block, source: selectedSource, fromLoose } = selectedBlock;
                selectedBlock = null;
                const source = fromLoose ? selectedSource : blockBank.querySelector(`[data-block-kind="${block.kind}"]`);
                if (!source) return;
                const piece = createFixedPiece(source, block, fromLoose);
                attemptPlacement(block, piece, socket, { vx: 0, vy: -2.8 });
            });
        });
    }

    function renderStageChrome() {
        const stage = activeStage();
        document.body.dataset.stageType = stage.type;
        document.body.dataset.stageId = stage.id;
        currentStageLabel.textContent = stage.label;
        stageEyebrow.textContent = stage.type === 'tutorial'
            ? '튜토리얼 · 블록 모양 익히기'
            : stage.label + ' · ' + stage.title;
        stageTitle.textContent = stage.type === 'tutorial'
            ? '표현 블록 맞추기'
            : stage.label + ' · ' + stage.title;
        heroInstruction.textContent = stage.type === 'tutorial'
            ? '표현 블록을 잡아 빈칸 위에 놓아 보세요. 알맞은 자리에 놓으면 철컥 들어가고, 맞지 않으면 통통 튕겨 나와요.'
            : '표현 블록을 잡아 알맞은 문장에 놓아 보세요.';
        heroDemo.hidden = stage.type !== 'tutorial';
        hero.classList.toggle('hero--practice', stage.type === 'practice');
    }

    function renderStageNav() {
        stageNav.replaceChildren(...STAGES.map((stage, index) => {
            const progress = state.stages[stage.id];
            const count = Object.keys(progress.completed).length;
            const complete = count === stage.questions.length;
            const locked = index > state.unlockedThrough;
            const current = stage.id === state.activeStageId;
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'stage-step';
            button.dataset.stageId = stage.id;
            button.disabled = locked;
            button.classList.toggle('is-current', current);
            button.classList.toggle('is-complete', complete);
            if (current) button.setAttribute('aria-current', 'step');
            const stateLabel = locked ? '잠김' : complete ? '완료' : count + ' / ' + stage.questions.length;
            button.setAttribute('aria-label', stage.label + ' ' + stage.title + ', ' + stateLabel);
            button.innerHTML = `
                <span class="stage-step-mark" aria-hidden="true">${complete ? '✓' : index === 0 ? 'T' : index}</span>
                <span class="stage-step-copy"><strong>${stage.label}</strong><small>${stage.title}</small></span>
                <span class="stage-step-state" aria-hidden="true">${stateLabel}</span>`;
            button.addEventListener('click', () => goToStage(stage.id));
            return button;
        }));
        window.requestAnimationFrame(() => {
            const current = stageNav.querySelector('.is-current');
            if (!current) return;
            stageNav.scrollLeft = Math.max(0, current.offsetLeft - (stageNav.clientWidth - current.offsetWidth) / 2);
        });
    }

    function renderCompletion(stage, count) {
        const complete = count === stage.questions.length;
        completionCard.hidden = !complete;
        if (!complete) return;

        const stageIndex = STAGES.indexOf(stage);
        const isLast = stageIndex === STAGES.length - 1;
        if (stage.type === 'tutorial') {
            completionKicker.textContent = 'TUTORIAL COMPLETE';
            completionTitle.textContent = '모양을 모두 익혔어요.';
            completionMessage.textContent = '이제 다양한 문장으로 연습해요.';
            nextStageButton.textContent = '본 연습 시작';
        } else if (isLast) {
            completionKicker.textContent = 'ALL STAGES CONNECTED';
            completionTitle.textContent = '모든 문장을 연결했어요.';
            completionMessage.textContent = '세 스테이지의 문장을 모두 완성했어요.';
        } else {
            completionKicker.textContent = 'STAGE ' + stageIndex + ' COMPLETE';
            completionTitle.textContent = stage.label + ' 완료';
            completionMessage.textContent = '다음 문장 세트가 준비됐어요.';
            nextStageButton.textContent = '다음 스테이지';
        }
        nextStageButton.hidden = isLast;
        nextStageButton.dataset.nextStageId = isLast ? '' : STAGES[stageIndex + 1].id;
        completionReset.textContent = stage.type === 'tutorial' ? '튜토리얼 다시 배치' : '이 스테이지 다시 배치';
    }

    function renderProgress() {
        const stage = activeStage();
        const progress = currentProgress();
        const count = Object.keys(progress.completed).length;
        progressCount.textContent = `${count} / ${stage.questions.length}`;
        progressDots.innerHTML = stage.questions.map((question) => `<span class="progress-dot ${progress.completed[question.id] ? 'is-complete' : ''}"></span>`).join('');
        undoButton.disabled = progress.order.length === 0;
        renderCompletion(stage, count);
        renderStageNav();
    }

    function renderAll() {
        renderStageChrome();
        renderBoards();
        renderBank();
        renderProgress();
        updateSoundButton();
        window.requestAnimationFrame(restoreLoosePieces);
    }

    function beginDrag(event, source, block, fromLoose) {
        if (event.button !== undefined && event.button !== 0) return;
        if (activeDrag) return;
        event.preventDefault();
        ensureAudio();
        if (selectedBlock?.block.id === block.id) selectedBlock = null;
        const rect = source.getBoundingClientRect();
        try { source.setPointerCapture(event.pointerId); } catch (_) { /* unsupported */ }
        activeDrag = {
            block, source, fromLoose, pointerId: event.pointerId,
            startX: event.clientX, startY: event.clientY,
            lastX: event.clientX, lastY: event.clientY, lastTime: performance.now(),
            vx: 0, vy: 0,
            offsetX: event.clientX - rect.left, offsetY: event.clientY - rect.top,
            lifted: false, piece: null, socket: null
        };
        window.addEventListener('pointermove', moveDrag);
        window.addEventListener('pointerup', endDrag);
        window.addEventListener('pointercancel', cancelDrag);
    }

    function removeDragListeners() {
        window.removeEventListener('pointermove', moveDrag);
        window.removeEventListener('pointerup', endDrag);
        window.removeEventListener('pointercancel', cancelDrag);
    }

    function moveDrag(event) {
        const drag = activeDrag;
        if (!drag || event.pointerId !== drag.pointerId) return;
        const now = performance.now();
        const elapsed = Math.max(8, now - drag.lastTime);
        drag.vx = (event.clientX - drag.lastX) / elapsed * 16;
        drag.vy = (event.clientY - drag.lastY) / elapsed * 16;
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.lastTime = now;

        const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
        if (!drag.lifted && distance > 7) liftDrag(drag);
        if (!drag.lifted) return;

        positionFixedPiece(drag.piece, event.clientX - drag.offsetX, event.clientY - drag.offsetY, 'rotate(-2deg) scale(1.035)');
        const socket = findSocket(event.clientX, event.clientY);
        if (drag.socket !== socket) {
            drag.socket?.classList.remove('is-magnetized');
            socket?.classList.add('is-magnetized');
            drag.socket = socket;
        }
    }

    function liftDrag(drag) {
        drag.lifted = true;
        selectedBlock = null;
        drag.piece = createFixedPiece(drag.source, drag.block, drag.fromLoose);
        renderBank();
    }

    function endDrag(event) {
        const drag = activeDrag;
        if (!drag || event.pointerId !== drag.pointerId) return;
        removeDragListeners();
        activeDrag = null;
        drag.socket?.classList.remove('is-magnetized');
        drag.source.dataset.ignoreClick = 'true';
        window.setTimeout(() => { delete drag.source.dataset.ignoreClick; }, 0);
        try { drag.source.releasePointerCapture(drag.pointerId); } catch (_) { /* unsupported */ }

        if (!drag.lifted) {
            selectBlock(drag.block, drag.source);
            return;
        }
        attemptPlacement(drag.block, drag.piece, findSocket(event.clientX, event.clientY), { vx: drag.vx, vy: drag.vy, x: event.clientX, y: event.clientY });
    }

    function cancelDrag(event) {
        const drag = activeDrag;
        if (!drag || (event && event.pointerId !== drag.pointerId)) return;
        removeDragListeners();
        activeDrag = null;
        drag?.socket?.classList.remove('is-magnetized');
        if (drag?.lifted) bouncePiece(drag.block, drag.piece, null, { vx: 4.5, vy: -3.5, x: drag.lastX, y: drag.lastY }, '빈칸 위에서 놓아 보세요.');
    }

    function createFixedPiece(source, block, fromLoose = false) {
        movingIds.add(block.id);
        if (fromLoose || source.classList.contains('loose-piece')) {
            const rect = source.getBoundingClientRect();
            source.classList.remove('loose-piece');
            source.classList.add('drag-piece');
            source.style.position = 'fixed';
            source.style.width = `${rect.width}px`;
            source.style.height = `${rect.height}px`;
            document.body.append(source);
            positionFixedPiece(source, rect.left, rect.top);
            delete currentProgress().loose[block.id];
            looseElements.delete(block.id);
            persistState();
            return source;
        }

        const rect = source.getBoundingClientRect();
        const piece = makePieceElement(block);
        piece.classList.add('drag-piece');
        piece.disabled = true;
        piece.style.width = `${rect.width}px`;
        piece.style.height = `${rect.height}px`;
        document.body.append(piece);
        positionFixedPiece(piece, rect.left, rect.top);
        return piece;
    }

    function positionFixedPiece(piece, left, top, transform = 'rotate(0deg)') {
        const width = piece.offsetWidth || 120;
        const height = piece.offsetHeight || 50;
        piece.style.left = `${Math.max(6, Math.min(window.innerWidth - width - 6, left))}px`;
        piece.style.top = `${Math.max(6, Math.min(window.innerHeight - height - 6, top))}px`;
        piece.style.transform = transform;
    }

    function findSocket(x, y) {
        return document.elementsFromPoint(x, y)
            .map((element) => element.closest?.('[data-socket]'))
            .find((socket) => socket && !socket.disabled) || null;
    }

    function attemptPlacement(block, piece, socket, motion) {
        const stage = activeStage();
        const progress = currentProgress();
        const question = socket ? stage.questionById.get(socket.dataset.boardId) : null;
        if (!question || progress.completed[question.id] || !question.answers.includes(block.kind)) {
            const message = question ? wrongMessage(question) : '빈칸 위에서 놓아 보세요. 블록이 튕겨 나왔어요.';
            if (socket) rejectSocket(socket);
            bouncePiece(block, piece, socket, motion, message);
            return;
        }
        snapPiece(block, piece, socket, question);
    }

    function snapPiece(block, piece, socket, question) {
        const operationVersion = sessionVersion;
        const stage = activeStage();
        const stageId = stage.id;
        const socketRect = socket.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        const endLeft = socketRect.left + (socketRect.width - pieceRect.width) / 2;
        const endTop = socketRect.top + (socketRect.height - pieceRect.height) / 2;
        const scale = Math.min(1, Math.max(0.62, socketRect.width / Math.max(1, pieceRect.width)));
        socket.classList.add('is-latching');
        const duration = REDUCED_MOTION.matches ? 1 : 185;
        const animation = piece.animate([
            { left: `${pieceRect.left}px`, top: `${pieceRect.top}px`, transform: 'rotate(-2deg) scale(1.02)', offset: 0 },
            { left: `${endLeft}px`, top: `${endTop}px`, transform: `rotate(0deg) scale(${scale * 0.92})`, offset: 0.72 },
            { left: `${endLeft}px`, top: `${endTop}px`, transform: `rotate(0deg) scale(${scale})`, offset: 1 }
        ], { duration, easing: 'cubic-bezier(.18,.8,.3,1.28)', fill: 'forwards' });

        animation.onfinish = () => {
            if (operationVersion !== sessionVersion || state.activeStageId !== stageId) {
                piece.remove();
                movingIds.delete(block.id);
                return;
            }
            piece.remove();
            movingIds.delete(block.id);
            const progress = state.stages[stageId];
            delete progress.loose[block.id];
            looseElements.delete(block.id);
            progress.completed[question.id] = block.id;
            progress.order = progress.order.filter((id) => id !== question.id);
            progress.order.push(question.id);
            if (Object.keys(progress.completed).length === stage.questions.length) {
                const stageIndex = STAGES.indexOf(stage);
                state.unlockedThrough = Math.max(state.unlockedThrough, Math.min(STAGES.length - 1, stageIndex + 1));
            }
            persistState();
            updateBoard(question);
            renderBank();
            renderProgress();
            createSnapEffects(socketRect);
            playClack();
            navigator.vibrate?.(22);
            setStatus(successMessage(question, block), 'success');
        };
    }

    function rejectSocket(socket) {
        socket.classList.remove('is-rejecting');
        void socket.offsetWidth;
        socket.classList.add('is-rejecting');
        window.setTimeout(() => socket.classList.remove('is-rejecting'), 430);
    }

    function bouncePiece(block, piece, socket, motion = {}, message) {
        const operationVersion = sessionVersion;
        const activeStageId = state.activeStageId;
        playBoing();
        setStatus(message, 'wrong');
        selectedBlock = null;
        const stage = socket?.closest('.sentence-stage')
            || document.elementsFromPoint(motion.x || 0, motion.y || 0).map((element) => element.closest?.('.sentence-stage')).find(Boolean)
            || document.querySelector('.sentence-board:not(.is-complete) .sentence-stage')
            || document.querySelector('.sentence-stage');
        if (!stage) {
            piece.remove();
            movingIds.delete(block.id);
            renderBank();
            return;
        }

        const boardId = stage.dataset.boardStage;
        const stageRect = stage.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        stage.append(piece);
        piece.classList.add('is-bouncing');
        piece.style.position = 'absolute';
        piece.style.width = `${Math.min(pieceRect.width, Math.max(84, stageRect.width * 0.64))}px`;
        piece.style.height = `${pieceRect.height}px`;
        piece.style.pointerEvents = 'none';
        piece.style.filter = '';

        const width = piece.offsetWidth;
        const height = piece.offsetHeight;
        const maxX = Math.max(4, stage.clientWidth - width - 4);
        const maxY = Math.max(4, stage.clientHeight - height - 4);
        let x = Math.min(maxX, Math.max(4, pieceRect.left - stageRect.left));
        let y = Math.min(maxY, Math.max(4, pieceRect.top - stageRect.top));
        const socketRect = socket?.getBoundingClientRect();
        const away = socketRect ? Math.sign((pieceRect.left + pieceRect.width / 2) - (socketRect.left + socketRect.width / 2)) || 1 : (Math.random() > 0.5 ? 1 : -1);
        let vx = clampNumber(motion.vx, -10, 10, 4.8 * away);
        let vy = clampNumber(motion.vy, -9, 8, -4.8);
        if (Math.abs(vx) < 3.8) vx = 4.8 * away;
        if (vy > -2) vy = -4.6;
        let rotation = -4;
        let rotationVelocity = vx * 0.8;
        let collisions = 0;
        const start = performance.now();

        if (REDUCED_MOTION.matches) {
            finishBounce(block, piece, stage, boardId, Math.min(maxX, x + 8 * away), Math.min(maxY, Math.max(4, y)), 0, activeStageId);
            renderBank();
            return;
        }

        const step = (now) => {
            if (operationVersion !== sessionVersion || state.activeStageId !== activeStageId) {
                piece.remove();
                movingIds.delete(block.id);
                return;
            }
            const elapsed = now - start;
            vy += 0.28;
            x += vx;
            y += vy;
            vx *= 0.992;
            rotation += rotationVelocity;
            rotationVelocity *= 0.96;

            if (x <= 0 || x >= maxX) {
                x = Math.min(maxX, Math.max(0, x));
                vx *= -0.68;
                rotationVelocity *= -0.72;
                collisions += 1;
            }
            if (y <= 0 || y >= maxY) {
                y = Math.min(maxY, Math.max(0, y));
                vy *= -0.62;
                vx *= 0.88;
                rotationVelocity *= 0.78;
                collisions += 1;
            }

            piece.style.left = `${x}px`;
            piece.style.top = `${y}px`;
            piece.style.transform = `rotate(${rotation}deg)`;

            const speed = Math.abs(vx) + Math.abs(vy) + Math.abs(rotationVelocity) * 0.1;
            if ((elapsed > 780 && collisions >= 2 && speed < 2.6) || elapsed > 1550) {
                finishBounce(block, piece, stage, boardId, x, y, rotation, activeStageId);
                return;
            }
            requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        renderBank();
    }

    function finishBounce(block, piece, stage, boardId, x, y, rotation, activeStageId) {
        if (state.activeStageId !== activeStageId) {
            piece.remove();
            movingIds.delete(block.id);
            return;
        }
        piece.classList.remove('is-bouncing');
        piece.classList.add('loose-piece');
        piece.disabled = false;
        piece.style.pointerEvents = 'auto';
        piece.style.left = `${Math.max(0, x)}px`;
        piece.style.top = `${Math.max(0, y)}px`;
        piece.style.transform = `rotate(${Math.max(-5, Math.min(5, rotation % 12))}deg)`;
        const maxX = Math.max(1, stage.clientWidth - piece.offsetWidth);
        const maxY = Math.max(1, stage.clientHeight - piece.offsetHeight);
        state.stages[activeStageId].loose[block.id] = {
            boardId,
            x: Math.max(0, x) / maxX,
            y: Math.max(0, y) / maxY
        };
        movingIds.delete(block.id);
        looseElements.set(block.id, piece);
        bindLoosePiece(piece, block);
        persistState();
    }

    function bindLoosePiece(piece, block) {
        if (piece.dataset.bound === 'true') return;
        piece.dataset.bound = 'true';
        piece.addEventListener('pointerdown', (event) => beginDrag(event, piece, block, true));
        piece.addEventListener('click', () => {
            if (piece.dataset.ignoreClick === 'true') return;
            selectBlock(block, piece);
        });
    }

    function restoreLoosePieces() {
        looseElements.forEach((element) => element.remove());
        looseElements.clear();
        const stageConfig = activeStage();
        const progress = currentProgress();
        for (const [blockId, position] of Object.entries(progress.loose)) {
            const block = stageConfig.blockById.get(blockId);
            const stage = document.querySelector(`[data-board-stage="${position.boardId}"]`);
            if (!block || !stage) continue;
            const piece = makePieceElement(block);
            piece.classList.add('drag-piece', 'loose-piece');
            piece.style.position = 'absolute';
            const targetWidth = block.kind === 'hado'
                ? Math.min(Math.max(190, stage.clientWidth * 0.68), 250, Math.max(120, stage.clientWidth - 12))
                : Math.min(Math.max(90, stage.clientWidth * 0.42), 145);
            piece.style.width = `${targetWidth}px`;
            stage.append(piece);
            const maxX = Math.max(0, stage.clientWidth - piece.offsetWidth);
            const maxY = Math.max(0, stage.clientHeight - piece.offsetHeight);
            piece.style.left = `${position.x * maxX}px`;
            piece.style.top = `${position.y * maxY}px`;
            piece.style.transform = 'rotate(0deg)';
            looseElements.set(block.id, piece);
            bindLoosePiece(piece, block);
        }
    }

    function syncLoosePieceBounds() {
        const progress = currentProgress();
        for (const [blockId, piece] of looseElements) {
            const position = progress.loose[blockId];
            const stage = piece.closest('.sentence-stage');
            if (!position || !stage) continue;
            const maxX = Math.max(0, stage.clientWidth - piece.offsetWidth);
            const maxY = Math.max(0, stage.clientHeight - piece.offsetHeight);
            piece.style.left = `${position.x * maxX}px`;
            piece.style.top = `${position.y * maxY}px`;
        }
    }

    function successMessage(question, block) {
        if (typeof question.success === 'function') return question.success(block);
        if (question.success) return question.success;
        const family = BLOCK_META[block.kind].family;
        if (family === 'hado') return '맞아요. 하도 블록이 앞뒤에 붙어 결과까지 이어 줘요.';
        if (family === 'degree') return '맞아요. ‘' + BLOCK_META[block.kind].label + '’는 단독 블록으로 들어가요.';
        if (family === 'geuraeseo') return '맞아요. 끝난 문장 두 개를 그래서가 이어 줘요.';
        return '맞아요. -아서/어서가 앞 절을 뒤 결과에 이어 줘요.';
    }

    function wrongMessage(question) {
        if (question.wrong) return question.wrong;
        if (question.kind === 'wrap') return '이 빈칸은 앞과 뒤를 함께 감싸는 자리예요. ㄷ 모양 블록을 찾아 보세요.';
        if (question.kind === 'inline') return '이 빈칸에는 혼자 들어갈 수 있는 정도 부사 블록이 맞아요.';
        if (question.kind === 'pair') return '앞과 뒤가 각각 끝난 문장이에요. 문장 둘 사이에 맞는 블록을 찾아 보세요.';
        return '앞부분은 끝난 문장이 아니라 뒤 결과로 이어져요. 왼쪽에 부착부가 있는 블록을 골라 보세요.';
    }

    function setStatus(message, tone = '') {
        statusMessage.textContent = message;
        statusMessage.dataset.tone = tone;
    }

    function isCurrentStageComplete() {
        return Object.keys(currentProgress().completed).length === activeStage().questions.length;
    }

    function undoLast() {
        const stage = activeStage();
        const progress = currentProgress();
        const questionId = progress.order.pop();
        const question = stage.questionById.get(questionId);
        if (!question) return;
        delete progress.completed[questionId];
        persistState();
        updateBoard(question);
        renderBank();
        renderProgress();
        setStatus('마지막으로 결합한 블록을 되돌렸어요.', '');
    }

    function clearTransientInteraction() {
        sessionVersion += 1;
        removeDragListeners();
        activeDrag?.piece?.remove();
        activeDrag = null;
        document.querySelectorAll('.drag-piece').forEach((piece) => piece.remove());
        movingIds.clear();
        looseElements.forEach((piece) => piece.remove());
        looseElements.clear();
        selectedBlock = null;
    }

    function resetAll() {
        clearTransientInteraction();
        state.stages[state.activeStageId] = emptyProgress();
        persistState();
        renderAll();
        setStatus('블록을 잡아 문장판으로 옮기세요.', '');
        document.querySelector('#workbench').scrollIntoView({ behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth', block: 'start' });
    }

    function goToStage(stageId) {
        const stageIndex = STAGES.findIndex((stage) => stage.id === stageId);
        if (stageIndex < 0 || stageIndex > state.unlockedThrough) return;
        clearTransientInteraction();
        state.activeStageId = stageId;
        persistState();
        renderAll();
        setStatus('블록을 잡아 문장판으로 옮기세요.', '');
        stageTitle.focus({ preventScroll: true });
        document.querySelector('#workbench').scrollIntoView({
            behavior: REDUCED_MOTION.matches ? 'auto' : 'smooth',
            block: 'start'
        });
    }

    function createSnapEffects(rect) {
        if (REDUCED_MOTION.matches) return;
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const ring = document.createElement('span');
        ring.className = 'snap-ring';
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
        effectsLayer.append(ring);
        ring.addEventListener('animationend', () => ring.remove(), { once: true });

        for (let index = 0; index < 8; index += 1) {
            const spark = document.createElement('span');
            const angle = Math.PI * 2 * index / 8;
            spark.className = 'spark';
            spark.style.left = `${x}px`;
            spark.style.top = `${y}px`;
            spark.style.setProperty('--dx', `${Math.cos(angle) * (30 + index * 2)}px`);
            spark.style.setProperty('--dy', `${Math.sin(angle) * (30 + index * 2)}px`);
            effectsLayer.append(spark);
            spark.addEventListener('animationend', () => spark.remove(), { once: true });
        }
    }

    function ensureAudio() {
        if (!state.sound) return null;
        try {
            audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
            if (audioContext.state === 'suspended') audioContext.resume();
            return audioContext;
        } catch (_) {
            return null;
        }
    }

    function playClack() {
        const context = ensureAudio();
        if (!context) return;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(190, now);
        oscillator.frequency.exponentialRampToValueAtTime(65, now + 0.055);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.07);
    }

    function playBoing() {
        const context = ensureAudio();
        if (!context) return;
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(135, now);
        oscillator.frequency.exponentialRampToValueAtTime(260, now + 0.075);
        oscillator.frequency.exponentialRampToValueAtTime(105, now + 0.18);
        gain.gain.setValueAtTime(0.045, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(now);
        oscillator.stop(now + 0.21);
    }

    function updateSoundButton() {
        soundToggle.setAttribute('aria-pressed', String(state.sound));
        soundToggle.setAttribute('aria-label', state.sound ? '소리 켜짐' : '소리 꺼짐');
        soundToggle.querySelector('.sound-icon').textContent = state.sound ? '♪' : '×';
        soundToggle.lastElementChild.textContent = state.sound ? '소리 켜짐' : '소리 꺼짐';
    }

    soundToggle.addEventListener('click', () => {
        state.sound = !state.sound;
        persistState();
        updateSoundButton();
        if (state.sound) {
            ensureAudio();
            playClack();
        }
    });
    undoButton.addEventListener('click', undoLast);
    resetButton.addEventListener('click', resetAll);
    completionReset.addEventListener('click', resetAll);
    nextStageButton.addEventListener('click', () => {
        const nextStageId = nextStageButton.dataset.nextStageId;
        if (nextStageId && isCurrentStageComplete()) goToStage(nextStageId);
    });
    window.addEventListener('resize', () => window.requestAnimationFrame(syncLoosePieceBounds));

    renderAll();
})();
