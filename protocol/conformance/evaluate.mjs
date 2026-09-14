import { createHash } from 'node:crypto';

export const PROTOCOL_VERSION = '0.2.0-draft.1';
export const CORE_ELEMENTS = Object.freeze(['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B']);
const NAMESPACE = /^[a-z0-9]+(?:[.-][a-z0-9]+)+(?:\/[a-z0-9._-]+)?$/;

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

export function digest(value) {
  return createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');
}

export function sourceDigest(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function finding(code, category, status, path, message, evidence = [], assumptions) {
  return { code, category, status, path, message, evidence, ...(assumptions ? { assumptions } : {}) };
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function ownKeys(value, allowed) {
  return isRecord(value) && Object.keys(value).every(key => allowed.includes(key));
}

function codePoints(text) {
  return Array.from(text);
}

function checkSpan(span, source, path, findings) {
  if (!ownKeys(span, ['source_id', 'quote', 'start', 'end']) || typeof span.quote !== 'string'
      || !Number.isInteger(span.start) || !Number.isInteger(span.end) || span.start < 0 || span.end <= span.start) {
    findings.push(finding('BXP.IR.INVALID_EVIDENCE', 'validation', 'invalid', path, 'Evidence span is malformed.'));
    return;
  }
  const actual = codePoints(source).slice(span.start, span.end).join('');
  if (actual !== span.quote) {
    findings.push(finding('BXP.IR.EVIDENCE_SPAN_MISMATCH', 'validation', 'invalid', path,
      'Evidence quote does not equal the Unicode code-point slice.', [span]));
  }
}

function checkEvidence(list, source, path, findings) {
  if (!Array.isArray(list) || list.length === 0 || list.length > 32) {
    findings.push(finding('BXP.IR.INVALID_EVIDENCE', 'validation', 'invalid', path, 'At least one bounded evidence span is required.'));
    return;
  }
  list.forEach((span, index) => checkSpan(span, source, `${path}.${index}`, findings));
}

function validateExpression(expr, variables, depth, path, findings) {
  if (depth > 16) {
    findings.push(finding('BXP.IR.LOGIC_DEPTH_EXCEEDED', 'validation', 'invalid', path, 'Boolean expression depth exceeds 16.'));
    return;
  }
  if (typeof expr === 'boolean') return;
  if (!isRecord(expr)) {
    findings.push(finding('BXP.IR.INVALID_LOGIC', 'validation', 'invalid', path, 'Boolean expression is malformed.'));
    return;
  }
  const keys = Object.keys(expr);
  if (keys.length !== 1 || !['var', 'not', 'all', 'any', 'implies'].includes(keys[0])) {
    findings.push(finding('BXP.IR.INVALID_LOGIC', 'validation', 'invalid', path, 'Unsupported or ambiguous Boolean operator.'));
    return;
  }
  if ('var' in expr) {
    if (typeof expr.var !== 'string' || !variables.has(expr.var)) {
      findings.push(finding('BXP.IR.UNKNOWN_LOGIC_VARIABLE', 'validation', 'invalid', path, 'Expression references an undeclared variable.'));
    }
    return;
  }
  const child = 'not' in expr ? [expr.not] : expr[keys[0]];
  const validArity = Array.isArray(child) && child.length <= 64
    && (keys[0] !== 'implies' || child.length === 2);
  if (!validArity) {
    findings.push(finding('BXP.IR.INVALID_LOGIC', 'validation', 'invalid', path, 'Boolean operator has invalid operands.'));
    return;
  }
  child.forEach((item, index) => validateExpression(item, variables, depth + 1, `${path}.${keys[0]}.${index}`, findings));
}

function evaluateExpression(expr, values) {
  if (typeof expr === 'boolean') return expr;
  if ('var' in expr) return values[expr.var];
  if ('not' in expr) return !evaluateExpression(expr.not, values);
  if ('all' in expr) return expr.all.every(item => evaluateExpression(item, values));
  if ('any' in expr) return expr.any.some(item => evaluateExpression(item, values));
  if ('implies' in expr) return !evaluateExpression(expr.implies[0], values) || evaluateExpression(expr.implies[1], values);
  throw new Error('Expression must be validated before evaluation.');
}

function intervalCalculations(items, findings) {
  const groups = new Map();
  for (const item of items) {
    const key = JSON.stringify([item.subject, item.dimension, item.unit]);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const calculations = [];
  for (const [key, group] of groups) {
    let lower = null;
    let upper = null;
    for (const item of group) {
      if (item.lower && (!lower || item.lower.value > lower.value
          || (item.lower.value === lower.value && !item.lower.inclusive))) lower = { ...item.lower };
      if (item.upper && (!upper || item.upper.value < upper.value
          || (item.upper.value === upper.value && !item.upper.inclusive))) upper = { ...item.upper };
    }
    const empty = Boolean(lower && upper && (lower.value > upper.value
      || (lower.value === upper.value && (!lower.inclusive || !upper.inclusive))));
    const [subject, dimension, unit] = JSON.parse(key);
    calculations.push({ subject, dimension, unit, lower, upper, empty });
    if (empty) findings.push(finding('BXP.INTERVAL.EMPTY', 'interval', 'conflict', 'constraints.intervals',
      `Interval intersection is empty for ${subject}/${dimension}/${unit}.`, group.flatMap(item => item.evidence),
      ['Only constraints with identical subject, dimension and unit were intersected.']));
  }
  return calculations;
}

function targetSetCalculations(items, findings) {
  const calculations = [];
  for (const [index, item] of items.entries()) {
    if (item.identity_status === 'unresolved') {
      calculations.push({ id: item.id, result: 'undetermined', overlap: [] });
      findings.push(finding('BXP.TARGET.IDENTITY_UNRESOLVED', 'target_set', 'unresolved', `constraints.target_sets.${index}`,
        'Target universe or effect identity is unresolved.', item.evidence));
      continue;
    }
    const blocked = new Set(item.forbidden);
    const overlap = item.requested.filter(value => blocked.has(value)).sort();
    calculations.push({ id: item.id, result: overlap.length ? 'overlap' : 'disjoint', overlap });
    if (overlap.length) findings.push(finding('BXP.TARGET.FORBIDDEN_OVERLAP', 'target_set', 'conflict',
      `constraints.target_sets.${index}`, `Requested targets overlap forbidden targets: ${overlap.join(', ')}.`, item.evidence,
      [`universe=${item.universe}`, `effect=${item.effect}`, `actor_scope=${item.actor_scope}`, `guard_context=${item.guard_context}`]));
  }
  return calculations;
}

function handoffCalculations(items, findings) {
  const calculations = [];
  for (const [index, item] of items.entries()) {
    if (item.identity_status === 'unresolved') {
      calculations.push({ id: item.id, result: 'undetermined', available: [], missing: [] });
      findings.push(finding('BXP.HANDOFF.IDENTITY_UNRESOLVED', 'handoff', 'unresolved',
        `constraints.handoffs.${index}`, 'Artifact identity is unresolved across the declared handoff.', item.evidence));
      continue;
    }
    const available = [...new Set([...item.declared_outputs, ...item.external_inputs])].sort();
    const supplied = new Set(available);
    const missing = item.required_inputs.filter(value => !supplied.has(value)).sort();
    calculations.push({ id: item.id, result: missing.length ? 'deficit' : 'satisfied', available, missing });
    if (missing.length) findings.push(finding('BXP.HANDOFF.INPUT_DEFICIT', 'handoff', 'conflict',
      `constraints.handoffs.${index}`, `Required inputs have no declared upstream or external supply: ${missing.join(', ')}.`,
      item.evidence, [`producer_stage=${item.producer_stage}`, `consumer_stage=${item.consumer_stage}`,
        `artifact_type=${item.artifact_type}`]));
  }
  return calculations;
}

function dependencyCalculations(edges, findings) {
  const graph = new Map();
  for (const edge of edges.filter(item => item.kind === 'prerequisite')) {
    if (!graph.has(edge.from)) graph.set(edge.from, []);
    if (!graph.has(edge.to)) graph.set(edge.to, []);
    graph.get(edge.from).push(edge.to);
  }
  const visiting = new Set();
  const done = new Set();
  const cycles = [];
  function visit(node, path) {
    if (visiting.has(node)) {
      cycles.push([...path.slice(path.indexOf(node)), node]);
      return;
    }
    if (done.has(node)) return;
    visiting.add(node);
    for (const next of graph.get(node) || []) visit(next, [...path, node]);
    visiting.delete(node);
    done.add(node);
  }
  for (const node of graph.keys()) visit(node, []);
  const unique = [...new Map(cycles.map(cycle => [cycle.join('\u0000'), cycle])).values()];
  if (unique.length) findings.push(finding('BXP.DEPENDENCY.PREREQUISITE_CYCLE', 'dependency', 'conflict',
    'constraints.dependencies', 'Mandatory prerequisite graph contains a directed cycle.',
    edges.filter(item => item.kind === 'prerequisite').flatMap(item => item.evidence),
    ['Only edges explicitly typed prerequisite participate in this calculation.']));
  return [{ prerequisite_edges: edges.filter(item => item.kind === 'prerequisite').length, cycles: unique }];
}

function logicCalculations(items, findings) {
  const calculations = [];
  for (const [index, item] of items.entries()) {
    const variables = item.variables;
    let witness = null;
    const limit = 2 ** variables.length;
    for (let mask = 0; mask < limit && !witness; mask += 1) {
      const values = Object.fromEntries(variables.map((name, bit) => [name, Boolean(mask & (1 << bit))]));
      const formula = item.assumptions === undefined
        ? item.formula
        : { all: [item.assumptions, item.formula] };
      if (evaluateExpression(formula, values)) witness = values;
    }
    const result = witness ? 'satisfiable' : 'unsatisfiable';
    calculations.push({ id: item.id, result, witness });
    if (!witness) findings.push(finding('BXP.LOGIC.UNSAT', 'logic', 'conflict', `constraints.logic.${index}`,
      'No Boolean assignment satisfies the submitted formula and assumptions.', item.evidence,
      ['Quantifier-free propositional Boolean constraints only.', `variables=${variables.join(',')}`]));
  }
  return calculations;
}

export function evaluateTask(task) {
  const findings = [];
  const fallbackId = isRecord(task) && typeof task.task_id === 'string' ? task.task_id : 'invalid-task';
  const fallbackVersion = isRecord(task) && typeof task.protocol_version === 'string' ? task.protocol_version : PROTOCOL_VERSION;
  const source = isRecord(task?.source) && typeof task.source.text === 'string' ? task.source.text : '';
  const topKeys = ['schema', 'protocol_version', 'task_id', 'source', 'profile', 'elements', 'constraints', 'extensions'];
  if (!ownKeys(task, topKeys) || task.schema !== 'boundx-task/v1' || task.protocol_version !== PROTOCOL_VERSION
      || typeof task.task_id !== 'string' || !task.task_id || !isRecord(task.source)
      || typeof task.source.language !== 'string' || !source || !isRecord(task.profile)
      || !isRecord(task.elements) || !isRecord(task.constraints) || !isRecord(task.extensions)) {
    findings.push(finding('BXP.IR.INVALID_ENVELOPE', 'validation', 'invalid', '$', 'Task envelope is malformed or uses an unsupported version.'));
  }

  const required = Array.isArray(task?.profile?.required_elements) ? task.profile.required_elements : [];
  if (typeof task?.profile?.id !== 'string' || !NAMESPACE.test(task.profile.id)
      || !required.length || new Set(required).size !== required.length
      || required.some(key => !CORE_ELEMENTS.includes(key))) {
    findings.push(finding('BXP.IR.INVALID_PROFILE', 'validation', 'invalid', 'profile', 'Profile identifier or required elements are invalid.'));
  }

  for (const key of CORE_ELEMENTS) {
    const bucket = task?.elements?.[key];
    if (!ownKeys(bucket, ['status', 'entries', 'reason_codes']) || !['resolved', 'unresolved', 'absent'].includes(bucket.status)
        || !Array.isArray(bucket.entries) || bucket.entries.length > 128
        || (bucket.status === 'resolved' && bucket.entries.length === 0)
        || (bucket.status === 'unresolved' && (bucket.entries.length === 0 || !Array.isArray(bucket.reason_codes) || bucket.reason_codes.length === 0))
        || (bucket.status === 'absent' && bucket.entries.length !== 0)) {
      findings.push(finding('BXP.IR.INVALID_ELEMENT_BUCKET', 'validation', 'invalid', `elements.${key}`, 'Element bucket is malformed or contradicts its status.'));
      continue;
    }
    bucket.entries.forEach((entry, index) => {
      if (!ownKeys(entry, ['id', 'kind', 'text', 'evidence', 'normalized']) || typeof entry.id !== 'string'
          || typeof entry.kind !== 'string' || typeof entry.text !== 'string') {
        findings.push(finding('BXP.IR.INVALID_ELEMENT_ENTRY', 'validation', 'invalid', `elements.${key}.entries.${index}`, 'Element entry is malformed.'));
      } else checkEvidence(entry.evidence, source, `elements.${key}.entries.${index}.evidence`, findings);
    });
  }

  const constraintKeys = ['intervals', 'target_sets', 'handoffs', 'dependencies', 'logic'];
  if (!ownKeys(task?.constraints, constraintKeys) || constraintKeys.some(key => !Array.isArray(task.constraints[key]))) {
    findings.push(finding('BXP.IR.INVALID_CONSTRAINTS', 'validation', 'invalid', 'constraints', 'Constraint collections are malformed.'));
  }
  for (const [key, value] of Object.entries(task?.extensions || {})) {
    if (!NAMESPACE.test(key)) findings.push(finding('BXP.EXTENSION.INVALID_NAMESPACE', 'extension', 'invalid', `extensions.${key}`,
      'Extension key must use a reverse-domain namespace.'));
    void value;
  }

  const intervals = Array.isArray(task?.constraints?.intervals) ? task.constraints.intervals : [];
  intervals.forEach((item, index) => {
    const bounds = [item?.lower, item?.upper].filter(Boolean);
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.subject !== 'string'
        || typeof item.dimension !== 'string' || typeof item.unit !== 'string' || bounds.length === 0
        || bounds.some(bound => typeof bound.value !== 'number' || !Number.isFinite(bound.value) || typeof bound.inclusive !== 'boolean')) {
      findings.push(finding('BXP.IR.INVALID_INTERVAL', 'validation', 'invalid', `constraints.intervals.${index}`, 'Typed interval is malformed.'));
    } else checkEvidence(item.evidence, source, `constraints.intervals.${index}.evidence`, findings);
  });

  const targetSets = Array.isArray(task?.constraints?.target_sets) ? task.constraints.target_sets : [];
  targetSets.forEach((item, index) => {
    if (!isRecord(item) || !['id', 'universe', 'effect', 'actor_scope', 'guard_context'].every(key => typeof item[key] === 'string')
        || !Array.isArray(item.requested) || !Array.isArray(item.forbidden)
        || (item.identity_status !== undefined && !['resolved', 'unresolved'].includes(item.identity_status))) {
      findings.push(finding('BXP.IR.INVALID_TARGET_SET', 'validation', 'invalid', `constraints.target_sets.${index}`, 'Typed target-set calculation is malformed.'));
    } else checkEvidence(item.evidence, source, `constraints.target_sets.${index}.evidence`, findings);
  });

  const handoffs = Array.isArray(task?.constraints?.handoffs) ? task.constraints.handoffs : [];
  handoffs.forEach((item, index) => {
    const names = ['id', 'producer_stage', 'consumer_stage', 'artifact_type'];
    if (!isRecord(item) || !names.every(key => typeof item[key] === 'string' && item[key])
        || !['resolved', 'unresolved'].includes(item.identity_status)
        || !Array.isArray(item.declared_outputs) || !Array.isArray(item.required_inputs)
        || !Array.isArray(item.external_inputs)
        || [...item.declared_outputs, ...item.required_inputs, ...item.external_inputs].some(value => typeof value !== 'string' || !value)) {
      findings.push(finding('BXP.IR.INVALID_HANDOFF', 'validation', 'invalid', `constraints.handoffs.${index}`,
        'Typed handoff calculation is malformed.'));
    } else checkEvidence(item.evidence, source, `constraints.handoffs.${index}.evidence`, findings);
  });

  const dependencies = Array.isArray(task?.constraints?.dependencies) ? task.constraints.dependencies : [];
  dependencies.forEach((item, index) => {
    if (!isRecord(item) || typeof item.from !== 'string' || typeof item.to !== 'string'
        || !['prerequisite', 'reference', 'information', 'iteration'].includes(item.kind)
        || (item.kind === 'iteration' && (!Number.isInteger(item.max_iterations) || item.max_iterations < 1))) {
      findings.push(finding('BXP.IR.INVALID_DEPENDENCY', 'validation', 'invalid', `constraints.dependencies.${index}`, 'Dependency edge is malformed.'));
    } else checkEvidence(item.evidence, source, `constraints.dependencies.${index}.evidence`, findings);
  });

  const logic = Array.isArray(task?.constraints?.logic) ? task.constraints.logic : [];
  logic.forEach((item, index) => {
    if (!isRecord(item) || typeof item.id !== 'string' || !Array.isArray(item.variables)
        || item.variables.length > 12 || new Set(item.variables).size !== item.variables.length
        || item.variables.some(value => typeof value !== 'string' || !value)) {
      findings.push(finding('BXP.IR.INVALID_LOGIC', 'validation', 'invalid', `constraints.logic.${index}`, 'Logic constraint is malformed.'));
      return;
    }
    const variables = new Set(item.variables);
    validateExpression(item.formula, variables, 0, `constraints.logic.${index}.formula`, findings);
    if (item.assumptions !== undefined) validateExpression(item.assumptions, variables, 0, `constraints.logic.${index}.assumptions`, findings);
    checkEvidence(item.evidence, source, `constraints.logic.${index}.evidence`, findings);
  });

  const invalid = findings.some(item => item.status === 'invalid');
  let completeness = 'complete';
  if (invalid) completeness = 'undetermined';
  else if (required.some(key => task.elements[key].status === 'unresolved')) completeness = 'unresolved';
  else if (required.some(key => task.elements[key].status === 'absent')) completeness = 'incomplete';
  if (!invalid) {
    for (const key of required) {
      const bucket = task.elements[key];
      if (bucket.status === 'absent') findings.push(finding('BXP.CORE.ELEMENT_ABSENT', 'completeness', 'information', `elements.${key}`,
        `Required element ${key} is absent.`));
      if (bucket.status === 'unresolved') findings.push(finding('BXP.CORE.ELEMENT_UNRESOLVED', 'completeness', 'unresolved', `elements.${key}`,
        `Required element ${key} has no unique source-backed interpretation.`, bucket.entries.flatMap(entry => entry.evidence)));
    }
  }

  const calculations = { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] };
  if (!invalid) {
    calculations.intervals = intervalCalculations(intervals, findings);
    calculations.target_sets = targetSetCalculations(targetSets, findings);
    calculations.handoffs = handoffCalculations(handoffs, findings);
    calculations.dependencies = dependencyCalculations(dependencies, findings);
    calculations.logic = logicCalculations(logic, findings);
  }
  const inconsistent = findings.some(item => item.status === 'conflict');
  const unresolved = findings.some(item => item.status === 'unresolved');
  const consistency = invalid || unresolved ? 'undetermined' : inconsistent ? 'inconsistent' : 'consistent';
  return {
    schema: 'boundx-result/v1', protocol_version: fallbackVersion, task_id: fallbackId,
    source_digest_algorithm: 'sha-256:utf8', source_digest: sourceDigest(source),
    evaluation: { validation: invalid ? 'invalid' : 'valid', completeness, consistency },
    findings, calculations, business_decision: null, execution_authorization: null, extensions: {},
  };
}
