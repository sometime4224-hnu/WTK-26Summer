const { test, expect } = require('@playwright/test');

const storageKey = 'c14-grammar1-block-studio-v2';
const legacyStorageKey = 'c14-grammar1-block-studio-v1';

const bankBlock = (page, kind) => page.locator(`#blockBank [data-block-kind="${kind}"]`);
const board = (page, id) => page.locator(`.sentence-board[data-board-id="${id}"]`);
const socket = (page, id) => board(page, id).locator('[data-socket]');
const stageButton = (page, id) => page.locator(`#stageNav .stage-step[data-stage-id="${id}"]`);

const stageAnswers = {
  tutorial: [
    ['film', 'hado'],
    ['exhibition', 'aju'],
    ['tired-sentences', 'geuraeseo'],
    ['rain-clause', 'aso'],
    ['baby', 'hado'],
    ['boat-sentences', 'geuraeseo']
  ],
  'stage-1': [
    ['s1-corridor', 'hado'],
    ['s1-food', 'jinjja'],
    ['s1-cold-sentences', 'geuraeseo'],
    ['s1-wind-clause', 'aso'],
    ['s1-movie', 'hado'],
    ['s1-bus-sentences', 'geuraeseo']
  ],
  'stage-2': [
    ['s2-reader', 'hado'],
    ['s2-pollution', 'maeu'],
    ['s2-ramen-sentences', 'geuraeseo'],
    ['s2-snow-clause', 'aso'],
    ['s2-friends', 'hado'],
    ['s2-explanation-sentences', 'geuraeseo']
  ],
  'stage-3': [
    ['s3-cheonggyecheon', 'hado'],
    ['s3-memory', 'jeongmal'],
    ['s3-screen-sentences', 'geuraeseo'],
    ['s3-photo-clause', 'aso'],
    ['s3-fun', 'hado'],
    ['s3-friend-sentences', 'geuraeseo']
  ]
};

async function dragTo(page, source, destination) {
  await source.scrollIntoViewIfNeeded();
  await destination.scrollIntoViewIfNeeded();
  const from = await source.boundingBox();
  const to = await destination.boundingBox();
  if (!from || !to) throw new Error('드래그할 블록 또는 빈칸을 찾을 수 없습니다.');

  await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
  await page.mouse.down();
  await page.mouse.move(from.x + from.width / 2 + 14, from.y + from.height / 2 + 9, { steps: 2 });
  await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 12 });
  await page.mouse.up();
}

async function placeByKeyboard(page, questionId, kind) {
  const block = bankBlock(page, kind);
  await expect(block).toBeEnabled();
  await block.press('Enter');
  await expect(block).toHaveAttribute('aria-pressed', 'true');
  await socket(page, questionId).press('Enter');
  await expect(board(page, questionId)).toHaveClass(/is-complete/);
}

async function completeStage(page, stageId) {
  for (const [questionId, kind] of stageAnswers[stageId]) {
    await placeByKeyboard(page, questionId, kind);
  }
  await expect(page.locator('#progressCount')).toHaveText('6 / 6');
  await expect(page.locator('#completionCard')).toBeVisible();
}

async function seedStage(page, activeStageId, unlockedThrough = 0) {
  const state = {
    version: 2,
    activeStageId,
    unlockedThrough,
    sound: false,
    stages: Object.fromEntries(
      ['tutorial', 'stage-1', 'stage-2', 'stage-3'].map((id) => [
        id,
        { completed: {}, loose: {}, order: [] }
      ])
    )
  };
  await page.evaluate(({ key, value }) => {
    localStorage.setItem(key, JSON.stringify(value));
  }, { key: storageKey, value: state });
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/c14/grammar1-block-studio.html', { waitUntil: 'domcontentloaded' });
  await page.evaluate(({ current, legacy }) => {
    localStorage.removeItem(current);
    localStorage.removeItem(legacy);
  }, { current: storageKey, legacy: legacyStorageKey });
  await page.reload({ waitUntil: 'domcontentloaded' });
});

