(function () {
  'use strict';

  var STORAGE_KEY = 'korean3b:apps:passive-voice:source-story:v1:state';
  var FRAME_COUNT = 35;
  var suffixTable = '<table><caption>자주 만나는 피동사</caption><thead><tr><th>이</th><th>히</th><th>리</th><th>기</th></tr></thead><tbody><tr><td>보다→보이다</td><td>닫다→닫히다</td><td>걸다→걸리다</td><td>끊다→끊기다</td></tr><tr><td>쓰다→쓰이다</td><td>읽다→읽히다</td><td>열다→열리다</td><td>안다→안기다</td></tr><tr><td>놓다→놓이다</td><td>막다→막히다</td><td>팔다→팔리다</td><td>쫓다→쫓기다</td></tr><tr><td>바꾸다→바뀌다</td><td>잡다→잡히다</td><td>풀다→풀리다</td><td>씻다→씻기다</td></tr><tr><td>잠그다→잠기다</td><td>뽑다→뽑히다</td><td>듣다→들리다</td><td>담다→담기다</td></tr></tbody></table>';
  var frames = [
    ['intro','object','능동과 피동','능동은 행동하는 사람을, 피동은 <span class="accent">영향을 받는 대상</span>을 중심에 두어요.'],
    ['form','suffix','피동문과 피동사','피동문은 피동 동사를 써야 해요.<br><span class="formula">동사 + 피동 = 피동 동사(피동사)</span>'],
    ['form','suffix','피동사 만드는 방법','피동사를 만드는 방법은 두 가지예요.<br>첫째, <span class="formula">V + -이/히/리/기-</span>'],
    ['form','suffix','-이·히·리·기-','<span class="formula"><span class="accent">이 · 히 · 리 · 기</span></span>를 붙여 피동사를 만들어요.'],
    ['form','suffix','피동사 표','', true],
    ['cafe','me','카페의 꽃','카페에서 꽃을 보는 사람은 누구일까요?'],
    ['cafe','me','보다','<span class="formula">보다</span>는 내가 어떤 대상을 보는 행동이에요.'],
    ['cafe','me-arrow','내가 보다','<span class="formula">내가 보다</span><span class="subtle">화살표가 행동의 방향을 보여 줘요.</span>'],
    ['cafe','younghee','영희가 보다','<span class="formula">영희가 보다</span><span class="subtle">행동하는 사람은 바뀔 수 있어요.</span>'],
    ['cafe','younghee','누가 볼까요?','내가 보기도 하고, 영희가 보기도 해요.'],
    ['cafe','flower','보 + 이 + 다','<span class="formula">보 + 이 + 다 = 보이다</span>'],
    ['cafe','flower','꽃이 보이다','<span class="formula">꽃이 보이다</span><span class="subtle">이제 꽃을 중심에 두어요.</span>'],
    ['recap','suffix','다시 보기','피동사: 동사 어간 + <span class="formula">-이/히/리/기-</span> + 다'],
    ['recap','suffix','피동사 표','', true],
    ['recap','lexical','외워야 하는 피동사','<span class="formula">-이/히/리/기-</span>에는 만들어 내는 규칙이 없어요. 피동사 형태를 낱말로 익혀요.'],
    ['recap','lexical','피동사 만드는 두 가지 방법','① 동사 어간 + <span class="formula">-이/히/리/기-</span><br>② 동사 어간 + <span class="formula">-아/어지다</span>'],
    ['recap','lexical','모든 동사가 될까요?','일부 동사는 <span class="formula">-이/히/리/기-</span> 피동사를 만들 수 없어요.'],
    ['recap','turn-on','켜다 → 켜지다','<span class="formula">켜다 → 켜지다</span><br><span class="accent">불이 켜졌어요.</span>'],
    ['tiger','tiger','다시, 중심을 바꿔 볼까요?','행동하는 쪽과 영향을 받는 쪽, 어느 쪽을 중심에 둘까요?'],
    ['tiger','tiger','호랑이와 닭','호랑이와 닭이 있는 장면이에요.'],
    ['tiger','tiger','능동 문장','<span class="formula">호랑이가 닭을 먹어요!</span>'],
    ['tiger','tiger','호랑이를 중심에','호랑이가 행동을 해요.'],
    ['tiger','tiger','행동의 방향','호랑이에서 닭으로 행동이 향해요.'],
    ['tiger','chicken','닭을 중심에','이번에는 닭을 중심에 두어요.'],
    ['tiger','chicken','피동 문장','<span class="formula">닭이 호랑이에게 먹혀요!</span>'],
    ['tiger','chicken','먹히다','<span class="formula">먹히다(피동)</span>'],
    ['template','active','능동 문장 틀','<span class="formula">주어 이/가 + 목적어 을/를 + 동사</span>'],
    ['template','active','문장 역할','누가 행동해요? 무엇이 그 행동을 받아요?'],
    ['template','active','능동 문장 채우기','<span class="formula">호랑이가 닭을 먹다</span>'],
    ['template','swap','피동 문장도 만들 수 있어요','대상의 자리를 문장 앞에 놓아 보세요.'],
    ['template','swap','중심 바꾸기','목적어가 피동 문장의 주어가 돼요.'],
    ['template','passive','피동 문장 역할','행동한 사람은 <span class="formula">에게</span>로 나타낼 수 있어요.'],
    ['template','passive','피동 문장 틀','<span class="formula">목적어 이/가 + 주어 에게 + 피동사</span>'],
    ['template','passive','바뀐 문장','<span class="formula">닭이 호랑이에게 먹히다</span>'],
    ['template','passive','이제 직접 해 볼까요?','장면의 중심을 찾는 진단으로 이어 가요.']
  ].map(function (item, index) { return { number:index + 1, scene:item[0], focus:item[1], label:item[2], message:item[3], table:Boolean(item[4]) }; });

  var scene = document.querySelector('[data-story-scene]');
  var visualScene = document.querySelector('.visual-scene');
  var roleSubject = document.querySelector('[data-object="role-subject"]');
  var progress = document.querySelector('[data-story-progress]');
  var message = document.querySelector('[data-story-message]');
  var table = document.querySelector('[data-story-table]');
  var label = document.querySelector('[data-story-scene-label]');
  var next = document.querySelector('[data-story-next]');
  var back = document.querySelector('[data-story-back]');
  var finish = document.querySelector('[data-story-finish]');
  var status = document.querySelector('[data-story-save-status]');
  var recovery = document.querySelector('.storage-recovery');
  var resetButtons = document.querySelectorAll('[data-story-reset]');
  var state = { schemaVersion:1, currentFrame:1, completed:false, updatedAt:new Date().toISOString() };
  var recovering = false;

  function canonicalIsoTimestamp(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
    var parsed = Date.parse(value);
    return Number.isFinite(parsed) && new Date(parsed).toISOString() === value;
  }
  function validState(candidate) {
    return candidate && candidate.schemaVersion === 1 && Number.isInteger(candidate.currentFrame) && candidate.currentFrame >= 1 && candidate.currentFrame <= FRAME_COUNT && typeof candidate.completed === 'boolean' && canonicalIsoTimestamp(candidate.updatedAt);
  }
  function setSaveStatus(text, unsaved) {
    status.textContent = text;
    status.dataset.unsaved = unsaved ? 'true' : 'false';
  }
  function load() {
    var raw;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (error) { setSaveStatus('이 기기에는 아직 저장할 수 없어요.', true); return; }
    if (!raw) return;
    try {
      var saved = JSON.parse(raw);
      if (!validState(saved)) throw new Error('invalid');
      state = saved;
      if (state.completed && state.currentFrame < FRAME_COUNT) state.currentFrame = FRAME_COUNT;
    } catch (error) {
      recovering = true;
      recovery.hidden = false;
      setSaveStatus('기존 기록을 안전하게 보관 중이에요.', true);
    }
  }
  function save() {
    if (recovering) return;
    state.updatedAt = new Date().toISOString();
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); setSaveStatus('이 기기에 저장됐어요.', false); }
    catch (error) { setSaveStatus('저장하지 못했어요. 계속 학습할 수 있어요.', true); }
  }
  function render() {
    var frame = frames[state.currentFrame - 1];
    scene.dataset.frame = String(frame.number);
    scene.dataset.scene = frame.scene;
    scene.dataset.focus = frame.focus;
    scene.setAttribute('aria-label', '장면 ' + frame.number + ': ' + frame.label);
    visualScene.setAttribute('aria-label', frame.label + ' 시각 장면');
    label.textContent = frame.label;
    roleSubject.innerHTML = frame.scene === 'template' && frame.focus === 'passive' ? '대상<br><b>이/가</b>' : '주어<br><b>이/가</b>';
    message.innerHTML = '<p>' + frame.message + '</p>';
    table.hidden = !frame.table;
    table.innerHTML = frame.table ? suffixTable : '';
    progress.textContent = frame.number + ' / ' + FRAME_COUNT;
    progress.setAttribute('aria-label', '현재 ' + frame.number + ' / ' + FRAME_COUNT);
    back.disabled = frame.number === 1;
    next.hidden = frame.number === FRAME_COUNT;
    finish.hidden = frame.number !== FRAME_COUNT;
  }
  function go(frameNumber, shouldSave) {
    state.currentFrame = Math.max(1, Math.min(FRAME_COUNT, frameNumber));
    state.completed = state.completed || state.currentFrame === FRAME_COUNT;
    render();
    if (shouldSave) save();
  }
  next.addEventListener('click', function () { go(state.currentFrame + 1, true); });
  back.addEventListener('click', function () { go(state.currentFrame - 1, true); });
  document.addEventListener('keydown', function (event) {
    var target = event.target;
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)) return;
    if (event.key === 'ArrowRight' || event.key === ' ') { event.preventDefault(); go(state.currentFrame + 1, true); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); go(state.currentFrame - 1, true); }
    else if (event.key === 'Home') { event.preventDefault(); go(1, true); }
    else if (event.key === 'End') { event.preventDefault(); go(FRAME_COUNT, true); }
  });
  resetButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      if (!window.confirm('이 이야기의 저장 기록만 지우고 처음부터 시작할까요?')) return;
      try { localStorage.removeItem(STORAGE_KEY); } catch (error) { setSaveStatus('기록을 지우지 못했어요.', true); return; }
      recovering = false;
      recovery.hidden = true;
      state = { schemaVersion:1, currentFrame:1, completed:false, updatedAt:new Date().toISOString() };
      render();
      setSaveStatus('이 이야기 기록을 지웠어요.', false);
    });
  });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') save(); });
  window.addEventListener('pagehide', save);
  load();
  render();
}());
