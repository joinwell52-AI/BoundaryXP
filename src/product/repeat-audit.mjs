import { digest } from '../bxp/index.mjs';
import { assert } from './contracts.mjs';

export function repeatSignature(record) {
  const evaluation = record.evaluation;
  return {
    source_digest: record.source_digest,
    context_digest: record.prepared?.context_digest ?? null,
    prepare_id: record.prepared?.prepare_id ?? null,
    actual_model: record.actual_model,
    actual_model_version: record.actual_model_version,
    raw_digest: record.raw_candidate_recorded ? digest(record.raw_candidate) : null,
    structure_digest: evaluation?.computed ? digest({ elements: evaluation.task.elements,
      constraints: evaluation.task.constraints, scopes: evaluation.task.scopes ?? [],
      provenance: evaluation.task.extensions['org.boundx.producer'].provenance }) : null,
    calculation_digest: evaluation?.computed ? digest({ evaluation: evaluation.result.evaluation,
      calculations: evaluation.result.calculations, deficit: evaluation.result.deficit, findings: evaluation.result.findings }) : null,
  };
}

export function summarizeRepeats(records, plan) {
  const repeated = plan.runs.filter(run => run.repetition === 2);
  assert(repeated.length === 30 && new Set(repeated.map(run => run.case_id)).size === 30,
    'REPEAT_PLAN', 'Expected the thirty fixed repeated cases.');
  const schedule = new Map(plan.runs.map(run => [run.run_id, run]));
  const observed = new Map();
  for (const record of records) {
    const run = schedule.get(record.run_id);
    assert(run && record.case_id === run.case_id && !observed.has(record.run_id),
      'REPEAT_IDENTITY', 'Duplicate or foreign run cannot be paired.');
    observed.set(record.run_id, record);
  }
  const pairs = repeated.map(run => {
    const first = observed.get(`${run.case_id}-1`);
    const second = observed.get(run.run_id);
    const base = { case_id: run.case_id, language: run.seed.language, category: run.seed.category,
      first_run: first?.run_id ?? null, second_run: second?.run_id ?? null,
      raw_equal: null, structure_equal: null, calculation_equal: null };
    if (!first || !second) return { ...base, status: 'MISSING_RUN' };
    if (first.mode !== second.mode || !['live', 'mock'].includes(first.mode)) return { ...base, status: 'MODE_MISMATCH' };
    const left = first.repeat_signature;
    const right = second.repeat_signature;
    if (!left || !right) return { ...base, status: 'SIGNATURE_UNAVAILABLE' };
    if (left.source_digest !== run.source_digest || right.source_digest !== run.source_digest
      || !left.context_digest || left.context_digest !== right.context_digest
      || !left.prepare_id || left.prepare_id !== right.prepare_id) return { ...base, status: 'CONTEXT_MISMATCH' };
    if (!left.actual_model || left.actual_model === 'unknown' || !right.actual_model || right.actual_model === 'unknown'
      || left.actual_model !== right.actual_model || left.actual_model_version !== right.actual_model_version) return { ...base, status: 'MODEL_NOT_COMPARABLE' };
    const rawEqual = left.raw_digest && right.raw_digest ? left.raw_digest === right.raw_digest : null;
    if (first.status !== 'COMPUTED' || second.status !== 'COMPUTED'
      || !left.structure_digest || !right.structure_digest || !left.calculation_digest || !right.calculation_digest) {
      return { ...base, mode: first.mode, raw_equal: rawEqual, status: 'OUTPUT_UNAVAILABLE' };
    }
    return { ...base, mode: first.mode, status: 'COMPARABLE', raw_equal: rawEqual,
      structure_equal: left.structure_digest === right.structure_digest,
      calculation_equal: left.calculation_digest === right.calculation_digest,
      model_version_known: left.actual_model_version !== 'unknown' && typeof left.actual_model_version === 'string' };
  });
  return { schema: 'boundx-repeat-audit/v1', planned_pairs: 30, pairs,
    comparable_pairs: pairs.filter(pair => pair.status === 'COMPARABLE').length,
    live_comparable_pairs: pairs.filter(pair => pair.status === 'COMPARABLE' && pair.mode === 'live').length,
    model_calls: 0, semantic_accuracy: null, acceptance_passed: false,
    limitations: ['Exact structure differences are not semantic errors; local IDs and ordering remain significant.',
      'Equal outputs do not establish correctness. Unknown model versions remain unverified.',
      'Mock pairs, missing runs and context/model changes never count as comparable live pairs.'] };
}
