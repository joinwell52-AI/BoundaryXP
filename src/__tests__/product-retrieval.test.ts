import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateDirectory, matchActionCandidates } from '../product/packages.mjs';
import { retrieveDomainContext } from '../product/retrieval.mjs';
import { containsLexicalTerm } from '../product/lexical.mjs';
import { createProductHost } from '../product/host.mjs';
import { CORE_ELEMENTS } from '../bxp/index.mjs';
import { resolveSemanticReference } from '../product/assembler.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const l1 = validateDirectory(join(repository, 'domain-packs/l1/core-ontology'));
const l2 = validateDirectory(join(repository, 'domain-packs/l2/software-ai/0.2.0'), [l1]);

test('retrieval includes selected entity, role, resource, reference, completion and risk vocabulary', () => {
  const source = '软件工程师调用工具；执行时长最多5分钟；全部测试通过；依据commit SHA。';
  const entries = retrieveDomainContext(source, l2);
  for (const kind of ['action', 'entity', 'role', 'resource', 'reference', 'completion', 'risk']) assert.ok(entries.some(entry => entry.kind === kind), kind);
  assert.ok(entries.every(entry => entry.reference.kind === entry.kind && entry.retrieval.candidate_only === true));
  assert.ok(entries.filter(entry => entry.kind === 'risk').every(entry => entry.entry.decision === null));
  assert.deepEqual(entries.filter(entry => entry.kind === 'action').map(entry => entry.entry.id), matchActionCandidates(source, l2));
  assert.equal(Object.hasOwn(entries, 'elements'), false);
  assert.deepEqual(retrieveDomainContext(source, l2), entries);
});
test('finite literal matching checks later occurrences and preserves exact Unicode distinctions', () => {
  assert.equal(containsLexicalTerm('rebuild then build', 'build'), true);
  assert.equal(containsLexicalTerm('rebuild builder', 'build'), false);
  assert.equal(containsLexicalTerm('TOOL', 'tool'), true);
  assert.equal(containsLexicalTerm('ｔｏｏｌ', 'tool'), false);
  assert.equal(containsLexicalTerm('café', 'café'), false);
  assert.deepEqual(retrieveDomainContext('𠮷🧪', l2), []);
});
test('negated trigger remains a lexical candidate, never an automatically assigned B or allowed action', () => {
  const entries = retrieveDomainContext('不要调用工具。', l2);
  assert.ok(entries.some(entry => entry.entry.id === 'agent.invoke_tool'));
  assert.ok(entries.every(entry => entry.retrieval.candidate_only));
  assert.equal(entries.some(entry => Object.hasOwn(entry, 'modality') || Object.hasOwn(entry, 'execution_authorization')), false);
});
test('prepare freezes expanded vocabulary and retrieval version independently of later source changes', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-retrieval-'));
  try {
    const host = createProductHost({ root, tenant: 'tenant-a' });
    const base = host.registry.importDirectory(join(repository, 'domain-packs/l1/core-ontology')); host.registry.activate(base);
    const industry = host.registry.importDirectory(join(repository, 'domain-packs/l2/software-ai/0.2.0')); host.registry.activate(industry);
    const input = { source: { text: '执行时长最多5分钟；全部测试通过。', language: 'zh-CN' },
      profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs: [base, industry] };
    const prepared = host.service.prepare(input);
    assert.equal(prepared.rules.retrieval, 'literal-ascii-v2');
    assert.ok(prepared.entries.some(entry => entry.kind === 'completion'));
    input.source.text = '𠮷🧪';
    const changed = host.service.prepare(input);
    assert.notEqual(changed.prepare_id, prepared.prepare_id);
    assert.deepEqual(host.service.load(prepared.prepare_id).entries, prepared.entries);
    input.source.text = l2.payloads.actions.frames.map(frame => frame.triggers.zh[0]).join('；');
    assert.throws(() => host.service.prepare(input), { code: 'CONTEXT_LIMIT' });
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('same entry ID across semantic kinds requires explicit kind instead of first-match resolution', () => {
  const reference = { scope: 'boundx', pack_id: 'test', version: '1.0.0', digest: 'a'.repeat(64), entry_id: 'shared' };
  const entries = ['entity', 'resource'].map(kind => ({ kind, reference: { ...reference, kind }, entry: { id: 'shared' } }));
  assert.throws(() => resolveSemanticReference(entries, reference), { code: 'AMBIGUOUS_REFERENCE' });
  assert.equal(resolveSemanticReference(entries, { ...reference, kind: 'resource' }).kind, 'resource');
  assert.throws(() => resolveSemanticReference(entries, { ...reference, kind: 'risk' }), { code: 'UNKNOWN_REFERENCE' });
  assert.equal(resolveSemanticReference(entries.slice(0, 1), reference).kind, 'entity');
});