test('처음에는 튜토리얼만 열리고 세 본 스테이지는 잠겨 있다', async ({ page }) => {
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(page.locator('body')).toHaveAttribute('data-stage-type', 'tutorial');
  await expect(page.locator('#stageTitle')).toHaveText('표현 블록 맞추기');
  await expect(page.locator('#currentStageLabel')).toHaveText('튜토리얼');
  await expect(stageButton(page, 'tutorial')).toHaveAttribute('aria-current', 'step');
  await expect(stageButton(page, 'tutorial')).toBeEnabled();

  for (const id of ['stage-1', 'stage-2', 'stage-3']) {
    await expect(stageButton(page, id)).toBeDisabled();
    await expect(stageButton(page, id)).toHaveAccessibleName(/잠김/);
  }
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
  await expect(page.locator('#completionCard')).toBeHidden();
});

test('겹친 블록을 자유롭게 끌면 알맞은 자리에 철컥 결합하고 v2 단계 상태로 저장된다', async ({ page }) => {
  await expect(bankBlock(page, 'hado')).toContainText('×2');
  await expect(bankBlock(page, 'geuraeseo')).toContainText('×2');

  await dragTo(page, bankBlock(page, 'hado'), socket(page, 'film'));

  await expect(board(page, 'film')).toHaveClass(/is-complete/);
  await expect(socket(page, 'film')).toBeDisabled();
  await expect(socket(page, 'film')).toContainText('하도');
  await expect(socket(page, 'film')).not.toHaveAttribute('aria-label');
  await expect(page.locator('#statusMessage')).toContainText('맞아요');
  await expect(page.locator('#progressCount')).toHaveText('1 / 6');
  await expect(bankBlock(page, 'hado')).not.toContainText('×2');

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
  expect(saved.version).toBe(2);
  expect(saved.activeStageId).toBe('tutorial');
  expect(saved.stages.tutorial.completed.film).toBe('tutorial--hado-1');
  expect(saved.stages['stage-1'].completed).toEqual({});

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(board(page, 'film')).toHaveClass(/is-complete/);
  await expect(socket(page, 'film')).toBeDisabled();
});

test('하도 블록과 문제 칸은 같은 뒤집힌 U자이며 어간을 가운데에 감싼다', async ({ page }) => {
  await expect(bankBlock(page, 'hado').locator('.hado-shape--solid path')).toHaveCount(1);
  await expect(socket(page, 'film').locator('.hado-shape--guide path')).toHaveCount(1);

  const initial = await page.evaluate(() => {
    const block = document.querySelector('#blockBank [data-block-kind="hado"]');
    const socketElement = document.querySelector('[data-board-id="film"] [data-socket]');
    const start = block.querySelector('.hado-part--start').getBoundingClientRect();
    const cavity = block.querySelector('.hado-cavity').getBoundingClientRect();
    const end = block.querySelector('.hado-part--end').getBoundingClientRect();
    const stem = socketElement.querySelector('.locked-stem').getBoundingClientRect();
    const blockAso = document.querySelector('#blockBank [data-block-kind="aso"]');
    const socketAso = document.querySelector('[data-board-id="rain-clause"] [data-socket]');
    return {
      startCenter: start.left + start.width / 2,
      cavityCenter: cavity.left + cavity.width / 2,
      endCenter: end.left + end.width / 2,
      stemCenter: stem.left + stem.width / 2,
      socketCavityCenter: socketElement.getBoundingClientRect().left + socketElement.getBoundingClientRect().width * 0.47,
      blockAsoShape: getComputedStyle(blockAso).clipPath,
      socketAsoShape: getComputedStyle(socketAso).clipPath
    };
  });

  expect(initial.startCenter).toBeLessThan(initial.cavityCenter);
  expect(initial.cavityCenter).toBeLessThan(initial.endCenter);
  expect(Math.abs(initial.stemCenter - initial.socketCavityCenter)).toBeLessThan(2);
  expect(initial.blockAsoShape).toBe(initial.socketAsoShape);
  expect(initial.blockAsoShape).toContain('16%');

  await placeByKeyboard(page, 'film', 'hado');
  await expect(socket(page, 'film').locator('.hado-shape--locked path')).toHaveCount(1);

  const lockedOrder = await socket(page, 'film').evaluate((element) => {
    const center = (selector) => {
      const rect = element.querySelector(selector).getBoundingClientRect();
      return rect.left + rect.width / 2;
    };
    return [center('.locked-left'), center('.locked-stem'), center('.locked-tail')];
  });
  expect(lockedOrder[0]).toBeLessThan(lockedOrder[1]);
  expect(lockedOrder[1]).toBeLessThan(lockedOrder[2]);
});

