import { buildAuthoredDraft } from './authored-io-drafts.mjs';

const annotations = {
  T011: { source: 'DEV-01必须修改登录接口。', fields: {
    I: [['登录接口', '修改登录接口', '修改目标 / Modification target']],
    A: [['必须修改', '必须修改登录接口', '必须执行的修改要求，不补产物 / Required modification, no invented deliverable']],
    P: [['DEV-01', 'DEV-01必须修改', '明确主体 / Explicit actor']] }, note: '未写验收或独立产物 / No acceptance condition or separate artifact stated.' },
  T012: { source: '允许QA-01查看日志，但不得修改日志。', fields: {
    I: [['日志', '查看日志', '查看对象 / Inspection target']],
    A: [['允许查看', '允许QA-01查看日志', '原文许可陈述，不是现实授权或强制要求 / Stated permission, not real authorization or obligation']],
    P: [['QA-01', '允许QA-01查看日志', '许可所述主体 / Actor named by permission']],
    B: [['不得修改日志', '不得修改日志', '明确禁令 / Explicit prohibition']] }, note: '许可与禁止分离 / Separate permission and prohibition.' },
  T013: { source: '无需生成周报，也不必发送通知。', fields: {
    A: [['无需生成周报', '无需生成周报', 'NOT_REQUIRED；非执行承诺、非禁止 / Not required, neither commitment nor prohibition'],
      ['不必发送通知', '不必发送通知', 'NOT_REQUIRED；不是FORBID / Not required, not forbidden']] }, note: 'O与B不从免除义务中推造 / Waived duties do not imply deliverables or prohibitions.' },
  T014: { source: '不得发布版本，也不得修改BXP协议。', fields: {
    B: [['不得发布版本', '不得发布版本', '禁止发布 / Publishing forbidden'], ['不得修改BXP协议', '不得修改BXP协议', '禁止协议修改 / Protocol modification forbidden']] }, note: '两项独立禁令，不产生正向动作 / Two prohibitions, no positive action.' },
  T015: { source: '必须备份配置，同时禁止备份配置。', fields: {
    I: [['配置', '必须备份配置', '备份对象，具体身份待明确 / Backup target, concrete identity unspecified']],
    A: [['必须备份配置', '必须备份配置', '要求备份 / Backup required']],
    B: [['禁止备份配置', '禁止备份配置', '禁止同名动作对象 / Same named action/target forbidden']] }, unresolved: ['I'], note: '保留正反陈述；没有冻结对象同一性，不冒称已计算冲突 / Preserve opposing statements; typed identity and conflict expectations need review.' },
  T016: { source: 'Do not delete the repository or publish the release.', fields: {
    B: [['delete the repository', 'Do not delete the repository or publish the release.', '禁止删除；否定支配整个并列 / Deletion forbidden; negation scopes over the coordination'],
      ['publish the release', 'Do not delete the repository or publish the release.', '禁止发布；保留完整否定证据 / Publishing forbidden; retain full negated evidence']] }, note: '两个禁止目标，不把or变成可任选执行 / Both are forbidden, not an optional allowed action.' },
  T017: { source: 'You may inspect the branch; you need not merge it.', fields: {
    I: [['the branch', 'inspect the branch', '查看对象 / Inspection target']],
    A: [['may inspect', 'You may inspect the branch', '许可而非义务 / Permission, not obligation'], ['need not merge', 'you need not merge it', 'NOT_REQUIRED，不是禁止合并 / Not required, not a merge prohibition']],
    P: [['You', 'You may inspect the branch', '第二人称主体，身份未指定 / Second-person actor without concrete identity']] }, unresolved: ['P'], note: '不推定现实执行授权 / No real execution authorization inferred.' },
  T018: { source: 'Generate the report unless the input is empty.', fields: {
    I: [['the input', 'the input is empty', '条件涉及输入，范围未指明 / Conditional input, extent unspecified']],
    O: [['the report', 'Generate the report unless the input is empty', '带例外交付，不当作无条件产物 / Conditional deliverable with exception']],
    A: [['Generate', 'Generate the report unless the input is empty', '除非输入为空；条件真值未知 / Unless input is empty; truth unknown']] }, unresolved: ['I', 'O', 'A'], note: '保留unless，不选择条件真值 / Preserve unless without deciding its truth.' },
  T019: { source: '必须run tests；禁止deploy production。', fields: {
    A: [['run tests', '必须run tests', '明确测试义务 / Explicit test requirement']],
    B: [['deploy production', '禁止deploy production', '明确生产部署禁令 / Explicit production deployment prohibition']] }, note: '测试动作不自动产生通过停止条件 / A test action does not imply a passing stop condition.' },
  T020: { source: 'No need to build；但不得delete source files。', fields: {
    A: [['No need to build', 'No need to build', 'NOT_REQUIRED，不承诺构建 / Not required; no build commitment']],
    B: [['delete source files', '不得delete source files', 'FORBID，删除源文件被禁止 / Source deletion forbidden']] }, note: '免除构建与删除禁令分离 / Separate waived build duty and deletion prohibition.' }
};

export const MODALITY_DRAFT_CASE_IDS = Object.freeze(Object.keys(annotations));
export function authorModalityReviewDraft(input) {
  return buildAuthoredDraft(input, annotations[input.binding?.case_id], '0.1.0', 'MODALITY_B');
}
