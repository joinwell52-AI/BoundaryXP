export const RAW_JSON_BYTE_LIMIT = 2000000;

function numberIdentity(token) {
  const match = /^(-?)(\d+)(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/.exec(token);
  let digits = (match[2] + (match[3] ?? '')).replace(/^0+/, '');
  if (!digits) return '0';
  let exponent = BigInt(match[4] ?? '0') - BigInt((match[3] ?? '').length);
  while (digits.endsWith('0')) { digits = digits.slice(0, -1); exponent += 1n; }
  return `${match[1]}${digits}e${exponent}`;
}

export function parseStrictJson(raw) {
  if (!(typeof raw === 'string' || raw instanceof Uint8Array)) throw new TypeError('Expected JSON text or UTF-8 bytes.');
  if ((typeof raw === 'string' ? Buffer.byteLength(raw, 'utf8') : raw.byteLength) > RAW_JSON_BYTE_LIMIT) throw new RangeError('Raw JSON byte limit exceeded.');
  const text = typeof raw === 'string' ? raw : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(raw);
  if (!text.isWellFormed()) throw new SyntaxError('Invalid Unicode.');
  let offset = 0;
  let nodes = 0;
  const space = () => { while (/[\t\n\r ]/.test(text[offset] ?? 'x')) offset += 1; };
  const fail = () => { throw new SyntaxError('Invalid, duplicate-key or imprecise JSON.'); };
  function string() {
    const start = offset++;
    while (offset < text.length) {
      const char = text[offset++];
      if (char === '\\') offset += 1;
      else if (char === '"') {
        const value = JSON.parse(text.slice(start, offset));
        if (!value.isWellFormed()) fail();
        return value;
      }
    }
    return fail();
  }
  function value(depth) {
    if (++nodes > 100000 || depth > 64) throw new RangeError('JSON structure limit exceeded.');
    space();
    if (text[offset] === '"') return string();
    if (text[offset] === '{') {
      offset += 1; space();
      const object = {};
      if (text[offset] === '}') { offset += 1; return object; }
      for (;;) {
        if (text[offset] !== '"') fail();
        const key = string(); space();
        if (Object.hasOwn(object, key) || text[offset++] !== ':') fail();
        Object.defineProperty(object, key, { value: value(depth + 1), enumerable: true, configurable: true, writable: true });
        space();
        const separator = text[offset++];
        if (separator === '}') return object;
        if (separator !== ',') fail();
        space();
      }
    }
    if (text[offset] === '[') {
      offset += 1; space();
      const array = [];
      if (text[offset] === ']') { offset += 1; return array; }
      for (;;) {
        array.push(value(depth + 1)); space();
        const separator = text[offset++];
        if (separator === ']') return array;
        if (separator !== ',') fail();
      }
    }
    for (const [literal, parsed] of [['true', true], ['false', false], ['null', null]]) {
      if (text.startsWith(literal, offset)) { offset += literal.length; return parsed; }
    }
    const match = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?(?:[eE][+-]?[0-9]+)?/.exec(text.slice(offset));
    if (!match) return fail();
    const token = match[0]; offset += token.length;
    if (token.length > 1024) throw new RangeError('Numeric token limit exceeded; use decimal strings.');
    const number = Number(token);
    if (!Number.isFinite(number) || numberIdentity(token) !== numberIdentity(JSON.stringify(number))) fail();
    return number;
  }
  const parsed = value(0); space();
  if (offset !== text.length) fail();
  return parsed;
}
