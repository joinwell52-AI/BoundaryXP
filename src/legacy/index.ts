import { createHash } from "node:crypto";
export * from "./decomposition.ts";
export * from "./schemas.ts";
import { localizeBoundaryReview, type BoundaryReviewOptions, type BoundaryLocale } from "./localization.ts";
export type { BoundaryReviewOptions, BoundaryLocale } from "./localization.ts";

export const LEGACY_REVIEW_SCHEMA_VERSION = "1.0.0";
export const LEGACY_BOUNDARY_PARAMETERS = ["I", "O", "A", "P", "R", "V", "C"] as const;
export type BoundaryParameter = typeof LEGACY_BOUNDARY_PARAMETERS[number];
export type BoundaryText = {
  text: string;
  /** Exact source excerpts, not generated requirements. Missing means unknown. */
  parameters: Partial<Record<BoundaryParameter, string>>;
  actions: Array<{ actor: string; verb: string; target: string; quote: string }>;
  completion: Array<{ id: string; quote: string }>;
};
export type BoundaryPlan = {
  document: BoundaryText;
  tasks: Array<{ id: string; document: BoundaryText; depends_on: string[] }>;
};
export type BoundaryFinding = {
  id: string;
  kind: string;
  location: string;
  source_quote: string;
  baseline_quote: string | null;
  basis: string;
  consequence: string;
  suggestion: string;
  decision_owner: "TASK_AUTHORIZER" | "TASK_OWNER";
  symbolic_counterexample?: { assumptions: string; values: Record<string, boolean>; baseline_complete: boolean; proposed_complete: boolean };
};
export type BoundaryReview = {
  locale?: BoundaryLocale;
  schema: "task-boundary-review/v1";
  version: string;
  source_sha256: string;
  baseline_sha256: string | null;
  findings: BoundaryFinding[];
  business_decision: null;
  semantic_status: "requires_human_review";
  response_required: boolean;
};

