import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { isDeepStrictEqual } from 'node:util';
import { evaluateTask, PROTOCOL_VERSION } from '../../src/bxp/evaluate.mjs';
import { hardeningCases, verifyHardening } from './hardening-cases.mjs';
import { validateTaskSchema, validateSuiteSchema } from '../../src/bxp/validation.mjs';

import { CONFORMANCE_SUITE_VERSION } from '../../src/bxp/index.mjs';
export const SUITE_VERSION = CONFORMANCE_SUITE_VERSION;
const here = new URL('./', import.meta.url);
const index = JSON.parse(readFileSync(new URL('../benchmarks/source-index.json', here), 'utf8'));
const ELEMENTS = ['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B'];
const KINDS = { I: 'input', O: 'output', A: 'action', P: 'actor', R: 'resource',
  V: 'provenance', C: 'completion', B: 'boundary' };

function cpLength(value) {
  return Array.from(value).length;
}

function span(source, quote = source, start = 0) {
  return { quote, start, end: start + cpLength(quote) };
}

function constraints(value = {}) {
  return {
    intervals: value.intervals || [],
    target_sets: value.target_sets || [],
    handoffs: value.handoffs || [],
    dependencies: (value.dependencies || []).map((edge, index) => ({ id: `dep-${index + 1}`, ...edge })),
    logic: value.logic || [],
  };
}

function task({ id, source, required, resolved = required, unresolved = [], value = {}, extensions = {} }) {
  const evidence = [span(source)];
  const resolvedSet = new Set(resolved);
  const unresolvedSet = new Set(unresolved);
  const buckets = {};
  for (const key of ELEMENTS) {
    if (unresolvedSet.has(key)) {
      buckets[key] = {
        status: 'unresolved',
        entries: [{ id: `${id}-${key.toLowerCase()}`, kind: KINDS[key], text: key, evidence }],
        reason_codes: ['BXP.IDENTITY.MULTIPLE_CANDIDATES'],
      };
    } else if (resolvedSet.has(key)) {
      buckets[key] = {
        status: 'resolved',
        entries: [{ id: `${id}-${key.toLowerCase()}`, kind: KINDS[key], text: key, evidence }],
      };
    } else {
      buckets[key] = { status: 'absent', entries: [] };
    }
  }
  return {
    schema: 'boundx-task/v1',
    protocol_version: PROTOCOL_VERSION,
    task_id: id,
    source: { language: 'en', text: source },
    profile: { id: 'org.boundx.conformance/calc-v1', required_elements: required },
    elements: buckets,
    constraints: constraints(value),
    extensions,
  };
}

function interval(id, subject, dimension, unit, lower, upper, evidence) {
  return { id, subject, dimension, unit, lower, upper, evidence };
}

