import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAcceptancePlan } from '../../scripts/run-admin-acceptance.mjs';
import { summarizeRepeats } from '../product/repeat-audit.mjs';

const plan = loadAcceptancePlan();
function records() {
  return plan.runs.map(run => ({ run_id: run.run_id, case_id: run.case_id, mode: 'mock', status: 'COMPUTED',
    repeat_signature: { source_digest: run.source_digest, context_digest: 'context', prepare_id: 'prepare',
      actual_model: 'fixture-model', actual_model_version: 'unknown', raw_digest: 'raw', structure_digest: 'structure', calculation_digest: 'calculation' } }));
}

test('all thirty repeated mock pairs are accounted for without claiming live or semantic accuracy', () => {
  const result = summarizeRepeats(records(), plan);
  assert.equal(result.planned_pairs, 30);
  assert.equal(result.comparable_pairs, 30);
  assert.equal(result.live_comparable_pairs, 0);
  assert.equal(result.semantic_accuracy, null);
  assert.equal(result.acceptance_passed, false);
  assert.ok(result.pairs.every(pair => pair.structure_equal && pair.calculation_equal && !pair.model_version_known));
});

test('missing first or second runs cannot disappear from repeat denominators', () => {
  const result = summarizeRepeats(records().filter(record => !['T001-1', 'T031-2'].includes(record.run_id)), plan);
  assert.equal(result.pairs.length, 30);
  assert.equal(result.comparable_pairs, 28);
  assert.equal(result.pairs.filter(pair => pair.status === 'MISSING_RUN').length, 2);
  assert.equal(summarizeRepeats([], plan).pairs.filter(pair => pair.status === 'MISSING_RUN').length, 30);
});

test('raw, representation and computation changes are distinguished rather than treated as semantic failure', () => {
  const values = records();
  values[120].repeat_signature.raw_digest = 'different';
  values[121].repeat_signature.structure_digest = 'different';
  values[122].repeat_signature.calculation_digest = 'different';
  const pairs = summarizeRepeats(values, plan).pairs;
  assert.deepEqual([pairs[0].raw_equal, pairs[0].structure_equal, pairs[0].calculation_equal], [false, true, true]);
  assert.deepEqual([pairs[1].raw_equal, pairs[1].structure_equal, pairs[1].calculation_equal], [true, false, true]);
  assert.equal(pairs[2].calculation_equal, false);
});

test('changed contexts, provider modes, models, failed outputs and absent signatures are not comparable', () => {
  const mutations = [
    ['MODE_MISMATCH', record => { record.mode = 'live'; }],
    ['CONTEXT_MISMATCH', record => { record.repeat_signature.context_digest = 'other'; }],
    ['CONTEXT_MISMATCH', record => { record.repeat_signature.source_digest = 'other'; }],
    ['CONTEXT_MISMATCH', record => { record.repeat_signature.prepare_id = null; }],
    ['MODEL_NOT_COMPARABLE', record => { record.repeat_signature.actual_model = 'unknown'; }],
    ['MODEL_NOT_COMPARABLE', record => { record.repeat_signature.actual_model = 'other'; }],
    ['MODEL_NOT_COMPARABLE', record => { record.repeat_signature.actual_model_version = 'different'; }],
    ['OUTPUT_UNAVAILABLE', record => { record.status = 'REJECTED'; }],
    ['OUTPUT_UNAVAILABLE', record => { record.repeat_signature.structure_digest = null; }],
    ['SIGNATURE_UNAVAILABLE', record => { delete record.repeat_signature; }],
  ];
  for (const [status, mutate] of mutations) {
    const values = records();
    mutate(values[120]);
    const result = summarizeRepeats(values, plan);
    assert.equal(result.pairs[0].status, status);
    assert.equal(result.pairs[0].structure_equal, null);
    assert.equal(result.comparable_pairs, 29);
  }
});

test('foreign, duplicate and mismatched records fail rather than pairing by position', () => {
  const values = records();
  assert.throws(() => summarizeRepeats([...values, values[0]], plan), { code: 'REPEAT_IDENTITY' });
  values[0].case_id = 'T002';
  assert.throws(() => summarizeRepeats(values, plan), { code: 'REPEAT_IDENTITY' });
  assert.throws(() => summarizeRepeats([{ run_id: 'T999-1', case_id: 'T999' }], plan), { code: 'REPEAT_IDENTITY' });
});
