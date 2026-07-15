(function () {
  "use strict";

  var STORAGE_KEY = "c14-grammar1-2-speaking-v1";
  var hasRecognition = Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  var canSpeak = "speechSynthesis" in window;
  var saveState = document.getElementById("saveState");
  var refs = {
    progressText: document.getElementById("progressText"),
    progressBar: document.getElementById("progressBar"),
    stageTabs: document.getElementById("stageTabs"),
    workspace: document.getElementById("workspace")
  };

  var CYCLES = [
    {
      title: "사이클 1 · 매운 음식의 기억",
      note: "강하게 느낀 맛과 그때 먹었던 음식을 연결해 말해 보세요.",
      image: {
        src: "../assets/c14/grammar/images/grammar1-2-speaking/spicy-stew-memory.webp",
        alt: "매운 김치찌개를 먹고 물을 마시려는 학생과 식사 사진",
        title: "매운 김치찌개를 먹은 장면"
      },
      grammar1: {
        label: "문법 1 · 하도 A/V-아서/어서",
        prompt: "김치찌개의 맛이 아주 강해서 생긴 결과를 말해 보세요.",
        hint: "‘하도’ 뒤에 맛의 정도를 넣고, 뒤에는 그 결과를 연결하세요.",
        frame: "[음식이] 하도 [어때서] [어떤 결과]요.",
        target: "김치찌개가 하도 매워서 물을 많이 마셨어요.",
        tokens: ["김치찌개가", "하도", "매워서", "물을", "많이", "마셨어요."],
        focus: ["하도 매워서", "물을 많이 마셨어요"],
        keys: [["김치찌개"], ["하도"], ["매워서", "매워"], ["물"], ["마셨"]],
        badge: "강한 정도와 결과",
        caption: "매운맛이 너무 강해서 바로 물을 마시려는 장면이에요."
      },
      grammar2: {
        label: "문법 2 · A/V-았던/었던",
        prompt: "지난주에 먹은 김치찌개를 기억하며 말해 보세요.",
        hint: "이미 끝난 식사 경험으로 ‘김치찌개’를 꾸며 보세요.",
        frame: "[언제] [먹었던] [명사]가 [지금 생각나요].",
        target: "지난주에 먹었던 김치찌개가 아직도 생각나요.",
        tokens: ["지난주에", "먹었던", "김치찌개가", "아직도", "생각나요."],
        focus: ["먹었던 김치찌개", "지금의 회상"],
        keys: [["지난주"], ["먹었던"], ["김치찌개"], ["생각"]],
        badge: "기억 속 음식",
        caption: "사진을 보면서 이미 끝난 식사 경험을 떠올리는 상황이에요."
      }
    },
    {
      title: "사이클 2 · 공연을 본 밤",
      note: "시간 가는 줄 몰랐던 공연과 어제 본 공연 사진을 연결합니다.",
      image: {
        src: "../assets/c14/grammar/images/grammar1-2-speaking/concert-memory.webp",
        alt: "공연을 즐기는 두 학생과 공연 사진을 보여 주는 휴대전화",
        title: "시간 가는 줄 몰랐던 공연"
      },
      grammar1: {
        label: "문법 1 · 하도 A/V-아서/어서",
        prompt: "공연이 아주 재미있어서 생긴 결과를 말해 보세요.",
        hint: "‘재미있어서’ 뒤에 시간 감각을 잊은 결과를 이어 보세요.",
        frame: "[공연이] 하도 [재미있어서] [결과]요.",
        target: "공연이 하도 재미있어서 시간 가는 줄 몰랐어요.",
        tokens: ["공연이", "하도", "재미있어서", "시간", "가는 줄", "몰랐어요."],
        focus: ["하도 재미있어서", "시간 가는 줄 몰랐어요"],
        keys: [["공연"], ["하도"], ["재미있어서"], ["시간"], ["몰랐"]],
        badge: "강한 정도와 결과",
        caption: "공연이 너무 재미있어서 끝나는 시간도 잊은 모습이에요."
      },
      grammar2: {
        label: "문법 2 · A/V-았던/었던",
        prompt: "휴대전화 속 공연 사진을 보며 기억을 말해 보세요.",
        hint: "‘보다’의 과거 형태가 줄어든 ‘봤던’을 사용해 보세요.",
        frame: "[언제] [봤던] [명사] [명사]예요.",
        target: "어제 봤던 공연 사진이에요.",
        tokens: ["어제", "봤던", "공연", "사진이에요."],
        focus: ["봤던 공연", "공연 사진"],
        keys: [["어제"], ["봤던"], ["공연"], ["사진"]],
        badge: "기억 속 공연",
        caption: "어제 본 공연을 사진으로 다시 떠올리고 있어요."
      }
    },
    {
      title: "사이클 3 · 비 오는 제주도 여행",
      note: "많이 내린 비 때문에 택시를 타고, 작년에 간 제주도 여행을 회상합니다.",
      image: {
        src: "../assets/c14/grammar/images/grammar1-2-speaking/jeju-rain-memory.webp",
        alt: "비 오는 제주도에서 우산을 쓰고 택시에 타며 여행 사진을 보는 학생",
        title: "비가 많이 온 제주도 여행"
      },
      grammar1: {
        label: "문법 1 · 하도 A/V-아서/어서",
        prompt: "비가 아주 많이 와서 한 행동을 말해 보세요.",
        hint: "‘하도 많이 와서’ 뒤에 택시를 탄 결과를 연결하세요.",
        frame: "[비가] 하도 [많이 와서] [결과]요.",
        target: "비가 하도 많이 와서 택시를 탔어요.",
        tokens: ["비가", "하도", "많이", "와서", "택시를", "탔어요."],
        focus: ["하도 많이 와서", "택시를 탔어요"],
        keys: [["비"], ["하도"], ["와서"], ["택시"], ["탔"]],
        badge: "강한 정도와 결과",
        caption: "비가 너무 많이 와서 다른 이동 방법을 고른 장면이에요."
      },
      grammar2: {
        label: "문법 2 · A/V-았던/었던",
        prompt: "휴대전화 속 제주도 여행 사진을 보며 말해 보세요.",
        hint: "작년에 이미 끝난 여행으로 ‘제주도 여행 사진’을 꾸며 보세요.",
        frame: "[언제] [갔던] [장소] [명사]을 보고 있어요.",
        target: "작년에 갔던 제주도 여행 사진을 보고 있어요.",
        tokens: ["작년에", "갔던", "제주도", "여행", "사진을", "보고 있어요."],
        focus: ["갔던 제주도", "여행 사진"],
        keys: [["작년"], ["갔던"], ["제주도"], ["여행"], ["사진"]],
        badge: "기억 속 여행",
        caption: "비가 왔던 작년 제주도 여행을 사진으로 떠올리는 상황이에요."
      }
    },
    {
      title: "사이클 4 · 처음 만났던 카페",
      note: "아주 조용한 카페에서 오래 이야기하고, 처음 만난 장소를 다시 떠올립니다.",
      image: {
        src: "../assets/c14/grammar/images/grammar1-2-speaking/cafe-memory.webp",
        alt: "조용한 카페에서 대화하는 두 친구와 처음 만난 날의 사진",
        title: "처음 만났던 조용한 카페"
      },
      grammar1: {
        label: "문법 1 · 하도 A/V-아서/어서",
        prompt: "카페가 아주 조용해서 친구와 한 일을 말해 보세요.",
        hint: "‘하도 조용해서’ 뒤에는 오래 이야기한 결과를 넣어 보세요.",
        frame: "[카페가] 하도 [조용해서] [결과]요.",
        target: "카페가 하도 조용해서 친구와 오래 이야기했어요.",
        tokens: ["카페가", "하도", "조용해서", "친구와", "오래", "이야기했어요."],
        focus: ["하도 조용해서", "오래 이야기했어요"],
        keys: [["카페"], ["하도"], ["조용해서"], ["친구"], ["이야기했"]],
        badge: "강한 정도와 결과",
        caption: "카페가 조용해서 친구와 긴 이야기를 나누는 모습이에요."
      },
      grammar2: {
        label: "문법 2 · A/V-았던/었던",
        prompt: "두 사람이 처음 만난 카페를 떠올려 말해 보세요.",
        hint: "‘처음 만났던’으로 과거의 만남 경험이 카페를 꾸미게 하세요.",
        frame: "[처음 만났던] [장소]에서 [지금 한 일]어요.",
        target: "처음 만났던 카페에서 친구와 다시 만났어요.",
        tokens: ["처음", "만났던", "카페에서", "친구와", "다시", "만났어요."],
        focus: ["처음 만났던 카페", "다시 만났어요"],
        keys: [["처음"], ["만났던"], ["카페"], ["친구"], ["다시"]],
        badge: "기억 속 장소",
        caption: "처음 만난 날의 사진을 보며 같은 카페를 다시 찾은 상황이에요."
      }
    },
    {
      title: "사이클 5 · 친했던 친구들과의 동창회",
      note: "즐거웠던 동창회가 늦어질 만큼 이어지고, 과거의 친한 친구를 다시 만납니다.",
      image: {
        src: "../assets/c14/grammar/images/grammar1-2-speaking/reunion-memory.webp",
        alt: "식당에서 옛 사진을 보며 웃고 있는 세 명의 대학 동창",
        title: "친했던 친구들과의 동창회"
      },
      grammar1: {
        label: "문법 1 · 하도 A/V-아서/어서",
        prompt: "동창회가 아주 즐거워서 생긴 결과를 말해 보세요.",
        hint: "‘하도 즐거워서’ 뒤에 늦게까지 이야기한 결과를 이어 보세요.",
        frame: "[동창회가] 하도 [즐거워서] [결과]요.",
        target: "동창회가 하도 즐거워서 늦게까지 이야기했어요.",
        tokens: ["동창회가", "하도", "즐거워서", "늦게까지", "이야기했어요."],
        focus: ["하도 즐거워서", "늦게까지 이야기했어요"],
        keys: [["동창회"], ["하도"], ["즐거워서"], ["늦게"], ["이야기했"]],
        badge: "강한 정도와 결과",
        caption: "친구들과의 모임이 너무 즐거워 늦게까지 이어지는 장면이에요."
      },
      grammar2: {
        label: "문법 2 · A/V-았던/었던",
        prompt: "대학교 때 가까웠던 친구를 다시 만난 일을 말해 보세요.",
        hint: "‘친했던’으로 과거의 관계가 ‘친구’를 꾸미게 하세요.",
        frame: "[언제] [친했던] [사람]을 [지금 다시 만났어요].",
        target: "대학교 때 친했던 친구를 다시 만났어요.",
        tokens: ["대학교 때", "친했던", "친구를", "다시", "만났어요."],
        focus: ["친했던 친구", "다시 만났어요"],
        keys: [["대학교"], ["친했던"], ["친구"], ["다시"], ["만났"]],
        badge: "기억 속 사람",
        caption: "옛 사진을 보며 대학교 때 친했던 친구들을 다시 만난 모습이에요."
      }
    }
  ];

  function freshSpeaking() {
    return { attempts: 0, best: null, listened: false, completed: false, spoken: "" };
  }

  function freshState() {
    return {
      version: 1,
      cycle: 0,
      stage: 0,
      speakingIndex: 0,
      isRecording: false,
      transcript: "",
      results: CYCLES.map(function () {
        return {
          grammar1: { draft: "", checked: false, status: "pending" },
          grammar2: { draft: "", checked: false, status: "pending" },
          speaking: [freshSpeaking(), freshSpeaking()]
        };
      })
    };
  }

  function clamp(number, min, max) {
    return Math.max(min, Math.min(max, Number.isFinite(number) ? number : min));
  }

  function sanitizeText(value) {
    return typeof value === "string" ? value.slice(0, 600) : "";
  }

  function restoreState() {
    var base = freshState();
    try {
      var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
      if (!saved || saved.version !== 1 || !Array.isArray(saved.results) || saved.results.length !== CYCLES.length) return base;
      base.cycle = clamp(saved.cycle, 0, CYCLES.length);
      base.stage = clamp(saved.stage, 0, 2);
      base.speakingIndex = clamp(saved.speakingIndex, 0, 1);
      saved.results.forEach(function (item, index) {
        ["grammar1", "grammar2"].forEach(function (key) {
          if (!item || !item[key]) return;
          base.results[index][key].draft = sanitizeText(item[key].draft);
          base.results[index][key].checked = Boolean(item[key].checked);
          base.results[index][key].status = ["pending", "error", "guide", "accepted", "exact", "model"].indexOf(item[key].status) >= 0 ? item[key].status : "pending";
        });
        if (item && Array.isArray(item.speaking)) {
          item.speaking.slice(0, 2).forEach(function (speech, speechIndex) {
            var destination = base.results[index].speaking[speechIndex];
            destination.attempts = clamp(speech && speech.attempts, 0, 99);
            destination.best = typeof (speech && speech.best) === "number" ? clamp(speech.best, 0, 100) : null;
            destination.listened = Boolean(speech && speech.listened);
            destination.completed = Boolean(speech && speech.completed);
            destination.spoken = sanitizeText(speech && speech.spoken);
          });
        }
      });
    } catch (error) {
      return base;
    }
    return base;
  }

  var state = restoreState();
  var recognition = null;

  function setSaveStatus(text, status) {
    saveState.textContent = text;
    saveState.dataset.status = status;
  }

  var restoredProgress = state.cycle > 0 || state.stage > 0 || state.results.some(function (result) {
    return result.grammar1.draft || result.grammar2.draft || result.grammar1.checked || result.grammar2.checked || result.speaking.some(function (speech) {
      return speech.listened || speech.completed || speech.attempts > 0;
    });
  });
  setSaveStatus(restoredProgress ? "저장된 진행을 불러왔어요" : "진행 저장 준비됨", "saved");

  function persist() {
    state.isRecording = false;
    setSaveStatus("저장 중…", "saving");
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStatus("이 기기에 자동 저장됨", "saved");
    } catch (error) {
      setSaveStatus("저장할 수 없습니다", "error");
    }
  }

  function normalize(value) {
    return String(value || "").replace(/[\s.,!?~'`’“”·…]/g, "");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function currentCycle() {
    return CYCLES[state.cycle];
  }

  function currentResult() {
    return state.results[state.cycle];
  }

  function stageKey() {
    return ["grammar1", "grammar2", "speaking"][state.stage];
  }

  function isSpeakingDone(result) {
    return result.speaking.every(function (speech) { return speech.completed; });
  }

  function doneCount() {
    return state.results.reduce(function (total, result) {
      return total + (result.grammar1.checked ? 1 : 0) + (result.grammar2.checked ? 1 : 0) + (isSpeakingDone(result) ? 1 : 0);
    }, 0);
  }

  function feedbackFor(status) {
    var messages = {
      exact: ["is-good", "좋아요. 목표 문장을 정확하게 만들었어요."],
      accepted: ["is-good", "좋아요. 핵심 문법과 장면의 뜻이 모두 들어갔어요."],
      guide: ["is-guide", "문법 틀은 보입니다. 모범 문장과 비교한 뒤 다음 단계로 이어 가세요."],
      model: ["is-model", "모범 문장을 넣었어요. 문장 확인을 눌러 다음 단계로 가세요."],
      error: ["is-error", "문법 틀과 장면의 핵심 낱말을 한 번 더 확인해 보세요."],
      pending: ["", ""]
    };
    return messages[status] || messages.pending;
  }

  function evaluateDraft(kind, draft, data) {
    var cleaned = normalize(draft);
    if (!cleaned) return "error";
    if (cleaned === normalize(data.target)) return "exact";
    var grammarOk = kind === "grammar1"
      ? /하도/.test(cleaned) && /(아서|어서|여서)/.test(cleaned)
      : /(았던|었던|했던|봤던|갔던|먹었던|만났던|친했던)/.test(cleaned);
    var hits = data.keys.filter(function (group) {
      return group.some(function (word) { return cleaned.indexOf(normalize(word)) >= 0; });
    }).length;
    if (grammarOk && hits >= data.keys.length - 1) return "accepted";
    if (grammarOk && hits >= 2) return "guide";
    return "error";
  }

  function appendToken(draft, token) {
    return draft.trim() ? draft.trim() + " " + token : token;
  }

  function mixedTokenOrder(tokens, kind) {
    var mixed = tokens.slice();
    var seed = (state.cycle + 1) * 997 + (kind === "grammar1" ? 137 : 389);
    for (var index = mixed.length - 1; index > 0; index -= 1) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      var swapIndex = seed % (index + 1);
      var temporary = mixed[index];
      mixed[index] = mixed[swapIndex];
      mixed[swapIndex] = temporary;
    }
    if (mixed.every(function (token, index) { return token === tokens[index]; })) {
      mixed.push(mixed.shift());
    }
    return mixed;
  }

  function renderTop() {
    var complete = state.cycle >= CYCLES.length;
    var result = complete ? state.results[CYCLES.length - 1] : currentResult();
    var done = complete ? CYCLES.length * 3 : doneCount();
    var stageDone = [result.grammar1.checked, result.grammar2.checked, isSpeakingDone(result)];
    refs.progressText.textContent = "전체 15단계 중 " + done + "단계 완료" + (complete ? " · 모두 마쳤어요" : "");
    refs.progressBar.style.width = Math.round(done / (CYCLES.length * 3) * 100) + "%";
    refs.stageTabs.innerHTML = ["문법 1", "문법 2", "말하기"].map(function (label, index) {
      var classes = "stage-tab" + (!complete && index === state.stage ? " is-current" : "") + (stageDone[index] ? " is-done" : "");
      var detail = index === 0 ? "하도 A/V-아서/어서" : index === 1 ? "A/V-았던/었던" : "두 문장 이어 말하기";
      return '<div class="' + classes + '"><span>' + label + '</span><br /><small>' + detail + '</small></div>';
    }).join("");
  }

  function renderPractice(kind) {
    var cycle = currentCycle();
    var result = currentResult();
    var data = cycle[kind];
    var resultData = result[kind];
    var feedback = feedbackFor(resultData.status);
    refs.workspace.innerHTML =
      '<p class="section-kicker">' + escapeHtml(cycle.title) + '</p>' +
      '<h2>' + escapeHtml(data.prompt) + '</h2>' +
      '<p class="workspace-intro">' + escapeHtml(cycle.note) + '</p>' +
      '<div class="practice-layout">' +
        '<article class="scene-card">' +
          '<img src="' + escapeHtml(cycle.image.src) + '" alt="' + escapeHtml(cycle.image.alt) + '" width="960" height="720" />' +
          '<div class="scene-copy"><span class="scene-badge">' + escapeHtml(data.badge) + '</span><h3>' + escapeHtml(cycle.image.title) + '</h3><p>' + escapeHtml(data.caption) + '</p></div>' +
        '</article>' +
        '<article class="build-card">' +
          '<p class="section-kicker">' + escapeHtml(data.label) + '</p>' +
          '<p class="sentence-frame">' + escapeHtml(data.frame) + '</p>' +
          '<div class="focus-chips">' + data.focus.map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join("") + '</div>' +
          '<p class="token-guide">섞인 어절을 눌러 문장의 순서를 직접 만들어 보세요.</p>' +
          '<div class="quick-tokens" aria-label="섞인 추천 어휘">' + mixedTokenOrder(data.tokens, kind).map(function (token) { return '<button class="token-btn" type="button" data-token="' + escapeHtml(token) + '">' + escapeHtml(token) + '</button>'; }).join("") + '</div>' +
          '<label for="draftInput" class="section-kicker">나의 문장</label>' +
          '<textarea id="draftInput" class="draft-input" placeholder="그림을 보고 문장을 완성해 보세요." spellcheck="false">' + escapeHtml(resultData.draft) + '</textarea>' +
          '<div class="action-row">' +
            '<button class="btn btn-secondary" type="button" data-action="clear-draft">지우기</button>' +
            '<button class="btn btn-secondary" type="button" data-action="load-model">모범 문장</button>' +
            '<button class="btn btn-primary" type="button" data-action="check-draft">문장 확인</button>' +
          '</div>' +
          '<p id="feedback" class="feedback ' + feedback[0] + '" role="status">' + feedback[1] + '</p>' +
          '<button class="btn btn-accent" type="button" data-action="next-stage" ' + (resultData.checked ? "" : "disabled") + '>' + (kind === "grammar1" ? "문법 2로 이어 가기" : "두 문장 말하기로 이어 가기") + '</button>' +
        '</article>' +
      '</div>';

    var input = document.getElementById("draftInput");
    input.addEventListener("input", function () {
      resultData.draft = input.value.slice(0, 600);
      resultData.checked = false;
      resultData.status = "pending";
      persist();
    });
    refs.workspace.querySelectorAll("[data-token]").forEach(function (button) {
      button.addEventListener("click", function () {
        resultData.draft = appendToken(resultData.draft, button.dataset.token);
        resultData.checked = false;
        resultData.status = "pending";
        persist();
        render();
      });
    });
    refs.workspace.querySelector("[data-action=clear-draft]").addEventListener("click", function () {
      resultData.draft = "";
      resultData.checked = false;
      resultData.status = "pending";
      persist();
      render();
    });
    refs.workspace.querySelector("[data-action=load-model]").addEventListener("click", function () {
      resultData.draft = data.target;
      resultData.checked = false;
      resultData.status = "model";
      persist();
      render();
    });
    refs.workspace.querySelector("[data-action=check-draft]").addEventListener("click", function () {
      resultData.draft = input.value.slice(0, 600);
      resultData.status = evaluateDraft(kind, resultData.draft, data);
      resultData.checked = resultData.status === "exact" || resultData.status === "accepted" || resultData.status === "guide";
      persist();
      render();
    });
    refs.workspace.querySelector("[data-action=next-stage]").addEventListener("click", function () {
      if (!resultData.checked) return;
      state.stage += 1;
      persist();
      render();
    });
  }

  function speechScore(spoken, target) {
    var spokenWords = normalize(spoken);
    var words = target.replace(/[.,!?]/g, "").split(/\s+/).filter(function (word) { return word.length > 1; });
    var hits = words.filter(function (word) { return spokenWords.indexOf(normalize(word)) >= 0; }).length;
    return Math.max(20, Math.round(hits / words.length * 100));
  }

  function playModel() {
    var result = currentResult();
    var speech = result.speaking[state.speakingIndex];
    var target = currentCycle()[state.speakingIndex === 0 ? "grammar1" : "grammar2"].target;
    speech.listened = true;
    state.transcript = "모범 발음을 들었어요. 이제 직접 말해 보세요.";
    persist();
    if (canSpeak) {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(target);
      utterance.lang = "ko-KR";
      utterance.rate = 0.82;
      window.speechSynthesis.speak(utterance);
    }
    render();
  }

  function finishRecognition() {
    state.isRecording = false;
    recognition = null;
  }

  function startRecognition() {
    var Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition || state.isRecording) return;
    var result = currentResult();
    var speech = result.speaking[state.speakingIndex];
    var target = currentCycle()[state.speakingIndex === 0 ? "grammar1" : "grammar2"].target;
    state.isRecording = true;
    state.transcript = "듣고 있어요… 문장을 끝까지 말해 보세요.";
    persist();
    render();
    recognition = new Recognition();
    recognition.lang = "ko-KR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = function (event) {
      var spoken = event.results[0][0].transcript.trim();
      speech.attempts += 1;
      speech.listened = true;
      speech.spoken = spoken;
      speech.best = Math.max(speech.best || 0, speechScore(spoken, target));
      state.transcript = "인식한 문장: " + spoken + " · 최고 " + speech.best + "점";
      finishRecognition();
      persist();
      render();
    };
    recognition.onerror = function (event) {
      finishRecognition();
      state.transcript = event.error === "not-allowed" ? "마이크 권한을 허용한 뒤 다시 시도해 보세요." : "음성을 인식하지 못했어요. 모범 발음을 듣고 다시 말해 보세요.";
      persist();
      render();
    };
    recognition.onend = function () {
      if (!state.isRecording) return;
      finishRecognition();
      if (!state.transcript || state.transcript.indexOf("듣고") === 0) state.transcript = "말하기가 끝났어요. 다시 시도하거나 다음 문장으로 가세요.";
      persist();
      render();
    };
    recognition.start();
  }

  function renderSpeech() {
    var cycle = currentCycle();
    var result = currentResult();
    var items = [cycle.grammar1, cycle.grammar2];
    var speech = result.speaking[state.speakingIndex];
    var target = items[state.speakingIndex];
    var canContinue = !canSpeak || speech.listened || speech.attempts > 0;
    refs.workspace.innerHTML =
      '<p class="section-kicker">' + escapeHtml(cycle.title) + ' · 두 문장 말하기</p>' +
      '<h2>앞에서 만든 두 문장을 소리 내어 이어 말해 보세요.</h2>' +
      '<p class="workspace-intro">모범 발음을 먼저 듣고, 필요하면 마이크로 직접 말한 뒤 다음 문장으로 이동합니다.</p>' +
      '<div class="speech-layout">' +
        '<div class="speech-list">' + items.map(function (item, index) {
          var itemSpeech = result.speaking[index];
          var classes = "speech-select" + (index === state.speakingIndex ? " is-current" : "") + (itemSpeech.completed ? " is-done" : "");
          return '<button type="button" class="' + classes + '" data-speech-index="' + index + '"><small>' + (index === 0 ? "문법 1" : "문법 2") + (itemSpeech.completed ? " · 완료" : "") + '</small><strong>' + escapeHtml(item.target) + '</strong></button>';
        }).join("") + '</div>' +
        '<article class="speech-card">' +
          '<p class="section-kicker">' + escapeHtml(target.label) + '</p>' +
          '<p class="target-sentence">' + escapeHtml(target.target) + '</p>' +
          '<div class="focus-chips">' + target.focus.map(function (item) { return '<span>' + escapeHtml(item) + '</span>'; }).join("") + '</div>' +
          '<div class="action-row">' +
            '<button class="btn btn-secondary" type="button" data-action="listen-model">모범 발음 듣기</button>' +
            '<button class="btn btn-primary" type="button" data-action="start-recording" ' + (hasRecognition && !state.isRecording ? "" : "disabled") + '>' + (state.isRecording ? "인식 중…" : hasRecognition ? "직접 말하기" : "이 브라우저는 음성 인식 미지원") + '</button>' +
            '<button class="btn btn-accent" type="button" data-action="next-speech" ' + (canContinue ? "" : "disabled") + '>' + (state.speakingIndex === 0 ? "다음 문장" : state.cycle === CYCLES.length - 1 ? "종합 결과 보기" : "다음 사이클") + '</button>' +
          '</div>' +
          '<div class="status-box" role="status">' + escapeHtml(state.transcript || (speech.best !== null ? "말하기 최고 점수: " + speech.best + "점" : "아직 말하기 기록이 없어요.")) + '</div>' +
        '</article>' +
      '</div>';
    refs.workspace.querySelectorAll("[data-speech-index]").forEach(function (button) {
      button.addEventListener("click", function () {
        if (state.isRecording) return;
        state.speakingIndex = Number(button.dataset.speechIndex);
        state.transcript = "";
        persist();
        render();
      });
    });
    refs.workspace.querySelector("[data-action=listen-model]").addEventListener("click", playModel);
    refs.workspace.querySelector("[data-action=start-recording]").addEventListener("click", startRecognition);
    refs.workspace.querySelector("[data-action=next-speech]").addEventListener("click", function () {
      if (!canContinue) return;
      speech.completed = true;
      state.transcript = "";
      if (state.speakingIndex === 0) {
        state.speakingIndex = 1;
      } else {
        state.cycle += 1;
        state.stage = 0;
        state.speakingIndex = 0;
      }
      persist();
      render();
    });
  }

  function renderSummary() {
    var grammarDone = state.results.reduce(function (total, result) { return total + (result.grammar1.checked ? 1 : 0) + (result.grammar2.checked ? 1 : 0); }, 0);
    var speechScores = state.results.flatMap(function (result) { return result.speaking.map(function (speech) { return speech.best; }).filter(function (score) { return score !== null; }); });
    var average = speechScores.length ? Math.round(speechScores.reduce(function (sum, score) { return sum + score; }, 0) / speechScores.length) : null;
    refs.workspace.innerHTML =
      '<p class="section-kicker">FINAL REVIEW</p>' +
      '<h2>14과 문법 1·2 융합 말하기를 마쳤어요.</h2>' +
      '<p class="workspace-intro">강한 정도와 결과를 말한 뒤, 과거 경험으로 명사를 꾸미는 연습을 모두 끝냈습니다.</p>' +
      '<div class="summary-grid">' +
        '<div class="summary-stat"><span>문법 문장 완료</span><strong>' + grammarDone + '/10</strong></div>' +
        '<div class="summary-stat"><span>말하기 문장 완료</span><strong>' + state.results.reduce(function (total, result) { return total + result.speaking.filter(function (speech) { return speech.completed; }).length; }, 0) + '/10</strong></div>' +
        '<div class="summary-stat"><span>말하기 평균 최고 점수</span><strong>' + (average === null ? "기록 없음" : average + "점") + '</strong></div>' +
      '</div>' +
      '<div class="summary-list">' + CYCLES.map(function (cycle, index) {
        var result = state.results[index];
        return '<article class="summary-item"><strong>' + escapeHtml(cycle.title) + '</strong><p>문법 1: ' + (result.grammar1.checked ? "완료" : "미완료") + ' · 문법 2: ' + (result.grammar2.checked ? "완료" : "미완료") + ' · 말하기: ' + (isSpeakingDone(result) ? "완료" : "다시 연습") + '</p></article>';
      }).join("") + '</div>' +
      '<div class="action-row"><button class="btn btn-primary" type="button" data-action="restart">처음부터 다시 하기</button><a class="btn btn-secondary" href="grammar2.html">문법 2로 돌아가기</a></div>';
    refs.workspace.querySelector("[data-action=restart]").addEventListener("click", function () {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      state = freshState();
      window.localStorage.removeItem(STORAGE_KEY);
      persist();
      render();
    });
  }

  function render() {
    renderTop();
    if (state.cycle >= CYCLES.length) {
      renderSummary();
      return;
    }
    if (stageKey() === "speaking") renderSpeech();
    else renderPractice(stageKey());
  }

  window.C14_GRAMMAR_FUSION = {
    storageKey: STORAGE_KEY,
    getState: function () { return JSON.parse(JSON.stringify(state)); },
    cycles: CYCLES.map(function (cycle) { return { title: cycle.title, grammar1: cycle.grammar1.target, grammar2: cycle.grammar2.target }; })
  };

  render();
}());
