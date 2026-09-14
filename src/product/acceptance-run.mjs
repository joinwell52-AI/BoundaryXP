import { digest, sourceDigest } from '../bxp/index.mjs';
import { assert, parseProductJson } from './contracts.mjs';
import { runAdminModel } from './model-pipeline.mjs';
import { replayLabels } from './replay.mjs';
import { repeatSignature } from './repeat-audit.mjs';

export function acceptancePlan(corpus, reviewIndex) {
  assert(corpus.schema === 'boundx-admin-text-test-seeds/v1' && corpus.version === '2.0.0' && corpus.cases?.length === 120, 'ACCEPTANCE_CORPUS', 'Expected the v2 corpus of 120 seeds.');
  assert(reviewIndex.schema === 'boundx-gold-review-index/v1' && reviewIndex.cases?.length === 120, 'ACCEPTANCE_CORPUS', 'Expected the matching review index.');
  const reviews = new Map(reviewIndex.cases.map(item => [item.id, item]));
  assert(reviews.size === 120, 'ACCEPTANCE_CORPUS', 'Duplicate review IDs.');
  const languages = {}, categories = {};
  const initial = corpus.cases.map((seed, index) => {
    assert(seed.id === `T${String(index + 1).padStart(3, '0')}` && typeof seed.task_text === 'string' && seed.task_text.length > 0, 'ACCEPTANCE_CORPUS', 'Missing, reordered or duplicate seed.');
    const review = reviews.get(seed.id);
    assert(review?.source_digest === sourceDigest(seed.task_text) && review.language === seed.language && review.setup === seed.setup, 'ACCEPTANCE_CORPUS', 'Source or setup differs from the frozen review index.');
    languages[seed.language] = (languages[seed.language] ?? 0) + 1;
    categories[seed.category] = (categories[seed.category] ?? 0) + 1;
    return { run_id: `${seed.id}-1`, case_id: seed.id, repetition: 1, seed: structuredClone(seed), source_digest: review.source_digest };
  });
  assert(languages['zh-CN'] === 60 && languages.en === 36 && languages.mixed === 24
    && Object.keys(categories).length === 12 && Object.values(categories).every(count => count === 10), 'ACCEPTANCE_CORPUS', 'Unexpected language/category counts.');
  const repeated = initial.filter((item, index) => index < 10 || (index >= 30 && index < 40) || index >= 110)
    .map(item => ({ ...structuredClone(item), run_id: `${item.case_id}-2`, repetition: 2 }));
  return { schema: 'boundx-acceptance-plan/v1', corpus_digest: digest(corpus), review_index_digest: digest(reviewIndex),
    initial_runs: 150, distinct_sources: 120, independent_review_verified: false, scoring_status: 'PENDING_GOLD_REVIEW', runs: [...initial, ...repeated] };
}

