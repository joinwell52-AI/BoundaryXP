import { documentLiteralBlockSpans, documentStructureSpans } from './nlp-syntax.mjs';
import { codePointOffsets } from './codepoint-offsets.mjs';

const codePoints = value => [...value];
const nodeHeading = /^(?:ROOT|WP\d+(?:\.\d+)*(?:[A-Z])?)(?:\s|:|：|$)/iu;
const workPackageId = /^(ROOT|WP\d+(?:\.\d+)*(?:[A-Z])?)(?:\s|:|：|$)/iu;
export const sectionApplicabilityUnresolved = role => ['background', 'example', 'out_of_scope', 'condition', 'exception'].includes(role);
export const normalizedSectionTitle = title => title
  .replace(/^(?:ROOT|WP\d+(?:\.\d+)*(?:[A-Z])?)(?=\s|[:：]|$)\s*[:：]?\s*/iu, '')
  .replace(/^\d+(?:\.\d+)*\s*[.、·:：-]?\s*/u, '').trim();
const matchesSectionTitle = (title, pattern) => {
  const parts = normalizedSectionTitle(title).split(/\s+\/\s+/u);
  return parts.length <= 2 && parts.every(part => pattern.test(part));
};
const directConditionTitle = title => /^(?:如果|若|仅当|仅在|只有|当.+时|除非|if\b|when\b|only if\b|unless\b|provided that\b)/iu.test(normalizedSectionTitle(title));

export function conditionalHeadingContexts(nodes, node) {
  const byId = new Map(nodes.map(item => [item.id, item]));
  let current = node;
  const contexts = [];
  const visited = new Set();
  while (current) {
    if (visited.has(current.id)) throw Error('TASK_NODE_ANCESTRY_CYCLE');
    visited.add(current.id);
    if (['condition', 'exception'].includes(current.section_role)) {
      const direct = directConditionTitle(current.title);
      contexts.push({ role: current.section_role,
        evidence: direct ? current.heading_evidence?.[0] ?? null : null });
    }
    if (current.number_hierarchy_status === 'parent_unresolved') break;
    if (current.parent_id && !byId.has(current.parent_id)) throw Error('TASK_NODE_PARENT_MISSING');
    current = byId.get(current.parent_id);
  }
  return contexts;
}

export function locateTaskNodeForSpan(nodes, evidence) {
  if (evidence.source_id !== 'task') return null;
  let containing = null;
  for (const node of nodes) {
    if (evidence.start < node.span.start || evidence.end > node.span.end) continue;
    if (!containing || node.span.end - node.span.start <= containing.span.end - containing.span.start) {
      containing = node;
    }
  }
  if (!containing) return null;
  return nodes.some(node => node.parent_id === containing.id
    && evidence.start < node.span.end && evidence.end > node.span.start) ? null : containing;
}

export function locateUnitTaskNode(nodes, evidence) {
  if (!Array.isArray(evidence) || !evidence.length) return null;
  const primary = locateTaskNodeForSpan(nodes, evidence[0]);
  if (!primary) return null;
  const byId = new Map(nodes.map(node => [node.id, node]));
  for (const span of evidence.slice(1)) {
    const location = locateTaskNodeForSpan(nodes, span);
    if (location?.id === primary.id) continue;
    let ancestorId = primary.parent_id;
    let contextual = false;
    const visited = new Set([primary.id]);
    while (ancestorId) {
      if (visited.has(ancestorId)) return null;
      visited.add(ancestorId);
      const ancestor = byId.get(ancestorId);
      if (!ancestor) return null;
      if (ancestor?.id === location?.id && ['condition', 'exception'].includes(ancestor.section_role)
        && ancestor.heading_evidence?.some(heading => heading.source_id === span.source_id
          && heading.start === span.start && heading.end === span.end && heading.quote === span.quote)) {
        contextual = true;
        break;
      }
      ancestorId = ancestor?.parent_id ?? null;
    }
    if (!contextual) return null;
  }
  return primary;
}

function parentIdentifier(identifier) {
  if (identifier === 'ROOT') return null;
  const numeric = identifier.match(/^(WP\d+(?:\.\d+)*)\.\d+$/u);
  if (numeric) return numeric[1];
  const alpha = identifier.match(/^(WP\d+(?:\.\d+)*)[A-Z]$/u);
  return alpha ? alpha[1] : 'ROOT';
}

function descendantOf(identifier, parent) {
  if (parent === 'ROOT') return identifier !== 'ROOT';
  return identifier.startsWith(`${parent}.`) || /^[A-Z]$/u.test(identifier.slice(parent.length)) && identifier.startsWith(parent);
}