test('맞지 않는 블록은 문장판 안을 튕긴 뒤 멈추고 다시 드래그할 수 있다', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await dragTo(page, bankBlock(page, 'geuraeseo'), socket(page, 'film'));

  await expect(page.locator('#statusMessage')).toContainText('ㄷ 모양 블록');
  await expect(socket(page, 'film')).toBeEnabled();
  const bounced = board(page, 'film').locator('.loose-piece[data-block-id="tutorial--geuraeseo-1"]');
  await expect(bounced).toBeVisible({ timeout: 4_000 });

  const position = await bounced.evaluate((element) => ({
    parent: element.parentElement?.dataset.boardStage,
    left: element.style.left,
    top: element.style.top
  }));
  expect(position.parent).toBe('film');
  expect(position.left).not.toBe('');
  expect(position.top).not.toBe('');

  await dragTo(page, bounced, socket(page, 'tired-sentences'));
  await expect(board(page, 'tired-sentences')).toHaveClass(/is-complete/);
  await expect(board(page, 'film').locator('.loose-piece[data-block-id="tutorial--geuraeseo-1"]')).toHaveCount(0);
});

test('클릭과 키보드만으로도 블록을 고르고 배치할 수 있다', async ({ page }) => {
  await bankBlock(page, 'aso').press('Enter');
  await expect(bankBlock(page, 'aso')).toBeFocused();
  await expect(bankBlock(page, 'aso')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#statusMessage')).toContainText('빈칸을 누르');
  await socket(page, 'rain-clause').press('Enter');
  await expect(board(page, 'rain-clause')).toHaveClass(/is-complete/);
  await expect(socket(page, 'rain-clause')).toContainText('서');

  await bankBlock(page, 'aju').click();
  await socket(page, 'exhibition').click();
  await expect(board(page, 'exhibition')).toHaveClass(/is-complete/);
  await expect(socket(page, 'exhibition')).toContainText('아주');
});

test('되돌리기와 초기화가 현재 단계의 배치와 블록 수만 복원한다', async ({ page }) => {
  await placeByKeyboard(page, 'film', 'hado');

  await page.locator('#undoButton').click();
  await expect(board(page, 'film')).not.toHaveClass(/is-complete/);
  await expect(bankBlock(page, 'hado')).toContainText('×2');
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');

  await placeByKeyboard(page, 'tired-sentences', 'geuraeseo');
  await page.locator('#resetButton').click();
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
  await expect(bankBlock(page, 'geuraeseo')).toContainText('×2');
});

test('동작 줄이기 환경에서도 오답 블록이 즉시 다시 사용 가능한 상태로 멈춘다', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await dragTo(page, bankBlock(page, 'neomu'), socket(page, 'film'));
  const bounced = board(page, 'film').locator('.loose-piece[data-block-id="tutorial--neomu-1"]');
  await expect(bounced).toBeVisible();
  await expect(bounced).toBeEnabled();
  await expect(socket(page, 'film')).toBeEnabled();
});

test('튜토리얼을 마쳐도 자동 이동하지 않고 본 연습 시작을 눌러야 스테이지 1로 간다', async ({ page }) => {
  await completeStage(page, 'tutorial');

  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(stageButton(page, 'stage-1')).toBeEnabled();
  await expect(stageButton(page, 'stage-2')).toBeDisabled();
  await expect(page.locator('#nextStageButton')).toBeVisible();
  await expect(page.locator('#nextStageButton')).toHaveText('본 연습 시작');

  await page.locator('#nextStageButton').click();
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'stage-1');
  await expect(page.locator('body')).toHaveAttribute('data-stage-type', 'practice');
  await expect(page.locator('#stageTitle')).toHaveText('스테이지 1 · 하루의 장면');
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
});

