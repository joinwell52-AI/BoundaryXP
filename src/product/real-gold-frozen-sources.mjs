import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync } from 'node:fs';
import { basename, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const corpusDirectory = 'BoundX-REAL-GOLD-60-BILINGUAL-v0.1';
const hexDigest = /^[a-f0-9]{64}$/u;
const defaultReviewRoot = fileURLToPath(new URL('../../.boundx/real-gold-60-review/REAL-GOLD-60-REVIEW-20260918-r01/adjudications-r02/', import.meta.url));

export function requiresFrozenRealGoldSources(reviewRoot) {
  return resolve(reviewRoot) === resolve(defaultReviewRoot);
}

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function resolveReviewSource(root, sourceFile) {
  if (typeof sourceFile !== 'string' || !sourceFile || isAbsolute(sourceFile)
    || sourceFile.includes(':') || sourceFile.includes('\\')) throw Error('REVIEW_SOURCE_PATH_UNSAFE');
  const segments = sourceFile.split('/');
  if (segments.some(segment => !segment || segment === '.' || segment === '..')) {
    throw Error('REVIEW_SOURCE_PATH_UNSAFE');
  }
  let path = resolve(root);
  for (const segment of segments) {
    path = join(path, segment);
    if (lstatSync(path).isSymbolicLink()) throw Error('REVIEW_SOURCE_SYMLINK_UNSUPPORTED');
  }
  if (!lstatSync(path).isFile()) throw Error('REVIEW_SOURCE_NOT_FILE');
  return path;
}

export function assertReviewArtifactFiles(root, names) {
  for (const name of names) {
    if (typeof name !== 'string' || !/^[A-Za-z0-9.-]+$/u.test(name)
      || !lstatSync(join(root, name)).isFile()) throw Error(`REVIEW_ARTIFACT_FILE_UNSAFE:${name}`);
  }
}

export function loadFrozenRealGoldSources(reviewRoot, { required = false } = {}) {
  const root = resolve(reviewRoot, '..', 'input', corpusDirectory);
  const manifestPath = join(root, 'CORPUS-MANIFEST.json');
  if (!existsSync(manifestPath)) {
    if (required || existsSync(root)) throw Error('FROZEN_SOURCE_BASELINE_MISSING');
    return null;
  }
  if (!lstatSync(root).isDirectory() || !lstatSync(manifestPath).isFile()) {
    throw Error('FROZEN_SOURCE_BASELINE_INVALID');
  }
  const corpus = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (!Array.isArray(corpus.cases) || corpus.cases.length === 0
    || corpus.cases.length !== corpus.included_count) throw Error('FROZEN_SOURCE_BASELINE_INVALID');
  const entries = new Map();
  for (const entry of corpus.cases) {
    if (!/^REAL-GOLD-\d{3}$/u.test(entry?.case_id)
      || typeof entry.source_file !== 'string' || !/^[^\\/]+\.md$/u.test(entry.source_file)
      || !hexDigest.test(entry.source_sha256 ?? '') || entries.has(entry.case_id)) {
      throw Error('FROZEN_SOURCE_BASELINE_INVALID');
    }
    entries.set(entry.case_id, entry);
  }
  return { root, entries };
}

export function verifyFrozenRealGoldSource(baseline, caseId, manifest, bytes) {
  if (baseline === null) return;
  const entry = baseline.entries.get(caseId);
  if (!entry || basename(manifest.source_file ?? '') !== entry.source_file
    || manifest.source_sha256 !== entry.source_sha256) throw Error('FROZEN_SOURCE_BASELINE_MISMATCH');
  const caseRoot = join(baseline.root, caseId);
  let frozenPath;
  try {
    if (!lstatSync(caseRoot).isDirectory()) throw Error('FROZEN_SOURCE_BASELINE_MISMATCH');
    frozenPath = resolveReviewSource(caseRoot, `source/${entry.source_file}`);
  } catch { throw Error('FROZEN_SOURCE_BASELINE_MISMATCH'); }
  const frozen = readFileSync(frozenPath);
  if (sha256(frozen) !== entry.source_sha256 || !frozen.equals(bytes)) {
    throw Error('FROZEN_SOURCE_BASELINE_MISMATCH');
  }
}
