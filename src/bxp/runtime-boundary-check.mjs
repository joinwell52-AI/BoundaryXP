import { digest } from './evaluate.mjs';
import { boundedJson } from './validation.mjs';

const outcome = Object.freeze({ in: 'IN_BOUNDARY', out: 'OUT_OF_BOUNDARY', unknown: 'UNDETERMINED' });
const clone = value => structuredClone(value);

function issue(code, details = {}) {
  return { code, ...details };
}

function denseArray(value) {
  return Array.isArray(value) && Array.from({ length: value.length }, (_, index) => Object.hasOwn(value, index))
    .every(Boolean);
}

function exactArray(value) {
  return denseArray(value) && value.every(item => typeof item === 'string' && item.length > 0);
}

function uniqueArray(value) {
  return exactArray(value) && new Set(value).size === value.length;
}

const observationFields = new Set(['boundary_digest', 'boundary_version', 'actions', 'actual_files',
  'dependencies', 'resources', 'completion_evidence']);
const versionFields = new Set(['boundary_digest', 'boundary_version', 'allowed_actions', 'allowed_files',
  'forbidden_actions', 'required_dependencies', 'resource_limits', 'required_completion_evidence']);
const resourceLimitFields = new Set(['id', 'minimum', 'maximum']);

function check(version, observations) {
  if (!observations || typeof observations !== 'object' || Array.isArray(observations)) return { outcome: outcome.unknown, findings: [issue('OBSERVATIONS_MISSING')] };
  if (!Object.hasOwn(observations, 'boundary_digest') || !Object.hasOwn(observations, 'boundary_version')
    || observations.boundary_digest !== version.boundary_digest || observations.boundary_version !== version.boundary_version) {
    return { outcome: outcome.unknown, findings: [issue('BOUNDARY_VERSION_STALE', { expected_digest: version.boundary_digest, actual_digest: observations.boundary_digest ?? null,
      expected_version: version.boundary_version, actual_version: observations.boundary_version ?? null })] };
  }
  const findings = [];
  for (const field of Object.keys(observations)) if (!observationFields.has(field)) {
    findings.push(issue('OBSERVATION_FIELD_UNRECOGNIZED', { field }));
  }
  const actions = observations.actions;
  if (!Object.hasOwn(observations, 'actions') || !exactArray(actions)) findings.push(issue('ACTION_OBSERVATIONS_MISSING'));
  else {
    if (version.allowed_actions === null && actions.length === 0) findings.push(issue('ACTION_ALLOWED_SET_UNESTABLISHED'));
    for (const action of actions) {
      if (version.forbidden_actions.includes(action)) findings.push(issue('FORBIDDEN_ACTION_OBSERVED', { action }));
      else if (version.allowed_actions === null) findings.push(issue('ACTION_ALLOWED_SET_UNESTABLISHED', { action }));
      else if (!version.allowed_actions.includes(action)) findings.push(issue('ACTION_OUTSIDE_ALLOWED_SET', { action }));
    }
  }
  const files = observations.actual_files;
  if (!Object.hasOwn(observations, 'actual_files') || !exactArray(files)) findings.push(issue('FILE_OBSERVATIONS_MISSING'));
  else {
    if (version.allowed_files === null && files.length === 0) findings.push(issue('FILE_ALLOWED_SET_UNESTABLISHED'));
    for (const path of files) {
      if (version.allowed_files === null) findings.push(issue('FILE_ALLOWED_SET_UNESTABLISHED', { path }));
      else if (!version.allowed_files.includes(path)) findings.push(issue('FILE_OUTSIDE_ALLOWED_SET', { path }));
    }
  }
  const dependencies = observations.dependencies;
  if (!Object.hasOwn(observations, 'dependencies') || !dependencies || typeof dependencies !== 'object'
    || Array.isArray(dependencies)) findings.push(issue('DEPENDENCY_OBSERVATIONS_MISSING'));
  else {
    for (const id of Object.keys(dependencies)) if (!version.required_dependencies.includes(id)) {
      findings.push(issue('DEPENDENCY_CONTEXT_UNESTABLISHED', { id }));
    }
    for (const id of version.required_dependencies) {
      const observed = dependencies[id];
      if (!Object.hasOwn(dependencies, id) || observed === null || observed === 'unknown') {
        findings.push(issue('DEPENDENCY_OBSERVATION_MISSING', { id }));
      } else if (['missing', 'failed', 'not_satisfied'].includes(observed)) {
        findings.push(issue('DEPENDENCY_NOT_SATISFIED', { id, observed }));
      } else if (observed !== 'satisfied') {
        findings.push(issue('DEPENDENCY_OBSERVATION_INVALID', { id, observed }));
      }
    }
  }
  const usage = observations.resources;
  if (!Object.hasOwn(observations, 'resources') || !usage || typeof usage !== 'object'
    || Array.isArray(usage)) findings.push(issue('RESOURCE_OBSERVATIONS_MISSING'));
  else {
    const limited = new Set(version.resource_limits.map(limit => limit.id));
    for (const id of Object.keys(usage)) if (!limited.has(id)) {
      findings.push(issue('RESOURCE_CONTEXT_UNESTABLISHED', { id }));
    }
    for (const limit of version.resource_limits) {
      const observed = usage[limit.id];
      if (!Object.hasOwn(usage, limit.id) || typeof observed !== 'number' || !Number.isFinite(observed)) {
        findings.push(issue('RESOURCE_OBSERVATION_MISSING', { id: limit.id }));
      }
      else if (limit.minimum !== undefined && observed < limit.minimum
        || limit.maximum !== undefined && observed > limit.maximum) {
        findings.push(issue('RESOURCE_LIMIT_EXCEEDED', { id: limit.id,
          minimum: limit.minimum ?? null, maximum: limit.maximum ?? null, observed }));
      }
    }
  }
  const completion = observations.completion_evidence;
  if (!Object.hasOwn(observations, 'completion_evidence') || !exactArray(completion)) findings.push(issue('COMPLETION_OBSERVATIONS_MISSING'));
  else {
    for (const id of completion) if (!version.required_completion_evidence.includes(id)) {
      findings.push(issue('COMPLETION_CONTEXT_UNESTABLISHED', { id }));
    }
    for (const id of version.required_completion_evidence) if (!completion.includes(id)) {
      findings.push(issue('COMPLETION_EVIDENCE_MISSING', { id }));
    }
  }
  const hasOut = findings.some(item => ['FORBIDDEN_ACTION_OBSERVED', 'ACTION_OUTSIDE_ALLOWED_SET', 'FILE_OUTSIDE_ALLOWED_SET',
    'DEPENDENCY_NOT_SATISFIED', 'RESOURCE_LIMIT_EXCEEDED'].includes(item.code));
  const hasUnknown = findings.some(item => item.code.endsWith('_MISSING') || item.code.endsWith('_UNESTABLISHED')
    || item.code === 'OBSERVATION_FIELD_UNRECOGNIZED' || item.code === 'DEPENDENCY_OBSERVATION_INVALID');
  return { outcome: hasOut ? outcome.out : hasUnknown ? outcome.unknown : outcome.in, findings };
}

