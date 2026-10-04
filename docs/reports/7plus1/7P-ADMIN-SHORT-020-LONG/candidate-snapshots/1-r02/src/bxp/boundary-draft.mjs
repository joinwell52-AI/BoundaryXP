import { evaluateWithTrace } from './trace.mjs';
import { digest, sourceDigest } from './evaluate.mjs';
import { normalizeValidatedTimeIntervals } from './time-normalization.mjs';
import { analyzeValidatedBoundary } from './boundary-analysis.mjs';

export function evaluateBoundaryDraft(task) {
  const { result, trace } = evaluateWithTrace(task);
  const valid = result.evaluation.validation === 'valid';
  const finding = code => ({ code, status: 'unresolved' });
  const timeNormalization = valid ? normalizeValidatedTimeIntervals(task.constraints.intervals) : null;
  const normalizedEvaluation = valid && timeNormalization.mappings.length ? evaluateWithTrace({ ...task,
    constraints: { ...task.constraints, intervals: timeNormalization.intervals } }) : null;
  const normalizedSteps = normalizedEvaluation?.trace.steps.filter(step => step.kind === 'intervals') ?? [];
  const normalizedSkipped = normalizedSteps.filter(step => step.status !== 'evaluated');
  const normalizedStatus = normalizedEvaluation?.result.evaluation.validation !== 'valid' ? 'invalid'
    : normalizedSteps.every(step => step.status !== 'evaluated') ? 'not_evaluated'
      : normalizedSkipped.length || timeNormalization.diagnostics.length ? 'partial' : 'evaluated';
  const constraintNodes = valid ? Object.entries(task.constraints).flatMap(([kind, constraints]) =>
    constraints.map(constraint => {
      const step = trace.steps.find(item => item.kind === kind
        && item.inputs?.some(input => input.id === constraint.id));
      return { id: constraint.id, kind, scope_id: constraint.scope_id ?? 'task',
        operator: step?.method ?? null,
        status: step?.status === 'evaluated' ? 'evaluated' : 'not_evaluated',
        reason: step?.reason ?? (step?.status === 'evaluated' ? null : 'CONSTRAINT_EVALUATION_NOT_ESTABLISHED'),
        operands: structuredClone(constraint), evidence: structuredClone(constraint.evidence),
        result: step?.status === 'evaluated' ? structuredClone(step.output) : null };
    })) : [];
  const model = valid ? {
    format: 'boundx-formal-model-draft/experimental-v1',
    input_protocol_version: task.protocol_version, input_digest: result.input_digest,
    source: structuredClone(task.source), sources: structuredClone(task.sources ?? []),
    profile: structuredClone(task.profile), scopes: structuredClone(task.scopes ?? []),
    semantic_ir: structuredClone(task.elements), constraints: structuredClone(task.constraints),
    constraint_nodes: constraintNodes,
    time_normalization: timeNormalization,
    uncompiled_entries: Object.entries(task.elements).flatMap(([slot, bucket]) => bucket.entries.map(entry => ({
      slot, entry_id: entry.id, status: bucket.status, reason: 'TYPED_SEMANTIC_MAPPING_REQUIRED',
      evidence: structuredClone(entry.evidence),
    }))),
  } : null;
  const entries = slots => valid ? slots.flatMap(slot => task.elements[slot].entries.map(entry => ({
    slot, semantic_status: task.elements[slot].status, formalized: false, ...structuredClone(entry),
  }))) : [];
  const boundary = {
    format: 'boundx-boundary-draft/experimental-v1', state: valid ? 'underdetermined' : 'invalid',
    required: entries(['I', 'O', 'A']), forbidden: entries(['B']), limits: entries(['R']),
    completion: entries(['C']), relations: entries(['P']), dependencies: entries(['V']),
    provenance: valid ? { input_protocol_version: task.protocol_version, input_digest: result.input_digest,
      source_digest: sourceDigest(task.source.text), model_digest: digest(model) } : null,
    calculations: valid ? structuredClone(result.calculations) : null,
    normalized_time_calculation: normalizedEvaluation ? {
      profile: timeNormalization.profile,
      input_digest: normalizedEvaluation.result.input_digest,
      validation: normalizedEvaluation.result.evaluation.validation,
      status: normalizedStatus,
      intervals: structuredClone(normalizedEvaluation.result.calculations.intervals),
      findings: structuredClone(normalizedEvaluation.result.findings.filter(item => item.status === 'invalid'
        || item.path?.startsWith('constraints.intervals') || item.code === 'BXP.SCOPE.UNRESOLVED')),
      skipped: structuredClone(normalizedSkipped.map(step => ({ scope_id: step.scope_id,
        reason: step.reason ?? 'CONSTRAINT_EVALUATION_NOT_ESTABLISHED',
        constraint_ids: step.inputs.map(input => input.id), evidence: step.evidence ?? [] }))),
      diagnostics: structuredClone(timeNormalization.diagnostics),
    } : null,
    findings: [...structuredClone(result.findings), ...(valid ? [finding('FORMALIZATION_COVERAGE_INCOMPLETE'),
      finding('BOUNDARY_IDENTITY_AND_UNIQUENESS_NOT_ESTABLISHED')] : [])],
    business_decision: null, execution_authorization: null,
  };
  if (valid) boundary.analysis = analyzeValidatedBoundary(task, model, result, normalizedEvaluation?.result);
  return { result, trace, formal_model: model, boundary_result: boundary,
    admission: { status: 'blocked', reason: valid ? 'BOUNDARY_UNDERDETERMINED' : 'INPUT_INVALID',
      business_decision: null, execution_authorization: null } };
}