test('각 본 스테이지는 재고와 진행을 따로 저장하고 다시 방문해도 그대로 복원한다', async ({ page }) => {
  await seedStage(page, 'stage-1', 1);

  const stageOneKinds = await page.locator('#blockBank [data-block-kind]').evaluateAll((blocks) =>
    blocks.map((block) => block.dataset.blockKind)
  );
  expect(stageOneKinds).toEqual(['hado', 'aso', 'geuraeseo', 'jinjja']);
  await expect(bankBlock(page, 'hado')).toContainText('×2');
  await expect(bankBlock(page, 'jinjja')).toBeVisible();
  await expect(bankBlock(page, 'aju')).toHaveCount(0);
  await expect(bankBlock(page, 'maeu')).toHaveCount(0);

  await placeByKeyboard(page, 's1-corridor', 'hado');
  await expect(page.locator('#progressCount')).toHaveText('1 / 6');

  await stageButton(page, 'tutorial').click();
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
  await expect(bankBlock(page, 'hado')).toContainText('×2');

  await stageButton(page, 'stage-1').click();
  await expect(page.locator('#progressCount')).toHaveText('1 / 6');
  await expect(board(page, 's1-corridor')).toHaveClass(/is-complete/);
  await expect(bankBlock(page, 'hado')).not.toContainText('×2');

  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'stage-1');
  await expect(page.locator('#progressCount')).toHaveText('1 / 6');

  const saved = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
  expect(saved.stages['stage-1'].completed['s1-corridor']).toBe('stage-1--hado-1');
  expect(saved.stages.tutorial.completed).toEqual({});
  expect(saved.stages['stage-2'].completed).toEqual({});
});

test('본 스테이지 미완료 카드 머리는 번호만 보이고 정답 뒤 전체 문장과 색·모양 표지가 나타난다', async ({ page }) => {
  await seedStage(page, 'stage-1', 1);

  const initialHeads = await page.locator('.sentence-board .board-head').allInnerTexts();
  expect(initialHeads.map((text) => text.trim())).toEqual(['1', '2', '3', '4', '5', '6']);
  await expect(page.locator('.board-complete-sentence')).toHaveCount(0);
  await expect(board(page, 's1-corridor').locator('.board-title')).toHaveCount(0);

  await placeByKeyboard(page, 's1-corridor', 'hado');

  const header = board(page, 's1-corridor').locator('.board-complete-sentence');
  const target = header.locator('.completed-expression');
  await expect(header).toHaveText('복도가 하도 어두워서 휴대전화 불을 켰어요.');
  await expect(target).toHaveText('하도 어두워서');
  await expect(target).toHaveClass(/completed-expression--hado/);

  const colors = await header.evaluate((element) => ({
    header: getComputedStyle(element).color,
    target: getComputedStyle(element.querySelector('.completed-expression')).color,
    targetBorder: getComputedStyle(element.querySelector('.completed-expression')).borderTopStyle
  }));
  expect(colors.target).not.toBe(colors.header);
  expect(colors.targetBorder).not.toBe('none');
});

test('스테이지 2의 최종 승인 문장 2번과 5번을 정확히 사용한다', async ({ page }) => {
  await seedStage(page, 'stage-2', 2);

  await expect(board(page, 's2-pollution')).toContainText('공해가');
  await expect(board(page, 's2-pollution')).toContainText('많아요.');
  await expect(bankBlock(page, 'maeu')).toBeVisible();
  await expect(page.locator('#sentenceGrid')).not.toContainText('연기와 오염 물질이');

  await placeByKeyboard(page, 's2-pollution', 'maeu');
  await expect(board(page, 's2-pollution').locator('.board-complete-sentence'))
    .toHaveText('공해가 매우 많아요.');
  await expect(board(page, 's2-pollution').locator('.completed-expression'))
    .toHaveText('매우');

  await expect(board(page, 's2-friends')).toContainText('친구들이');
  await expect(board(page, 's2-friends')).toContainText('택시를 탔어요.');
  await placeByKeyboard(page, 's2-friends', 'hado');
  await expect(board(page, 's2-friends').locator('.board-complete-sentence'))
    .toHaveText('친구들이 하도 기다려서 택시를 탔어요.');
  await expect(board(page, 's2-friends').locator('.completed-expression'))
    .toHaveText('하도 기다려서');
});

