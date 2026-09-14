import { existsSync, lstatSync, mkdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { loadAcceptancePlan, atomicRecord } from './run-admin-acceptance.mjs';
import { createCaseScenario } from '../fixtures/admin-text/scenarios.mjs';
import { createReviewDraft, checkReviewDraft } from '../src/product/review-draft.mjs';
import { digest } from '../src/bxp/index.mjs';
import { parseProductJson } from '../src/product/contracts.mjs';
import { createProductHost } from '../src/product/host.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
function ordinaryDirectory(path) {
  if (!lstatSync(path).isDirectory() || lstatSync(path).isSymbolicLink()) throw Error('Review storage must be an ordinary directory.');
}
function readJson(path) {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 2_000_000) throw Error('Invalid review file.');
  return parseProductJson(readFileSync(path));
}
export function loadReviewWorkspaceCase(workspace, caseId) {
  const plan = loadAcceptancePlan();
  const run = plan.runs.slice(0, 120).find(run => run.case_id === caseId);
  if (!run) throw Error('Unknown review case.');
  const output = resolve(workspace);
  ordinaryDirectory(output);
  const manifest = readJson(join(output, 'manifest.json'));
  if (manifest.schema !== 'boundx-gold-workspace/v1' || manifest.corpus_digest !== plan.corpus_digest
    || manifest.review_index_digest !== plan.review_index_digest || !Array.isArray(manifest.cases)) throw Error('Review workspace identity differs.');
  const items = manifest.cases.filter(item => item.case_id === caseId);
  if (items.length !== 1 || items[0].source_digest !== run.source_digest) throw Error('Review case identity differs.');
  const root = join(output, caseId);
  ordinaryDirectory(root);
  const prepared = readJson(join(root, 'prepared.json'));
  const draft = readJson(join(root, 'draft.json'));
  if (digest(prepared) !== items[0].prepared_digest || draft.binding_digest !== items[0].binding_digest) throw Error('Review context was modified.');
  const tenant = run.seed.setup === 'tenant-b' ? 'tenant-b' : 'tenant-a';
  const registry = join(root, 'registry');
  ordinaryDirectory(registry);
  ordinaryDirectory(join(registry, 'prepares-' + tenant));
  const host = createProductHost({ root: registry, tenant, initializeDefaults: false });
  return { host, draft, seed: run.seed, snapshotTime: '2026-09-14T00:00:00Z' };
}
export function checkReviewWorkspaceCase(workspace, caseId) {
  const { host, draft, seed, snapshotTime } = loadReviewWorkspaceCase(workspace, caseId);
  return checkReviewDraft(host, draft, seed, snapshotTime);
}
export function prepareReviewWorkspace({ base = join(repository, '.boundx'), signal } = {}) {
  const plan = loadAcceptancePlan();
  const parent = resolve(base);
  for (const path of [parent, join(parent, 'gold-review')]) {
    if (!existsSync(path)) mkdirSync(path);
    ordinaryDirectory(path);
  }
  const output = join(parent, 'gold-review', randomUUID());
  mkdirSync(output);
  const manifest = { schema: 'boundx-gold-workspace/v1', corpus_digest: plan.corpus_digest, review_index_digest: plan.review_index_digest,
    status: 'BUILDING', expected_cases: 120, cases: [], independent_review_verified: false, model_calls: 0 };
  atomicRecord(join(output, 'manifest.json'), manifest);
  try {
    for (const run of plan.runs.slice(0, 120)) {
      if (signal?.aborted) { manifest.status = 'CANCELLED'; break; }
      const root = join(output, run.case_id);
      const scenario = createCaseScenario(root, run.seed);
      const prepared = scenario.host.service.prepare(scenario.input);
      const draft = createReviewDraft(prepared, run.seed, scenario.snapshot_time);
      atomicRecord(join(root, 'prepared.json'), prepared);
      atomicRecord(join(root, 'draft.json'), draft);
      manifest.cases.push({ case_id: run.case_id, source_digest: run.source_digest, binding_digest: draft.binding_digest,
        prepared_digest: digest(prepared), initial_draft_digest: digest(draft) });
      atomicRecord(join(output, 'manifest.json'), manifest);
    }
    if (manifest.status === 'BUILDING') manifest.status = 'DRAFTS_CREATED';
  } catch {
    manifest.status = 'BUILD_FAILED';
  }
  atomicRecord(join(output, 'manifest.json'), manifest);
  return { ...manifest, output };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const args = process.argv.slice(2);
    if (!args.length || (args.length === 1 && args[0] === '--plan')) {
      const plan = loadAcceptancePlan();
      process.stdout.write(JSON.stringify({ cases: plan.distinct_sources, model_calls: 0, status: 'PENDING_GOLD_REVIEW' }) + '\n');
    } else if (args.length === 1 && args[0] === '--create') {
      const result = prepareReviewWorkspace();
      process.stdout.write(JSON.stringify({ ...result, cases: result.cases.length }, null, 2) + '\n');
      process.exitCode = result.status === 'DRAFTS_CREATED' ? 0 : 1;
    } else if (args.length === 3 && args[0] === '--check') {
      const result = checkReviewWorkspaceCase(args[1], args[2]);
      process.stdout.write(JSON.stringify(result, null, 2) + '\n');
      process.exitCode = result.all_candidates_structurally_valid ? 0 : 1;
    } else throw Error('Unsupported option');
  } catch {
    process.stderr.write('Review workspace failed. Use --plan, --create or --check <workspace> <case-id>; no model connection is required.\n');
    process.exitCode = 1;
  }
}
