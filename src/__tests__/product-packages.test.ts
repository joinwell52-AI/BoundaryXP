import test from 'node:test';
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { safeResourcePath, validateDirectory } from '../product/packages.mjs';

for (const path of ['../a.json', '/a.json', 'C:/a.json', '\\server\\share', 'a\\..\\b.json', 'CON.json', 'aux/x.json', 'a.json:ads', 'a./b.json', 'a /b.json', 'a//b.json', 'a/./b.json']) {
  test(`portable package rejects path ${path}`, () => assert.throws(() => safeResourcePath(path), { code: 'UNSAFE_PATH' }));
}
test('independent L1 validates away from repository without Python', () => {
  const directory = mkdtempSync(join(tmpdir(), 'boundx-l1-'));
  try {
    cpSync(new URL('../../domain-packs/l1/core-ontology/', import.meta.url), directory, { recursive: true });
    const original = validateDirectory(directory);
    assert.equal(original.descriptor.version, '1.1.0');
    assert.equal(original.payloads.ontology.operations.READ.role, 'input');
    const path = join(directory, 'datapackage.json');
    writeFileSync(path, JSON.stringify(original.descriptor));
    assert.equal(validateDirectory(directory).digest, original.digest);
    writeFileSync(join(directory, 'ontology.json'), readFileSync(join(directory, 'ontology.json'), 'utf8') + ' ');
    assert.throws(() => validateDirectory(directory), { code: 'RESOURCE_DIGEST' });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
test('independent L1 rejects undeclared resource and executes no package instructions', () => {
  const directory = mkdtempSync(join(tmpdir(), 'boundx-l1-'));
  try {
    cpSync(new URL('../../domain-packs/l1/core-ontology/', import.meta.url), directory, { recursive: true });
    writeFileSync(join(directory, 'extra.json'), '{}');
    assert.throws(() => validateDirectory(directory), { code: 'UNDECLARED_RESOURCE' });
  } finally { rmSync(directory, { recursive: true, force: true }); }
});
