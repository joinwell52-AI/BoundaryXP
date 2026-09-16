import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateDomainPayload } from '../product/domain-payloads.mjs';
import { retrieveDomainContext } from '../product/retrieval.mjs';

test('bilingual object aliases are retrieved without assuming an array', () => {
  const payloads = Object.fromEntries(['actions', 'entities', 'roles', 'resources', 'references', 'completions', 'boundaries'].map(kind =>
    [kind, JSON.parse(readFileSync(new URL(`../../domain-packs/l2/software-ai/0.2.0/${kind}.json`, import.meta.url), 'utf8'))]));
  payloads.roles.roles[0].aliases = { zh: ['测试岗位别名'], en: ['test-role-alias'] };
  const pack = { descriptor: { name: 'software-ai', version: '0.2.0', boundx: { scope: 'boundx' } }, digest: 'a'.repeat(64), payloads };
  for (const source of ['由测试岗位别名核对。', 'Ask test-role-alias to review.']) {
    assert.ok(retrieveDomainContext(source, pack).some(entry => entry.kind === 'role' && entry.entry.id === payloads.roles.roles[0].id));
  }
});

for (const kind of ['entities', 'roles', 'resources', 'references', 'completions', 'boundaries']) {
  const original = JSON.parse(readFileSync(new URL(`../../domain-packs/l2/software-ai/0.2.0/${kind}.json`, import.meta.url), 'utf8'));
  const key = kind === 'boundaries' ? 'risks' : kind;
  test(`${kind}: accepts existing versioned vocabulary without rewriting it`, () => {
    assert.equal(validateDomainPayload(kind, original), original);
  });
  for (const mutation of ['extra', 'label', 'missing', 'entry']) test(`${kind}: rejects ${mutation} malformed content`, () => {
    const value = structuredClone(original);
    if (mutation === 'extra') value[key][0].execution_authorization = true;
    if (mutation === 'label') value[key][0].label = 42;
    if (mutation === 'missing') delete value[key][0].id;
    if (mutation === 'entry') value[key][0] = 'not an entry';
    assert.throws(() => validateDomainPayload(kind, value), { code: 'PAYLOAD_SCHEMA' });
  });
}
