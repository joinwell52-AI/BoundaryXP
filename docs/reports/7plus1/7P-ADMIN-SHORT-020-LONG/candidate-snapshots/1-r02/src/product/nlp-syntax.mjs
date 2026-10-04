import { codePointOffsets } from './codepoint-offsets.mjs';

export function literalSpans(text) {
  const offsets = codePointOffsets(text);
  const blocks = documentLiteralBlockSpans(text);
  const points = [...text];
  const spans = blocks.filter(span => span.kind === 'fence')
    .map(span => ({ start: span.start, end: span.end - (points[span.end - 1] === '\n'
      ? points[span.end - 2] === '\r' ? 2 : 1 : 0), kind: 'code' }));
  const excluded = [...documentStructureSpans(text).filter(span => span.kind === 'frontmatter'),
    ...blocks];
  const markers = [...text.matchAll(/`+/gu)].filter(marker =>
    !excluded.some(span => offsets[marker.index] < span.end
      && offsets[marker.index + marker[0].length] > span.start));
  for (let index = 0; index < markers.length; index++) {
    const opening = markers[index];
    const closingIndex = markers.findIndex((marker, position) => position > index && marker[0] === opening[0]);
    if (closingIndex < 0) continue;
    const closing = markers[closingIndex];
    spans.push({ start: offsets[opening.index],
      end: offsets[closing.index + closing[0].length], kind: 'code' });
    index = closingIndex;
  }
  for (const match of text.matchAll(/《[^》\r\n]*》/gu)) {
    const start = offsets[match.index];
    spans.push({ start, end: start + [...match[0]].length, kind: 'title' });
  }
  return spans;
}

export function documentStructureSpans(text) {
  const offsets = codePointOffsets(text);
  const spans = [];
  const frontmatter = text.match(/^(?:\uFEFF)?---\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)(?:\r?\n|$)/u);
  if (frontmatter) spans.push({ start: 0, end: [...frontmatter[0]].length, kind: 'frontmatter' });
  for (const match of text.matchAll(/^ {0,3}(?:#{1,6}\s+[^\r\n]*|\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?)\r?$/gmu)) {
    const start = offsets[match.index];
    spans.push({ start, end: start + [...match[0]].length, kind: 'structure' });
    if (match[0].includes('|') && !match[0].trimStart().startsWith('#')) {
      const previousEnd = Math.max(0, match.index - 1);
      const previousStart = text.lastIndexOf('\n', previousEnd - 1) + 1;
      const previousLine = text.slice(previousStart, previousEnd);
      if (previousLine.includes('|')) spans.push({ start: offsets[previousStart],
        end: offsets[previousEnd], kind: 'table_header' });
    }
  }
  return spans;
}

export function documentLiteralBlockSpans(text) {
  const offsets = codePointOffsets(text);
  const frontmatter = documentStructureSpans(text).find(span => span.kind === 'frontmatter');
  const spans = [];
  let current = null;
  let indentMayStart = true;
  for (const line of text.matchAll(/[^\r\n]+(?:\r?\n|$)|\r?\n/gu)) {
    const start = offsets[line.index];
    const end = offsets[line.index + line[0].length];
    if (frontmatter && start < frontmatter.end) continue;
    const trimmed = line[0].trim();
    const marker = trimmed.match(/^(`{3,}|~{3,})/u)?.[1];
    if (current?.kind === 'fence') {
      current.end = end;
      if (marker && marker[0] === current.marker[0] && marker.length >= current.marker.length
        && trimmed.slice(marker.length) === '') {
        spans.push({ start: current.start, end, kind: 'fence' });
        current = null;
      }
      continue;
    }
    const indented = /^(?: {4}|\t)/u.test(line[0]);
    if (current?.kind === 'indented_code') {
      if (indented || !trimmed) {
        current.end = end;
        continue;
      }
      spans.push({ start: current.start, end: current.end, kind: 'indented_code' });
      current = null;
    }
    if (indented && indentMayStart) {
      if (current) spans.push({ start: current.start, end: current.end, kind: current.kind });
      current = { start, end, kind: 'indented_code' };
      continue;
    }
    if (marker) {
      if (current) spans.push({ start: current.start, end: current.end, kind: current.kind });
      current = { start, end, kind: 'fence', marker };
      indentMayStart = false;
      continue;
    }
    if (/^\s*>/u.test(line[0])) {
      if (current?.kind === 'quote') current.end = end;
      else current = { start, end, kind: 'quote' };
    } else if (current) {
      spans.push({ start: current.start, end: current.end, kind: current.kind });
      current = null;
    }
    indentMayStart = !trimmed || /^ {0,3}#{1,6}\s/u.test(line[0]);
  }
  if (current) spans.push({ start: current.start, end: current.end, kind: current.kind });
  const inlineCode = [];
  for (const line of text.matchAll(/[^\r\n]+(?:\r?\n|$)|\r?\n/gu)) {
    const lineStart = offsets[line.index];
    if (frontmatter && lineStart < frontmatter.end
      || spans.some(span => lineStart >= span.start && lineStart < span.end)) continue;
    const markers = [...line[0].matchAll(/`+/gu)];
    for (let index = 0; index < markers.length; index += 1) {
      const closingIndex = markers.findIndex((marker, position) => position > index && marker[0] === markers[index][0]);
      if (closingIndex < 0) continue;
      inlineCode.push({ start: offsets[line.index + markers[index].index],
        end: offsets[line.index + markers[closingIndex].index + markers[closingIndex][0].length] });
      index = closingIndex;
    }
  }
  let searchFrom = 0;
  while (searchFrom < text.length) {
    const opening = text.indexOf('<!--', searchFrom);
    if (opening < 0) break;
    searchFrom = opening + 4;
    const start = offsets[opening];
    if (frontmatter && start < frontmatter.end || spans.some(span => start >= span.start && start < span.end)
      || inlineCode.some(span => start >= span.start && start < span.end)) continue;
    const closing = text.indexOf('-->', searchFrom);
    const end = closing < 0 ? offsets[text.length] : offsets[closing + 3];
    spans.push({ start, end, kind: 'comment' });
    searchFrom = closing < 0 ? text.length : closing + 3;
  }
  const comments = spans.filter(span => span.kind === 'comment');
  return spans.filter(span => span.kind === 'comment'
    || !comments.some(comment => span.start >= comment.start && span.start < comment.end));
}

export function taskDocumentFields(text) {
  const metadata = documentStructureSpans(text).find(span => span.kind === 'frontmatter');
  if (!metadata) return [];
  const block = [...text].slice(metadata.start, metadata.end).join('');
  const types = [...block.matchAll(/^type:[ \t]*([^\r\n]+)\r?$/gmu)];
  if (types.length !== 1 || types[0][1].trim() !== 'TASK') return [];
  const fields = [];
  for (const match of block.matchAll(/^(sender|recipient|ref_charter|ref_adr|ref_predecessor|ref_external):[ \t]*([^\r\n]+)\r?$/gmu)) {
    const value = match[2].trim();
    if (!value || /[#\[\]{}|>]/u.test(value)) continue;
    const offset = match[0].indexOf(':') + 1;
    const valueOffset = offset + match[0].slice(offset).indexOf(value);
    const start = [...block.slice(0, match.index + valueOffset)].length;
    fields.push({ key: match[1], start, end: start + [...value].length });
  }
  let inReferences = false;
  for (const match of block.matchAll(/^[^\r\n]*(?:\r?\n|$)/gmu)) {
    const line = match[0].replace(/\r?\n$/u, '');
    if (/^references:[ \t]*$/u.test(line)) {
      inReferences = true;
      continue;
    }
    if (!inReferences) continue;
    const item = line.match(/^[ \t]*-[ \t]+([^\r\n]+)$/u);
    if (!item) {
      inReferences = false;
      continue;
    }
    const raw = item[1].trim();
    const quoted = raw.match(/^(["'])(.*)\1$/u);
    const value = quoted ? quoted[2] : raw;
    if (!value || /[\[\]{}|>]/u.test(value)) continue;
    const valueOffset = line.indexOf(value);
    const start = [...block.slice(0, match.index + valueOffset)].length;
    fields.push({ key: 'reference', start, end: start + [...value].length });
  }
  return fields;
}

export function sourceClauses(text) {
  const points = [...text], clauses = [], closers = [];
  const pairs = { '《': '》', '「': '」', '“': '”', '‘': '’', '`': '`', '"': '"', "'": "'" };
  let start = 0, conditional = false;
  const emit = (end, nextStart = end + 1, keepCondition = false) => {
    const clause = points.slice(start, end).join('');
    conditional ||= clauseModality(clause).conditional;
    if (clause.trim()) clauses.push({ text: clause, start, end, conditional });
    if (!keepCondition && !/[，,]/u.test(points[end] ?? '')) conditional = false;
    start = nextStart;
  };
  for (let index = 0; index < points.length; index++) {
    const char = points[index];
    const contraction = char === "'" && /[\p{L}\p{N}]/u.test(points[index - 1] ?? '')
      && /[\p{L}\p{N}]/u.test(points[index + 1] ?? '');
    if (closers.length && char === closers.at(-1) && !contraction) { closers.pop(); continue; }
    if (char === "'") {
      const apostrophe = /[\p{L}\p{N}]/u.test(points[index - 1] ?? '')
        && /[\p{L}\p{N}\s]/u.test(points[index + 1] ?? '');
      const closing = points.indexOf("'", index + 1);
      const newline = points.indexOf('\n', index + 1);
      if (closers.length || apostrophe || closing < 0 || newline >= 0 && closing > newline) continue;
    }
    if (pairs[char] && (!closers.length || char !== '`')) { closers.push(pairs[char]); continue; }
    if (closers.length) continue;
    if (char === '但' || ((char === 'b' || char === 'B') && !/[\p{L}\p{N}_]/u.test(points[index - 1] ?? ''))) {
      const contrast = points.slice(index, index + 64).join('').match(/^(?:但是|但|but\b)\s*/iu);
      if (contrast && index > start) {
        const nextStart = index + [...contrast[0]].length;
        const before = points.slice(start, index).join('');
        const after = points.slice(nextStart, nextStart + 64).join('');
        if (clauseModality(before).prohibited || clauseModality(after).prohibited) {
          emit(index, nextStart, true);
          index = nextStart - 1;
          continue;
        }
      }
    }
    const ordinalDot = char === '.' && /^\s*\d+$/u.test(points.slice(start, index).join('')) && /[ \t]/u.test(points[index + 1] ?? '');
    const internalDot = char === '.' && /[\p{L}\p{N}_]/u.test(points[index - 1] ?? '') && /[\p{L}\p{N}_]/u.test(points[index + 1] ?? '');
    const abbreviationDot = char === '.' && /(?:^|[^\p{L}])(?:e\.g|i\.e)$/iu.test(points.slice(Math.max(0, index - 5), index).join(''));
    if (/[，,。.!！？?；;\n]/u.test(char) && !internalDot && !ordinalDot && !abbreviationDot) emit(index);
  }
  emit(points.length);
  return clauses;
}

export function clauseModality(text) {
  text = text.replace(/《[^》]*》|`[^`]*`/gu, ' ');
  const conditional = /如果|若|除非|只有|仅当|仅在|(?:当|在)[^，,。；;\n]{1,60}(?<!小)时|\b(?:if|when|unless|provided that)\b/iu.test(text);
  const uncertain = /可能|随便|大概|那个|或者|或|二选一|\b(?:maybe|perhaps|might|either|or)\b/iu.test(text);
  const negatedProhibition = /(?:没有|未|不)(?:明确)?(?:禁止|要求)|无需禁止|\b(?:not prohibited|not forbidden|no prohibition|not required)\b/iu.test(text);
  const prohibited = !negatedProhibition && /禁止|严禁|不得|不要|不允许|不准|(?:^|\s)别|\b(?:must not|do not|mustn't|don't|never|prohibited|forbidden)\b/iu.test(text);
  const negative = negatedProhibition || prohibited || /不能|没有|未(?:提供|指定|明确|执行|完成|检测|通过)|\b(?:not|no|without)\b/iu.test(text);
  return { conditional, uncertain, negative, prohibited };
}

export function temporalAssignmentActor(text) {
  if (clauseModality(text).negative) return null;
  const match = text.match(/^\s*由\s*([^，,。；;\n]{1,64}?)\s*(?=在|于)(?:在|于)(?:今天|明天|本周|\d|\s)/u);
  return match?.[1].trim() || null;
}

export function hasPostCompletionRequirement(text) {
  const modality = clauseModality(text);
  if (modality.negative || modality.uncertain) return false;
  const chinese = text.match(/(?:完成|结束|办结)后(.+)$/u);
  if (chinese && /(?:至少(?:达到)?|不低于|不少于|必须达到|应达到|应为|必须为)\s*\d+(?:\.\d+)?\s*(?:%|％|GB|GiB|MB|MiB|秒|个|条)/iu.test(chinese[1])) return true;
  return /\b(?:after|upon)\s+(?:completion|finishing)\b.+\b(?:must|shall)\s+(?:be|reach|remain)\s+(?:at least|above|below|at most)\s+\d+(?:\.\d+)?\s*(?:%|GB|GiB|MB|MiB|seconds?\b)/iu.test(text);
}

export function nounPhrase(token, tokens, allTokens, { excludeCase = false } = {}) {
  const members = new Set([token]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const child of tokens) if (!members.has(child) && members.has(allTokens[child.head]) && !(excludeCase && child.dep === 'case') && /^(?:compound(?::.*)?|amod|nn|nmod(?::.*)?|det|ATT|case)$/iu.test(child.dep)) {
      members.add(child); changed = true;
    }
  }
  const start = Math.min(...[...members].map(item => item.start)), end = Math.max(...[...members].map(item => item.end));
  if (tokens.some(item => item.start >= start && item.end <= end && !members.has(item) && /^(?:VERB|VV|VB.*)$/u.test(item.pos))) return { start: token.start, end: token.end };
  return { start, end };
}