function sourceEvidence(points, start, end) {
  return [{ source_id: 'task', start, end, quote: points.slice(start, end).join('') }];
}

export function isBackgroundSectionTitle(title) {
  return matchesSectionTitle(title, /^(?:背景|背景说明|任务背景|为什么需要这个任务|为什么这样切\s*scope|为什么这两块捆在一起做|优先级理由|background|rationale|why (?:this task|now)|priority rationale|motivation)(?:\s*$|\s*[—–（(:：])/iu);
}

export function isOutOfScopeSectionTitle(title) {
  const normalized = normalizedSectionTitle(title).replace(/\*\*|__/gu, '');
  return matchesSectionTitle(normalized.replace(/^(?:决议|decision)\s*\d+\s*[·:：.-]\s*/iu, ''),
    /^(?:非范围|不在范围|不在本\s*(?:TASK|任务)\s*范围|后续阶段[^\n]{0,80}不在本\s*(?:TASK|任务)\s*范围|不属于本\s*(?:TASK|任务)\s*的延后事项|(?:v\d+(?:\.\d+)*\s*)?不实现的(?:（独立(?:后续)?\s*TASK）)?|(?:v\d+(?:\.\d+)*\s*)?not implemented(?:\s*\((?:separate|follow-up)\s+TASK\))?|本任务不做的|延后事项|(?:explicitly\s+)?out[- ]of[- ]scope|non-goals?|deferred(?: items?)?)(?:\s|$|[（）():：])/iu);
}

export function isExampleSectionTitle(title) {
  return matchesSectionTitle(title, /^(?:示例|样例|举例|例子|examples?|illustrations?)(?:\s*$|\s*[—–（(:：])/iu);
}

export function isAcceptanceSectionTitle(title) {
  return matchesSectionTitle(title, /^(?:验收标准|验收条件|验收|完成标准|完成条件|acceptance criteria|acceptance|completion criteria|definition of done)(?:\s*$|\s*[—–（(:：])/iu);
}

export function isPlanSectionTitle(title) {
  return matchesSectionTitle(title, /^(?:(?:[一二三四五六七八九十两\d]+步)?(?:整改)?(?:执行计划|工作计划|实施计划|交付计划)|implementation plan|execution plan|work plan|delivery plan)(?:$|[\s（(:：])/iu);
}

function sectionRole(title) {
  const normalized = normalizedSectionTitle(title);
  if (isBackgroundSectionTitle(normalized)) return 'background';
  if (isExampleSectionTitle(normalized)) return 'example';
  if (isOutOfScopeSectionTitle(normalized)) return 'out_of_scope';
  if (isAcceptanceSectionTitle(normalized)) return 'acceptance';
  if (/^(?:适用条件|前置条件|条件|applicability conditions?|preconditions?|conditions?)(?:\s|$|[（(:：])/iu.test(normalized)) return 'condition';
  if (/^(?:例外|豁免|exceptions?|exemptions?)(?:\s|$|[（(:：])/iu.test(normalized)) return 'exception';
  if (/^(?:除非|unless\b)/iu.test(normalized)) return 'exception';
  if (/^(?:如果|若|仅当|仅在|只有|当.+时|if\b|when\b|only if\b|provided that\b)/iu.test(normalized)) return 'condition';
  if (/^(?:风险与边界|禁止边界|约束|constraints?|boundaries)(?:\s|$|[（(:：])/iu.test(normalized)) return 'boundary';
  if (isPlanSectionTitle(normalized)) return 'plan';
  return 'other';
}

function explicitSectionRole(title) {
  const role = sectionRole(title);
  return role === 'other' ? null : role;
}

export function scanTaskHeadings(text) {
  if (typeof text !== 'string' || !text.trim()) throw TypeError('Task text must be non-empty.');
  const offsets = codePointOffsets(text);
  const headings = [];
  const frontmatter = documentStructureSpans(text).find(span => span.kind === 'frontmatter');
  const comments = documentLiteralBlockSpans(text).filter(span => span.kind === 'comment');
  const ignored = line => frontmatter && offsets[line.index] < frontmatter.end
    || comments.some(span => offsets[line.index] >= span.start && offsets[line.index] < span.end);
  const paragraphLine = line => line && !ignored(line) && line[1].trim()
    && !/^(?: {4}|\t| {0,3}(?:#{1,6}[ \t]|>|(?:[-*+]|\d+[.)])[ \t]|`{3,}|~{3,}|<!--|=+[ \t]*$|-+[ \t]*$))/u.test(line[1]);
  const lines = [];
  let lineOffset = 0;
  for (const part of text.split('\n')) {
    lines.push({ 0: part, 1: part.endsWith('\r') ? part.slice(0, -1) : part, index: lineOffset });
    lineOffset += part.length + 1;
  }
  let fence = null;
  for (const [index, line] of lines.entries()) {
    if (ignored(line)) continue;
    const marker = line[1].match(/^ {0,3}(`{3,}|~{3,})(.*)$/u);
    if (fence) {
      if (marker && marker[1][0] === fence.character && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      continue;
    }
    if (marker) { fence = { character: marker[1][0], length: marker[1].length }; continue; }
    const match = line[1].match(/^ {0,3}(#{1,6})[ \t]+(.+)$/u);
    const underline = !match && line[1].match(/^ {0,3}(=+|-+)[ \t]*$/u);
    if (!match && !underline) continue;
    let first = index;
    if (underline) {
      if (!paragraphLine(lines[index - 1])) continue;
      first = index - 1;
    }
    const title = match ? match[2].replace(/[ \t]+#+[ \t]*$/u, '').trim()
      : lines.slice(first, index).map(item => item[1].trim()).join(' ');
    const level = match ? match[1].length : underline[1][0] === '=' ? 1 : 2;
    const explicit = nodeHeading.test(title);
    const identifier = explicit ? title.match(workPackageId)?.[1].toUpperCase() : `SECTION${headings.length + 1}`;
    const h1Numbered = level === 1 && (/^\d{1,3}[.、·:：-]/u.test(title)
      || /^\d{1,3}(?:\.\d+)+(?=\s|[.、·:：-]|$)/u.test(title));
    const numberPath = !explicit && (level > 1 || h1Numbered)
      ? title.match(/^(\d+(?:\.\d+)*)(?=\s|[.、·:：-]|$)/u)?.[1] ?? null : null;
    const start = offsets[lines[first].index], end = offsets[line.index + line[0].length];
    headings.push({ identifier, level, start, heading_end: end, title, explicit, numberPath });
  }
  return headings;
}

export function buildTaskNodes(text) {
  const headings = scanTaskHeadings(text);
  const points = codePoints(text), total = points.length;
  const hasRoot = headings.some(item => item.identifier === 'ROOT');
  if (hasRoot && headings[0].identifier !== 'ROOT') throw Error('TASK_NODE_ROOT_ORDER_INVALID');
  const nodes = hasRoot ? headings : [{ identifier: 'ROOT', level: 0, start: 0, heading_end: 0, title: 'Document root', explicit: true }, ...headings];
  const ids = new Set();
  const parents = new Map();
  const numberCounts = new Map();
  for (const node of nodes) if (node.numberPath) {
    numberCounts.set(node.numberPath, (numberCounts.get(node.numberPath) ?? 0) + 1);
  }
  nodes.forEach((node, index) => {
    if (ids.has(node.identifier)) throw Error('TASK_NODE_DUPLICATE_IDENTIFIER');
    ids.add(node.identifier);
    const numberedParent = node.numberPath?.includes('.')
      ? node.numberPath.slice(0, node.numberPath.lastIndexOf('.')) : null;
    const nearestNumberedBranch = numberedParent
      ? nodes.slice(0, index).reverse().find(candidate => candidate.numberPath
        && (candidate.numberPath === numberedParent
          || !candidate.numberPath.startsWith(`${numberedParent}.`))) : null;
    const numberedParentAmbiguous = numberedParent && numberCounts.get(numberedParent) > 1;
    const numberedAncestor = !numberedParentAmbiguous && nearestNumberedBranch?.numberPath === numberedParent
      ? nearestNumberedBranch : null;
    const namedParent = node.explicit ? parentIdentifier(node.identifier) : null;
    const namedParentMissing = namedParent !== null && !ids.has(namedParent);
    const structuralParent = nodes.slice(0, index).reverse()
      .find(candidate => candidate.level < node.level)?.identifier ?? 'ROOT';
    const parent_id = node.explicit ? namedParentMissing ? structuralParent : namedParent
      : numberedParent ? numberedAncestor?.identifier
        ?? structuralParent
        : structuralParent;
    node.parentResolutionReason = namedParentMissing ? 'named_parent_missing'
      : node.numberPath && numberCounts.get(node.numberPath) > 1 ? 'numbered_path_duplicate'
        : numberedParentAmbiguous ? 'numbered_parent_ambiguous'
          : numberedParent && !numberedAncestor ? 'numbered_parent_missing' : null;
    node.numberHierarchyStatus = node.parentResolutionReason !== null ? 'parent_unresolved'
      : numberedParent ? 'matched' : 'not_applicable';
    parents.set(node.identifier, parent_id);
  });
  const belongsTo = (candidate, ancestor) => {
    if (ancestor.identifier === 'ROOT') return true;
    if (ancestor.explicit && candidate.explicit && descendantOf(candidate.identifier, ancestor.identifier)) return true;
    let cursor = parents.get(candidate.identifier);
    while (cursor) {
      if (cursor === ancestor.identifier) return true;
      cursor = parents.get(cursor);
    }
    return false;
  };
  const result = nodes.map((node, index) => {
    const parent_id = parents.get(node.identifier);
    const following = nodes.slice(index + 1).find(candidate => !belongsTo(candidate, node));
    const end = following?.start ?? total;
    const section_role = node.explicit ? explicitSectionRole(node.title) : sectionRole(node.title);
    let context_role = section_role;
    let ancestor = node.numberHierarchyStatus === 'parent_unresolved' ? null : parent_id;
    while (!sectionApplicabilityUnresolved(context_role) && ancestor) {
      const parentNode = nodes.find(item => item.identifier === ancestor);
      const role = parentNode?.explicit ? explicitSectionRole(parentNode.title)
        : parentNode ? sectionRole(parentNode.title) : null;
      if (sectionApplicabilityUnresolved(role)) context_role = role;
      ancestor = parentNode?.numberHierarchyStatus === 'parent_unresolved' ? null : parents.get(ancestor);
    }
    return {
      id: node.identifier,
      kind: node.identifier === 'ROOT' ? 'root' : node.explicit ? 'work_package' : 'section',
      section_role,
      number_path: node.numberPath ?? null,
      number_hierarchy_status: node.numberHierarchyStatus,
      parent_resolution_reason: node.parentResolutionReason ?? null,
      context_role,
      parent_id,
      title: node.title,
      span: { start: node.identifier === 'ROOT' ? 0 : node.start, end },
      heading_evidence: node.heading_end > node.start ? sourceEvidence(points, node.start, node.heading_end) : [],
      inherited_constraints: [],
      local_constraints: [],
    };
  });
  const byId = new Map(result.map(node => [node.id, node]));
  for (const node of result) if (node.parent_id) {
    const parent = byId.get(node.parent_id);
    if (!parent || node.span.start < parent.span.start || node.span.end > parent.span.end)
      throw Error('TASK_NODE_PARENT_SPAN_INVALID');
  }
  return result;
}

export function projectTaskNodeConstraints(text, nodes, units) {
  if (!Array.isArray(nodes) || !Array.isArray(units)) throw TypeError('Nodes and units must be arrays.');
  const points = codePoints(text);
  const parent = new Map(nodes.map(node => [node.id, node.parent_id]));
  const sections = new Map(nodes.map(node => [node.id, node.context_role]));
  const unresolvedParents = new Set(nodes.filter(node => node.number_hierarchy_status === 'parent_unresolved')
    .map(node => node.id));
  const local = new Map(nodes.map(node => [node.id, []]));
  for (const unit of units) {
    const evidence = unit.evidence;
    if (!Array.isArray(evidence) || evidence.length === 0 || evidence.some(span => span.source_id !== 'task'
      || !Number.isSafeInteger(span.start) || !Number.isSafeInteger(span.end)
      || span.start < 0 || span.end <= span.start || span.end > points.length
      || points.slice(span.start, span.end).join('') !== span.quote)) continue;
    const containing = locateUnitTaskNode(nodes, evidence);
    if (!containing) continue;
    if (containing && ['B', 'R'].includes(unit.slot) && unit.status !== 'absent') local.get(containing.id).push({
      id: unit.id ?? null, slot: unit.slot, status: unit.status ?? 'unresolved', text: unit.text,
      evidence: structuredClone(unit.evidence), applicability: sectionApplicabilityUnresolved(containing.context_role)
        ? 'requires_review' : 'structural_only',
    });
  }
  return nodes.map(node => {
    const inherited = [];
    let cursor = unresolvedParents.has(node.id) ? null : parent.get(node.id);
    const visited = new Set([node.id]);
    while (cursor) {
      if (visited.has(cursor)) throw Error('TASK_NODE_ANCESTRY_CYCLE');
      visited.add(cursor);
      if (!parent.has(cursor)) throw Error('TASK_NODE_PARENT_MISSING');
      if (!sectionApplicabilityUnresolved(sections.get(cursor))) inherited.push(...(local.get(cursor) ?? [])
        .map(item => ({ ...structuredClone(item), inherited_from: cursor })));
      if (unresolvedParents.has(cursor)) break;
      cursor = parent.get(cursor);
    }
    return { ...structuredClone(node), inherited_constraints: inherited, local_constraints: structuredClone(local.get(node.id) ?? []) };
  });
}
