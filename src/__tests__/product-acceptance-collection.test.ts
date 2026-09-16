import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { atomicRecord, loadAcceptancePlan } from '../../scripts/run-admin-acceptance.mjs';
import { collectAcceptanceSegments } from '../../scripts/collect-admin-runs.mjs';

const plan = loadAcceptancePlan();
function segment(root, name, position, status = 'REJECTED') {
  const directory = join(root, name);
  mkdirSync(directory);
  atomicRecord(join(directory, 'plan.json'), plan);
  const run = plan.runs[position - 1];
  mkdirSync(join(directory, run.run_id));
  const record = { schema: 'boundx-model-run/v1', run_id: run.run_id, case_id: run.case_id, repetition: run.repetition,
    source_digest: run.source_digest, language: run.seed.language, category: run.seed.category, setup: run.seed.setup,
    mode: 'mock', provider_attempts: 1, status, raw_candidate_recorded: false, raw_candidate: null };
  atomicRecord(join(directory, run.run_id, 'record.json'), record);
  return directory;
}

test('segment collection preserves interrupted records, missing slots and source digests', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-collect-'));
  try {
    const first = segment(root, 'first', 41, 'CALL_STARTED');
    const second = segment(root, 'second', 42);
    const before = readFileSync(join(first, 'T041-1', 'record.json'));
    const summary = collectAcceptanceSegments([first, second], { base: root });
    assert.equal(summary.records, 2);
    assert.equal(summary.live_provider_attempts_recorded, 0);
    assert.equal(summary.missing_or_incomplete_runs, 150);
    assert.deepEqual(summary.incomplete_records, ['T041-1']);
    assert.equal(summary.missing_records.length, 148);
    assert.equal(summary.model_calls, 0);
    assert.equal(summary.acceptance_passed, false);
    assert.equal(summary.recorded_modes_are_authenticated, false);
    assert.deepEqual(readFileSync(join(first, 'T041-1', 'record.json')), before);
    assert.equal(JSON.parse(readFileSync(join(summary.output, 'T041-1', 'record.json'), 'utf8')).status, 'CALL_STARTED');
    assert.equal(JSON.parse(readFileSync(join(summary.output, 'source-index.json'), 'utf8')).sources.length, 2);
    assert.notEqual(collectAcceptanceSegments([first, second], { base: root }).output, summary.output);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('segment collection refuses duplicate IDs and altered source metadata before output', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-collect-invalid-'));
  try {
    const first = segment(root, 'first', 1);
    const second = segment(root, 'second', 1);
    const base = join(root, 'not-created');
    assert.throws(() => collectAcceptanceSegments([first, second], { base }), /Duplicate/);
    assert.equal(existsSync(base), false);
    const path = join(first, 'T001-1', 'record.json');
    const record = JSON.parse(readFileSync(path, 'utf8'));
    for (const change of [{ source_digest: '0'.repeat(64) }, { category: 'forged' }, { status: 'PASSED' }, { raw_candidate_recorded: true }]) {
      atomicRecord(path, { ...record, ...change });
      assert.throws(() => collectAcceptanceSegments([first], { base }), /Invalid run/);
      assert.equal(existsSync(base), false);
    }
    atomicRecord(join(first, 'plan.json'), { ...plan, initial_runs: 149 });
    assert.throws(() => collectAcceptanceSegments([first], { base }), /plan differs/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