export function boundaryDigest(value: unknown): string {
  const canonical = (v: unknown): unknown => Array.isArray(v) ? v.map(canonical)
    : v && typeof v === "object" ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b, "en")).map(([k, x]) => [k, canonical(x)])) : v;
  return createHash("sha256").update(JSON.stringify(canonical(value))).digest("hex");
}
function requireValue(ok: unknown, message: string): asserts ok { if (!ok) throw new Error(message); }
function record(value: unknown): asserts value is Record<string, unknown> {
  requireValue(value && typeof value === "object" && !Array.isArray(value), "Expected object");
}
function nonempty(value: unknown, max = 512): asserts value is string {
  requireValue(typeof value === "string" && value.trim().length > 0 && value.length <= max, "Expected bounded nonempty text");
}
export function validateBoundaryText(value: unknown): asserts value is BoundaryText {
  record(value); nonempty(value.text, 100_000); record(value.parameters);
  requireValue(Object.keys(value).every(k => ["text", "parameters", "actions", "completion"].includes(k)), "Unknown document field");
  for (const [key, quote] of Object.entries(value.parameters)) {
    requireValue(LEGACY_BOUNDARY_PARAMETERS.includes(key as BoundaryParameter), "Unknown parameter");
    nonempty(quote, 10_000); requireValue(value.text.includes(quote), "Parameter quote must occur in source text");
  }
  requireValue(Array.isArray(value.actions) && value.actions.length <= 128, "Invalid actions");
  const actions = new Set<string>();
  for (const action of value.actions) {
    record(action);
    requireValue(Object.keys(action).sort().join() === "actor,quote,target,verb", "Invalid action fields");
    for (const key of ["actor", "verb", "target", "quote"]) nonempty(action[key], key === "quote" ? 10_000 : 512);
    requireValue(value.text.includes(action.quote as string), "Action quote must occur in source text");
    const id = JSON.stringify([action.actor, action.verb, action.target]);
    requireValue(!actions.has(id), "Duplicate action"); actions.add(id);
  }
  requireValue(Array.isArray(value.completion) && value.completion.length <= 128, "Invalid completion conditions");
  const ids = new Set<string>();
  for (const condition of value.completion) {
    record(condition); nonempty(condition.id); nonempty(condition.quote, 10_000);
    requireValue(Object.keys(condition).sort().join() === "id,quote", "Invalid completion fields");
    requireValue(value.text.includes(condition.quote), "Condition quote must occur in source text");
    requireValue(!ids.has(condition.id), "Duplicate condition"); ids.add(condition.id);
  }
}
const prompts: Record<BoundaryParameter, string> = {
  I: "请明确检查对象、输入文件或数据范围，并引用原文；例如：检查对象为【目录/实例/时间范围】。",
  O: "请明确交付物与接收人；例如：向 任务授权方 提交包含发现、证据、限制和建议的报告。",
  A: "请明确本次允许的动作；例如：执行检查并提出建议，产品修改另行申请授权。候选条款由 任务授权方 确认。",
  P: "请明确负责人、执行角色和独立观察角色；例如：任务负责人 拆分协调，独立观察者 由其独立授权方安排。",
  R: "请补充时间、调用量或费用上限；例如：超过【预算/期限】前提交资源申请。数值由 任务授权方 决定。",
  V: "请明确原任务版本、证据时间与来源；例如：以【版本/提交号】为检查基线，引用可复核证据。",
  C: "请明确完成与停止条件；例如：完成约定检查并提交报告即可交付，发现产品问题不自动新增修复条件。由 任务授权方 确认。",
};
function finding(review: BoundaryReview, item: Omit<BoundaryFinding, "id">) {
  review.findings.push({ id: boundaryDigest(item), ...item });
}
function gaps(review: BoundaryReview, document: BoundaryText, location: string, owner: "TASK_AUTHORIZER" | "TASK_OWNER") {
  for (const key of LEGACY_BOUNDARY_PARAMETERS) if (!document.parameters[key]) finding(review, {
    kind: "parameter_unmapped", location: `${location}.parameters.${key}`, source_quote: "", baseline_quote: null,
    basis: `未提供 ${key} 的原文映射，不能据此断言原文没有该要求。`,
    consequence: "执行者可能自行补全要求，形成不同理解。",
    suggestion: `${prompts[key]} 若原文已有说明，请补充对应原文引用；不得把候选措辞自动当作授权。`, decision_owner: owner,
  });
  if (!document.actions.length || !document.completion.length) finding(review, {
    kind: "projection_incomplete", location, source_quote: "", baseline_quote: null,
    basis: "动作或完成条件未映射，无法进行集合差异比较。", consequence: "未发现差异不能表示边界一致。",
    suggestion: "请逐条提供动作（角色、动作、对象）和完成条件及原文引用；保留无法确定的项目并向 任务授权方 澄清。", decision_owner: owner,
  });
}
function review(source: unknown, baseline: BoundaryText | null, pm: boolean): BoundaryReview {
  return { schema: "task-boundary-review/v1", version: LEGACY_REVIEW_SCHEMA_VERSION, source_sha256: boundaryDigest(source),
    baseline_sha256: baseline ? boundaryDigest(baseline) : null, findings: [], business_decision: null,
    semantic_status: "requires_human_review", response_required: pm };
}
/** B0 = conjunction(before), B1 = conjunction(after). This proves symbolic, not linguistic, change. */
export function compareBoundaryConditions(before: string[], after: string[]) {
  if (before.length > 128 || after.length > 128 || [...before, ...after].some(x => typeof x !== "string" || !x.trim())) throw new Error("Invalid condition sets");
  const old = new Set(before), next = new Set(after);
  const added = [...next].filter(x => !old.has(x)), removed = [...old].filter(x => !next.has(x));
  const witness = (falseId: string | undefined) => {
    if (falseId === undefined) return null;
    const values = Object.fromEntries([...new Set([...old, ...next])].map(x => [x, x !== falseId]));
    return { assumptions: "各标识含义一致、条件相互独立且完成条件按逻辑与解释；仅为符号反例，需核查原文投影。", values,
      baseline_complete: [...old].every(x => values[x]), proposed_complete: [...next].every(x => values[x]) };
  };
  return { added, removed, tightening_witness: witness(added[0]), relaxation_witness: witness(removed[0]) };
}
export function reviewBoundaryXP(document: BoundaryText, options: BoundaryReviewOptions = {}): BoundaryReview {
  validateBoundaryText(document);
  const result = review(document, null, false); gaps(result, document, "document", "TASK_AUTHORIZER");
  return localizeBoundaryReview(result, options);
}
/** Exact symbolic comparison only. Labels are a semantic projection, never proof of authority. */
export function reviewPlanBoundary(baseline: BoundaryText, plan: BoundaryPlan, options: BoundaryReviewOptions = {}): BoundaryReview {
  validateBoundaryText(baseline); record(plan); validateBoundaryText(plan.document);
  requireValue(Object.keys(plan).sort().join() === "document,tasks", "Invalid plan fields");
  requireValue(Array.isArray(plan.tasks) && plan.tasks.length <= 64, "Invalid task graph");
  const ids = new Set<string>();
  for (const task of plan.tasks) {
    record(task); nonempty(task.id); validateBoundaryText(task.document);
    requireValue(Object.keys(task).sort().join() === "depends_on,document,id", "Invalid task fields");
    requireValue(!ids.has(task.id), "Duplicate task id"); ids.add(task.id);
    requireValue(Array.isArray(task.depends_on) && task.depends_on.length <= 64 && task.depends_on.every(x => typeof x === "string"), "Invalid dependencies");
  }
  const result = review(plan, baseline, true);
  for (const parameter of LEGACY_BOUNDARY_PARAMETERS) {
    const before = baseline.parameters[parameter], after = plan.document.parameters[parameter];
    if (before && after && before !== after) finding(result, {
      kind: "parameter_difference", location: `plan.parameters.${parameter}`, source_quote: after, baseline_quote: before,
      basis: `${parameter} 的引用文本与 任务授权方 基线不同。文本变化不等于语义越界，需要 任务负责人 解释对应关系。`,
      consequence: "可能改变目标、资源、责任或交付约束，也可能只是等价转述。",
      suggestion: `请说明 ${parameter} 的前后表述是否等价并给出依据。若增加或删改了原要求，请保留原要求或提交 任务授权方 变更申请。${prompts[parameter]}`, decision_owner: "TASK_OWNER",
    });
  }
  const key = (a: BoundaryText["actions"][number]) => JSON.stringify([a.actor, a.verb, a.target]);
  const allowed = new Set(baseline.actions.map(key));
  const documents = [{ id: "plan", document: plan.document }, ...plan.tasks];
  for (const node of documents) {
    gaps(result, node.document, node.id, "TASK_OWNER");
    for (const action of node.document.actions) if (!allowed.has(key(action))) finding(result, {
      kind: "action_difference", location: `${node.id}.actions`, source_quote: action.quote,
      baseline_quote: baseline.parameters.A ?? null,
      basis: `动作元组 ${key(action)} 不在 任务授权方 基线映射集合中；可能是合理细化、别名差异或范围扩张，尚未裁决。`,
      consequence: "子任务执行可能扩大原任务范围，不能凭此认定已经发生越权操作。",
      suggestion: "请解释该动作与原任务的必要关系并引用依据。若原任务仅要求检查，而此处要求修复，建议改为“核验问题、提交证据和修复建议”；确需修复时另向 任务授权方 申请授权。", decision_owner: "TASK_OWNER",
    });
  }
  const oldConditions = new Map(baseline.completion.map(c => [c.id, c.quote]));
  const newConditions = new Map(plan.document.completion.map(c => [c.id, c.quote]));
  const conditionDelta = compareBoundaryConditions([...oldConditions.keys()], [...newConditions.keys()]);
  for (const [id, quote] of newConditions) if (!oldConditions.has(id) || oldConditions.get(id) !== quote) finding(result, {
    kind: "completion_difference", location: "plan.completion", source_quote: quote, baseline_quote: oldConditions.get(id) ?? baseline.parameters.C ?? null,
    basis: `完成条件 ${id} 新增或原文发生变化。合取条件集合增加会收紧交付条件，但文字含义仍需核查。`,
    consequence: "可能把“检查并汇报”改为“修复完成才能汇报”。",
    suggestion: "请对照 任务授权方 的交付条件解释此项。若只是处理建议，建议移到报告建议部分；若确需成为完成前提，请单独申请 任务授权方 确认。", decision_owner: "TASK_OWNER",
    ...(!oldConditions.has(id) && conditionDelta.tightening_witness ? { symbolic_counterexample: compareBoundaryConditions([...oldConditions.keys()], [...oldConditions.keys(), id]).tightening_witness! } : {}),
  });
  for (const [id, quote] of oldConditions) if (!newConditions.has(id)) finding(result, {
    kind: "completion_omission", location: "plan.completion", source_quote: "", baseline_quote: quote,
    basis: `原任务完成条件 ${id} 未映射到 任务负责人 规划。`, consequence: "可能漏交付，也可能仅更换了条件标识。",
    suggestion: "请补回原完成条件及引用，或说明它对应哪项现有条件；如需删除原要求，请向 任务授权方 申请变更。", decision_owner: "TASK_OWNER",
    ...(conditionDelta.relaxation_witness ? { symbolic_counterexample: compareBoundaryConditions([...newConditions.keys(), id], [...newConditions.keys()]).relaxation_witness! } : {}),
  });
  const graph = new Map(plan.tasks.map(t => [t.id, t.depends_on]));
  for (const task of plan.tasks) for (const dependency of task.depends_on) {
    if (!ids.has(dependency)) finding(result, {
      kind: "dependency_unknown", location: `${task.id}.depends_on`, source_quote: dependency, baseline_quote: null,
      basis: "依赖节点不在本次提交的图中。", consequence: "执行者无法确认等待对象与完成证据。",
      suggestion: `请为依赖 ${dependency} 补充任务标识、责任人和完成证据；若为外部依赖，请明确其来源和等待条件。`, decision_owner: "TASK_OWNER",
    });
  }
  const visiting = new Set<string>(), done = new Set<string>();
  const visit = (id: string, path: string[]) => {
    if (visiting.has(id)) {
      const cycle = [...path.slice(path.indexOf(id)), id];
      finding(result, { kind: "dependency_cycle", location: "tasks", source_quote: cycle.join(" → "), baseline_quote: null,
        basis: "依赖图存在有向环；如果这些边都是完成前置条件，图中任务无法按该顺序启动。",
        consequence: "可能形成循环等待；不代表实际运行已死锁。",
        suggestion: "请核查环上的每条依赖，将信息参考与必须等待的前置条件分开，提出可启动的顺序或解释已有满足条件。", decision_owner: "TASK_OWNER" }); return;
    }
    if (done.has(id)) return;
    visiting.add(id); for (const dep of graph.get(id) ?? []) if (ids.has(dep)) visit(dep, [...path, id]);
    visiting.delete(id); done.add(id);
  };
  for (const id of ids) visit(id, []);
  return localizeBoundaryReview(result, options);
}

