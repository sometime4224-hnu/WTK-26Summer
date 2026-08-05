export const ANSWER_STATES = Object.freeze({ target: "target", conditional: "conditional", discouraged: "discouraged", incorrect: "incorrect", unscored: "unscored" });
const same = (a, b) => Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((v, i) => v === b[i]);
export function evaluateItem(item, response) {
  if (response === undefined || response === null || response === "") return { answered: false, correct: false, state: "unscored" };
  if (item.type === "short") return { answered: String(response).trim().length > 0, correct: false, state: "unscored" };
  if (item.type === "sequence") {
    if ((item.answerSpec.accepted ?? []).some((answer) => same(answer, response))) return { answered: true, correct: true, state: "target" };
    const alternative = (item.answerSpec.alternatives ?? []).find((answer) => same(answer.value, response));
    return { answered: true, correct: false, state: alternative?.state ?? "incorrect" };
  }
  const state = item.options?.find((option) => option.value === response)?.state ?? "incorrect";
  return { answered: true, correct: state === "target" && item.answerSpec.accepted.includes(response), state };
}
export function summarizeItems(items, responses) {
  const results = items.map((item) => evaluateItem(item, responses[item.id]?.value));
  return { total: items.length, answered: results.filter((r) => r.answered).length, correct: results.filter((r) => r.correct).length, states: results.reduce((all, r) => ({ ...all, [r.state]: (all[r.state] ?? 0) + 1 }), {}) };
}
export function recommendTransferItems(items, errorTags = []) {
  const transfer = items.filter((item) => item.track === "transfer");
  const wanted = [...new Set(errorTags)];
  const selected = [];
  const skills = new Set();
  for (const tag of wanted) {
    const item = transfer.find((candidate) => candidate.normalizedFeedbackCodes.includes(tag) && !skills.has(candidate.tags.targetSkill));
    if (item) { selected.push(item); skills.add(item.tags.targetSkill); }
  }
  for (const item of [...transfer].sort((a, b) => a.id.localeCompare(b.id))) {
    if (selected.length >= 5) break;
    if (!skills.has(item.tags.targetSkill)) { selected.push(item); skills.add(item.tags.targetSkill); }
  }
  return selected.slice(0, 5);
}
