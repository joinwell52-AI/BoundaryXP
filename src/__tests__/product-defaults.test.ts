import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createProductHost } from '../product/host.mjs';

test('first startup installs and activates L1, subsequent startup preserves explicit deactivation', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-defaults-'));
  try {
    const host = createProductHost({ root });
    const before = host.invoke('bx_list_semantic_packs');
    assert.equal(before.installed.length, 1);
    assert.equal(before.installed[0].layer, 'L1');
    assert.equal(before.active[0].digest, before.installed[0].digest);
    assert.deepEqual(createProductHost({ root }).invoke('bx_list_semantic_packs'), before);
    host.registry.deactivate(before.active[0]);
    assert.deepEqual(createProductHost({ root }).registry.active(), []);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test('explicit headless opt-out leaves registry empty', () => {
  const root = mkdtempSync(join(tmpdir(), 'boundx-defaults-'));
  try { assert.deepEqual(createProductHost({ root, initializeDefaults: false }).registry.list(), []); }
  finally { rmSync(root, { recursive: true, force: true }); }
});
