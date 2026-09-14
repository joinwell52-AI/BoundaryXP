/** Finite, evidence-linked contract analysis. No execution or authority decisions. */
import { boundaryDigest } from './index.ts';
export type Logic = string | { all: Logic[] } | { any: Logic[] } | { not: Logic };
export type Claim = { expr: Logic; quote: string };
export type DecompositionInput = {
  baseline_text: string; plan_text: string;
  variables: { id: string; quote: string }[];
  assumptions: Claim;
  requirements: { id: string; claim: Claim }[];
  tasks: { id: string; requires: Claim; ensures: Claim; covers: string[]; depends_on: string[] }[];
  /** Expression over task IDs; expanded to their promised postconditions. */
  completion: Claim;
};
const fail = (message: string): never => { throw new Error(message); };
function object(x: unknown, keys: string[]): asserts x is Record<string, unknown> {
  if (!x || typeof x !== 'object' || Array.isArray(x) || Object.keys(x).sort().join() !== keys.sort().join()) fail('Invalid object fields');
}
function str(x: unknown): asserts x is string {
  if (typeof x !== 'string' || !x.trim() || x.length > 100000) fail('Invalid text');
}
function array(x: unknown, limit: number): asserts x is unknown[] {
  if (!Array.isArray(x) || x.length > limit) fail('Array exceeds bound');
}
function expression(x: unknown, names: Set<string>, depth = 0, budget = { n: 0 }): void {
  if (++budget.n > 128 || depth > 12) fail('Expression exceeds bound');
  if (typeof x === 'string') { if (!names.has(x)) fail('Unknown expression identifier: ' + x); return; }
  if (!x || typeof x !== 'object' || Array.isArray(x)) fail('Invalid expression');
  const e = x as Record<string, unknown>, keys = Object.keys(e);
  if (keys.length !== 1) fail('Invalid operator');
  if (keys[0] === 'not') expression(e.not, names, depth + 1, budget);
  else if (keys[0] === 'all' || keys[0] === 'any') {
    const values = e[keys[0]]; array(values, 64);
    for (const v of values) expression(v, names, depth + 1, budget);
  } else fail('Unknown operator');
}
function claim(x: unknown, names: Set<string>, text: string): asserts x is Claim {
  object(x, ['expr', 'quote']); str(x.quote);
  if (!text.includes(x.quote)) fail('Claim quote must occur in source');
  expression(x.expr, names);
}
function unique(items: unknown[], field: string): Set<string> {
  const names = new Set<string>();
  for (const item of items) {
    if (!item || typeof item !== 'object') fail('Invalid entry');
    const id = (item as Record<string, unknown>)[field]; str(id);
    if (id.length > 128 || names.has(id)) fail('Duplicate or overlong ID'); names.add(id);
  }
  return names;
}
export function evaluateLogic(e: Logic, value: (id: string) => boolean): boolean {
  if (typeof e === 'string') return value(e);
  if ('all' in e) return e.all.every(x => evaluateLogic(x, value));
  if ('any' in e) return e.any.some(x => evaluateLogic(x, value));
  return !evaluateLogic(e.not, value);
}
export function reviewDecomposition(input: DecompositionInput) {
  object(input, ['baseline_text', 'plan_text', 'variables', 'assumptions', 'requirements', 'tasks', 'completion']);
  str(input.baseline_text); str(input.plan_text);
  array(input.variables, 12); array(input.requirements, 64); array(input.tasks, 64);
  if (!input.requirements.length || !input.tasks.length) fail('Requirements and tasks must be explicit');
  const vars = unique(input.variables, 'id'), reqs = unique(input.requirements, 'id'), tasks = unique(input.tasks, 'id');
  for (const v of input.variables) {
    object(v, ['id', 'quote']); str(v.quote);
    if (!(input.baseline_text + '\n' + input.plan_text).includes(v.quote)) fail('Variable quote must occur in source');
  }
  claim(input.assumptions, vars, input.baseline_text);
  for (const r of input.requirements) { object(r, ['id', 'claim']); claim(r.claim, vars, input.baseline_text); }
  for (const t of input.tasks) {
    object(t, ['id', 'requires', 'ensures', 'covers', 'depends_on']);
    claim(t.requires, vars, input.plan_text); claim(t.ensures, vars, input.plan_text);
    for (const [ids, allowed] of [[t.covers, reqs], [t.depends_on, tasks]] as const) {
      array(ids, 64);
      if (new Set(ids).size !== ids.length || ids.some(id => typeof id !== 'string' || !allowed.has(id))) fail('Unknown or duplicate reference');
    }
  }
  claim(input.completion, tasks, input.plan_text);
  const byId = new Map(input.tasks.map(t => [t.id, t]));
  const states = Array.from({ length: 2 ** vars.size }, (_, mask) => Object.fromEntries([...vars].map((id, j) => [id, Boolean(mask & (1 << j))])));
  const evalAt = (e: Logic, s: Record<string, boolean>) => evaluateLogic(e, id => s[id]!);
  const domain = states.filter(s => evalAt(input.assumptions.expr, s));
  const root = (s: Record<string, boolean>) => input.requirements.every(r => evalAt(r.claim.expr, s));
  const proposed = (s: Record<string, boolean>) => evaluateLogic(input.completion.expr, id => evalAt(byId.get(id)!.ensures.expr, s));
  type Finding = { kind: string; location: string; quotes: string[]; witness: Record<string, boolean> | null; suggestion: string };
  const findings: Finding[] = [];
  const add = (kind: string, location: string, quotes: string[], suggestion: string, witness: Record<string, boolean> | null = null) => findings.push({ kind, location, quotes, witness, suggestion });
  for (const r of input.requirements) if (!input.tasks.some(t => t.covers.includes(r.id)))
    add('requirement_unassigned', r.id, [r.claim.quote], '请说明该要求由谁落实并提供产出依据；关联缺失不等于现实中无人负责。');
  // Find cycles in the submitted wait graph, not a claim about a running system.
  const active = new Set<string>(), done = new Set<string>();
  const visit = (id: string, path: string[]) => {
    if (active.has(id)) { add('dependency_cycle', id, [input.plan_text], '请核查循环等待：' + [...path.slice(path.indexOf(id)), id].join(' → ') + '；区分信息参考与必须完成的前置条件。'); return; }
    if (done.has(id)) return;
    active.add(id); for (const dep of byId.get(id)!.depends_on) visit(dep, [...path, id]); active.delete(id); done.add(id);
  };
  for (const id of tasks) visit(id, []);
  const feasible = domain.filter(proposed);
  if (!domain.length) add('assumptions_inconsistent', 'assumptions', [input.assumptions.quote], '环境关系互相矛盾，请核查；不能把找不到反例当作正确。');
  else {
    if (!domain.some(root)) add('root_inconsistent', 'requirements', input.requirements.map(r => r.claim.quote), '原要求在给定模型下无法同时满足，请核查映射与要求。');
    if (!feasible.length) add('plan_inconsistent', 'completion', [input.completion.quote], '子任务产出组合不可满足，请核查；不作空真通过。');
    const lost = domain.find(s => root(s) && !proposed(s));
    const missing = feasible.find(s => !root(s));
    if (missing) add('delivery_gap', 'completion', [input.completion.quote, ...input.requirements.map(r => r.claim.quote)], '各项承诺产出可满足，但原交付仍缺失。请核查遗漏的交付义务与承担者。', missing);
    if (lost) add('additional_completion_condition', 'completion', [input.completion.quote], '原交付可满足但规划组合不满足。请解释额外前提的必要性或授权依据；合理内部步骤不自动视为越权。', lost);
    for (const t of input.tasks) {
      const upstream = domain.filter(s => t.depends_on.every(id => evalAt(byId.get(id)!.ensures.expr, s)));
      if (!upstream.length) add('upstream_inconsistent', t.id, [t.requires.quote], '上游承诺无法同时满足，请核查接口，不能以无反例视为输入齐备。');
      else {
        const gap = upstream.find(s => !evalAt(t.requires.expr, s));
        if (gap) add('input_gap', t.id, [t.requires.quote, ...t.depends_on.map(id => byId.get(id)!.ensures.quote)], '已声明上游产出和环境关系不足以保证输入。请补充产物、版本或已确认外部输入依据。', gap);
      }
    }
  }
  return { schema: 'task-boundary-review/v1' as const, version: '1.0.0', analysis_kind: 'decomposition/v1', business_decision: null,
    source_sha256: boundaryDigest(input), baseline_sha256: boundaryDigest({ text: input.baseline_text, variables: input.variables, requirements: input.requirements, assumptions: input.assumptions }),
    semantic_status: 'requires_human_review' as const, findings: findings.map(f => ({
      ...f, id: boundaryDigest({ input: boundaryDigest(input), finding: f }), source_quote: f.quotes.join('\n'),
      baseline_quote: input.baseline_text, basis: f.kind, consequence: '模型内存在需核查的任务分解关系。', decision_owner: 'TASK_OWNER' as const,
    })),
    calculation_status: domain.length && domain.some(root) && feasible.length ? 'evaluated' : 'inconsistent_model',
    enumerated_states: states.length, feasible_plan_states: feasible.length,
    assumptions: '原文到符号的映射由调用方提供；布尔状态不是实际执行现场；完成表达式按各任务承诺产出解释，覆盖关联不证明实现正确。',
    response_required: true };
}