test('스테이지는 앞 단계 완료 뒤 순서대로 열리고 열린 단계는 자유롭게 재방문한다', async ({ page }) => {
  await completeStage(page, 'tutorial');
  await expect(stageButton(page, 'stage-1')).toBeEnabled();
  await expect(stageButton(page, 'stage-2')).toBeDisabled();
  await expect(stageButton(page, 'stage-3')).toBeDisabled();

  await page.locator('#nextStageButton').click();
  await completeStage(page, 'stage-1');
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'stage-1');
  await expect(stageButton(page, 'stage-2')).toBeEnabled();
  await expect(stageButton(page, 'stage-3')).toBeDisabled();

  await stageButton(page, 'stage-2').click();
  await completeStage(page, 'stage-2');
  await expect(stageButton(page, 'stage-3')).toBeEnabled();

  await stageButton(page, 'tutorial').click();
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(page.locator('#progressCount')).toHaveText('6 / 6');

  await stageButton(page, 'stage-1').click();
  await expect(page.locator('#progressCount')).toHaveText('6 / 6');
  await stageButton(page, 'stage-2').click();
  await expect(page.locator('#progressCount')).toHaveText('6 / 6');
  await stageButton(page, 'stage-3').click();
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'stage-3');
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
});

test('v1 저장값은 튜토리얼 진행과 잠금 해제 상태를 v2로 마이그레이션한다', async ({ page }) => {
  const legacy = {
    version: 1,
    sound: false,
    completed: {
      film: 'hado-1',
      exhibition: 'aju-1',
      'tired-sentences': 'geuraeseo-1',
      'rain-clause': 'aso-1',
      baby: 'hado-2',
      'boat-sentences': 'geuraeseo-2'
    },
    loose: {},
    order: ['film', 'exhibition', 'tired-sentences', 'rain-clause', 'baby', 'boat-sentences']
  };

  await page.evaluate(({ current, legacyKey, legacyValue }) => {
    localStorage.removeItem(current);
    localStorage.setItem(legacyKey, JSON.stringify(legacyValue));
  }, { current: storageKey, legacyKey: legacyStorageKey, legacyValue: legacy });
  await page.reload({ waitUntil: 'domcontentloaded' });

  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(page.locator('#progressCount')).toHaveText('6 / 6');
  await expect(page.locator('#nextStageButton')).toHaveText('본 연습 시작');
  await expect(stageButton(page, 'stage-1')).toBeEnabled();
  await expect(stageButton(page, 'stage-2')).toBeDisabled();

  const migrated = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey);
  expect(migrated.version).toBe(2);
  expect(migrated.activeStageId).toBe('tutorial');
  expect(migrated.unlockedThrough).toBe(1);
  expect(migrated.sound).toBe(false);
  expect(migrated.stages.tutorial.completed).toEqual({
    film: 'tutorial--hado-1',
    exhibition: 'tutorial--aju-1',
    'tired-sentences': 'tutorial--geuraeseo-1',
    'rain-clause': 'tutorial--aso-1',
    baby: 'tutorial--hado-2',
    'boat-sentences': 'tutorial--geuraeseo-2'
  });
  expect(migrated.stages['stage-1'].completed).toEqual({});
});

