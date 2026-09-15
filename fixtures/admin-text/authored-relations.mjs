const evidence = quote => [{ source_id: 'task', quote }];
const variable = name => ({ var: name });
const implication = (condition, consequence) => ({ implies: [condition, consequence] });
const logic = (id, variables, formula, quote) => ({ id, variables, formula, evidence: evidence(quote) });
const annotations = {
  T018: {
    logic: [logic('unless-empty', ['input_empty', 'generate_report'], implication({ not: variable('input_empty') }, variable('generate_report')), 'Generate the report unless the input is empty')],
    note: '非空蕴含生成；不额外推断空输入时必须或禁止生成。 / Nonempty implies generation; no extra rule for empty input.'
  },
  T043: {
    logic: [logic('approval-required', ['approved', 'publish'], implication(variable('publish'), variable('approved')), '经PM-01批准后，OPS-01才能发布')],
    note: '批准是发布必要条件，不是批准即发布的充分条件。 / Approval is necessary for publishing, not a sufficient command to publish.'
  },
  T050: {
    logic: [logic('not-approved-yet', ['approved', 'release'], { all: [implication(variable('release'), variable('approved')), { not: variable('approved') }] }, 'PM-01 approve之后再release；现在未批准')],
    note: '未批准是明确原文状态；约束不产生执行授权。 / Not approved is explicit source state; constraints grant no authority.'
  },
  T061: {
    logic: [logic('test-branches', ['tests_pass', 'generate_release', 'stop'], { all: [implication(variable('tests_pass'), variable('generate_release')), implication({ not: variable('tests_pass') }, variable('stop'))] }, '如果测试通过，则生成release.zip；否则停止')],
    note: '保留if/else，不固定测试真假，不把可满足见证当真实测试结果。 / Preserve branches without deciding tests; SAT witness is not a test result.'
  },
  T062: {
    scopes: [{ id: 'conditional-supply', description: 'WP1批准条件下的data.json供给；能否供给WP2未确定 / Approval-dependent supply to WP2 is undetermined', identity_status: 'unresolved', evidence: evidence('WP1若批准则生成data.json；WP2读取data.json') }],
    handoffs: [{ id: 'WP1-to-WP2', producer_stage: 'WP1', consumer_stage: 'WP2', artifact_type: 'file', identity_status: 'unresolved', declared_outputs: ['data.json'], required_inputs: ['data.json'], external_inputs: [], scope_id: 'conditional-supply', evidence: evidence('WP1若批准则生成data.json；WP2读取data.json') }],
    note: '条件供给仅为候选，不视为无条件available；未确定scope不得计算为交接满足。 / Conditional supply is not unconditional availability; unresolved scope must not yield satisfied handoff.'
  },
  T063: {
    handoffs: [{ id: 'WP2-to-WP1', producer_stage: 'WP2', consumer_stage: 'WP1', artifact_type: 'file', identity_status: 'resolved', declared_outputs: ['b.json'], required_inputs: ['b.json'], external_inputs: [], evidence: evidence('WP2生成b.json。WP1读取b.json') }],
    note: '显式生成和读取同名载荷支持声明交接，不由编号生成先后依赖。 / Explicit production and consumption support declared handoff, not ordering inferred from stage numbers.'
  },
  T065: {
    scopes: [{ id: 'environment-A', description: 'A环境 / Environment A', identity_status: 'resolved', evidence: evidence('A环境允许更新') }, { id: 'environment-B', description: 'B环境 / Environment B', identity_status: 'resolved', evidence: evidence('B环境禁止更新') }],
    target_sets: [{ id: 'A-update', scope_id: 'environment-A', universe: 'source-named-environments', effect: 'update', actor_scope: 'unspecified', guard_context: 'A环境允许更新', identity_status: 'resolved', requested: ['A环境'], forbidden: [], evidence: evidence('A环境允许更新') },
      { id: 'B-update', scope_id: 'environment-B', universe: 'source-named-environments', effect: 'update', actor_scope: 'unspecified', guard_context: 'B环境禁止更新', identity_status: 'resolved', requested: [], forbidden: ['B环境'], evidence: evidence('B环境禁止更新') }],
    note: '许可与禁令保留各自环境，不跨scope拼接为冲突；不构成现实许可。 / Keep permission/prohibition in their own environments; no cross-scope conflict or real authorization.'
  },
  T066: {
    logic: [logic('approval-branches', ['approved', 'publish', 'request_clarification'], { all: [implication(variable('approved'), variable('publish')), implication({ not: variable('approved') }, variable('request_clarification'))] }, 'If approval is granted, publish; otherwise request clarification')],
    note: '原文if与otherwise分别编码，审批真值未知。 / Encode stated if/otherwise branches; approval truth unknown.'
  },
  T068: {
    logic: [logic('emergency-exception', ['emergency_approval', 'deploy'], implication(variable('deploy'), variable('emergency_approval')), 'Do not deploy except when emergency approval is explicitly provided')],
    note: '例外是部署必要条件，不产生审批或部署义务。 / Exception is necessary for deployment, not an approval fact or deployment duty.'
  },
  T069: {
    logic: [logic('source-status-branches', ['tests_pass', 'deliver', 'return_unresolved'], { all: [implication(variable('tests_pass'), variable('deliver')), implication({ not: variable('tests_pass') }, variable('return_unresolved'))] }, '若tests pass则交付；否则return unresolved')],
    note: 'return_unresolved只表示原文分支命题，不改系统状态。 / return_unresolved is a source proposition, not a system-state override.'
  },
  T086: {
    logic: [logic('completion-needs-confirmation', ['complete', 'qa_confirms'], implication(variable('complete'), variable('qa_confirms')), 'The task is complete only when QA-01 confirms the supplied test evidence')],
    note: 'only when编码必要条件，不声称QA已确认。 / only when is necessity, not observed QA confirmation.'
  },
  T089: {
    logic: [logic('completion-needs-pass', ['complete', 'qa_confirms_pass'], implication(variable('complete'), variable('qa_confirms_pass')), 'QA确认pass才算完成')],
    note: '确认pass是完成必要条件，QA身份不在逻辑中强行确定。 / Pass confirmation is necessary; logic does not resolve QA identity.'
  },
  T112: {
    logic: [logic('completion-needs-schema', ['complete', 'test_schema_valid'], implication(variable('complete'), variable('test_schema_valid')), '只有test.json满足Schema才算完成')],
    handoffs: [{ id: 'DEV-to-QA-patch', producer_stage: 'DEV-01', consumer_stage: 'QA-01', artifact_type: 'file', identity_status: 'resolved', declared_outputs: ['patch.diff'], required_inputs: ['patch.diff'], external_inputs: [], evidence: evidence('DEV-01读取spec.md并生成patch.diff；QA-01读取patch.diff并输出test.json') }],
    note: '阶段标签使用原文责任方，声明patch交接；不证明真实生成或测试通过。 / Stage labels use explicit task owners; declared patch handoff does not prove actual production or passing tests.'
  },
  T119: {
    logic: [logic('handoff-needs-evidence', ['handoff_to_pm', 'evidence_complete'], implication(variable('handoff_to_pm'), variable('evidence_complete')), '只有test evidence齐全才交PM-01 review')],
    note: '证据齐全是交接必要条件，不推断已齐全或已交接。 / Complete evidence is necessary for handoff, not evidence of actual completeness or handoff.'
  }
};

export function addAuthoredRelations(input) {
  const draft = structuredClone(input);
  const annotation = annotations[draft.binding.case_id];
  if (!annotation) return draft;
  const candidate = draft.allowed_answers[0];
  for (const [kind, items] of Object.entries(annotation)) {
    if (kind === 'note') continue;
    if (kind === 'scopes') candidate.scopes = structuredClone(items);
    else candidate.constraints[kind] = structuredClone(items);
  }
  draft.author_notes += ` RELATION_DRAFT 0.1.0: ${annotation.note}`;
  return draft;
}
