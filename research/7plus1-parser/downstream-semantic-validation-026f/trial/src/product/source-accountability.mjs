import { createHash } from 'node:crypto';
import { literalSpans, documentLiteralBlockSpans, documentStructureSpans } from './nlp-syntax.mjs';

// Pass 1 observations only. No slots, permissions, semantic-pack lookup or resolution.
export const SOURCE_ACCOUNTABILITY = Object.freeze({
  id: 'SOURCE_ACCOUNTABILITY', version: '1',
  states: Object.freeze(['BOUNDARY_BEARING', 'NON_BOUNDARY', 'UNRESOLVED', 'DIAGNOSTIC']),
});
const marker = /必须|不得|禁止|不准|不能|不可|不要|不应|不改|不动|不删|不做|不变|仅|只允许|只能|至少|至多|不超过|\b(?:must|shall|never|only|opt-in|do not|may not|at least|at most)\b/giu;
const digest = text => createHash('sha256').update(text, 'utf8').digest('hex');

// Delimiter-based *source* clauses, not asserted atomic propositions. Opaque blocks
// remain single diagnostic records; inline literals cannot create modality signals.
export function accountSourceClauses(text, sections = []) {
  if (typeof text !== 'string' || !text.isWellFormed()) throw new TypeError('SOURCE_ACCOUNTABILITY_INVALID_TEXT');
  const points = [...text];
  const opaque = [...documentLiteralBlockSpans(text),
    ...documentStructureSpans(text).filter(s => s.kind === 'frontmatter')]
    .sort((a, b) => a.start - b.start || b.end - a.end);
  const inline = literalSpans(text);
  const headings = sections.map(s => ({ start: s.start, end: s.heading_end, kind: 'heading' }));
  // Merge overlapping literal spans without losing a byte. Outer block determines
  // the diagnostic, not the imperative text inside it.
  const blocks = [];
  for (const s of opaque) {
    const last = blocks.at(-1);
    if (last && s.start < last.end) last.end = Math.max(last.end, s.end);
    else blocks.push({ ...s });
  }
  const cuts = new Set([0, points.length]);
  for (const s of [...blocks, ...headings]) { cuts.add(s.start); cuts.add(s.end); }
  let blockIndex = 0, inlineIndex = 0;
  const protectedInline = [...inline].sort((a,b) => a.start-b.start);
  for (let i = 0; i < points.length; i++) {
    while (blocks[blockIndex]?.end <= i) blockIndex++;
    while (protectedInline[inlineIndex]?.end <= i) inlineIndex++;
    if (blocks[blockIndex] && i >= blocks[blockIndex].start && i < blocks[blockIndex].end) continue;
    if (protectedInline[inlineIndex] && i >= protectedInline[inlineIndex].start && i < protectedInline[inlineIndex].end) continue;
    const ch = points[i];
    if (ch === '\n' || /[。！？；;!?]/u.test(ch)
      || ch === '.' && (i + 1 === points.length || /\s/u.test(points[i+1]))) cuts.add(i+1);
  }
  const positions = [...cuts].filter(n => n >= 0 && n <= points.length).sort((a,b) => a-b);
  const diagnostics = [];
  const clauses = positions.slice(0,-1).map((start,index) => {
    const end = positions[index+1], quote = points.slice(start,end).join('');
    const id = `source-clause-${start}-${end}`;
    const block = blocks.find(s => start >= s.start && start < s.end);
    const section = sections.find(s => start >= s.start && start < s.end);
    const heading = headings.find(s => start >= s.start && start < s.end);
    const evidence = { source_id:'task', start, end, quote };
    const masked = points.slice(start,end).map((ch,i) => inline.some(s => start+i >= s.start && start+i < s.end) ? ' ' : ch).join('');
    const signals = [...masked.matchAll(marker)].map(m => {
      const at = start + [...masked.slice(0,m.index)].length;
      return { source_id:'task', start:at, end:at+[...m[0]].length, quote:m[0] };
    });
    // NON_BOUNDARY is intentionally restricted to lexical layout. A background
    // label, absence of a known cue or a whole-unit match cannot prove prose benign.
    const trivia = /^[\s\uFEFF#>*_`~|:+\-=]*$/u.test(quote);
    const state = block ? 'DIAGNOSTIC' : trivia ? 'NON_BOUNDARY' : signals.length ? 'BOUNDARY_BEARING' : 'UNRESOLVED';
    const diagnosticRefs = [];
    if (block) {
      const diagnostic_id = `pass1-opaque-${start}-${end}`;
      diagnosticRefs.push(diagnostic_id);
      diagnostics.push({ diagnostic_id, code:'PASS1_OPAQUE_SOURCE_REQUIRES_ANALYSIS', compiler_pass:1,
        clause_id:id, reason:`Preserved ${block.kind}; applicability and internal clauses are not asserted.`, evidence:[evidence] });
    }
    return { id, state, evidence, kind:block?.kind ?? (heading ? 'heading' : trivia ? 'layout' : 'source_clause'),
      section_start:section?.start ?? null,
      governing_context:section ? [{ source_id:'task',start:section.start,end:section.heading_end,
        quote:points.slice(section.start,section.heading_end).join('') }, ...section.conditions] : [],
      signals:block ? [] : signals, diagnostic_refs:diagnosticRefs,
      reason:block ? 'Opaque source is preserved for explicit analysis; never executed or silently skipped.'
        : trivia ? 'Layout characters only; no prose classified by absence of a keyword.'
          : signals.length ? 'Boundary-bearing language observed; applicability and interpretation are not resolved.'
            : 'No stable clause interpretation in Pass 1; source retained without asserting NON_BOUNDARY.',
      applicability:'NOT_RESOLVED_IN_PASS1' };
  });
  const report = { invariant:SOURCE_ACCOUNTABILITY.id, version:SOURCE_ACCOUNTABILITY.version,
    source_sha256:digest(text), coordinate_system:'unicode_codepoints_half_open', clauses, diagnostics,
    segmentation:'source delimiters outside literals; opaque blocks retained, not atomized; no proposition parsing claim' };
  validateSourceAccountability(text, report);
  return report;
}

export function validateSourceAccountability(text, report) {
  const fail = reason => { throw new Error(`SOURCE_ACCOUNTABILITY:${reason}`); };
  if (typeof text !== 'string' || !text.isWellFormed()) fail('INVALID_TEXT');
  if (report?.invariant !== SOURCE_ACCOUNTABILITY.id || report.source_sha256 !== digest(text)
    || !Array.isArray(report.clauses) || !Array.isArray(report.diagnostics)) fail('INVALID_REPORT');
  const points = [...text], ids = new Set(), diagnostics = new Map();
  for (const d of report.diagnostics) {
    if (!d.diagnostic_id || diagnostics.has(d.diagnostic_id)) fail('DUPLICATE_DIAGNOSTIC');
    diagnostics.set(d.diagnostic_id,d);
  }
  let end = 0;
  for (const c of report.clauses) {
    if (!c.id || ids.has(c.id)) fail('DUPLICATE_CLAUSE'); ids.add(c.id);
    if (!SOURCE_ACCOUNTABILITY.states.includes(c.state) || Object.hasOwn(c,'states')) fail('INVALID_TERMINAL_STATE');
    const e=c.evidence;
    if (!e || e.source_id!=='task' || !Number.isSafeInteger(e.start) || !Number.isSafeInteger(e.end)
      || e.start!==end || e.end<=e.start || e.end>points.length) fail('GAP_OR_OVERLAP');
    if (points.slice(e.start,e.end).join('')!==e.quote) fail('QUOTE_MISMATCH');
    if (!c.reason || !Array.isArray(c.diagnostic_refs)) fail('MISSING_REASON');
    for (const ref of c.diagnostic_refs) if (diagnostics.get(ref)?.clause_id!==c.id) fail('INVALID_DIAGNOSTIC_REFERENCE');
    if (c.state==='DIAGNOSTIC' && c.diagnostic_refs.length===0) fail('UNACCOUNTED_DIAGNOSTIC');
    if (c.state==='NON_BOUNDARY' && !/^[\s\uFEFF#>*_`~|:+\-=]*$/u.test(e.quote)) fail('UNSUPPORTED_NON_BOUNDARY');
    for (const s of c.signals ?? []) if (s.start<e.start || s.end>e.end || s.end<=s.start
      || points.slice(s.start,s.end).join('')!==s.quote) fail('INVALID_SIGNAL');
    if (c.state==='BOUNDARY_BEARING' && !c.signals?.length) fail('MISSING_BOUNDARY_SIGNAL');
    end=e.end;
  }
  if (end!==points.length) fail('UNACCOUNTED_TAIL');
  for (const d of diagnostics.values()) if (!ids.has(d.clause_id)) fail('ORPHAN_DIAGNOSTIC');
  return { invariant:SOURCE_ACCOUNTABILITY.id, status:'PASS', codepoints:points.length, clauses:report.clauses.length };
}
