import { deflateRawSync, inflateRawSync } from 'node:zlib';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { assert, LIMITS } from './contracts.mjs';
import { safeResourcePath } from './packages.mjs';
import { readBoundedFile } from './files.mjs';

const crcTable = Uint32Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ ((value & 1) ? 0xedb88320 : 0);
  return value >>> 0;
});
export function crc32(bytes) {
  let value = 0xffffffff;
  for (const byte of bytes) value = crcTable[(value ^ byte) & 255] ^ (value >>> 8);
  return (value ^ 0xffffffff) >>> 0;
}

export function decodeArchive(bytes) {
  assert(Buffer.isBuffer(bytes) && bytes.length >= 22 && bytes.length <= LIMITS.archive, 'ZIP_LIMIT', 'ZIP input exceeds its bounds.');
  let end = -1;
  for (let offset = bytes.length - 22; offset >= Math.max(0, bytes.length - 65557); offset--) {
    if (bytes.readUInt32LE(offset) === 0x06054b50 && offset + 22 + bytes.readUInt16LE(offset + 20) === bytes.length) { end = offset; break; }
  }
  assert(end >= 0, 'ZIP_STRUCTURE', 'ZIP end record is missing.');
  const count = bytes.readUInt16LE(end + 10), centralSize = bytes.readUInt32LE(end + 12), centralStart = bytes.readUInt32LE(end + 16);
  assert(bytes.readUInt16LE(end + 4) === 0 && bytes.readUInt16LE(end + 6) === 0 && bytes.readUInt16LE(end + 8) === count,
    'ZIP_UNSUPPORTED', 'Split archives are unsupported.');
  assert(count > 0 && count <= LIMITS.files * 2 + 1, 'ZIP_LIMIT', 'Too many ZIP entries.');
  assert(centralStart + centralSize === end, 'ZIP_STRUCTURE', 'Invalid central directory bounds.');
  const names = new Set(), records = [], files = new Map();
  let cursor = centralStart, expanded = 0, directories = 0;
  for (let index = 0; index < count; index++) {
    assert(cursor + 46 <= end && bytes.readUInt32LE(cursor) === 0x02014b50, 'ZIP_STRUCTURE', 'Invalid central record.');
    const flags = bytes.readUInt16LE(cursor + 8), method = bytes.readUInt16LE(cursor + 10);
    const checksum = bytes.readUInt32LE(cursor + 16), compressed = bytes.readUInt32LE(cursor + 20), size = bytes.readUInt32LE(cursor + 24);
    const nameSize = bytes.readUInt16LE(cursor + 28), extraSize = bytes.readUInt16LE(cursor + 30), commentSize = bytes.readUInt16LE(cursor + 32);
    const local = bytes.readUInt32LE(cursor + 42), attributes = bytes.readUInt32LE(cursor + 38);
    assert(!(flags & 1), 'ZIP_ENCRYPTED', 'Encrypted ZIP is not accepted.');
    assert((flags & ~0x806) === 0 && [0, 8].includes(method) && extraSize === 0 && bytes.readUInt16LE(cursor + 34) === 0
      && bytes.readUInt16LE(cursor + 6) <= 20, 'ZIP_UNSUPPORTED', 'Only plain stored/deflated ZIP without extra fields or streaming descriptors is supported.');
    assert(cursor + 46 + nameSize + commentSize <= end && nameSize > 0, 'ZIP_STRUCTURE', 'Invalid filename bounds.');
    const nameBytes = bytes.subarray(cursor + 46, cursor + 46 + nameSize);
    assert((flags & 0x800) || nameBytes.every(byte => byte < 128), 'ZIP_ENCODING', 'Non-ASCII ZIP names must declare UTF-8.');
    let name;
    try { name = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(nameBytes); }
    catch { assert(false, 'ZIP_ENCODING', 'Invalid UTF-8 filename.'); }
    const directory = name.endsWith('/'), path = safeResourcePath(directory ? name.slice(0, -1) : name);
    assert(path.split('/').length <= LIMITS.depth, 'ZIP_LIMIT', 'ZIP path exceeds depth limit.');
    const mode = (attributes >>> 16) & 0xf000;
    assert(mode === 0 || mode === (directory ? 0x4000 : 0x8000), 'ZIP_LINK', 'Links and special entries are not package data.');
    assert(!(attributes & 0x10) || directory, 'ZIP_STRUCTURE', 'Directory attributes disagree with name.');
    assert(!names.has(path.toLowerCase()), 'DUPLICATE_PATH', 'Duplicate or case-colliding ZIP path.');
    names.add(path.toLowerCase());
    if (directory) assert(++directories <= LIMITS.files && size === 0 && compressed === 0, 'ZIP_LIMIT', 'Invalid empty directory.');
    else {
      assert(size <= (path === 'datapackage.json' ? LIMITS.descriptor : LIMITS.file), 'ZIP_LIMIT', 'ZIP resource exceeds size limit.');
      expanded += size;
      assert(expanded <= LIMITS.expanded && files.size <= LIMITS.files, 'ZIP_LIMIT', 'ZIP expansion exceeds aggregate limit.');
      files.set(path, null);
    }
    assert(local + 30 <= centralStart && bytes.readUInt32LE(local) === 0x04034b50, 'ZIP_STRUCTURE', 'Invalid local record.');
    assert(bytes.readUInt16LE(local + 6) === flags && bytes.readUInt16LE(local + 8) === method
      && bytes.readUInt32LE(local + 14) === checksum && bytes.readUInt32LE(local + 18) === compressed
      && bytes.readUInt32LE(local + 22) === size && bytes.readUInt16LE(local + 26) === nameSize
      && bytes.readUInt16LE(local + 28) === 0, 'ZIP_STRUCTURE', 'Local and central records disagree.');
    const dataStart = local + 30 + nameSize, dataEnd = dataStart + compressed;
    assert(dataEnd <= centralStart && bytes.subarray(local + 30, dataStart).equals(nameBytes), 'ZIP_STRUCTURE', 'Local filename or data bounds differ.');
    records.push({ path, directory, local, dataStart, dataEnd, size, method, checksum });
    cursor += 46 + nameSize + commentSize;
  }
  assert(cursor === end, 'ZIP_STRUCTURE', 'Unexpected central directory data.');
  let next = 0;
  for (const record of records.sort((left, right) => left.local - right.local)) {
    assert(record.local === next, 'ZIP_STRUCTURE', 'Overlapping, prefixed or undeclared ZIP data.');
    next = record.dataEnd;
    for (let parent = dirname(record.path).replaceAll('\\', '/'); parent !== '.'; parent = dirname(parent).replaceAll('\\', '/')) {
      assert(![...files.keys()].some(path => path.toLowerCase() === parent.toLowerCase()), 'DUPLICATE_PATH', 'File/directory path collision.');
    }
  }
  assert(next === centralStart, 'ZIP_STRUCTURE', 'Unexpected data before central directory.');
  for (const record of records) {
    let data = bytes.subarray(record.dataStart, record.dataEnd);
    if (record.method === 8) {
      try { data = inflateRawSync(data, { maxOutputLength: Math.max(1, record.size) }); }
      catch { assert(false, 'ZIP_EXPANSION', 'Invalid or over-limit compressed resource.'); }
    }
    assert(data.length === record.size && crc32(data) === record.checksum, 'ZIP_INTEGRITY', 'ZIP size or checksum mismatch.');
    if (!record.directory) files.set(record.path, data);
  }
  return files;
}

