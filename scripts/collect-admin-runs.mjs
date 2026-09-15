import { existsSync, lstatSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { digest, RAW_JSON_BYTE_LIMIT } from '../src/bxp/index.mjs';
import { parseProductJson } from '../src/product/contracts.mjs';
import { summarizeAcceptanceRuns } from '../src/product/acceptance-run.mjs';
import { summarizeRepeats } from '../src/product/repeat-audit.mjs';
import { atomicRecord, loadAcceptancePlan } from './run-admin-acceptance.mjs';

const repository = fileURLToPath(new URL('../', import.meta.url));
function ordinaryDirectory(path) {
  const stat = lstatSync(path);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw Error('Expected an ordinary directory.');
}
function readJson(path) {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || stat.size > RAW_JSON_BYTE_LIMIT) throw Error('Invalid record file.');
  return parseProductJson(readFileSync(path));
}

export function collectAcceptanceSegments(directories, { base = join(repository, '.boundx') } = {}) {
  if (!Array.isArray(directories) || directories.length < 1 || directories.length > 150) throw Error('Explicit segment directories required.');
  const plan = loadAcceptancePlan();
  const schedule = new Map(plan.runs.map(run => [run.run_id, run]));
  const observations = new Map();
  const sources = [];
  for (const directory of directories) {
    const path = resolve(directory);
    ordinaryDirectory(path);
    if (digest(readJson(join(path, 'plan.json'))) !== digest(plan)) throw Error('Segment plan differs.');
    const source = { directory: path, records: [] };
    for (const name of readdirSync(path).filter(name => name.startsWith('T'))) {
      const run = schedule.get(name);
      if (!run || observations.has(name)) throw Error('Duplicate or foreign run ID.');
      ordinaryDirectory(join(path, name));
      const record = readJson(join(path, name, 'record.json'));
      if (record.schema !== 'boundx-model-run/v1' || record.run_id !== name || record.case_id !== run.case_id
        || record.repetition !== run.repetition || record.source_digest !== run.source_digest
        || record.language !== run.seed.language || record.category !== run.seed.category || record.setup !== run.seed.setup
        || !['live', 'mock'].includes(record.mode) || ![0, 1].includes(record.provider_attempts)
        || !['STARTED', 'CALL_STARTED', 'MODEL_RETURNED', 'COMPUTED', 'REJECTED'].includes(record.status)
        || typeof record.raw_candidate_recorded !== 'boolean'
        || (record.raw_candidate_recorded ? typeof record.raw_candidate !== 'string' : record.raw_candidate !== null)) throw Error('Invalid run record.');
      observations.set(name, record);
      source.records.push({ run_id: name, record_digest: digest(record) });
    }
    sources.push(source);
  }
  const records = plan.runs.filter(run => observations.has(run.run_id)).map(run => observations.get(run.run_id));
  const parent = resolve(base);
  for (const path of [parent, join(parent, 'acceptance-collections')]) {
    if (!existsSync(path)) mkdirSync(path);
    ordinaryDirectory(path);
  }
  const output = join(parent, 'acceptance-collections', randomUUID());
  mkdirSync(output);
  atomicRecord(join(output, 'summary.json'), { execution_status: 'BUILDING', acceptance_passed: false });
  atomicRecord(join(output, 'plan.json'), plan);
  atomicRecord(join(output, 'source-index.json'), { sources, model_calls: 0 });
  for (const record of records) {
    mkdirSync(join(output, record.run_id));
    atomicRecord(join(output, record.run_id, 'record.json'), record);
  }
  const summary = { ...summarizeAcceptanceRuns(records), repeats: summarizeRepeats(records, plan),
    incomplete_records: records.filter(record => !['COMPUTED', 'REJECTED'].includes(record.status)).map(record => record.run_id),
    missing_records: plan.runs.filter(run => !observations.has(run.run_id)).map(run => run.run_id),
    source_index_digest: digest({ sources, model_calls: 0 }), model_calls: 0,
    recorded_modes_are_authenticated: false, acceptance_passed: false, execution_status: 'REPORTS_WRITTEN', output };
  atomicRecord(join(output, 'summary.json'), summary);
  return summary;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { process.stdout.write(JSON.stringify(collectAcceptanceSegments(process.argv.slice(2)), null, 2) + '\n'); }
  catch { process.stderr.write('Segment collection failed; no records were overwritten or model requests sent.\n'); process.exitCode = 1; }
}
