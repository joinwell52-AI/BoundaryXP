import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LEGACY_BOUNDARY_PARAMETERS, boundaryDigest, reviewBoundaryXP, reviewPlanBoundary,
  boundaryResponseStatus, validateBoundaryReply, type BoundaryText,
  compareBoundaryConditions,
} from "../legacy/index.ts";

const text = "检查产品并向 ADMIN 提交报告；PM 负责；版本 abc；预算 1 小时；发现问题提交建议。";
const base = (): BoundaryText => ({ text,
  parameters: Object.fromEntries(LEGACY_BOUNDARY_PARAMETERS.map(k => [k, text])),
  actions: [{ actor: "PM", verb: "检查", target: "产品", quote: "检查产品" }],
  completion: [{ id: "report", quote: "向 ADMIN 提交报告" }],
});
test("ADMIN missing projection receives actionable suggestions, never invented authorization", () => {
  const result = reviewBoundaryXP({ text, parameters: {}, actions: [], completion: [] });
  assert.equal(result.findings.filter(f => f.kind === "parameter_unmapped").length, 7);
  assert.ok(result.findings.every(f => f.suggestion && f.basis && f.consequence && f.decision_owner === "TASK_AUTHORIZER"));
  assert.equal(result.business_decision, null);
  assert.equal(result.semantic_status, "requires_human_review");
});
test("quoted fields must be grounded and well-shaped", () => {
  assert.throws(() => reviewBoundaryXP({ ...base(), parameters: { I: "伪造引用" } }), /quote/);
  assert.throws(() => reviewBoundaryXP({ ...base(), actions: [{ actor: "PM", verb: "修复", target: "产品", quote: "不存在" }] }), /quote/);
  assert.throws(() => reviewBoundaryXP({ ...base(), completion: [{ id: "x", quote: "不存在" }] }), /quote/);
});
test("inspection-to-repair identifies specific action and completion deltas", () => {
  const doc = base(); doc.text += "必须修复并复测通过才能汇报。";
  doc.actions.push({ actor: "DEV", verb: "修复", target: "产品", quote: "必须修复" });
  doc.completion.push({ id: "repaired", quote: "修复并复测通过才能汇报" });
  const review = reviewPlanBoundary(base(), { document: doc, tasks: [] });
  assert.deepEqual(review.findings.map(f => f.kind), ["action_difference", "completion_difference"]);
  assert.ok(review.findings.every(f => f.source_quote && f.suggestion.includes("任务授权方")));
  assert.equal(review.business_decision, null);
});
test("child-task expansion and cycle are observed without lifecycle decision", () => {
  const child = base(); child.actions[0]!.actor = "DEV";
  const result = reviewPlanBoundary(base(), { document: base(), tasks: [
    { id: "a", document: child, depends_on: ["b"] }, { id: "b", document: base(), depends_on: ["a", "external"] },
  ] });
  assert.ok(result.findings.some(f => f.kind === "action_difference" && f.location === "a.actions"));
  assert.ok(result.findings.some(f => f.kind === "dependency_cycle"));
  assert.ok(result.findings.some(f => f.kind === "dependency_unknown"));
  assert.equal(result.business_decision, null);
});
test("unchanged projection is not claimed as semantic proof", () => {
  const result = reviewPlanBoundary(base(), { document: base(), tasks: [] });
  assert.equal(result.findings.length, 0);
  assert.equal(result.semantic_status, "requires_human_review");
});
test("omission and condition reuse with altered text remain visible", () => {
  const changed = base(); changed.completion = [{ id: "report", quote: "发现问题提交建议" }];
  assert.equal(reviewPlanBoundary(base(), { document: changed, tasks: [] }).findings[0]!.kind, "completion_difference");
  changed.completion = [];
  assert.ok(reviewPlanBoundary(base(), { document: changed, tasks: [] }).findings.some(f => f.kind === "completion_omission"));
});
test("PM cannot silently ignore a finding or equate response with resolution", () => {
  const doc = base(); doc.parameters = {};
  const review = reviewPlanBoundary(base(), { document: doc, tasks: [] });
  assert.equal(boundaryResponseStatus(review, []).pending_finding_ids.length, 7);
  const replies = review.findings.map(f => ({ finding_id: f.id, disposition: "not_accepted" as const,
    reason: "原任务已规定，见对应原文；此处需补映射而非改授权。", references: ["ADMIN-task#scope"] }));
  assert.equal(boundaryResponseStatus(review, replies.slice(0, 1)).response_status, "awaiting_response");
  const status = boundaryResponseStatus(review, replies);
  assert.equal(status.response_status, "responded");
  assert.equal(status.resolution_status, "not_adjudicated");
  assert.equal(status.business_decision, null);
  assert.throws(() => validateBoundaryReply({ ...replies[0], reason: "" }, review));
  assert.throws(() => validateBoundaryReply({ ...replies[0], disposition: "accepted", references: [] }, review), /reference/);
  assert.throws(() => validateBoundaryReply({ ...replies[0], finding_id: "invented" }, review), /Unknown finding/);
  assert.throws(() => boundaryResponseStatus({ findings: [] } as never, []), /Invalid review/);
  assert.throws(() => boundaryResponseStatus(review, null as never), /Invalid replies/);
});
test("bounded inputs, duplicate nodes and stable hashes", () => {
  assert.equal(boundaryDigest({ b: 1, a: 2 }), boundaryDigest({ a: 2, b: 1 }));
  assert.throws(() => reviewPlanBoundary(base(), { document: base(), tasks: Array.from({ length: 65 }, () => ({ id: "a", document: base(), depends_on: [] })) }));
  assert.throws(() => reviewPlanBoundary(base(), { document: base(), tasks: [1, 2].map(() => ({ id: "a", document: base(), depends_on: [] })) }), /Duplicate/);
});
test("finite-set completion witnesses agree with Boolean evaluation over all 64 set pairs", () => {
  const names = ["report", "repair", "authorization"];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
    const before = names.filter((_, k) => i & (1 << k));
    const after = names.filter((_, k) => j & (1 << k));
    const delta = compareBoundaryConditions(before, after);
    for (const [witness, oldValue, newValue] of [[delta.tightening_witness, true, false], [delta.relaxation_witness, false, true]] as const) {
      if (!witness) continue;
      assert.equal(before.every(k => witness.values[k]), oldValue);
      assert.equal(after.every(k => witness.values[k]), newValue);
      assert.equal(witness.baseline_complete, oldValue);
      assert.equal(witness.proposed_complete, newValue);
    }
    assert.equal(Boolean(delta.tightening_witness), after.some(k => !before.includes(k)));
    assert.equal(Boolean(delta.relaxation_witness), before.some(k => !after.includes(k)));
  }
});
test("English and Chinese rendering preserve finding IDs, evidence and Boolean witness values", () => {
  const baseline: BoundaryText = { text: "Inspect system. Report findings.", parameters: {},
    actions: [{ actor: "owner", verb: "inspect", target: "system", quote: "Inspect system" }],
    completion: [{ id: "report", quote: "Report findings" }] };
  const document: BoundaryText = { ...baseline, text: baseline.text + " Repair before reporting.",
    actions: [...baseline.actions, { actor: "developer", verb: "repair", target: "system", quote: "Repair before reporting" }],
    completion: [...baseline.completion, { id: "repair", quote: "Repair before reporting" }] };
  const plan = { document, tasks: [{ id: "a", document, depends_on: ["a", "external"] }] };
  const zh = reviewPlanBoundary(baseline, plan, { locale: "zh-CN" });
  const en = reviewPlanBoundary(baseline, plan, { locale: "en" });
  assert.equal(en.locale, "en");
  assert.equal(en.source_sha256, zh.source_sha256);
  assert.deepEqual(en.findings.map(f => f.id), zh.findings.map(f => f.id));
  assert.deepEqual(en.findings.map(f => [f.source_quote, f.baseline_quote]), zh.findings.map(f => [f.source_quote, f.baseline_quote]));
  assert.deepEqual(en.findings.map(f => f.symbolic_counterexample?.values), zh.findings.map(f => f.symbolic_counterexample?.values));
  assert.ok(en.findings.every(f => !/[\u4e00-\u9fff]/.test(f.suggestion)));
  assert.ok(zh.findings.some(f => /[\u4e00-\u9fff]/.test(f.suggestion)));
  assert.equal(reviewBoundaryXP(baseline, { locale: "en" }).findings[0]!.decision_owner, "TASK_AUTHORIZER");
  assert.throws(() => reviewBoundaryXP(baseline, { locale: "xx" as never }), /Unsupported locale/);
});
