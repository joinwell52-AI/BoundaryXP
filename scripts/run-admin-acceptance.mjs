import { existsSync, lstatSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { acceptancePlan, recordAcceptanceRun, summarizeAcceptanceRuns } from '../src/product/acceptance-run.mjs';
import { parseProductJson } from '../src/product/contracts.mjs';
import { createCaseScenario } from '../fixtures/admin-text/scenarios.mjs';
import { callHttpModel } from '../src/product/http-provider.mjs';
import { callCursor } from '../src/product/cursor-provider.mjs';
import { resolveEndpoint } from '../ui/connection.mjs';
import { sourceDigest } from '../src/bxp/index.mjs';
import { summarizeRepeats } from '../src/product/repeat-audit.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
export function loadAcceptancePlan() {
  const corpus = parseProductJson(readFileSync(join(repository, 'docs/tasks/BoundX-ADMIN-task-text-cases-v2.json')));
  const index = parseProductJson(readFileSync(join(repository, 'fixtures/admin-text/review-index.json')));
  return acceptancePlan(corpus, index);
}

export function acceptanceOptions(args, env) {
  if (!args.length || (args.length === 1 && args[0] === '--plan')) return { execute: false };
  const values = {};
  for (let index = 0; index < args.length; index++) {
    const key = args[index];
    if (!['--execute', '--authorize-synthetic-data', '--max-runs'].includes(key) || Object.hasOwn(values, key)) throw Error('Invalid or duplicate option.');
    values[key] = key === '--max-runs' ? args[++index] : true;
  }
  if (!values['--execute'] || !values['--authorize-synthetic-data'] || !/^(?:[1-9]|[1-9][0-9]|1[0-4][0-9]|150)$/.test(values['--max-runs'] ?? '')) throw Error('Execution requires explicit synthetic-data authorization and --max-runs 1..150.');
  const provider = env.BOUNDX_MODEL_PROVIDER;
  const model = env.BOUNDX_MODEL_ID;
  const key = provider === 'cursor' ? env.CURSOR_API_KEY : env.BOUNDX_MODEL_API_KEY;
  if (!['api', 'cursor'].includes(provider) || typeof model !== 'string' || !model.trim() || model.length > 256
    || typeof key !== 'string' || key.trim().length < 16 || key.length > 16384) throw Error('Configure provider, model and a valid environment credential before execution.');
  const config = { provider, model, key };
  if (provider === 'api') {
    config.protocol = env.BOUNDX_MODEL_PROTOCOL;
    config.url = resolveEndpoint(env.BOUNDX_MODEL_URL, config.protocol).url;
  }
  return { execute: true, authorizedSyntheticData: true, maxRuns: Number(values['--max-runs']), config };
}

function ensureDirectory(path) {
  if (!existsSync(path)) mkdirSync(path);
  const stat = lstatSync(path);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Acceptance storage must be an ordinary directory.');
}

export function atomicRecord(path, value) {
  const temporary = path + '.' + randomUUID() + '.tmp';
  writeFileSync(temporary, JSON.stringify(value, null, 2) + '\n', { flag: 'wx', encoding: 'utf8', mode: 0o600 });
  renameSync(temporary, path);
}

export async function executeAcceptanceBatch(plan, options, { base = join(repository, '.boundx'), sendModel, signal } = {}) {
  if (options.execute !== true || options.authorizedSyntheticData !== true || !Number.isInteger(options.maxRuns) || options.maxRuns < 1 || options.maxRuns > 150) throw Error('Explicit bounded execution and data authorization are required.');
  const schedule = [...Array.from({ length: 120 }, (_, index) => `T${String(index + 1).padStart(3, '0')}-1`),
    ...[1, 31, 111].flatMap(start => Array.from({ length: 10 }, (_, index) => `T${String(start + index).padStart(3, '0')}-2`))];
  if (plan.schema !== 'boundx-acceptance-plan/v1' || !Array.isArray(plan.runs) || plan.runs.length !== 150
    || plan.runs.some((run, index) => run?.run_id !== schedule[index]
      || run.run_id !== `${run.case_id}-${run.repetition}` || run.seed?.id !== run.case_id
      || typeof run.seed.task_text !== 'string' || run.source_digest !== sourceDigest(run.seed.task_text))) throw Error('Invalid acceptance plan.');
  const serializedPlan = JSON.stringify(plan);
  if (typeof options.config?.key !== 'string' || !options.config.key || serializedPlan.includes(JSON.stringify(options.config.key).slice(1, -1))) throw Error('Unsafe model configuration.');
  const root = resolve(base);
  ensureDirectory(root);
  ensureDirectory(join(root, 'acceptance-runs'));
  const output = join(root, 'acceptance-runs', randomUUID());
  mkdirSync(output);
  atomicRecord(join(output, 'plan.json'), plan);
  const records = [];
  atomicRecord(join(output, 'summary.json'), { ...summarizeAcceptanceRuns(records), execution_status: 'IN_PROGRESS' });
  let transport = sendModel;
  if (!transport) transport = options.config.provider === 'cursor' ? callCursor : callHttpModel;
  let failure = false;
  let activeRun;
  try {
    for (const run of plan.runs.slice(0, options.maxRuns)) {
      if (signal?.aborted) break;
      activeRun = run;
      const runRoot = join(output, run.run_id);
      const scenario = createCaseScenario(runRoot, run.seed);
      const record = await recordAcceptanceRun(scenario, run, options.config, { sendModel: transport, mode: sendModel ? 'mock' : 'live',
        hostId: options.config.provider, signal, persist: value => atomicRecord(join(runRoot, 'record.json'), value) });
      const { run_id, case_id, language, category, status, mode, provider_attempts, raw_candidate_recorded, repeat_signature, deterministic_replay } = record;
      records.push({ run_id, case_id, language, category, status, mode, provider_attempts, raw_candidate_recorded, repeat_signature, deterministic_replay });
      activeRun = null;
      atomicRecord(join(output, 'summary.json'), summarizeAcceptanceRuns(records));
    }
  } catch {
    failure = true;
    if (activeRun) records.push({ run_id: activeRun.run_id, case_id: activeRun.case_id, language: activeRun.seed.language, category: activeRun.seed.category,
      setup: activeRun.seed.setup, mode: sendModel ? 'mock' : 'live', provider_attempts: 0, status: 'INCOMPLETE_RECORD', diagnostic: 'RECORDING_OR_SETUP_FAILED' });
  }
  const summary = { ...summarizeAcceptanceRuns(records), requested_initial_runs: options.maxRuns,
    repeats: summarizeRepeats(records, plan),
    deterministic_replay: Object.fromEntries(['MATCHED', 'MISMATCH', 'NOT_APPLICABLE', 'UNAVAILABLE'].map(status =>
      [status, records.filter(record => (record.deterministic_replay?.status ?? 'UNAVAILABLE') === status).length])),
    incomplete_records: records.filter(record => record.status === 'INCOMPLETE_RECORD').map(record => record.run_id),
    execution_status: failure ? 'RECORDING_OR_SETUP_FAILED' : signal?.aborted ? 'CANCELLED' : 'FINISHED_REQUESTED_BATCH', output };
  atomicRecord(join(output, 'summary.json'), summary);
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const options = acceptanceOptions(process.argv.slice(2), process.env);
    const plan = loadAcceptancePlan();
    if (!options.execute) process.stdout.write(JSON.stringify({ ...plan, runs: plan.runs.map(({ seed, ...run }) => run), network_requests: 0 }, null, 2) + '\n');
    else {
      const controller = new AbortController();
      process.once('SIGINT', () => controller.abort());
      process.once('SIGTERM', () => controller.abort());
      const summary = await executeAcceptanceBatch(plan, options, { signal: controller.signal });
      process.stdout.write(JSON.stringify(summary, null, 2) + '\n');
      process.exitCode = summary.execution_status === 'FINISHED_REQUESTED_BATCH' ? 0 : 1;
    }
  } catch {
    process.stderr.write('Acceptance runner failed. Check explicit options and local model configuration; no credentials are printed.\n');
    process.exitCode = 1;
  }
}
