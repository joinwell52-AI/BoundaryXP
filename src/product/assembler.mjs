import { CORE_ELEMENTS, taskSchema, PROTOCOL_VERSION, digest, evaluateBxpTask } from '../bxp/index.mjs';
import { IDS, assert, validateProduct } from './contracts.mjs';
import { locateEvidence } from './evidence.mjs';
import { hasUniqueEmployeeMention, matchEmployees } from './employees.mjs';

export function resolveSemanticReference(entries, reference) {
  const { kind, ...identity } = reference;
  const matches = entries.filter(value => {
    const { kind: storedKind, ...storedIdentity } = value.reference;
    return (!kind || kind === value.kind) && digest(storedIdentity) === digest(identity);
  });
  assert(matches.length, 'UNKNOWN_REFERENCE', 'Candidate references an entry outside its prepared context.');
  assert(matches.length === 1, 'AMBIGUOUS_REFERENCE', 'Entry ID occurs in multiple semantic kinds; specify kind.');
  return matches[0];
}

export function evaluateCandidate(service, candidateInput, { historical = false } = {}) {
  try {
    const candidate = validateProduct(IDS.candidate, candidateInput);
    const prepared = service.load(candidate.prepare_id);
    assert(candidate.source_digest === prepared.source_digest && candidate.context_digest === prepared.context_digest, 'SNAPSHOT_DIGEST', 'Candidate does not echo its original prepared snapshot.');
    const stale = prepared.packs.some(reference => !service.registry.active().some(active => digest(active) === digest(reference)));
    assert(!stale || historical, 'STALE_PREPARE', 'Package activation changed; prepare again or explicitly replay history.');
    const sources = { task: prepared.source.text };
    for (const source of prepared.sources) {
      assert(source.id !== 'task' && !Object.hasOwn(sources, source.id), 'SOURCE_REFERENCE', 'Duplicate source identity.');
      sources[source.id] = source.text;
    }
    const provenance = [];
    for (const field of CORE_ELEMENTS) {
      const bucket = candidate.elements[field];
      for (const entry of bucket.entries) {
        for (const reference of entry.semantic_refs ?? []) {
          const item = resolveSemanticReference(prepared.entries, reference);
          if (item.kind === 'employee') {
            const directory = { employees: prepared.entries.filter(value => value.kind === 'employee').map(value => value.entry) };
            const quotes = entry.evidence.map(locator => locateEvidence(sources, locator).quote).join('\n');
            const matches = matchEmployees(quotes, directory);
            assert(matches.some(employee => employee.employee_id === item.entry.employee_id), 'IDENTITY_EVIDENCE', 'Directory identity requires source evidence.');
            const explicit = matches.filter(employee => quotes.includes(employee.display_name) || (employee.department && quotes.includes(employee.department)));
            assert(bucket.status !== 'resolved' || matches.length === 1 || hasUniqueEmployeeMention(quotes, item.entry, directory)
              || (explicit.length === 1 && explicit[0].employee_id === item.entry.employee_id), 'IDENTITY_AMBIGUOUS', 'Shared alias cannot be silently reduced to a single identity.');
          }
        }
        if ((entry.candidate_ids?.length ?? 0) > 1) assert(bucket.status === 'unresolved', 'CANDIDATE_AMBIGUOUS', 'Multiple interpretations must remain unresolved.');
        provenance.push({ element: field, entry_id: entry.id, semantic_refs: entry.semantic_refs ?? [], candidate_ids: entry.candidate_ids ?? [], interpretation: entry.interpretation ?? null });
      }
    }
    const convert = value => {
      if (Array.isArray(value)) return value.map(convert);
      if (!value || typeof value !== 'object') return value;
      if (Object.hasOwn(value, 'quote')) return locateEvidence(sources, value);
      return Object.fromEntries(Object.entries(value).filter(([key]) => !['semantic_refs', 'candidate_ids', 'interpretation'].includes(key)).map(([key, child]) => [key, convert(child)]));
    };
    const task = { schema: taskSchema.properties.schema.const, protocol_version: PROTOCOL_VERSION,
      task_id: candidate.prepare_id, source: prepared.source, profile: prepared.profile,
      elements: convert(candidate.elements), constraints: convert(candidate.constraints),
      extensions: { 'org.boundx.producer': { producer: candidate.producer, prepare_id: candidate.prepare_id,
        context_digest: candidate.context_digest, packs: prepared.packs, rules: prepared.rules.version,
        candidate_digest: digest(candidate), provenance } },
      ...(prepared.sources.length ? { sources: prepared.sources } : {}), ...(candidate.scopes ? { scopes: convert(candidate.scopes) } : {}) };
    const result = evaluateBxpTask(task);
    assert(result.evaluation.validation === 'valid', 'BXP_INVALID', 'Candidate could not be assembled into valid BXP; no valid task result is returned.');
    return { schema: 'boundx-producer-result/v1', computed: true, historical: stale, diagnostics: prepared.diagnostics,
      task, result, task_digest: digest(task), result_digest: digest(result), clarifications: candidate.clarifications };
  } catch (error) {
    return { schema: 'boundx-producer-result/v1', computed: false,
      diagnostics: [{ code: error.code ?? 'PRODUCER_ERROR', message: error.message }], task: null, result: null };
  }
}

