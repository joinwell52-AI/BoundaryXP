import { assert } from './contracts.mjs';

export function locateEvidence(sources, locator) {
  const text = sources[locator.source_id];
  assert(typeof text === 'string' && typeof locator.quote === 'string' && locator.quote.length > 0, 'SOURCE_REFERENCE', 'Missing source or quote.');
  const matches = [];
  let offset = text.indexOf(locator.quote);
  while (offset >= 0) {
    const before = text.slice(0, offset);
    const after = text.slice(offset + locator.quote.length);
    if ((locator.prefix === undefined || before.endsWith(locator.prefix)) && (locator.suffix === undefined || after.startsWith(locator.suffix))) matches.push(offset);
    offset = text.indexOf(locator.quote, offset + 1);
  }
  assert(matches.length > 0, 'QUOTE_NOT_FOUND', 'Exact quote with its context is not present.');
  assert(matches.length === 1, 'QUOTE_AMBIGUOUS', 'Quote is repeated; supply exact prefix/suffix or a longer quote.');
  const start = Array.from(text.slice(0, matches[0])).length;
  return { source_id: locator.source_id, quote: locator.quote, start, end: start + Array.from(locator.quote).length };
}
