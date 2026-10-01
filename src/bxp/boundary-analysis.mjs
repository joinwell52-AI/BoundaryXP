import { digest } from './evaluate.mjs';

const prompts = {
  I: ['输入对象、来源和适用范围', 'input objects, sources and scope'],
  O: ['交付产物及交付位置', 'deliverables and their location'],
  A: ['允许执行的动作及对象', 'permitted actions and their targets'],
  P: ['责任主体和分工；权限须有显式依据', 'responsible participants and roles; authority needs explicit evidence'],
  R: ['时间起点、期限及资源限制', 'time anchor, deadline and resource limits'],
  V: ['依据的名称、版本与可核验内容', 'reference identity, version and verifiable content'],
  C: ['可检验的完成与停止条件', 'verifiable completion and stopping criteria'],
  B: ['禁止事项及适用范围', 'prohibitions and their scope'],
};
const overlaps = (left, right) => (left.source_id ?? 'task') === (right.source_id ?? 'task')
  && left.start < right.end && right.start < left.end;

export function analyzeValidatedBoundary(task, model, result, normalizedResult) {
  const coverage = Object.entries(task.elements).map(([slot, bucket]) => ({
    slot, semantic_status: bucket.status,
    entries: bucket.entries.map(entry => ({ entry_id: entry.id, text: entry.text,
      evidence: structuredClone(entry.evidence),
      related_constraints: model.constraint_nodes.filter(node => node.evidence.some(span => entry.evidence.some(item => overlaps(span, item))))
        .map(node => ({ id: node.id, kind: node.kind, status: node.status })),
      compilation_status: 'semantic_mapping_unverified',
    })),
  }));
  const findings = [...result.findings, ...(normalizedResult?.findings ?? [])];
  const conflicts = [...new Map(findings.filter(item => item.status === 'conflict').map(item => [digest(item), structuredClone(item)])).values()];
  const pending = model.constraint_nodes.filter(node => node.status !== 'evaluated').map(node => ({
    stage: 'constraint_evaluation', code: node.reason, constraint_ids: [node.id],
    evidence: structuredClone(node.evidence),
  }));
  for (const diagnostic of model.time_normalization?.diagnostics ?? []) pending.push({
    stage: 'time_normalization', ...structuredClone(diagnostic),
    evidence: structuredClone(model.constraint_nodes.find(node => node.id === diagnostic.constraint_id)?.evidence ?? []),
  });
  const invalid = findings.filter(item => item.status === 'invalid');
  const localStatus = invalid.length || normalizedResult?.evaluation.validation === 'invalid' ? 'invalid'
    : conflicts.length ? 'conflict'
      : pending.length ? 'undetermined'
        : model.constraint_nodes.length ? 'no_conflict_detected' : 'not_evaluated';
  const questions = coverage.filter(bucket => task.profile.required_elements.includes(bucket.slot) && bucket.semantic_status !== 'resolved')
    .map(bucket => ({ kind: 'task_clarification', slot: bucket.slot, code: `CLARIFY_${bucket.slot}`,
      evidence: bucket.entries.flatMap(entry => entry.evidence),
      zh: `请确认${prompts[bucket.slot][0]}；当前提取状态为${bucket.semantic_status === 'absent' ? '未识别' : '尚未明确'}，不等于原文必然缺失。`,
      en: `Confirm ${prompts[bucket.slot][1]}; current extraction is ${bucket.semantic_status}, which does not prove omission from the source.` }));
  for (const conflict of conflicts) questions.push({ kind: 'constraint_conflict', code: conflict.code,
    evidence: structuredClone(conflict.evidence ?? []),
    zh: `请核对以下原文中相互冲突的要求，填写最终采用的约束及依据（${conflict.code}）。`,
    en: `Review the conflicting requirements quoted below and specify the intended constraints and basis (${conflict.code}).` });
  return { coverage, conflicts, revision_questions: questions,
    calculation_gaps: pending, calculation_errors: structuredClone(invalid),
    compilation: { entries: coverage.reduce((count, bucket) => count + bucket.entries.length, 0),
      verified_semantic_mappings: 0, typed_constraints: model.constraint_nodes.length,
      evaluated_constraints: model.constraint_nodes.filter(node => node.status === 'evaluated').length,
      limitation: 'Evidence overlap is a navigation link, not a verified semantic mapping.' },
    local_constraint_status: localStatus,
    boundary_determined: false };
}
