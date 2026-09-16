import { existsSync, lstatSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { digest, RAW_JSON_BYTE_LIMIT } from '../src/bxp/index.mjs';
import { DRAFT_MATCHER, scoreReviewDraft } from '../src/product/draft-score.mjs';
import { summarizeDraftBatch } from '../src/product/draft-batch.mjs';
import { loadAcceptancePlan, atomicRecord } from './run-admin-acceptance.mjs';
import { loadReviewWorkspaceCase } from './prepare-admin-review.mjs';
import { parseProductJson } from '../src/product/contracts.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
function ordinary(path) {
  const stat = lstatSync(path);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Expected an ordinary directory.');
}
export function compareDraftBatch(workspace, candidateDirectory, { base = join(repository, '.boundx'), format = 'candidate-files' } = {}) {
  if (!['candidate-files', 'run-records'].includes(format)) throw Error('Unknown input format.');
  ordinary(resolve(workspace));
  const candidates = resolve(candidateDirectory);
  ordinary(candidates);
  const plan = loadAcceptancePlan();
  const parent = resolve(base);
  for (const path of [parent, join(parent, 'draft-comparisons')]) {
    if (!existsSync(path)) mkdirSync(path);
    ordinary(path);
  }
  const output = join(parent, 'draft-comparisons', randomUUID());
  mkdirSync(output);
  atomicRecord(join(output, 'summary.json'), { status: 'BUILDING', planned_runs: 150, acceptance_passed: false });
  const contexts = new Map();
  const records = [];
  const recordedModes = { live: 0, mock: 0 };
  for (const run of plan.runs) {
    let record;
    let inputStatus = 'NOT_INSPECTED';
    try {
      if (!contexts.has(run.case_id)) {
        try { contexts.set(run.case_id, { context: loadReviewWorkspaceCase(workspace, run.case_id) }); }
        catch { contexts.set(run.case_id, { error: true }); }
      }
      const cached = contexts.get(run.case_id);
      if (cached.error) throw Error('Review context unavailable.');
      const { host, draft, seed, snapshotTime } = cached.context;
      let observation = null;
      let unreadable = false;
      let recordedMode;
      try {
        if (format === 'run-records') ordinary(join(candidates, run.run_id));
        const path = format === 'run-records' ? join(candidates, run.run_id, 'record.json') : join(candidates, run.run_id + '.json');
        const stat = lstatSync(path);
        const limit = RAW_JSON_BYTE_LIMIT;
        if (!stat.isFile() || stat.isSymbolicLink() || stat.size > limit) throw Error('Invalid observation file.');
        const bytes = readFileSync(path);
        if (format === 'candidate-files') { observation = bytes; inputStatus = 'PRESENT'; }
        else {
          const saved = parseProductJson(bytes, limit);
          if (saved.schema !== 'boundx-model-run/v1' || saved.run_id !== run.run_id || saved.case_id !== run.case_id
            || saved.repetition !== run.repetition || saved.source_digest !== run.source_digest || !['live', 'mock'].includes(saved.mode)
            || typeof saved.raw_candidate_recorded !== 'boolean' || (saved.raw_candidate_recorded ? typeof saved.raw_candidate !== 'string' : saved.raw_candidate !== null)) throw Error('Run identity or raw output differs.');
          recordedMode = saved.mode;
          observation = saved.raw_candidate_recorded ? saved.raw_candidate : null;
          inputStatus = saved.raw_candidate_recorded ? 'PRESENT' : 'MISSING';
        }
      } catch (error) {
        if (error.code !== 'ENOENT') { unreadable = true; observation = undefined; inputStatus = 'UNREADABLE'; }
        else inputStatus = 'MISSING';
      }
      record = scoreReviewDraft(host, draft, seed, snapshotTime, observation);
      if (unreadable) record = { ...record, observation_status: 'INPUT_ERROR', diagnostics: [{ code: 'OBSERVATION_UNREADABLE' }] };
      if (recordedMode) { record.recorded_mode = recordedMode; recordedModes[recordedMode]++; }
    } catch {
      record = { observation_status: 'REVIEW_UNAVAILABLE', provisional_alternatives: [], diagnostics: [{ code: 'REVIEW_UNAVAILABLE' }],
        schema: 'boundx-draft-score/v1', status: 'PENDING_GOLD_REVIEW', precision: null, recall: null, model_calls: 0,
        independent_review_verified: false, acceptance_passed: false, matcher_digest: digest(DRAFT_MATCHER) };
    }
    record = { ...record, input_status: inputStatus, run_id: run.run_id, case_id: run.case_id, language: run.seed.language, category: run.seed.category };
    atomicRecord(join(output, run.run_id + '.json'), record);
    records.push({ run_id: record.run_id, case_id: record.case_id, language: record.language, category: record.category,
      observation_status: record.observation_status, independent_review_verified: false, acceptance_passed: false, matcher_digest: record.matcher_digest,
      input_status: record.input_status,
      provisional_alternatives: record.provisional_alternatives.map(answer => ({ exact_match: answer.exact_match })) });
  }
  const summary = { ...summarizeDraftBatch(plan, records), input_format: format, recorded_mode_headers: recordedModes,
    recorded_modes_are_authenticated: false, output, execution_status: 'REPORTS_WRITTEN' };
  atomicRecord(join(output, 'summary.json'), summary);
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2 && !(args.length === 3 && args[2] === '--records')) throw Error('Expected workspace, input directory and optional --records.');
    const summary = compareDraftBatch(args[0], args[1], { format: args[2] ? 'run-records' : 'candidate-files' });
    process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
  } catch {
    process.stderr.write('Batch draft comparison failed; incomplete reports are not acceptance evidence.\n');
    process.exitCode = 1;
  }
}
