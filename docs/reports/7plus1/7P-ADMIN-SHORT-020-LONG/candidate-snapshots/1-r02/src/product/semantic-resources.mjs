import { createHash } from 'node:crypto';
import { closeSync, existsSync, lstatSync, openSync, readFileSync, readSync, readdirSync, statSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { registeredValidator } from '../bxp/schema-registry.mjs';
import { isPublicSemanticSourceUrl } from './semantic-source-url.mjs';

const manifestValidator = registeredValidator('semantic_resource_manifest');

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function sha256File(path) {
  const hash = createHash('sha256');
  const descriptor = openSync(path, 'r');
  const buffer = Buffer.allocUnsafe(1024 * 1024);
  try {
    let offset = 0;
    while (true) {
      const bytesRead = readSync(descriptor, buffer, 0, buffer.length, offset);
      if (bytesRead === 0) break;
      hash.update(buffer.subarray(0, bytesRead));
      offset += bytesRead;
    }
  } finally {
    closeSync(descriptor);
  }
  return hash.digest('hex');
}

function resourceError(code, details = {}) {
  return { status: 'unavailable', code, ...details };
}

export function validateSemanticResourceManifest(value) {
  if (!manifestValidator(value)) return { valid: false, errors: structuredClone(manifestValidator.errors ?? []) };
  if (!isPublicSemanticSourceUrl(value.source_url)
    || !isPublicSemanticSourceUrl(value.license.source_url)) {
    return { valid: false, errors: [{ keyword: 'publicSourceUrl', instancePath: '/source_url',
      message: 'resource and license source URLs must not contain credentials or query parameters' }] };
  }
  const paths = new Set();
  for (const file of value.files) {
    if (paths.has(file.path)) return { valid: false, errors: [{ keyword: 'uniquePaths', instancePath: '/files', message: 'duplicate resource file path' }] };
    paths.add(file.path);
  }
  return { valid: true, errors: [] };
}

function safeResourceFile(root, path) {
  const directory = resolve(root);
  if (lstatSync(directory).isSymbolicLink()) throw Error('RESOURCE_ROOT_SYMLINK_REJECTED');
  const target = resolve(directory, path);
  const inside = relative(directory, target);
  if (isAbsolute(inside) || inside === '..' || inside.startsWith(`..${sep}`) || !inside) throw Error('RESOURCE_FILE_PATH_INVALID');
  let current = directory;
  for (const segment of inside.split(sep)) {
    current = resolve(current, segment);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) throw Error('RESOURCE_FILE_SYMLINK_REJECTED');
  }
  return target;
}

function resourceFiles(directory) {
  const files = new Set();
  const pending = [{ parent: directory, ignored: false }];
  while (pending.length) {
    const { parent, ignored } = pending.pop();
    for (const entry of readdirSync(parent, { withFileTypes: true })) {
      const path = resolve(parent, entry.name);
      if (lstatSync(path).isSymbolicLink()) throw Error('SEMANTIC_RESOURCE_PATH_INVALID');
      if (entry.isDirectory()) pending.push({ parent: path, ignored: ignored || entry.name === '.cache' });
      else if (entry.isFile() && !ignored && relative(directory, path) !== 'MANIFEST.json') {
        files.add(relative(directory, path).split(sep).join('/'));
      } else if (!entry.isFile()) throw Error('SEMANTIC_RESOURCE_PATH_INVALID');
    }
  }
  return files;
}

export function verifySemanticResource(root, manifest) {
  const review = validateSemanticResourceManifest(manifest);
  if (!review.valid) return resourceError('SEMANTIC_RESOURCE_MANIFEST_INVALID', { errors: review.errors });
  const directory = resolve(root);
  if (!existsSync(directory)) return resourceError('MODEL_RESOURCE_UNAVAILABLE', { resource_id: manifest.resource_id });
  const checked = [];
  for (const descriptor of manifest.files) {
    let target;
    try { target = safeResourceFile(directory, descriptor.path); } catch { return resourceError('SEMANTIC_RESOURCE_PATH_INVALID', { path: descriptor.path }); }
    if (!existsSync(target) || !statSync(target).isFile()) return resourceError('MODEL_RESOURCE_UNAVAILABLE', { resource_id: manifest.resource_id, path: descriptor.path });
    const bytes = statSync(target).size;
    if (bytes !== descriptor.bytes) return resourceError('SEMANTIC_RESOURCE_SIZE_MISMATCH', { path: descriptor.path, expected: descriptor.bytes, actual: bytes });
    const digest = sha256File(target);
    if (digest !== descriptor.sha256) return resourceError('SEMANTIC_RESOURCE_SHA256_MISMATCH', { path: descriptor.path, expected: descriptor.sha256, actual: digest });
    checked.push({ path: descriptor.path, sha256: digest, bytes });
  }
  let actual;
  try { actual = resourceFiles(directory); }
  catch { return resourceError('SEMANTIC_RESOURCE_PATH_INVALID'); }
  if (actual.size !== checked.length || checked.some(file => !actual.has(file.path))) {
    return resourceError('SEMANTIC_RESOURCE_FILE_INVENTORY_MISMATCH');
  }
  return { status: 'available', resource_id: manifest.resource_id, resource_kind: manifest.resource_kind,
    revision: manifest.revision, source_url: manifest.source_url,
    license: structuredClone(manifest.license), runtime: structuredClone(manifest.runtime), files: checked };
}

export function loadSemanticResourceManifest(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}
