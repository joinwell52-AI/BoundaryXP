import { CORE_ELEMENTS } from '../../src/bxp/index.mjs';
import { assert } from '../../src/product/contracts.mjs';

export const IO_DRAFT_VERSION = '0.1.0';

const annotations = {
  T001: {
    source: 'DEV-01读取需求.md并生成设计.md。',
    fields: { I: [['需求.md', '读取需求.md', '读取对象 / Read input']],
      O: [['设计.md', '生成设计.md', '创建产物 / Created artifact']],
      A: [['读取', '读取需求.md', '读取要求 / Read requirement'], ['生成', '生成设计.md', '生成要求 / Create requirement']],
      P: [['DEV-01', 'DEV-01读取需求.md并生成设计.md', '本句执行主体，不赋予现实授权 / Task actor, not execution authorization']] },
    note: '不得补完成条件 / Do not invent completion conditions.'
  },
  T002: {
    source: 'QA-01读取DEV-01生成的report.json。',
    fields: { I: [['report.json', 'DEV-01生成的report.json', '被读取的已有载荷；DEV-01是被提及的生成者 / Read payload with a mentioned producer']],
      A: [['读取', 'QA-01读取DEV-01生成的report.json', '当前要求读取；不是要求QA生成 / Current read requirement, not QA creation']],
      P: [['QA-01', 'QA-01读取', '当前读取主体 / Current reader'], ['DEV-01', 'DEV-01生成的report.json', '被提及的生成者，不是新增任务委派 / Mentioned producer, not a new assignment']] },
    note: 'O缺失；不把修饰关系变成当前生成动作 / No stated output; the modifier is not a new create action.'
  },
  T003: {
    source: 'DEV-01把report.csv发送给QA-01。',
    fields: { I: [['report.csv', '把report.csv发送给QA-01', '发送载荷 / Transfer payload']],
      O: [['report.csv', 'report.csv发送给QA-01', '交付已有载荷给接收者，不是创建文件 / Transfer existing payload, not create a file']],
      A: [['发送', '发送给QA-01', '发送要求 / Send requirement']],
      P: [['DEV-01', 'DEV-01把report.csv发送给QA-01', '发送主体 / Sender'], ['QA-01', '发送给QA-01', '接收者，不是发送执行者 / Recipient, not sender']] },
    note: '没有阶段契约，不虚构typed handoff / No stage contract; do not invent a typed handoff.'
  },
  T004: {
    source: 'OPS-01打印deploy.log。',
    fields: { I: [['deploy.log', '打印deploy.log', '打印内容，不是待创建同名文件 / Print input, not a file to create']],
      A: [['打印', '打印deploy.log', '打印要求；介质未指定 / Print requirement; medium unspecified']],
      P: [['OPS-01', 'OPS-01打印deploy.log', '打印主体 / Print actor']] },
    note: '未指定独立交付物；不补打印机、纸张或完成条件 / No separate deliverable, printer, paper or completion condition is specified.'
  },
  T005: {
    source: 'DEV-01生成a.json或b.json，任选一种。',
    fields: { O: [['a.json或b.json，任选一种', 'a.json或b.json，任选一种', '二选一交付，不要求两个文件；尚未选定 / One alternative, not both; selection unspecified']],
      A: [['生成', '生成a.json或b.json，任选一种', '生成其中一种 / Generate one alternative']],
      P: [['DEV-01', 'DEV-01生成', '生成主体 / Generation actor']] },
    unresolved: ['O'],
    note: '备选选择保持未明确；此保守表示待独立审阅 / Preserve unresolved selection; this conservative representation needs independent review.'
  },
  T006: {
    source: 'DEV-01 creates summary.json from input.csv.',
    fields: { I: [['input.csv', 'from input.csv', '来源输入 / Source input']],
      O: [['summary.json', 'creates summary.json', '新建产物 / Created artifact']],
      A: [['creates', 'creates summary.json from input.csv', '从输入生成产物 / Create output from input']],
      P: [['DEV-01', 'DEV-01 creates', '生成主体 / Generation actor']] },
    note: '不把文件生成等同于验收停止条件 / Creation is not a stated acceptance or stopping condition.'
  },
  T007: {
    source: 'QA-01 sends results.json to PM-01.',
    fields: { I: [['results.json', 'sends results.json', '发送载荷 / Transfer payload']],
      O: [['results.json', 'results.json to PM-01', '交付已有载荷，不声称创建 / Deliver existing payload without claiming creation']],
      A: [['sends', 'sends results.json to PM-01', '发送要求 / Send requirement']],
      P: [['QA-01', 'QA-01 sends', '发送主体 / Sender'], ['PM-01', 'to PM-01', '接收者，不推定产品经理岗位 / Recipient; do not infer product-manager role']] },
    note: '接收者与载荷分离 / Keep recipient and payload separate.'
  },
  T008: {
    source: 'Read existing output.json; do not regenerate it.',
    fields: { I: [['output.json', 'existing output.json', '已有输入；文件名不决定O桶 / Existing input; filename does not determine O']],
      A: [['Read', 'Read existing output.json', '读取要求 / Read requirement']],
      B: [['do not regenerate it', 'Read existing output.json; do not regenerate it.', 'it指向output.json；禁止重新生成 / it refers to output.json; regeneration is forbidden']] },
    note: '未明确执行人，不补主体；保留禁止指代上下文 / No actor supplied; retain prohibition antecedent context.'
  },
  T009: {
    source: 'DEV-01读取input.csv，then create summary.json。',
    fields: { I: [['input.csv', '读取input.csv', '输入 / Input']],
      O: [['summary.json', 'create summary.json', '创建产物 / Created artifact']],
      A: [['读取', '读取input.csv', '先读取 / Read first'], ['create', 'then create summary.json', '随后生成；不编造阶段ID / Then create; do not invent stage IDs']],
      P: [['DEV-01', 'DEV-01读取input.csv，then create summary.json', '两个动作共用明确主体 / Explicit shared actor for both actions']] },
    note: '保留跨语言次序，不补未提供的typed阶段关系 / Preserve mixed-language order without invented typed stage identities.'
  },
  T010: {
    source: '把build.log send to QA-01；不要创建新文件。',
    fields: { I: [['build.log', '把build.log send to QA-01', '发送载荷 / Transfer payload']],
      O: [['build.log', 'build.log send to QA-01', '交付已有载荷 / Deliver existing payload']],
      A: [['send', 'send to QA-01', '发送动作，发送人未指明 / Send action; sender unspecified']],
      P: [['QA-01', 'to QA-01', '只声明接收者，不补发送人 / Recipient only; no invented sender']],
      B: [['不要创建新文件', '不要创建新文件', '禁止创建，与发送分离 / Prohibit creation separately from sending']] },
    unresolved: ['P'],
    note: '接收者已知但发送主体缺失 / Recipient known, sending actor unspecified.'
  }
};