export type BoundaryReply = {
  finding_id: string;
  disposition: "accepted" | "partially_accepted" | "not_accepted" | "needs_admin";
  reason: string;
  references: string[];
};
export function validateBoundaryReply(reply: unknown, review: BoundaryReview): asserts reply is BoundaryReply {
  record(reply);
  requireValue(Object.keys(reply).sort().join() === "disposition,finding_id,reason,references", "Invalid reply fields");
  requireValue(review.findings.some(f => f.id === reply.finding_id), "Unknown finding");
  requireValue(["accepted", "partially_accepted", "not_accepted", "needs_admin"].includes(String(reply.disposition)), "Invalid reply disposition");
  nonempty(reply.reason, 10_000);
  requireValue(Array.isArray(reply.references) && reply.references.length <= 32, "Invalid reply references");
  for (const ref of reply.references) nonempty(ref, 2000);
  requireValue(reply.references.length > 0, "Provide source, changed-text or 任务授权方-request reference; acknowledgment alone is insufficient");
}

export function boundaryResponseStatus(review: BoundaryReview, replies: BoundaryReply[]) {
  record(review);
  requireValue(review.schema === "task-boundary-review/v1" && review.version === LEGACY_REVIEW_SCHEMA_VERSION
    && review.business_decision === null && review.semantic_status === "requires_human_review"
    && typeof review.response_required === "boolean"
    && typeof review.source_sha256 === "string" && /^[a-f0-9]{64}$/.test(review.source_sha256), "Invalid review envelope");
  requireValue(Array.isArray(review.findings) && review.findings.length <= 16384, "Invalid review findings");
  for (const entry of review.findings) {
    record(entry); requireValue(typeof entry.id === "string" && /^[a-f0-9]{64}$/.test(entry.id), "Invalid finding id");
  }
  requireValue(Array.isArray(replies) && replies.length <= 16384, "Invalid replies");
  for (const reply of replies) validateBoundaryReply(reply, review);
  const answered = new Set(replies.map(r => r.finding_id));
  return { pending_finding_ids: review.findings.filter(f => !answered.has(f.id)).map(f => f.id),
    response_status: review.findings.every(f => answered.has(f.id)) ? "responded" : "awaiting_response",
    resolution_status: "not_adjudicated", business_decision: null };
}
