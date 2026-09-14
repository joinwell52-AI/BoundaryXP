import test from 'node:test';
import assert from 'node:assert/strict';
import { packLabel } from './pack-labels.mjs';

test('all current industry options retain bilingual labels and version without changing identity', () => {
  for (const pack_id of ['warehouse-inventory', 'software-ai', 'financial-credit', 'crossborder-customs',
    'government-affairs', 'fleet-logistics', 'auto-rental', 'healthcare-prescription', 'customer-refund',
    'property-safety', 'procurement-bidding', 'ops-sys']) {
    const reference = Object.freeze({ pack_id, version: '1.2.3', digest: 'unchanged' });
    assert.match(packLabel(reference), /[\u4e00-\u9fff]+.* \/ [A-Za-z].* · 1\.2\.3$/u);
    assert.equal(reference.digest, 'unchanged');
  }
});

test('new industries remain selectable before display translations are added', () => {
  assert.equal(packLabel({ pack_id: 'future-industry', version: '2.0.0' }), 'future-industry@2.0.0');
});