export const IO_DRAFT_CASE_IDS = Object.freeze(Object.keys(annotations));

export function authorIoReviewDraft(input) {
  return buildAuthoredDraft(input, annotations[input.binding?.case_id], IO_DRAFT_VERSION, 'IO');
}

export function buildAuthoredDraft(input, annotation, version, category) {
  const draft = structuredClone(input);
  assert(annotation && annotation.source === draft.binding.source.text && draft.binding.category === category,
    'AUTHOR_SOURCE', 'Authored draft requires the exact original case and source.');
  assert(draft.allowed_answers === null && draft.author_notes === '' && draft.review_status === 'PENDING'
    && draft.independent_review_verified === false, 'AUTHOR_EXISTING', 'Existing annotation or review state must not be overwritten.');
  const kinds = { I: 'input', O: 'output', A: 'action', P: 'actor', R: 'resource', V: 'reference', C: 'completion', B: 'prohibition' };
  const elements = Object.fromEntries(CORE_ELEMENTS.map(field => {
    const rows = annotation.fields[field] ?? [];
    const unresolved = annotation.unresolved?.includes(field);
    return [field, { status: !rows.length ? 'absent' : unresolved ? 'unresolved' : 'resolved',
      ...(unresolved ? { reason_codes: ['UNSPECIFIED'] } : {}),
      entries: rows.map((row, index) => {
        if (row && typeof row === 'object' && !Array.isArray(row)) return { id: `${field}-${index + 1}`, kind: kinds[field], ...structuredClone(row) };
        const [text, quote, interpretation] = typeof row === 'string' ? [row, row, annotation.note] : row;
        return { id: `${field}-${index + 1}`, kind: kinds[field], text, evidence: [{ source_id: 'task', quote }], interpretation };
      }) }];
  }));
  draft.allowed_answers = [{ schema: 'boundx-extraction-candidate/v1', prepare_id: draft.binding.prepare_id,
    source_digest: draft.binding.source_digest, context_digest: draft.binding.context_digest, elements,
    constraints: { intervals: [], target_sets: [], handoffs: [], dependencies: [], logic: [], ...structuredClone(annotation.constraints ?? {}) },
    producer: { producer_kind: 'structured-replay', adapter_version: version, model_id: 'unknown' }, clarifications: [] }];
  draft.author_notes = `AUTHOR_DRAFT ${version}; Codex-authored, not independently reviewed. ${annotation.note} 主体按原文保留，包引用仅依显式作者配置；身份、typed关系和BXP预期仍待独立审阅。 Preserve source participants; pack references require explicit author configuration. Identity, typed relations and expected BXP results still need independent review.`;
  return draft;
}