export async function recordAcceptanceRun(scenario, run, config, { sendModel, mode, hostId, persist, signal } = {}) {
  assert(['live', 'mock'].includes(mode) && typeof hostId === 'string' && hostId.trim() && typeof persist === 'function' && typeof sendModel === 'function', 'ACCEPTANCE_CONFIG', 'Explicit mode, host identity, transport and persistence are required.');
  assert(/^T(?:00[1-9]|0[1-9][0-9]|1[01][0-9]|120)-[12]$/.test(run.run_id) && run.run_id === `${run.case_id}-${run.repetition}`
    && run.source_digest === sourceDigest(run.seed.task_text) && run.source_digest === sourceDigest(scenario.input.source.text), 'ACCEPTANCE_SOURCE', 'Run identity and exact source must match its plan.');
  const record = { schema: 'boundx-model-run/v1', run_id: run.run_id, case_id: run.case_id, repetition: run.repetition,
    source_digest: run.source_digest, language: run.seed.language, category: run.seed.category, setup: run.seed.setup,
    mode, host_id: hostId, started_at: new Date().toISOString(), snapshot_time: scenario.snapshot_time,
    status: 'STARTED', provider_attempts: 0, prepared: null, raw_candidate: null, raw_candidate_recorded: false, actual_model: 'unknown', actual_model_version: 'unknown',
    evaluation: null, supplemental_checks: [], retries: [], scoring_status: 'PENDING_GOLD_REVIEW', independent_review_verified: false };
  let recordingFailure;
  const save = () => {
    const serialized = JSON.stringify(record);
    const key = config.key;
    if (typeof key === 'string' && key && (serialized.includes(key) || serialized.includes(JSON.stringify(key).slice(1, -1)))) {
      const safe = { schema: record.schema, run_id: run.run_id, status: 'REDACTED_SECRET', mode, provider_attempts: record.provider_attempts,
        scoring_status: 'INCOMPLETE_RECORD', independent_review_verified: false };
      recordingFailure = Error('Run record contains credential material; record discarded.');
      try { persist(safe); } catch {}
      throw recordingFailure;
    }
    try { persist(structuredClone(record)); }
    catch { recordingFailure = Error('Acceptance record could not be persisted.'); throw recordingFailure; }
  };
  save();
  const evaluation = await runAdminModel(scenario.host, { consent: true, config, prepare: scenario.input }, {
    signal,
    sendModel: async (selected, messages, options) => {
      record.prepared = parseProductJson(messages[1].content);
      scenario.afterPrepare();
      record.status = 'CALL_STARTED';
      record.provider_attempts++;
      save();
      const output = await sendModel(selected, messages, options);
      assert(typeof output?.text === 'string' && Buffer.byteLength(output.text) <= 2_000_000, 'ACCEPTANCE_OUTPUT', 'Raw candidate exceeds its recording limit.');
      record.raw_candidate = output.text;
      record.raw_candidate_recorded = true;
      record.actual_model = typeof output.model === 'string' ? output.model : 'unknown';
      record.status = 'MODEL_RETURNED';
      save();
      return output;
    },
  });
  if (recordingFailure) throw recordingFailure;
  record.evaluation = evaluation;
  record.deterministic_replay = { status: 'NOT_APPLICABLE', model_calls: 0 };
  if (evaluation.computed) {
    const replayCandidate = parseProductJson(record.raw_candidate);
    replayCandidate.producer = structuredClone(evaluation.task.extensions['org.boundx.producer'].producer);
    const replayed = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: replayCandidate });
    const projection = value => ({ computed: value.computed, task: value.task, result: value.result, diagnostics: value.diagnostics });
    const originalDigest = digest(projection(evaluation));
    const replayDigest = digest(projection(replayed));
    record.deterministic_replay = { status: originalDigest === replayDigest ? 'MATCHED' : 'MISMATCH',
      original_digest: originalDigest, replay_digest: replayDigest, model_calls: 0 };
  }
  record.repeat_signature = repeatSignature(record);
  record.completed_at = new Date().toISOString();
  record.status = evaluation.computed ? 'COMPUTED' : 'REJECTED';
  if (evaluation.computed && ['bad-pack-digest', 'two-adapters'].includes(run.seed.setup)) {
    const candidate = parseProductJson(record.raw_candidate);
    if (run.seed.setup === 'bad-pack-digest') {
      const forged = structuredClone(candidate);
      const entry = Object.values(forged.elements).flatMap(bucket => bucket.entries)[0];
      const reference = record.prepared.entries[0]?.reference;
      if (!entry || !reference) record.supplemental_checks.push({ kind: 'bad-pack-digest', status: 'NOT_APPLICABLE', model_call: false });
      else {
        entry.semantic_refs = [{ ...reference, digest: '0'.repeat(64) }];
        const rejected = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: forged });
        record.supplemental_checks.push({ kind: 'bad-pack-digest', model_call: false, passed: !rejected.computed && rejected.diagnostics.some(item => item.code === 'UNKNOWN_REFERENCE'), evaluation: rejected });
      }
    } else {
      const converted = replayLabels(record.prepared, { schema: 'boundx-label-replay/v1', tags: Object.entries(candidate.elements).map(([element, bucket]) => ({ element, ...bucket })),
        relations: candidate.constraints, ...(candidate.scopes ? { scopes: candidate.scopes } : {}), clarifications: candidate.clarifications });
      const replayed = scenario.host.invoke('bx_evaluate_admin_candidate', { candidate: converted });
      record.supplemental_checks.push({ kind: 'two-adapters', model_call: false, passed: replayed.computed && digest(replayed.result.calculations) === digest(evaluation.result.calculations)
        && digest(replayed.result.evaluation) === digest(evaluation.result.evaluation) && digest(replayed.task.elements) === digest(evaluation.task.elements)
        && digest(replayed.task.constraints) === digest(evaluation.task.constraints), evaluation: replayed });
    }
  }
  save();
  return structuredClone(record);
}

export function summarizeAcceptanceRuns(records, planned = 150) {
  assert(Number.isInteger(planned) && planned >= 1 && planned <= 150 && records.length <= planned, 'ACCEPTANCE_COUNT', 'Invalid planned run count.');
  assert(new Set(records.map(record => record.run_id)).size === records.length, 'ACCEPTANCE_DUPLICATE', 'Duplicate run records.');
  const live = records.filter(record => record.mode === 'live' && record.provider_attempts === 1 && ['COMPUTED', 'REJECTED'].includes(record.status));
  const groups = key => Object.fromEntries([...new Set(records.map(record => record[key]))].map(value => [value, {
    records: records.filter(record => record[key] === value).length,
    computed: records.filter(record => record[key] === value && record.status === 'COMPUTED').length,
    rejected_or_incomplete: records.filter(record => record[key] === value && record.status !== 'COMPUTED').length,
  }]));
  return { schema: 'boundx-acceptance-summary/v1', planned_initial_runs: planned, records: records.length,
    live_provider_attempts_recorded: live.length, live_outputs_recorded: live.filter(record => record.raw_candidate_recorded === true).length,
    mock_provider_attempts_recorded: records.filter(record => record.mode === 'mock').reduce((count, record) => count + record.provider_attempts, 0),
    missing_or_incomplete_runs: Math.max(0, planned - live.length), by_language: groups('language'), by_category: groups('category'),
    precision: null, recall: null, independent_review_verified: false, status: 'PENDING_GOLD_REVIEW',
    limitations: ['Run records are engineering evidence, not independent gold review.', 'Transport failures and rejected candidates remain in the record count.', 'No semantic accuracy is inferred from Core validation.'] };
}
