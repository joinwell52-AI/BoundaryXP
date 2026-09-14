import { CORE_ELEMENTS, sourceDigest } from '../../src/bxp/index.mjs';
import { createAcceptanceSetup } from './setup.mjs';

export const SETUPS = ['default', 'no-l3', 'deactivated-before-prepare', 'l1-only', 'tenant-b', 'changed-after-prepare',
  'with-policy', 'missing-policy', 'policy-version-mismatch', 'bad-pack-digest', 'two-adapters', 'malicious-pack-text'];

export function createCaseScenario(root, seed) {
  if (!SETUPS.includes(seed.setup)) throw Error('Unknown acceptance setup');
  const setup = createAcceptanceSetup(root, { tenant: seed.setup === 'tenant-b' ? 'tenant-b' : 'tenant-a', malicious: seed.setup === 'malicious-pack-text' });
  const { host } = setup;
  let packs = setup.packs;
  if (['no-l3', 'deactivated-before-prepare', 'l1-only'].includes(seed.setup)) {
    host.registry.deactivate(packs[2]);
    packs = packs.slice(0, 2);
    if (seed.setup === 'l1-only') { host.registry.deactivate(packs[1]); packs = packs.slice(0, 1); }
  }
  const input = { source: { text: seed.task_text, language: seed.language },
    profile: { id: 'org.boundx.admin', required_elements: [...CORE_ELEMENTS] }, packs };
  if (['with-policy', 'policy-version-mismatch'].includes(seed.setup)) {
    const text = seed.setup === 'with-policy' ? '只有测试通过才可交付。' : '版本v2：只有测试通过才可交付。';
    input.sources = [{ id: 'POL-1', kind: 'policy', version: 'v1', language: 'zh-CN', text, digest: sourceDigest(text) }];
  }
  let changed = false;
  return { host, input, snapshot_time: setup.snapshot_time,
    afterPrepare() {
      if (seed.setup === 'changed-after-prepare' && !changed) {
        createAcceptanceSetup(root, { changed: true });
        changed = true;
      }
    },
  };
}
