import { literalSpans, documentLiteralBlockSpans, documentStructureSpans } from './nlp-syntax.mjs';
import { isAcceptanceSectionTitle, isBackgroundSectionTitle, isExampleSectionTitle, isOutOfScopeSectionTitle,
  isPlanSectionTitle,
  normalizedSectionTitle, scanTaskHeadings } from './task-nodes.mjs';
import { codePointOffsets } from './codepoint-offsets.mjs';
import { accountSourceClauses } from './source-accountability.mjs';
import { buildDocumentTree } from './document-tree.mjs';

function sectionHeadings(text) {
  if (typeof text !== 'string' || !text.trim()) return [];
  const offsets = codePointOffsets(text);
  const protectedSpans = [...literalSpans(text), ...documentLiteralBlockSpans(text),
    ...documentStructureSpans(text).filter(span => span.kind === 'frontmatter')];
  const headings = [];
  const points = [...text];
  for (const heading of scanTaskHeadings(text)) {
    const { start, heading_end, level } = heading;
    if (protectedSpans.some(span => start >= span.start && start < span.end)) continue;
    const title = normalizedSectionTitle(heading.title.replace(/\*\*|__|\s+#+\s*$/gu, ''));
    let kind = null;
    if (isBackgroundSectionTitle(title) || isExampleSectionTitle(title)) kind = 'background';
    if (isOutOfScopeSectionTitle(title)) kind = 'deferred';
    if (isAcceptanceSectionTitle(title)) kind = 'completion';
    if (/^(?:审查者视角[（(][^）)]{0,40}(?:自检项|自验)[）)]|自检清单|复核清单|自验清单|self[- ]review checklist|review checklist)(?:$|[\s（(:：])/iu.test(title)) kind = 'completion';
    if (isPlanSectionTitle(title)) kind = 'plan';
    if (/^(?:交付物|交付清单|应交付物|deliverables?|output artifacts?)(?:$|[\s（(:：])/iu.test(title)
      || /^[A-Z][A-Z0-9_-]{1,20}\s*的\s*应交付物(?:$|[\s（(:：])/u.test(title)) kind = 'deliverable';
    if (/^(?:时间盒|资源约束|时间限制|timebox|time box|resource constraints?)(?:$|[\s（(:：])/iu.test(title)) kind = 'resource';
    if (/^(?:范围|工作范围|任务范围|scope|work scope)(?:$|[\s（(:：])/iu.test(title)) kind = 'scope';
    if (/^(?:任务|要做的事)\s*\/\s*deliverables?$/iu.test(title)) kind = 'scope';
    const conditions = /(?:如果|除非|仅当|仅在|只有|若|当.+时|\bif\b|\bwhen\b|\bunless\b|\bprovided that\b)/iu.test(title)
      || /^(?:适用条件|前置条件|条件|例外|豁免|applicability conditions?|preconditions?|conditions?|exceptions?|exemptions?)(?:$|[\s（(:：])/iu.test(title)
      ? [{ source_id: 'task', start, end: heading_end, quote: points.slice(start, heading_end).join('') }] : [];
    const numberPath = heading.title.match(/^(\d+(?:\.\d+)*)(?=\s|[.、·:：-]|$)/u)?.[1] ?? null;
    const explicitId = heading.explicit ? heading.identifier : null;
    headings.push({ start, heading_end, level,
      numberPath, explicitId, kind, conditions });
  }
  const numberCounts = new Map();
  for (const heading of headings) if (heading.numberPath)
    numberCounts.set(heading.numberPath, (numberCounts.get(heading.numberPath) ?? 0) + 1);
  const stack = [];
  return headings.map((heading, index) => {
    const explicitParent = heading.explicitId === 'ROOT' ? null
      : heading.explicitId?.match(/^(WP\d+(?:\.\d+)*)\.\d+$/u)?.[1]
        ?? heading.explicitId?.match(/^(WP\d+(?:\.\d+)*)[A-Z]$/u)?.[1]
        ?? (heading.explicitId ? 'ROOT' : null);
    const numberedParent = heading.numberPath?.includes('.')
      ? heading.numberPath.slice(0, heading.numberPath.lastIndexOf('.')) : null;
    const numberedAmbiguous = heading.numberPath && (numberCounts.get(heading.numberPath) > 1
      || numberedParent && (numberCounts.get(numberedParent) !== 1
        || !stack.some(item => item.numberPath === numberedParent)));
    const namedParentUnestablished = explicitParent && explicitParent !== 'ROOT'
      && !stack.some(item => item.explicitId === explicitParent);
    if (explicitParent && stack.some(item => item.explicitId === explicitParent)) {
      while (stack.at(-1).explicitId !== explicitParent) stack.pop();
    } else if (numberedParent && stack.some(item => item.numberPath === numberedParent)) {
      while (stack.at(-1).numberPath !== numberedParent) stack.pop();
    } else if (explicitParent === 'ROOT' && !stack.some(item => item.explicitId === 'ROOT')) {
      stack.length = 0;
    } else {
      while (stack.length && stack.at(-1).level >= heading.level) stack.pop();
    }
    const parent = stack.at(-1);
    const contextTrusted = !numberedAmbiguous && !namedParentUnestablished;
    const kind = contextTrusted && ['background', 'deferred'].includes(parent?.kind)
      ? parent.kind : heading.kind ?? (contextTrusted ? parent?.kind : null) ?? 'body';
    const conditions = [...(contextTrusted ? parent?.conditions ?? [] : []), ...heading.conditions];
    stack.push({ level: heading.level, numberPath: heading.numberPath, explicitId: heading.explicitId, kind, conditions });
    const { numberPath, explicitId, ...section } = heading;
    return { ...section, kind, conditions, end: headings[index + 1]?.start ?? offsets[text.length] };
  });
}

// Legacy kind remains a conservative routing hint. Pass 1 semantics and clause
// analysis are independent of that hint: BACKGROUND never filters the source.
export function analyzeDocumentStructure(text) {
  const sections = sectionHeadings(text);
  const source_accountability = accountSourceClauses(text, sections);
  const analyzed = sections.map((section,index) => {
    const subtreeEnd = sections.slice(index+1).find(s => s.level<=section.level)?.start ?? [...text].length;
    const hasBoundaryChild = source_accountability.clauses.some(c => c.evidence.start>=section.heading_end
      && c.evidence.start<subtreeEnd && c.state==='BOUNDARY_BEARING');
    return { ...section, semantics:section.kind==='background' && hasBoundaryChild ? 'MIXED' : section.kind.toUpperCase(),
      child_clause_analysis:'REQUIRED', boundary_clause_ids:source_accountability.clauses.filter(c =>
        c.section_start===section.start && c.state==='BOUNDARY_BEARING').map(c=>c.id) };
  });
  return { sections:analyzed, source_accountability };
}

export function documentSections(text) {
  if (typeof text !== 'string' || !text.trim()) return [];
  return analyzeDocumentStructure(text).sections;
}

// Explicit opt-in structural output; accepted legacy section/accountability
// behavior and all existing callers retain byte-equivalent objects.
export function analyzeDocumentTree(text) {
  const structure = analyzeDocumentStructure(text);
  return { ...structure, document_tree: buildDocumentTree(text, structure) };
}