export function createRuntimeBoundaryChecker(version) {
  if (!version || typeof version !== 'object' || Array.isArray(version)) throw TypeError('Runtime boundary version is required.');
  if (!boundedJson(version)) throw TypeError('Runtime boundary version is invalid.');
  if (Object.keys(version).some(field => !versionFields.has(field))
    || [...versionFields].some(field => field !== 'allowed_actions' && !Object.hasOwn(version, field))) {
    throw TypeError('Runtime boundary version is invalid.');
  }
  const expected = { boundary_digest: version.boundary_digest, boundary_version: version.boundary_version,
    allowed_actions: !Object.hasOwn(version, 'allowed_actions') || version.allowed_actions == null
      ? null : clone(version.allowed_actions),
    allowed_files: version.allowed_files === null ? null : clone(version.allowed_files),
    forbidden_actions: clone(version.forbidden_actions), required_dependencies: clone(version.required_dependencies),
    resource_limits: clone(version.resource_limits), required_completion_evidence: clone(version.required_completion_evidence) };
  if (typeof expected.boundary_digest !== 'string' || !expected.boundary_digest
    || typeof expected.boundary_version !== 'string' || !expected.boundary_version
    || (expected.allowed_actions !== null && !uniqueArray(expected.allowed_actions))
    || (expected.allowed_files !== null && !uniqueArray(expected.allowed_files)) || !uniqueArray(expected.forbidden_actions)
    || !uniqueArray(expected.required_dependencies) || !uniqueArray(expected.required_completion_evidence)
    || expected.allowed_actions !== null
      && expected.allowed_actions.some(action => expected.forbidden_actions.includes(action))
    || !denseArray(expected.resource_limits) || expected.resource_limits.some(limit => !limit || typeof limit !== 'object'
      || Array.isArray(limit) || Object.keys(limit).some(field => !resourceLimitFields.has(field))
      || typeof limit.id !== 'string'
      || !limit.id || limit.minimum === undefined && limit.maximum === undefined
      || limit.minimum !== undefined && (typeof limit.minimum !== 'number' || !Number.isFinite(limit.minimum))
      || limit.maximum !== undefined && (typeof limit.maximum !== 'number' || !Number.isFinite(limit.maximum))
      || limit.minimum !== undefined && limit.maximum !== undefined && limit.minimum > limit.maximum)
    || new Set(expected.resource_limits.map(limit => limit.id)).size !== expected.resource_limits.length) {
    throw TypeError('Runtime boundary version is invalid.');
  }
  const frozen = Object.freeze(expected);
  return observations => {
    if (observations !== undefined && !boundedJson(observations)) return {
      format: 'boundx-runtime-boundary-check/experimental-v1', outcome: outcome.unknown,
      boundary: clone(frozen), boundary_version_digest: digest(frozen), observations: null,
      findings: [issue('OBSERVATIONS_INVALID')], business_decision: null, execution_authorization: null,
    };
    const result = check(frozen, observations);
    return { format: 'boundx-runtime-boundary-check/experimental-v1', outcome: result.outcome,
      boundary: clone(frozen), boundary_version_digest: digest(frozen), observations: clone(observations ?? null),
      findings: result.findings, business_decision: null, execution_authorization: null };
  };
}
