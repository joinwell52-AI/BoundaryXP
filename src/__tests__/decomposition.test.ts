import { test } from 'node:test';
import assert from 'node:assert/strict';
import { reviewDecomposition, evaluateLogic, boundaryResponseStatus, type DecompositionInput } from '../index.ts';
const claim = (expr: any) => ({ expr, quote: '报告 修复 汇总 已知 输入' });
const base = (): DecompositionInput => ({ baseline_text: claim('').quote, plan_text: claim('').quote,
  variables: ['r', 'h', 'f'].map(id => ({ id, quote: '报告' })), assumptions: claim({ all: [] }),
  requirements: [{ id: 'R', claim: claim({ all: ['r','h'] }) }],
  tasks: [{ id: 'T', requires: claim({ all: [] }), ensures: claim('r'), covers: ['R'], depends_on: [] }],
  completion: claim('T') });
const kinds = (x: DecompositionInput) => reviewDecomposition(x).findings.map(f => f.kind);
test('local completion may omit root delivery despite full trace links', () => {
  const r = reviewDecomposition(base());
  assert.ok(r.findings.some(f => f.kind === 'delivery_gap' && f.witness?.r && !f.witness.h));
  assert.ok(!r.findings.some(f => f.kind === 'requirement_unassigned'));
  assert.equal(r.business_decision, null);
  assert.equal(boundaryResponseStatus(r, []).response_status, 'awaiting_response');
});
test('complete plan and optional alternative preserve root delivery', () => {
  const x = base(); x.tasks[0].ensures = claim({ all: ['r','h'] });
  assert.deepEqual(kinds(x), []);
  x.tasks.push({ ...x.tasks[0], id: 'U' }); x.completion = claim({ any: ['T','U'] });
  assert.deepEqual(kinds(x), []);
});
test('repair prerequisite produces reverse witness', () => {
  const x = base(); x.tasks[0].ensures = claim({ all: ['r','h','f'] });
  const f = reviewDecomposition(x).findings.find(f => f.kind === 'additional_completion_condition')!;
  assert.equal(f.witness?.f, false); assert.equal(f.witness?.h, true);
});
test('business relationships can exclude a symbolic counterexample', () => {
  const x = base(); x.assumptions = claim({ any: [{ not: 'r' }, 'h'] });
  assert.ok(!kinds(x).includes('delivery_gap'));
});
test('contradiction is not vacuous success', () => {
  const x = base(); x.assumptions = claim({ all: ['r', { not: 'r' }] });
  assert.equal(reviewDecomposition(x).calculation_status, 'inconsistent_model');
  x.assumptions = claim({ all: [] }); x.tasks[0].ensures = claim({ any: [] });
  assert.ok(kinds(x).includes('plan_inconsistent'));
  x.tasks[0].ensures = claim('r'); x.requirements[0].claim = claim({ any: [] });
  assert.ok(kinds(x).includes('root_inconsistent'));
});
test('unassigned requirement and insufficient upstream output are separate findings', () => {
  const x = base(); x.tasks[0].covers = [];
  x.tasks.push({ id: 'QA', requires: claim('f'), ensures: claim('h'), covers: [], depends_on: ['T'] });
  x.completion = claim({ all: ['T','QA'] });
  assert.ok(kinds(x).includes('requirement_unassigned')); assert.ok(kinds(x).includes('input_gap'));
  x.tasks[0].ensures = claim({ all: ['r','f'] });
  assert.ok(!kinds(x).includes('input_gap'));
});
test('cycle and impossible upstream guarantees remain explicit', () => {
  const x = base(); x.tasks[0].depends_on = ['T']; x.tasks[0].ensures = claim({ any: [] });
  assert.ok(kinds(x).includes('dependency_cycle')); assert.ok(kinds(x).includes('upstream_inconsistent'));
});
test('invalid quotes references operators and bounds rejected', () => {
  const x = base(); x.tasks[0].depends_on = ['missing']; assert.throws(() => reviewDecomposition(x));
  x.tasks[0].depends_on = []; x.completion.quote = 'invented'; assert.throws(() => reviewDecomposition(x));
  x.completion = claim({ xor: [] }); assert.throws(() => reviewDecomposition(x));
  x.completion = claim('T'); x.variables = Array.from({length:13}, (_,i) => ({id: String(i),quote:'报告'}));
  assert.throws(() => reviewDecomposition(x));
  const deep = base(); let nested: any = 'r';
  for (let i=0;i<14;i++) nested={not:nested};
  deep.assumptions=claim(nested); assert.throws(() => reviewDecomposition(deep));
});
test('Boolean evaluator agrees with independent truth tables on all two-input functions', () => {
  for (let table=0; table<16; table++) {
    const terms = [];
    for (let row=0; row<4; row++) if (table & (1<<row)) terms.push({all: [row&1 ? 'a' : {not:'a'}, row&2 ? 'b' : {not:'b'}]});
    for (let row=0; row<4; row++) assert.equal(evaluateLogic({any:terms}, id => Boolean(row & (id==='a'?1:2))), Boolean(table & (1<<row)));
  }
});
