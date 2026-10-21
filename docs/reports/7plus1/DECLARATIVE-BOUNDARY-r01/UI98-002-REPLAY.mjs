// Read-only replay of one user-run candidate and its patch. No model calls.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {compileCore} from '../../../../src/bxp/ir-kernel/index.mjs';
import {evaluateCore} from '../../../../src/bxp/ir-kernel/evaluate.mjs';
import {evaluateRequirements} from '../../../../src/bxp/ir-kernel/rules.mjs';
import {stable} from '../../../../src/bxp/ir-kernel/values.mjs';

const root = process.argv[2];
if (!root) throw new Error('Usage: node UI98-002-REPLAY.mjs <saved-run-directory> [evidence-output.json]');
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), 'utf8'));
const hash = relative => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, relative))).digest('hex');
const calls = [[0, 'parse-call'], [0, 'audit-call'], [1, 'patch-call'], [1, 'audit-call']].map(([revision, directory]) => {
  const file = `revision-${revision}/${directory}/receipt-0.json`;
  const receipt = read(file);
  return {revision, directory, receipt_sha256: hash(file), elapsed_ms: receipt.elapsed_ms,
    exit_code: receipt.exit_code, observed_internal_retries: receipt.observed_internal_retries,
    conservative_request_count: receipt.conservative_request_count, usage: receipt.usage};
});
const counterexample = [0, 1].map(revision => {
  const file = `revision-${revision}/candidate-ir.json`;
  const ir = read(file), core = compileCore(ir).core;
  const key = stable({object: evaluateCore(core, {kind: 'ENTITY', id: 'f4'}),
    producer: evaluateCore(core, {kind: 'EVENT', id: 'e2'})});
  // Content available at 5; consumer starts at 6; producer finishes at 10.
  // This checks only the data-use rule, not whole-task feasibility or execution.
  const query = {requirements: ['r17'], plan: {events: [
    {id: 'e2', task_id: 't1', occurred: true, completed: true, start: '0', end: '10', unit: 'second'},
    {id: 'e3', task_id: 't1', occurred: true, completed: true, start: '6', end: '7', unit: 'second'},
  ]}, availability: {[key]: {at: '5', unit: 'second'}}};
  const result = evaluateRequirements(core, query);
  return {revision, candidate_sha256: hash(file), rule_id: 'r17',
    availability: ir.requirements.find(r => r.id === 'r17').data_use.availability,
    query, result};
});
if (counterexample[0].result.result !== 'SATISFIED' || counterexample[1].result.result !== 'VIOLATED') {
  throw new Error('Replay differs from recorded r17 strengthening; inspect rather than update expected result.');
}
const evidence = {run_id: path.basename(root), purpose: 'USER_RUN_OBSERVATION_NO_NEW_MODEL_CALLS',
  first_generation_under_60_seconds: calls[0].elapsed_ms < 60000, calls,
  model_elapsed_ms: calls.reduce((sum, c) => sum + c.elapsed_ms, 0), counterexample};
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify(evidence, null, 2) + '\n', {flag: 'wx'});
console.log(JSON.stringify(evidence, null, 2));
