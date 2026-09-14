import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { encodeArchive, decodeArchive, crc32, withArchive } from '../product/archive.mjs';
import { validateDirectory } from '../product/packages.mjs';
import { LIMITS } from '../product/contracts.mjs';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const seed = () => encodeArchive(new Map([['data.json', Buffer.from('{"value":1}')]]), { compress: false });
const centralOffset = bytes => bytes.readUInt32LE(bytes.length - 6);

test('ZIP CRC matches the standard check value', () => assert.equal(crc32(Buffer.from('123456789')), 0xcbf43926));
test('stored and deflated ZIP preserve identical independent package identity', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-zip-'));
  try {
    const source = join(repository, 'domain-packs/l1/core-ontology');
    const pack = validateDirectory(source);
    const files = new Map(['datapackage.json', ...pack.descriptor.resources.map(resource => resource.path)].map(path => [path, readFileSync(join(source, path))]));
    for (const compress of [false, true]) {
      const path = join(root, compress + '.zip');
      writeFileSync(path, encodeArchive(files, { compress }));
      assert.equal(withArchive(path, directory => validateDirectory(directory).digest), pack.digest);
    }
  } finally { rmSync(root, { recursive: true, force: true }); }
});

const mutations = [
  ['encrypted', 'ZIP_ENCRYPTED', bytes => bytes.writeUInt16LE(1, centralOffset(bytes) + 8)],
  ['streaming descriptor', 'ZIP_UNSUPPORTED', bytes => bytes.writeUInt16LE(8, centralOffset(bytes) + 8)],
  ['unknown compression', 'ZIP_UNSUPPORTED', bytes => bytes.writeUInt16LE(99, centralOffset(bytes) + 10)],
  ['symlink', 'ZIP_LINK', bytes => bytes.writeUInt32LE(0xa1ff0000, centralOffset(bytes) + 38)],
  ['special file', 'ZIP_LINK', bytes => bytes.writeUInt32LE(0x21ff0000, centralOffset(bytes) + 38)],
  ['split archive', 'ZIP_UNSUPPORTED', bytes => bytes.writeUInt16LE(1, bytes.length - 18)],
  ['local header mismatch', 'ZIP_STRUCTURE', bytes => bytes.writeUInt16LE(8, 8)],
  ['uncompressed size over limit', 'ZIP_LIMIT', bytes => bytes.writeUInt32LE(LIMITS.file + 1, centralOffset(bytes) + 24)],
  ['central record overlap', 'ZIP_STRUCTURE', bytes => bytes.writeUInt32LE(1, centralOffset(bytes) + 42)],
  ['local filename mismatch', 'ZIP_STRUCTURE', bytes => { bytes[30] = 120; }],
  ['CRC mismatch', 'ZIP_INTEGRITY', bytes => { bytes[39] ^= 1; }],
  ['too many entries', 'ZIP_LIMIT', bytes => { bytes.writeUInt16LE(500, bytes.length - 14); bytes.writeUInt16LE(500, bytes.length - 12); }],
];
for (const [name, code, mutate] of mutations) test(`ZIP refuses ${name}`, () => {
  const bytes = seed(); mutate(bytes);
  assert.throws(() => decodeArchive(bytes), { code });
});
for (const path of ['../x.json', '/x.json', 'C:/x.json', '\\server\\x', 'a\\..\\x.json']) test(`ZIP build rejects ${path}`, () => {
  assert.throws(() => encodeArchive(new Map([[path, Buffer.from('{}')]])), { code: 'UNSAFE_PATH' });
});
test('ZIP detects case collisions and file/directory collisions', () => {
  assert.throws(() => encodeArchive(new Map([['a.json', Buffer.from('{}')], ['A.json', Buffer.from('{}')]])), { code: 'DUPLICATE_PATH' });
  assert.throws(() => encodeArchive(new Map([['a', Buffer.from('{}')], ['a/b.json', Buffer.from('{}')]])), { code: 'DUPLICATE_PATH' });
});
test('ZIP bounded inflation rejects compressed data larger than declared', () => {
  const bytes = encodeArchive(new Map([['data.json', Buffer.alloc(10000, 32)]]));
  bytes.writeUInt32LE(1, 22); bytes.writeUInt32LE(1, centralOffset(bytes) + 24);
  assert.throws(() => decodeArchive(bytes), { code: 'ZIP_EXPANSION' });
});
test('ZIP CLI builds without overwrite, imports without activation and validates offline', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-zip-cli-'));
  try {
    const env = { ...process.env, BOUNDX_DATA_DIR: join(root, 'registry'), BOUNDX_TENANT: 'tenant-a' };
    const run = args => spawnSync(process.execPath, [join(repository, 'cli.mjs'), 'pack', ...args], { env, encoding: 'utf8' });
    const archive = join(root, 'l1.zip');
    const built = run(['build', join(repository, 'domain-packs/l1/core-ontology'), '--output', archive]);
    assert.equal(built.status, 0, built.stderr);
    assert.notEqual(run(['build', join(repository, 'domain-packs/l1/core-ontology'), '--output', archive]).status, 0);
    const imported = run(['import', archive]); assert.equal(imported.status, 0, imported.stderr);
    const validated = run(['validate', archive]); assert.equal(validated.status, 0, validated.stderr);
    assert.equal(JSON.parse(validated.stdout).digest, JSON.parse(built.stdout).digest);
    assert.deepEqual(JSON.parse(run(['list']).stdout).active, []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});
