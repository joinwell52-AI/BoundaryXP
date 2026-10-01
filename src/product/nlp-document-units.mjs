import { analyzeDocumentStructure } from './nlp-document.mjs';
import { normalizedSectionTitle } from './task-nodes.mjs';
import { clauseModality, documentLiteralBlockSpans, documentStructureSpans } from './nlp-syntax.mjs';
import { codePointOffsets } from './codepoint-offsets.mjs';

const actionStart = /^(?:(?:请|只|仅|必须|应当|需要|须)\s*|(?:only|please|must|shall)\s+)?(?:写明|注明|记录|写|编写|实施|生成|创建|新建|新增|修改|改写|同步更新|更新|删除|删|保留|检查|核对|提交|运行|执行|交付|实现|补充|验证|重构|迁移|部署|回滚|发布|训练|微调|检索|调用|修(?=\s)|write\b|create\b|add\b|update\b|sync\b|synchronize\b|check\b|submit\b|run\b|execute\b|implement\b|verify\b|refactor\b|migrate\b|review\b|deploy\b|restart\b|rollback\b|publish\b|replace\b|remove\b|delete\b|audit\b|scan\b|train\b|fine[- ]tune\b|evaluate\b|extract\b|collect\b|validate\b|test\b|build\b|configure\b|stop\b)/iu;
const actionLabelOnly = /^(?:(?:实现|实施|执行|部署|验证)(?:策略|方案|计划|方法|步骤)|补充规则(?:[（(][^）)]{0,100}[）)])?|additional rules(?:\s*\([^)]{0,100}\))?)\s*[:：]$/iu;
const labeledAction = /[:：]\s*(?:新增|新建|删除|改写|实现|补齐|同步|更新|创建|交付|验证|编写|完成|重构|迁移|部署|回滚|发布|训练|微调|add\b|implement\b|create\b|update\b|verify\b|refactor\b|migrate\b|review\b|deploy\b|rollback\b|publish\b|replace\b|remove\b|delete\b|train\b|fine[- ]tune\b)/iu;
const negativeAcceptanceBehavior = /(?:不|永不)\s*(?:raise|warn|throw|delete|remove|overwrite)\b|\b(?:must not|never|does not|do not)\s+(?:raise|warn|throw|delete|remove|overwrite)\b/iu;
const explicitNegativeOperation = /不(?:新增|创建|自动(?:后台)?轮询|持久化|发布|部署|执行|触发|写入|写|关闭)|\b(?:do not|does not|never|will not)\s+(?:add|create|persist|deploy|publish|execute|trigger|write|poll|close)\b/iu;
const conditionalActionLead = /^(?:(?:如果|若|当|仅在|仅当|只有|除非)|(?:only\s+)?(?:if|when|unless|after)\b|provided that\b)[^，,；;\n]*?(?:[，,]\s*(?:(?:则|那么|就)\s*|then\s+)?|(?:则|那么|就)\s*|\bthen\s+)|^[^，,；;\n]{1,60}(?:成功|完成|通过)后[，,]\s*/iu;
const quantifiedArtifactAction = /^(?:每(?:个|份|项|条|一(?:个|份|项|条))[^，,。；;\n]{1,80}?(?:各自|分别)?\s*(?:起|写|编写|创建|生成|提交)一份[^，,。；;\n]{0,100}(?:草稿|大纲|文档|报告|文件|清单|方案|outline\b|draft\b|report\b)|for\s+(?:each|every)\s+[^,.;\n]{1,80},\s*(?:create|write|produce|submit)\s+(?:a|an)\s+[^.;\n]{0,100}\b(?:draft|outline|document|report|plan|checklist)\b)/iu;
const resourceMetadataOnly = /^(?:优先级|风险等级|priority|risk(?:[_ -]?level)?)\s*[:：]\s*(?:P[0-3]|low|medium|high|irreversible|低|中|高|不可逆)\s*[。.!！]?$/iu;
const stripStep = value => value.replace(/^(?:步骤|step)\s*\d+\s*[:：·.-]\s*/iu, '');