export function encodeArchive(files, { compress = true } = {}) {
  const localParts = [], centralParts = [];
  let offset = 0;
  for (const [path, bytes] of [...files].sort(([left], [right]) => left < right ? -1 : left > right ? 1 : 0)) {
    safeResourcePath(path);
    const name = Buffer.from(path), body = compress ? deflateRawSync(bytes) : bytes, checksum = crc32(bytes);
    const local = Buffer.alloc(30), central = Buffer.alloc(46);
    local.writeUInt32LE(0x04034b50); local.writeUInt16LE(20, 4); local.writeUInt16LE(0x800, 6);
    local.writeUInt16LE(compress ? 8 : 0, 8); local.writeUInt16LE(33, 12);
    local.writeUInt32LE(checksum, 14); local.writeUInt32LE(body.length, 18); local.writeUInt32LE(bytes.length, 22); local.writeUInt16LE(name.length, 26);
    central.writeUInt32LE(0x02014b50); central.writeUInt16LE(0x314, 4); central.writeUInt16LE(20, 6);
    local.copy(central, 8, 6, 28);
    central.writeUInt32LE(0x81a40000, 38); central.writeUInt32LE(offset, 42);
    localParts.push(local, name, body); centralParts.push(central, name);
    offset += local.length + name.length + body.length;
    assert(offset <= LIMITS.archive, 'ZIP_LIMIT', 'ZIP build exceeds archive limit.');
  }
  const central = Buffer.concat(centralParts), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50); end.writeUInt16LE(files.size, 8); end.writeUInt16LE(files.size, 10);
  end.writeUInt32LE(central.length, 12); end.writeUInt32LE(offset, 16);
  const archive = Buffer.concat([...localParts, central, end]);
  decodeArchive(archive);
  return archive;
}

export function withArchive(path, callback) {
  return withArchiveBytes(readBoundedFile(path, LIMITS.archive), callback);
}

export function withArchiveBytes(bytes, callback) {
  const files = decodeArchive(bytes);
  const temporary = mkdtempSync(join(tmpdir(), 'boundx-unpack-'));
  try {
    for (const [name, bytes] of files) {
      const target = join(temporary, name);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, bytes, { flag: 'wx' });
    }
    return callback(temporary);
  } finally { rmSync(temporary, { recursive: true, force: true }); }
}