function patternTask(family, serial) {
  const suffix = String(serial).padStart(4, '0');
  const n = 10 + (serial % 89);
  if (family === 'incomplete') {
    return task({ id: `calc-${suffix}`, source: `Case ${suffix} declares input only.`,
      required: ['I', 'P', 'B'], resolved: ['I'] });
  }
  if (family === 'interval-empty') {
    const source = `Case ${suffix}: lower bound exceeds upper bound.`;
    const evidence = [span(source)];
    return task({ id: `calc-${suffix}`, source, required: ['R'], value: { intervals: [
      interval(`lower-${suffix}`, `budget-${suffix}`, 'count', 'item',
        { value: n + 5, inclusive: true }, null, evidence),
      interval(`upper-${suffix}`, `budget-${suffix}`, 'count', 'item',
        null, { value: n, inclusive: serial % 2 === 0 }, evidence),
    ] } });
  }
  if (family === 'orthogonal-intervals') {
    const source = `Case ${suffix}: duration and storage are independent.`;
    const evidence = [span(source)];
    return task({ id: `calc-${suffix}`, source, required: ['R'], value: { intervals: [
      interval(`duration-${suffix}`, `job-${suffix}`, 'duration', 'second',
        { value: 0, inclusive: true }, { value: n * 10, inclusive: true }, evidence),
      interval(`storage-${suffix}`, `job-${suffix}`, 'digital_storage', 'gigabyte',
        { value: 0, inclusive: true }, { value: n, inclusive: false }, evidence),
    ] } });
  }
  if (family === 'target-overlap') {
    const source = `Case ${suffix}: requested and forbidden target overlap.`;
    const evidence = [span(source)];
    const target = `protected-${suffix}`;
    return task({ id: `calc-${suffix}`, source, required: ['I', 'B'], value: { target_sets: [{
      id: `target-${suffix}`, universe: 'repository_object', effect: 'modify',
      actor_scope: `agent-${suffix}`, guard_context: 'default', identity_status: 'resolved',
      requested: [`ordinary-${suffix}`, target], forbidden: [target], evidence,
    }] } });
  }
  if (family === 'target-unresolved') {
    const source = `Case ${suffix}: target identity has multiple candidates.`;
    const evidence = [span(source)];
    return task({ id: `calc-${suffix}`, source, required: ['I', 'B'], value: { target_sets: [{
      id: `target-${suffix}`, universe: 'unresolved_target', effect: 'modify',
      actor_scope: `agent-${suffix}`, guard_context: 'default', identity_status: 'unresolved',
      requested: [`candidate-a-${suffix}`], forbidden: [`candidate-b-${suffix}`], evidence,
    }] } });
  }
  if (family === 'handoff-deficit' || family === 'handoff-satisfied' || family === 'handoff-unresolved') {
    const source = `Case ${suffix}: producer to consumer artifact handoff.`;
    const evidence = [span(source)];
    const requiredInput = `required-${suffix}.json`;
    const available = family === 'handoff-satisfied' ? [requiredInput] : [`other-${suffix}.json`];
    return task({ id: `calc-${suffix}`, source, required: ['I', 'O'], value: { handoffs: [{
      id: `handoff-${suffix}`, producer_stage: `producer-${suffix}`, consumer_stage: `consumer-${suffix}`,
      artifact_type: 'file', identity_status: family === 'handoff-unresolved' ? 'unresolved' : 'resolved',
      declared_outputs: available, required_inputs: [requiredInput], external_inputs: [], evidence,
    }] } });
  }
  if (family === 'prerequisite-cycle') {
    const source = `Case ${suffix}: mandatory prerequisite cycle.`;
    const evidence = [span(source)];
    const nodes = Array.from({ length: 2 + (serial % 4) }, (_, i) => `step-${suffix}-${i + 1}`);
    const dependencies = nodes.map((node, i) => ({
      from: node, to: nodes[(i + 1) % nodes.length], kind: 'prerequisite', evidence,
    }));
    return task({ id: `calc-${suffix}`, source, required: ['C'], value: { dependencies } });
  }
  if (family === 'bounded-iteration') {
    const source = `Case ${suffix}: bounded iteration is not a prerequisite cycle.`;
    const evidence = [span(source)];
    return task({ id: `calc-${suffix}`, source, required: ['C'], value: { dependencies: [
      { from: `evaluate-${suffix}`, to: `revise-${suffix}`, kind: 'iteration',
        max_iterations: 1 + (serial % 9), evidence },
      { from: `revise-${suffix}`, to: `evaluate-${suffix}`, kind: 'iteration',
        max_iterations: 1 + (serial % 9), evidence },
    ] } });
  }
  if (family === 'logic-unsat') {
    const source = `Case ${suffix}: emergency action conflicts with missing approval.`;
    const evidence = [span(source)];
    const approval = `approval_${suffix}`, emergency = `emergency_${suffix}`, action = `action_${suffix}`;
    return task({ id: `calc-${suffix}`, source, required: ['A', 'P', 'B'], value: { logic: [{
      id: `logic-${suffix}`, variables: [approval, emergency, action],
      formula: { all: [
        { implies: [{ not: { var: approval } }, { not: { var: action } }] },
        { implies: [{ var: emergency }, { var: action }] },
        { not: { var: approval } },
        { var: emergency },
      ] },
      evidence,
    }] } });
  }
  if (family === 'logic-sat') {
    const source = `Case ${suffix}: approved guarded action is satisfiable.`;
    const evidence = [span(source)];
    const approval = `approval_${suffix}`, action = `action_${suffix}`;
    return task({ id: `calc-${suffix}`, source, required: ['A', 'P', 'B'], value: { logic: [{
      id: `logic-${suffix}`, variables: [approval, action],
      formula: { all: [{ var: approval }, { implies: [{ var: approval }, { var: action }] }] },
      evidence,
    }] } });
  }
  const source = `Case ${suffix}: compatible closed and open resource bounds.`;
  const evidence = [span(source)];
  return task({ id: `calc-${suffix}`, source, required: ['R'], value: { intervals: [
    interval(`lower-${suffix}`, `duration-${suffix}`, 'duration', 'second',
      { value: 0, inclusive: true }, null, evidence),
    interval(`upper-${suffix}`, `duration-${suffix}`, 'duration', 'second',
      null, { value: n, inclusive: serial % 2 === 0 }, evidence),
  ] } });
}

function familyFor(title, serial) {
  if (/SMT|UNSAT|不可满足|模态|逻辑冲突|法律逻辑冲突/i.test(title)) return 'logic-unsat';
  if (/回路|成环|死锁|因果闭环|dependency cycle/i.test(title)) return 'prerequisite-cycle';
  if (/交付.*断|供给.*断|输入.*断|handover|跨阶段|跨工单.*断/i.test(title)) return 'handoff-deficit';
  if (/集合交集|集合碰撞|黑名单|白名单|保护分支|protected branch|越权碰撞|名单碰撞/i.test(title)) return 'target-overlap';
  if (/歧义|指代|同一性|未绑定|ambiguous|identity unresolved/i.test(title)) return 'target-unresolved';
  if (/空集|区间互斥|上下界.*冲突|预算.*互斥|empty interval/i.test(title)) return 'interval-empty';
  if (/正交|多量纲|多物理量/i.test(title)) return 'orthogonal-intervals';
  if (/迭代|重试/i.test(title)) return 'bounded-iteration';
  if (/缺损|缺少|未声明/i.test(title)) return 'incomplete';
  return serial % 11 === 0 ? 'logic-sat' : 'interval-compatible';
}

