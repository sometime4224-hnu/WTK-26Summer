(function () {
    "use strict";

    const FIREBASE_VERSION = "12.15.0";
    const settings = window.HOMEWORK_FIREBASE_CONFIG || {};
    const root = document.getElementById("homeworkDashboardRoot");

    if (!root) return;

    const registry = normalizeRegistry(window.HOMEWORK_DASHBOARD_REGISTRY);
    const requestedAssignmentId = new URLSearchParams(window.location.search).get("assignment") || "";
    const selectedRegistryAssignment = requestedAssignmentId
        ? findRegistryAssignment(requestedAssignmentId)
        : null;
    const unknownRegistryAssignment = Boolean(registry && requestedAssignmentId && !selectedRegistryAssignment);

    const state = {
        user: null,
        submissions: [],
        latestByStudent: [],
        loading: false,
        error: "",
        search: "",
        anonymous: isAnonymousSearchParam()
    };

    function escapeHtml(value) {
        return String(value == null ? "" : value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function trimSlashes(value) {
        return String(value || "homeworkAssignments").replace(/^\/+|\/+$/g, "") || "homeworkAssignments";
    }

    function formatDate(value) {
        const date = value && typeof value.toDate === "function"
            ? value.toDate()
            : new Date(value || 0);
        if (!Number.isFinite(date.getTime())) return "-";
        return new Intl.DateTimeFormat("ko-KR", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }).format(date);
    }

    function normalizeName(value) {
        return String(value || "").trim().replace(/\s+/g, " ");
    }

    function isAnonymousSearchParam() {
        const value = new URLSearchParams(window.location.search).get("anonymous");
        return value === "1" || value === "true" || value === "yes";
    }

    function supportsAnonymousMode() {
        return Boolean(getAssignment().anonymousModeEnabled);
    }

    function isAnonymousModeActive() {
        return supportsAnonymousMode() && state.anonymous;
    }

    function getStudentKey(record) {
        const name = normalizeName(record && (record.displayName || record.studentName));
        return name || String(record && record.id ? record.id : "(이름 없음)");
    }

    function buildDisplayContext(rows) {
        const aliases = new Map();
        let count = 1;

        function add(record) {
            const key = getStudentKey(record);
            if (!aliases.has(key)) {
                aliases.set(key, `학생 ${String(count).padStart(2, "0")}`);
                count += 1;
            }
        }

        rows.forEach(add);
        state.submissions.forEach(add);
        return { aliases };
    }

    function getVisibleStudentName(record, displayContext) {
        const fallback = normalizeName(record && (record.displayName || record.studentName)) || "(이름 없음)";
        if (!isAnonymousModeActive()) return fallback;
        return displayContext.aliases.get(getStudentKey(record)) || "학생";
    }

    function scoreTone(percent) {
        if (percent >= 85) return "high";
        if (percent >= 60) return "mid";
        return "low";
    }

    function normalizeRegistry(source) {
        if (!source || !Array.isArray(source.groups)) return null;
        const groups = source.groups
            .map(function (group) {
                const assignments = Array.isArray(group.assignments)
                    ? group.assignments.map(function (assignment) {
                        return normalizeRegistryAssignment(assignment, group);
                    }).filter(Boolean)
                    : [];
                return Object.assign({}, group, { assignments });
            })
            .filter(function (group) {
                return group.assignments.length > 0;
            });

        if (!groups.length) return null;
        return Object.assign({
            title: "제출 통계",
            description: "수집된 제출 현황을 활동별로 확인합니다."
        }, source, { groups });
    }

    function normalizeRegistryAssignment(assignment, group) {
        if (!assignment || !assignment.assignmentId) return null;
        const title = assignment.title || assignment.assignmentTitle || assignment.assignmentId;
        return Object.assign({}, assignment, {
            assignmentId: String(assignment.assignmentId),
            assignmentTitle: title,
            title,
            chapter: String(assignment.chapter || ""),
            totalQuestions: Number(assignment.totalQuestions) || 0,
            roster: Array.isArray(assignment.roster) ? assignment.roster : [],
            groupId: group.id || "",
            groupTitle: group.title || ""
        });
    }

    function findRegistryAssignment(assignmentId) {
        if (!registry) return null;
        const normalizedId = String(assignmentId || "");
        for (const group of registry.groups) {
            const match = group.assignments.find(function (assignment) {
                return assignment.assignmentId === normalizedId;
            });
            if (match) return match;
        }
        return null;
    }

    function isRegistryMode() {
        return Boolean(registry);
    }

    function getAssignment() {
        if (selectedRegistryAssignment) return selectedRegistryAssignment;
        return Object.assign({
            assignmentId: "c12-review-quiz-v1",
            assignmentTitle: "12과 어휘·문법 복습",
            chapter: "12",
            totalQuestions: 24,
            roster: []
        }, settings.dashboard || {});
    }

    function createMockableClient() {
        if (window.HomeworkDashboardClient) return window.HomeworkDashboardClient;

        let clientPromise = null;

        async function getClient() {
            if (clientPromise) return clientPromise;

            clientPromise = (async function loadClient() {
                const firebaseConfig = settings.firebaseConfig || {};
                if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_")) {
                    throw new Error("Firebase 설정이 없습니다.");
                }

                const [appModule, authModule, firestoreModule] = await Promise.all([
                    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
                    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
                    import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-firestore.js`)
                ]);

                const app = appModule.getApps().length
                    ? appModule.getApp()
                    : appModule.initializeApp(firebaseConfig);
                const auth = authModule.getAuth(app);
                const db = firestoreModule.getFirestore(app);

                return {
                    auth,
                    db,
                    authModule,
                    firestoreModule
                };
            }());

            return clientPromise;
        }

        return {
            async signIn() {
                const client = await getClient();
                const provider = new client.authModule.GoogleAuthProvider();
                const credential = await client.authModule.signInWithPopup(client.auth, provider);
                return credential.user;
            },

            async signOut() {
                const client = await getClient();
                await client.authModule.signOut(client.auth);
            },

            async onAuthStateChanged(callback) {
                const client = await getClient();
                return client.authModule.onAuthStateChanged(client.auth, callback);
            },

            async loadSubmissions() {
                const client = await getClient();
                const assignment = getAssignment();
                const collectionRoot = trimSlashes(settings.collectionRoot);
                const submissionsRef = client.firestoreModule.collection(
                    client.db,
                    collectionRoot,
                    assignment.assignmentId,
                    "submissions"
                );
                const submissionsQuery = client.firestoreModule.query(
                    submissionsRef,
                    client.firestoreModule.orderBy("clientSubmittedAt", "desc")
                );
                const snapshot = await client.firestoreModule.getDocs(submissionsQuery);
                return snapshot.docs.map(function (doc) {
                    return Object.assign({ id: doc.id }, doc.data());
                });
            }
        };
    }

    const client = createMockableClient();

    function buildLatestByStudent(submissions) {
        const seen = new Map();
        submissions.forEach(function (submission) {
            const name = normalizeName(submission.studentName) || "(이름 없음)";
            if (!seen.has(name)) {
                seen.set(name, submission);
            }
        });
        return Array.from(seen.entries()).map(function ([name, submission]) {
            return Object.assign({ displayName: name }, submission);
        });
    }

    function resolveSiteHref(href) {
        const value = String(href || "");
        if (!value || /^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(value)) return value;
        const depth = Math.max(0, window.location.pathname.split("/").filter(Boolean).length - 1);
        return `${"../".repeat(depth)}${value}`;
    }

    function renderRegistryBackLink() {
        if (!isRegistryMode()) return "";
        return `
            <div class="dashboard-context">
                <a href="./index.html">통계 목록</a>
                <span>${escapeHtml(getAssignment().groupTitle || "활동")}</span>
            </div>
        `;
    }

    function renderRegistryGroups() {
        if (!registry) return "";
        return `
            <section class="assignment-picker" aria-label="통계 활동 선택">
                ${registry.groups.map(function (group) {
                    const labelId = `assignmentGroup-${group.id || group.title}`;
                    return `
                        <section class="assignment-group" aria-labelledby="${escapeHtml(labelId)}">
                            <div class="assignment-group__head">
                                <h2 id="${escapeHtml(labelId)}">${escapeHtml(group.title || "활동")}</h2>
                            </div>
                            <div class="assignment-grid">
                                ${group.assignments.map(function (assignment) {
                                    return `
                                        <article class="assignment-card" data-assignment-card="${escapeHtml(assignment.assignmentId)}">
                                            <div class="assignment-card__meta">
                                                <span>${escapeHtml(assignment.chapter || assignment.groupTitle || "통계")}</span>
                                                <b>${assignment.totalQuestions ? `${assignment.totalQuestions}문항` : "문항 수 미정"}</b>
                                            </div>
                                            <h3>${escapeHtml(assignment.title)}</h3>
                                            <p>${escapeHtml(assignment.assignmentId)}</p>
                                            <div class="assignment-card__actions">
                                                <a data-assignment-link="${escapeHtml(assignment.assignmentId)}" href="?assignment=${encodeURIComponent(assignment.assignmentId)}">제출 현황</a>
                                                ${assignment.anonymousModeEnabled ? `<a class="privacy-link" data-assignment-anonymous-link="${escapeHtml(assignment.assignmentId)}" href="?assignment=${encodeURIComponent(assignment.assignmentId)}&anonymous=1">익명 현황</a>` : ""}
                                                ${assignment.activityHref ? `<a href="${escapeHtml(resolveSiteHref(assignment.activityHref))}">활동 열기</a>` : ""}
                                            </div>
                                        </article>
                                    `;
                                }).join("")}
                            </div>
                        </section>
                    `;
                }).join("")}
            </section>
        `;
    }

    function wireAuthButtons() {
        const signInButton = document.getElementById("signInButton");
        if (signInButton) {
            signInButton.addEventListener("click", async function () {
                try {
                    state.error = "";
                    await client.signIn();
                } catch (error) {
                    state.error = error.message || "로그인에 실패했습니다.";
                    if (isRegistryMode() && (!selectedRegistryAssignment || unknownRegistryAssignment)) {
                        renderRegistryHub();
                    } else {
                        renderSignedOut();
                    }
                }
            });
        }

        const signOutButton = document.getElementById("signOutButton");
        if (signOutButton) {
            signOutButton.addEventListener("click", async function () {
                await client.signOut();
            });
        }
    }

    function renderRegistryHub(message) {
        const alert = message || state.error;
        const signedInText = state.user && state.user.email
            ? `${state.user.email}으로 로그인했습니다.`
            : "Google 계정으로 로그인한 뒤 활동별 제출 현황을 확인할 수 있습니다.";
        root.innerHTML = `
            <header class="dashboard-hero">
                <p class="dashboard-eyebrow">Homework Dashboard</p>
                <h1>${escapeHtml(registry.title)}</h1>
                <p>${escapeHtml(registry.description)}</p>
                <p>${escapeHtml(signedInText)}</p>
                <div class="dashboard-actions">
                    ${state.user
                        ? '<button id="signOutButton" class="dashboard-button" type="button">로그아웃</button>'
                        : '<button id="signInButton" class="dashboard-button primary" type="button">Google로 로그인</button>'}
                </div>
            </header>
            ${unknownRegistryAssignment ? `<div class="dashboard-alert">등록되지 않은 통계 항목입니다: ${escapeHtml(requestedAssignmentId)}</div>` : ""}
            ${alert && !unknownRegistryAssignment ? `<div class="dashboard-alert">${escapeHtml(alert)}</div>` : ""}
            ${renderRegistryGroups()}
        `;
        wireAuthButtons();
    }

    function buildWeakQuestions(submissions) {
        const counts = new Map();
        submissions.forEach(function (submission) {
            (submission.questionResults || []).forEach(function (item) {
                if (item.isCorrect) return;
                const number = Number(item.number);
                if (!number) return;
                const previous = counts.get(number) || {
                    number,
                    area: item.area || "",
                    correctAnswer: item.correctAnswer || "",
                    wrongCount: 0,
                    students: []
                };
                previous.wrongCount += 1;
                previous.students.push(normalizeName(submission.studentName));
                counts.set(number, previous);
            });
        });
        return Array.from(counts.values())
            .sort(function (left, right) {
                return right.wrongCount - left.wrongCount || left.number - right.number;
            })
            .slice(0, 8);
    }

    function buildRosterRows(latestRows) {
        const roster = (getAssignment().roster || []).map(normalizeName).filter(Boolean);
        if (!roster.length) return latestRows;

        const latestMap = new Map(latestRows.map(function (row) {
            return [normalizeName(row.displayName || row.studentName), row];
        }));

        return roster.map(function (name) {
            return latestMap.get(name) || {
                displayName: name,
                studentName: name,
                percent: null,
                score: null,
                total: getAssignment().totalQuestions,
                missing: true
            };
        });
    }

    function getFilteredRows(rows, displayContext) {
        const query = state.search.trim().toLowerCase();
        if (!query) return rows;
        return rows.filter(function (row) {
            const searchableName = isAnonymousModeActive()
                ? getVisibleStudentName(row, displayContext)
                : normalizeName(row.displayName || row.studentName);
            return searchableName.toLowerCase().includes(query);
        });
    }

    function averagePercent(rows) {
        const scored = rows.filter(function (row) {
            return typeof row.percent === "number";
        });
        if (!scored.length) return 0;
        return Math.round(scored.reduce(function (sum, row) {
            return sum + row.percent;
        }, 0) / scored.length);
    }

    function renderSummary() {
        const assignment = getAssignment();
        const latestRows = state.latestByStudent;
        const rosterCount = (assignment.roster || []).filter(Boolean).length;
        const submittedCount = latestRows.length;
        const denominator = rosterCount || submittedCount;
        const average = averagePercent(latestRows);
        const topScore = latestRows.reduce(function (max, row) {
            return Math.max(max, Number(row.percent || 0));
        }, 0);

        return `
            <section class="dashboard-summary" aria-label="제출 요약">
                <article class="summary-card">
                    <span>제출 학생</span>
                    <strong>${submittedCount}${denominator ? ` / ${denominator}` : ""}</strong>
                </article>
                <article class="summary-card">
                    <span>전체 제출</span>
                    <strong>${state.submissions.length}</strong>
                </article>
                <article class="summary-card">
                    <span>평균</span>
                    <strong>${average}%</strong>
                </article>
                <article class="summary-card">
                    <span>최고</span>
                    <strong>${topScore}%</strong>
                </article>
            </section>
        `;
    }

    function renderBars(rows, displayContext) {
        if (!rows.length) {
            return '<p class="dashboard-empty">아직 표시할 제출 기록이 없습니다.</p>';
        }
        return `
            <section class="score-bars" aria-label="학생별 최근 점수">
                ${rows.map(function (row) {
                    const percent = Number(row.percent || 0);
                    const tone = row.missing ? "missing" : scoreTone(percent);
                    return `
                        <article class="score-bar is-${tone}">
                            <div class="score-bar__head">
                                <strong>${escapeHtml(getVisibleStudentName(row, displayContext))}</strong>
                                <span>${row.missing ? "미제출" : `${row.score}/${row.total} (${percent}%)`}</span>
                            </div>
                            <div class="score-bar__track">
                                <div class="score-bar__fill" style="width:${row.missing ? 0 : percent}%"></div>
                            </div>
                        </article>
                    `;
                }).join("")}
            </section>
        `;
    }

    function renderWeakQuestions(displayContext) {
        const weakQuestions = buildWeakQuestions(state.submissions);
        if (!weakQuestions.length) {
            return '<p class="dashboard-empty">아직 오답 문항이 없습니다.</p>';
        }

        return `
            <section class="weak-panel" aria-labelledby="weakTitle">
                <h2 id="weakTitle">오답이 많은 문항</h2>
                <div class="weak-list">
                    ${weakQuestions.map(function (item) {
                        const studentText = item.students
                            .filter(Boolean)
                            .slice(0, 4)
                            .map(function (name) {
                                return getVisibleStudentName({ displayName: name }, displayContext);
                            })
                            .join(", ");
                        return `
                            <article class="weak-item">
                                <strong>Q${item.number}</strong>
                                <span>${escapeHtml(item.area || "영역 없음")}</span>
                                <b>${item.wrongCount}명 오답</b>
                                <em>정답: ${escapeHtml(item.correctAnswer || "-")}</em>
                                ${studentText ? `<small>${escapeHtml(studentText)}</small>` : ""}
                            </article>
                        `;
                    }).join("")}
                </div>
            </section>
        `;
    }

    function renderTable(rows, displayContext) {
        if (!rows.length) {
            return '<p class="dashboard-empty">검색 결과가 없습니다.</p>';
        }

        const searchPlaceholder = isAnonymousModeActive() ? "익명 번호 검색" : "이름 검색";
        const searchLabel = isAnonymousModeActive() ? "익명 번호 검색" : "이름 검색";

        return `
            <section class="table-panel" aria-labelledby="tableTitle">
                <div class="panel-head">
                    <h2 id="tableTitle">학생별 최근 제출</h2>
                    <input id="studentSearch" type="search" value="${escapeHtml(state.search)}" placeholder="${escapeHtml(searchPlaceholder)}" aria-label="${escapeHtml(searchLabel)}">
                </div>
                <div class="table-scroll">
                    <table>
                        <thead>
                            <tr>
                                <th>이름</th>
                                <th>상태</th>
                                <th>점수</th>
                                <th>정답률</th>
                                <th>틀린 문제</th>
                                <th>제출 시각</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rows.map(function (row) {
                                const wrong = (row.wrongQuestions || []).join(", ");
                                return `
                                    <tr class="${row.missing ? "is-missing" : ""}">
                                        <td><strong>${escapeHtml(getVisibleStudentName(row, displayContext))}</strong></td>
                                        <td>${row.missing ? "미제출" : "제출"}</td>
                                        <td>${row.missing ? "-" : `${row.score} / ${row.total}`}</td>
                                        <td>${row.missing ? "-" : `${row.percent}%`}</td>
                                        <td>${row.missing ? "-" : escapeHtml(wrong || "없음")}</td>
                                        <td>${row.missing ? "-" : escapeHtml(formatDate(row.clientSubmittedAt || row.submittedAt))}</td>
                                    </tr>
                                `;
                            }).join("")}
                        </tbody>
                    </table>
                </div>
            </section>
        `;
    }

    function renderAllSubmissions(displayContext) {
        if (!state.submissions.length) return "";

        return `
            <details class="all-submissions">
                <summary>전체 제출 기록 보기</summary>
                <div class="submission-list">
                    ${state.submissions.map(function (submission) {
                        return `
                            <article>
                                <strong>${escapeHtml(getVisibleStudentName(submission, displayContext))}</strong>
                                <span>${submission.score}/${submission.total} · ${submission.percent}%</span>
                                <em>${escapeHtml(formatDate(submission.clientSubmittedAt || submission.submittedAt))}</em>
                            </article>
                        `;
                    }).join("")}
                </div>
            </details>
        `;
    }

    function renderSignedOut() {
        if (isRegistryMode() && (!selectedRegistryAssignment || unknownRegistryAssignment)) {
            renderRegistryHub();
            return;
        }

        const assignment = getAssignment();
        root.innerHTML = `
            ${renderRegistryBackLink()}
            <header class="dashboard-hero">
                <p class="dashboard-eyebrow">Homework Dashboard</p>
                <h1>${escapeHtml(assignment.assignmentTitle)} 제출 현황</h1>
                <p>Google 계정으로 로그인하면 Firestore 제출 기록을 표와 그래프로 확인할 수 있습니다.</p>
                <button id="signInButton" class="dashboard-button primary" type="button">Google로 로그인</button>
            </header>
            ${state.error ? `<div class="dashboard-alert">${escapeHtml(state.error)}</div>` : ""}
        `;
        wireAuthButtons();
    }

    function renderAnonymousModeButton() {
        if (!supportsAnonymousMode()) return "";
        const active = isAnonymousModeActive();
        return `
            <button id="anonymousModeToggle" class="dashboard-button privacy" type="button" aria-pressed="${active ? "true" : "false"}">
                ${active ? "익명 모드 끄기" : "익명 모드 켜기"}
            </button>
        `;
    }

    function syncAnonymousUrl() {
        const url = new URL(window.location.href);
        if (isAnonymousModeActive()) {
            url.searchParams.set("anonymous", "1");
        } else {
            url.searchParams.delete("anonymous");
        }
        window.history.replaceState(null, "", url);
    }

    function toggleAnonymousMode() {
        state.anonymous = !isAnonymousModeActive();
        state.search = "";
        syncAnonymousUrl();
        renderDashboard();
    }

    function renderDashboard() {
        if (isRegistryMode() && (!selectedRegistryAssignment || unknownRegistryAssignment)) {
            renderRegistryHub();
            return;
        }

        const assignment = getAssignment();
        if (state.anonymous && !supportsAnonymousMode()) {
            state.anonymous = false;
            syncAnonymousUrl();
        }

        const allRows = buildRosterRows(state.latestByStudent);
        const displayContext = buildDisplayContext(allRows);
        const rows = getFilteredRows(allRows, displayContext);
        root.innerHTML = `
            ${renderRegistryBackLink()}
            <header class="dashboard-hero">
                <p class="dashboard-eyebrow">Homework Dashboard</p>
                <h1>${escapeHtml(assignment.assignmentTitle)} 제출 현황</h1>
                <p>${escapeHtml(state.user && state.user.email ? state.user.email : "교사용 계정")}으로 로그인했습니다.</p>
                <div class="dashboard-actions">
                    <button id="refreshButton" class="dashboard-button primary" type="button">${state.loading ? "불러오는 중..." : "새로고침"}</button>
                    ${renderAnonymousModeButton()}
                    <button id="signOutButton" class="dashboard-button" type="button">로그아웃</button>
                </div>
            </header>
            ${state.error ? `<div class="dashboard-alert">${escapeHtml(state.error)}</div>` : ""}
            ${renderSummary()}
            ${renderBars(rows, displayContext)}
            ${renderWeakQuestions(displayContext)}
            ${renderTable(rows, displayContext)}
            ${renderAllSubmissions(displayContext)}
        `;

        document.getElementById("refreshButton").addEventListener("click", loadAndRender);
        const anonymousToggle = document.getElementById("anonymousModeToggle");
        if (anonymousToggle) {
            anonymousToggle.addEventListener("click", toggleAnonymousMode);
        }
        wireAuthButtons();
        const search = document.getElementById("studentSearch");
        if (search) {
            search.addEventListener("input", function () {
                state.search = search.value;
                renderDashboard();
                const nextSearch = document.getElementById("studentSearch");
                if (nextSearch) {
                    nextSearch.focus();
                    nextSearch.setSelectionRange(nextSearch.value.length, nextSearch.value.length);
                }
            });
        }
    }

    async function loadAndRender() {
        if (isRegistryMode() && (!selectedRegistryAssignment || unknownRegistryAssignment)) {
            renderRegistryHub();
            return;
        }

        if (!state.user) {
            renderSignedOut();
            return;
        }

        state.loading = true;
        state.error = "";
        renderDashboard();
        try {
            state.submissions = await client.loadSubmissions();
            state.latestByStudent = buildLatestByStudent(state.submissions);
        } catch (error) {
            state.error = error.message || "제출 기록을 불러오지 못했습니다.";
        } finally {
            state.loading = false;
            renderDashboard();
        }
    }

    async function init() {
        try {
            await client.onAuthStateChanged(function (user) {
                state.user = user;
                if (user) {
                    void loadAndRender();
                } else {
                    state.submissions = [];
                    state.latestByStudent = [];
                    renderSignedOut();
                }
            });
        } catch (error) {
            state.error = error.message || "대시보드를 시작하지 못했습니다.";
            renderSignedOut();
        }
    }

    void init();
}());