export function renderThreeLayers(sourceText, evaluation) {
  const lines = ['### 任务边界检查', '', '- **【Layer 1：原文证据】**', '', ...sourceText.split('\n').map(line => '  > ' + line), '',
    '- **【Layer 2：标准 7+1 结构化映射】**'];
  const labels = { I: '输入范围', O: '交付结果', A: '允许动作', P: '责任分工', R: '资源约束', V: '版本依据', C: '完成条件', B: '禁止边界' };
  const englishLabels = { I: 'Input scope', O: 'Deliverables', A: 'Actions', P: 'Participants', R: 'Resources', V: 'Version and provenance', C: 'Completion and stopping', B: 'Forbidden boundary' };
  const states = { resolved: '已明确 / Resolved', unresolved: '尚未明确 / Unresolved', absent: '原文未提供 / Absent' };
  if (evaluation.computed) for (const field of CORE_ELEMENTS) {
    const bucket = evaluation.task.elements[field];
    lines.push(`  - **${field === 'B' ? '+1 / B' : field} (${labels[field]})**：${states[bucket.status]}；${englishLabels[field]}`);
    for (const entry of bucket.entries) {
      lines.push(`    - ${entry.text}`);
      for (const evidence of entry.evidence) lines.push(`      - 原文证据 / Evidence：${evidence.source_id ?? 'task'} [${evidence.start},${evidence.end}) — ${JSON.stringify(evidence.quote)}`);
    }
  } else lines.push('  - 候选未通过生产者校验；不补造合法7+1结构。 / Candidate validation failed; no valid structure is invented.');
  lines.push('- **【Layer 3：计算结果与建议】**', '  - **引擎求值**：');
  if (evaluation.computed) {
    const axes = evaluation.result.evaluation;
    lines.push(`    - validation=${axes.validation}；completeness=${axes.completeness}；consistency=${axes.consistency}`);
    lines.push(`    - 差集 / Deficit：S_required \\ S_resolved = {${evaluation.result.deficit.map(item => item.element).join(', ')}}`);
    if (evaluation.historical) lines.push('    - 历史快照回放 / Historical snapshot replay：不代表当前启用包的检查结果。 / Not an evaluation against currently active packages.');
    for (const [kind, values] of Object.entries(evaluation.result.calculations)) {
      lines.push(`    - ${kind}：${values.length ? JSON.stringify(values) : '无适用计算 / No applicable calculation'}`);
    }
    lines.push('  - **结论与 Diff**：');
    for (const { element, status } of evaluation.result.deficit) lines.push(`    - **Diff [-${element}]**：${states[status]}；请明确该项要求和原文依据。 / Clarify this requirement and its source evidence.`);
    for (const finding of evaluation.result.findings) {
      lines.push(`    - **Diff [${finding.code}]**：${finding.message}`);
      for (const assumption of finding.assumptions ?? []) lines.push(`      - 计算前提 / Assumption：${assumption}`);
    }
    for (const clarification of evaluation.clarifications ?? []) lines.push(`    - 待澄清建议 / Clarification proposal：${clarification}`);
    if (!evaluation.result.deficit.length && !evaluation.result.findings.length) lines.push('    - 当前已提交结构未发现缺项或冲突；不等于原文语义完整性证明。 / No gaps or conflicts found in the submitted structure; extraction completeness is not proven.');
  } else lines.push('    - 尚未计算 / Not computed。', '  - **结论与 Diff**：', ...evaluation.diagnostics.map(item => `    - **Diff [${item.code}]**：${item.message}`));
  lines.push('    - 建议不等于业务裁决或执行授权；未列出问题不证明全文无遗漏。 / Advice is not a business decision or execution authorization; omissions may remain.');
  return lines.join('\n');
}
