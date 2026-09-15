import { buildAuthoredDraft } from './authored-io-drafts.mjs';

const groups = {
  L2_SOFTWARE_AI: {
    T021: { source: 'DEV-01克隆demo仓库并检查main分支。', fields: { I: ['demo仓库', 'main分支'], A: ['克隆demo仓库', '检查main分支'], P: ['DEV-01'] }, note: '克隆与检查分离；目的路径未指定，不补造。 / Separate clone and inspect; no invented destination path.' },
    T022: { source: 'QA-01评审设计文档design.md。', fields: { I: ['设计文档design.md'], A: ['评审设计文档design.md'], P: ['QA-01'] }, note: '设计评审，不假定交付评审或审批通过。 / Design review, not inferred delivery review or approval.' },
    T023: { source: 'PM-01评审。', fields: { A: ['评审'], P: ['PM-01'] }, unresolved: ['A'], note: '对象缺失，review帧待澄清；PM不推定产品经理。 / Missing review object; frame unresolved; no inferred PM occupation.' },
    T024: { source: 'OPS-01仅部署到staging环境。', fields: { A: ['仅部署到staging环境'], P: ['OPS-01'] }, note: 'staging是部署目标而非输入文件；保留仅，不扩展production。 / staging is the deployment destination; retain only, never expand to production.' },
    T025: { source: '李研评估model-a的准确率，不训练新模型。', fields: { I: ['model-a'], A: ['评估model-a的准确率'], P: ['李研'], B: ['不训练新模型'] }, note: '评估不等于训练；不伪造测量值。 / Evaluation is not training; no invented measured score.' },
    T026: { source: 'Build the package without publishing it.', fields: { A: ['Build the package without publishing it.'], B: ['Build the package without publishing it.'] }, note: '构建要求与不得发布同时保留；包标识和独立交付未指定。 / Preserve build requirement and no-publish limit; package identity and separate deliverable unspecified.' },
    T027: { source: 'Evaluate model-a on eval.json, then record the measured score.', fields: { I: ['model-a', 'eval.json'], O: ['the measured score'], A: ['Evaluate model-a on eval.json', 'then record the measured score'] }, note: '测量结果未知，不填准确率数值；顺序保留。 / Measured value unknown; preserve order without inventing accuracy.' },
    T028: { source: 'Review.', fields: { A: ['Review'] }, unresolved: ['A'], note: '缺对象、主体和语境，不选择具体行业帧。 / Missing object, actor and context; no selected industry frame.' },
    T029: { source: 'DEV-01修复bug-17，然后run unit tests。', fields: { I: ['bug-17'], A: ['修复bug-17', '然后run unit tests'], P: ['DEV-01'] }, note: '保留修复后测试；不假定测试成功。 / Fix then test; no assumed test success.' },
    T030: { source: 'OPS-01 rollback staging；禁止touch production。', fields: { A: ['rollback staging'], P: ['OPS-01'], B: ['禁止touch production'] }, note: '回滚目标staging；生产禁令独立。 / Rollback targets staging; production prohibition stays separate.' }
  },
  L3_IDENTITY: {
    T031: { source: 'DEV-01修改登录接口。', fields: { I: ['登录接口'], A: ['修改登录接口'], P: ['DEV-01'] }, note: '明确职员代号；此文字草稿尚未完成包引用身份标注。 / Explicit employee code; package-reference annotation still pending.' },
    T032: { source: '小王检查登录接口。', fields: { I: ['登录接口'], A: ['检查登录接口'], P: ['小王'] }, unresolved: ['P'], note: '共享别名，不选择首个员工；完整候选ID集待补。 / Shared alias, never first-match; full candidate IDs still need annotation.' },
    T033: { source: '开发部的小王修改接口。', fields: { I: ['接口'], A: ['修改接口'], P: ['开发部的小王'] }, note: '部门是显式消歧证据，不去掉部门或猜另一员工。 / Department is explicit disambiguation evidence; do not discard it or guess another employee.' },
    T034: { source: '陈旧查看归档报告。', fields: { I: ['归档报告'], A: ['查看归档报告'], P: ['陈旧'] }, note: 'inactive身份仍可识别，不变成active或执行授权。 / Inactive identity remains identifiable, not active or authorized.' },
    T035: { source: '新来的赵工检查日志。', fields: { I: ['日志'], A: ['检查日志'], P: ['新来的赵工'] }, unresolved: ['P'], note: '名册无记录，保留称呼，不发明employee_id。 / No directory record; retain source name, no invented employee ID.' },
    T036: { source: 'QA-01 runs the regression tests.', fields: { I: ['the regression tests'], A: ['runs the regression tests'], P: ['QA-01'] }, note: '明确QA-01代号，不以岗位代替主体。 / Explicit QA-01 identifier, not inferred occupation.' },
    T037: { source: 'Xiao Wang reviews the patch.', fields: { I: ['the patch'], A: ['reviews the patch'], P: ['Xiao Wang'] }, unresolved: ['P'], note: '共享英文别名，不能依排序消歧。 / Shared English alias cannot be resolved by ordering.' },
    T038: { source: 'OLD-01 reads the historical report.', fields: { I: ['the historical report'], A: ['reads the historical report'], P: ['OLD-01'] }, note: 'inactive不抹掉身份，也不证明允许执行。 / Inactive does not erase identity or establish execution permission.' },
    T039: { source: '小李evaluate model-a。', fields: { I: ['model-a'], A: ['evaluate model-a'], P: ['小李'] }, note: '唯一称呼不需要推造行业岗位；role_ref为空保持为空。 / Unique name does not require an invented industry role; empty role_ref stays empty.' },
    T040: { source: 'DEV-01交给小王 review。', fields: { A: ['交给小王 review'], P: ['DEV-01', '小王'] }, unresolved: ['A', 'P'], note: 'DEV-01为移交方，小王为歧义接收者；移交载荷和review对象未指明。 / DEV-01 is sender; Xiao Wang is ambiguous recipient; payload and review object missing.' }
  },
  ROLES_AUTHORITY: {
    T041: { source: 'PM-01负责协调，DEV-01负责实现。', fields: { A: ['协调', '实现'], P: ['PM-01负责协调', 'DEV-01负责实现'] }, note: '职责来自负责语句，不把PM解作产品经理。 / Duties come from explicit assignments, not an inferred product-manager title.' },
    T042: { source: 'QA-01是接收人，DEV-01发送测试包。', fields: { I: ['测试包'], O: ['测试包'], A: ['发送测试包'], P: ['QA-01是接收人', 'DEV-01发送测试包'] }, note: 'QA接收，DEV发送；不新增文件创建要求。 / QA receives, DEV sends; no new file creation requirement.' },
    T043: { source: '经PM-01批准后，OPS-01才能发布。', fields: { A: ['经PM-01批准后，OPS-01才能发布'], P: ['PM-01', 'OPS-01'] }, unresolved: ['A'], note: 'PM是条件中的批准人，OPS是条件发布主体；批准是否发生未知。 / PM is conditional approver, OPS conditional publisher; approval occurrence unknown.' },
    T044: { source: '管理员可以部署，所以这次立即部署。', fields: { A: ['管理员可以部署，所以这次立即部署'], P: ['管理员'] }, unresolved: ['P'], note: '保留原文推论但不采纳为真实授权；管理员身份未给定。 / Record the stated inference without granting authorization; administrator identity missing.' },
    T045: { source: '让开发工程师处理这个问题。', fields: { I: ['这个问题'], A: ['处理这个问题'], P: ['开发工程师'] }, unresolved: ['I', 'P'], note: '岗位不是唯一职员；问题指代未落地。 / Occupation is not a unique employee; issue reference unresolved.' },
    T046: { source: 'PM-01 coordinates the work; QA-01 reviews the evidence.', fields: { I: ['the work', 'the evidence'], A: ['coordinates the work', 'reviews the evidence'], P: ['PM-01 coordinates the work', 'QA-01 reviews the evidence'] }, note: '分别绑定协调与评审职责，不混入岗位推定。 / Bind coordination and review separately without inferred job titles.' },
    T047: { source: 'OPS-01 is an SRE. No deployment approval is supplied.', fields: { P: ['OPS-01 is an SRE'] }, unresolved: ['P'], note: '只有岗位陈述，无本次任务分工；缺审批不等于禁止部署。 / Occupation only, no task assignment; absent approval is not an explicit prohibition.' },
    T048: { source: 'Send the package to the reviewer after approval.', fields: { I: ['the package'], O: ['the package to the reviewer after approval'], A: ['Send the package to the reviewer after approval'], P: ['the reviewer'] }, unresolved: ['O', 'A', 'P'], note: '审批条件未知，reviewer接收者未知；不补发送人。 / Approval and reviewer identity unknown; do not invent sender.' },
    T049: { source: 'DEV-01是developer，但本任务只负责review。', fields: { A: ['本任务只负责review'], P: ['DEV-01是developer，但本任务只负责review'] }, unresolved: ['A'], note: '本次只评审，不因岗位增加实现职责；评审对象缺失。 / Review-only task despite developer occupation; review object missing.' },
    T050: { source: 'PM-01 approve之后再release；现在未批准。', fields: { A: ['PM-01 approve之后再release；现在未批准'], P: ['PM-01'] }, unresolved: ['A', 'P'], note: 'PM为批准方，发布主体未知；原文明示未批准，不输出授权。 / PM is approver; publisher unknown; approval explicitly absent, no authorization.' }
  }
};

const annotations = Object.fromEntries(Object.entries(groups).flatMap(([category, cases]) => Object.entries(cases).map(([id, annotation]) => [id, { ...annotation, category }])));
export const DOMAIN_DRAFT_CASE_IDS = Object.freeze(Object.keys(annotations));
export function authorDomainReviewDraft(input) {
  const annotation = annotations[input.binding?.case_id];
  return buildAuthoredDraft(input, annotation, '0.1.0', annotation?.category);
}
