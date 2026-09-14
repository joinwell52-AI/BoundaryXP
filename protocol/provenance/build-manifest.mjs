import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';

const protocolRoot = new URL('../', import.meta.url);
const files = [
  'BXP-0001.md',
  'BXP-0001.zh-CN.md',
  'GOVERNANCE.md',
  'IPR.md',
  'PROVENANCE.md',
  'IMPLEMENTATION.md',
  '../docs/VALIDATION.md',
  'README.md',
  'conformance/README.md',
  'conformance/evaluate.mjs',
  'conformance/validation.mjs',
  'conformance/decimal.mjs',
  'conformance/hardening-cases.mjs',
  'conformance/hardening.test.mjs',
  'conformance/revision.test.mjs',
  '../.github/workflows/protocol.yml',
  'conformance/build-suite.mjs',
  'conformance/run.mjs',
  'conformance/conformance.test.mjs',
  'benchmarks/README.md',
  '../package.json',
  '../package-lock.json',
  '../docs/BOUNDX-LIGHTWEIGHT-PRODUCT-PLAN.md',
  '../docs/BOUNDX-PRODUCT-MANUAL.md',
  'TRADEMARKS.md',
  'schemas/boundx-task-v1.schema.json',
  'schemas/boundx-result-v1.schema.json',
  'schemas/boundx-calc-conformance-suite-v1.schema.json',
  'conformance/bxp-calc-v1.0.json',
  'benchmarks/source-index.json',
  'benchmarks/corpus-manifest.json',
];

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

const assets = files.map(path => {
  const bytes = readFileSync(new URL(path, protocolRoot));
  return { path, bytes: bytes.length, sha256: sha256(bytes) };
});

const suite = JSON.parse(readFileSync(new URL('conformance/bxp-calc-v1.0.json', protocolRoot), 'utf8'));
const caseIds = suite.cases.map(item => item.id);
const manifest = {
  schema: 'boundx-provenance-manifest/v1',
  protocol_version: suite.protocol_version,
  suite_version: suite.suite_version,
  hash_algorithm: 'sha-256',
  assets,
  suite: {
    case_count: suite.case_count,
    historical_source_count: suite.historical_source_count,
    foundational_case_count: suite.foundational_case_count,
    case_id_set_sha256: sha256(Buffer.from(caseIds.join('\n'), 'utf8')),
  },
  signature_status: 'unsigned-draft',
  signature: null,
};

const output = new URL('./manifest.json', import.meta.url);
writeFileSync(output, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify({ output: output.pathname, assets: assets.length,
  case_count: suite.case_count }, null, 2)}\n`);