test('320·390·1024·1440 화면에서 긴 본 스테이지도 문서 가로 넘침 없이 보인다', async ({ page }) => {
  await seedStage(page, 'stage-3', 3);

  for (const [width, height] of [[320, 844], [390, 844], [1024, 768], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    await page.reload({ waitUntil: 'domcontentloaded' });
    const audit = await page.evaluate(() => {
      const bank = document.querySelector('.block-bank');
      const firstBoard = document.querySelector('[data-board-id="s3-cheonggyecheon"]');
      const stageRail = document.querySelector('#stageRail');
      const block = document.querySelector('#blockBank [data-block-kind="hado"]');
      const boardRect = firstBoard.getBoundingClientRect();
      const bankRect = bank.getBoundingClientRect();
      const railRect = stageRail.getBoundingClientRect();
      return {
        documentWidth: document.documentElement.scrollWidth,
        viewport: window.innerWidth,
        bankDisplay: getComputedStyle(bank).display,
        bankPosition: getComputedStyle(bank).position,
        boardWidth: boardRect.width,
        boardLeft: boardRect.left,
        boardRight: boardRect.right,
        bankLeft: bankRect.left,
        bankRight: bankRect.right,
        railLeft: railRect.left,
        railRight: railRect.right,
        blockTouchAction: getComputedStyle(block).touchAction
      };
    });

    expect(audit.documentWidth).toBeLessThanOrEqual(width + 1);
    expect(audit.bankDisplay).not.toBe('none');
    expect(audit.boardWidth).toBeGreaterThan(0);
    expect(audit.boardLeft).toBeGreaterThanOrEqual(-1);
    expect(audit.boardRight).toBeLessThanOrEqual(width + 1);
    expect(audit.bankLeft).toBeGreaterThanOrEqual(-1);
    expect(audit.bankRight).toBeLessThanOrEqual(width + 1);
    expect(audit.railLeft).toBeGreaterThanOrEqual(-1);
    expect(audit.railRight).toBeLessThanOrEqual(width + 1);
    if (width <= 760) {
      expect(audit.bankPosition).toBe('sticky');
      expect(audit.blockTouchAction).toBe('pan-x');
    }
  }
});

test('200% 확대와 글자 가림 점검에서도 모양 단서와 활동 경계가 남는다', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 800 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('body').evaluate((element) => element.classList.add('sv-qa-hide-copy'));

  const audit = await page.evaluate(() => {
    const hado = document.querySelector('[data-block-kind="hado"]');
    const aso = document.querySelector('[data-block-kind="aso"]');
    const socketElement = document.querySelector('[data-socket]');
    const tailSocket = document.querySelector('[data-board-id="rain-clause"] [data-socket]');
    return {
      width: document.documentElement.scrollWidth,
      viewport: window.innerWidth,
      hadoPath: hado.querySelector('.hado-shape--solid path').getAttribute('d'),
      hadoGuideDash: getComputedStyle(socketElement.querySelector('.hado-shape--guide path')).strokeDasharray,
      asoShape: getComputedStyle(aso).clipPath,
      asoSocketShape: getComputedStyle(tailSocket).clipPath,
      optionalHelpOpen: document.querySelector('.shape-help').open,
      teacherOnly: document.querySelectorAll('[data-copy-layer="TEACHER_ONLY"]').length
    };
  });

  expect(audit.width).toBeLessThanOrEqual(audit.viewport + 1);
  expect(audit.hadoPath).toContain('V106H185V43H95V106');
  expect(audit.hadoGuideDash).not.toBe('none');
  expect(audit.asoShape).not.toBe('none');
  expect(audit.asoSocketShape).toBe(audit.asoShape);
  expect(audit.optionalHelpOpen).toBe(false);
  expect(audit.teacherOnly).toBe(0);
});

test('손상된 v2 저장값과 브라우저 콘솔 오류 없이 튜토리얼을 시작한다', async ({ page }) => {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));

  await page.evaluate((key) => localStorage.setItem(key, '{not-json'), storageKey);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toHaveAttribute('data-stage-id', 'tutorial');
  await expect(page.locator('#progressCount')).toHaveText('0 / 6');
  await expect(bankBlock(page, 'hado')).toBeEnabled();
  await expect(page.locator('img[src^="http"], video[src^="http"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('모바일 아이콘 도구에도 이름이 있고 소리 상태가 함께 바뀐다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  const sound = page.locator('#soundToggle');
  await expect(sound).toHaveAccessibleName('소리 켜짐');
  await sound.click();
  await expect(sound).toHaveAccessibleName('소리 꺼짐');
  await expect(sound).toHaveAttribute('aria-pressed', 'false');
});

test('14과 허브에서 표현 블록 맞추기 보조 활동을 열 수 있다', async ({ page }) => {
  await page.goto('/c14/index.html', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a[href="grammar1-block-lab.html"]')).toHaveCount(0);
  await expect(page.locator('a[href="grammar1-block-studio.html"]')).toContainText('보조 활동');
  await expect(page.locator('a[href="grammar1-block-studio.html"]')).toContainText('표현 블록 맞추기');
});