function vector(id, description, tags, origin, currentTask, schemaExpectation = 'valid') {
  return {
    id,
    class: 'BXP-CALC',
    description,
    tags,
    origin,
    schema_expectation: schemaExpectation,
    task: currentTask,
    expected_result: evaluateTask(currentTask),
  };
}

const foundationFamilies = [
  'interval-compatible',
  'incomplete',
  'interval-empty',
  'orthogonal-intervals',
  'target-overlap',
  'target-unresolved',
  'handoff-deficit',
  'handoff-satisfied',
  'handoff-unresolved',
  'prerequisite-cycle',
  'bounded-iteration',
  'logic-unsat',
  'logic-sat',
];

const cases = foundationFamilies.map((family, i) => vector(
  `BXP-C${String(i + 1).padStart(4, '0')}`,
  `Foundational BXP-CALC vector for ${family}.`,
  ['foundational', family],
  { kind: 'foundational', source_index_id: null, derivation: null },
  patternTask(family, i + 1),
));

{
  const currentTask = patternTask('interval-compatible', 14);
  currentTask.elements.R.entries[0].evidence = [{ quote: 'mismatch', start: 0, end: 8 }];
  cases.push(vector('BXP-C0014', 'Malformed Unicode evidence span invalidates calculation input.',
    ['foundational', 'invalid-evidence'], { kind: 'foundational', source_index_id: null, derivation: null }, currentTask));
}
{
  const currentTask = patternTask('interval-compatible', 15);
  currentTask.extensions = { riskScore: 0.4 };
  cases.push(vector('BXP-C0015', 'An unnamespaced extension invalidates calculation input.',
    ['foundational', 'invalid-extension'], { kind: 'foundational', source_index_id: null, derivation: null }, currentTask,
    'invalid'));
}
{
  const currentTask = patternTask('interval-compatible', 16);
  currentTask.extensions = { 'com.example.risk-score': { score: 0.4 } };
  cases.push(vector('BXP-C0016', 'A namespaced extension leaves core calculation semantics unchanged.',
    ['foundational', 'namespaced-extension'], { kind: 'foundational', source_index_id: null, derivation: null }, currentTask));
}

for (const [offset, origin] of index.origins.entries()) {
  const serial = 1001 + offset;
  const family = familyFor(origin.title, serial);
  cases.push(vector(
    `BXP-C${String(serial).padStart(4, '0')}`,
    `Calculation-pattern derivative of ${origin.source_case_id}: ${origin.title}`,
    ['historical-scenario-derivative', family],
    { kind: 'historical-scenario-derivative', source_index_id: origin.id, derivation: 'calculation-pattern-only' },
    patternTask(family, serial),
  ));
}

for (const [offset, item] of hardeningCases.entries()) {
  const currentTask = structuredClone(item.task);
  verifyHardening(item, evaluateTask(currentTask));
  cases.push(vector(`BXP-C${2001 + offset}`, item.name, ['foundational', 'hardening'],
    { kind: 'foundational', source_index_id: null, derivation: null }, currentTask,
    validateTaskSchema(currentTask) ? 'valid' : 'invalid'));
}

const suite = {
  suite: 'boundx-calc-conformance/v1',
  suite_version: SUITE_VERSION,
  protocol_version: PROTOCOL_VERSION,
  status: 'DRAFT_FOR_REVIEW',
  normative: true,
  publication_authorized: false,
  certification_authorized: false,
  case_count: cases.length,
  historical_source_count: index.origins.length,
  foundational_case_count: foundationFamilies.length + 3 + hardeningCases.length,
  cases,
};

if (!validateSuiteSchema(suite)) throw new Error(JSON.stringify(validateSuiteSchema.errors));
const candidate = process.argv.includes('--candidate');
const output = new URL(candidate ? './bxp-calc-v1.0.candidate.json' : './bxp-calc-v1.0.json', here);
if (candidate) writeFileSync(output, `${JSON.stringify(suite, null, 2)}\n`, 'utf8');
else if (!isDeepStrictEqual(suite, JSON.parse(readFileSync(output, 'utf8')))) {
  throw new Error('Frozen suite differs. Generate --candidate and review the diff; the frozen file was not changed.');
}

const canonical = JSON.stringify(suite);
const sha256 = createHash('sha256').update(canonical, 'utf8').digest('hex');
process.stdout.write(`${JSON.stringify({ output: output.pathname, cases: cases.length,
  historical: index.origins.length, foundational: suite.foundational_case_count, sha256 }, null, 2)}\n`);
