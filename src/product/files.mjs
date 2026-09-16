import { openSync, closeSync, fstatSync, readSync, lstatSync } from 'node:fs';
import { assert, LIMITS } from './contracts.mjs';

export function readBoundedFile(path, limit = LIMITS.file) {
  const info = lstatSync(path);
  assert(info.isFile() && !info.isSymbolicLink(), 'FILE_TYPE', 'Expected an ordinary file.');
  const descriptor = openSync(path, 'r');
  try {
    const opened = fstatSync(descriptor);
    assert(opened.isFile() && opened.size <= limit, 'INPUT_LIMIT', 'File exceeds input limit.');
    const bytes = Buffer.alloc(limit + 1);
    let size = 0;
    while (size < bytes.length) {
      const count = readSync(descriptor, bytes, size, bytes.length - size, null);
      if (!count) break;
      size += count;
    }
    assert(size <= limit, 'INPUT_LIMIT', 'File exceeds input limit.');
    return bytes.subarray(0, size);
  } finally { closeSync(descriptor); }
}