function explicitDeliverableFileChange(quote) {
  const description = quote.match(/`[^`\r\n]+`[^：:\r\n]{0,120}[:：]([\s\S]*)/u)?.[1];
  if (!description) return false;
  return [...description.matchAll(/(?:补充|补齐|补|追加|新增|重写|改写|更新|记录|修订|创建|删除|迁移|同步|\badd\b|\bupdate\b|\brewrite\b|\brecord\b|\bremove\b)/giu)]
    .some(match => !/(?:不|勿|禁止|不得|不要|无需|\b(?:do not|must not|never)\s*)$/iu.test(
      description.slice(Math.max(0, match.index - 12), match.index)));
}

function explicitMixedWorkChange(prose) {
  return [...prose.matchAll(/(?:统一升到|去掉|重写|新增|补充|追加|明确|标为|加(?=\s|["“])|改写|更新|替换)/gu)]
    .some(match => !/(?:不|勿|禁止|不得|不要|无需)\s*$/u.test(prose.slice(Math.max(0, match.index - 8), match.index)));
}

function referencesCurrentTaskScope(quote, text) {
  if (!/(?:\bstrict\s+scope\b|严格范围|严禁|不得|不允许)/iu.test(quote)) return false;
  const references = [...quote.matchAll(/(?:\bthis\s+|本\s*)(TASK(?:-[A-Za-z0-9]+)*)\b/giu)]
    .map(match => match[1].toUpperCase());
  if (!references.length) return /本任务/u.test(quote);
  const taskId = text.match(/^#{1,6}\s+(TASK-[A-Za-z0-9-]+)\s*$/mu)?.[1];
  return references.every(referencedId => {
    if (referencedId === 'TASK') return true;
    if (!taskId) return false;
    const currentId = taskId.toUpperCase();
    if (referencedId === currentId) return true;
    if (referencedId.split('-').length >= 3 && currentId.startsWith(`${referencedId}-`)) return true;
    const sequence = currentId.match(/^TASK-(?:\d{8}-)?([A-Z0-9]+)(?:-|$)/u)?.[1];
    return referencedId === `TASK-${sequence}`;
  });
}

function threeColumnEvidence(quote, start) {
  const match = quote.match(/^(\s*\|)([^|]+)(\|)([^|]+)(\|)([^|]+)(\|\s*)$/u);
  if (!match) return null;
  const cells = [match[2], match[4], match[6]];
  if (cells.some(cell => !cell.trim())) return null;
  let prefix = match[1];
  return cells.map((cell, index) => {
    const trimmed = cell.trim();
    const leading = cell.match(/^\s*/u)[0];
    const cellStart = start + [...prefix, ...leading].length;
    prefix += cell + match[3 + index * 2];
    return { source_id: 'task', start: cellStart, end: cellStart + [...trimmed].length, quote: trimmed };
  });
}

function twoColumnEvidence(quote, start) {
  const match = quote.match(/^(\s*\|)([^|]+)(\|)([^|]+)(\|\s*)$/u);
  if (!match || !match[2].trim() || !match[4].trim()) return null;
  const first = match[2], second = match[4];
  const firstStart = start + [...match[1], ...first.match(/^\s*/u)[0]].length;
  const secondStart = start + [...match[1], ...first, ...match[3], ...second.match(/^\s*/u)[0]].length;
  return [
    { source_id: 'task', start: firstStart, end: firstStart + [...first.trim()].length, quote: first.trim() },
    { source_id: 'task', start: secondStart, end: secondStart + [...second.trim()].length, quote: second.trim() },
  ];
}

function adoptedDecisionRows(blocks, sections, points) {
  const adopted = new Map();
  for (const section of sections) {
    const heading = points.slice(section.start, section.heading_end).join('');
    if (section.kind !== 'body' || !/(?:决议\s*\d+|decision\s*\d+)/iu.test(heading)) continue;
    let optionIndex = 0, choices = null;
    for (const block of blocks.filter(item => item.start >= section.start && item.start < section.end)) {
      if (block.tableRow) {
        const quote = block.text.trimEnd();
        const cells = twoColumnEvidence(quote, block.start);
        if (cells && /^(?:方案|option|alternative)$/iu.test(cells[0].quote)
          && /^(?:评判|评价|assessment|evaluation)$/iu.test(cells[1].quote)) {
          choices = [];
          optionIndex = 0;
        } else if (choices && !/^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/u.test(quote) && cells) {
          optionIndex += 1;
          if (/^[✅✔]/u.test(cells[0].quote)) choices.push({ index: optionIndex,
            evidence: { source_id: 'task', start: block.start, end: block.start + [...quote].length, quote } });
        }
        continue;
      }
      const adoption = block.text?.trim().match(/^(?:采用方案|adopt option|choose option)\s*(\d+)\b/iu);
      if (adoption && choices?.length === 1 && choices[0].index === Number(adoption[1])) {
        adopted.set(block.start, choices[0].evidence);
      }
      choices = null;
    }
  }
  return adopted;
}

export function documentSemanticUnits(text) {
  const offsets = codePointOffsets(text);
  const structure = analyzeDocumentStructure(text);
  const headings = structure.sections;
  if (headings.length === 0 && !/[\r\n]/u.test(text)) return null;
  const sections = headings.length ? headings : [{ start: 0, heading_end: 0, end: offsets[text.length],
    kind: 'body', conditions: [], synthetic: true }];
  const points = [...text], frontmatter = documentStructureSpans(text).find(span => span.kind === 'frontmatter');
  const comments = documentLiteralBlockSpans(text).filter(span => span.kind === 'comment');
  const indentedCode = documentLiteralBlockSpans(text).filter(span => span.kind === 'indented_code');
  const blocks = [];
  let current = null, fence = null, literal = null;
  const finish = () => { if (current) blocks.push(current); current = null; };
  const finishLiteral = () => { if (literal) blocks.push(literal); literal = null; };
  const lines = [];
  for (const line of text.matchAll(/[^\r\n]+(?:\r?\n|$)|\r?\n/gu)) {
    const lineStart = offsets[line.index], lineEnd = offsets[line.index + line[0].length];
    let cursor = lineStart;
    for (const comment of comments.filter(span => span.start < lineEnd && span.end > lineStart)) {
      const commentStart = Math.max(comment.start, lineStart), commentEnd = Math.min(comment.end, lineEnd);
      if (cursor < commentStart) lines.push({ start: cursor, text: points.slice(cursor, commentStart).join('') });
      lines.push({ start: commentStart, text: points.slice(commentStart, commentEnd).join(''), comment: true });
      cursor = commentEnd;
    }
    if (cursor < lineEnd) {
      const fragment = points.slice(cursor, lineEnd).join('');
      const leading = cursor > lineStart ? [...fragment.match(/^\s*/u)[0]].length : 0;
      if (cursor + leading < lineEnd) lines.push({ start: cursor + leading,
        text: points.slice(cursor + leading, lineEnd).join('') });
    }
  }
  for (const line of lines) {
    const { start, text: value } = line, trimmed = value.trim();
    const code = indentedCode.find(span => start >= span.start && start < span.end);
    if (code) {
      finish(); finishLiteral();
      if (start === code.start) blocks.push({ start, text: points.slice(code.start, code.end).join(''), literal: true });
      continue;
    }
    if (frontmatter && start < frontmatter.end) { finish(); finishLiteral(); continue; }
    if (line.comment) {
      finish(); finishLiteral(); blocks.push({ start, text: value, literal: true }); continue;
    }
    const marker = trimmed.match(/^(`{3,}|~{3,})/u)?.[1];
    if (fence) {
      literal.text += value;
      if (marker && marker[0] === fence[0] && marker.length >= fence.length
        && trimmed.slice(marker.length) === '') {
        fence = null;
        finishLiteral();
      }
      continue;
    }
    if (marker) {
      finish(); finishLiteral();
      fence = marker;
      literal = { start, text: value, literal: true };
      continue;
    }
    if (/^\s*>/u.test(value)) {
      finish();
      if (!literal) literal = { start, text: '', literal: true };
      literal.text += value;
      continue;
    }
    finishLiteral();
    if (!trimmed) {
      finish();
      if (blocks.at(-1)?.tableRow) blocks.push({ separator: true });
      continue;
    }
    if (/^ {0,3}(?:(?:-[ \t]*){3,}|(?:\*[ \t]*){3,}|(?:_[ \t]*){3,})\r?\n?$/u.test(value)) {
      finish(); blocks.push({ separator: true }); continue;
    }
    const sectionHeading = sections.find(item => start >= item.start && start < item.heading_end);
    if (sectionHeading) {
      finish();
      if (start !== sectionHeading.start) continue;
      const originalTitle = trimmed.replace(/^#{1,6}\s+/u, '').replace(/\*\*|__/gu, '');
      const title = stripStep(originalTitle);
      const planStep = sectionHeading.kind === 'plan' && /^(?:步骤|step|phase)\s*\d+\s*[:：·.-]/iu.test(originalTitle);
      if (planStep || actionStart.test(title) && !actionLabelOnly.test(title)
        && !['plan', 'deliverable', 'resource'].includes(sectionHeading.kind)
        || /(?:决议\s*\d+|decision\s*\d+)/iu.test(title) && explicitNegativeOperation.test(title)) {
        blocks.push({ start, text: value, planStep });
      }
      continue;
    }
    if (/^\s*\|/u.test(value)) {
      finish();
      blocks.push({ start, text: value, tableRow: true });
      continue;
    }
    if (/^\s*(?:#{1,6}\s|[-*+]\s|\d+[.)、]\s)/u.test(value)) finish();
    if (current && /^\s*[-*+]\s/u.test(current.text) && !/^\s/u.test(value)) finish();
    if (current && /[.!?。！？；;]$/u.test(current.text.trimEnd())
      && !(/^\s*(?:[-*+]\s|\d+[.)、]\s)/u.test(current.text)
        && /^\s{2,}\S/u.test(value))) finish();
    if (!current) current = { start, text: value };
    else current.text += value;
  }
  finish(); finishLiteral();
  const adoptedRows = adoptedDecisionRows(blocks, sections, points);
  const adoptedChoiceStarts = new Set([...adoptedRows.values()].map(item => item.start));
  const units = [], diagnostics = frontmatter ? [{ code: 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED',
    evidence: [{ source_id: 'task', start: frontmatter.start, end: frontmatter.end,
      quote: points.slice(frontmatter.start, frontmatter.end).join('') }] }] : [];
  const metadata = frontmatter ? points.slice(0, frontmatter.end).join('') : '';
  const declaredType = metadata.match(/^type:[ \t]*([^\r\n]+)$/mu)?.[1].trim() ?? null;
  const taskMetadata = declaredType === 'TASK' || declaredType === null
    && /^protocol:[ \t]*fcop[ \t]*$/mu.test(metadata)
    && /^sender:[ \t]*[^\r\n]+$/mu.test(metadata)
    && /^recipient:[ \t]*[^\r\n]+$/mu.test(metadata)
    && /^subject:[ \t]*[^\r\n]+$/mu.test(metadata);
  if (frontmatter && taskMetadata) {
    for (const match of text.matchAll(/^recipient:[ \t]*([^\r\n]+)$/gmu)) {
      const start = offsets[match.index], end = offsets[match.index + match[0].length];
      if (end > frontmatter.end || !match[1].trim()) continue;
      units.push({ slot: 'P', text: match[0], evidence: [{ source_id: 'task', start, end, quote: match[0] }],
        scope: null, kind: 'document_recipient_candidate' });
    }
  }
  const conditional = /(?:如果|除非|仅当|仅在|只有|若|(?:当|在)[^，,。；;\n]{1,60}(?<!小)时|后\s*再|^[^，,；;\n]{1,60}(?:成功|完成|通过)后[，,]|\bif\b|\bwhen\b|\bunless\b|\buntil\b|\bprovided that\b|^(?:only\s+)?after\b)/iu;
  const explicitDuration = /(?:\d+(?:\.\d+)?\s*(?:秒|分钟|小时|天|工作日)\s*内|不超过\s*\d+(?:\.\d+)?\s*(?:秒|分钟|小时|天|工作日)|\bwithin\s+\d+(?:\.\d+)?\s+(?:seconds?|minutes?|hours?|days?)\b)/iu;
  let introduction = null;
  let outputIntroduction = null;
  let inventoryIntroduction = null;
  let refusalIntroduction = null;
  let numberedActionTable = false;
  let decisionMappingTable = false;
  let currentDeferredHeader = null;
  let outlineHeader = null;
  let deferredTableHeader = null;
  let backgroundCompletion = null;
  const finishOutputIntroduction = () => {
    if (outputIntroduction && !outputIntroduction.used) diagnostics.push({
      code: 'DOCUMENT_OUTPUT_CONTENT_MISSING', evidence: [outputIntroduction.evidence],
    });
    outputIntroduction = null;
  };
  for (const [blockIndex, block] of blocks.entries()) {
    if (block.separator) { introduction = null; finishOutputIntroduction(); inventoryIntroduction = null;
      refusalIntroduction = null;
      numberedActionTable = false; decisionMappingTable = false;
      currentDeferredHeader = null; outlineHeader = null; deferredTableHeader = null;
      backgroundCompletion = null; continue; }
    if (block.literal || block.tableRow) { introduction = null; finishOutputIntroduction(); inventoryIntroduction = null;
      refusalIntroduction = null; }
    const section = sections.find(item => block.start >= item.start && block.start < item.end);
    if (section?.kind !== 'background' || backgroundCompletion?.section !== section.start) backgroundCompletion = null;
    const quote = block.text.trimEnd(), end = block.start + [...quote].length;
    const tableSeparator = /^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$/u;
    if (block.tableRow && blocks[blockIndex + 1]?.tableRow
      && tableSeparator.test(blocks[blockIndex + 1].text.trim())) {
      const cells = quote.split('|').slice(1, -1).map(cell => cell.replace(/\*\*|__|`/gu, '').trim());
      numberedActionTable = section?.kind === 'plan'
        && /^(?:#|步骤|序号|step|phase)$/iu.test(cells[0] ?? '')
        && /^(?:动作|任务|执行动作|action|task)$/iu.test(cells[1] ?? '');
      const tableHeading = section ? points.slice(section.start, section.heading_end).join('') : '';
      decisionMappingTable = section?.kind === 'body' && /(?:决议\s*\d+|decision\s*\d+)/iu.test(tableHeading)
        && /^(?:旧|原|old|previous)$/iu.test(cells[0] ?? '')
        && /^(?:新|替代|new|replacement)$/iu.test(cells[1] ?? '')
        && /^(?:处理|状态|action|status|disposition)$/iu.test(cells[2] ?? '');
      currentDeferredHeader = section?.kind === 'body' && /(?:决议\s*\d+|decision\s*\d+)/iu.test(tableHeading)
        && /^(?:抽象|abstraction)$/iu.test(cells[0] ?? '')
        && /^(?:v\d+(?:\.\d+)?\s*最小冻结内容|current scope)$/iu.test(cells[1] ?? '')
        && /^(?:留给\s*v\d+(?:\.x)?|deferred scope)$/iu.test(cells[2] ?? '')
        ? { source_id: 'task', start: block.start, end: block.start + [...quote].length, quote } : null;
      outlineHeader = section?.kind === 'body'
        && /(?:核心轮廓预览|(?:charter|document) outline|交付纲要)/iu.test(tableHeading)
        && /^(?:§|section)$/iu.test(cells[0] ?? '') && /^(?:内容|content)$/iu.test(cells[1] ?? '')
        && cells.length === 2
        ? { source_id: 'task', start: block.start, end: block.start + [...quote].length, quote } : null;
      deferredTableHeader = section?.kind === 'deferred' && cells.length === 2
        && /^(?:项|事项|item|topic)$/iu.test(cells[0] ?? '')
        && /^(?:延后到|延后安排|deferred (?:until|to)|target version)$/iu.test(cells[1] ?? '')
        ? { source_id: 'task', start: block.start, end: block.start + [...quote].length, quote } : null;
      continue;
    }
    if (block.tableRow && tableSeparator.test(quote.trim())) continue;
    if (!block.tableRow) { numberedActionTable = false; decisionMappingTable = false;
      currentDeferredHeader = null; outlineHeader = null; deferredTableHeader = null; }
    const evidence = [{ source_id: 'task', start: block.start, end, quote }];
    const heading = section ? points.slice(section.start, section.heading_end).join('') : '';
    const headingTitle = normalizedSectionTitle(heading.replace(/^#{1,6}\s*/u, '')
      .split(/\r?\n/u)[0].replace(/\*\*|__/gu, '').replace(/[ \t]+#+[ \t]*$/u, '').trim());
    const riskSection = /^(?:风险与边界|风险|risks? and boundaries|risks? and constraints)$/iu.test(headingTitle);
    const mixedWorkSection = /^(?:任务|要做的事)\s*\/\s*deliverables?$/iu.test(headingTitle);
    if (section?.kind === 'background') {
      if (block.literal) { backgroundCompletion = null; continue; }
      const statement = quote.replace(/\*\*|__/gu, '').trim();
      if (/^(?:完成(?:本|该)任务后|after (?:completing|completion of) (?:this|the) task)\s*[:：]$/iu.test(statement)) {
        backgroundCompletion = { section: section.start, evidence: evidence[0] };
        continue;
      }
      if (backgroundCompletion && /^\s*[-*+]\s/u.test(quote)) {
        const candidateEvidence = [evidence[0], backgroundCompletion.evidence];
        units.push({ slot: 'C', text: quote, evidence: candidateEvidence,
          kind: 'document_background_completion_candidate',
          scope: { id: `document-section-${section.start}`, status: 'unresolved',
            description: 'Completion claim in background requires applicability review',
            evidence: [{ source_id: 'task', start: section.start, end: section.heading_end, quote: heading }] } });
        diagnostics.push({ code: 'DOCUMENT_BACKGROUND_COMPLETION_REQUIRES_REVIEW', evidence: candidateEvidence });
        continue;
      }
      backgroundCompletion = null;
      if (!block.literal && referencesCurrentTaskScope(quote, text)) {
        units.push({ slot: 'B', text: quote, evidence, kind: 'document_background_scope_candidate',
          scope: { id: `document-section-${section.start}`, status: 'unresolved',
            description: 'Explicit scope statement inside background requires applicability review',
            evidence: [{ source_id: 'task', start: section.start, end: section.heading_end, quote: heading }] } });
        diagnostics.push({ code: 'DOCUMENT_BACKGROUND_SCOPE_REQUIRES_REVIEW', evidence });
      }
      continue;
    }
    if (block.literal) {
      diagnostics.push({ code: 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED', evidence });
      continue;
    }
    const prose = quote.replace(/`[^`]*`/gu, ' TARGET ').replace(/\*\*|__/gu, '')
      .replace(/^\s*(?:#{1,6}\s+|[-*+]\s+(?:\[[ xX]\]\s*)?|\d+[.)、]\s*)/u, '').trim();
    const releaseScheduleNarrative = /\b(?:v\d+(?:\.\d+)?\s*(?:ship|release)|release\s+v\d+(?:\.\d+)?)\b|v\d+(?:\.\d+)?\s*(?:上线|发布)/iu.test(prose)
      && /\bD\+\d+\b|延期|推迟|\b(?:delay|postpone|shift)\b/iu.test(prose);
    const taskReleaseDeadline = /(?:本\s*(?:TASK|任务)|this task)[^。;；\n]{0,100}(?:\bby\s+D\+\d+|D\+\d+\s*(?:前|以内|之内|之前)|截止|deadline)/iu.test(prose);
    const repositoryScope = /(?:本\s*TASK|this task)\s*(?:(?:runs?|100%)\s*)?(?:在|within)\s*TARGET\s*(?:仓内|repository)\s*(?:发生|执行|完成|运行|takes place|runs)?/iu.test(prose);
    const isList = /^\s*(?:[-*+]\s|\d+[.)、]\s)/u.test(quote);
    const reviewRejection = isList && /^\s*[-*+]\s*❌\s*.+(?:→|->)\s*(?:拒收?|reject)(?:\s|[（(]|$)/iu.test(quote);
    const planRow = block.tableRow && section?.kind === 'plan'
      && (/^\s*\|\s*(?:R\d+|Round\s*\d+|Phase\s*\d+|第\s*\d+\s*轮)\s*\|[^|]+\|/iu.test(quote)
        || numberedActionTable && /^\s*\|\s*\d+\s*\|[^|]+\|/u.test(quote));
    const decisionRow = block.tableRow && decisionMappingTable
      && /^\s*\|\s*(?:ADR-\d+|[—–-])(?:[^|]*)\|[^|]+\|[^|]+\|\s*$/iu.test(quote);
    const decisionDeferred = decisionRow && quote.split('|').slice(2, -1)
      .some(cell => /延后|\bdefer(?:red)?\b/iu.test(cell));
    const currentDeferredCells = block.tableRow && currentDeferredHeader
      ? threeColumnEvidence(quote, block.start) : null;
    const currentDeferredRow = Boolean(currentDeferredCells);
    const deferredCells = block.tableRow && deferredTableHeader ? twoColumnEvidence(quote, block.start) : null;
    const deferredRow = Boolean(deferredCells);
    const outlineCells = block.tableRow && outlineHeader ? quote.split('|').slice(1, -1) : [];
    const outlineRow = outlineCells.length === 2 && outlineCells.every(cell => cell.trim());
    const tableLabel = block.tableRow ? quote.match(/^\s*\|\s*([^|]+)\|[^|]+\|/u)?.[1]
      ?.replace(/\*\*|__|`/gu, '').trim() : null;
    const labeledTableSlot = /^(?:下一步动作|执行动作|next actions?|action required)$/iu.test(tableLabel ?? '') ? 'A' : null;
    if (introduction?.section !== section?.start || !isList) introduction = null;
    if (outputIntroduction?.section !== section?.start || !isList) finishOutputIntroduction();
    if (inventoryIntroduction?.section !== section?.start || !isList) inventoryIntroduction = null;
    if (refusalIntroduction?.section !== section?.start || !isList) refusalIntroduction = null;
    if (!isList && section?.kind === 'scope'
      && /^(?:候选(?:工具)?清单|candidate (?:tool )?list)(?:[（(][^）)]{0,100}[）)])?\s*[:：]$/iu.test(prose)) {
      inventoryIntroduction = { section: section.start, evidence: evidence[0] };
      units.push({ slot: 'I', text: quote, evidence, kind: 'document_candidate_inventory_introduction',
        scope: { id: `document-section-${section.start}-inventory-${block.start}`, status: 'unresolved',
          description: 'Candidate inventory; item applicability and completeness require review',
          evidence: [{ source_id: 'task', start: section.start, end: section.heading_end, quote: heading }] } });
      continue;
    }
    const decisionOutputList = section?.kind === 'body'
      && /^(?:决议\s*\d+|decision\s*\d+)/iu.test(headingTitle)
      && /(?:schema|模式|规范|spec|文档|document)/iu.test(headingTitle);
    if (decisionOutputList && !isList && /^(?:each\s+schema|每(?:份|个)\s*(?:schema|模式)|structure|结构)\s*[:：]$/iu.test(prose)) {
      outputIntroduction = { section: section.start, evidence: evidence[0], used: false };
      diagnostics.push({ code: 'DOCUMENT_OUTPUT_INTRODUCTION', evidence: structuredClone(evidence) });
      continue;
    }
    const refusalLead = !isList && section?.kind === 'scope' && conditional.test(prose)
      && /[:：]$/u.test(prose) && /(?:直接|一律|必须)拒绝|\b(?:refuse|reject)\b/iu.test(prose);
    if (!isList && conditional.test(prose) && /[:：]$/u.test(prose)
      && !clauseModality(prose).prohibited && !refusalLead) {
      introduction = { section: section?.start, evidence: evidence[0] };
      diagnostics.push({ code: 'DOCUMENT_CONDITION_INTRODUCTION', evidence: structuredClone(evidence) });
      continue;
    }
    const applicability = [...(section?.conditions ?? []), ...(introduction ? [introduction.evidence] : [])];
    evidence.push(...applicability);
    if (refusalLead) {
      introduction = { section: section.start, evidence: evidence[0] };
      refusalIntroduction = { section: section.start, evidence: evidence[0] };
    }
    if (outputIntroduction) { evidence.push(outputIntroduction.evidence); outputIntroduction.used = true; }
    const inventoryItem = isList && inventoryIntroduction && /^\s*[-*+]\s+`[^`\r\n]+`/u.test(quote);
    if (inventoryItem) evidence.push(inventoryIntroduction.evidence);
    if (outlineRow) evidence.push(outlineHeader);
    const actionProse = stripStep(prose.replace(conditionalActionLead, ''));
    const quantifiedOutput = isList && ['plan', 'scope', 'deliverable', 'body'].includes(section?.kind)
      && quantifiedArtifactAction.test(actionProse);
    const statusTransition = isList && section?.kind === 'plan'
      && /^(?:status|状态)\s*(?:起手|初始|先(?:设|置)|starts?\s+(?:as|at)|initially)(?=\s|[:：])/iu.test(actionProse)
      && /(?:后(?:再)?(?:改|更新|变更)|\bafter\b[^.;\n]{0,80}\b(?:change|update|set)\b)/iu.test(actionProse);
    const inlineDeferred = /(?:不是|不属于)\s*(?:本\s*)?TASK\s*(?:的)?范围|\boutside (?:the )?scope of (?:this )?task\b/iu.test(prose)
      || /^(?!请|必须|应当|需要|要求|写明|注明|说明|记录)[^，,。；;\n]{1,80}留给后续[^，,。；;\n]*[。.]?$/u.test(prose)
      || /^(?!please\b|must\b|shall\b|write\b|document\b)[^.;\n]{1,80}\b(?:is|are)\s+(?:left|deferred)\s+(?:to|for)\s+(?:a\s+)?(?:later|future|follow-up)\b[^.;\n]*[.]?$/iu.test(prose);
    const slots = new Set();
    if (section?.kind === 'deferred') slots.add('B');
    else {
      if (section?.kind === 'completion') slots.add('C');
      if (section?.kind === 'deliverable') slots.add('O');
      if (section?.kind === 'deliverable' && isList && explicitDeliverableFileChange(quote)) slots.add('A');
      if (mixedWorkSection && isList && explicitMixedWorkChange(prose)) slots.add('A');
      if (section?.kind === 'resource' && !resourceMetadataOnly.test(prose) && !repositoryScope) slots.add('R');
      if (repositoryScope) slots.add('I');
      if (inventoryItem) slots.add('I');
      if (refusalLead || isList && refusalIntroduction) slots.add('B');
      if (/^(?:只|仅)(?:冻结|纳入|实现|处理|覆盖)[^。；;\n]{1,200}[:：]?$|^only\s+(?:freeze|include|implement|process|cover)\b[^.;\n]{1,200}[:：]?$/iu.test(prose)) slots.add('A');
      if (section?.kind === 'scope' && /^(?:参考|参照|依照)[^。；;\n]+[，,]\s*(?:写|编写|实施|生成|创建|交付)/iu.test(prose)) slots.add('A');
      if ((section?.kind === 'scope' || decisionOutputList) && outputIntroduction && isList) slots.add('O');
      if (section?.kind === 'scope' && /(?:除外|排除|不包括|\bexcept\b|\bexcluding\b)/iu.test(prose)) slots.add('B');
      if (reviewRejection) slots.add('B');
      if (section?.kind === 'scope' && /(?:^|[，,])\s*(?:写|编写|生成|创建)一份[^。；;]*(?:指南|文档|报告|规范|计划|guide\b|report\b)/iu.test(prose)) slots.add('O');
      if (section?.kind === 'scope' && /^(?:write|create|produce)\s+(?:a|an|the)\s+[^.;\n]*\b(?:guide|document|report|plan)\b/iu.test(prose)) slots.add('O');
      if (section?.kind === 'scope' && /^(?:use|follow|refer to)\s+TARGET\s+as (?:a |the )?(?:template|reference)[^.;\n]*\b(?:write|create|produce)\b/iu.test(prose)) {
        slots.add('A');
        slots.add('O');
      }
      if (planRow) { slots.add('A'); slots.add('O'); }
      if (decisionRow) slots.add(decisionDeferred ? 'B' : 'A');
      if (currentDeferredRow) { slots.add('O'); slots.add('B'); }
      if (outlineRow) slots.add('O');
      if (labeledTableSlot) slots.add(labeledTableSlot);
      if (block.planStep) {
        slots.add('A');
        if (/^(?:写|编写|生成|创建|交付|write\b|create\b)/iu.test(actionProse)) slots.add('O');
      }
      if (quantifiedOutput) { slots.add('A'); slots.add('O'); }
      if (/^(?:新建|创建|生成|编写)\s*[:：]\s*TARGET\b/iu.test(actionProse)) slots.add('O');
      if (section?.kind === 'plan' && isList && /^(?:内容|content)\s*[:：]/iu.test(prose)) slots.add('O');
      if (section?.kind === 'plan' && /^(?:工具|命令|tool|command)\s*[:：]\s*\S/iu.test(prose)) slots.add('A');
      if (/^(?:输入|输入范围|参考材料|input|inputs)\s*[:：]/iu.test(prose) || /^(?:输入范围|输入材料|Inputs?)(?=$|[\s:：（(])/iu.test(headingTitle)) slots.add('I');
      if (/^(?:输出格式|输出|交付物|交付结果|产物|output format|outputs?|deliverables?)\s*[:：]/iu.test(prose)) slots.add('O');
      if (/^(?:依据|遵循|根据|according to\b|in accordance with\b)/iu.test(prose)) slots.add('V');
      if (/(?:必须|应当|must|shall)\s*(?:honor|遵循|遵守|依照|按照|follow|comply with)\s*§\s*[\w.]+/iu.test(prose)) slots.add('V');
      if (clauseModality(prose).prohibited
        || explicitNegativeOperation.test(prose)
        || /不可修改|不动|不删|不改|不覆盖|永不复用|^不再(?:做|执行|继续)|^no longer (?:do|perform|execute)\b/iu.test(prose)) slots.add('B');
      if (section?.kind === 'completion' && isList && negativeAcceptanceBehavior.test(prose)) slots.add('B');
      if (/不在[^。；;\n]{1,60}(?:动|修改|删除|执行|发布|部署)/u.test(prose)) slots.add('B');
      if (isList && /^[^：:。；;\n]{1,80}\s+不(?:包含|包括|涵盖)\s+/u.test(prose)) slots.add('B');
      if (/仅允许|只允许|\bmay only\b/iu.test(prose)
        || /^(?:允许|准许|allow\b|permit\b)/iu.test(actionProse)) slots.add('A');
      if (/执行时间|截止时间|时限|预算|资源上限|execution time|deadline|budget|resource limit/iu.test(prose)
        || explicitDuration.test(prose)) slots.add('R');
      if (/才算完成|即为完成|完成条件|acceptance criteria|complete when/iu.test(prose)) slots.add('C');
      if ((statusTransition || actionStart.test(actionProse) && !actionLabelOnly.test(actionProse)
        || isList && (labeledAction.test(actionProse)
        || /[:：][^。；;\n]{0,100}(?:改写为|加一句|替换为|标注为|改为)/u.test(actionProse)))
        && section?.kind !== 'completion') slots.add('A');
      if (/(?:决议\s*\d+|decision\s*\d+)/iu.test(heading)
        && /(?:文件|文档|记录)[^。；;\n]{0,40}保留|\b(?:files?|documents?)\b[^.;\n]{0,40}\b(?:retain|retained|preserve|preserved)\b/iu.test(prose)) slots.add('A');
      if (riskSection && isList) {
        if (/只接[^\n]{0,300}(?:其余|其他)[^\n]{0,60}(?:排期|延后)|\bonly include\b[^\n]{0,300}\b(?:defer|later)\b/iu.test(prose)
          || /不能\s*break\b|\bmust not break\b/iu.test(prose)) slots.add('B');
        if ((!releaseScheduleNarrative || taskReleaseDeadline)
          && /\bD\+\d+\b|延期|推迟|\b(?:delay|postpone)\b/iu.test(prose)) slots.add('R');
        if (/必须(?:有|明写|明示|[^\n]{1,120}(?:明写|明示))|\bmust\s+(?:include|state|specify)\b/iu.test(prose)) slots.add('A');
      }
    }
    if (inlineDeferred) { slots.clear(); slots.add('B'); }
    if (outlineRow) { slots.clear(); slots.add('O'); }
    if (section?.kind === 'scope' && !isList && slots.has('O')
      && /(?:覆盖|包括|包含|\b(?:covers?|covering|includes?|including)\b)[^。；;\n]*[:：]$/iu.test(prose)) {
      outputIntroduction = { section: section.start, evidence: evidence[0], used: false };
      diagnostics.push({ code: 'DOCUMENT_OUTPUT_INTRODUCTION', evidence: structuredClone(evidence) });
    }
    const governedTemplate = !['completion', 'deferred'].includes(section?.kind)
      && quote.match(/^\s*(?:[-*+]\s+|\d+[.)、]\s+)?(?:\[[ xX]\]\s*)?(?:(?:严格(?:遵循|依照|按照|采用|执行|走)|必须(?:遵循|依照|按照|采用|执行))\s*(`[^`\r\n]+`)\s*(?:的)?\s*(?:模板|规范|标准|流程)|(?:strictly\s+(?:follow|use)|must\s+(?:follow|use))\s+(`[^`\r\n]+`)\s+(?:template|standard|policy|procedure))(?=\s|[：:，,。.;；]|$)/iu);
    if (governedTemplate) slots.add('V');
    const reference = governedTemplate || section?.kind === 'scope' && quote.match(/^\s*(?:[-*+]\s+|\d+[.)、]\s+)?(?:(?:参考|参照)\s*(`[^`\r\n]+`)(?=\s*(?:的体例|[，,]))|(?:use|follow|refer to)\s+(`[^`\r\n]+`)(?=\s+as\s+(?:a |the )?(?:template|reference)\b))/iu);
    const adoptedRow = adoptedRows.get(block.start);
    if (!slots.size && !reference && !adoptedRow || block.tableRow && section?.kind !== 'completion'
      && !planRow && !decisionRow && !currentDeferredRow && !deferredRow && !outlineRow && !labeledTableSlot) {
      if (!adoptedChoiceStarts.has(block.start)) {
        diagnostics.push({ code: 'DOCUMENT_BLOCK_SEMANTICS_UNRESOLVED', evidence });
      }
      continue;
    }
    const inlineConditional = conditional.test(prose) || statusTransition;
    if (applicability.length || inlineConditional) diagnostics.push({ code: 'DOCUMENT_APPLICABILITY_REQUIRES_REVIEW', evidence: structuredClone(evidence) });
    const scope = section && !section.synthetic ? { id: `document-section-${section.start}${introduction ? `-condition-${introduction.evidence.start}` : inlineConditional ? `-condition-${block.start}` : ''}`, status: applicability.length || inlineConditional || inventoryItem ? 'unresolved' : 'resolved',
      description: inventoryItem ? 'Candidate inventory; item applicability and completeness require review'
        : 'Textual document section; operational targets and cross-section relations are not inferred',
      evidence: [{ source_id: 'task', start: section.start, end: section.heading_end, quote: heading },
        ...applicability.filter(span => span.start !== section.start),
        ...(inlineConditional && !applicability.some(span => span.start === block.start) ? [evidence[0]] : [])] } : null;
    if (reference) {
      const referenceText = reference[1] ?? reference[2];
      const referenceStart = block.start + [...quote.slice(0, reference.index + reference[0].indexOf(referenceText))].length;
      units.push({ slot: 'I', text: referenceText, evidence: [{ source_id: 'task', start: referenceStart,
        end: referenceStart + [...referenceText].length, quote: referenceText }, ...applicability], scope,
      kind: 'document_requirement_candidate' });
    }
    if (adoptedRow) {
      units.push({ slot: 'A', text: adoptedRow.quote, evidence: [adoptedRow, ...evidence], scope,
        kind: 'document_decision_choice_candidate' });
      diagnostics.push({ code: 'DOCUMENT_DECISION_CHOICE_REQUIRES_REVIEW', evidence: [adoptedRow, ...evidence] });
    }
    for (const slot of slots) {
      const cell = currentDeferredRow && ['O', 'B'].includes(slot)
        ? currentDeferredCells[slot === 'O' ? 1 : 2] : deferredRow && slot === 'B' ? deferredCells[0] : null;
      units.push({ slot, text: cell?.quote ?? quote,
        evidence: deferredRow && cell ? [cell, deferredCells[1], deferredTableHeader, ...applicability]
          : cell ? [cell, currentDeferredCells[0], currentDeferredHeader, ...applicability] : evidence,
        scope, kind: slot === 'B' && (refusalLead || isList && refusalIntroduction)
          ? 'document_conditional_refusal_candidate'
          : inventoryItem && slot === 'I' ? 'document_candidate_inventory_item'
          : outlineRow ? 'document_outline_field_candidate'
          : slot === 'O' && outputIntroduction && isList ? 'document_output_content_candidate'
          : section?.kind === 'deferred' || inlineDeferred || decisionDeferred || cell && slot === 'B'
            ? 'document_scope_exclusion' : 'document_requirement_candidate' });
    }
  }
  finishOutputIntroduction();
  // Clause analysis has already run for *all* sections, including background.
  // Keep the existing slot mapping untouched. A retained boundary cue that has
  // no legacy unit gets an explicit diagnostic rather than a fabricated slot.
  for (const clause of structure.source_accountability.clauses) {
    if (clause.state !== 'BOUNDARY_BEARING') continue;
    const covered = units.some(unit => unit.evidence.some(e => e.source_id === 'task'
      && e.start <= clause.evidence.start && e.end >= clause.evidence.end));
    if (!covered) diagnostics.push({ code:'DOCUMENT_BOUNDARY_CLAUSE_UNPROJECTED', compiler_pass:1,
      clause_id:clause.id, reason:'Pass 1 retained boundary language; existing projection has no complete clause unit.',
      evidence:[clause.evidence], signals:clause.signals });
  }
  return { units, diagnostics, frontmatter, source_accountability:structure.source_accountability };
}
