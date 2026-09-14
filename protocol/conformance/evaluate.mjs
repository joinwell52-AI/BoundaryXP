import { createHash } from 'node:crypto';

import { boundedJson, validateTaskSchema, validateResultSchema } from './validation.mjs';
import { compareDecimal, normalizeBound } from './decimal.mjs';

export const PROTOCOL_VERSION = '0.3.0-draft.2';
export const CORE_ELEMENTS = Object.freeze(['I', 'O', 'A', 'P', 'R', 'V', 'C', 'B']);

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map(key => [key, canonical(value[key])]));
  }
  return value;
}

function canonicalJson(value) {
  if (Array.isArray(value)) return '[' + value.map(canonicalJson).join(',') + ']';
  if (value && typeof value === 'object') {
    return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalJson(value[key])).join(',') + '}';
  }
  return JSON.stringify(value);
}

export function digest(value) {
  if (!boundedJson(value)) throw new TypeError('Input digest requires bounded JSON with valid Unicode and finite numbers.');
  return createHash('sha256').update(canonicalJson(value), 'utf8').digest('hex');
}

export function sourceDigest(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

function finding(code, category, status, path, message, evidence = [], assumptions) {
  const unique = [...new Map(evidence.map(span => [JSON.stringify(canonical(span)), span])).values()];
  return { code, category, status, path, message, evidence: unique, ...(assumptions ? { assumptions } : {}) };
}

function isRecord(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function checkEvidence(list, sources, path, findings) {
  for (const [index, span] of list.entries()) {
    const source = sources.get(span.source_id ?? 'task');
    if (!source || span.end > source.length || source.slice(span.start, span.end).join('') !== span.quote) {
      if (!findings.some(item => item.status === 'invalid')) {
        findings.push(finding('BXP.IR.EVIDENCE_SPAN_MISMATCH', 'validation', 'invalid', `${path}.${index}`,
          'Evidence must reference a declared source and an exact in-range Unicode code-point slice.', [span]));
      }
    }
  }
}

function validateExpression(expr, variables, depth, path, findings) {
  if (findings.some(item => item.status === 'invalid')) return;
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
    const key = JSON.stringify([item.scope_id, item.subject, item.dimension, item.unit, item.domain ?? 'real']);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  const calculations = [];
  for (const [key, group] of groups) {
    const [scope_id, subject, dimension, unit, domain] = JSON.parse(key);
    let lower = null;
    let upper = null;
    for (const item of group) {
      const nextLower = normalizeBound(item.lower, domain, true);
      const nextUpper = normalizeBound(item.upper, domain, false);
      if (nextLower && (!lower || compareDecimal(nextLower.value, lower.value) > 0
          || (compareDecimal(nextLower.value, lower.value) === 0 && !nextLower.inclusive))) lower = nextLower;
      if (nextUpper && (!upper || compareDecimal(nextUpper.value, upper.value) < 0
          || (compareDecimal(nextUpper.value, upper.value) === 0 && !nextUpper.inclusive))) upper = nextUpper;
    }
    const comparison = lower && upper ? compareDecimal(lower.value, upper.value) : null;
    const empty = comparison !== null && (comparison > 0
      || (comparison === 0 && (!lower.inclusive || !upper.inclusive)));
    calculations.push({ scope_id, subject, dimension, unit, domain, lower, upper, empty,
      constraint_ids: group.map(item => item.id).sort() });
    if (empty) findings.push(finding('BXP.INTERVAL.EMPTY', 'interval', 'conflict', 'constraints.intervals',
      'Interval intersection is empty.', group.flatMap(item => item.evidence),
      ['Only identical scope, subject, dimension, unit and domain keys were intersected.']));
  }
  return calculations;
}

function targetSetCalculations(items, findings) {
  const calculations = [];
  for (const [index, item] of items.entries()) {
    if (item.identity_status === 'unresolved') {
      calculations.push({ id: item.id, scope_id: item.scope_id, result: 'undetermined', overlap: [] });
      findings.push(finding('BXP.TARGET.IDENTITY_UNRESOLVED', 'target_set', 'unresolved', `constraints.target_sets.${index}`,
        'Target universe or effect identity is unresolved.', item.evidence));
      continue;
    }
    const blocked = new Set(item.forbidden);
    const overlap = item.requested.filter(value => blocked.has(value)).sort();
    calculations.push({ id: item.id, scope_id: item.scope_id, result: overlap.length ? 'overlap' : 'disjoint', overlap });
    if (overlap.length) findings.push(finding('BXP.TARGET.FORBIDDEN_OVERLAP', 'target_set', 'conflict',
      `constraints.target_sets.${index}`, 'Requested targets overlap forbidden targets.', item.evidence,
      [`universe=${item.universe}`, `effect=${item.effect}`, `actor_scope=${item.actor_scope}`, `guard_context=${item.guard_context}`]));
  }
  return calculations;
}

function handoffCalculations(items, findings) {
  const calculations = [];
  for (const [index, item] of items.entries()) {
    if (item.identity_status === 'unresolved') {
      calculations.push({ id: item.id, scope_id: item.scope_id, result: 'undetermined', available: [], missing: [] });
      findings.push(finding('BXP.HANDOFF.IDENTITY_UNRESOLVED', 'handoff', 'unresolved',
        `constraints.handoffs.${index}`, 'Artifact identity is unresolved across the declared handoff.', item.evidence));
      continue;
    }
    const available = [...new Set([...item.declared_outputs, ...item.external_inputs])].sort();
    const supplied = new Set(available);
    const missing = item.required_inputs.filter(value => !supplied.has(value)).sort();
    calculations.push({ id: item.id, scope_id: item.scope_id, result: missing.length ? 'deficit' : 'satisfied', available, missing });
    if (missing.length) findings.push(finding('BXP.HANDOFF.INPUT_DEFICIT', 'handoff', 'conflict',
      `constraints.handoffs.${index}`, 'Required inputs have no declared upstream or external supply.',
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
    for (const next of [...new Set(graph.get(node) || [])].sort()) visit(next, [...path, node]);
    visiting.delete(node);
    done.add(node);
  }
  for (const node of [...graph.keys()].sort()) visit(node, []);
  const representatives = new Map();
  for (const edge of edges.filter(item => item.kind === 'prerequisite')) {
    const key = JSON.stringify([edge.from, edge.to]);
    if (!representatives.has(key) || edge.id < representatives.get(key)) representatives.set(key, edge.id);
  }
  const unique = [...new Map(cycles.map(cycle => [JSON.stringify(cycle), cycle])).values()].map(nodes => ({
    nodes, edge_ids: nodes.slice(0, -1).map((node, index) => representatives.get(JSON.stringify([node, nodes[index + 1]]))),
  }));
  if (unique.length) findings.push(finding('BXP.DEPENDENCY.PREREQUISITE_CYCLE', 'dependency', 'conflict',
    'constraints.dependencies', 'Mandatory prerequisite graph contains a directed cycle.',
    edges.filter(item => item.kind === 'prerequisite').flatMap(item => item.evidence),
    ['Only edges explicitly typed prerequisite participate in this calculation.']));
  return [{ prerequisite_edges: edges.filter(item => item.kind === 'prerequisite').length, cycles: unique }];
}

function grouped(items) {
  const groups = new Map();
  for (const item of items) {
    if (!groups.has(item.scope_id)) groups.set(item.scope_id, []);
    groups.get(item.scope_id).push(item);
  }
  return groups;
}

function logicCalculations(items, findings) {
  const calculations = [];
  for (const [scope_id, group] of grouped(items)) {
    const variables = [...new Set(group.flatMap(item => item.variables))].sort();
    let witness = null;
    for (let mask = 0; mask < 2 ** variables.length && witness === null; mask += 1) {
      const values = Object.fromEntries(variables.map((name, bit) =>
        [name, Boolean(mask & (1 << (variables.length - bit - 1)))]));
      if (group.every(item => evaluateExpression(item.formula, values)
          && (item.assumptions === undefined || evaluateExpression(item.assumptions, values)))) witness = values;
    }
    calculations.push({ id: scope_id, scope_id, constraint_ids: group.map(item => item.id).sort(),
      result: witness === null ? 'unsatisfiable' : 'satisfiable', witness });
    if (witness === null) findings.push(finding('BXP.LOGIC.UNSAT', 'logic', 'conflict', 'constraints.logic',
      'No Boolean assignment satisfies all submitted formulas and assumptions in this scope.',
      group.flatMap(item => item.evidence), ['Quantifier-free Boolean constraints within one declared scope only.']));
  }
  return calculations;
}

function semanticValidation(task, findings) {
  const invalid = (code, path, message) => {
    if (!findings.some(item => item.status === 'invalid')) {
      findings.push(finding(code, 'validation', 'invalid', path, message));
    }
  };
  const sources = new Map([['task', Array.from(task.source.text)]]);
  for (const [index, source] of (task.sources ?? []).entries()) {
    if (sources.has(source.id) || source.digest !== sourceDigest(source.text)) {
      invalid('BXP.IR.INVALID_SOURCE', `sources.${index}`, 'Source IDs must be unique and source digests must match.');
    }
    sources.set(source.id, Array.from(source.text));
  }
  const scopes = new Map([['task', 'resolved']]);
  for (const [index, scope] of (task.scopes ?? []).entries()) {
    if (scopes.has(scope.id)) invalid('BXP.IR.DUPLICATE_SCOPE', `scopes.${index}`, 'Scope IDs must be unique; task is reserved.');
    scopes.set(scope.id, scope.identity_status);
    checkEvidence(scope.evidence, sources, `scopes.${index}.evidence`, findings);
  }
  const entryIds = new Set();
  for (const key of CORE_ELEMENTS) {
    for (const [index, entry] of task.elements[key].entries.entries()) {
      if (entryIds.has(entry.id)) invalid('BXP.IR.DUPLICATE_ID', `elements.${key}.entries.${index}`, 'Element entry IDs must be unique across all buckets.');
      entryIds.add(entry.id);
      checkEvidence(entry.evidence, sources, `elements.${key}.entries.${index}.evidence`, findings);
    }
  }
  const constraints = {};
  const domains = new Map();
  let expressionNodes = 0;
  for (const name of ['intervals', 'target_sets', 'handoffs', 'dependencies', 'logic']) {
    const items = task.constraints[name];
    const ids = new Set();
    constraints[name] = items.map((item, index) => {
      const path = `constraints.${name}.${index}`;
      if (item.id !== undefined && ids.has(item.id)) invalid('BXP.IR.DUPLICATE_ID', path, 'Constraint IDs must be unique within a collection.');
      ids.add(item.id);
      const scope_id = item.scope_id ?? 'task';
      if (!scopes.has(scope_id)) invalid('BXP.IR.UNKNOWN_SCOPE', path, 'Constraint scope must be declared.');
      checkEvidence(item.evidence, sources, `${path}.evidence`, findings);
      if (name === 'intervals') {
        const key = JSON.stringify([scope_id, item.subject, item.dimension, item.unit]);
        const domain = item.domain ?? 'real';
        if (domains.has(key) && domains.get(key) !== domain) invalid('BXP.IR.DOMAIN_MISMATCH', path, 'One normalized interval key cannot mix integer and real domains.');
        domains.set(key, domain);
      }
      if (name === 'logic') {
        const pending = [item.formula, ...(item.assumptions === undefined ? [] : [item.assumptions])];
        while (pending.length) {
          const expr = pending.pop();
          expressionNodes += 1;
          if (isRecord(expr) && !('var' in expr)) {
            const children = 'not' in expr ? [expr.not] : Object.values(expr)[0];
            pending.push(...children);
          }
        }
        validateExpression(item.formula, new Set(item.variables), 0, `${path}.formula`, findings);
        if (item.assumptions !== undefined) validateExpression(item.assumptions, new Set(item.variables), 0, `${path}.assumptions`, findings);
      }
      return { ...item, scope_id };
    });
  }
  if (expressionNodes > 4096) invalid('BXP.IR.LOGIC_NODE_LIMIT', 'constraints.logic', 'At most 4096 expression nodes are allowed across all logic constraints.');
  for (const group of grouped(constraints.logic).values()) {
    if (new Set(group.flatMap(item => item.variables)).size > 12) {
      invalid('BXP.IR.LOGIC_VARIABLE_LIMIT', 'constraints.logic', 'At most 12 distinct Boolean variables are allowed per scope.');
    }
  }
  return { constraints, scopes };
}

export function evaluateTask(task) {
  const findings = [];
  const bounded = boundedJson(task);
  const schemaValid = bounded && validateTaskSchema(task);
  const source = bounded && typeof task?.source?.text === 'string' && Array.from(task.source.text).length <= 100000
    ? task.source.text : '';
  const taskId = bounded && typeof task?.task_id === 'string' && Array.from(task.task_id).length >= 1
    && Array.from(task.task_id).length <= 256 ? task.task_id : 'invalid-task';
  let checked;
  if (!schemaValid) {
    findings.push(finding('BXP.IR.INVALID_ENVELOPE', 'validation', 'invalid', '$',
      'Task envelope violates the supported schema, Unicode rules or input limits.'));
  } else checked = semanticValidation(task, findings);
  const invalid = findings.some(item => item.status === 'invalid');
  const calculations = { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [] };
  let completeness = 'undetermined';
  if (!invalid) {
    const required = task.profile.required_elements;
    completeness = required.some(key => task.elements[key].status === 'unresolved') ? 'unresolved'
      : required.some(key => task.elements[key].status === 'absent') ? 'incomplete' : 'complete';
    for (const key of CORE_ELEMENTS) {
      const bucket = task.elements[key];
      if (required.includes(key) && bucket.status === 'absent') {
        findings.push(finding('BXP.CORE.ELEMENT_ABSENT', 'completeness', 'information', `elements.${key}`,
          `Required element ${key} is absent.`));
      }
      if (bucket.status === 'unresolved') {
        findings.push(finding('BXP.CORE.ELEMENT_UNRESOLVED', 'completeness', 'unresolved', `elements.${key}`,
          `Element ${key} has no unique source-backed interpretation.`, bucket.entries.flatMap(entry => entry.evidence)));
      }
    }
    for (const [index, scope] of (task.scopes ?? []).entries()) {
      if (scope.identity_status === 'unresolved') findings.push(finding('BXP.SCOPE.UNRESOLVED', 'validation', 'unresolved',
        `scopes.${index}`, 'Scope identity is unresolved; its constraints are not calculated.', scope.evidence));
    }
    const active = Object.fromEntries(Object.entries(checked.constraints).map(([name, items]) =>
      [name, items.filter(item => checked.scopes.get(item.scope_id) === 'resolved')]));
    calculations.intervals = intervalCalculations(active.intervals, findings);
    calculations.target_sets = targetSetCalculations(active.target_sets, findings);
    calculations.handoffs = handoffCalculations(active.handoffs, findings);
    const dependencyGroups = grouped(active.dependencies);
    if (!dependencyGroups.size && !checked.constraints.dependencies.length) dependencyGroups.set('task', []);
    calculations.dependencies = [...dependencyGroups].flatMap(([scope_id, edges]) =>
      dependencyCalculations(edges, findings).map(result => ({ scope_id, ...result })));
    calculations.logic = logicCalculations(active.logic, findings);
  }
  const consistency = invalid ? 'undetermined' : findings.some(item => item.status === 'conflict') ? 'inconsistent'
    : findings.some(item => item.status === 'unresolved') ? 'undetermined' : 'consistent';
  const result = {
    schema: 'boundx-result/v1', protocol_version: PROTOCOL_VERSION, task_id: taskId,
    source_digest_algorithm: 'sha-256:utf8', source_digest: sourceDigest(source),
    input_digest: digest(bounded ? task : null),
    input_digest_algorithm: 'sha-256:jcs-rfc8785',
    applied_profile: invalid ? null : { id: task.profile.id,
      required_elements: CORE_ELEMENTS.filter(key => task.profile.required_elements.includes(key)) },
    resolved_elements: invalid ? [] : CORE_ELEMENTS.filter(key => task.elements[key].status === 'resolved'),
    deficit: invalid ? [] : CORE_ELEMENTS.filter(key => task.profile.required_elements.includes(key)
      && task.elements[key].status !== 'resolved').map(element => ({ element, status: task.elements[element].status })),
    evaluation: { validation: invalid ? 'invalid' : 'valid', completeness, consistency },
    findings, calculations, business_decision: null, execution_authorization: null, extensions: {},
  };
  if (!validateResultSchema(result)) throw new Error('BXP result schema invariant failed: ' + JSON.stringify(validateResultSchema.errors));
  return result;
}
