import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, cpSync, mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { validateDirectory, matchActionCandidates } from '../product/packages.mjs';
import { locateEvidence } from '../product/evidence.mjs';

const l1 = validateDirectory(new URL('../../domain-packs/l1/core-ontology/', import.meta.url));
const path = new URL('../../domain-packs/l2/software-ai/0.2.0/', import.meta.url);
const l2 = validateDirectory(path, [l1]);
const data = JSON.parse(readFileSync(new URL('../../fixtures/admin-text/l2-frame-cases.json', import.meta.url), 'utf8'));
test('L2 retains all 107 existing frame identities without semantic changes', () => {
  const old = JSON.parse(readFileSync(new URL('../../domain-packs/l2/software-ai/actions.json', import.meta.url), 'utf8'));
  for (const frame of old.frames) assert.deepEqual(l2.payloads.actions.frames.find(item => item.id === frame.id), frame);
  assert.equal(l2.payloads.actions.frames.length, 122);
});
test('L2 requires the exact L1 content identity', () => {
  assert.throws(() => validateDirectory(path), { code: 'DEPENDENCY' });
  assert.throws(() => validateDirectory(path, [{ ...l1, digest: '0'.repeat(64) }]), { code: 'DEPENDENCY' });
});
test('L2 is portable outside the source checkout', () => {
  const directory = mkdtempSync(join(tmpdir(), 'boundx-l2-'));
  try {
    cpSync(path, directory, { recursive: true });
    assert.equal(validateDirectory(directory, [l1]).digest, l2.digest);
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('every new frame has two languages and four independently identified fixture classes', () => {
  assert.equal(data.count, 120);
  assert.equal(new Set(data.cases.map(item => item.id)).size, data.count);
  for (const frame of new Set(data.cases.map(item => item.frame_id))) {
    assert.equal(new Set(data.cases.filter(item => item.frame_id === frame).map(item => item.language + ':' + item.type)).size, 8);
  }
});
for (const fixture of data.cases) {
  test(`L2 lexical/evidence fixture ${fixture.id}`, () => {
    const matches = matchActionCandidates(fixture.task_text, l2);
    assert.ok(matches.includes(fixture.expected.contains_frame));
    if (fixture.expected.also_contains_frame) assert.ok(matches.includes(fixture.expected.also_contains_frame));
    if (fixture.expected.evidence_diagnostic) assert.throws(() => locateEvidence({ task: fixture.task_text }, fixture.locator), { code: fixture.expected.evidence_diagnostic });
    else {
      const span = locateEvidence({ task: fixture.task_text }, fixture.locator);
      assert.equal(Array.from(fixture.task_text).slice(span.start, span.end).join(''), fixture.locator.quote);
    }
    assert.ok(Array.isArray(matches) && matches.every(item => typeof item === 'string'));
    assert.equal(Object.hasOwn(matches, 'B'), false);
  });
}
